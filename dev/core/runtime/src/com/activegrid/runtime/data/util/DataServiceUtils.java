/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.activegrid.runtime.data.util;

import java.io.Serializable;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.hibernate.Session;
import org.hibernate.proxy.HibernateProxy;

import com.activegrid.runtime.data.DataServiceManagerAccess;
import com.activegrid.runtime.data.DataServiceMetaData;
import com.wavemaker.common.util.ObjectAccess;
import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.runtime.data.DataServiceRuntimeException;
import com.wavemaker.runtime.data.util.DataServiceConstants;

/**
 * 
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 * @deprecated This is now deprecated; see
 *             {@link com.wavemaker.runtime.data.util.DataServiceUtils}. This
 *             will be removed in a future release.
 */
@Deprecated
public class DataServiceUtils {

    private static final ObjectAccess objectAccess = ObjectAccess.getInstance();

    public static boolean isProxy(Class<?> clazz) {
        return HibernateProxy.class.isAssignableFrom(clazz);
    }

    public static Class<?> getEntityClass(Class<?> clazz) {

        // also see
        // HibernateProxyHelper.getClassWithoutInitializingProxy(object)

        if (isProxy(clazz)) {
            return clazz.getSuperclass();
        }
        return clazz;
    }

    public static Object loadById(Object o, Session session,
            DataServiceMetaData metaData) {
        return loadById(o, session, metaData, null);
    }

    public static Object loadById(Object originalInstance, Session session,
            DataServiceMetaData metaData, Log logger) {

        if (originalInstance == null) {
            throw new IllegalArgumentException(
                    "instance to reload cannot be null");
        }

        Class<?> clazz = originalInstance.getClass();

        String s = metaData.getIdPropertyName(clazz);

        Serializable id = (Serializable) objectAccess.getProperty(
                originalInstance, s);

        Object rtn = session.get(getEntityClass(clazz), id);

        if (logger != null && logger.isDebugEnabled()) {
            logger.debug("reloadById: " + ObjectUtils.getId(originalInstance)
                    + " " + s + ":" + id);
        }

        return rtn;
    }

    public static boolean isRelatedMany(Class<?> c) {
        return Map.class.isAssignableFrom(c)
                || Collection.class.isAssignableFrom(c);
    }

    public static Object mergeForUpdate(Object o,
            DataServiceManagerAccess mgrAccess,
            Collection<String> populatedProperties) {

        return mergeForUpdate(o,
                mgrAccess.getDataServiceManager().getSession(), mgrAccess
                        .getDataServiceManager().getMetaData(),
                populatedProperties);
    }

    public static Object mergeForUpdate(Object source, Session session,
            DataServiceMetaData metaData, Collection<String> populatedProperties) {

        // load instance from db, and copy in values from client

        // ensure id has been set
        String idPropName = metaData.getIdPropertyName(source.getClass());
        if (!populatedProperties.contains(idPropName)) {
            throw new DataServiceRuntimeException("id property \"" + idPropName
                    + "\" must be set");
        }

        Object rtn = loadById(source, session, metaData);

        if (rtn == null) {
            throw new DataServiceRuntimeException(
                    "Failed to load instance to update");
        }

        // add optimistic concurrency check here

        Collection<String> relatedPropertyNames = metaData
                .getRelPropertyNames(source.getClass());

        Collection<String> handledPropertyPrefixes = new HashSet<String>();

        for (String propertyName : populatedProperties) {

            int i = propertyName.indexOf(DataServiceConstants.PROP_SEP);
            if (i != -1) {
                propertyName = propertyName.substring(0, i);
            }

            if (handledPropertyPrefixes.contains(propertyName)) {
                continue;
            }

            Object clientValue = objectAccess.getProperty(source, propertyName);

            if (relatedPropertyNames.contains(propertyName)) {

                if (isRelatedMany(objectAccess.getPropertyType(source
                        .getClass(), propertyName))) {
                    continue;
                }

                handledPropertyPrefixes.add(propertyName);

                if (clientValue != null) {

                    String prefix = propertyName
                            + DataServiceConstants.PROP_SEP;

                    List<String> populatedPropertiesForRelated = StringUtils
                            .getItemsStartingWith(populatedProperties, prefix,
                                    true);

                    clientValue = mergeForUpdate(clientValue, session,
                            metaData, populatedPropertiesForRelated);
                }
            }

            objectAccess.setProperty(rtn, propertyName, clientValue);
        }

        return rtn;
    }
}

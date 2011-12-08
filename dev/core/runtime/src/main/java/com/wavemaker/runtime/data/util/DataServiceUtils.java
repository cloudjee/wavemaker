/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.runtime.data.util;

import java.io.File;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.criterion.MatchMode;
import org.hibernate.engine.SessionFactoryImplementor;
import org.hibernate.exception.SQLGrammarException;
import org.hibernate.proxy.HibernateProxy;
import org.hibernate.type.AssociationType;
import org.hibernate.type.Type;
import org.springframework.dao.InvalidDataAccessResourceUsageException;

import com.wavemaker.common.util.ObjectAccess;
import com.wavemaker.common.util.ObjectGraphTraversal;
import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.runtime.data.DataServiceInternal.ElementTypeFactory;
import com.wavemaker.runtime.data.DataServiceManagerAccess;
import com.wavemaker.runtime.data.DataServiceMetaData;
import com.wavemaker.runtime.data.DataServiceRuntimeException;
import com.wavemaker.runtime.service.ElementType;

/**
 * @author Simon Toens
 */
public class DataServiceUtils {

    private static final String WRAPPER_TYPE_SUFFX = "RtnType";

    private static final Properties EMPTY_PROPERTIES = new Properties();

    private static final String DEFAULT_ALIAS_PREFIX = "c";

    private static final ObjectAccess objectAccess = ObjectAccess.getInstance();

    public static RuntimeException unwrap(Throwable th) {

        th = SystemUtils.getRootException(th);

        if (InvalidDataAccessResourceUsageException.class.isAssignableFrom(th.getClass())) {
            InvalidDataAccessResourceUsageException e = (InvalidDataAccessResourceUsageException) th;
            if (e.getRootCause() != null) {
                th = e.getRootCause();
            }
        }
        if (SQLGrammarException.class.isAssignableFrom(th.getClass())) {
            SQLGrammarException s = (SQLGrammarException) th;
            if (s.getSQLException() != null) {
                th = s.getSQLException();
            } else if (s.getCause() != null) {
                th = s.getCause();
            }
        }

        if (th instanceof RuntimeException) {
            return (RuntimeException) th;
        } else {
            return new DataServiceRuntimeException(th);
        }
    }

    public static String getJavaTypeName(Type type, SessionFactory factory) {
        if (type.isCollectionType()) {
            AssociationType ass = (AssociationType) type;
            SessionFactoryImplementor fai = (SessionFactoryImplementor) factory;
            return ass.getAssociatedEntityName(fai);
        } else {
            return type.getReturnedClass().getName();
        }
    }

    public static boolean requiresResultWrapper(String queryString) {
        return queryString.trim().toLowerCase().startsWith(DataServiceConstants.SELECT_KEYWORD);
    }

    public static String queryToOperationName(String queryName) {
        return StringUtils.lowerCaseFirstLetter(queryName);
    }

    public static String operationToQueryName(String operationName, Collection<String> queryNames) {
        if (queryNames.contains(operationName)) {
            return operationName;
        }
        return StringUtils.upperCaseFirstLetter(operationName);
    }

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

    public static ObjectGraphTraversal getRelatedTraversal(ObjectGraphTraversal.ObjectVisitor visitor, final ObjectAccess objectAccess,
        final DataServiceMetaData metaData, final boolean skipToMany) {
        ObjectGraphTraversal.PropertyFactory pf = new ObjectGraphTraversal.PropertyFactory() {

            @Override
            public Collection<String> getProperties(Object o, ObjectGraphTraversal.Context ctx) {
                Class<?> entityClass = getEntityClass(o.getClass());

                if (!metaData.isEntity(entityClass)) {
                    return Collections.emptySet();
                }

                Collection<String> relPropNames = metaData.getRelPropertyNames(entityClass);

                if (!skipToMany) {
                    return relPropNames;
                } else {
                    Collection<String> rtn = new HashSet<String>();
                    for (String propertyName : relPropNames) {
                        if (!isRelatedMany(objectAccess.getPropertyType(entityClass, propertyName))) {
                            rtn.add(propertyName);
                        }
                    }
                    return rtn;
                }
            }
        };

        return new ObjectGraphTraversal(pf, visitor, objectAccess);
    }

    public static List<String> getColumnNames(int numOutputTypes, List<String> outputNames) {

        Collection<String> usedNames = new HashSet<String>(numOutputTypes);
        List<String> rtn = new ArrayList<String>(numOutputTypes);

        for (int i = 0; i < numOutputTypes; i++) {
            String name = DEFAULT_ALIAS_PREFIX + i;
            if (outputNames.size() > i) {
                name = outputNames.get(i);
                if (StringUtils.isNumber(name)) {
                    name = DEFAULT_ALIAS_PREFIX + name;
                }
            }
            name = StringUtils.getUniqueName(name, usedNames);
            usedNames.add(name);
            rtn.add(name);
        }

        return rtn;
    }

    public static boolean isOutputType(String fqName) {
        // kind of lame check: does package end with ".output?"
        return StringUtils.getPackage(fqName).endsWith(StringUtils.fq("", DataServiceConstants.OUTPUT_PACKAGE_NAME));
    }

    public static String getOutputPackage(String dataPackage) {
        return StringUtils.fq(dataPackage, DataServiceConstants.OUTPUT_PACKAGE_NAME);
    }

    public static String getOutputType(String dataPackage, String operationName) {
        return getOldOutputType(dataPackage, operationName) + WRAPPER_TYPE_SUFFX;
    }

    public static String getOldOutputType(String dataPackage, String operationName) {
        return StringUtils.fq(getOutputPackage(dataPackage), StringUtils.upperCaseFirstLetter(operationName));
    }

    public static Configuration initConfiguration(String hbConfFile) {
        return initConfiguration(hbConfFile, EMPTY_PROPERTIES);
    }

    public static Configuration initConfiguration(String hbConfFile, Properties p) {
        Configuration cfg = new Configuration().configure(hbConfFile);
        setup(cfg, p);
        return cfg;
    }

    public static Configuration initConfiguration(File hbConfFile) {
        return initConfiguration(hbConfFile, EMPTY_PROPERTIES);
    }

    public static Configuration initConfiguration(File hbConfFile, Properties p) {
        Configuration cfg = new Configuration().configure(hbConfFile);
        setup(cfg, p);
        return cfg;
    }

    @SuppressWarnings("unchecked")
    public static Properties toHibernateConnectionProperties(Properties p) {
        Properties rtn = new Properties();
        rtn.putAll(p);
        for (Iterator iter = p.entrySet().iterator(); iter.hasNext();) {
            Map.Entry entry = (Map.Entry) iter.next();
            String name = (String) entry.getKey();
            String newName = null;
            if (name.endsWith(DataServiceConstants.DB_USERNAME)) {
                newName = DataServiceConstants.HIBERNATE_USER_PROPERTY;
            } else if (name.endsWith(DataServiceConstants.DB_PASS)) {
                newName = DataServiceConstants.HIBERNATE_PASS_PROPERTY;
            } else if (name.endsWith(DataServiceConstants.DB_DRIVER_CLASS_NAME)) {
                newName = DataServiceConstants.HIBERNATE_DRIVER_CLASS_NAME_PROPERTY;
            } else if (name.endsWith(DataServiceConstants.DB_URL)) {
                newName = DataServiceConstants.HIBERNATE_CONNECTION_URL_PROPERTY;
            } else if (name.endsWith(DataServiceConstants.DB_DIALECT)) {
                newName = DataServiceConstants.HIBERNATE_DIALECT_PROPERTY;
            }

            if (newName != null && rtn.getProperty(newName) == null) {
                rtn.setProperty(newName, (String) entry.getValue());
            }
        }

        return rtn;
    }

    public static List<ElementType> getTypes(Collection<String> entities, Collection<String> otherTypes, ElementTypeFactory factory) {

        List<ElementType> rtn = new ArrayList<ElementType>(entities.size());
        for (String s : entities) {
            rtn.add(factory.getElementType(s));
        }

        // this should be handled generically by the
        // design service manager
        Collection<ElementType> els = new HashSet<ElementType>(rtn);
        for (ElementType el : els) {
            for (ElementType p : el.getProperties()) {
                if (p.isTopLevel() && !containsElementType(rtn, p)) {
                    rtn.add(p);
                }
            }
        }

        for (String s : otherTypes) {
            rtn.add(factory.getElementType(s));
        }

        return rtn;
    }

    public static boolean isDML(String query) {

        String q = query.trim().toLowerCase();

        return q.startsWith("update") || q.startsWith("insert") || q.startsWith("delete");
    }

    public static boolean isDynamicInstantiationQuery(String query) {

        return getDynamicInstantiationClassName(query) != null;
    }

    public static String getDynamicInstantiationClassName(String query) {

        String[] tokens = query.trim().split("\\s");

        if (tokens.length < 3) {
            return null;
        }

        if (!tokens[0].trim().equalsIgnoreCase(DataServiceConstants.SELECT_KEYWORD)) {
            return null;
        }

        if (!tokens[1].trim().equalsIgnoreCase("new")) {
            return null;
        }

        String s = tokens[2].trim();

        int i = s.indexOf("(");

        if (i == -1) {
            return null;
        }

        return s.substring(0, i);
    }

    public static Object loadById(Object o, Session session, DataServiceMetaData metaData) {
        return loadById(o, session, metaData, null);
    }

    public static Object loadById(Object originalInstance, Session session, DataServiceMetaData metaData, Log logger) {

        if (originalInstance == null) {
            throw new IllegalArgumentException("instance to reload cannot be null");
        }

        Class<?> clazz = getEntityClass(originalInstance.getClass());

        String s = metaData.getIdPropertyName(clazz);

        Serializable id = (Serializable) objectAccess.getProperty(originalInstance, s);

        Object rtn = session.get(clazz, id);

        if (logger != null && logger.isDebugEnabled()) {
            logger.debug("reloadById: " + ObjectUtils.getId(originalInstance) + " " + s + ":" + id);
        }

        return rtn;
    }

    public static boolean isRelatedMany(Class<?> c) {
        return Map.class.isAssignableFrom(c) || Collection.class.isAssignableFrom(c);
    }

    public static Object mergeForUpdate(Object o, DataServiceManagerAccess mgrAccess, Collection<String> populatedProperties) {

        return mergeForUpdate(o, mgrAccess.getDataServiceManager().getSession(), mgrAccess.getDataServiceManager().getMetaData(), populatedProperties);
    }

    public static Object mergeForUpdate(Object source, Session session, DataServiceMetaData metaData, Collection<String> populatedProperties) {

        // load instance from db, and copy in values from client

        // ensure id has been set
        String idPropName = metaData.getIdPropertyName(source.getClass());
        if (!populatedProperties.contains(idPropName)) {
            throw new DataServiceRuntimeException("id property \"" + idPropName + "\" must be set");
        }

        Object rtn = loadById(source, session, metaData);

        if (rtn == null) {
            throw new DataServiceRuntimeException("Failed to load instance to update");
        }

        // add optimistic concurrency check here

        Collection<String> relatedPropertyNames = metaData.getRelPropertyNames(source.getClass());

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

                if (isRelatedMany(objectAccess.getPropertyType(source.getClass(), propertyName))) {
                    continue;
                }

                handledPropertyPrefixes.add(propertyName);

                if (clientValue != null) {

                    String prefix = propertyName + DataServiceConstants.PROP_SEP;

                    List<String> populatedPropertiesForRelated = StringUtils.getItemsStartingWith(populatedProperties, prefix, true);

                    clientValue = mergeForUpdate(clientValue, session, metaData, populatedPropertiesForRelated);
                }
            }

            objectAccess.setProperty(rtn, propertyName, clientValue);
        }

        return rtn;
    }

    public static Object mergeForInsert(Object source, Session session, DataServiceMetaData metaData) {
        return mergeForInsert(source, session, metaData, true, new HashSet<Object>());
    }

    private static Object mergeForInsert(Object source, Session session, DataServiceMetaData metaData, boolean isRoot,
        Collection<Object> handledInstances) {
        if (handledInstances.contains(source)) {
            return source;
        }

        Class<?> entityClass = getEntityClass(source.getClass());
        String idPropName = metaData.getIdPropertyName(entityClass);
        Object idPropVal = objectAccess.getProperty(source, idPropName);

        if (idPropVal != null) {
            if (isRoot) {
                // MAV-2065
                return source;
            }
            Object o = loadById(source, session, metaData);
            if (o != null) {
                handledInstances.add(o);
                return o;
            }
        }

        handledInstances.add(source);

        Collection<String> relatedPropertyNames = metaData.getRelPropertyNames(source.getClass());

        for (String propertyName : relatedPropertyNames) {

            if (isRelatedMany(objectAccess.getPropertyType(source.getClass(), propertyName))) {
                continue;
            }

            Object clientValue = objectAccess.getProperty(source, propertyName);

            if (clientValue != null) {

                clientValue = mergeForInsert(clientValue, session, metaData, false, handledInstances);

                objectAccess.setProperty(source, propertyName, clientValue);
            }
        }

        return source;
    }

    // type, isList
    public static Tuple.Two<String, Boolean> getQueryType(String type) {
        Boolean isList = Boolean.FALSE;
        int i = type.indexOf("<");
        if (i > -1) {
            int j = type.indexOf(">");
            isList = Boolean.TRUE;
            type = type.substring(i + 1, j);
        }
        return Tuple.tuple(type, isList);
    }

    public static MatchMode parseMatchMode(String matchMode) {

        MatchMode rtn = null;

        if (matchMode == null) {
            throw new IllegalArgumentException("matchMode cannot be null");
        }

        if (matchMode.equalsIgnoreCase("anywhere")) {
            rtn = MatchMode.ANYWHERE;
        } else if (matchMode.equalsIgnoreCase("exact")) {
            rtn = MatchMode.EXACT;
        } else if (matchMode.equalsIgnoreCase("start")) {
            rtn = MatchMode.START;
        } else if (matchMode.equalsIgnoreCase("end")) {
            rtn = MatchMode.END;
        } else {
            throw new IllegalArgumentException("MatchMode must be " + "anywhere|exact|start|end");
        }

        return rtn;
    }

    public static Properties loadDBProperties(String resourcename) {
        return loadDBProperties(resourcename, DataServiceConstants.PROPERTIES_FILE_BASENAME_SEP);
    }

    public static Properties loadDBProperties(File file) {
        return loadDBProperties(file, DataServiceConstants.PROPERTIES_FILE_BASENAME_SEP);
    }

    private static Properties loadDBProperties(String resourcename, String sep) {
        Tuple.Two<String, String> t = getBaseName(resourcename, sep);
        Properties base = SystemUtils.loadPropertiesFromResource(t.v1 + "." + t.v2);
        Properties rtn = SystemUtils.loadPropertiesFromResource(resourcename);
        rtn.putAll(base);
        return rtn;
    }

    private static Properties loadDBProperties(File file, String sep) {

        String filepath = file.getAbsolutePath();

        Tuple.Two<String, String> t = getBaseName(filepath, sep);

        Properties rtn = new Properties();

        File basefile = new File(t.v1 + "." + t.v2);

        if (basefile.exists()) {
            rtn = SystemUtils.loadPropertiesFromFile(basefile.getAbsolutePath());
        }

        rtn.putAll(SystemUtils.loadPropertiesFromFile(filepath));

        return rtn;
    }

    private static Tuple.Two<String, String> getBaseName(String resourcename, String sep) {
        String ext = StringUtils.fromLastOccurrence(resourcename, ".");
        String s = StringUtils.fromLastOccurrence(resourcename, ".", -1);
        return Tuple.tuple(StringUtils.fromLastOccurrence(s, sep, -1), ext);
    }

    private static void setup(Configuration cfg, Properties p) {
        p = DataServiceUtils.toHibernateConnectionProperties(p);
        cfg.setProperties(p);
    }

    private static boolean containsElementType(Collection<ElementType> elementTypes, ElementType elementType) {
        for (ElementType et : elementTypes) {
            if (elementType.getJavaType().equals(et.getJavaType())) {
                return true;
            }
        }
        return false;
    }

    private DataServiceUtils() {
        throw new UnsupportedOperationException();
    }

}

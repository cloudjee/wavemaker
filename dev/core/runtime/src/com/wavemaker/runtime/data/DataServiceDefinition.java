/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.runtime.data;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import com.wavemaker.common.util.StringUtils;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.data.util.DataServiceUtils;
import com.wavemaker.runtime.data.hibernate.DataServiceMetaData_Hib;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.runtime.service.ServiceType;
import com.wavemaker.runtime.service.definition.AbstractDeprecatedServiceDefinition;
import com.wavemaker.runtime.service.definition.ReflectServiceDefinition;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 */
public class DataServiceDefinition extends AbstractDeprecatedServiceDefinition
        implements DataServiceInternal, ReflectServiceDefinition {
    
    private ElementTypeFactory elementTypeFactory =
	DEFAULT_ELEMENT_TYPE_FACTORY;

    private final DataServiceMetaData metaData;

    private SessionFactory sessionFactory = null;

    // get query meta data that Hibernate API doesn't have
    // access to
    private ExternalDataModelConfig externalConfig = null;

    private static String getName(String cfgfile) {
        cfgfile = cfgfile.replace("\\", "/");
        cfgfile = StringUtils.fromLastOccurrence(cfgfile, "/");
        return StringUtils.fromFirstOccurrence(cfgfile, ".", -1);
    }

    /**
     * Load configuration from classpath, using given resource name.
     */
    public DataServiceDefinition(String hbConfFile, Properties p,
            boolean useIndividualCRUDOperations) {
        this(getName(hbConfFile), DataServiceUtils.initConfiguration(
                hbConfFile, p), useIndividualCRUDOperations);
    }

    public DataServiceDefinition(DataServiceMetaData metaData) {
        this.metaData = metaData;
    }

    public DataServiceDefinition(String serviceName, Configuration hbcfg,
            boolean isImportDB, boolean useIndividualCRUDOperations) {
        this.metaData = new DataServiceMetaData_Hib(serviceName, hbcfg);

        try {
            this.sessionFactory = hbcfg.buildSessionFactory();
            Session session = null;
            try {
                session = sessionFactory.openSession();
                metaData.init(session, useIndividualCRUDOperations);
            } finally {
                try {
                    session.close();
                } catch (RuntimeException ignore) {
                }
            }
        } catch (RuntimeException ex) {
            if (isImportDB) {
                // the following happens during import db - so far looks like
                // it can be ignored:
                // java.lang.NullPointerException
                // at org.hibernate.mapping.PersistentClass.
                // prepareTemporaryTables(PersistentClass.java:737)
            } else {
                throw ex;
            }
        }
    }
    
    private DataServiceDefinition(String serviceName, Configuration hbcfg,
            boolean useIndividualCRUDOperations) {
        this(serviceName, hbcfg, false, useIndividualCRUDOperations);
    }

    public void setExternalConfig(ExternalDataModelConfig externalConfig) {
        this.externalConfig = externalConfig;
    }

    public DataServiceMetaData getMetaData() {
        return metaData;
    }

    public void setElementTypeFactory(ElementTypeFactory elementTypeFactory) {
        this.elementTypeFactory = elementTypeFactory;
    }

    public List<ElementType> getInputTypes(String operationName) {

        DataServiceOperation op = metaData.getOperation(operationName);

        List<String> inputNames = op.getInputNames();
        List<String> inputTypes = op.getInputTypes();
        List<Boolean> inputIsList = op.getInputIsList();

        List<ElementType> rtn = new ArrayList<ElementType>(inputTypes.size());

        for (int i = 0; i < inputTypes.size(); i++) {
            ElementType et = DEFAULT_ELEMENT_TYPE_FACTORY
                    .getElementType(inputTypes.get(i));
            et.setName(inputNames.get(i));
            et.setList(inputIsList.get(i));
            rtn.add(et);
        }

        return rtn;
    }

    public List<String> getOperationNames() {
        return new ArrayList<String>(metaData.getOperationNames());
    }

    public ElementType getOutputType(String operationName) {

        DataServiceOperation op = metaData.getOperation(operationName);

        String outputType = op.getOutputType();

        if (outputType == null) {
            return null;
        }

        ElementType rtn = DEFAULT_ELEMENT_TYPE_FACTORY
                .getElementType(outputType);
        rtn.setName("rtn");

        // this is quite confusing
        // get returnsSingleResult from DataModelConfig
        if (op.isQuery() && externalConfig != null) {
            rtn.setList(!externalConfig.returnsSingleResult(operationName));
        } else {
            rtn.setList(!op.getReturnsSingleResult());
        }
        return rtn;
    }

    public String getPackageName() {
        if (metaData.getServiceClassName() != null) {
            return StringUtils.splitPackageAndClass(metaData
                    .getServiceClassName()).v1;
        } else {
            throw new AssertionError("Metadata service class must be set");
        }
    }

    public String getDataPackage() {
        return metaData.getDataPackage();
    }

    public String getServiceId() {
        return metaData.getName();
    }

    public ServiceType getServiceType() {
        return new DataServiceType();
    }

    public String getRuntimeConfiguration() {
        return getServiceId() + DataServiceConstants.SPRING_CFG_EXT;
    }

    public void dispose() {
        metaData.dispose();
        try {
            if (sessionFactory != null) {
                sessionFactory.close();
            }
        } catch (RuntimeException ignore) {
        }
    }

    public String getServiceClass() {
        // at import-db time, the meta-data has the service
        // class name to use. this is to allow a class
        // name that is different from the serviceid.
        // we may not need this, since the tooling is
        // built such that the class name is always the
        // same as the serviceid.
        if (metaData.getServiceClassName() != null) {
            return metaData.getServiceClassName();
        } else {
            throw new AssertionError("Metadata service class must be set");
        }
    }

    public List<ElementType> getTypes() {
        Collection<String> entities = metaData.getEntityClassNames();
        Collection<String> helperTypes = metaData.getHelperClassNames();
        return DataServiceUtils.getTypes(entities, helperTypes,
                elementTypeFactory);
    }

    public List<ElementType> getTypes(String username, String password) { //salesforce - just to avoid compile error
        Collection<String> entities = metaData.getEntityClassNames();
        Collection<String> helperTypes = metaData.getHelperClassNames();
        return DataServiceUtils.getTypes(entities, helperTypes,
                elementTypeFactory);
    }

    public String outputTypeToString(String operationName) {
        ElementType et = getOutputType(operationName);
        return et.getJavaType();
    }

    public String inputTypesToString(String operationName) {
        StringBuilder rtn = new StringBuilder();
        for (ElementType et : getInputTypes(operationName)) {
            rtn.append(et.getJavaType()).append(" ");
            rtn.append("list: " + et.isList());
        }
        return rtn.toString();
    }

    public List<String> getEventNotifiers() {
        return Collections.emptyList();
    }

    public DataServiceOperation getOperation(String operationName) {
        return metaData.getOperation(operationName);
    }

    public boolean isLiveDataService() {
        return true;
    }

    public String getPartnerName() {
        return null;
    }
}

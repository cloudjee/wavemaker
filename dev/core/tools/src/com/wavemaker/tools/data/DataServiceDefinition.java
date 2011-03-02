/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
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
package com.wavemaker.tools.data;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.TreeSet;

import com.wavemaker.common.Resource;
import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.runtime.data.*;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.data.util.DataServiceUtils;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.runtime.service.ServiceType;
import com.wavemaker.runtime.service.definition.AbstractDeprecatedServiceDefinition;
import com.wavemaker.runtime.service.definition.ReflectServiceDefinition;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.Operation;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 */
public class DataServiceDefinition  extends AbstractDeprecatedServiceDefinition
        implements DataServiceInternal, ReflectServiceDefinition {

    private final String serviceId;

    private final DataModelConfiguration dataCfg;

    private final DesignServiceManager serviceManager;

    private final String serviceClass;

    private final String packageName;

    private DataServiceOperationManager operationManager;

    private final boolean owner;

    private ElementTypeFactory elementTypeFactory = DEFAULT_ELEMENT_TYPE_FACTORY;

    public DataServiceDefinition(String serviceId,
            ExternalDataModelConfig externalConfig,
            DesignServiceManager serviceManager, File serviceDir)
            throws IOException {

        this.owner = true;
        this.serviceId = serviceId;
        this.serviceManager = serviceManager;
        this.dataCfg = new DataModelConfiguration(serviceDir, serviceManager
                .getProjectManager().getCurrentProject(), serviceId,
                externalConfig, null, null);
        this.serviceClass = serviceManager.getService(serviceId).getClazz();
        this.packageName = StringUtils.splitPackageAndClass(serviceClass).v1;
        initOperationManager();
    }

    public DataServiceDefinition(String serviceId,
            DataModelConfiguration dataCfg, DesignServiceManager serviceManager) {
        this(serviceId, dataCfg, serviceManager, serviceManager.getService(
                serviceId).getClazz());
    }

    public DataServiceDefinition(final String serviceId,
            final DataModelConfiguration dataCfg,
            final DesignServiceManager serviceManager, final String serviceClass) {

        this.owner = false;
        this.serviceId = serviceId;
        this.dataCfg = dataCfg;
        this.serviceManager = serviceManager;
        this.serviceClass = serviceClass;
        this.packageName = StringUtils.splitPackageAndClass(serviceClass).v1;
        initOperationManager();
    }

    public void setElementTypeFactory(ElementTypeFactory elementTypeFactory) {
        this.elementTypeFactory = elementTypeFactory;
    }

    public String getServiceClass() {
        return serviceClass;
    }

    public String getServiceId() {
        return serviceId;
    }

    public String getPackageName() {
        return packageName;
    }

    public String getDataPackage() {
        return dataCfg.getDataPackage();
    }

    public DataModelConfiguration getDataModelConfiguration() {
        return dataCfg;
    }

    public ServiceType getServiceType() {
        return new DataServiceType();
    }

    public List<String> getOperationNames() {
        return serviceManager.getOperationNames(serviceId);
    }

    public List<ElementType> getInputTypes(String operationName) {
        Operation op = serviceManager.getOperation(serviceId, operationName);
        List<Operation.Parameter> params = op.getParameter();
        List<ElementType> rtn = new ArrayList<ElementType>(params.size());
        for (Operation.Parameter p : params) {
            rtn.add(new ElementType(p.getName(), p.getTypeRef(), p.isIsList()));
        }
        return rtn;
    }

    public ElementType getOutputType(String operationName) {
        Operation op = serviceManager.getOperation(serviceId, operationName);
        if (op.getReturn() == null) {
            return null;
        }
        Operation.Return opRtn = op.getReturn();
        ElementType rtn = new ElementType("rtn", opRtn.getTypeRef(), opRtn
                .isIsList());
        return rtn;
    }

    public List<ElementType> getTypes() {
        Collection<String> entities = getEntityClassNames();
        Collection<String> otherTypes = getHelperTypes();
        return DataServiceUtils.getTypes(entities, otherTypes,
                elementTypeFactory);
    }

    public String getRuntimeConfiguration() {
        return serviceId + DataServiceConstants.SPRING_CFG_EXT;
    }

    public void dispose() {
        if (owner) {
            dataCfg.dispose();
        }
    }

    public List<String> getEventNotifiers() {
        return Collections.emptyList();
    }

    public DataServiceOperation getOperation(String operationName) {
        DataServiceOperation rtn = operationManager.getOperation(operationName);
        if (rtn == null) {
            throw new DataServiceRuntimeException(Resource.OPERATION_NOT_FOUND,
                    serviceId, operationName, operationManager
                            .getOperationNames());
        }
        return rtn;
    }

    public void setExternalConfig(ExternalDataModelConfig externalConfig) {
    }

    public boolean isLiveDataService() {
        return true;
    }

    private Collection<String> getEntityClassNames() {
        Collection<String> rtn = new TreeSet<String>();
        for (String s : dataCfg.getEntityNames()) {
            rtn.add(StringUtils.fq(dataCfg.getDataPackage(), s));
        }
        return rtn;
    }

    private Collection<String> getHelperTypes() {
        // we don't need the helper types at tooling time currently
        return Collections.emptySet();
    }

    private void initOperationManager() {
        if (!this.serviceId.equals(CommonConstants.SALESFORCE_SERVICE)) { //salesforce
            this.operationManager = new DataServiceOperationManager(initFactory(),
                dataCfg.useIndividualCRUDOperations());
        } else {
            this.operationManager = new DataServiceOperationManager(initFactory(),
                false);
        }
    }

    private DataOperationFactory initFactory() {

        return new DataOperationFactory() {

            public Collection<String> getEntityClassNames() {
                return DataServiceDefinition.this.getEntityClassNames();
            }

            public Collection<Tuple.Three<String, String, Boolean>> getQueryInputs(
                    String queryName) {
                Collection<Tuple.Three<String, String, Boolean>> rtn = new ArrayList<Tuple.Three<String, String, Boolean>>();
                QueryInfo qi = dataCfg.getQuery(queryName);
                for (Input in : qi.getInputs()) {
                    rtn.add(Tuple.tuple(in.getParamName(), in.getParamType(),
                            in.getList()));
                }
                return rtn;
            }

            public Collection<String> getQueryNames() {
                return dataCfg.getQueryNames();
            }

            public List<String> getQueryReturnTypes(String operationName,
                    String queryName) {
                List<String> rtn = new ArrayList<String>();
                Operation op = serviceManager.getOperation(serviceId,
                        operationName);
                if (op == null) {
                    throw new ConfigurationException(
                            Resource.OPERATION_NOT_FOUND, serviceId,
                            operationName, getOperationNames());
                }
                if (op.getReturn() != null) {
                    String type = op.getReturn().getTypeRef();
                    String shortName = StringUtils.getClassName(type);
                    if (!dataCfg.isEntityType(shortName)
                            && !dataCfg.isValueType(shortName)) {
                    }
                    rtn.add(type);
                }
                return rtn;
            }

            public boolean requiresResultWrapper(String operationName,
                    String queryName) {
                QueryInfo query = dataCfg.getQuery(queryName);
                return DataServiceUtils.requiresResultWrapper(query.getQuery());
            }

            public List<String> getQueryReturnNames(String operationName,
                    String queryName) {
                return Collections.emptyList();
            }

            public boolean queryReturnsSingleResult(String operationName,
                    String queryName) {
                Operation op = serviceManager.getOperation(serviceId,
                        operationName);
                if (op == null) {
                    throw new ConfigurationException(
                            Resource.OPERATION_NOT_FOUND, serviceId,
                            operationName, getOperationNames());
                }
                if (op.getReturn() == null) {
                    return false;
                } else {
                    return !op.getReturn().isIsList();
                }
            }

        };

    }
}

/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.data;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.TreeSet;

import org.springframework.core.io.Resource;

import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.MessageResource;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.runtime.data.DataOperationFactory;
import com.wavemaker.runtime.data.DataServiceInternal;
import com.wavemaker.runtime.data.DataServiceOperation;
import com.wavemaker.runtime.data.DataServiceOperationManager;
import com.wavemaker.runtime.data.DataServiceRuntimeException;
import com.wavemaker.runtime.data.DataServiceType;
import com.wavemaker.runtime.data.ExternalDataModelConfig;
import com.wavemaker.runtime.data.Input;
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
 */
public class DataServiceDefinition extends AbstractDeprecatedServiceDefinition implements DataServiceInternal, ReflectServiceDefinition {

    private final String serviceId;

    private final DataModelConfiguration dataCfg;

    private final DesignServiceManager serviceManager;

    private final String serviceClass;

    private final String packageName;

    private DataServiceOperationManager operationManager;

    private final boolean owner;

    private ElementTypeFactory elementTypeFactory = DEFAULT_ELEMENT_TYPE_FACTORY;

    public DataServiceDefinition(String serviceId, ExternalDataModelConfig externalConfig, DesignServiceManager serviceManager, Resource serviceDir)
        throws IOException {

        this.owner = true;
        this.serviceId = serviceId;
        this.serviceManager = serviceManager;
        this.dataCfg = new DataModelConfiguration(serviceDir, serviceManager.getProjectManager().getCurrentProject(), serviceId, externalConfig, null);
        this.serviceClass = serviceManager.getService(serviceId).getClazz();
        this.packageName = StringUtils.splitPackageAndClass(this.serviceClass).v1;
        initOperationManager();
    }

    public DataServiceDefinition(String serviceId, DataModelConfiguration dataCfg, DesignServiceManager serviceManager) {
        this(serviceId, dataCfg, serviceManager, serviceManager.getService(serviceId).getClazz());
    }

    public DataServiceDefinition(final String serviceId, final DataModelConfiguration dataCfg, final DesignServiceManager serviceManager,
        final String serviceClass) {

        this.owner = false;
        this.serviceId = serviceId;
        this.dataCfg = dataCfg;
        this.serviceManager = serviceManager;
        this.serviceClass = serviceClass;
        this.packageName = StringUtils.splitPackageAndClass(serviceClass).v1;
        initOperationManager();
    }

    @Override
    public void setElementTypeFactory(ElementTypeFactory elementTypeFactory) {
        this.elementTypeFactory = elementTypeFactory;
    }

    @Override
    public String getServiceClass() {
        return this.serviceClass;
    }

    @Override
    public String getServiceId() {
        return this.serviceId;
    }

    @Override
    public String getPackageName() {
        return this.packageName;
    }

    @Override
    public String getDataPackage() {
        return this.dataCfg.getDataPackage();
    }

    public DataModelConfiguration getDataModelConfiguration() {
        return this.dataCfg;
    }

    @Override
    public ServiceType getServiceType() {
        return new DataServiceType();
    }

    @Override
    public List<String> getOperationNames() {
        return this.serviceManager.getOperationNames(this.serviceId);
    }

    @Override
    public List<ElementType> getInputTypes(String operationName) {
        Operation op = this.serviceManager.getOperation(this.serviceId, operationName);
        List<Operation.Parameter> params = op.getParameter();
        List<ElementType> rtn = new ArrayList<ElementType>(params.size());
        for (Operation.Parameter p : params) {
            rtn.add(new ElementType(p.getName(), p.getTypeRef(), p.isIsList()));
        }
        return rtn;
    }

    @Override
    public ElementType getOutputType(String operationName) {
        Operation op = this.serviceManager.getOperation(this.serviceId, operationName);
        if (op.getReturn() == null) {
            return null;
        }
        Operation.Return opRtn = op.getReturn();
        ElementType rtn = new ElementType("rtn", opRtn.getTypeRef(), opRtn.isIsList());
        return rtn;
    }

    @Override
    public String getOperationType(String operationName) {
        return null;
    }

    @Override
    public List<ElementType> getTypes() {
        Collection<String> entities = getEntityClassNames();
        Collection<String> otherTypes = getHelperTypes();
        return DataServiceUtils.getTypes(entities, otherTypes, this.elementTypeFactory);
    }

    @Override
    public String getRuntimeConfiguration() {
        return this.serviceId + DataServiceConstants.SPRING_CFG_EXT;
    }

    @Override
    public void dispose() {
        if (this.owner) {
            this.dataCfg.dispose();
        }
    }

    @Override
    public List<String> getEventNotifiers() {
        return Collections.emptyList();
    }

    @Override
    public DataServiceOperation getOperation(String operationName) {
        DataServiceOperation rtn = this.operationManager.getOperation(operationName);
        if (rtn == null) {
            throw new DataServiceRuntimeException(MessageResource.OPERATION_NOT_FOUND, this.serviceId, operationName,
                this.operationManager.getOperationNames());
        }
        return rtn;
    }

    @Override
    public void setExternalConfig(ExternalDataModelConfig externalConfig) {
    }

    @Override
    public boolean isLiveDataService() {
        return true;
    }

    @Override
    public String getPartnerName() {
        return null;
    }

    private Collection<String> getEntityClassNames() {
        Collection<String> rtn = new TreeSet<String>();
        for (String s : this.dataCfg.getEntityNames()) {
            rtn.add(StringUtils.fq(this.dataCfg.getDataPackage(), s));
        }
        return rtn;
    }

    private Collection<String> getHelperTypes() {
        // we don't need the helper types at tooling time currently
        return Collections.emptySet();
    }

    private void initOperationManager() {
        if (!this.serviceId.equals(CommonConstants.SALESFORCE_SERVICE)) { // salesforce
            this.operationManager = new DataServiceOperationManager(initFactory(), this.dataCfg.useIndividualCRUDOperations());
        } else {
            this.operationManager = new DataServiceOperationManager(initFactory(), false);
        }
    }

    private DataOperationFactory initFactory() {

        return new DataOperationFactory() {

            @Override
            public Collection<String> getEntityClassNames() {
                return DataServiceDefinition.this.getEntityClassNames();
            }

            @Override
            public Collection<Tuple.Three<String, String, Boolean>> getQueryInputs(String queryName) {
                Collection<Tuple.Three<String, String, Boolean>> rtn = new ArrayList<Tuple.Three<String, String, Boolean>>();
                QueryInfo qi = DataServiceDefinition.this.dataCfg.getQuery(queryName);
                for (Input in : qi.getInputs()) {
                    rtn.add(Tuple.tuple(in.getParamName(), in.getParamType(), in.getList()));
                }
                return rtn;
            }

            @Override
            public Collection<String> getQueryNames() {
                return DataServiceDefinition.this.dataCfg.getQueryNames();
            }

            @Override
            public List<String> getQueryReturnTypes(String operationName, String queryName) {
                List<String> rtn = new ArrayList<String>();
                Operation op = DataServiceDefinition.this.serviceManager.getOperation(DataServiceDefinition.this.serviceId, operationName);
                if (op == null) {
                    throw new ConfigurationException(MessageResource.OPERATION_NOT_FOUND, DataServiceDefinition.this.serviceId, operationName,
                        getOperationNames());
                }
                if (op.getReturn() != null) {
                    String type = op.getReturn().getTypeRef();
                    String shortName = StringUtils.getClassName(type);
                    if (!DataServiceDefinition.this.dataCfg.isEntityType(shortName) && !DataServiceDefinition.this.dataCfg.isValueType(shortName)) {
                    }
                    rtn.add(type);
                }
                return rtn;
            }

            @Override
            public boolean requiresResultWrapper(String operationName, String queryName) {
                QueryInfo query = DataServiceDefinition.this.dataCfg.getQuery(queryName);
                return DataServiceUtils.requiresResultWrapper(query.getQuery());
            }

            @Override
            public List<String> getQueryReturnNames(String operationName, String queryName) {
                return Collections.emptyList();
            }

            @Override
            public boolean queryReturnsSingleResult(String operationName, String queryName) {
                Operation op = DataServiceDefinition.this.serviceManager.getOperation(DataServiceDefinition.this.serviceId, operationName);
                if (op == null) {
                    throw new ConfigurationException(MessageResource.OPERATION_NOT_FOUND, DataServiceDefinition.this.serviceId, operationName,
                        getOperationNames());
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

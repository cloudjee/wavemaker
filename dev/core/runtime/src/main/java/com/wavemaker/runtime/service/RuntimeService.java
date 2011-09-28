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

package com.wavemaker.runtime.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.io.InputStream;
import java.io.ByteArrayInputStream;
import java.io.UnsupportedEncodingException;

import org.apache.commons.beanutils.PropertyUtils;

import com.wavemaker.common.NotYetImplementedException;
import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.json.JSONState;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.server.InternalRuntime;
import com.wavemaker.runtime.server.JSONParameterTypeField;
import com.wavemaker.runtime.server.ServerUtils;
import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.runtime.service.events.ServiceEventNotifier;
import com.wavemaker.runtime.service.response.SuccessResponse;

/**
 * Runtime service. This service is always present during the runtime of a
 * Maverick's application, and provides general operations.
 * 
 * For now, modifications of this class must be accompanied by modifications to
 * runtimeServiceDef.xml.
 * 
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class RuntimeService {

    /**
     * getProperty() is a legacy interface. This retrieves (and allows
     * lazy-loading) of a single attribute of an object.
     * 
     * @param instance
     *                An instance of type type.
     * @param type
     *                The type of the object instance.
     * @param propertyName
     *                The name of the property to load.
     * @return The attribute specified by the propertyName parameter is
     *         returned, not the whole object.
     * @throws Exception
     */
    @SuppressWarnings("unchecked")
    public Object getProperty(
            @JSONParameterTypeField(typeParameter = 1) Object instance,
            String type, String propertyName)
            throws Exception {

        ServiceWire serviceWire = typeManager.getServiceWireForType(type);

        if (serviceWire.isLiveDataService()) {

            PropertyOptions po = new PropertyOptions();
            po.getProperties().add(propertyName);

            TypedServiceReturn resp = read(typeManager.getServiceIdForType(type),
                    type, instance, po, null);

            Object o = ((SuccessResponse)resp.getReturnValue()).getResult();

            if (o instanceof Collection) {
                Collection c = (Collection) o;
                if (c.isEmpty()) {
                    o = null;
                } else {
                    o = c.iterator().next();
                }
            }

            if (o == null) {
                return null;
            } else {
                Object ret = PropertyUtils.getProperty(o, propertyName);
                return ret;
            }
        } else {
            throw new NotYetImplementedException();
        }
    }

    public TypedServiceReturn read(String serviceName,
            String typeName, @JSONParameterTypeField(typeParameter = 1)
            Object instance, PropertyOptions propertyOptions,
            PagingOptions pagingOptions) throws Exception {

        ServiceWire sw = getServiceWire(serviceName, typeName);
        sw.getServiceType().setup(sw, internalRuntime, runtimeAccess);
        
        TypeDefinition typeDefinition = internalRuntime.getJSONState().getTypeState().getType(typeName);
        String methodName = "read";
        
        JSONState jc = getInternalRuntime().getJSONState();
        jc.setTrimStackLevel(1);
        if (null!=getInternalRuntime() &&
                null!=jc &&
                null!=jc.getRequiredProperties() &&
                null!=propertyOptions &&
                null!=propertyOptions.getProperties()) {

            List<String> jcProperties = jc.getRequiredProperties();
            for (String property : propertyOptions.getProperties()) {
                jcProperties.add(property);
            }
        }

        if (sw.isLiveDataService()) {
            ParsedServiceArguments psa = new ParsedServiceArguments();
            psa.setArguments(new Object[] { typeDefinition, instance, propertyOptions,
                    pagingOptions });
            TypedServiceReturn ret = ServerUtils.invokeMethodWithEvents(
                    getServiceEventNotifier(), sw, methodName, psa, jc, true);
            return ret;
        } else {
            throw new NotYetImplementedException();
        }
    }

    public TypedServiceReturn update(String serviceName,
            String typeName, @JSONParameterTypeField(typeParameter = 1)
            Object objectToUpdate) throws Exception {

        ServiceWire sw = getServiceWire(serviceName, typeName);
        sw.getServiceType().setup(sw, internalRuntime, runtimeAccess);
        String methodName = "update";

        if (sw.isLiveDataService()) {
            // remove serviceName and typeName from
            // deserialized properties list
            shiftDeserializedProperties(2);

            ParsedServiceArguments psa = new ParsedServiceArguments();
            psa.setArguments(new Object[] { objectToUpdate });
            return ServerUtils.invokeMethodWithEvents(
                    getServiceEventNotifier(), sw, methodName, psa,
                    getInternalRuntime().getJSONState(), true);
        } else {
            throw new NotYetImplementedException();
        }
    }

    public TypedServiceReturn insert(String serviceName,
            String typeName, @JSONParameterTypeField(typeParameter = 1)
            Object objectToInsert) throws Exception {

        ServiceWire sw = getServiceWire(serviceName, typeName);
        sw.getServiceType().setup(sw, internalRuntime, runtimeAccess);
        String methodName = "insert";

        if (sw.isLiveDataService()) {
            ParsedServiceArguments psa = new ParsedServiceArguments();
            psa.setArguments(new Object[] { objectToInsert });
            return ServerUtils.invokeMethodWithEvents(
                    getServiceEventNotifier(), sw, methodName, psa,
                    getInternalRuntime().getJSONState(), true);
        } else {
            throw new NotYetImplementedException();
        }
    }

    public void delete(String serviceName, String typeName,
            @JSONParameterTypeField(typeParameter = 1)
            Object objectToDelete) throws Exception {

        ServiceWire sw = getServiceWire(serviceName, typeName);
        sw.getServiceType().setup(sw, internalRuntime, runtimeAccess);
        String methodName = "delete";

        if (sw.isLiveDataService()) {
            ParsedServiceArguments psa = new ParsedServiceArguments();
            psa.setArguments(new Object[] { objectToDelete });
            ServerUtils.invokeMethodWithEvents(getServiceEventNotifier(), sw,
                    methodName, psa, getInternalRuntime().getJSONState(), true);
        } else {
            throw new NotYetImplementedException();
        }
    }

    public String getLocalHostIP() {
        return SystemUtils.getIP();
    }

    public String getSessionId() {
        return RuntimeAccess.getInstance().getSession().getId();
    }

    public DownloadResponse echo(String contents, String contentType,
            String fileName) {
        InputStream is;
        try {
            is = new ByteArrayInputStream(contents.getBytes("UTF-8"));
        } catch (UnsupportedEncodingException e) {
            throw new WMRuntimeException(e);
        }
        return (new DownloadResponse(is, contentType, fileName));
    }

    private void shiftDeserializedProperties(int index) {
        InternalRuntime ir = InternalRuntime.getInstance();
        List<List<String>> org = ir.getDeserializedProperties();
        int size = org.size() - index;
        List<List<String>> props = new ArrayList<List<String>>(size);
        for (int i = index; i < org.size(); i++) {
            props.add(org.get(i));
        }
        ir.setDeserializedProperties(props);
    }
    
    /**
     * Get the service.  If serviceName is not null or "", use the serviceName.
     * If not, use the owning service of typeName.
     * 
     * @param serviceName The serviceName (can be null or "") of the desired service..
     * @param typeName The typeName (only used if serviceName is null or "") owned by the desired service.
     * @return The service bean object.
     * @throws WMRuntimeException if no appropriate service can be found.
     */
    public ServiceWire getServiceWire(String serviceName, String typeName) {
        ServiceWire serviceWire = null;
        Exception enclosedException = null;
        
        if (null!=serviceName && 0!=serviceName.length()) {
            serviceWire = serviceManager.getServiceWire(serviceName);
        } else {
            try {
                String serviceId = typeManager.getServiceIdForType(typeName);
                serviceWire = serviceManager.getServiceWire(serviceId);
            } catch (TypeNotFoundException e) {
                enclosedException = e;
            } catch (WMRuntimeException e2) {
                enclosedException = e2;
            }
        }

        if (null==serviceWire && null == enclosedException) {
            throw new WMRuntimeException(MessageResource.NO_SERVICE_FROM_ID_TYPE,
                    serviceName, typeName);
        } else if (null==serviceWire) {
            throw new WMRuntimeException(MessageResource.NO_SERVICE_FROM_ID_TYPE,
                    enclosedException, serviceName, typeName);
        }
        
        return serviceWire;
    }
    
    

    // spring-managed bean properties
    private TypeManager typeManager;

    private ServiceManager serviceManager;

    private ServiceEventNotifier serviceEventNotifier;
    
    private InternalRuntime internalRuntime;
    
    private RuntimeAccess runtimeAccess;

    public TypeManager getTypeManager() {
        return typeManager;
    }
    public void setTypeManager(TypeManager typeManager) {
        this.typeManager = typeManager;
    }

    public ServiceManager getServiceManager() {
        return serviceManager;
    }
    public void setServiceManager(ServiceManager serviceManager) {
        this.serviceManager = serviceManager;
    }

    public ServiceEventNotifier getServiceEventNotifier() {
        return serviceEventNotifier;
    }
    public void setServiceEventNotifier(
            ServiceEventNotifier serviceEventNotifier) {
        this.serviceEventNotifier = serviceEventNotifier;
    }

    public InternalRuntime getInternalRuntime() {
        return internalRuntime;
    }
    public void setInternalRuntime(InternalRuntime internalRuntime) {
        this.internalRuntime = internalRuntime;
    }

    public RuntimeAccess getRuntimeAccess() {
        return runtimeAccess;
    }
    public void setRuntimeAccess(RuntimeAccess runtimeAccess) {
        this.runtimeAccess = runtimeAccess;
    }
}
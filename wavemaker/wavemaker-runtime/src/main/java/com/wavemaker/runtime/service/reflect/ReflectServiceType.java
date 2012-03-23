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

package com.wavemaker.runtime.service.reflect;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSONArray;
import com.wavemaker.json.JSONState;
import com.wavemaker.json.JSONObject;
import com.wavemaker.json.type.reflect.ReflectTypeUtils;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.GenericFieldDefinition;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.server.InternalRuntime;
import com.wavemaker.runtime.server.ServerUtils;
import com.wavemaker.runtime.server.ServiceResponse;
import com.wavemaker.runtime.server.json.JSONUtils;
import com.wavemaker.runtime.service.ParsedServiceArguments;
import com.wavemaker.runtime.service.ServiceType;
import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.runtime.service.TypedServiceReturn;

/**
 * @author Matt Small
 */
public abstract class ReflectServiceType implements ServiceType {

    @Override
    public ParsedServiceArguments parseServiceArgs(ServiceWire serviceWire, String methodName, JSONArray args, JSONState jsonState) {

        if (!(serviceWire instanceof ReflectServiceWire)) {
            throw new WMRuntimeException(MessageResource.EXPECTED_REFLECT_SW, serviceWire);
        }
        ReflectServiceWire rsw = (ReflectServiceWire) serviceWire;

        Object serviceObject = rsw.getServiceBean();
        Method method = findMethod(methodName, serviceObject, args.size());

        ParsedServiceArguments psa = JSONUtils.convertJSONToObjects(args, method, jsonState);

        ReflectParsedServiceArguments rpsa = new ReflectParsedServiceArguments(psa);
        rpsa.setMethod(method);
        rpsa.setServiceObject(serviceObject);
        return rpsa;
    }

    @Override
    public ParsedServiceArguments parseServiceArgs(ServiceWire serviceWire, String methodName, Map<String, Object[]> args, JSONState jsonState) {

        if (!(serviceWire instanceof ReflectServiceWire)) {
            throw new WMRuntimeException(MessageResource.EXPECTED_REFLECT_SW, serviceWire);
        }
        ReflectServiceWire rsw = (ReflectServiceWire) serviceWire;

        Object serviceObject = rsw.getServiceBean();
        Method method = findMethod(methodName, serviceObject, args.size());

        Object[] translatedArgs = paramsFromAnnotatedMethod(method, args);

        ReflectParsedServiceArguments rpsa = new ReflectParsedServiceArguments();
        rpsa.setArguments(translatedArgs);
        rpsa.setMethod(method);
        rpsa.setServiceObject(serviceObject);
        return rpsa;
    }

    @Override
    public void setup(ServiceWire serviceWire, InternalRuntime internalRuntime, RuntimeAccess runtimeAccess) {
        // do nothing
    }

    @Override
    public TypedServiceReturn invokeMethod(
                ServiceWire serviceWire, String methodName,
                ParsedServiceArguments args, JSONState jsonState) {
        return invokeMethod(serviceWire, methodName, args, jsonState, null);
    }

    @Override
    public TypedServiceReturn invokeMethod(
                ServiceWire serviceWire, String methodName,
                ParsedServiceArguments args, JSONState jsonState, ServiceResponse serviceResponse) {

        Method method;
        Object serviceObject;
        if (!(args instanceof ReflectParsedServiceArguments)) {
            if (!(serviceWire instanceof ReflectServiceWire)) {
                throw new WMRuntimeException(MessageResource.EXPECTED_REFLECT_SW, serviceWire);
            }
            ReflectServiceWire rsw = (ReflectServiceWire) serviceWire;

            serviceObject = rsw.getServiceBean();
            method = findMethod(methodName, serviceObject, args.getArguments().length);
        } else {
            ReflectParsedServiceArguments rpsa = (ReflectParsedServiceArguments) args;
            method = rpsa.getMethod();
            serviceObject = rpsa.getServiceObject();
        }

        Object ret = null;
        try {
            if (serviceResponse == null || serviceResponse.getConnectionTimeout() == 0) {
                ret = method.invoke(serviceObject, args.getArguments());
            } else {
                ret = serviceResponse.invokeMethod(method, serviceObject, args.getArguments());
            }

        } catch (Exception e) {
            if (e.getCause() != null) {
                throw new WMRuntimeException(MessageResource.JSONUTILS_FAILEDINVOKE, e.getCause(), method.getName(), method.getDeclaringClass());
            } else {
                throw new WMRuntimeException(MessageResource.JSONUTILS_FAILEDINVOKE, e, method.getName(), method.getDeclaringClass());
            }
        }

        if (ret instanceof TypedServiceReturn) {
            return (TypedServiceReturn) ret;
        } else {
            TypedServiceReturn tsr = new TypedServiceReturn(ret, ReflectTypeUtils.getFieldDefinition(method, jsonState.getTypeState(), false, null));
            return tsr;
        }
    }

    public static Method findMethod(String method, Object s, int paramsLength) {

        List<Method> methods = ServerUtils.getClientExposedMethods(ServerUtils.getRealClass(s));
        Method meth = null;

        for (Method m : methods) {
            if (m.getName().equals(method) && m.getParameterTypes().length == paramsLength) {

                if (meth != null) {
                    throw new WMRuntimeException(MessageResource.JSONUTILS_BADMETHODOVERLOAD, method, s.getClass());
                }
                meth = m;
            }
        }

        if (meth == null) {
            throw new WMRuntimeException(MessageResource.JSONRPC_CONTROLLER_METHOD_NOT_FOUND, method, paramsLength, s.getClass());
        }

        return meth;
    }

    /**
     * Transform a map of parameters (from a POST or GET), and transform it into the Object[] suitable for an invoke()
     * call. This requires that the every parameter of the method be annotated using ParamName.
     * 
     * Also, this method will provide some basic type translations:
     * <ul>
     * <li>Object[] to Object; if the input parameter is an array of length 1, and the method parameter is not an array,
     * the input parameter will be unwrapped.</li>
     * </ul>
     * 
     * @param method The annotated method.
     * @param params The parameters (from a POST or GET, for instance).
     * @return An Object[], suitable for use in a method invoke().
     */
    public static Object[] paramsFromAnnotatedMethod(Method method, Map<String, Object[]> params) {

        Class<?>[] paramTypes = method.getParameterTypes();
        Object[] ret = new Object[paramTypes.length];
        List<String> paramNames = ServerUtils.getParameterNames(method);

        for (int i = 0; i < paramNames.size(); i++) {
            ret[i] = params.get(paramNames.get(i));
        }

        // simple type translates; see above for a full list
        for (int i = 0; i < paramTypes.length; i++) {
            // Object[] -> Object
            if (ret[i] instanceof Object[] && 1 == ((Object[]) ret[i]).length && !paramTypes[i].isAssignableFrom(Object[].class)) {
                ret[i] = ((Object[]) ret[i])[0];
            }
        }

        return ret;
    }
}
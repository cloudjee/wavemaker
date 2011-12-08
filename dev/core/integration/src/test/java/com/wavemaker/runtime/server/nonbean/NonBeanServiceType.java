/*
 *  Copyright (C) 2009 WaveMaker Software, Inc.
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

package com.wavemaker.runtime.server.nonbean;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSONArray;
import com.wavemaker.json.JSONState;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.GenericFieldDefinition;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.server.InternalRuntime;
import com.wavemaker.runtime.server.json.JSONUtils;
import com.wavemaker.runtime.service.ParsedServiceArguments;
import com.wavemaker.runtime.service.ServiceType;
import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.runtime.service.TypedServiceReturn;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class NonBeanServiceType implements ServiceType {

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.ServiceType#getTypeName()
     */
    @Override
    public String getTypeName() {
        return "NonBeanService";
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.ServiceType#invokeMethod(com.wavemaker.runtime.service.ServiceWire,
     * java.lang.String, com.wavemaker.runtime.service.ParsedServiceArguments, com.wavemaker.json.JSONState)
     */
    @Override
    public TypedServiceReturn invokeMethod(ServiceWire serviceWire, String methodName, ParsedServiceArguments args, JSONState jsonState) {

        if ("foo".equals(methodName)) {
            Object[] os = args.getArguments();
            Class<?>[] klasses = new Class<?>[] { Integer.class, String.class, List.class };

            if (os.length != klasses.length) {
                throw new WMRuntimeException("os " + os + "!= klasses " + klasses);
            }
            for (int i = 0; i < os.length; i++) {
                if (!klasses[i].isAssignableFrom(os[i].getClass())) {
                    throw new WMRuntimeException("bad os[" + i + "]: " + os[i] + " (" + os[i].getClass() + "), expected: " + klasses[i]);

                }
            }

            return new TypedServiceReturn("" + ((Integer) os[0] + 1) + os[1] + ((List<?>) os[2]).get(0), new GenericFieldDefinition(
                jsonState.getTypeState().getType(NonBeanTypeFactory.FOO_ARG_1)));
        } else {
            throw new WMRuntimeException("unhandled method");
        }
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.ServiceType#parseServiceArgs(com.wavemaker.runtime.service.ServiceWire,
     * java.lang.String, com.wavemaker.json.JSONArray, com.wavemaker.json.JSONState)
     */
    @Override
    public ParsedServiceArguments parseServiceArgs(ServiceWire serviceWire, String methodName, JSONArray args, JSONState jsonState) {

        List<FieldDefinition> fields = new ArrayList<FieldDefinition>();

        if ("foo".equals(methodName)) {
            fields.add(new GenericFieldDefinition(jsonState.getTypeState().getType(NonBeanTypeFactory.FOO_ARG_1)));
            fields.add(new GenericFieldDefinition(jsonState.getTypeState().getType(NonBeanTypeFactory.FOO_ARG_2)));
            fields.add(new GenericFieldDefinition(jsonState.getTypeState().getType(NonBeanTypeFactory.FOO_ARG_3)));
        }

        return JSONUtils.convertJSONToObjects(args, fields, jsonState);
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.ServiceType#parseServiceArgs(com.wavemaker.runtime.service.ServiceWire,
     * java.lang.String, java.util.Map, com.wavemaker.json.JSONState)
     */
    @Override
    public ParsedServiceArguments parseServiceArgs(ServiceWire serviceWire, String methodName, Map<String, Object[]> args, JSONState jsonState) {
        // TODO Auto-generated method stub
        return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.ServiceType#setup(com.wavemaker.runtime.service.ServiceWire,
     * com.wavemaker.runtime.server.InternalRuntime, com.wavemaker.runtime.RuntimeAccess)
     */
    @Override
    public void setup(ServiceWire serviceWire, InternalRuntime internalRuntime, RuntimeAccess runtimeAccess) {
        internalRuntime.getJSONState().setTypeState(new NonBeanTypeFactory());
    }
}
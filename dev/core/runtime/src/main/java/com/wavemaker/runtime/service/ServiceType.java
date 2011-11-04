/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

import java.util.Map;

import com.wavemaker.json.JSONArray;
import com.wavemaker.json.JSONState;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.server.InternalRuntime;
import com.wavemaker.runtime.server.json.JSONUtils;

/**
 * Interface specifying the runtime component for a ServiceType.
 * 
 * @author Matt Small
 */
public interface ServiceType {

    /**
     * Get the name of this type; for instance, WebService, DataService, etc.
     * 
     * @return The name of the type.
     */
    public String getTypeName();

    /**
     * Parse the service arguments into the proper format.
     * 
     * See {@link JSONUtils#convertJSONToObjects(JSONArray, java.util.List, JSONState)} for a utility method to help
     * with this.
     * 
     * @param serviceWire The ServiceWire for this service.
     * @param methodName The method name to invoke.
     * @param args The JSONArray of arguments to this service.
     * @param jsonState The current JSONState object.
     * @return The populated ParsedServiceArguments object (or a ServiceType- specific subclass).
     */
    public ParsedServiceArguments parseServiceArgs(ServiceWire serviceWire, String methodName, JSONArray args, JSONState jsonState);

    /**
     * Translate the Map<String,Object[]> argument list into a native Java Object[] array. Some service invocation
     * methods (such as FileUpload) transmit their arguments as name-value pairs; this method translates those to the
     * expected order for a regular method invocation.
     * 
     * @param serviceWire The ServiceWire for this service.
     * @param methodName The method name to invoke.
     * @param args The Map<String, Object[]> list of named arguments to this service.
     * @param jsonState The current JSONState object.
     * @return The populated ParsedServiceArguments object (or a ServiceType- specific subclass).
     */
    public ParsedServiceArguments parseServiceArgs(ServiceWire serviceWire, String methodName, Map<String, Object[]> args, JSONState jsonState);

    /**
     * Invoke a method. This must properly process events; see {@link AbstractServiceType} for a sample of how to do
     * that (or extend {@link AbstractServiceType}).
     * 
     * @param serviceWire The ServiceWire for this service.
     * @param methodName The method name.
     * @param args The parsed service arguments.
     * @param jsonState The current JSONState object.
     * @return The TypedServiceReturn containing the return value for the service, as well as the type information.
     */
    public TypedServiceReturn invokeMethod(ServiceWire serviceWire, String methodName, ParsedServiceArguments args, JSONState jsonState);

    /**
     * An initial setup call. This is called before any method invocations or json translations happen (although it will
     * happen after the initial json-formatted-String to JSONObject deserialization, this is before any JSONObject ->
     * Java Object translation).
     * 
     * This an appropriate place to initialize the JSONState or TypeState information.
     * 
     * Optionally, this could delegate setup() duties down into the ServiceWire to allow individual services to perform
     * service instance-specific initialization.
     * 
     * @param internalRuntime The internal runtime state.
     * @param runtimeAccess The runtime state.
     */
    public void setup(ServiceWire serviceWire, InternalRuntime internalRuntime, RuntimeAccess runtimeAccess);
}
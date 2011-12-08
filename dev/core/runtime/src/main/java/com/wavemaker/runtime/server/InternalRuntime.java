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

package com.wavemaker.runtime.server;

import java.util.List;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSONState;

/**
 * Provides request-scoped runtime information; for internal use only.
 * 
 * @author Matt Small
 */
public class InternalRuntime {

    private JSONState jsonState;

    private static InternalRuntime internalRuntime;

    private List<List<String>> deserializedProperties;

    /**
     * Statically return the current instance of RuntimeAccess. This depends on the Spring bean being already loaded.
     * 
     * @return
     */
    public static InternalRuntime getInstance() {

        if (null == InternalRuntime.internalRuntime) {
            throw new WMRuntimeException(MessageResource.RUNTIME_UNINITIALIZED);
        }

        return InternalRuntime.internalRuntime;
    }

    public static void setInternalRuntimeBean(InternalRuntime bean) {
        InternalRuntime.internalRuntime = bean;
    }

    public JSONState getJSONState() {
        return this.jsonState;
    }

    public void setJSONState(JSONState jsonState) {
        this.jsonState = jsonState;
    }

    /**
     * Returns a list of properties that were de-serialized during transmission (in effect, a list of all setters that
     * were called during the JSON -> Objects de-serialization). The list elements will be in Apache beanutils format.
     * 
     * A method with a signature:
     * 
     * <code>
     *  public void a(ObjectType, List<ObjectType>, String)
     * </code>
     * 
     * Might have modified attributes:
     * 
     * <code>
     *  [ ["foo", "foo.bar"], ["[0]", "[1]", "[0].foo", "[1].foo"], [] ]
     * </code>
     * 
     * Which indicates that setFoo() and getFoo().setBar() were called for the first argument, the first and second
     * array indices were set (and their setter setFoo() was called), and no modifications were done to the third
     * argument (or, in this case, it's a simple type, so no setters were invoked).
     * 
     * @return the modified attributes
     */
    public List<List<String>> getDeserializedProperties() {
        return this.deserializedProperties;
    }

    public void setDeserializedProperties(List<List<String>> modifiedAttrs) {
        this.deserializedProperties = modifiedAttrs;
    }
}
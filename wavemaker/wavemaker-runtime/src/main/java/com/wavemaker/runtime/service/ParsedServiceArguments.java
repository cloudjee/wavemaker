/*
 *  Copyright (C) 2009-2011 VMware, Inc. All rights reserved.
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

import java.util.List;

import com.wavemaker.runtime.server.InternalRuntime;

/**
 * This class contains parsed service arguments. It should be extended to contain any extra information that the
 * servicetype requires to be passed from argument parsing to method invocation.
 * 
 * @author Matt Small
 */
public class ParsedServiceArguments {

    /**
     * The parsed arguments.
     */
    private Object[] arguments;

    /**
     * The getters called while de-serializing the arguments. See {@link InternalRuntime#getDeserializedProperties()}.
     */
    private List<List<String>> gettersCalled;

    public Object[] getArguments() {
        return this.arguments;
    }

    public void setArguments(Object[] arguments) {
        this.arguments = arguments;
    }

    public List<List<String>> getGettersCalled() {
        return this.gettersCalled;
    }

    public void setGettersCalled(List<List<String>> gettersCalled) {
        this.gettersCalled = gettersCalled;
    }
}
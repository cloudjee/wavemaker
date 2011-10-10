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

import java.lang.reflect.Method;

import com.wavemaker.runtime.service.reflect.ReflectServiceType;

/**
 * An abstract form of the {@link LiveDataService} interface.
 * 
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public abstract class AbstractLiveDataService implements LiveDataService {

    /**
     * Get a method in the current object with the specified name which can take the arguments passed in (number of
     * arguments is checked, types are not). This method follows the same rules as for a JSON-RPC invoke; if there is
     * more than one possible match with the same number of arguments, an exception is thrown.
     * 
     * @param methodName The method to search for.
     * @param arguments The arguments which will be passed in; only the number of arguments is checked, not the type.
     * @return The Method instance corresponding with the methodName and arguments parameters.
     * @throws MethodInvokeException If the method is not found or the match isn't strict.
     */
    protected Method findMethod(String methodName, Object[] arguments) {

        return ReflectServiceType.findMethod(methodName, this, arguments.length);
    }
}
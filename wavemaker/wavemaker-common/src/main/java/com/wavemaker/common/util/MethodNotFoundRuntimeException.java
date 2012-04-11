/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.common.util;

import com.wavemaker.common.WMRuntimeException;

/**
 * Add more details about method we're trying to invoke here.
 * 
 * @author Simon Toens
 */
public class MethodNotFoundRuntimeException extends WMRuntimeException {

    private static final long serialVersionUID = 8357388984474566566L;

    public MethodNotFoundRuntimeException(String name, Class<?> clazz, Class<?>[] paramTypes) {
        super(getExMessage(name, clazz, paramTypes));
    }

    public static String getExMessage(String name, Class<?> clazz, Class<?>[] paramTypes) {
        StringBuilder sb = new StringBuilder();

        sb.append("\"" + clazz.getName() + "\" does not have method \"" + name + "\"");

        if (paramTypes != null) {

            if (paramTypes.length > 0) {

                sb.append(" params:");

                for (int i = 0; i < paramTypes.length; i++) {
                    sb.append(paramTypes[i].getName());
                    if (i < paramTypes.length - 1) {
                        sb.append(",");
                    }
                }
            }
        }
        return sb.toString();
    }

}

/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
package com.wavemaker.runtime.server;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * ParamName provides a way to expose the name of method parameters at runtime.
 * It is recommended that the exposed name match the actual parameter name; for
 * instance:
 * 
 * <code>
 *      public String doUpload(@ParamName(name="file") MultipartFile file,
 *              @ParamName(name="str") String str)
 * </code>
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.PARAMETER)
public @interface ParamName {

    /**
     * The name of the parameter.  This must match the name in the GET or POST
     * parameters, and should match the Java method signature, as well.
     */
    String name();
}
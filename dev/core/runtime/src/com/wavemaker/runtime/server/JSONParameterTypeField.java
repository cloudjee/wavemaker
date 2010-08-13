/*
 *  Copyright (C) 2007-2010 WaveMaker Software, Inc.
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
 * JSONParameterTypeField provides a mechanism to override the default type
 * lookups.  It is to be used on parameters; each parameter annotated will have
 * its time translated according to the information in the annotation.
 * 
 * For instance, <code>@JSONParameterTypeField(typeParameter=1)</code>
 * indicates that parameter 1 to the function contains the type for the
 * parameter with this annotation.
 * 
 * <code>
 *      public void someMethod(
 *              @JSONParameterTypeField(typeParameter=1) Object instance,
 *              String type);
 * </code>
 * 
 * And a call to that method:
 * 
 * <code>
 *      someClass.someMethod("asdfk", "java.lang.String");
 * </code>
 *      
 *      
 * @author small
 * @version $Rev$ - $Date$
 *
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.PARAMETER)
public @interface JSONParameterTypeField {
    
    /**
     * The parameter (index, 0-based) containing type information for the
     * parameter with the typeParameter annotation.
     */
    int typeParameter();
}
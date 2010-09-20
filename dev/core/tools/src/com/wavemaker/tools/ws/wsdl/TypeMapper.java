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
package com.wavemaker.tools.ws.wsdl;

import java.util.List;

import javax.xml.namespace.QName;

import com.wavemaker.runtime.service.ElementType;

/**
 * Used by <code>WSDL</code> to do QName to Java type conversion.
 * 
 * @author Frankie Fu
 *
 */
public interface TypeMapper {

    /**
     * Returns the Java type name.
     *
     * @param schemaType The name of the XML element to be mapped.
     * @param isElement True if the QName represents an element.
     * @return Returns a string that represents the particular type.
     */
    public String getJavaType(QName schemaType, boolean isElement);

    /**
     * Converts a string into an identifier suitable for bean properties.
     * 
     * @param name The name to be converted.
     * @return A string identifier suitable for bean properties.
     */
    public String toPropertyName(String name);
    
    /**
     * Returns <code>true</code> if the <code>QName</code> is a simple type.
     * 
     * @return <code>true</code> if the <code>QName</code> is a simple type.
     */
    public boolean isSimpleType(QName schemaType);

    /**
     * Returns a list of all types in this mapper.  The returned list should
     * not include simple types like int, String...
     *
     * @param serviceId The service Id. //xxx
     * @return A list of all types.
     */
    public List<ElementType> getAllTypes(String serviceId);
}

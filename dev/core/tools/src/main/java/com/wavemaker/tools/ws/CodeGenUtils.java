/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.ws;

import java.io.File;

import com.sun.xml.bind.api.impl.NameConverter;

/**
 * @author Frankie Fu
 */
public class CodeGenUtils {

    /**
     * Constructs a Java package name based on the given namespace and service ID.
     * 
     * @param namespaceURI The namespace URI to be converted.
     * @param serviceId The service ID.
     * @return A Java package name.
     */
    public static String constructPackageName(String namespaceURI, String serviceId) {
        return NameConverter.standard.toPackageName(namespaceURI) + "." + serviceId.toLowerCase();
    }

    /**
     * Converts the package name to directory path equivalent.
     * 
     * @param baseDir The base directory.
     * @param packageName The Java package name.
     * @return The equivalent Directory for the WSDL's package name.
     */
    public static File getPackageDir(File baseDir, String packageName) {
        if (packageName == null) {
            return baseDir;
        } else {
            return new File(baseDir, packageName.replace('.', File.separatorChar));
        }
    }

    /**
     * Converts a string suitable for classes.
     * 
     * @param name The name to be converted.
     * @return A name suitable for classes.
     */
    public static String toClassName(String name) {
        return NameConverter.standard.toClassName(name);
    }

    /**
     * Converts a string suitable for properties.
     * 
     * @param name The name to be converted.
     * @return A name suitable for properties.
     */
    public static String toPropertyName(String name) {
        String s = NameConverter.standard.toPropertyName(name);
        if (s.length() > 1 && !Character.isUpperCase(s.charAt(1))) {
            StringBuilder sb = new StringBuilder(s.length());
            sb.append(Character.toLowerCase(s.charAt(0)));
            sb.append(s.substring(1));
            return sb.toString();
        } else if (s.length() == 1) {
            s = s.toLowerCase();
        }
        return s;
    }

    /**
     * Converts a string suitable for properties. The first letter of the property is NOT shifted to lower case.
     *
     * @param name The name to be converted.
     * @return A name suitable for properties.
     */
    public static String toPropertyNameNoCaseShift(String name) {
        String s;
        if (name.length() > 1) {
            String firstChar = name.substring(0, 1);
            s = NameConverter.standard.toPropertyName(name);
            s = firstChar + s.substring(1);
        } else {
            s = name;
        }
        return s;
    }
    
    /**
     * Converts a string into an identifier suitable for variables.
     * 
     * @param name The name to be converted.
     * @return A name suitable for variables.
     */
    public static String toVariableName(String name) {
        return NameConverter.standard.toVariableName(name);
    }

    /**
     * Converts a string suitable for Java methods.
     * 
     * @param name The name to be converted
     * @return A name suitable for Java methods.
     */
    public static String toJavaMethodName(String name) {
        return NameConverter.standard.toVariableName(name);
    }
}

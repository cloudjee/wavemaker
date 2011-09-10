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

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class Filter {

    private static final String FORMAT_ERROR = "filter must be of format: <property>=<value>";
    
    private static final String FILTER_SEP = "=";
    
    public static Filter newInstance(String filter) {
        if (filter == null) {
            throw new IllegalArgumentException("filter cannot be null");
        }
        int i = filter.indexOf(FILTER_SEP);
        if (i == -1 || i == 0) {
            throw new IllegalArgumentException(FORMAT_ERROR);
        }
        
        String propertyPath = filter.substring(0, i);
        String expression = "";
        
        if (i < filter.length()-1) {
            expression = filter.substring(i+1);
        }

        return new Filter(propertyPath, expression);        
    }

    private final String propertyPath;

    private final String expression;
    
    public Filter(String propertyPath, String expression) {
        this.propertyPath = propertyPath;
        this.expression = expression;
    }

    public String getPropertyPath() {
        return propertyPath;
    }

    public String getExpression() {
        return expression;
    }

    public String toString() {
        return propertyPath + FILTER_SEP + expression;
    }

}

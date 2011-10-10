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

package com.wavemaker.tools.service.smd;

import java.util.List;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class Method implements Comparable<Method> {

    private String name;

    private String returnType;

    private List<Param> parameters;

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Comparable#compareTo(java.lang.Object)
     */
    public int compareTo(Method o) {

        // first, check the names
        int nameCompare = this.getName().compareTo(o.getName());
        if (0 != nameCompare) {
            return nameCompare;
        }

        int thisParamSize = null != this.getParameters() ? this.getParameters().size() : 0;
        int oParamSize = null != o.getParameters() ? o.getParameters().size() : 0;
        return thisParamSize - oParamSize;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getReturnType() {
        return this.returnType;
    }

    public void setReturnType(String returnType) {
        this.returnType = returnType;
    }

    public List<Param> getParameters() {
        return this.parameters;
    }

    public void setParameters(List<Param> parameters) {
        this.parameters = parameters;
    }
}
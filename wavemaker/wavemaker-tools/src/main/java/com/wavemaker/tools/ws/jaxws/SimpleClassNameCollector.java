/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.ws.jaxws;

import java.util.Set;

import com.sun.tools.ws.processor.util.ClassNameCollector;

/**
 * This class is intended to be used by <code>com.sun.tools.ws.processor.modeler.wsdl.ClassNameAllocatorImpl</code> to
 * get a a list of generated SEI service class names so JAXB could use something else if there is a name collision.
 * 
 * @author Frankie Fu
 */
public class SimpleClassNameCollector extends ClassNameCollector {

    private final Set<String> seiClasses;

    /**
     * Constructor.
     * 
     * @param seiClasses A set of fully qualified SEI service class names.
     */
    public SimpleClassNameCollector(Set<String> seiClasses) {
        this.seiClasses = seiClasses;
    }

    @Override
    public Set<String> getSeiClassNames() {
        return this.seiClasses;
    }
}

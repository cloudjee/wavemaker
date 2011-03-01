/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
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
package com.wavemaker.tools.data;

import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.Tuple;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class TypeInfo {

    private final String name;

    private final String fqName;

    public TypeInfo(String fqName) {
        Tuple.Two<String, String> t = StringUtils.splitPackageAndClass(fqName);
        this.fqName = fqName;
        this.name = t.v2;
    }

    public TypeInfo(String name, String packageName) {
        this.name = name;
        this.fqName = StringUtils.fq(packageName, name);
    }

    public String getName() { return name; }

    public String getFullyQualifiedName() { return fqName; }

    public String toString() { return fqName; }
}

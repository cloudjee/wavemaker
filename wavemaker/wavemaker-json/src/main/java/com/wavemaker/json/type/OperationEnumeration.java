/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.json.type;

/**
 * Enumeration of operation types (currently, just the LiveService operations). When changing this, be sure to change
 * servicedef.xsd, too.
 * 
 * @see com.wavemaker.runtime.service.LiveDataService for more information, and the interface providing the operations
 *      enumerated here.
 * 
 * @author Matt Small
 */
public enum OperationEnumeration {

    // XXX bad - should be uppercase
    read("read"), update("update"), delete("delete"), insert("insert");

    private String value;

    private OperationEnumeration(String v) {
        this.value = v;
    }

    public String value() {
        return this.value;
    }

    public static OperationEnumeration fromValue(String v) {
        for (OperationEnumeration c : OperationEnumeration.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

    public static String toString(OperationEnumeration v) {
        return v.value();
    }
}
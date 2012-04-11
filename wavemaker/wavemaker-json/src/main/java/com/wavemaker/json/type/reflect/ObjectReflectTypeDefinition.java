/*
 *  Copyright (C) 2009-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.json.type.reflect;

import java.util.LinkedHashMap;

import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.ObjectTypeDefinition;

/**
 * @author Matt Small
 */
public class ObjectReflectTypeDefinition extends ReflectTypeDefinition implements ObjectTypeDefinition {

    /**
     * Map of all fields; this should be entered by the natural order of the fields.
     */
    private LinkedHashMap<String, FieldDefinition> fields = new LinkedHashMap<String, FieldDefinition>();

    @Override
    public LinkedHashMap<String, FieldDefinition> getFields() {
        return this.fields;
    }

    public void setFields(LinkedHashMap<String, FieldDefinition> fields) {
        this.fields = fields;
    }
}
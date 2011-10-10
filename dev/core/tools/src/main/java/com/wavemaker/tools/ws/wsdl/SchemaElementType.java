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

package com.wavemaker.tools.ws.wsdl;

import javax.xml.namespace.QName;

import com.wavemaker.runtime.service.ElementType;

/**
 * Schema specific <code>ElementType</code> class.
 * 
 * @author Frankie Fu
 * 
 */
public class SchemaElementType extends ElementType {

    private QName schemaType;

    private long minOccurs;

    private long maxOccurs;

    public SchemaElementType(String name, QName schemaType, String javaType) {
        super(name, javaType, false);
        this.schemaType = schemaType;
    }

    public SchemaElementType(String name, QName schemaType, String javaType, long minOccurs, long maxOccurs) {
        this(name, schemaType, javaType);
        this.minOccurs = minOccurs;
        this.maxOccurs = maxOccurs;
    }

    public QName getSchemaType() {
        return this.schemaType;
    }

    public void setSchemaTypeType(QName schemaType) {
        this.schemaType = schemaType;
    }

    public long getMinOccurs() {
        return this.minOccurs;
    }

    public void setMinOccurs(long minOccurs) {
        this.minOccurs = minOccurs;
    }

    public long getMaxOccurs() {
        return this.maxOccurs;
    }

    public void setMaxOccurs(long maxOccurs) {
        this.maxOccurs = maxOccurs;
    }

    @Override
    public boolean isList() {
        return this.maxOccurs > 1;
    }

}

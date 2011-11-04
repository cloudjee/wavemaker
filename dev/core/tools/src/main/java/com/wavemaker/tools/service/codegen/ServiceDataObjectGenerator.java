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

package com.wavemaker.tools.service.codegen;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import com.wavemaker.common.util.StringUtils;
import com.wavemaker.tools.service.definitions.DataObject;
import com.wavemaker.tools.service.definitions.Service;

/**
 * Generate DataObjects based on a com.wavemaker.tools.service.definitions.Service
 * 
 * @author Simon Toens
 */
public class ServiceDataObjectGenerator {

    private final Service service;

    private final Class<?> collectionType;

    private Collection<String> serializableTypes = Collections.emptySet();

    private Collection<String> equalsHashCodeTypes = Collections.emptySet();

    private int index = 0;

    public ServiceDataObjectGenerator(Service service) {
        this(service, Collection.class);
    }

    public ServiceDataObjectGenerator(Service service, Class<?> collectionType) {
        this.service = service;
        this.collectionType = collectionType;
    }

    public String getCurrentTypeName() {
        DataObject o = getCurrentDataObject();
        return o.getJavaType();
    }

    public boolean hasNext() {
        return this.index < this.service.getDataobjects().getDataobject().size();
    }

    public void generateNext(OutputStream os) throws IOException {
        DataObject o = getCurrentDataObject();
        setupGenerator(o).generate(os);
        this.index++;
    }

    public void setSerializableTypes(Collection<String> serializableTypes) {
        this.serializableTypes = serializableTypes;
    }

    public void setEqualsHashCodeTypes(Collection<String> equalsHashCodeTypes) {
        this.equalsHashCodeTypes = equalsHashCodeTypes;
    }

    private DataObject getCurrentDataObject() {
        List<DataObject> l = this.service.getDataobjects().getDataobject();
        if (this.index == l.size()) {
            throw new IndexOutOfBoundsException();
        }
        return l.get(this.index);
    }

    private BeanGenerator setupGenerator(DataObject o) {
        BeanGenerator rtn = new BeanGenerator(o.getJavaType());
        rtn.addSimpleTypesOnlyCtor();
        rtn.initCollections();
        rtn.addClassJavadoc(" " + this.service.getId() + "." + o.getName() + "\n" + StringUtils.getFormattedDate());

        if (this.serializableTypes.contains(o.getJavaType())) {
            rtn.implSerializable();
        }

        if (this.equalsHashCodeTypes.contains(o.getJavaType())) {
            rtn.addEqualsHashCode();
        }

        for (DataObject.Element element : o.getElement()) {
            String name = element.getName();
            String type = element.getTypeRef();
            BeanGenerator.PropertyDescriptor pd = rtn.addProperty(name, type);
            if (element.isIsList()) {
                pd.setCollectionType(this.collectionType);
            }
        }
        return rtn;
    }

}

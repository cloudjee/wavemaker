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

package com.wavemaker.runtime.data;

import com.wavemaker.runtime.service.ElementType;

/**
 * @author stoens
 * @version $Rev$ - $Date$
 * 
 */
public interface DataServiceInternal {

    public static interface ElementTypeFactory {

        ElementType getElementType(String javaType);
    }

    static final ElementTypeFactory DEFAULT_ELEMENT_TYPE_FACTORY = new ElementTypeFactory() {

        public ElementType getElementType(String javaType) {
            return new ElementType(javaType);
        }
    };

    String getDataPackage();

    DataServiceOperation getOperation(String operationName);

    void setElementTypeFactory(ElementTypeFactory elementTypeFactory);

    void setExternalConfig(ExternalDataModelConfig externalConfig);

}

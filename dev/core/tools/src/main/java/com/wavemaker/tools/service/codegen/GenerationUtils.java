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

import com.sun.codemodel.JCodeModel;
import com.sun.codemodel.JType;
import com.wavemaker.common.util.Tuple;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class GenerationUtils {

    public static Tuple.Two<String, String> splitGenericType(String type) {
        int i = type.indexOf("<");
        int j = type.indexOf(">");
        if (i != -1 && j != -1) {
            return Tuple.tuple(type.substring(0, i), type.substring(i+1, j));
        } 
        return null;
    }

    public static JType getGenericCollectionType(JCodeModel codeModel,
            String collectionType, JType type) throws ClassNotFoundException {
        return getGenericCollectionType(codeModel, collectionType, type
                .fullName());
    }

    public static JType getGenericCollectionType(JCodeModel codeModel,
            String collectionType, String type) throws ClassNotFoundException {
        return codeModel.parseType(collectionType + "<" + type + ">");
    }

    private GenerationUtils() {
        throw new UnsupportedOperationException();
    }
}

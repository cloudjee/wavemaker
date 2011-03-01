/*
 *  Copyright (C) 2009-2011 WaveMaker Software, Inc.
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
package com.wavemaker.json.type.reflect;

import java.io.IOException;
import java.io.Writer;

import com.wavemaker.json.core.JSONUtils;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class EnumPrimitiveReflectTypeDefinition extends
        PrimitiveReflectTypeDefinition {

    /* (non-Javadoc)
     * @see com.wavemaker.json.type.reflect.ReflectTypeDefinition#newInstance(java.lang.Object[])
     */
    @Override
    @SuppressWarnings("unchecked")
    public Object newInstance(Object... args) {
        
        Class<?> klass = getKlass();

        Object ret = fromStringValue((Class<Enum>)klass,
                (String) super.newInstance(args[0], String.class));
        
        if (null==ret) {
            ret = Enum.valueOf((Class<Enum>)klass,
                    (String) super.newInstance(args[0], String.class));
        }
        
        return ret;
    }

    /* (non-Javadoc)
     * @see com.wavemaker.json.type.reflect.PrimitiveReflectTypeDefinition#toJson(java.io.Writer, java.lang.Object)
     */
    @Override
    public void toJson(Writer writer, Object obj) throws IOException {
        writer.write(JSONUtils.quote(obj.toString()));
    }
    
    private static <T extends Enum<T>> T fromStringValue(Class<T> enumType,
            String value) {
        
        T[] constants = enumType.getEnumConstants();
        
        for (T constant: constants) {
            if (value.equals(constant.toString())) {
                return constant;
            }
        }
        
        return null;
    }
}
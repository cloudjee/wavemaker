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
package com.wavemaker.runtime.server.json.converters;

import java.io.IOException;
import java.io.Writer;
import java.sql.Clob;
import java.sql.SQLException;

import org.apache.commons.io.IOUtils;
import org.hibernate.lob.ClobImpl;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSONMarshaller;
import com.wavemaker.json.type.converters.ReadObjectConverter;
import com.wavemaker.json.type.converters.WriteObjectConverter;
import com.wavemaker.json.type.reflect.PrimitiveReflectTypeDefinition;
import com.wavemaker.json.type.reflect.ReflectTypeUtils;

/**
 * TypeDefinition for types extending from {@link Clob}.
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
public class ClobTypeDefinition extends PrimitiveReflectTypeDefinition
        implements ReadObjectConverter, WriteObjectConverter {
    
    public ClobTypeDefinition(Class<? extends Clob> klass) {
        
        super();
        this.setKlass(klass);
        this.setTypeName(ReflectTypeUtils.getTypeName(this.getKlass()));
    }
    
    /* (non-Javadoc)
     * @see com.wavemaker.json.type.converters.ReadObjectConverter#readObject(java.lang.Object, java.lang.Object, java.lang.String)
     */
    public Object readObject(Object input, Object root, String path) {
        
        if (null==input) {
            return null;
        } else if (String.class.isAssignableFrom(input.getClass())) {
            return new ClobImpl((String) input);
        } else {
            return input;
        }
    }

    public void writeObject(Object input, Object root, String path,
            Writer writer) throws IOException {
        
        if (null==input) {
            JSONMarshaller.marshal(writer, input);
        } else if (input instanceof Clob) {
            try {
                String str = IOUtils.toString(((Clob) input).getCharacterStream());
                JSONMarshaller.marshal(writer, str);
            } catch (SQLException e) {
                throw new WMRuntimeException(e);
            }
        } else {
            throw new WMRuntimeException(Resource.JSON_UNHANDLED_TYPE, input,
                    input.getClass());
        }
    }
}
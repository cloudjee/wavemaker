/*
 *  Copyright (C) 2009 WaveMaker Software, Inc.
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
package com.wavemaker.runtime.server.nonbean.types;

import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSONMarshaller;
import com.wavemaker.runtime.server.nonbean.NonBeanTypeFactory;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class FooArg1TypeDefinition extends NonBeanPrimitiveTypeDefinition {

    /* (non-Javadoc)
     * @see com.wavemaker.json.type.TypeDefinition#getTypeName()
     */
    public String getTypeName() {
        return NonBeanTypeFactory.FOO_ARG_1;
    }

    /* (non-Javadoc)
     * @see com.wavemaker.json.type.TypeDefinition#getShortName()
     */
    public String getShortName() {
        return null;
    }

    /* (non-Javadoc)
     * @see com.wavemaker.json.type.TypeDefinition#isLiveService()
     */
    public boolean isLiveService() {
        return false;
    }

    /* (non-Javadoc)
     * @see com.wavemaker.json.type.TypeDefinition#newInstance(java.lang.Object[])
     */
    public Object newInstance(Object... args) {
        
        if (!(args[0] instanceof Map)) {
            throw new WMRuntimeException("expected map, was: "+args);
        }
        
        int ret = 0;
        for (Entry<?, ?> entry: ((Map<?, ?>) args[0]).entrySet()) {
            ret += entry.getKey().toString().length() +
                entry.getValue().toString().length();
        }
        return ret;
    }

    /* (non-Javadoc)
     * @see com.wavemaker.runtime.server.nonbean.types.NonBeanPrimitiveTypeDefinition#toJson(java.io.Writer, java.lang.Object)
     */
    @Override
    public void toJson(Writer writer, Object obj) throws IOException {
        List<String> list = new ArrayList<String>();
        list.add(obj.toString());
        JSONMarshaller.marshal(writer, list);
    }
}
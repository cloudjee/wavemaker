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

package com.wavemaker.tools.spring;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.ObjectTypeDefinition;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.json.type.reflect.ReflectTypeState;
import com.wavemaker.json.type.reflect.ReflectTypeUtils;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.runtime.service.AbstractLiveDataService;
import com.wavemaker.runtime.service.PagingOptions;
import com.wavemaker.runtime.service.PropertyOptions;
import com.wavemaker.runtime.service.TypedServiceReturn;
import com.wavemaker.runtime.service.response.LiveDataServiceResponse;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class MultipleReturnsRuntimeServiceBean extends AbstractLiveDataService {

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.LiveDataService#delete(java.lang.Object)
     */
    @Override
    public void delete(Object o) throws Exception {
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.LiveDataService#insert(java.lang.Object)
     */
    @Override
    public Object insert(Object o) throws Exception {
        return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.LiveDataService#read(com.wavemaker.json.type.TypeDefinition, java.lang.Object,
     * com.wavemaker.runtime.service.PropertyOptions, com.wavemaker.runtime.service.PagingOptions)
     */
    @Override
    public TypedServiceReturn read(TypeDefinition type, Object o, PropertyOptions propertyOptions, PagingOptions pagingOptions) throws Exception {

        TypedServiceReturn tsr = new TypedServiceReturn();

        if (type.getTypeName().equals(RawObjectNoType.class.getName())) {
            RawObjectNoType raw = new RawObjectNoType();
            raw.setA("aVal");
            tsr.setReturnValue(raw);
        } else if (type.getTypeName().equals(RawObjectType.class.getName())) {
            RawObjectType raw = new RawObjectType();
            raw.setB("bVal");
            tsr.setReturnValue(raw);

            FieldDefinition rawField = ReflectTypeUtils.getFieldDefinition(RawObjectType.class, new ReflectTypeState(), false, null);
            tsr.setReturnType(rawField);
        } else if (type.getTypeName().equals(WrappedObjectNoType.class.getName())) {
            WrappedObjectNoType wrap = new WrappedObjectNoType();
            wrap.setC("cVal");

            LiveDataServiceResponse resp = new LiveDataServiceResponse();
            resp.setResult(wrap);

            tsr.setReturnValue(resp);
        } else if (type.getTypeName().equals(WrappedObjectType.class.getName())) {
            WrappedObjectType wrap = new WrappedObjectType();
            wrap.setD("dVal");

            LiveDataServiceResponse resp = new LiveDataServiceResponse();
            resp.setResult(wrap);

            tsr.setReturnValue(resp);

            FieldDefinition wrapField = ReflectTypeUtils.getFieldDefinition(WrappedObjectType.class, new ReflectTypeState(), false, null);
            FieldDefinition liveDataField = ReflectTypeUtils.getFieldDefinition(LiveDataServiceResponse.class, new ReflectTypeState(), false, null);
            ((ObjectTypeDefinition) liveDataField.getTypeDefinition()).getFields().put(ServerConstants.RESULTS_PART, wrapField);

            tsr.setReturnType(liveDataField);
        } else {
            throw new WMRuntimeException("unrecognized type: " + type);
        }

        return tsr;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.LiveDataService#update(java.lang.Object)
     */
    @Override
    public Object update(Object o) throws Exception {
        return null;
    }

    public static class RawObjectNoType {

        private String a;

        public String getA() {
            return this.a;
        }

        public void setA(String a) {
            this.a = a;
        }
    }

    public static class RawObjectType {

        private String b;

        public void setB(String b) {
            this.b = b;
        }

        public String getB() {
            return this.b;
        }
    }

    public static class WrappedObjectNoType {

        private String c;

        public void setC(String c) {
            this.c = c;
        }

        public String getC() {
            return this.c;
        }
    }

    public static class WrappedObjectType {

        private String d;

        public void setD(String d) {
            this.d = d;
        }

        public String getD() {
            return this.d;
        }
    }
}
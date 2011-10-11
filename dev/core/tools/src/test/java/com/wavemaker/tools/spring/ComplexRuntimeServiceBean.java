/*
 *  Copyright (C) 2007-2009 WaveMaker Software, Inc.
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
import com.wavemaker.json.TestJSONSerialization.CycleA;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.ObjectTypeDefinition;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.json.type.reflect.ReflectTypeState;
import com.wavemaker.json.type.reflect.ReflectTypeUtils;
import com.wavemaker.runtime.service.AbstractLiveDataService;
import com.wavemaker.runtime.service.PagingOptions;
import com.wavemaker.runtime.service.PropertyOptions;
import com.wavemaker.runtime.service.TypedServiceReturn;
import com.wavemaker.runtime.service.response.LiveDataServiceResponse;

/**
 * @author small
 * @version $Rev:22671 $ - $Date:2008-05-30 14:29:23 -0700 (Fri, 30 May 2008) $
 * 
 */
public class ComplexRuntimeServiceBean extends AbstractLiveDataService {

    // service methods
    public int getInt(int input) {
        return input + 1000;
    }

    public int getInt() {
        return -1;
    }

    public void setInt(int in) {
    }

    private int i = 0;

    private boolean eventCalled = false;

    public void setI(int i) {
        this.i = i;
    }

    public int getI() {
        return this.i;
    }

    public boolean getEventCalled() {
        return this.eventCalled;
    }

    public void setEventCalled(boolean eventCalled) {
        this.eventCalled = eventCalled;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.LiveDataService#read(com.wavemaker.json.type.TypeDefinition, java.lang.Object,
     * com.wavemaker.runtime.service.PropertyOptions, com.wavemaker.runtime.service.PagingOptions)
     */
    @Override
    public TypedServiceReturn read(TypeDefinition type, Object instance, PropertyOptions propertyOptions, PagingOptions pagingOptions) {
        Object ret;
        ComplexRuntimeServiceBean crsb = (ComplexRuntimeServiceBean) instance;
        FieldDefinition retFD;

        if (null == instance && type.getTypeName().equals(Integer.class.getName())) {
            crsb = new ComplexRuntimeServiceBean();
            crsb.setI(50);
            ret = crsb;
        } else if (null == instance && type.getTypeName().equals(ComplexRuntimeServiceBean.class.getName())) {
            crsb = new ComplexRuntimeServiceBean();
            crsb.setI(60);
            ret = crsb;
        } else if (null == instance && type.getTypeName().equals(CycleA.class.getName())) {
            ret = ComplexReturnBean.getCycle();
        } else if (null == instance) {
            throw new WMRuntimeException("unknown type: " + type);
        } else if (instance instanceof ComplexRuntimeServiceBean) {
            crsb.setI(crsb.getI() + 1000);
            ret = crsb;
        } else {
            ret = crsb;
        }

        retFD = ReflectTypeUtils.getFieldDefinition(ret.getClass(), new ReflectTypeState(), false, null);

        if (this.eventCalled) {
            crsb.setI(crsb.getI() + 500);
        }

        LiveDataServiceResponse response = new LiveDataServiceResponse();
        response.setResult(ret);

        TypedServiceReturn tsr = new TypedServiceReturn();
        tsr.setReturnValue(response);

        FieldDefinition fd = ReflectTypeUtils.getFieldDefinition(LiveDataServiceResponse.class, new ReflectTypeState(), false, null);
        ObjectTypeDefinition otd = (ObjectTypeDefinition) fd.getTypeDefinition();
        otd.getFields().put("result", retFD);
        tsr.setReturnType(fd);

        return tsr;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.LiveDataService#delete(java.lang.Object)
     */
    @Override
    public void delete(Object objectToDelete) {
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.LiveDataService#insert(java.lang.Object)
     */
    @Override
    public Object insert(Object objectToInsert) {
        return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.LiveDataService#update(java.lang.Object)
     */
    @Override
    public Object update(Object objectToUpdate) {
        return null;
    }
}

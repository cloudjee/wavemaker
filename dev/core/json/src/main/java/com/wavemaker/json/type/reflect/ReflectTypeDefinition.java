/*
 *  Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.type.TypeDefinition;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public abstract class ReflectTypeDefinition implements TypeDefinition {
    
    /**
     * Often, this will be the backing Java class' canonical name.
     */
    private String typeName;

    private String shortName;
    
    private Class<?> klass;
    
    private boolean liveService;
    
    
    
    @Override
    public String toString() {
        return "TypeDefinition "+getTypeName()+"("+getClass()+")";
    }

    public Class<?> getKlass() {
        return this.klass;
    }
    
    public void setKlass(Class<?> klass) {
        this.klass = klass;
    }

    /* (non-Javadoc)
     * @see com.wavemaker.json.type.TypeDefinition#getTypeName()
     */
    public String getTypeName() {
        return this.typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }
    
    /* (non-Javadoc)
     * @see com.wavemaker.json.type.TypeDefinition#newInstance(java.lang.Object[])
     */
    public Object newInstance(Object... args) {
        
        try {
            return this.getKlass().newInstance();
        } catch (InstantiationException e) {
            throw new WMRuntimeException(e);
        } catch (IllegalAccessException e) {
            throw new WMRuntimeException(e);
        }
    }

    public void setLiveService(boolean liveService) {
        this.liveService = liveService;
    }

    /* (non-Javadoc)
     * @see com.wavemaker.json.type.TypeDefinition#isLiveService()
     */
    public boolean isLiveService() {
        return liveService;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    /* (non-Javadoc)
     * @see com.wavemaker.json.type.TypeDefinition#getShortName()
     */
    public String getShortName() {
        return shortName;
    }
}
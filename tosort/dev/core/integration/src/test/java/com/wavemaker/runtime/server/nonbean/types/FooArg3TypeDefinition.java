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

import java.util.ArrayList;
import java.util.List;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.server.nonbean.NonBeanTypeFactory;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class FooArg3TypeDefinition extends NonBeanPrimitiveTypeDefinition {

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.json.type.TypeDefinition#getTypeName()
     */
    @Override
    public String getTypeName() {
        return NonBeanTypeFactory.FOO_ARG_3;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.json.type.TypeDefinition#getShortName()
     */
    @Override
    public String getShortName() {
        return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.json.type.TypeDefinition#isLiveService()
     */
    @Override
    public boolean isLiveService() {
        return false;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.json.type.TypeDefinition#newInstance(java.lang.Object[])
     */
    @Override
    public Object newInstance(Object... args) {
        if (!(args[0] instanceof String)) {
            throw new WMRuntimeException("bad args: " + args[0] + " (" + args[0].getClass() + ")");
        }

        List<String> ret = new ArrayList<String>();
        ret.add(args[0].toString());
        return ret;
    }
}
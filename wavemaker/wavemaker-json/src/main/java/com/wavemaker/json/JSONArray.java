/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.json;

import java.io.IOException;
import java.util.ArrayList;

import com.wavemaker.common.WMRuntimeException;

/**
 * @author Matt Small
 */
public class JSONArray extends ArrayList<Object> implements JSON {

    private static final long serialVersionUID = 1L;

    @Override
    public boolean isList() {
        return true;
    }

    @Override
    public boolean isObject() {
        return false;
    }

    @Override
    public String toString() {
        try {
            return JSONMarshaller.marshal(this, new JSONState(), true, true);
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }
}
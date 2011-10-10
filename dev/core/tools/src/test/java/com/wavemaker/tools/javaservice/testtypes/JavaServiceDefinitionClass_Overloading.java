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

package com.wavemaker.tools.javaservice.testtypes;

/**
 * @author small
 * @version $Rev$ - $Date:2008-05-30 14:45:46 -0700 (Fri, 30 May 2008) $
 */
public class JavaServiceDefinitionClass_Overloading {

    public int getInt(int in, int in2) {
        return getInt() + in + in2;
    }

    public int getInt() {
        return 12;
    }

    public int getInt(int in) {
        return getInt() + in;
    }
}

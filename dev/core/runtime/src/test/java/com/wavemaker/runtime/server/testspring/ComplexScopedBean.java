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

package com.wavemaker.runtime.server.testspring;

/**
 * @author Matt Small
 */
public class ComplexScopedBean {

    private BeanClass bc;

    private String str;

    private BeanClass bc2;

    public BeanClass getBc() {
        return this.bc;
    }

    public void setBc(BeanClass bc) {
        this.bc = bc;
    }

    public String getStr() {
        return this.str;
    }

    public void setStr(String str) {
        this.str = str;
    }

    public BeanClass getBc2() {
        return this.bc2;
    }

    public void setBc2(BeanClass bc2) {
        this.bc2 = bc2;
    }
}
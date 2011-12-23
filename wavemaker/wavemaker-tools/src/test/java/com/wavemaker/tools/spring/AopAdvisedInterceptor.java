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

import org.aopalliance.intercept.Interceptor;
import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;

/**
 * @author Matt Small
 */
public class AopAdvisedInterceptor implements Interceptor, MethodInterceptor {

    @Override
    public Object invoke(MethodInvocation invocation) throws Throwable {

        if (invocation.getThis() instanceof AopAdvised && 0 == invocation.getMethod().getName().compareTo("getIval")) {
            AopAdvised aa = (AopAdvised) invocation.getThis();
            aa.setIval(aa.getIval() + 2);
        } else if (invocation.getThis() instanceof AopAdvised && 0 == invocation.getMethod().getName().compareTo("testUpload")) {
            AopAdvised aa = (AopAdvised) invocation.getThis();
            aa.setIval(aa.getIval() + 3);
        }

        Object retVal;
        try {
            retVal = invocation.proceed();
        } finally {
            if (invocation.getThis() instanceof AopAdvised && 0 == invocation.getMethod().getName().compareTo("getIval")) {
                AopAdvised aa = (AopAdvised) invocation.getThis();
                aa.setIval(aa.getIval() - 2);
            } else if (invocation.getThis() instanceof AopAdvised && 0 == invocation.getMethod().getName().compareTo("testUpload")) {
                AopAdvised aa = (AopAdvised) invocation.getThis();
                aa.setIval(aa.getIval() - 3);
            }
        }

        return retVal;
    }
}
/*
 *  Copyright (C) 2008-2009 WaveMaker Software, Inc.
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

package com.wavemaker.common;

import static org.junit.Assert.fail;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import com.wavemaker.common.util.ClassUtils;
import com.wavemaker.runtime.test.TestSpringContextTestCase;

/**
 * @author Simon Toens
 */
public class TestResourceBundle extends TestSpringContextTestCase {

    /**
     * o Make sure that all Resource constants defined in com.wavemaker.common.Resource have a msg defined in a resource
     * bundle
     * 
     * o Make sure the bundle resources are referenced by a single constant in Resource
     * 
     * o Ensure msg params get substituted.
     * 
     * o If a Resource constant claims it has a detailed msg, make sure that is true.
     * 
     * o Checks each msg has a unique id.
     * 
     * Could add a check to ensure all messages defined in the bundle are referenced by constants.
     * 
     */
    @Test
    public void testResolveMessages() throws Exception {

        List<Field> l = ClassUtils.getPublicFields(MessageResource.class, MessageResource.class);

        List<String> checkedNames = new ArrayList<String>();

        List<Integer> checkedIds = new ArrayList<Integer>();

        for (Field f : l) {

            MessageResource r = (MessageResource) f.get(null);

            String resourceName = "\"" + r.getMessageKey() + "\"";
            if (checkedNames.contains(resourceName)) {
                fail("Resource " + resourceName + " is referenced more than once");
            }
            checkedNames.add(resourceName);

            try {
                int id = r.getId();
                if (checkedIds.contains(Integer.valueOf(id))) {
                    fail("Resource " + resourceName + " doesn't have a unique id");
                }
                checkedIds.add(Integer.valueOf(id));
            } catch (NumberFormatException ex) {
                fail("Resource " + resourceName + " doesn't have an id defined");
            }

            Object[] args = getArgs(r);
            String msg = r.getMessage(args);
            if (msg == null) {
                fail("Could not find msg for resource " + resourceName);
            }

            for (int i = 0; i < args.length; i++) {
                String s = "{" + i + "}";
                if (msg.indexOf(s) > -1) {
                    fail("Found unresolved msg param " + s + " for resource " + resourceName + "\nmsg: " + msg + "\nlooking for: " + s
                        + "\nCheck your ' characters!");
                }
            }

            String detailedMsg = r.getDetailMessage(args);
            if (r.hasDetailedMsg() && detailedMsg == null) {
                throw new AssertionError("Resource " + resourceName + " says it has a " + "detailed message, but it doesn't");
            }
        }
    }

    private Object[] getArgs(MessageResource r) {
        Object[] rtn = new Object[r.getNumArgsRequired()];
        for (int i = 0; i < r.getNumArgsRequired(); i++) {
            rtn[i] = "arg-" + i;
        }
        return rtn;
    }

}

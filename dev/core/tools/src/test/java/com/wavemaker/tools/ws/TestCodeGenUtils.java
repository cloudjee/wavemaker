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

package com.wavemaker.tools.ws;

import com.wavemaker.infra.WMTestCase;

/**
 * @author ffu
 * @version $Rev:22673 $ - $Date:2008-05-30 14:45:46 -0700 (Fri, 30 May 2008) $
 * 
 */
public class TestCodeGenUtils extends WMTestCase {

    public void testConstructPackageName() {
        String packageName = CodeGenUtils.constructPackageName("http://schemas.microsoft.com/MSNSearch/2005/09/fex", "MSNSearchService");
        assertEquals("com.microsoft.schemas.msnsearch._2005._09.fex.msnsearchservice", packageName);
        packageName = CodeGenUtils.constructPackageName("http://webservices.amazon.com/AWSECommerceService/2005-10-05", "AmazonRESTService");
        assertEquals("com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice", packageName);
        packageName = CodeGenUtils.constructPackageName("urn:enterprise.soap.sforce.com", "SforceService");
        assertEquals("com.sforce.soap.enterprise.sforceservice", packageName);
        packageName = CodeGenUtils.constructPackageName("com", "test");
        assertEquals("com.test", packageName);
        packageName = CodeGenUtils.constructPackageName("a_a", "test");
        assertEquals("a_a.test", packageName);
    }

    public void testToClassName() {
        assertEquals("Bible", CodeGenUtils.toClassName("bible"));
        assertEquals("BibleBible", CodeGenUtils.toClassName("bible-bible"));
    }

    public void testToPropertyName() {
        assertEquals("name", CodeGenUtils.toPropertyName("Name"));
    }

    public void testToVariableName() {
        assertEquals("name", CodeGenUtils.toVariableName("Name"));
        assertEquals("aName", CodeGenUtils.toVariableName("AName"));
    }

    public void testToJavaMethodName() {
        assertEquals("bibleBible", CodeGenUtils.toJavaMethodName("bible-bible"));
    }
}

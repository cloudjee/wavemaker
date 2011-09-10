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
package com.wavemaker.runtime.server;

import static org.junit.Assert.*;

import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import com.wavemaker.runtime.test.TestSpringContextTestCase;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestFileDownloadController extends TestSpringContextTestCase {

    @Test public void testBasic() throws Exception {

        String contents = "foo";

        MockHttpServletRequest req = new MockHttpServletRequest();
        MockHttpServletResponse resp = new MockHttpServletResponse();
        req.setMethod(FileDownloadController.METHOD_GET);
        req.setRequestURI("/services/complexReturnBean."+ServerConstants.DOWNLOAD_EXTENSION);
        req.setParameter("param1", contents);
        req.setParameter(ServerConstants.METHOD, "testDownload");
        
        invokeService(req, resp);

        assertEquals("text/foo", resp.getContentType());
        assertEquals(contents, resp.getContentAsString());
    }

    @Test public void testBasicNoReturn() throws Exception {

        String contents = "foo";

        MockHttpServletRequest req = new MockHttpServletRequest();
        setRequestAttributes(req);
        MockHttpServletResponse resp = new MockHttpServletResponse();
        req.setMethod(FileDownloadController.METHOD_GET);
        req.setRequestURI("/services/complexReturnBean."+
                ServerConstants.DOWNLOAD_EXTENSION);
        req.setParameter("param1", contents);
        req.setParameter(ServerConstants.METHOD, "testDownloadNoReturn");
        
        invokeService(req, resp);

        assertEquals("", resp.getContentAsString());
    }

    // MAV-2229 - test calling a method that calls LiveData.read()
    @Test public void testDownloadLiveDataValue() throws Exception {

        MockHttpServletRequest req = new MockHttpServletRequest();
        setRequestAttributes(req);
        MockHttpServletResponse resp = new MockHttpServletResponse();
        req.setMethod(FileDownloadController.METHOD_GET);
        req.setRequestURI("/services/complexReturnBean."+
                ServerConstants.DOWNLOAD_EXTENSION);
        req.setParameter(ServerConstants.METHOD, "getLiveDataValue");
        
        invokeService(req, resp);

        assertEquals("return: 50", resp.getContentAsString());
    }
}
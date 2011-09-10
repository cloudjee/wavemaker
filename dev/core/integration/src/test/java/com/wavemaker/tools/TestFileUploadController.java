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
package com.wavemaker.tools;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.util.Map;

import org.junit.Test;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.mock.web.MockMultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.AbstractController;

import com.wavemaker.runtime.server.FileUploadController;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.runtime.test.TestSpringContextTestCase;
import com.wavemaker.tools.spring.ComplexReturnBean;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestFileUploadController extends TestSpringContextTestCase {

    @Test public void testUpload() throws Exception {

        String contents = "foo";

        MockMultipartHttpServletRequest req = new MockMultipartHttpServletRequest();
        setRequestAttributes(req);
        MockHttpServletResponse resp = new MockHttpServletResponse();
        req.setMethod(AbstractController.METHOD_POST);
        req.setParameter("param1", "bar");
        req.setParameter(ServerConstants.METHOD, "testUpload");
        req.addFile(new MockMultipartFile("param2", contents.getBytes()));
        req.setRequestURI("/services/complexReturnBean."+ServerConstants.UPLOAD_EXTENSION);

        FileUploadController sc = (FileUploadController) getApplicationContext()
            .getBean("agFileUploadController");
        ModelAndView mav = sc.handleRequest(req, resp);
        assertNotNull(mav);
        assertNotNull(mav.getModel());
        Map<?,?> model = mav.getModel();
        assertTrue(model.containsKey(ServerConstants.RESULTS_PART));
        assertEquals("bar"+contents, model.get(ServerConstants.RESULTS_PART));
    }

    @Test public void testUploadNoRet() throws Exception {

        String contents = "foo";

        MockMultipartHttpServletRequest req = new MockMultipartHttpServletRequest();
        setRequestAttributes(req);
        MockHttpServletResponse resp = new MockHttpServletResponse();
        req.setMethod(AbstractController.METHOD_POST);
        req.setParameter("param1", "bar");
        req.setParameter(ServerConstants.METHOD, "testUploadNoRet");
        req.addFile(new MockMultipartFile("param2", contents.getBytes()));
        req.setRequestURI("/services/complexReturnBean."+ServerConstants.UPLOAD_EXTENSION);

        FileUploadController sc = (FileUploadController) getApplicationContext()
            .getBean("agFileUploadController");
        ModelAndView mav = sc.handleRequest(req, resp);
        assertNotNull(mav);
        assertNotNull(mav.getModel());
        assertEquals(1, mav.getModel().size());
        assertNull(mav.getModel().get(ServerConstants.RESULTS_PART));
    }

    @Test public void testExtendedCharsStringResponse() throws Exception {

        MockMultipartHttpServletRequest req = new MockMultipartHttpServletRequest();
        setRequestAttributes(req);
        MockHttpServletResponse resp = new MockHttpServletResponse();
        req.setMethod(AbstractController.METHOD_POST);
        req.setParameter(ServerConstants.METHOD, "getExtendedCharsString");
        req.setRequestURI("/services/complexReturnBean."+ServerConstants.UPLOAD_EXTENSION);

        FileUploadController sc = (FileUploadController) getApplicationContext()
            .getBean("agFileUploadController");
        ModelAndView mav = sc.handleRequest(req, resp);

        mav.getView().render(mav.getModel(), req, resp);
        String result = resp.getContentAsString();
        assertEquals("<html><textarea>{\"result\":\""+
                ComplexReturnBean.EXTENDED_CHARS_TEST_STR+"\"}</textarea></html>",
                result);
    }
    
    @Test public void testAopAdvised() throws Exception {
        
        String contents = "foo";
        
        MockMultipartHttpServletRequest req = new MockMultipartHttpServletRequest();
        setRequestAttributes(req);
        MockHttpServletResponse resp = new MockHttpServletResponse();
        req.setMethod(AbstractController.METHOD_POST);
        req.setParameter("param1", "bar");
        req.setParameter(ServerConstants.METHOD, "testUpload");
        req.addFile(new MockMultipartFile("param2", contents.getBytes()));
        req.setRequestURI("/services/aopAdvisedServiceBean."+ServerConstants.UPLOAD_EXTENSION);

        FileUploadController sc = (FileUploadController) getApplicationContext()
            .getBean("agFileUploadController");
        ModelAndView mav = sc.handleRequest(req, resp);
        
        mav.getView().render(mav.getModel(), req, resp);
        String result = resp.getContentAsString();
        assertEquals("<html><textarea>{\"result\":\""+
                "bar"+contents+"13"+"\"}</textarea></html>",
                result);
    }
}
/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
package com.wavemaker.runtime.server.view;

import java.io.Writer;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.view.JsonView;

/**
 * Render the model contents straight to the browser.  Takes the value of every
 * key in the model, and renders it out as text.
 * 
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class UploadResponseView extends JsonView {

    public UploadResponseView() {
        super();
        setContentType("text/html");
    }
    
    /* (non-Javadoc)
     * @see org.springframework.web.servlet.view.AbstractView#renderMergedOutputModel(java.util.Map, javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected void renderMergedOutputModel(
            @SuppressWarnings("unchecked") Map model,
            HttpServletRequest request, HttpServletResponse response)
            throws Exception {

        response.setContentType(getContentType());
        Writer output = response.getWriter();

        output.write("<html><textarea>");
        super.createJSON(model, output);
        output.write("</textarea></html>");

        output.close();
    }
}
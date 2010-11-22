/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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

import org.apache.commons.io.IOUtils;
import org.springframework.web.servlet.view.AbstractView;

import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.runtime.server.DojoFileUploaderResponse;
import com.wavemaker.runtime.server.ServerConstants;

/**
 * Provides a suitable view for download servlets. If a DownloadObject is
 * present, it will send the pieces from that; if not, the String representation
 * of the result will be sent.
 * 
 * @author small
 * @version $Rev: 29059 $ - $Date: 2010-04-29 17:19:33 -0700 (Thu, 29 Apr 2010) $
 * 
 */
public class FlashUploadResponseView extends AbstractView implements TypedView {

    /*
     * (non-Javadoc)
     * 
     * @see org.springframework.web.servlet.view.AbstractView#renderMergedOutputModel(java.util.Map,
     *      javax.servlet.http.HttpServletRequest,
     *      javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected void renderMergedOutputModel(@SuppressWarnings("unchecked")
            Map model, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
    }

    public FieldDefinition getRootType() {
        // ignored
        return null;
    }

    public void setRootType(FieldDefinition type) {
        // ignored
    }
}
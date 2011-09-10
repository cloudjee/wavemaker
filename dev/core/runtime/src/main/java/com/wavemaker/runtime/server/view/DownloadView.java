/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.runtime.server.view;

import java.io.Writer;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.springframework.web.servlet.view.AbstractView;

import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.runtime.server.ServerConstants;

/**
 * Provides a suitable view for download servlets. If a DownloadObject is
 * present, it will send the pieces from that; if not, the String representation
 * of the result will be sent.
 * 
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class DownloadView extends AbstractView implements TypedView {

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

        Object result = model.get(ServerConstants.RESULTS_PART);

        if (null==result) {
            // no response string
        } else if (result instanceof DownloadResponse) {
            DownloadResponse dr = (DownloadResponse) result;

            response.setContentType(dr.getContentType());
            response.setContentLength(dr.getContents().available());
            if (null!=dr.getFileName()) {
                response.setHeader("Content-disposition",
                        "attachment; filename=\""+dr.getFileName()+"\"");
            }

            IOUtils.copy(dr.getContents(), response.getOutputStream());
            dr.getContents().close();
        } else {
            Writer writer = response.getWriter();
            writer.write(result.toString());
            writer.close();
        }
    }

    public FieldDefinition getRootType() {
        // ignored
        return null;
    }

    public void setRootType(FieldDefinition type) {
        // ignored
    }
}
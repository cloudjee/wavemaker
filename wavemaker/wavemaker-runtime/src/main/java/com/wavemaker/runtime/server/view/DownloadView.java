/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.springframework.web.servlet.view.AbstractView;

import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.runtime.server.Downloadable;
import com.wavemaker.runtime.server.ServerConstants;

/**
 * Provides a suitable view for download servlets. If a DownloadObject is present, it will send the pieces from that; if
 * not, the String representation of the result will be sent.
 * 
 * @author Matt Small
 */
public class DownloadView extends AbstractView implements TypedView {

    @Override
    protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) throws Exception {

        Object result = model.get(ServerConstants.RESULTS_PART);

        if (result == null) {
            return;
        }

        if (result instanceof Downloadable) {
            sendDownloadable((Downloadable) result, response);
            return;
        }

        Writer writer = response.getWriter();
        writer.write(result.toString());
        writer.close();
    }

    private void sendDownloadable(Downloadable downloadable, HttpServletResponse response) throws IOException {
        InputStream contents = downloadable.getContents();
        try {
            response.setContentType(downloadable.getContentType());
            if (downloadable.getContentLength() != null) {
                response.setContentLength(downloadable.getContentLength());
            }
            if (downloadable.getFileName() != null) {
                response.setHeader("Content-disposition", "attachment; filename=\"" + downloadable.getFileName() + "\"");
            }
            IOUtils.copy(contents, response.getOutputStream());
        } finally {
            contents.close();
        }
    }

    @Override
    public FieldDefinition getRootType() {
        // ignored
        return null;
    }

    @Override
    public void setRootType(FieldDefinition type) {
        // ignored
    }
}
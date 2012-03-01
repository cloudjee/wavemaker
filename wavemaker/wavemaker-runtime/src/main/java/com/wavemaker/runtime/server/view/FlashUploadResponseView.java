/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

import org.springframework.web.servlet.view.AbstractView;

import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.runtime.server.DojoFileUploaderResponse;
import com.wavemaker.runtime.server.ServerConstants;

/**
 * @author Matt Small
 */
@Deprecated
public class FlashUploadResponseView extends AbstractView implements TypedView {

    @Override
    protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) throws Exception {

        Object result = model.get(ServerConstants.RESULTS_PART);

        if (result == null) {
            // no response string
        } else if (result instanceof DojoFileUploaderResponse) {
            DojoFileUploaderResponse dr = (DojoFileUploaderResponse) result;

            String responseStr = "file=" + dr.getPath() + ",name=" + dr.getName() + ",type=" + dr.getType() + ",error=" + dr.getError() + ",width="
                + dr.getWidth() + ",height=" + dr.getHeight();

            Writer output = response.getWriter();
            output.write(responseStr);
            output.close();
        } else {
            // no response string
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
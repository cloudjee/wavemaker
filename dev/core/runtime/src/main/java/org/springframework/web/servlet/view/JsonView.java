/*
 * Copyright 2002-2007 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.springframework.web.servlet.view;

import java.io.IOException;
import java.io.Writer;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.wavemaker.json.JSONMarshaller;
import com.wavemaker.json.JSONState;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.runtime.server.view.TypedView;

/**
 * A View that renders its model as a JSON object.
 * 
 * @author Andres Almiray <aalmiray@users.sourceforge.net>
 * 
 *         Modified by ActiveGrid.
 * @author small
 * @version $Rev$ - $Date$
 */
public class JsonView extends AbstractView implements TypedView {

    /** Default content type. Overridable as bean property. */
    private static final String DEFAULT_JSON_CONTENT_TYPE = ServerConstants.JSON_CONTENT_TYPE;

    /** JsonConfig instance; defaults to null */
    private JSONState jsonConfig = null;

    private FieldDefinition rootType = null;

    public JsonView() {
        super();
        setContentType(DEFAULT_JSON_CONTENT_TYPE);
    }

    /**
     * Creates a JSON [JSONObject,JSONArray,JSONNUll] from the model values.
     */
    protected void createJSON(Map<?, ?> model, Writer writer) throws IOException {

        if (model.size() == 1 && model.containsKey(ServerConstants.ROOT_MODEL_OBJECT_KEY)) {
            defaultCreateJSON(writer, model.get(ServerConstants.ROOT_MODEL_OBJECT_KEY));
        } else {
            defaultCreateJSON(writer, model);
        }
    }

    /**
     * Creates a JSON [JSONObject,JSONArray,JSONNUll] from the model values.
     */
    protected final void defaultCreateJSON(Writer writer, Object obj) throws IOException {
        JSONMarshaller.marshal(writer, obj, this.jsonConfig, this.rootType, false, false);
    }

    @Override
    @SuppressWarnings("unchecked")
    protected void renderMergedOutputModel(Map model, HttpServletRequest request, HttpServletResponse response) throws Exception {

        response.setContentType(getContentType());

        Writer w = response.getWriter();
        createJSON(model, w);
        w.close();
    }

    public JSONState getJsonConfig() {
        return this.jsonConfig;
    }

    public void setJsonConfig(JSONState jsonConfig) {
        this.jsonConfig = jsonConfig;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.server.view.TypedView#getRootType()
     */
    @Override
    public FieldDefinition getRootType() {
        return this.rootType;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.server.view.TypedView#setRootType(com.wavemaker.json.type.FieldDefinition)
     */
    @Override
    public void setRootType(FieldDefinition type) {
        this.rootType = type;
    }
}

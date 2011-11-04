/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.data.parser;

import java.io.PrintWriter;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.XMLUtils;
import com.wavemaker.runtime.data.Input;
import com.wavemaker.tools.data.QueryInfo;
import com.wavemaker.tools.data.util.DataServiceUtils;

/**
 * @author Simon Toens
 */
public class HbmQueryWriter extends BaseHbmWriter {

    private String meta = null;

    private Collection<QueryInfo> queries = Collections.emptyList();

    public HbmQueryWriter(PrintWriter pw) {
        super(pw);
    }

    public void setQueries(Collection<QueryInfo> queries) {
        this.queries = queries;
    }

    public void setMeta(String meta) {
        this.meta = meta;
    }

    @Override
    public void writeCustom() {
        writeMeta();
        for (QueryInfo query : this.queries) {
            writeQuery(query);
        }
    }

    private void writeMeta() {
        if (this.meta == null) {
            return;
        }
        this.xmlWriter.addElement(HbmConstants.META_EL, HbmConstants.META_VALUE_ATTR, this.meta);
        this.xmlWriter.closeElement();
    }

    private void writeQuery(QueryInfo query) {

        this.xmlWriter.addElement(HbmConstants.QUERY_EL);

        String comment = null;

        if (!ObjectUtils.isNullOrEmpty(query.getComment())) {
            comment = query.getComment();
        }
        if (query.getIsGenerated()) {
            if (comment != null) {
                this.xmlWriter.forceCloseOnNewLine();
            }
            comment = DataServiceUtils.addGeneratedAnnotation(comment, this.xmlWriter);
        }

        this.xmlWriter.addAttribute(HbmConstants.NAME_ATTR, query.getName());

        if (comment != null) {
            this.xmlWriter.addAttribute(HbmConstants.COMMENT_ATTR, XMLUtils.escape(comment));
        }

        for (Input input : query.getInputs()) {
            String name = input.getParamName();
            String type = input.getParamType();
            if (input.getList()) {
                type = List.class.getName() + "<" + type + ">";
            }

            type = XMLUtils.escape(type);

            this.xmlWriter.addClosedElement(HbmConstants.QUERY_PARAM_EL, HbmConstants.NAME_ATTR, name, HbmConstants.TYPE_ATTR, type);
        }

        this.xmlWriter.addText(query.getQuery());

        this.xmlWriter.closeElement();
    }
}

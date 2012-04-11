/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

import java.io.File;
import java.io.Reader;
import java.util.LinkedHashMap;
import java.util.Map;

import com.wavemaker.common.util.Tuple;
import com.wavemaker.common.util.XMLUtils;
import com.wavemaker.runtime.data.util.DataServiceUtils;
import com.wavemaker.tools.data.QueryInfo;

/**
 * Eventually this should move into HbmParser so we can handle generic hbm files with both mappings and queries.
 * 
 * @author Simon Toens
 */
public class HbmQueryParser extends BaseHbmParser {

    private String meta = null;

    private boolean metaInitialized = false;

    private Map<String, QueryInfo> queries = null;

    public HbmQueryParser(String s) {
        super(s);
    }

    public HbmQueryParser(File f) {
        super(f);
    }

    public HbmQueryParser(Reader reader) {
        super(reader);
    }

    @Override
    public void initAll() {
        getQueries();
    }

    public synchronized String getMeta() {
        if (!this.metaInitialized) {
            this.metaInitialized = true;
            initMeta();
        }
        return this.meta;
    }

    public synchronized Map<String, QueryInfo> getQueries() {
        getMeta(); // init
        if (this.queries == null) {
            this.queries = new LinkedHashMap<String, QueryInfo>();
            initQueries();
            close();
        }
        return this.queries;
    }

    private void initMeta() {

        next(HbmConstants.MAPPING_EL);

        String found = next();

        if (!HbmConstants.META_EL.equals(found)) {
            return;
        }

        Map<String, String> attrs = XMLUtils.attributesToMap(this.xmlReader);

        this.meta = attrs.get(HbmConstants.META_VALUE_ATTR);
    }

    private void initQueries() {

        QueryInfo q = null;

        if (HbmConstants.QUERY_EL.equals(String.valueOf(this.currentElementName))) {
            q = initQuery(this.currentElementName);
            this.queries.put(q.getName(), q);
        }

        String queryKind = "";

        while (queryKind != null) {

            queryKind = nextNested(HbmConstants.MAPPING_EL, HbmConstants.QUERY_EL);

            if (queryKind == null) {
                break;
            }

            q = initQuery(queryKind);

            this.queries.put(q.getName(), q);
        }
    }

    private QueryInfo initQuery(String queryKind) {

        Map<String, String> queryAttrs = XMLUtils.attributesToMap(this.xmlReader);

        QueryInfo rtn = new QueryInfo();

        rtn.setIsHQL(true);
        rtn.setName(queryAttrs.get(HbmConstants.NAME_ATTR));

        String comment = queryAttrs.get(HbmConstants.COMMENT_ATTR);
        rtn.setIsGenerated(com.wavemaker.tools.data.util.DataServiceUtils.isGeneratedQuery(comment));
        rtn.setComment(com.wavemaker.tools.data.util.DataServiceUtils.sanitizeComment(comment));

        addQueryParams(queryKind, rtn);

        rtn.setQuery(this.currentText.toString().trim());

        return rtn;
    }

    private void addQueryParams(String queryKind, QueryInfo query) {

        String s = "";

        while (s != null) {

            s = nextNested(queryKind, HbmConstants.QUERY_PARAM_EL);

            if (s == null) {
                break;
            }

            Map<String, String> attrs = XMLUtils.attributesToMap(this.xmlReader);

            String name = attrs.get(HbmConstants.NAME_ATTR);
            String type = attrs.get(HbmConstants.TYPE_ATTR);

            Tuple.Two<String, Boolean> t = DataServiceUtils.getQueryType(type);

            query.addInput(name, t.v1, t.v2);
        }
    }
}

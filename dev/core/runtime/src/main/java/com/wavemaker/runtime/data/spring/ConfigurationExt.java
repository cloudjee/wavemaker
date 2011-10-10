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

package com.wavemaker.runtime.data.spring;

import java.util.Iterator;

import org.dom4j.Element;
import org.hibernate.MappingException;
import org.hibernate.cfg.Configuration;

import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.WMAppContext;
import com.wavemaker.runtime.data.util.QueryHandler;

/**
 * @author S Lee
 * 
 */
public class ConfigurationExt extends Configuration {

    private static final long serialVersionUID = 2733041879945822764L;

    public static String projectName;

    public ConfigurationExt() {
        super();
    }

    @Override
    protected void add(org.dom4j.Document doc) throws MappingException {
        Element hmNode = doc.getRootElement();
        Iterator rootChildren = hmNode.elementIterator();

        while (rootChildren.hasNext()) {
            final Element element = (Element) rootChildren.next();
            final String elementName = element.getName();

            if ("query".equals(elementName)) {
                String query = element.getText();
                query = insertTenantIdInQuery(query);
                element.setText(query);
            }
        }

        super.add(doc);
    }

    private String insertTenantIdInQuery(String query) {
        QueryHandler qh = new QueryHandler(this);
        WMAppContext wmApp = WMAppContext.getInstance();
        String tFldName = wmApp.getTenantFieldName();
        int tid = RuntimeAccess.getInstance().getTenantId();
        if (tid == -1) {
            tid = wmApp.getDefaultTenantID();
        }

        return qh.modifySQL(query, tFldName, tid);
    }
}
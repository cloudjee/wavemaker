/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
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
package com.wavemaker.tools.data.parser;

import java.io.File;
import java.io.Reader;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.common.util.XMLUtils;
import com.wavemaker.tools.data.ColumnInfo;
import com.wavemaker.tools.data.EntityInfo;
import com.wavemaker.tools.data.PropertyInfo;

/**
 * Written at the Oakland Airport, waiting for a plane to Portland, continued at
 * SFO, waiting for a plane to Frankfurt.
 * 
 * @author Simon Toens
 * @version $Rev$ - $Date$
 */
public class HbmParser extends BaseHbmParser {

    private EntityInfo entity = null;

    private boolean initializedProperties = false;

    public HbmParser() {
        super();
    }

    public HbmParser(String s) {
        super(s);
    }

    public HbmParser(File f) {
        super(f);
    }

    public HbmParser(Reader reader) {
        super(reader);
    }

    public synchronized void initAll() {
        getProperties();
    }

    public synchronized EntityInfo getEntity() {
        if (entity == null) {
            initEntity();
        }
        return entity;
    }

    public synchronized Map<String, PropertyInfo> getPropertiesMap() {
        getProperties();
        return entity.getPropertiesMap();
    }

    public synchronized Collection<PropertyInfo> getProperties() {
        getEntity(); // init
        if (!initializedProperties) {
            initializedProperties = true;
            initProperties();
            close();
        }
        return entity.getProperties();
    }

    private void initEntity() {
        
        next(HbmConstants.CLASS_EL);
        
        Map<String, String> attrs = XMLUtils.attributesToMap(xmlReader);
        Tuple.Two<String, String> t = StringUtils.splitPackageAndClass(attrs
                .get(HbmConstants.NAME_ATTR));
        
        String schema = attrs.get(HbmConstants.SCHEMA_ATTR);
        String catalog = attrs.get(HbmConstants.CATALOG_ATTR);
        
        entity = new EntityInfo(t.v1, t.v2, attrs.get(HbmConstants.TABLE_ATTR),
                schema, catalog);
        
        entity.setDynamicInsert(getBoolValue(HbmConstants.DYNAMIC_INSERT, 
                                             attrs));
        entity.setDynamicUpdate(getBoolValue(HbmConstants.DYNAMIC_UPDATE, 
                                             attrs));
    }
    
    private boolean getBoolValue(String key, Map<String, String> attrs) {
        boolean rtn = false;
        if (attrs.containsKey(key)) {
            rtn = Boolean.valueOf(attrs.get(key));
        }
        return rtn;
    }

    private void initProperties() {

        String propertyKind = "";

        while (propertyKind != null) {

            propertyKind = next(HbmConstants.COMP_ID_EL, HbmConstants.ID_EL,
                    HbmConstants.TO_ONE_EL, HbmConstants.PROP_EL,
                    HbmConstants.SET_EL, HbmConstants.COMPONENT_EL);

            if (propertyKind == null) {
                break;
            }

            PropertyInfo p = initProperty(propertyKind);

            if (p.getIsRelated()) {
                entity.addRelatedProperty(p);
            } else {
                entity.addProperty(p);
            }

            if (p.getIsId()) {
                entity.setId(p);
            }
        }
    }

    private PropertyInfo initProperty(String propertyKind) {

        Map<String, String> propertyAttrs = 
            XMLUtils.attributesToMap(xmlReader);

        PropertyInfo rtn = PropertyInfo.fromKind(propertyKind, propertyAttrs);

        if (HbmConstants.PROP_WRAPPER_ELS.contains(propertyKind)) {

            String nestedPropertyKind = "";

            while (nestedPropertyKind != null) {

                nestedPropertyKind = nextNested(propertyKind,
                        HbmConstants.KEY_PROP_EL, HbmConstants.PROP_EL);

                if (nestedPropertyKind == null) {
                    break;
                }

                PropertyInfo p = initProperty(nestedPropertyKind);

                rtn.addCompositeProperty(p);

            }

        } else {

            Tuple.Two<Collection<ColumnInfo>, Map<String, String>> t = 
                initColumns(rtn, propertyKind);
            Collection<ColumnInfo> columns = t.v1;
            Map<String, String> nestedAttributes = t.v2;

            if (columns.size() == 1) {
                rtn.setColumn(columns.iterator().next());
            } else {
                for (ColumnInfo ci : columns) {
                    PropertyInfo p = PropertyInfo.fromKind(propertyKind,
                            nestedAttributes);
                    p.setName(ci.getName());
                    p.setColumn(ci);
                    rtn.addCompositeProperty(p);
                }
            }

            if (rtn.getIsInverse()) {
                rtn.types(nestedAttributes
                        .get(HbmConstants.FQ_TO_MANY_TYPE_ATTR));
            }
        }

        return rtn;
    }

    private Tuple.Two<Collection<ColumnInfo>, Map<String, String>> initColumns(
            PropertyInfo parentProperty, String parentElementName) {

        String nestedElement = "";

        Map<String, ColumnInfo> 
	    rtnMap = new LinkedHashMap<String, ColumnInfo>();

        Map<String, String> attributes = new HashMap<String, String>();

        while (nestedElement != null) {

            nestedElement = nextNested(parentElementName, HbmConstants.COL_EL,
                    HbmConstants.GEN_EL, HbmConstants.TO_MANY_EL);

            if (nestedElement == null) {

                break;

            } else {

                Map<String, String> attrs = XMLUtils.attributesToMap(
                        nestedElement, xmlReader);

                if (parentElementName.equals(HbmConstants.TO_ONE_EL)
                        || parentElementName.equals(HbmConstants.SET_EL)) {

                    if (attrs.containsKey(HbmConstants.FQ_COL_NAME_ATTR)) {

                        ColumnInfo ci = ColumnInfo.newColumnInfo(
                                parentProperty, attrs);

                        rtnMap.put(ci.getName(), ci);
                    }
                }

                attributes.putAll(attrs);

                if (nestedElement.equals(HbmConstants.GEN_EL)) {

                    // parse generator's nested <param> elements

                    String s = "";

                    while (s != null) {

                        s = nextNested(HbmConstants.GEN_EL,
                                HbmConstants.GEN_PARAM_EL);

                        if (s == null) {
                            break;
                        }

                        Map<String, String> m = XMLUtils
                                .attributesToMap(xmlReader);

                        String paramName = null;

                        if (m.containsKey(HbmConstants.NAME_ATTR)) {
                            paramName = HbmConstants.GEN_PARAM_EL
                                    + XMLUtils.SCOPE_SEP
                                    + m.get(HbmConstants.NAME_ATTR);
                        }

                        nextCharacterData();

                        if (paramName != null && currentText.length() > 0) {
                            attributes.put(paramName, currentText.toString());
                        }
                    }
                }
            }
        }

        ColumnInfo ci2 = ColumnInfo.newColumnInfo(parentProperty, attributes);
        if (!rtnMap.containsKey(ci2.getName())) {
            rtnMap.put(ci2.getName(), ci2);
        }

        return Tuple.tuple(rtnMap.values(), attributes);
    }
}

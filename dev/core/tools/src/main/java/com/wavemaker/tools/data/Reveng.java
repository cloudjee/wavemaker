/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.data;

import java.io.PrintWriter;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamConstants;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.XMLUtils;
import com.wavemaker.common.util.XMLWriter;
import com.wavemaker.runtime.data.util.DataServiceConstants;

/**
 * @author Simon Toens
 */
public class Reveng {

    private static final String SCHEMA_SELECTION_ELEMENT = "schema-selection";

    private static final String PACKAGE_ATTR = "package";

    private static final String MATCH_NAME_ATTR = "match-name";

    private static final String TABLE_FILTER_ELEMENT = "table-filter";

    private static final String MATCH_SCHEMA_ATTR = "match-schema";

    private static final String EXCLUDE_ATTR = "exclude";

    private static final String EXCLUDE_CHAR = "^";

    private static final String ESCAPE_CHAR = "\\";

    private static final String ORACLE_DIALECT = "OracleDialect";

    private static final String TYPE_MAPPING = "type-mapping";

    private static final String SQL_TYPE = "sql-type";

    private static final String JDBC_TYPE = "jdbc-type";

    private static final String HIBERNATE_TYPE = "hibernate-type";

    private String packageName;

    private List<String> tableFilters = new ArrayList<String>();

    private List<String> schemaFilters = new ArrayList<String>();

    public static Reveng load(Reader reader) {

        Reveng rtn = new Reveng();

        XMLStreamReader xmlReader = null;

        try {
            XMLInputFactory factory = XMLInputFactory.newInstance();
            xmlReader = factory.createXMLStreamReader(reader);
        } catch (XMLStreamException ex) {
            throw new WMRuntimeException(ex);
        }

        try {
            for (int event = xmlReader.next(); event != XMLStreamConstants.END_DOCUMENT; event = xmlReader.next()) {

                switch (event) {
                    case XMLStreamConstants.START_ELEMENT:
                        if (xmlReader.getName().toString().equals(TABLE_FILTER_ELEMENT)) {
                            Map<String, String> attrs = XMLUtils.attributesToMap(xmlReader);
                            rtn.packageName = attrs.get("package");
                            rtn.tableFilters = new ArrayList<String>();
                            rtn.tableFilters.add(attrs.get(MATCH_NAME_ATTR));
                            break;
                        }

                        else if (xmlReader.getName().toString().equals(SCHEMA_SELECTION_ELEMENT)) {
                            Map<String, String> attrs = XMLUtils.attributesToMap(xmlReader);
                            rtn.schemaFilters = new ArrayList<String>();
                            rtn.schemaFilters.add(attrs.get(MATCH_SCHEMA_ATTR));
                            break;
                        }
                }
            }

            xmlReader.close();

        } catch (XMLStreamException ex) {
            throw new WMRuntimeException(ex);
        }

        return rtn;

    }

    public Reveng() {
        this.tableFilters.add(DataServiceConstants.DEFAULT_FILTER);
        this.schemaFilters.add(DataServiceConstants.DEFAULT_FILTER);
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public void setTableFilters(List<String> tableFilters) {
        this.tableFilters = tableFilters;
    }

    public void setSchemaFilters(List<String> schemaFilters) {
        this.schemaFilters = schemaFilters;
    }

    public List<String> getTableFilters() {
        return this.tableFilters;
    }

    public List<String> getSchemaFilters() {
        return this.schemaFilters;
    }

    public String getPackage() {
        return this.packageName;
    }

    public void write(PrintWriter writer) {
        write(writer, null);
    }

    public void write(PrintWriter writer, String dialect) {

        XMLWriter xmlWriter = XMLUtils.newXMLWriter(writer);
        xmlWriter.addDoctype("hibernate-reverse-engineering", null, "http://hibernate.sourceforge.net/hibernate-reverse-engineering-3.0.dtd");
        xmlWriter.addElement("hibernate-reverse-engineering");

        for (String s : this.schemaFilters) {
            xmlWriter.addClosedElement(SCHEMA_SELECTION_ELEMENT, MATCH_SCHEMA_ATTR, XMLUtils.escape(s));
        }

        addTypeMappingRule(xmlWriter, dialect);

        List<String> includeFilters = new ArrayList<String>();
        List<String> excludeFilters = new ArrayList<String>();

        populateTableFilters(includeFilters, excludeFilters);

        // need a default include filter
        if (includeFilters.isEmpty()) {
            includeFilters.add(DataServiceConstants.DEFAULT_FILTER);
        }

        // exclude filters need to be added first
        for (String filter : excludeFilters) {
            addTableFilterElement(xmlWriter, filter, true);
        }

        for (String filter : includeFilters) {
            addTableFilterElement(xmlWriter, filter, false);
        }

        xmlWriter.finish();
    }

    private void addTableFilterElement(XMLWriter xmlWriter, String filter, boolean exclude) {

        xmlWriter.addElement(TABLE_FILTER_ELEMENT, MATCH_NAME_ATTR, XMLUtils.escape(filter), EXCLUDE_ATTR, String.valueOf(exclude));

        if (!exclude) {
            xmlWriter.addAttribute(PACKAGE_ATTR, XMLUtils.escape(this.packageName));
        }

        xmlWriter.closeElement();
    }

    private void populateTableFilters(List<String> includeFilters, List<String> excludeFilters) {

        for (String filter : this.tableFilters) {

            boolean exclude = false;

            if (filter.startsWith(ESCAPE_CHAR)) {
                filter = filter.substring(ESCAPE_CHAR.length());
            } else {
                if (filter.startsWith(EXCLUDE_CHAR)) {
                    filter = filter.substring(EXCLUDE_CHAR.length());
                    exclude = true;
                }
            }

            if (exclude) {
                excludeFilters.add(filter);
            } else {
                includeFilters.add(filter);
            }
        }

    }

    // Oracle jdbc driver maps timestamp colunbs to "Other" type. Add the following mapping rule for correct type
    // mapping.
    private void addTypeMappingRule(XMLWriter xmlWriter, String dialect) {
        if (dialect.contains(ORACLE_DIALECT)) {
            xmlWriter.addElement(TYPE_MAPPING);
            xmlWriter.addClosedElement(SQL_TYPE, JDBC_TYPE, XMLUtils.escape("OTHER"), HIBERNATE_TYPE, XMLUtils.escape("java.util.Date"));
            xmlWriter.closeElement();
        }
    }

}

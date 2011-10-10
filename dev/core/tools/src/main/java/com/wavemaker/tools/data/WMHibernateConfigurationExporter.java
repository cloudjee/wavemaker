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

package com.wavemaker.tools.data;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.TreeMap;

import org.hibernate.cfg.Environment;
import org.hibernate.mapping.PersistentClass;
import org.hibernate.mapping.RootClass;
import org.hibernate.tool.hbm2x.ExporterException;
import org.hibernate.tool.hbm2x.HibernateConfigurationExporter;

import com.wavemaker.runtime.data.util.DataServiceConstants;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 */
public class WMHibernateConfigurationExporter extends HibernateConfigurationExporter {

    private Writer output = null;

    private Properties customProperties = null;

    @Override
    public void setOutput(Writer output) {
        super.setOutput(output);
        this.output = output;
    }

    @Override
    public void setCustomProperties(Properties customProperties) {
        this.customProperties = customProperties;
    }

    @Override
    @SuppressWarnings("unchecked")
    public void doStart() throws ExporterException {
        PrintWriter pw = null;
        File file = null;
        try {
            if (this.output == null) {
                file = new File(getOutputDirectory(), "hibernate.cfg.xml");
                getTemplateHelper().ensureExistence(file);
                pw = new PrintWriter(new FileWriter(file));
                getArtifactCollector().addFile(file, "cfg.xml");
            } else {
                pw = new PrintWriter(this.output);
            }

            pw.println("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + "<!DOCTYPE hibernate-configuration PUBLIC\r\n"
                + "               \"-//Hibernate/Hibernate Configuration DTD 3.0//EN\"\r\n"
                + "               \"http://hibernate.sourceforge.net/hibernate-configuration-3.0.dtd\">\r\n" + "<hibernate-configuration>");

            boolean ejb3 = Boolean.valueOf((String) getProperties().get("ejb3")).booleanValue();

            Map props = new TreeMap();
            if (getConfiguration() != null) {
                props.putAll(getConfiguration().getProperties());
            }
            if (this.customProperties != null) {
                props.putAll(this.customProperties);
            }

            String sfname = (String) props.get(Environment.SESSION_FACTORY_NAME);
            pw.println("    <session-factory" + (sfname == null ? "" : " name=\"" + sfname + "\"") + ">");

            Map<String, String> ignoredProperties = new HashMap<String, String>();
            ignoredProperties.put(Environment.SESSION_FACTORY_NAME, null);
            ignoredProperties.put(Environment.HBM2DDL_AUTO, "false");
            ignoredProperties.put("hibernate.temp.use_jdbc_metadata_defaults", null);

            Set set = props.entrySet();
            Iterator iterator = set.iterator();
            while (iterator.hasNext()) {
                Map.Entry element = (Map.Entry) iterator.next();
                String key = (String) element.getKey();
                if (ignoredProperties.containsKey(key)) {
                    Object ignoredValue = ignoredProperties.get(key);
                    if (ignoredValue == null || element.getValue().equals(ignoredValue)) {
                        continue;
                    }
                }
                if (key.startsWith("hibernate.")) { // if not starting with
                    // hibernate. not relevant
                    // for cfg.xml
                    pw.println("        <property name=\"" + key + "\">" + element.getValue() + "</property>");
                }
            }

            if (getConfiguration() != null) {
                Iterator classMappings = getConfiguration().getClassMappings();
                while (classMappings.hasNext()) {
                    PersistentClass element = (PersistentClass) classMappings.next();
                    if (element instanceof RootClass) {
                        dump(pw, ejb3, element);
                    }
                }

                // once more for adding generated hql files
                pw.println();
                pw.println();
                classMappings = getConfiguration().getClassMappings();
                while (classMappings.hasNext()) {
                    PersistentClass element = (PersistentClass) classMappings.next();
                    if (element instanceof RootClass) {
                        dumpQueryFile(pw, element);
                    }
                }
            }
            pw.println("    </session-factory>\r\n" + "</hibernate-configuration>");

        }

        catch (IOException e) {
            throw new ExporterException("Problems while creating hibernate.cfg.xml", e);
        } finally {
            if (pw != null) {
                pw.flush();
                pw.close();
            }
        }
    }

    @SuppressWarnings("unchecked")
    private void dump(PrintWriter pw, boolean useClass, PersistentClass element) {
        if (useClass) {
            pw.println("<mapping class=\"" + element.getClassName() + "\"/>");
        } else {
            pw.println("<mapping resource=\"" + getMappingFileResource(element) + "\"/>");

        }

        Iterator directSubclasses = element.getDirectSubclasses();
        while (directSubclasses.hasNext()) {
            PersistentClass subclass = (PersistentClass) directSubclasses.next();
            dump(pw, useClass, subclass);
        }

    }

    // add generated hql files to mapping
    private void dumpQueryFile(PrintWriter pw, PersistentClass element) {
        String relPath = getQueryFileResource(element);
        pw.println("<mapping resource=\"" + relPath + "\"/>");
    }

    private String getMappingFileResource(PersistentClass element) {
        return element.getClassName().replace('.', '/') + ".hbm.xml";
    }

    private String getQueryFileResource(PersistentClass element) {
        return element.getClassName().replace('.', '/') + DataServiceConstants.QUERY_EXT;
    }

}

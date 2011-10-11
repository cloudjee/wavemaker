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

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;

import org.springframework.core.io.Resource;

import com.wavemaker.common.util.CastUtils;
import com.wavemaker.common.util.XMLUtils;
import com.wavemaker.common.util.XMLWriter;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.data.util.DataServiceUtils;
import com.wavemaker.tools.deployment.ServiceDeployment;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.FileService;

/**
 * @author Simon Toens
 * @author Jeremy Grelle
 * 
 */
public class DataModelDeploymentConfiguration implements ServiceDeployment {

    public static final String JNDI_NAME_PROPERTY = "jndi.dsname";

    public static final String DB_ALIAS_PROPERTY = "alias";

    public static final String UPDATE_SCHEMA_PROPERTY = "updateschema";

    private static final String COMP_ENV = "java:comp/env/";

    public static final String RESOURCE_REF = "resource-ref";

    private static final String RESOURCE_NAME = "res-ref-name";

    private static final String RESOURCE_TYPE = "res-type";

    private static final String DEFAULT_RESOURCE_TYPE = "javax.sql.DataSource";

    private static final String RESOURCE_AUTH = "res-auth";

    private static final String DEFAULT_RESOURCE_AUTH = "Container";

    private static final String RESOURCE_SHARING_SCOPE = "res-sharing-scope";

    private static final String DEFAULT_RESOURCE_SHARING_SCOPE = "Shareable";

    // do we already have constants for the web-app xml elements?
    private static final String WEB_XML_INSERT_BEFORE = "</web-app>";

    @Override
    public void prepare(String serviceName, Map<String, String> properties, DesignServiceManager mgr, int indx) {

        String rootPath = DesignServiceManager.getRuntimeRelativeDir(serviceName);
        String cfgFile = DataServiceUtils.getCfgFileName(serviceName);
        FileService fs = mgr.getProjectManager().getCurrentProject();
        DataServiceSpringConfiguration cfg = new DataServiceSpringConfiguration(fs, rootPath, cfgFile, serviceName);

        if (properties.containsKey(JNDI_NAME_PROPERTY)) {

            String jndiName = properties.get(JNDI_NAME_PROPERTY);

            configureJNDI(cfg, jndiName);
            configureJNDIProperties(cfg);
            modifyWebSphereBindings(mgr, jndiName, indx);
            configureResourceRef(mgr, jndiName);
        } else {
            configureDeploymentProperties(cfg, properties);
        }
    }

    private void modifyWebSphereBindings(DesignServiceManager mgr, String jndiName, int indx) {

        if (!jndiName.contains(COMP_ENV)) {
            return;
        }
        String dsrcName = jndiName.substring(COMP_ENV.length());
        String drefName = dsrcName.replace("/", "_");
        com.wavemaker.tools.project.Project project = mgr.getProjectManager().getCurrentProject();
        Resource wsBindings = mgr.getProjectManager().getCurrentProject().getWsBindingsFile();
        if (!wsBindings.exists()) {
            return;
        }

        String fromStr = "</com.ibm.ejs.models.base.bindings.webappbnd:WebAppBinding>";
        String toStr = "\t<resRefBindings xmi:id=\"ResourceRefBinding_" + indx + "\" jndiName=\"" + dsrcName + "\">"
            + "\r\n\t\t<bindingResourceRef href=\"WEB-INF/web.xml#" + drefName + "\"/>" + "\r\n\t</resRefBindings>" + "\r\n" + fromStr;

        try {
            String content = project.readFile(wsBindings);
            content = content.replace(fromStr, toStr);
            project.writeFile(wsBindings, content);
        } catch (IOException ex) {
            throw new ConfigurationException(ex);
        }
    }

    private void configureJNDI(DataServiceSpringConfiguration cfg, String jndiName) {
        cfg.configureJNDIDataSource(jndiName);
        cfg.write();
    }

    private void configureJNDIProperties(DataServiceSpringConfiguration cfg) {
        // remove properties. only ones still referenced in spring file are:
        // - ${dialect}

        Properties props = cfg.readProperties();
        Properties newProps = new Properties();
        for (Iterator<String> iter = CastUtils.cast(props.keySet().iterator()); iter.hasNext();) {
            String key = iter.next();
            if (key.endsWith(DataServiceConstants.DB_DIALECT)) {
                newProps.setProperty(key, props.getProperty(key));
            }
        }

        cfg.writeProperties(newProps, false);
    }

    private void configureDeploymentProperties(DataServiceSpringConfiguration cfg, Map<String, String> deploymentProperties) {
        Properties existingProps = cfg.readProperties(true);
        for (Entry<String, String> prop : deploymentProperties.entrySet()) {
            existingProps.setProperty(prop.getKey(), prop.getValue());
        }
        cfg.writeProperties(existingProps, true);
        cfg.configureDbAlias(existingProps.getProperty(DB_ALIAS_PROPERTY));
        cfg.configureHibernateSchemaUpdate(existingProps.getProperty(UPDATE_SCHEMA_PROPERTY));
        cfg.write();
    }

    private void configureResourceRef(DesignServiceManager mgr, String jndiName) {

        int i = jndiName.indexOf(COMP_ENV);

        if (i == -1) {
            return;
        }

        String appScopedJndiName = jndiName.substring(COMP_ENV.length());

        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);

        XMLWriter writer = XMLUtils.newXMLWriter(pw);
        writer.setStartIndent(4);

        writer.addElement(RESOURCE_REF, "id", appScopedJndiName.replace("/", "_"));
        writer.addElement(RESOURCE_NAME, appScopedJndiName);
        writer.addElement(RESOURCE_TYPE, DEFAULT_RESOURCE_TYPE);
        writer.addElement(RESOURCE_AUTH, DEFAULT_RESOURCE_AUTH);
        writer.addElement(RESOURCE_SHARING_SCOPE, DEFAULT_RESOURCE_SHARING_SCOPE);

        writer.finish();

        addToWebXml(mgr, writer.getLineSep() + sw.toString() + writer.getLineSep());

        pw.close();
    }

    private void addToWebXml(DesignServiceManager mgr, String xmlSnippet) {

        com.wavemaker.tools.project.Project project = mgr.getProjectManager().getCurrentProject();
        Resource webXml = project.getWebXml();

        try {
            String s = project.readFile(webXml);

            int i = s.indexOf(WEB_XML_INSERT_BEFORE);

            if (i == -1) {
                throw new AssertionError("Could not find marker in web.xml: " + WEB_XML_INSERT_BEFORE);
            }

            s = s.substring(0, i) + xmlSnippet + s.substring(i);

            project.writeFile(webXml, s);

        } catch (IOException ex) {
            throw new ConfigurationException(ex);
        }

    }

}

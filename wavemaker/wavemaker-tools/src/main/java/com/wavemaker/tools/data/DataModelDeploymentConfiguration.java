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

package com.wavemaker.tools.data;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;

import com.wavemaker.common.util.CastUtils;
import com.wavemaker.common.util.XMLUtils;
import com.wavemaker.common.util.XMLWriter;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.data.util.DataServiceUtils;
import com.wavemaker.tools.deployment.ServiceDeployment;
import com.wavemaker.tools.deployment.DeploymentType;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.FileService;
import static org.springframework.util.StringUtils.hasText;

/**
 * @author Simon Toens
 * @author Jeremy Grelle
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

    private static final String CLOUD_DATA_SOURCE = "cloud:data-source";

    // do we already have constants for the web-app xml elements?
    private static final String WEB_XML_INSERT_BEFORE = "</web-app>";

    private static final String CONIG_FILE_INSERT_BEFORE = "</beans>";

    @Override
    public void prepare(String serviceName, Map<String, String> properties, DesignServiceManager mgr, int indx,
                        DeploymentType type) {

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
            configureDeploymentProperties(mgr, cfg, properties, type);
        }
    }

    private void modifyWebSphereBindings(DesignServiceManager mgr, String jndiName, int indx) {

        if (!jndiName.contains(COMP_ENV)) {
            return;
        }
        String dsrcName = jndiName.substring(COMP_ENV.length());
        String drefName = dsrcName.replace("/", "_");
        File wsBindings = mgr.getProjectManager().getCurrentProject().getWsBindingsFile();
        if (!wsBindings.exists()) {
            return;
        }

        String fromStr = "</com.ibm.ejs.models.base.bindings.webappbnd:WebAppBinding>";
        String toStr = "\t<resRefBindings xmi:id=\"ResourceRefBinding_" + indx + "\" jndiName=\"" + dsrcName + "\">"
            + "\r\n\t\t<bindingResourceRef href=\"WEB-INF/web.xml#" + drefName + "\"/>" + "\r\n\t</resRefBindings>" + "\r\n" + fromStr;

        String content = wsBindings.getContent().asString();
        content = content.replace(fromStr, toStr);
        wsBindings.getContent().write(content);
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

    private void configureDeploymentProperties(DesignServiceManager mgr, DataServiceSpringConfiguration cfg,
                                               Map<String, String> deploymentProperties, DeploymentType type) {
        Properties existingProps = cfg.readProperties(true);
        for (Entry<String, String> prop : deploymentProperties.entrySet()) {
            existingProps.setProperty(prop.getKey(), prop.getValue());
        }
        cfg.writeProperties(existingProps, true);
        String dbName = existingProps.getProperty(DB_ALIAS_PROPERTY);
        cfg.configureDbAlias(dbName, type);
        cfg.configureHibernateSchemaUpdate(dbName, existingProps.getProperty(UPDATE_SCHEMA_PROPERTY));
        cfg.createAuxSessionFactoryBeans(type);
        cfg.write();
        if (type == DeploymentType.CLOUD_FOUNDRY) {

            addCloudDataSource(mgr, cfg, existingProps.getProperty(UPDATE_SCHEMA_PROPERTY));
        }
    }

    private void addCloudDataSource(DesignServiceManager mgr, DataServiceSpringConfiguration cfg, String updateSchema) {
        //if (hasText(updateSchema) && Boolean.parseBoolean(updateSchema)) {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            XMLWriter writer = XMLUtils.newXMLWriter(pw);
            writer.setStartIndent(4);
            writer.addAttribute();
            writer.addElement(CLOUD_DATA_SOURCE, "id", cfg.getServiceId() + "DataSource");
            writer.finish();
            File cfgFile = mgr.getProjectManager().getCurrentProject().getRootFolder().getFile(cfg.getPath());
            String s = cfgFile.getContent().asString();
            int i = s.indexOf(CONIG_FILE_INSERT_BEFORE);
            if (i == -1) {
                throw new AssertionError("Could not find marker in spring config file: " + CONIG_FILE_INSERT_BEFORE);
            }
            s = s.substring(0, i) + writer.getLineSep() + sw.toString() + writer.getLineSep() + s.substring(i);
            cfgFile.getContent().write(s);
        //}
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
        File webXml = project.getWebXmlFile();
        String s = webXml.getContent().asString();
        int i = s.indexOf(WEB_XML_INSERT_BEFORE);
        if (i == -1) {
            throw new AssertionError("Could not find marker in web.xml: " + WEB_XML_INSERT_BEFORE);
        }
        s = s.substring(0, i) + xmlSnippet + s.substring(i);
        webXml.getContent().write(s);
    }
}

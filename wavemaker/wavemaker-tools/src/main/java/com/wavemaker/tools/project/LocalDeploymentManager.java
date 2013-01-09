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

package com.wavemaker.tools.project;

import java.io.*;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.springframework.core.io.Resource;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.sun.xml.bind.marshaller.NamespacePrefixMapper;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.local.LocalFile;
import com.wavemaker.tools.io.local.LocalFolder;

/**
 * Main deployment class.
 * 
 * @author Joel Hare
 * @author Jeremy Grelle
 */
public class LocalDeploymentManager extends StageDeploymentManager {

    static Logger logger = Logger.getLogger(LocalDeploymentManager.class);

    public static final String COMMON_DIR_NAME_PROPERTY = "common";

    static {
        javax.net.ssl.HttpsURLConnection.setDefaultHostnameVerifier (
                new javax.net.ssl.HostnameVerifier() {

                    public boolean verify(String hostname,
                                          javax.net.ssl.SSLSession sslSession) {
                        if (hostname.equals("localhost")) {
                            return true;
                        }
                        return false;
                    }
                }
        );
    }

    public class Undeployer implements HttpSessionBindingListener {

        private String projectName;

        @Override
        public void valueBound(HttpSessionBindingEvent event) {
            this.projectName = getDeployName();
            LocalDeploymentManager.logger.info("SESSION BOUND " + this.projectName + "!!!!!!!!!!!!!!!");
        }

        @Override
        public void valueUnbound(HttpSessionBindingEvent event) {
            // Lines are commented out because an attempt to undeploy the
            // current project will cause the Studio
            // to hang. Now, undeploy is done in Launcher.
            // logger.info("SESSION UNBOUND!!!!!!!!!!!!!!!" + projectName);
            // mAnt.executeTarget(UNDEPLOY_OPERATION);
            // logger.info("Undeployed executed it seems");
        }
    }

    private String testRunStart(LocalFolder projectDir, String deployName) {

        Map<String, Object> properties = setProperties(projectDir);

        if (!continueTestRun(projectDir, deployName, properties)) {
            return null;
        }

        // this method for some reason is how we add the listener
        javax.servlet.http.HttpSession H = RuntimeAccess.getInstance().getSession();
        if (H != null && H.getAttribute("Unloader") == null) {
            H.setAttribute("Unloader", new Undeployer());
        }

        build(properties);
        // compile();

        // testrunstart
        undeploy(properties);
        updateTomcatDeployConfig(properties);
        deploy(properties);

        return "TestRun completed";
    }

    private boolean continueTestRun(LocalFolder projectDir, String deployName, Map<String, Object> properties) {
        return true;
        // FIXME this code is broken, see WM-4282
        // if (!appAlreadyDeployed(projectDir, deployName, properties)) {
        // return true;
        // } else if (projectDir.getFile(deployName + ".xml").exists()) {
        // long l1 = projectDir.getFile(deployName + ".xml").getLastModified();
        // long l2 = projectDir.getFolder("webapproot/WEB-INF").find().files().performOperation(new
        // LatestLastModified()).getValue();
        // return (l1 < l2);
        // } else {
        // return true;
        // }
    }

    private boolean appAlreadyDeployed(LocalFolder projectDir, String deployName, Map<String, Object> properties) {
        boolean rtn;
        String port = (String) properties.get(TOMCAT_PORT_PROPERTY);

        com.wavemaker.tools.io.File deployTestF = projectDir.getFile("webapproot/" + deployName + "-deploy-test-file.txt");
        deployTestF.createIfMissing();

        String content = deployName + " deployed";
        deployTestF.getContent().write(content);

        String urlString = "http://localhost:" + port + "/" + deployName + "/" + deployTestF.getName();
        InputStream is = null;
        try {
            URL url = new URL(urlString);
            is = url.openStream();
            if (is != null) {
                StringWriter writer = new StringWriter();
                IOUtils.copy(is, writer, ServerConstants.DEFAULT_ENCODING);
                rtn = writer.toString().equals(content);
            } else {
                return false;
            }
        } catch (Exception ex) {
            return false;
        } finally {
            try {
                if (is != null) {
                    is.close();
                }
            } catch (IOException e) {
            }
        }

        return rtn;
    }

    private void updateTomcatDeployConfig(Map<String, Object> properties) {
        LocalFolder projectDir = (LocalFolder) properties.get(PROJECT_DIR_PROPERTY);
        String deployName = (String) properties.get(DEPLOY_NAME_PROPERTY);
        LocalFile tomcatConfigXml = (LocalFile) projectDir.getFile(deployName + ".xml");
        if (tomcatConfigXml.exists()) {
            tomcatConfigXml.delete();
        }
        tomcatConfigXml.createIfMissing();
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = factory.newDocumentBuilder();
            Document doc = docBuilder.newDocument();

            NodeList nodeList = doc.getElementsByTagName("Context");

            if (nodeList != null && nodeList.getLength() > 0) {
                for (int i = 0; i < nodeList.getLength(); i++) {
                    Node node = nodeList.item(i);
                    if (node.getParentNode() != null) {
                        node.getParentNode().removeChild(node);
                    }
                }
            }

            Element context = doc.createElement("Context");
            context.setAttribute("antiJARLocking", "true'");
            context.setAttribute("antiResourceLocking", "false");
            context.setAttribute("privileged", "true");
            String docBase = ((LocalFolder) properties.get(BUILD_WEBAPPROOT_PROPERTY)).getLocalFile().getAbsolutePath();
            context.setAttribute("docBase", docBase);

            doc.appendChild(context);

            TransformerFactory tFactory = TransformerFactory.newInstance();
            Transformer tFormer = tFactory.newTransformer();

            Source source = new DOMSource(doc);
            Result dest = new StreamResult(tomcatConfigXml.getLocalFile());
            tFormer.transform(source, dest);

        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String testRunStart() {
        String deployName = getDeployName();
        testRunStart(getProjectDir(), deployName);
        return "/" + deployName;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String compile() {
        Map<String, Object> properties = setProperties(getProjectDir());
        copyJars(properties);
        return this.projectCompiler.compile();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String cleanCompile() {
        Map<String, Object> properties = setProperties(getProjectDir());
        clean(properties);
        return compile();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String build() {
        Map<String, Object> properties = setProperties(getProjectDir());
        return build(properties);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String generateRuntime() {
        Map<String, Object> properties = setProperties(getProjectDir());
        generateRuntimeFiles(properties);
        return "Runtime files are successfully generated";
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String cleanBuild() {
        Map<String, Object> properties = setProperties(getProjectDir());
        clean(properties);
        return build(properties);
    }

    private void clean(Map<String, Object> properties) {
        LocalFolder buildWebAppRoot = (LocalFolder) properties.get(BUILD_WEBAPPROOT_PROPERTY);
        LocalFolder projectDir = (LocalFolder) properties.get(PROJECT_DIR_PROPERTY);
        if (this.buildInLine) {
            buildWebAppRoot.getFolder("/WEB-INF/classes").delete();
            buildWebAppRoot.getFolder("/WEB-INF/lib").getFolder("classes").delete();
            projectDir.getFile(getDeployName() + ".xml").delete();
        } else {
            buildWebAppRoot.delete();
        }
    }

    private void buildWar(LocalFolder projectDir, File buildDir, String warFilePath, boolean includeEar) {
        // projectDir: dplstaging //buildDir: fileutils
        LocalFolder buildFolder = new LocalFolder(buildDir);
        this.tempBuildWebAppRoot = buildFolder;
        File f = new File(warFilePath);
        File dist = f.getParentFile();
        if (!dist.exists()) {
            dist.mkdirs();
        }
        Folder parent = new LocalFolder(dist);
        LocalFile warFile = (LocalFile) parent.getFile(f.getName());
        buildWar(projectDir, buildFolder, warFile, includeEar, this.projectManager.getFileSystem());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public com.wavemaker.tools.io.File buildWar(com.wavemaker.tools.io.File warFile, java.io.File tempWebAppRoot, boolean includeEar)
        throws IOException {
        String warFileLocation = ((LocalFile) warFile).getLocalFile().getCanonicalPath();
        buildWar(warFileLocation, tempWebAppRoot, includeEar);
        return warFile;
    }

    private void buildWar(String warFileName, java.io.File tempWebAppRoot, boolean includeEar) throws IOException {
        buildWar(getProjectDir(), tempWebAppRoot, warFileName, includeEar);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void testRunClean() {
        Map<String, Object> properties = setProperties(getProjectDir());
        undeploy(properties);
        clean(properties);
    }

    @Override
    public void testRunClean(com.wavemaker.tools.project.Project project) {
        Map<String, Object> properties = setProperties(getProjectDir(project));
        undeploy(properties);
        clean(properties);
    }

    @Override
    protected Map<String, Object> addMoreProperties(LocalFolder projectDir, String deployName, Map<String, Object> properties) {

        StudioFileSystem fileSystem = this.projectManager.getFileSystem();
        Map<String, Object> newProperties = new HashMap<String, Object>();

        if (getProjectManager() != null && getProjectManager().getCurrentProject() != null) {
            newProperties.put(PROJECT_ENCODING_PROPERTY, getProjectManager().getCurrentProject().getEncoding());
        }

        newProperties.put(TOMCAT_HOST_PROPERTY, getStudioConfiguration().getTomcatHost());
        System.setProperty("wm.proj." + TOMCAT_HOST_PROPERTY, getStudioConfiguration().getTomcatHost());

        newProperties.put(TOMCAT_PORT_PROPERTY, getStudioConfiguration().getTomcatPort() + "");
        System.setProperty("wm.proj." + TOMCAT_PORT_PROPERTY, getStudioConfiguration().getTomcatPort() + "");

        newProperties.put("tomcat.manager.username", getStudioConfiguration().getTomcatManagerUsername());
        System.setProperty("wm.proj.tomcat.manager.username", getStudioConfiguration().getTomcatManagerUsername());

        newProperties.put("tomcat.manager.password", getStudioConfiguration().getTomcatManagerPassword());
        System.setProperty("wm.proj.tomcat.manager.password", getStudioConfiguration().getTomcatManagerPassword());

        newProperties.putAll(properties);

        try {
            newProperties.put(STUDIO_WEBAPPROOT_PROPERTY, new LocalFolder(fileSystem.getStudioWebAppRoot().getFile()));
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }

        newProperties.put(PROJECT_DIR_PROPERTY, projectDir);

        Resource projectDirFile = fileSystem.getResourceForURI(projectDir.getLocalFile().getAbsolutePath());
        String projectName = projectDirFile.getFilename();
        newProperties.put(PROJECT_NAME_PROPERTY, projectName);

        if (deployName != null) {
            newProperties.put(DEPLOY_NAME_PROPERTY, deployName);
            System.setProperty("wm.proj." + DEPLOY_NAME_PROPERTY, deployName);
        }

        return newProperties;
    }

    @Override
    public void undeploy() {
        Map<String, Object> properties = setProperties(getProjectDir());
        undeploy(properties);
    }

    public static class DeploymentNamespaceMapper extends NamespacePrefixMapper {

        @Override
        public String getPreferredPrefix(String namespaceUri, String suggestion, boolean requirePrefix) {
            if ("http://www.wavemaker.com/namespaces/DeploymentPlan/1.0".equals(namespaceUri)) {
                return "";
            } else if ("http://www.w3.org/2001/XMLSchema-instance".equals(namespaceUri)) {
                return "xsi";
            } else {
                return null;
            }
        }
    }
}

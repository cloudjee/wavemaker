/*
 *  Copyright (C) 2007-2013 VMware, Inc. All rights reserved.
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

import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.InvalidPropertiesFormatException;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

import org.springframework.core.io.Resource;
import org.springframework.util.StringUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.CastUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resources;
import com.wavemaker.tools.io.local.LocalFolder;
import com.wavemaker.tools.service.AbstractFileService;

/**
 * Class representing a project. This is intended for internal server-side use only; the client-side interface is
 * through the StudioService. This FileService writes and reads in ServerConstants.DEFAULT_ENCODING (UTF-8).
 * 
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class Project extends AbstractFileService {

    // FIXME PW filesystem : remove deprecated methods

    public static final String PROJECT_PROPERTIES = ".wmproject.properties";

    protected static final String PROPERTY_PROJECT_VERSION = "projectVersion";

    protected static final String PROPERTY_PROJECT_VERSION_DEFAULT = "0.0";

    private final String projectName;

    private Resource projectRoot = null;

    private Folder projectRootFolder = null;

    private final boolean mavenProject;

    @Deprecated
    public Project(Resource projectRoot, StudioFileSystem fileSystem) {
        super(fileSystem);
        this.projectRoot = projectRoot;
        this.projectName = projectRoot.getFilename();
        try {
            this.mavenProject = projectRoot.createRelative(ProjectConstants.POM_XML).exists();
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    // cftempfix
    public Project(Folder projectRootFolder, String projectName) {
        super();
        this.projectRootFolder = projectRootFolder.jail();
        this.projectName = projectName;
        this.mavenProject = projectRootFolder.getFile(ProjectConstants.POM_XML).exists();
    }

    @Deprecated
    public Resource getProjectRoot() {
        return this.projectRoot;
    }

    public Folder getRootFolder() {
        // FIXME implement properly
        // cftempfix
        if (this.projectRoot != null) {
            try {
                Resource projectRoot = getProjectRoot();
                if (projectRoot instanceof ResourceAdapter) {
                    return ((Folder) ((ResourceAdapter) projectRoot).getExistingResource(true)).jail();
                }
                return new LocalFolder(projectRoot.getFile()).jail();
            } catch (IOException e) {
                throw new IllegalStateException(e);
            }
        } else {
            return this.projectRootFolder;
        }
    }

    @Deprecated
    public Resource getWebAppRoot() {
        try {
            if (this.mavenProject) {
                return getProjectRoot().createRelative(ProjectConstants.MAVEN_WEB_DIR);
            } else {
                return getProjectRoot().createRelative(ProjectConstants.WEB_DIR);
            }
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public Folder getWebAppRootFolder() {
        return getRootFolder().getFolder(this.mavenProject ? ProjectConstants.MAVEN_WEB_DIR : ProjectConstants.WEB_DIR);
    }

    public String getWebAppRootFolderRawPath() {
        try {
            return getWebAppRoot().getURI().getRawPath();
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    public boolean isMavenProject() {
        return this.mavenProject;
    }

    @Deprecated
    public Resource getMainSrc() {
        try {
            if (this.mavenProject) {
                return getProjectRoot().createRelative(ProjectConstants.MAVEN_SRC_DIR);
            } else {
                return getProjectRoot().createRelative(ProjectConstants.SRC_DIR);
            }
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Deprecated
    public List<Resource> getAllServiceSrcDirs() {
        try {
            List<Resource> serviceSrcDirs = new ArrayList<Resource>();
            List<Resource> serviceDirs = getFileSystem().listChildren(getProjectRoot().createRelative("services/"));
            for (Resource serviceDir : serviceDirs) {
                if (StringUtils.getFilenameExtension(serviceDir.getFilename()) == null) {
                    Resource srcDir = serviceDir.createRelative("src/");
                    if (srcDir.exists()) {
                        serviceSrcDirs.add(srcDir);
                    }
                }
            }
            return serviceSrcDirs;
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public List<Folder> getSourceFolders() {
        return getSourceFolders(getRootFolder(), this.mavenProject);
    }

    /**
     * Returns the service source folders or an empty list
     * 
     * @param projectRoot the root folder of the project
     * @param isMavenProject 'true' indicates the project is a maven project.
     * @return the service source folder
     */
    public static List<Folder> getSourceFolders(Folder projectRoot, boolean isMavenProject) {
        List<Folder> sourceFolders = new ArrayList<Folder>();
        Folder mainSourceFolder = projectRoot.getFolder(isMavenProject ? ProjectConstants.MAVEN_SRC_DIR : ProjectConstants.SRC_DIR);
        if (mainSourceFolder.exists()) {
            sourceFolders.add(mainSourceFolder);
        }
        Resources<Folder> serviceFolders = projectRoot.getFolder("services").list().folders();
        for (Folder serviceFolder : serviceFolders) {
            Folder serviceSourceFolder = serviceFolder.getFolder("src");
            if (serviceSourceFolder.exists()) {
                sourceFolders.add(serviceSourceFolder);
            }
        }
        return Collections.unmodifiableList(sourceFolders);
    }

    @Deprecated
    public Resource getLogFolder() {
        try {
            return getProjectRoot().createRelative(ProjectConstants.LOG_DIR);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Deprecated
    public Resource getWebInf() {
        try {
            return getWebAppRoot().createRelative(ProjectConstants.WEB_INF);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public Folder getWebInfFolder() {
        return getWebAppRootFolder().getFolder(ProjectConstants.WEB_INF);
    }

    @Deprecated
    public Resource getWebXml() {
        try {
            return getWebInf().createRelative(ProjectConstants.WEB_XML);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public File getWebXmlFile() {
        return getWebInfFolder().getFile(ProjectConstants.WEB_XML);
    }

    @Deprecated
    public Resource getWsBindingsResource() {
        try {
            return getWebInf().createRelative(ProjectConstants.WS_BINDINGS_FILE);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public File getWsBindingsFile() {
        return getWebInfFolder().getFile(ProjectConstants.WS_BINDINGS_FILE);
    }

    @Deprecated
    public Resource getSecurityXml() {
        try {
            return getWebInf().createRelative(ProjectConstants.SECURITY_XML);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public File getSecurityXmlFile() {
        return getWebInfFolder().getFile(ProjectConstants.SECURITY_XML);
    }

    @Deprecated
    public Resource getWebInfLib() {
        try {
            return getWebInf().createRelative(ProjectConstants.LIB_DIR);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Deprecated
    public Resource getWebInfClasses() {
        try {
            return getWebInf().createRelative(ProjectConstants.CLASSES_DIR);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public Folder getClassOutputFolder() {
        return getWebInfFolder().getFolder(ProjectConstants.CLASSES_DIR);
    }

    @Override
    @Deprecated
    public void writeFile(String path, String data) throws IOException {
        writeFile(path, data, false);
    }

    /**
     * Write arbitrary data to a file. Creates paths between it and the project root, if the directories don't exist.
     * Overwrite files if they exist.
     * 
     * @param path The path to write to (relative to activeGridHome).
     * @param data The data to write (as a String).
     * @param noClobber If true, don't overwrite file.
     * @throws IOException
     */
    @Deprecated
    public void writeFile(String path, String data, boolean noClobber) throws IOException {
        File file = getRootFolder().getFile(path);
        if (file.exists()) {
            String original = readFile(file);
            if (original.equals(data)) {
                return;
            }
        } else {
            file.createIfMissing();
        }

        if (noClobber && file.exists()) {
            return;
        }

        writeFile(file, data);
    }

    @Override
    @Deprecated
    public boolean fileExists(String path) throws IOException {
        Resource file = getProjectRoot().createRelative(path);
        return file.exists();
    }

    /**
     * Return the name of the project. Currently, this is the name of the directory the project is stored in.
     * 
     * @return
     */
    public String getProjectName() {
        return this.projectName;
    }

    @Override
    @Deprecated
    public Folder getFileServiceRoot() {
        return getRootFolder();
    }

    /**
     * Return the version of the project. If the project isn't versioned (probably because it's a project from an early
     * version), return PROPERTY_PROJECT_VERSION_DEFAULT.
     * 
     * Note that the version number returned from here has no relation to the version of WaveMaker studio. These
     * versions increment when the project structure is upgraded, or when changes need to be made.
     * 
     * @throws IOException
     * @throws InvalidPropertiesFormatException
     */
    public double getProjectVersion() {
        Properties props = getProperties();
        String version = props.getProperty(PROPERTY_PROJECT_VERSION, PROPERTY_PROJECT_VERSION_DEFAULT);
        return Double.valueOf(version);
    }

    public void setProjectVersion(Double version) {
        Properties props = getProperties();
        props.setProperty(PROPERTY_PROJECT_VERSION, version.toString());
        setProperties(props);
    }

    public void clearProperties(Class<?> clazz) {
        Properties props = getProperties();
        Properties newProps = new Properties();
        for (Iterator<String> iter = CastUtils.cast(props.keySet().iterator()); iter.hasNext();) {
            String key = iter.next();
            if (key.startsWith(clazz.getName())) {
                continue;
            }
            newProps.setProperty(key, props.getProperty(key));
        }
        setProperties(newProps);
    }

    public Properties getProperties(Class<?> clazz) {
        return getProperties(clazz.getName());
    }

    public Properties getProperties(String prefix) {
        Properties rtn = new Properties();
        Properties props = getProperties();

        for (Iterator<String> iter = CastUtils.cast(props.keySet().iterator()); iter.hasNext();) {
            String key = iter.next();
            if (key.startsWith(prefix)) {
                String s = key.substring(prefix.length() + 1);
                rtn.setProperty(s, props.getProperty(key));
            }
        }
        return rtn;
    }

    public String getProperty(Class<?> clazz, String key) {
        return getProperties().getProperty(getPropertyName(clazz, key));
    }

    public void setProperty(Class<?> clazz, String key, Object value) {
        Properties p = getProperties();
        p.setProperty(getPropertyName(clazz, key), String.valueOf(value));
        setProperties(p);
    }

    protected Properties getProperties() {
        Properties props = new Properties();
        props.setProperty(PROPERTY_PROJECT_VERSION, PROPERTY_PROJECT_VERSION_DEFAULT);

        try {
            Resource projectProperties = getProjectRoot().createRelative(PROJECT_PROPERTIES);
            if (projectProperties.exists()) {
                props.loadFromXML(projectProperties.getInputStream());
            }
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
        return props;
    }

    protected void setProperties(Properties props) {
        try {
            Resource projectProperties = getProjectRoot().createRelative(PROJECT_PROPERTIES);
            OutputStream os = getFileSystem().getOutputStream(projectProperties);
            props.storeToXML(os, "Project Properties", getEncoding());
            os.close();
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    private String getPropertyName(Class<?> clazz, String key) {
        return clazz.getName() + ProjectConstants.PROP_SEP + key;
    }
}
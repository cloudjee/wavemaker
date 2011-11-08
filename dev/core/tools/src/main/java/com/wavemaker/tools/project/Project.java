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

package com.wavemaker.tools.project;

import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.InvalidPropertiesFormatException;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

import org.springframework.core.io.Resource;
import org.springframework.util.StringUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.CastUtils;
import com.wavemaker.tools.serializer.FileSerializerException;
import com.wavemaker.tools.serializer.FileSerializerFactory;
import com.wavemaker.tools.service.AbstractFileService;

/**
 * Class representing a project. This is intended for internal server-side use only; the client-side interface is
 * through the StudioService. This FileService writes and reads in ServerConstants.DEFAULT_ENCODING (UTF-8).
 * 
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class Project extends AbstractFileService {

    public static final String PROJECT_PROPERTIES = ".wmproject.properties";

    protected static final String PROPERTY_PROJECT_VERSION = "projectVersion";

    protected static final String PROPERTY_PROJECT_VERSION_DEFAULT = "0.0";

    private final Resource projectRoot;

    private final boolean mavenProject;

    public Project(Resource projectRoot, StudioConfiguration studioConfiguration) {
        super(studioConfiguration);
        this.projectRoot = projectRoot;
        try {
            this.mavenProject = projectRoot.createRelative(ProjectConstants.POM_XML).exists();
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public Resource getProjectRoot() {
        return this.projectRoot;
    }

    public Resource getWebAppRoot() {
        try {
            if (this.mavenProject) {
                return this.projectRoot.createRelative(ProjectConstants.MAVEN_WEB_DIR);
            } else {
                return this.projectRoot.createRelative(ProjectConstants.WEB_DIR);
            }
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public boolean isMavenProject() {
        return this.mavenProject;
    }

    public Resource getMainSrc() {
        try {
            if (this.mavenProject) {
                return this.projectRoot.createRelative(ProjectConstants.MAVEN_SRC_DIR);
            } else {
                return this.projectRoot.createRelative(ProjectConstants.SRC_DIR);
            }
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public List<Resource> getAllServiceSrcDirs() {
        try {
            List<Resource> serviceSrcDirs = new ArrayList<Resource>();
            List<Resource> serviceDirs = this.studioConfiguration.listChildren(this.projectRoot.createRelative("services/"));
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

    public Resource getLogFolder() {
        try {
            return this.projectRoot.createRelative(ProjectConstants.LOG_DIR);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public Resource getWebInf() {
        try {
            return getWebAppRoot().createRelative(ProjectConstants.WEB_INF);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public Resource getWebXml() {
        try {
            return getWebInf().createRelative(ProjectConstants.WEB_XML);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public Resource getWsBindingsFile() {
        try {
            return getWebInf().createRelative(ProjectConstants.WS_BINDINGS_FILE);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public Resource getSecurityXml() {
        try {
            return getWebInf().createRelative(ProjectConstants.SECURITY_XML);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public Resource getWebInfLib() {
        try {
            return getWebInf().createRelative(ProjectConstants.LIB_DIR);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public Resource getWebInfClasses() {
        try {
            return getWebInf().createRelative(ProjectConstants.CLASSES_DIR);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    /**
     * Read a project file.
     * 
     * @param path A path to the file, relative to the project's root.
     * @return An object representing contents of the file.
     * @throws FileSerializerException
     */
    public Object readObject(String path) throws FileSerializerException {

        Resource file;
        try {
            file = this.projectRoot.createRelative(path);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
        return FileSerializerFactory.getInstance().readObject(this, file);
    }

    /**
     * Write to a file project. The Object should be a representation (such as that returned by readObject()) of the
     * object, with the proper format.
     * 
     * @param path A path to the file, relative to the project's root.
     * @param obj A representation of the object. This must be an instance of a known project type.
     * @throws FileSerializerException
     */
    public void writeObject(String path, Object obj) throws FileSerializerException {

        Resource file;
        try {
            file = this.projectRoot.createRelative(path);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
        FileSerializerFactory.getInstance().writeObject(this, obj, file);
    }

    @Override
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
    public void writeFile(String path, String data, boolean noClobber) throws IOException {

        Resource file = this.projectRoot.createRelative(path);
        if (file.exists()) {
            String original = readFile(file);
            if (original.equals(data)) {
                return;
            }
        } else {
            file = this.studioConfiguration.createPath(this.projectRoot, path);
        }

        if (noClobber && file.exists()) {
            return;
        }

        writeFile(file, data);
    }

    /**
     * Return the name of the project. Currently, this is the name of the directory the project is stored in.
     * 
     * @return
     */
    public String getProjectName() {
        return this.projectRoot.getFilename();
    }

    @Override
    public Resource getFileServiceRoot() {
        return this.projectRoot;
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
            OutputStream os = this.studioConfiguration.getOutputStream(projectProperties);
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
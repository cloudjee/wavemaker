/*
 *  Copyright (C) 2007-2010 WaveMaker Software, Inc.
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
package com.wavemaker.tools.project;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.InvalidPropertiesFormatException;
import java.util.Iterator;
import java.util.Properties;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.CastUtils;
import com.wavemaker.tools.serializer.FileSerializerException;
import com.wavemaker.tools.serializer.FileSerializerFactory;
import com.wavemaker.tools.service.AbstractFileService;

/**
 * Class representing a project. This is intended for internal server-side use
 * only; the client-side interface is through the StudioService. This
 * FileService writes and reads in ServerConstants.DEFAULT_ENCODING (UTF-8).
 * 
 * @author Matt Small
 * @version $Rev$ - $Date$
 * 
 */
public class Project extends AbstractFileService {

    public static final String PROJECT_PROPERTIES = ".wmproject.properties";

    protected static final String PROPERTY_PROJECT_VERSION = "projectVersion";

    protected static final String PROPERTY_PROJECT_VERSION_DEFAULT = "0.0";

    private final File projectRoot;

    public Project(File projectRoot) {

        this.projectRoot = projectRoot;
    }

    public File getProjectRoot() {
        return projectRoot;
    }

    public File getWebAppRoot() {
        return new File(projectRoot, ProjectConstants.WEB_DIR);
    }

    public File getLogFolder() {
	return new File(projectRoot, ProjectConstants.LOG_DIR);
    }


    public File getWebInf() {
        return new File(getWebAppRoot(), ProjectConstants.WEB_INF);
    }
    
    public File getWebXml() {
        return new File(getWebInf(), ProjectConstants.WEB_XML);
    }

    public File getSecurityXml() {
        return new File(getWebInf(), ProjectConstants.SECURITY_XML);
    }

    public File getWebInfLib() {
        return new File(getWebInf(), ProjectConstants.LIB_DIR);
    }
    
    public File getWebInfClasses() {
        return new File(getWebInf(), ProjectConstants.CLASSES_DIR);
    }

    /**
     * Read a project file.
     * 
     * @param path
     *                A path to the file, relative to the project's root.
     * @return An object representing contents of the file.
     * @throws FileSerializerException
     */
    public Object readObject(String path) throws FileSerializerException {

        File f = new File(projectRoot, path);
        return FileSerializerFactory.getInstance().readObject(this, f);
    }

    /**
     * Write to a file project. The Object should be a representation (such as
     * that returned by readObject()) of the object, with the proper format.
     * 
     * @param path
     *                A path to the file, relative to the project's root.
     * @param obj
     *                A representation of the object. This must be an instance
     *                of a known project type.
     * @throws FileSerializerException
     */
    public void writeObject(String path, Object obj)
            throws FileSerializerException {

        File f = new File(projectRoot, path);
        FileSerializerFactory.getInstance().writeObject(this, obj, f);
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.FileService#writeFile(java.lang.String,
     *      java.lang.String)
     */
    @Override
    public void writeFile(String path, String data) throws IOException {

        writeFile(path, data, false);
    }

    /**
     * Write arbitrary data to a file. Creates paths between it and the project
     * root, if the directories don't exist. Overwrite files if they exist.
     * 
     * @param path
     *                The path to write to (relative to activeGridHome).
     * @param data
     *                The data to write (as a String).
     * @param noClobber
     *                If true, don't overwrite file.
     * @throws IOException
     */
    public void writeFile(String path, String data, boolean noClobber)
            throws IOException {

        File f = new File(projectRoot, path);
	if (f.exists()) {
	    String original = com.wavemaker.common.util.IOUtils.read(f);
	    if (original.equals(data)) return;
	} else
	    com.wavemaker.common.util.IOUtils.makeDirectories(f.getParentFile(),
							      projectRoot);

        if (noClobber && f.exists()) {
            return;
        }

        super.writeFile(f, data);
    }

    /**
     * Return the name of the project. Currently, this is the name of the
     * directory the project is stored in.
     * 
     * @return
     */
    public String getProjectName() {
        return projectRoot.getName();
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.FileService#getFileServiceRoot()
     */
    public File getFileServiceRoot() {
        return this.projectRoot;
    }

    /**
     * Return the version of the project. If the project isn't versioned
     * (probably because it's a project from an early version), return
     * PROPERTY_PROJECT_VERSION_DEFAULT.
     * 
     * Note that the version number returned from here has no relation to the
     * version of WaveMaker studio. These versions increment when the project
     * structure is upgraded, or when changes need to be made.
     * 
     * @throws IOException
     * @throws InvalidPropertiesFormatException
     */
    public double getProjectVersion() {
        Properties props = getProperties();
        String version = props.getProperty(PROPERTY_PROJECT_VERSION,
                PROPERTY_PROJECT_VERSION_DEFAULT);
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
        for (Iterator<String> iter = CastUtils.cast(props.keySet().iterator()); iter
                .hasNext();) {
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

        for (Iterator<String> iter = CastUtils.cast(props.keySet().iterator()); iter
                .hasNext();) {
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
        Properties ret = new Properties();
        ret.setProperty(PROPERTY_PROJECT_VERSION,
                PROPERTY_PROJECT_VERSION_DEFAULT);

        File projectProperties = new File(getProjectRoot(), PROJECT_PROPERTIES);
        if (projectProperties.exists()) {
            InputStream is;
            try {
                is = new FileInputStream(projectProperties);
                ret.loadFromXML(is);
                is.close();
            } catch (IOException e) {
                throw new WMRuntimeException(e);
            }
        }

        return ret;
    }

    protected void setProperties(Properties props) {
        File projectProperties = new File(getProjectRoot(), PROJECT_PROPERTIES);
        OutputStream os;
        try {
            os = new FileOutputStream(projectProperties);
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
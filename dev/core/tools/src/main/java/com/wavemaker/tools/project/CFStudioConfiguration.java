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

package com.wavemaker.tools.project;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletContext;

import org.springframework.core.io.Resource;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.context.ServletContextAware;
import org.springframework.web.context.support.ServletContextResource;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.Mongo;
import com.mongodb.MongoException;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.io.GFSResource;
import com.wavemaker.common.util.FileAccessException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.tools.config.ConfigurationStore;

/**
 * StudioConfiguration holds configuration data associated with this studio.
 * 
 * @author Matt Small
 * @author Joel Hare
 * @author Jeremy Grelle
 * @author Ed Callahan
 */
public class CFStudioConfiguration implements StudioConfiguration, ServletContextAware {

    public static final String MARKER_RESOURCE_NAME = "marker.resource.txt";

    public static final String WAVEMAKER_HOME = "WaveMaker/";

    public static final String PROJECTS_DIR = "projects/";

    public static final String COMMON_DIR = "common/";

    public static final String PROJECTHOME_KEY = "projectsDir";

    public static final String DEMOHOME_KEY = "demoHome";

    public static final String WMHOME_KEY = "wavemakerHome";

    public static final String PROJECTHOME_PROP_KEY = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX + PROJECTHOME_KEY;

    public static final String WMHOME_PROP_KEY = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX + WMHOME_KEY;

    protected static final String VERSION_KEY = "studioVersion";

    protected static final String VERSION_DEFAULT = "4.0.0";

    public static final String CMD_GET = "get";

    public static final String CMD_SET = "set";

    protected static final String CMD_DEL = "del";

    protected static final String CMD_NOTSET = "NOTSET";

    protected static final String VERSION_FILE = "version";

    private ServletContext servletContext;

    private final GridFS gfs;

    private final DBCollection dirsCollection;

    private final DBObject dirsDoc;

    private final LocalStudioConfiguration delegate;

    public CFStudioConfiguration() throws UnknownHostException, MongoException {
        this(new SimpleMongoDbFactory(new Mongo("127.0.0.1"), "testThisDB"));
    }

    public CFStudioConfiguration(MongoDbFactory mongoFactory) {
        DB db = mongoFactory.getDb();
        this.gfs = new GridFS(mongoFactory.getDb());
        this.dirsCollection = db.getCollection("fs.dirs");
        DBObject existingDoc = this.dirsCollection.findOne();
        if (existingDoc != null) {
            this.dirsDoc = existingDoc;
        } else {
            this.dirsDoc = new BasicDBObject();
            BasicDBList homeChildren = new BasicDBList();
            homeChildren.add("/" + COMMON_DIR);
            homeChildren.add("/" + PROJECTS_DIR);
            this.dirsDoc.put("/", homeChildren);
            this.dirsDoc.put("/" + COMMON_DIR, new BasicDBList());
            this.dirsDoc.put("/" + PROJECTS_DIR, new BasicDBList());
            this.dirsCollection.insert(this.dirsDoc);
        }
        this.delegate = new LocalStudioConfiguration();
    }

    /**
     * WaveMaker home override, used for testing. NEVER set this in production.
     */
    private File testWMHome = null;

    /**
     * WaveMaker demo directory override, used for testing. NEVER set this in production.
     */
    private File testDemoDir = null;

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.tools.project.StudioConfiguration#getProjectsDir()
     */
    @Override
    public Resource getProjectsDir() {
        String projectsProp = null;
        if (isRuntime()) {
            projectsProp = (String) RuntimeAccess.getInstance().getSession().getAttribute(PROJECTHOME_PROP_KEY);
        } else {
            projectsProp = System.getProperty(PROJECTHOME_PROP_KEY, null);
        }

        if (null != projectsProp && 0 != projectsProp.length()) {
            projectsProp = projectsProp.endsWith("/") ? projectsProp : projectsProp + "/";
            return new GFSResource(this.gfs, this.dirsDoc, projectsProp);
        }

        try {
            Resource projectsDir = ((GFSResource) getWaveMakerHome()).createRelative(PROJECTS_DIR);

            if (!projectsDir.exists()) {
                new GFSResource(this.gfs, this.dirsDoc, ((GFSResource) projectsDir).getPath());
            }
            return projectsDir;
        } catch (IOException ex) {
            ex.printStackTrace();
            throw new WMRuntimeException(ex);
        }
    }

    private boolean isRuntime() {
        try {
            if (RuntimeAccess.getInstance() != null && RuntimeAccess.getInstance().getRequest() != null) {
                return true;
            }
        } catch (Exception e) {
        }
        return false;
    }

    private static boolean isCloud;

    private static boolean isCloudInitialized = false;

    public static boolean isCloud() {
        if (!isCloudInitialized) {
            try {

                org.springframework.core.io.ClassPathResource cpr = new org.springframework.core.io.ClassPathResource("cloud.src.resource");
                isCloud = cpr.exists();
                isCloudInitialized = true;
            } catch (Exception e) {
                return false;
            }
        }

        return isCloud;
    }

    public GridFS getGFS() {
        return this.gfs;
    }

    public void setTestWaveMakerHome(File file) {
        this.testWMHome = file;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.tools.project.StudioConfiguration#getWaveMakerHome()
     */
    @Override
    public Resource getWaveMakerHome() {

        if (null != this.testWMHome) {
            return new GFSResource(this.gfs, this.dirsDoc, this.testWMHome.toString() + "/");
        }

        return internalGetWaveMakerHome();
    }

    private Resource internalGetWaveMakerHome() {
        return new GFSResource(this.gfs, this.dirsDoc, "/");
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.tools.project.StudioConfiguration#getDemoDir()
     */
    @Override
    public Resource getDemoDir() {
        if (isCloud()) {
            return null;
        }

        if (null != this.testDemoDir) {
            return new GFSResource(this.gfs, this.dirsDoc, this.testDemoDir.toString() + "/");
        }

        String location = ConfigurationStore.getPreference(getClass(), DEMOHOME_KEY, null);
        Resource demo;
        try {
            if (null != location) {
                demo = new GFSResource(this.gfs, this.dirsDoc, location);
            } else {
                demo = getStudioWebAppRoot().createRelative("../Samples");
            }
            return demo;
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public void setDemoDir(File file) {
        if (isCloud()) {
            return;
        }

        ConfigurationStore.setPreference(getClass(), DEMOHOME_KEY, file.getAbsolutePath());
    }

    public void setTestDemoDir(File file) {
        if (isCloud()) {
            return;
        }

        this.testDemoDir = file;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.tools.project.StudioConfiguration#getCommonDir()
     */
    @Override
    public Resource getCommonDir() throws IOException {
        Resource common = getWaveMakerHome().createRelative(COMMON_DIR);

        if (!common.exists() && getWaveMakerHome().exists()) {
            createCommonDir(common);
        }

        return common;
    }

    @Override
    public Resource createCommonRelative(String relPath) throws IOException {
        return this.getCommonDir().createRelative(relPath);
    }

    private synchronized void createCommonDir(Resource common) throws IOException {

        if (!common.exists()) {
            Resource templateFile = getStudioWebAppRoot().createRelative("lib/wm/" + COMMON_DIR);
            if (templateFile.exists()) {
                this.copyRecursive(templateFile, common, IOUtils.DEFAULT_EXCLUSION);
            }
        }
    }

    // other studio information
    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.tools.project.StudioConfiguration#getStudioWebAppRootFile()
     */
    @Override
    public Resource getStudioWebAppRoot() {
        return new ServletContextResource(this.servletContext, "/");
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.tools.project.StudioConfiguration#getPreferencesMap()
     */
    @Override
    public Map<String, String> getPreferencesMap() {

        Map<String, String> prefs = new HashMap<String, String>();

        try {
            prefs.put(WMHOME_KEY, ((GFSResource) getWaveMakerHome()).getPath());
        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }

        try {
            prefs.put(DEMOHOME_KEY, isCloud() ? null : ((GFSResource) getDemoDir()).getPath());
            return prefs;
        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }
    }

    /**
     * Change the preferences defined in the map; this will use the accessors.
     * 
     * @param prefs
     * @throws FileAccessException
     */
    @Override
    public void setPreferencesMap(Map<String, String> prefs) {
        // This is a no-op in CloudFoundry
        return;
    }

    /**
     * Gets the current VersionInfo from the VERSION file.
     */
    public static VersionInfo getCurrentVersionInfo() throws IOException {

        String versionFileString = getCurrentVersionInfoString();

        final Pattern p = Pattern.compile("^Version: (.*)$", Pattern.MULTILINE);
        Matcher m = p.matcher(versionFileString);
        if (!m.find()) {
            throw new WMRuntimeException("bad version string: " + versionFileString);
        }

        return new VersionInfo(m.group(1));
    }

    public static String getCurrentVersionInfoString() throws IOException {

        String versionFile = CFStudioConfiguration.class.getPackage().getName().replace(".", "/") + "/" + VERSION_FILE;
        InputStream is = CFStudioConfiguration.class.getClassLoader().getResourceAsStream(versionFile);
        String versionFileString = org.apache.commons.io.IOUtils.toString(is);

        return versionFileString;
    }

    /**
     * Set the registry version.
     */
    public static void setRegisteredVersionInfo(VersionInfo vi) {
        ConfigurationStore.setPreference(CFStudioConfiguration.class, VERSION_KEY, vi.toString());
    }

    /**
     * Gets the last registered version (i.e., the version stored in the registry).
     */
    public static VersionInfo getRegisteredVersionInfo() {
        String versionString = ConfigurationStore.getPreference(CFStudioConfiguration.class, VERSION_KEY, VERSION_DEFAULT);
        return new VersionInfo(versionString);
    }

    // bean properties
    private RuntimeAccess runtimeAccess;

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.tools.project.StudioConfiguration#getRuntimeAccess()
     */
    @Override
    public RuntimeAccess getRuntimeAccess() {
        return this.runtimeAccess;
    }

    public void setRuntimeAccess(RuntimeAccess runtimeAccess) {
        this.runtimeAccess = runtimeAccess;
        this.delegate.setRuntimeAccess(runtimeAccess);
    }

    @Override
    public void setServletContext(ServletContext servletContext) {
        this.servletContext = servletContext;
    }

    @Override
    public Resource createPath(Resource root, String path) {
        Assert.isInstanceOf(Resource.class, root, "GFS: Expected a Resource");
        try {
            GFSResource relativeResource = (GFSResource) root.createRelative(path);
            return relativeResource;
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    /**
     * Copy the input stream into a new Resource. Save the resource.
     */
    @Override
    public Resource copyFile(Resource root, InputStream source, String filePath) {
        Assert.isInstanceOf(GFSResource.class, root, "GFS: Expected a GFSResource");
        try {
            Resource targetFile = root.createRelative(filePath);
            FileCopyUtils.copy(source, getOutputStream(targetFile));
            return targetFile;
        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Override
    public boolean deleteFile(Resource file) {
        Assert.isInstanceOf(Resource.class, file, "GFS: Expected a Resource");
        GFSResource fileResource = (GFSResource) file;
        recursiveDelete(fileResource);
        if (fileResource.isDirectory()) {
            Object id = this.dirsDoc.get("_id");
            this.dirsCollection.update(new BasicDBObject("_id", id), this.dirsDoc);
        }
        return true;
    }

    private void recursiveDelete(GFSResource fileResource) {
        if (fileResource.isDirectory()) {
            try {
                List<Resource> children = listChildren(fileResource);
                for (Resource child : children) {
                    deleteFile(child);
                }
                this.dirsDoc.removeField(fileResource.getPath());
            } catch (Exception ex) {
                throw new WMRuntimeException(ex);
            }
        } else {
            fileResource.deleteFile();
        }
    }

    @Override
    public OutputStream getOutputStream(Resource file) {
        try {
            Assert.isTrue(!((GFSResource) file).isDirectory(), "Cannot get an output stream for a directory.");
            prepareForWriting(file);
            return ((GFSResource) file).getOutputStream();
        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Override
    public Resource copyRecursive(Resource root, Resource target, final List<String> exclusions) {
        try {
            if (isDirectory(root)) {

                List<Resource> children = this.listChildren(root, new ResourceFilter() {

                    @Override
                    public boolean accept(Resource resource) {
                        return !exclusions.contains(resource.getFilename());
                    }
                });

                for (Resource child : children) {
                    if (isDirectory(child)) {
                        copyRecursive(child, target.createRelative(child.getFilename() + "/"), exclusions);
                    } else {
                        FileCopyUtils.copy(child.getInputStream(), getOutputStream(target.createRelative(child.getFilename())));
                    }
                }
            } else {
                FileCopyUtils.copy(root.getInputStream(), getOutputStream(target));
            }

        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
        return target;
    }

    @Override
    public List<Resource> listChildren(Resource root) {
        if (!(root instanceof GFSResource)) {
            return this.delegate.listChildren(root);
        }
        GFSResource gfsRoot = (GFSResource) root;
        List<Resource> children = new ArrayList<Resource>();
        List<GridFSDBFile> files;
        try {
            files = gfsRoot.listFiles();
        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }
        if (files != null) {
            for (GridFSDBFile file : files) {
                children.add(new GFSResource(this.gfs, this.dirsDoc, file.getFilename()));
            }
        }
        children.addAll(listChildDirectories(gfsRoot));
        return children;
    }

    @Override
    public List<Resource> listChildren(Resource root, ResourceFilter filter) {
        if (!(root instanceof GFSResource)) {
            return this.delegate.listChildren(root, filter);
        }
        GFSResource gfsRoot = (GFSResource) root;
        List<Resource> children = new ArrayList<Resource>();
        List<GridFSDBFile> files;
        try {
            files = gfsRoot.listFiles();
        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }
        if (files != null) {
            for (GridFSDBFile file : files) {
                GFSResource resource = new GFSResource(this.gfs, this.dirsDoc, file.getFilename());
                if (filter.accept(resource)) {
                    children.add(resource);
                }
            }
        }
        List<GFSResource> childDirs = listChildDirectories(gfsRoot);
        for (GFSResource childDir : childDirs) {
            if (filter.accept(childDir)) {
                children.add(childDir);
            }
        }
        return children;
    }

    private List<GFSResource> listChildDirectories(GFSResource root) {
        List<GFSResource> gfsDirs = new ArrayList<GFSResource>();
        BasicDBList childDirs = (BasicDBList) this.dirsDoc.get(root.getPath());
        if (childDirs != null) {
            for (int i = 0; i < childDirs.size(); i++) {
                String childDir = (String) childDirs.get(i);
                gfsDirs.add(new GFSResource(this.gfs, this.dirsDoc, childDir));
            }
        }
        return gfsDirs;
    }

    @Override
    public Resource createTempDir() {
        try {
            return new GFSResource(this.gfs, this.dirsDoc, "/tmp");
        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Override
    public Resource getResourceForURI(String resourceURI) {
        return new GFSResource(this.gfs, this.dirsDoc, resourceURI);
    }

    @Override
    public void prepareForWriting(Resource file) {
        Assert.isInstanceOf(GFSResource.class, file, "This implementation can only write to Grid FS");
        GFSResource gfsFile = (GFSResource) file;
        String path = gfsFile.isDirectory() ? gfsFile.getPath()
            : gfsFile.getPath().substring(0, gfsFile.getPath().lastIndexOf(gfsFile.getFilename()));
        boolean isDirty = false;
        while (path.length() > 1) {
            String currentDir = StringUtils.getFilename(path.substring(0, path.length() - 1));
            String parent = path.substring(0, path.lastIndexOf(currentDir));
            BasicDBList children;
            if (this.dirsDoc.containsField(parent)) {
                children = (BasicDBList) this.dirsDoc.get(parent);
            } else {
                children = new BasicDBList();
                this.dirsDoc.put(parent, children);
            }
            if (!children.contains(path)) {
                children.add(path);
                isDirty = true;
            }
            Assert.isTrue(!path.equals(parent), "Invalid output path for resource: " + gfsFile.getPath());
            path = parent;
        }
        if (isDirty) {
            Object id = this.dirsDoc.get("_id");
            this.dirsCollection.update(new BasicDBObject("_id", id), this.dirsDoc);
        }
    }

    @Override
    public void rename(Resource oldResource, Resource newResource) {
        Assert.isInstanceOf(Resource.class, oldResource, "GFS: Expected a Resource");
        Assert.isInstanceOf(Resource.class, newResource, "GFS: Expected a Resource");
        try {
            this.copyRecursive(oldResource, newResource, IOUtils.DEFAULT_EXCLUSION);
            this.deleteFile(oldResource);
        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Override
    public String getPath(Resource file) {
        if (!(file instanceof GFSResource)) {
            return this.delegate.getPath(file);
        }
        return ((GFSResource) file).getPath();
    }

    @Override
    public boolean isDirectory(Resource file) {
        if (!(file instanceof GFSResource)) {
            return this.delegate.isDirectory(file);
        }
        return ((GFSResource) file).isDirectory();
    }
}

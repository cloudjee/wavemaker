
package com.wavemaker.tools.project;

import java.io.*;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.Mongo;
import com.mongodb.MongoException;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.io.GFSResource;
import com.wavemaker.common.util.IOUtils;

/**
 * Implementation of {@link StudioFileSystem} backed by {@link GridFS}.
 * 
 * @author Ed Callahan
 * @author Jeremy Grelle
 * @author Joel Hare
 * @author Matt Small
 * @author Phillip Webb
 */
public class GridFSStudioFileSystem extends AbstractStudioFileSystem {

    private final LocalStudioFileSystem delegate;

    private final GridFS gfs;

    private DBObject dirsDoc;

    private final DBCollection dirsCollection;

    /**
     * WaveMaker home override, used for testing. NEVER set this in production.
     */
    private File testWMHome;

    /**
     * WaveMaker demo directory override, used for testing. NEVER set this in production.
     */
    private File testDemoDir;

    public GridFSStudioFileSystem() throws UnknownHostException, MongoException {
        this(new SimpleMongoDbFactory(new Mongo("127.0.0.1"), "testThisDB"));
    }

    public GridFSStudioFileSystem(MongoDbFactory mongoFactory) {
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
        this.delegate = new LocalStudioFileSystem();
    }

    @Override
    public Resource getWaveMakerHome() {
        if (this.testWMHome != null) {
            return createResource(this.testWMHome.toString() + "/");
        }
        return internalGetWaveMakerHome();
    }

    public void setTestWaveMakerHome(File file) {
        this.testWMHome = file;
    }

    private Resource internalGetWaveMakerHome() {
        return createResource("/");
    }

    @Override
    protected void makeDirectories(Resource projectsDir) {
        createResource(((GFSResource) projectsDir).getPath());
    }

    @Override
    public Resource getDemoDir() {
        if (this.testDemoDir != null) {
            return createResource(this.testDemoDir.toString() + "/");
        }
        try {
            return getStudioWebAppRoot().createRelative("../Samples");
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public void setTestDemoDir(File file) {
        this.testDemoDir = file;
    }

    @Override
    public boolean isDirectory(Resource resource) {
        if (!(resource instanceof GFSResource)) {
            return this.delegate.isDirectory(resource);
        }
        return ((GFSResource) resource).isDirectory();
    }

    @Override
    public String getPath(Resource resource) {
        if (!(resource instanceof GFSResource)) {
            return this.delegate.getPath(resource);
        }
        return ((GFSResource) resource).getPath();
    }

    @Override
    public OutputStream getOutputStream(Resource resource) {
        try {
            Assert.isTrue(!((GFSResource) resource).isDirectory(), "Cannot get an output stream for a directory.");
            prepareForWriting(resource);
            return ((GFSResource) resource).getOutputStream();
        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Override
    public void prepareForWriting(Resource resource) {
        Assert.isInstanceOf(GFSResource.class, resource, "This implementation can only write to Grid FS");
        GFSResource gfsFile = (GFSResource) resource;
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
    public List<Resource> listChildren(Resource resource, ResourceFilter filter) {
        if (!(resource instanceof GFSResource)) {
            return this.delegate.listChildren(resource, filter);
        }
        GFSResource gfsRoot = (GFSResource) resource;
        List<Resource> children = new ArrayList<Resource>();
        List<GridFSDBFile> files;
        try {
            files = gfsRoot.listFiles();
        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }
        if (files != null) {
            for (GridFSDBFile file : files) {
                GFSResource fileResource = new GFSResource(this.gfs, this.dirsDoc, file.getFilename());
                if (filter.accept(fileResource)) {
                    children.add(fileResource);
                }
            }
        }
        List<Resource> childDirs = listChildDirectories(gfsRoot);
        for (Resource childDir : childDirs) {
            if (filter.accept(childDir)) {
                children.add(childDir);
            }
        }
        return children;
    }

    private List<Resource> listChildDirectories(GFSResource resource) {
        List<Resource> gfsDirs = new ArrayList<Resource>();
        BasicDBList childDirs = (BasicDBList) this.dirsDoc.get(resource.getPath());
        if (childDirs != null) {
            for (int i = 0; i < childDirs.size(); i++) {
                String childDir = (String) childDirs.get(i);
                gfsDirs.add(createResource(childDir));
            }
        }
        return gfsDirs;
    }

    @Override
    public Resource createPath(Resource resource, String path) {
        Assert.isInstanceOf(Resource.class, resource, "GFS: Expected a Resource");
        try {
            GFSResource relativeResource = (GFSResource) resource.createRelative(path);
            return relativeResource;
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

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

    //Copy files from local file system to Cloud Foundry file repository (mongodb)
    public Resource copyRecursive(File root, Resource target, final List<String> exclusions) {
        try {
            if (root.isDirectory()) {

                File[] children = root.listFiles(new FileFilter() {

                    @Override
                    public boolean accept(File pathName) {
                        return !exclusions.contains(pathName.getName());
                    }
                });

                for (File child : children) {
                    if (child.isDirectory()) {
                        copyRecursive(child, target.createRelative(child.getName() + "/"), exclusions);
                    } else {
                        InputStream isc = new FileInputStream(child);
                        FileCopyUtils.copy(isc, getOutputStream(target.createRelative(child.getName())));
                    }
                }
            } else {
                InputStream isp = new FileInputStream(root);
                FileCopyUtils.copy(isp, getOutputStream(target));
            }

        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
        return target;

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
    public boolean deleteFile(Resource resource) {
        Assert.isInstanceOf(Resource.class, resource, "GFS: Expected a Resource");
        GFSResource fileResource = (GFSResource) resource;
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
    public Resource createTempDir() {
        try {
            return createResource("/tmp");
        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Override
    protected Resource createResource(String path) {
        return new GFSResource(this.gfs, this.dirsDoc, path);
    }

    @Override
    protected String getFSType() {
        return new String("CF-GFS");
    }
}

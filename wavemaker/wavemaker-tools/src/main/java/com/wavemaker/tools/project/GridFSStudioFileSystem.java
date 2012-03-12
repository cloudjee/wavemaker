
package com.wavemaker.tools.project;

import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.PathMatcher;
import org.springframework.util.StringUtils;

import com.mongodb.DB;
import com.mongodb.gridfs.GridFS;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.ResourcePath;
import com.wavemaker.tools.io.filesystem.FileSystemFolder;
import com.wavemaker.tools.io.filesystem.mongo.MongoFileSystem;

/**
 * Implementation of {@link StudioFileSystem} backed by {@link GridFS}.
 * 
 * @author Ed Callahan
 * @author Jeremy Grelle
 * @author Joel Hare
 * @author Matt Small
 * @author Phillip Webb
 * 
 * @deprecated prefer the new wavemaker {@link com.wavemaker.tools.io.Resource} abstraction
 */
@Deprecated
public class GridFSStudioFileSystem extends AbstractStudioFileSystem {

    private final Folder rootFolder;

    private final LocalStudioFileSystem delegate;

    /**
     * WaveMaker home override, used for testing. NEVER set this in production.
     */
    @Deprecated
    private File testWMHome;

    public GridFSStudioFileSystem(MongoDbFactory mongoFactory) {
        DB db = mongoFactory.getDb();
        MongoFileSystem fileSystem = new MongoFileSystem(db, GridFS.DEFAULT_BUCKET);
        this.rootFolder = FileSystemFolder.getRoot(fileSystem);
        this.delegate = new LocalStudioFileSystem();
        setupBasicStructure();
    }

    private void setupBasicStructure() {
        getCommonFolder().touch();
        this.rootFolder.getFolder(PROJECTS_DIR).touch();
    }

    @Override
    public Folder getCommonFolder() {
        return this.rootFolder.getFolder(COMMON_DIR);
    }

    @Override
    public Folder getWaveMakerHomeFolder() {
        return this.rootFolder;
    }

    @Override
    public Resource getWaveMakerHome() {
        if (this.testWMHome != null) {
            return createResource(this.testWMHome.toString() + "/");
        }
        return new GFSResource(this.rootFolder, "/");
    }

    public void setTestWaveMakerHome(File file) {
        this.testWMHome = file;
    }

    @Override
    protected void makeDirectories(Resource dir) {
        prepareForWriting(dir);
    }

    @Override
    public Resource getDemoDir() {
        try {
            return getStudioWebAppRoot().createRelative("../Samples");
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Override
    public boolean isDirectory(Resource resource) {
        if (!(resource instanceof GFSResource)) {
            return this.delegate.isDirectory(resource);
        }
        com.wavemaker.tools.io.Resource existingResource = ((GFSResource) resource).getExistingResource(false);
        return existingResource != null && existingResource instanceof Folder;
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
            if (isDirectory(resource)) {
                throw new IllegalArgumentException("Cannot get an output stream for directory '" + resource.getDescription() + "'");
            }
            prepareForWriting(resource);
            return ((GFSResource) resource).getOutputStream();
        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Override
    public void prepareForWriting(Resource resource) {
        Assert.isInstanceOf(GFSResource.class, resource, "This implementation can only write to Grid FS");
        GFSResource parent = getParent(resource);
        if (parent != null) {
            parent.getResource(Folder.class).touch();
        }
    }

    @Override
    public List<Resource> listChildren(Resource resource, ResourceFilter filter) {
        if (!(resource instanceof GFSResource)) {
            return this.delegate.listChildren(resource, filter);
        }
        List<Resource> children = new ArrayList<Resource>();
        collectChildren(children, (GFSResource) resource, filter == null ? ResourceFilter.NO_FILTER : filter, false);
        return children;
    }

    @Override
    public List<Resource> listAllChildren(Resource resource, ResourceFilter filter) {
        if (!(resource instanceof GFSResource)) {
            return this.delegate.listAllChildren(resource, filter);
        }
        List<Resource> children = new ArrayList<Resource>();
        collectChildren(children, (GFSResource) resource, filter == null ? ResourceFilter.NO_FILTER : filter, true);
        return children;
    }

    private void collectChildren(List<Resource> children, GFSResource resource, ResourceFilter resourceFilter, boolean allChildren) {
        com.wavemaker.tools.io.Resource existingResource = resource.getExistingResource(false);
        if (existingResource != null && existingResource instanceof Folder) {
            Folder folder = (Folder) existingResource;
            for (com.wavemaker.tools.io.Resource child : folder.list()) {
                GFSResource childResource = new GFSResource(this.rootFolder, child.toString());
                if (allChildren && child instanceof Folder) {
                    collectChildren(children, childResource, resourceFilter, allChildren);
                } else {
                    if (resourceFilter.accept(childResource)) {
                        children.add(childResource);
                    }
                }
            }
        }
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

    @Override
    public Resource copyRecursive(Resource root, Resource target, final String includedPattern, final String excludedPattern) {
        try {
            if (isDirectory(root)) {
                List<Resource> children = this.listChildren(root, new ResourceFilter() {

                    @Override
                    public boolean accept(Resource resource) {
                        PathMatcher matcher = new AntPathMatcher();
                        return !matcher.match(excludedPattern, resource.getFilename()) && matcher.match(includedPattern, resource.getFilename());
                    }
                });

                for (Resource child : children) {
                    if (isDirectory(child)) {
                        copyRecursive(child, target.createRelative(child.getFilename() + "/"), includedPattern, excludedPattern);
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
    public Resource copyRecursive(File root, Resource target, final List<String> exclusions) {
        try {
            if (root.isDirectory()) {
                File[] children = root.listFiles(new FileFilter() {

                    @Override
                    public boolean accept(File pathName) {
                        return exclusions == null || !exclusions.contains(pathName.getName());
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
        GFSResource gfsResource = (GFSResource) resource;
        com.wavemaker.tools.io.Resource existingResource = gfsResource.getExistingResource(false);
        if (existingResource != null) {
            existingResource.delete();
        }
        return true;
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
        return new GFSResource(this.rootFolder, path);
    }

    @Override
    protected String getFSType() {
        return new String("CF-GFS");
    }

    @Override
    public GFSResource getParent(Resource resource) {
        GFSResource gfsResource = (GFSResource) resource;
        ResourcePath resourcePath = new ResourcePath().get(gfsResource.getPath());
        if (resourcePath.getParent() == null) {
            return null;
        }
        return new GFSResource(this.rootFolder, resourcePath.getParent().toString());
    }

    @Override
    public Resource createProjectLib(Project project) {
        File tempProjLib;
        try {
            tempProjLib = IOUtils.createTempDirectory(project.getProjectName() + "_lib", null);
            Resource cfProjLib = project.getProjectRoot().createRelative("lib/");

            List<Resource> children = this.listChildren(cfProjLib, new ResourceFilter() {

                @Override
                public boolean accept(Resource resource) {
                    return StringUtils.getFilenameExtension(resource.getFilename()).equals("jar");
                }
            });

            for (Resource child : children) {
                InputStream is = child.getInputStream();
                OutputStream os = new FileOutputStream(new File(tempProjLib, child.getFilename()));
                FileCopyUtils.copy(is, os);
            }
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }

        return new FileSystemResource(tempProjLib);
    }
}

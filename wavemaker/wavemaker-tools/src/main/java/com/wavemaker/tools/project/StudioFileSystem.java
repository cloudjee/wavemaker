
package com.wavemaker.tools.project;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

import org.springframework.core.io.Resource;

import com.wavemaker.tools.io.Folder;

/**
 * Provides a virtual files system for use with WaveMaker. Files are exposed using the Spring {@link Resource} interface
 * and as such do not actually need to be stored on Disk, for example an files system implementation may use a database
 * as the underlying storage mechanism.
 * 
 * @author Matt Small
 * @author Jeremy Grelle
 * @author Phillip Webb
 */
public interface StudioFileSystem {

    // FIXME PW filesystem : remove this interface and find another way to access common

    Folder getCommonFolder();

    Folder getWaveMakerHomeFolder();

    /**
     * Returns the WaveMaker home directory.
     * 
     * @return the home directory
     */
    @Deprecated
    Resource getWaveMakerHome();

    // this is the root of all stuff. Under here is /projects /logs /common (by default this is
    // /documents/wavemaker)

    /**
     * Return the directory used to store WaveMaker projects.
     * 
     * @return the projects directory
     * @throws IOException
     */
    @Deprecated
    Resource getProjectsDir(); // Same as wavemaker home /projects

    /**
     * Returns the directory containing WaveMaker demo projects.
     * 
     * @return the demo directory or <tt>null</tt>
     */
    @Deprecated
    Resource getDemoDir(); // In desktop land this is shipped with WM, in /app/wm/examples. This is mutable.

    /**
     * Returns the root resource of the packaged Studio application.
     * 
     * @return the web app root
     */
    @Deprecated
    Resource getStudioWebAppRoot(); // This is studio itself

    /**
     * Get the common WaveMaker directory.
     * 
     * @throws IOException
     */
    @Deprecated
    Resource getCommonDir() throws IOException; // This is WM home /common

    /**
     * Determine if the resource specified is a directory.
     * 
     * @param resource the resource
     * @return <tt>true</tt> if the resource is a directory.
     */
    @Deprecated
    boolean isDirectory(Resource resource);

    /**
     * Returns the path of the given resource.
     * 
     * @param resource the resource
     * @return the path of the resource
     */
    @Deprecated
    String getPath(Resource resource);

    /**
     * Return a resource for the specified URI.
     * 
     * @param uri The URI of the resource
     * @return a resource for the given URI
     */
    @Deprecated
    Resource getResourceForURI(String uri);

    /**
     * Return a {@link OutputStream} that can be used to write data to the specified resource. The caller is responsible
     * for closing the {@link OutputStream}.
     * 
     * @param resource The resource
     * @return a {@link OutputStream} for the resource
     */
    @Deprecated
    OutputStream getOutputStream(Resource resource);

    /**
     * Ensure that the specified resource is prepared for writing. For example, a {@link StudioFileSystem} backed by a
     * physical disk might ensure that all parent directories have been created.
     * 
     * @param resource The resource to prepare
     */
    @Deprecated
    void prepareForWriting(Resource resource);

    /**
     * List the immediate children of the specified resource.
     * 
     * @param resource the resource
     * @return a list of resource children
     * @see #listChildren(Resource, ResourceFilter)
     */
    @Deprecated
    List<Resource> listChildren(Resource resource);

    /**
     * List the immediate children of the specified resource filtering as necessary.
     * 
     * @param resource the resource
     * @param filter a resource filter used to limit results
     * @return a list of resource children
     * @see #listChildren(Resource)
     */
    @Deprecated
    List<Resource> listChildren(Resource resource, ResourceFilter filter);

    /**
     * Search all files recursively and return the result. This method returns only files, not directories.
     * 
     * @param resource the resource
     * @param filter a resource filter used to limit results
     * @return a list of child files
     * @see #listChildren(Resource)
     */
    @Deprecated
    List<Resource> listAllChildren(Resource resource, ResourceFilter filter);

    /**
     * Create and return a resource for the specified path as applied to the given resource.
     * 
     * @param resource the resource
     * @param path the child path (relative to the resource)
     * @return A newly created path
     */
    @Deprecated
    Resource createPath(Resource resource, String path);

    /**
     * Copy the contents of the source input stream to a file at the given path (relative to the specified root
     * resource).
     * 
     * @param root the root of the path
     * @param source the source of the written data
     * @param filePath the path of the written file (relative to root)
     * @return The newly written resource.
     */
    @Deprecated
    Resource copyFile(Resource root, InputStream source, String filePath);

    /**
     * Recursively copy files and directories from the given root to a target location.
     * 
     * @param root the root to copy
     * @param target the target destination
     * @param exclusions a list of exclusions that should not be copied
     * @return the target resource
     */
    @Deprecated
    Resource copyRecursive(Resource root, Resource target, List<String> exclusions);

    /**
     * Recursively copy files and directories from the given root to a target location.
     * 
     * @param root the root to copy
     * @param target the target destination
     * @param includedPattern the ant-style path pattern to be included
     * @param excludedPattern the ant-style path pattern to be excluded
     * @return the target resource
     */
    @Deprecated
    Resource copyRecursive(Resource root, Resource target, String includedPattern, String excludedPattern);

    /**
     * Recursively copy files and directories from the given root in the conventional file system to a target location.
     * 
     * @param root the root to copy
     * @param target the target destination
     * @param exclusions a list of exclusions that should not be copied
     * @return the target resource
     */
    @Deprecated
    Resource copyRecursive(File root, Resource target, List<String> exclusions);

    /**
     * Rename the specified resource
     * 
     * @param oldResource the old resource
     * @param newResource the new resource
     */
    @Deprecated
    void rename(Resource oldResource, Resource newResource);

    /**
     * Delete the specified resource
     * 
     * @param resource the resource to delete
     * @return <tt>true</tt> if the resource was deleted
     */
    @Deprecated
    boolean deleteFile(Resource resource);

    /**
     * Create a new temporary directory
     * 
     * @return the temporary directory
     */
    @Deprecated
    Resource createTempDir();

    /**
     * Returns a string indicating the studio filesystem being used
     */
    @Deprecated
    String getStudioEnv();

    /**
     * Returns the parent resource or null if none
     * 
     * @param resource the current resource
     * @return the parent resource
     */
    @Deprecated
    Resource getParent(Resource resource);
}

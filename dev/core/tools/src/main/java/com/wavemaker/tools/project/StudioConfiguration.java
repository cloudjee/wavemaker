
package com.wavemaker.tools.project;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;

import com.wavemaker.runtime.RuntimeAccess;

public interface StudioConfiguration {

    /**
     * Return the projects directory ("projects", inside of the path returned by {@link #getWaveMakerHome()}. This can
     * be overridden with the system property PROJECTHOME_KEY.
     * 
     * @return
     * @throws IOException
     */
    public abstract Resource getProjectsDir();

    public abstract Resource getWaveMakerHome();

    public abstract Resource getDemoDir();

    /**
     * Get the common WM directory. This is always relative to the user's WaveMaker home.
     * 
     * @throws IOException
     */
    public abstract Resource getCommonDir() throws IOException;

    /**
     * Creates a resource relative to CommonDir. Use instead of getCommonDir.createRelative() IOException
     */
    public abstract Resource createCommonRelative(String relativePath) throws IOException;
    
    // other studio information
    public abstract Resource getStudioWebAppRoot();

    public abstract Resource createStudioWebAppRootReleative(String relativePath) throws IOException;
    /**
     * Get a map of all known preferences.
     */
    public abstract Map<String, String> getPreferencesMap();

    public abstract RuntimeAccess getRuntimeAccess();

    public abstract Resource createPath(Resource root, String path);

    public abstract Resource copyFile(Resource root, InputStream source, String filePath);

    public abstract Resource copyRecursive(Resource root, Resource target, List<String> exclusions);

    public abstract boolean deleteFile(Resource file);

    public abstract List<Resource> listChildren(Resource root);

    public abstract List<Resource> listChildren(Resource root, ResourceFilter filter);

    public abstract OutputStream getOutputStream(Resource file);

    public abstract Resource createTempDir();

    public abstract Resource getResourceForURI(String resourceURI);

    public abstract void prepareForWriting(Resource file);

    public abstract void rename(Resource oldResource, Resource newResource);

    public abstract void setPreferencesMap(Map<String, String> prefs);

    public abstract String getPath(Resource file);

}
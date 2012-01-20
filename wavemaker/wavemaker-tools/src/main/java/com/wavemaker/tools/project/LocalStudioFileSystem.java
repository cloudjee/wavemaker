
package com.wavemaker.tools.project;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.SystemUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;

import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.FileAccessException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.tools.config.ConfigurationStore;

/**
 * Implementation of {@link StudioFileSystem} backed by a local files system.
 * 
 * @author Ed Callahan
 * @author Jeremy Grelle
 * @author Joel Hare
 * @author Matt Small
 * @author Phillip Webb
 */
public class LocalStudioFileSystem extends AbstractStudioFileSystem {

    static final String WMHOME_KEY = "wavemakerHome";

    static final String WMHOME_PROP_KEY = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX + WMHOME_KEY;

    private static final String WAVEMAKER_HOME = "WaveMaker/";

    /**
     * WaveMaker demo directory override, used for testing. NEVER set this in production.
     */
    private File testDemoDir = null;

    /**
     * WaveMaker home override, used for testing. NEVER set this in production.
     */
    private File testWMHome = null;

    @Override
    public Resource getWaveMakerHome() {
        if (this.testWMHome != null) {
            return createResource(this.testWMHome.toString() + "/");
        }
        return staticGetWaveMakerHome();
    }

    public void setTestWaveMakerHome(File file) {
        this.testWMHome = file;
    }

    public static void setWaveMakerHome(Resource wmHome) throws FileAccessException {
        Assert.isInstanceOf(FileSystemResource.class, wmHome, "Expected a FileSystemResource");

        try {
            ConfigurationStore.setVersionedPreference(LocalStudioConfiguration.class, WMHOME_KEY, wmHome.getFile().getCanonicalPath());
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }

        if (!wmHome.exists()) {
            ((FileSystemResource) wmHome).getFile().mkdirs();
        }
    }

    @Override
    protected void makeDirectories(Resource projectsDir) throws FileAccessException, IOException {
        IOUtils.makeDirectories(projectsDir.getFile(), getWaveMakerHome().getFile());
    }

    @Override
    public Resource getDemoDir() {
        if (this.testDemoDir != null) {
            return createResource(this.testDemoDir.toString() + "/");
        }

        String location = ConfigurationStore.getPreference(getClass(), DEMOHOME_KEY, null);
        Resource demo;
        try {
            if (location != null) {
                demo = createResource(location);
            } else {
                demo = getStudioWebAppRoot().createRelative("../Samples");
            }
            return demo;
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public void setDemoDir(File file) {
        ConfigurationStore.setPreference(getClass(), DEMOHOME_KEY, file.getAbsolutePath());
    }

    public void setTestDemoDir(File file) {
        this.testDemoDir = file;
    }

    @Override
    public boolean isDirectory(Resource resource) {
        try {
            return resource.getFile().isDirectory();
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    @Override
    public String getPath(Resource resource) {
        try {
            String path = StringUtils.cleanPath(resource.getFile().getPath());
            if (resource.getFile().isDirectory() && !path.endsWith("/")) {
                path += "/";
            }
            return path;
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Override
    public OutputStream getOutputStream(Resource resource) {
        try {
            Assert.isTrue(!resource.getFile().isDirectory(), "Cannot get an output stream for an invalid file.");
            prepareForWriting(resource);
            return new FileOutputStream(resource.getFile());
        } catch (FileNotFoundException ex) {
            throw new WMRuntimeException(ex);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Override
    public void prepareForWriting(Resource resource) {
        try {
            if (resource.getFile().isDirectory()) {
                resource.getFile().mkdirs();
            } else {
                resource.getFile().getParentFile().mkdirs();
            }
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Override
    public List<Resource> listChildren(Resource resource, ResourceFilter filter) {
        List<Resource> children = new ArrayList<Resource>();
        File[] files;
        try {
            files = resource.getFile().listFiles();
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
        if (files == null) {
            return children;
        }
        for (File file : files) {
            Resource fileResource = createResource(file.getAbsolutePath() + "/");
            if (filter.accept(fileResource)) {
                children.add(fileResource);
            }
        }
        return children;

    }

    @Override
    public Resource createPath(Resource resource, String path) {
        Assert.isInstanceOf(FileSystemResource.class, resource, "Expected a FileSystemResource");
        try {
            if (!resource.exists()) {
                File rootFile = resource.getFile();
                while (rootFile.getAbsolutePath().length() > 1 && !rootFile.exists()) {
                    rootFile = rootFile.getParentFile();
                }
                IOUtils.makeDirectories(resource.getFile(), rootFile);
            }
            FileSystemResource relativeResource = (FileSystemResource) resource.createRelative(path);
            if (!relativeResource.exists()) {
                if (relativeResource.getPath().endsWith("/")) {
                    IOUtils.makeDirectories(relativeResource.getFile(), resource.getFile());
                } else {
                    IOUtils.makeDirectories(relativeResource.getFile().getParentFile(), resource.getFile());
                }
            }
            return relativeResource;
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Override
    public Resource copyFile(Resource root, InputStream source, String filePath) {
        Assert.isInstanceOf(FileSystemResource.class, root, "Expected a FileSystemResource");
        try {
            FileSystemResource targetFile = (FileSystemResource) root.createRelative(filePath);
            FileCopyUtils.copy(source, getOutputStream(targetFile));
            return targetFile;
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Override
    public Resource copyRecursive(Resource root, Resource target, List<String> exclusions) {
        try {
            IOUtils.copy(root.getFile(), target.getFile(), exclusions);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
        return target;
    }

    @Override
    public Resource copyRecursive(Resource root, Resource target, String includedPattern, String excludedPattern) {
        try {
            IOUtils.copy(root.getFile(), target.getFile(), includedPattern, excludedPattern);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
        return target;
    }

    @Override
    public Resource copyRecursive(File root, Resource target, List<String> exclusions) {
        throw new UnsupportedOperationException();
    }

    @Override
    public void rename(Resource oldResource, Resource newResource) {
        Assert.isInstanceOf(FileSystemResource.class, oldResource, "Expected a FileSystemResource");
        Assert.isInstanceOf(FileSystemResource.class, newResource, "Expected a FileSystemResource");
        try {
            oldResource.getFile().renameTo(newResource.getFile());
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }

    }

    @Override
    public boolean deleteFile(Resource resource) {
        Assert.isInstanceOf(FileSystemResource.class, resource, "Expected a FileSystemResource");
        FileSystemResource fileResource = (FileSystemResource) resource;
        if (fileResource.getFile().isDirectory()) {
            try {
                FileUtils.forceDelete(fileResource.getFile());
                return true;
            } catch (IOException ex) {
                throw new WMRuntimeException(ex);
            }
        } else {
            return fileResource.getFile().delete();
        }

    }

    @Override
    public Resource createTempDir() {
        try {
            return createResource(IOUtils.createTempDirectory("local", "_tmp").getAbsolutePath() + "/");
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }

    }

    @Override
    protected Resource createResource(String path) {
        return new FileSystemResource(path);
    }

    public static Resource staticGetWaveMakerHome() {

        Resource ret = null;

        String env = System.getProperty(WMHOME_PROP_KEY, null);
        if (env != null && 0 != env.length()) {
            ret = new FileSystemResource(env);
        }

        if (ret == null) {
            String pref = ConfigurationStore.getPreference(LocalStudioConfiguration.class, WMHOME_KEY, null);
            if (pref != null && 0 != pref.length()) {
                pref = pref.endsWith("/") ? pref : pref + "/";
                ret = new FileSystemResource(pref);
            }
        }

        // we couldn't find a test value, a property, or a preference, so use
        // a default
        if (ret == null) {
            ret = getDefaultWaveMakerHome();
        }

        if (!ret.exists()) {
            try {
                ret.getFile().mkdir();
            } catch (IOException ex) {
                throw new WMRuntimeException(ex);
            }
        }

        return ret;
    }

    protected static Resource getDefaultWaveMakerHome() {

        Resource userHome = null;
        if (SystemUtils.IS_OS_WINDOWS) {
            String userProfileEnvVar = System.getenv("USERPROFILE");
            if (StringUtils.hasText(userProfileEnvVar)) {
                userProfileEnvVar = userProfileEnvVar.endsWith("/") ? userProfileEnvVar : userProfileEnvVar + "/";
                userHome = new FileSystemResource(System.getenv("USERPROFILE"));
            }
        }
        if (userHome == null) {
            String userHomeProp = System.getProperty("user.home");
            userHomeProp = userHomeProp.endsWith("/") ? userHomeProp : userHomeProp + "/";
            userHome = new FileSystemResource(userHomeProp);
        }

        String osVersionStr = System.getProperty("os.version");
        if (osVersionStr.contains(".")) {
            String sub = osVersionStr.substring(osVersionStr.indexOf(".") + 1);
            if (sub.contains(".")) {
                osVersionStr = osVersionStr.substring(0, osVersionStr.indexOf('.', osVersionStr.indexOf('.') + 1));
            }
        }

        try {
            if (SystemUtils.IS_OS_WINDOWS) {
                userHome = new FileSystemResource(javax.swing.filechooser.FileSystemView.getFileSystemView().getDefaultDirectory());
            } else if (SystemUtils.IS_OS_MAC) {
                userHome = userHome.createRelative("Documents/");
            }

            if (!userHome.exists()) {
                throw new WMRuntimeException(MessageResource.PROJECT_USERHOMEDNE, userHome);
            }

            Resource wmHome = userHome.createRelative(WAVEMAKER_HOME);
            if (!wmHome.exists()) {
                wmHome.getFile().mkdir();
            }
            return wmHome;
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Override
    protected String getFSType() {
        return new String("local");
    }

    @Override
    public Resource getParent(Resource resource) {
        File f;
        try {
            f = resource.getFile().getParentFile();
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }

        return new FileSystemResource(f);
    }
}


package com.wavemaker.tools.project;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletContext;

import org.springframework.core.io.Resource;
import org.springframework.web.context.ServletContextAware;
import org.springframework.web.context.support.ServletContextResource;

import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.FileAccessException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.runtime.RuntimeAccess;

/**
 * Abstract base implementation of {@link StudioFileSystem}.
 * 
 * @see GridFSStudioFileSystem
 * @see LocalStudioFileSystem
 * 
 * @author Ed Callahan
 * @author Jeremy Grelle
 * @author Joel Hare
 * @author Matt Small
 * @author Phillip Webb
 */
public abstract class AbstractStudioFileSystem implements StudioFileSystem, ServletContextAware {

    private static final String PROJECTHOME_KEY = "projectsDir";

    public static final String PROJECTHOME_PROP_KEY = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX + PROJECTHOME_KEY;

    public static final String PROJECTS_DIR = "projects/";

    public static final String COMMON_DIR = "common/";

    public static final String DEMOHOME_KEY = "demoHome";

    private static boolean isCloud;

    private static boolean isCloudInitialized = false;

    private ServletContext servletContext;

    @Override
    public void setServletContext(ServletContext servletContext) {
        this.servletContext = servletContext;
    }

    @Override
    public Resource getStudioWebAppRoot() {
        return new ServletContextResource(this.servletContext, "/");
    }

    protected abstract Resource createResource(String path);

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
            return createResource(projectsProp);
        }
        try {
            Resource projectsDir = getWaveMakerHome().createRelative(PROJECTS_DIR);
            if (!projectsDir.exists()) {
                makeDirectories(projectsDir);
            }
            return projectsDir;
        } catch (IOException ex) {
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

    protected abstract void makeDirectories(Resource projectsDir) throws FileAccessException, IOException;

    @Override
    public Resource getCommonDir() throws IOException {
        Resource common = getWaveMakerHome().createRelative(COMMON_DIR);
        if (!common.exists() && getWaveMakerHome().exists()) {
            createCommonDir(common);
        }
        return common;
    }

    private synchronized void createCommonDir(Resource common) throws IOException {
        if (!common.exists()) {
            Resource templateFile = getStudioWebAppRoot().createRelative("lib/wm/" + COMMON_DIR);
            if (templateFile.exists()) {
                copyRecursive(templateFile, common, IOUtils.DEFAULT_EXCLUSION);
            }
        }
    }

    @Override
    public Resource getResourceForURI(String uri) {
        return createResource(uri);
    }

    @Override
    public List<Resource> listChildren(Resource resource) {
        return listChildren(resource, ResourceFilter.NO_FILTER);
    }

    /**
     *  Tests for previous cloud edition, NOT cloud foundry
     */
    @Deprecated
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

    protected abstract String getFSType();
    
    @Override
    public String getStudioEnv(){
    	return getFSType();  	
    }
}

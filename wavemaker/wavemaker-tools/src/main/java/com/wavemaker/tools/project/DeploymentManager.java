
package com.wavemaker.tools.project;

import java.io.IOException;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import com.wavemaker.runtime.server.FileUploadResponse;
import com.wavemaker.tools.deployment.DeploymentInfo;

public interface DeploymentManager {

    public abstract String testRunStart();

    /**
     * Compile java src.
     */
    public abstract String compile();

    /**
     * Clean, then compile java src.
     */
    public abstract String cleanCompile();

    /**
     * Build the application (run the build target).
     */
    public abstract String build();

    /**
     * Only generate the runtime files
     */
    public abstract String generateRuntime();

    /**
     * Clean, then build the application (run the build target).
     */
    public abstract String cleanBuild();

    public abstract String buildWar(Resource warFile, boolean includeEar) throws IOException;

    public abstract void buildWar(String warFileLocation, boolean includeEar) throws IOException;

    public abstract String deployWar(String warFileName, String deployName);

    public abstract String testRunClean();

    /**
     * Clean build artifacts
     * 
     * @param projectDir The name of the project.
     * @param deployName The deployment target.
     */
    public abstract String testRunClean(String projectDir, String deployName);

    public abstract String undeploy();

    public abstract void exportProject(String zipFileName);

    public abstract String getExportPath();

    public abstract String exportProject();

    /**
     * This function takes a zip file as input, unzips it and moves it into the project folder
     */
    public abstract FileUploadResponse importFromZip(MultipartFile file) throws IOException;

    public abstract void deployClientComponent(String name, String namespace, String data) throws IOException;

    public abstract void deployTheme(String themename, String filename, String data) throws IOException;

    public abstract boolean undeployTheme(String themename) throws IOException;

    public abstract String[] listThemes() throws IOException;

    public abstract void copyTheme(String oldName, String newName) throws IOException;

    public abstract void deleteTheme(String name) throws IOException;

    public abstract String[] listThemeImages(String themename) throws IOException;

    public abstract boolean undeployClientComponent(String name, String namespace, boolean removeSource) throws IOException;

    public abstract void deleteDeploymentInfo(String deploymentId);

    public abstract String saveDeploymentInfo(DeploymentInfo deploymentInfo);

    public abstract List<DeploymentInfo> getDeploymentInfo();
}


package com.wavemaker.tools.project;

import java.io.IOException;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.util.StringUtils;

import com.wavemaker.tools.deployment.DeploymentInfo;
import com.wavemaker.tools.deployment.DeploymentTarget;
import com.wavemaker.tools.deployment.DeploymentTargetManager;
import com.wavemaker.tools.deployment.DeploymentType;

public class CFDeploymentManager extends AbstractDeploymentManager {

    private DeploymentTargetManager deploymentTargetManager;

    @Override
    public String testRunStart() {
        compile();
        DeploymentTarget target = this.deploymentTargetManager.getDeploymentTarget(DeploymentType.CLOUD_FOUNDRY);
        DeploymentInfo deployment = findCloudFoundryDeploymentInfo(target);
        // FIXME PW HACK if (deployment != null) {
        target.deploy(this.projectManager.getCurrentProject(), deployment);
        // }
        return null;
    }

    private DeploymentInfo findCloudFoundryDeploymentInfo(DeploymentTarget target) {
        List<DeploymentInfo> deployments = this.getDeploymentInfo();
        return findCloudFoundryDeploymentInfo(target, deployments);
    }

    private DeploymentInfo findCloudFoundryDeploymentInfo(DeploymentTarget target, List<DeploymentInfo> deployments) {
        for (DeploymentInfo deployment : deployments) {
            if (deployment.getDeploymentType() == DeploymentType.CLOUD_FOUNDRY) {
                if (target.validateDeployment(deployment).equals("SUCCESS")) {
                    return deployment;
                }
            }
        }
        return null;
    }

    @Override
    public String compile() {
        return this.projectCompiler.compile(this.projectManager.getCurrentProject().getProjectName());
    }

    @Override
    public String cleanCompile() {
        clean();
        return compile();
    }

    private void clean() {
        Project project = this.projectManager.getCurrentProject();
        List<Resource> classFiles = getFileSystem().listChildren(project.getWebInfClasses(), new ResourceFilter() {

            @Override
            public boolean accept(Resource resource) {
                return "class".equals(StringUtils.getFilenameExtension(resource.getFilename()));
            }
        });
        for (Resource classFile : classFiles) {
            getFileSystem().deleteFile(classFile);
        }
    }

    @Override
    public String build() {
        return compile();
    }

    @Override
    public String generateRuntime() {
        throw new UnsupportedOperationException("Haven't implemented this yet.");
    }

    @Override
    public String cleanBuild() {
        return cleanCompile();
    }

    @Override
    public String buildWar(Resource warFile, boolean includeEar) throws IOException {
        throw new UnsupportedOperationException("Haven't implemented this yet.");
    }

    @Override
    public void buildWar(String warFileLocation, boolean includeEar) throws IOException {
        throw new UnsupportedOperationException("Haven't implemented this yet.");
    }

    @Override
    public String deployWar(String warFileName, String deployName) {
        throw new UnsupportedOperationException("Haven't implemented this yet.");
    }

    @Override
    public String testRunClean() {
        return undeploy();
    }

    @Override
    public String testRunClean(String projectDir, String deployName) {
        DeploymentTarget target = this.deploymentTargetManager.getDeploymentTarget(DeploymentType.CLOUD_FOUNDRY);
        Project project = this.projectManager.getProject(projectDir, true);
        return target.undeploy(findCloudFoundryDeploymentInfo(target, readDeployments().forProject(project.getProjectName())), false);
    }

    @Override
    public String undeploy() {
        DeploymentTarget target = this.deploymentTargetManager.getDeploymentTarget(DeploymentType.CLOUD_FOUNDRY);
        Project project = this.projectManager.getCurrentProject();
        return target.undeploy(findCloudFoundryDeploymentInfo(target, readDeployments().forProject(project.getProjectName())), false);
    }

    @Override
    public String exportProject(String zipFileName) {
        throw new UnsupportedOperationException("Haven't implemented this yet.");
    }

    public void setDeploymentTargetManager(DeploymentTargetManager deploymentTargetManager) {
        this.deploymentTargetManager = deploymentTargetManager;
    }
}

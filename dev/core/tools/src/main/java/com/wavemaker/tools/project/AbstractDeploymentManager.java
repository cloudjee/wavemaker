
package com.wavemaker.tools.project;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.springframework.core.io.Resource;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSON;
import com.wavemaker.json.JSONMarshaller;
import com.wavemaker.json.JSONObject;
import com.wavemaker.json.JSONState;
import com.wavemaker.json.JSONUnmarshaller;
import com.wavemaker.runtime.server.FileUploadResponse;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.runtime.server.json.JSONUtils;
import com.wavemaker.tools.compiler.ProjectCompiler;
import com.wavemaker.tools.deployment.DeploymentInfo;
import com.wavemaker.tools.deployment.Deployments;

public abstract class AbstractDeploymentManager implements DeploymentManager {

    public static final String EXPORT_DIR_DEFAULT = "export/";

    public static final String PACKAGES_DIR = "packages/";

    public static final String THEMES_DIR = "themes/";

    public static final String LIB_JS_FILE = "lib.js";

    public static final String COMMON_MODULE_PREFIX = "common.packages.";

    private static final String DEPLOYMENTS_FILE = "/deployments.js";

    private static boolean isCloud;

    private static boolean isCloudInitialized = false;

    public static boolean isCloud() {
        if (!isCloudInitialized) {
            try {
                // can a user create cloud.src.resource java service class and
                // pass our isCloud test and modify our project folder settings?
                // Answer: even if they can, they can't remove our existing
                // com.wavemaker.cloud; all they could accomplish is to
                // block the ability to SET those settings on their local
                // computer.
                org.springframework.core.io.ClassPathResource cpr = new org.springframework.core.io.ClassPathResource("cloud.src.resource");
                isCloud = cpr.exists();
                isCloudInitialized = true;
            } catch (Exception e) {
                return false;
            }
        }

        return isCloud;
    }

    protected StudioConfiguration studioConfiguration;

    protected ProjectManager projectManager;

    protected ProjectCompiler projectCompiler;

    /**
     * {@inheritDoc}
     */
    @Override
    public String getExportPath() {
        try {
            Resource exportDir;
            if (this.projectManager.getUserProjectPrefix().length() > 0) {
                exportDir = this.projectManager.getTmpDir();
            } else {
                exportDir = getProjectDir().createRelative(EXPORT_DIR_DEFAULT);
            }
            return exportDir.createRelative(getDeployName() + ".zip").getURI().toString();
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public StudioConfiguration getStudioConfiguration() {
        return this.studioConfiguration;
    }

    public void setStudioConfiguration(StudioConfiguration studioConfiguration) {
        this.studioConfiguration = studioConfiguration;
    }

    public void setProjectManager(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }

    public ProjectManager getProjectManager() {
        return this.projectManager;
    }

    public void setProjectCompiler(ProjectCompiler projectCompiler) {
        this.projectCompiler = projectCompiler;
    }

    protected Resource getProjectDir() {
        Project currentProject = this.projectManager.getCurrentProject();
        if (null == currentProject) {
            throw new WMRuntimeException("Current project must be set");
        }
        return currentProject.getProjectRoot();
    }

    protected String getDeployName() {
        return getDeployName(getProjectDir());
    }

    protected String getDeployName(Resource projectDir) {
        String projectName = projectDir.getFilename();
        if (this.projectManager.getUserProjectPrefix().length() > 0) {
            projectName = projectName.replace(this.projectManager.getUserProjectPrefix(), "");
        }
        return projectName;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public FileUploadResponse importFromZip(MultipartFile file) throws IOException {
        FileUploadResponse response = new FileUploadResponse();
        Resource tmpDir = this.projectManager.getTmpDir();

        // Write the zip file to outputFile
        String originalName = file.getOriginalFilename();

        int upgradeIndex = originalName.indexOf("-upgrade-");
        if (upgradeIndex > 0) {
            originalName = originalName.substring(0, upgradeIndex) + ".zip";
        }

        Resource outputFile = tmpDir.createRelative(originalName);

        OutputStream fos = this.studioConfiguration.getOutputStream(outputFile);
        FileCopyUtils.copy(file.getInputStream(), fos);

        Resource finalProjectFolder;
        try {

            // returns null if fails to unzip; need a handler for this...
            Resource projectFolder = com.wavemaker.tools.project.ResourceManager.unzipFile(this.studioConfiguration, outputFile);

            // If there is only one folder in what we think is the
            // projectFolder, open that one folder because that must be the real
            // project folder
            // Filter out private folders generated by OS or svn, etc...
            // (__MACOS, .svn, etc...)
            List<Resource> listings = this.studioConfiguration.listChildren(projectFolder);
            if (listings.size() == 1) {
                Resource listing = listings.get(0);
                if (StringUtils.getFilenameExtension(listing.getFilename()) == null && !listing.getFilename().startsWith(".")
                    && !listing.getFilename().startsWith("_")) {
                    projectFolder = listing;
                }
            }

            // Verify that this looks like a project folder we unzipped
            com.wavemaker.tools.project.Project project = new com.wavemaker.tools.project.Project(projectFolder, this.studioConfiguration);
            Resource testExistenceFile = project.getWebAppRoot().createRelative("pages/");
            if (!testExistenceFile.exists()) {
                throw new WMRuntimeException("That didn't look like a project folder; if it was, files were missing");
            }

            Resource indexhtml = project.getWebAppRoot().createRelative("index.html");
            String indexstring = project.readFile(indexhtml);
            int endIndex = indexstring.lastIndexOf("({domNode: \"wavemakerNode\"");
            int startIndex = indexstring.lastIndexOf(" ", endIndex);
            String newProjectName = indexstring.substring(startIndex + 1, endIndex);

            // Get a File to point to where we're going to place this imported
            // project
            finalProjectFolder = this.projectManager.getBaseProjectDir().createRelative(
                this.projectManager.getUserProjectPrefix() + newProjectName + "/");
            String finalname = finalProjectFolder.getFilename();
            String originalFinalname = finalname;
            // If there is already a project at that location, rename the
            // project
            int i = -1;
            do {
                i++;
                finalProjectFolder = this.projectManager.getBaseProjectDir().createRelative(finalname + (i > 0 ? "" + i : "") + "/");
            } while (finalProjectFolder.exists());
            finalname = finalProjectFolder.getFilename();

            // OK, now finalname has the name of the new project,
            // finalProjectFolder has the full path to the new project

            // Move the project into the project folder
            this.studioConfiguration.rename(projectFolder, finalProjectFolder);

            // If we renamed the project (i.e. if i got incremented) then we
            // need to make some corrections
            if (i > 0) {

                // Correction 1: Rename the js file
                com.wavemaker.tools.project.Project finalProject = new com.wavemaker.tools.project.Project(finalProjectFolder,
                    this.studioConfiguration);
                Resource jsFile = finalProject.getWebAppRoot().createRelative(originalFinalname + ".js");
                Resource newJsFile = finalProject.getWebAppRoot().createRelative(finalname + ".js");
                this.studioConfiguration.rename(jsFile, newJsFile);

                // Correction 2: Change the class name in the js file
                com.wavemaker.tools.project.ResourceManager.ReplaceTextInProjectFile(finalProject, newJsFile, originalFinalname, finalname);

                // Corection3: Change the constructor in index.html
                Resource index_html = finalProject.getWebAppRoot().createRelative("index.html");
                com.wavemaker.tools.project.ResourceManager.ReplaceTextInProjectFile(finalProject, index_html, "new " + originalFinalname
                    + "\\(\\{domNode", "new " + finalname + "({domNode");

                // Correction 4: Change the pointer to the js script read in by
                // index.html
                com.wavemaker.tools.project.ResourceManager.ReplaceTextInProjectFile(finalProject, index_html, "\\\"" + originalFinalname
                    + "\\.js\\\"", '"' + finalname + ".js\"");

                // Correction 5: Change the title
                com.wavemaker.tools.project.ResourceManager.ReplaceTextInProjectFile(finalProject, index_html, "\\<title\\>" + originalFinalname
                    + "\\<\\/title\\>", "<title>" + finalname + "</title>");

            }
        } finally {
            // If the user uploaded a zipfile that had many high level folders,
            // they could make a real mess of things,
            // so just purge the tmp folder after we're done
            this.studioConfiguration.deleteFile(tmpDir);
        }

        response.setPath(finalProjectFolder.getFilename().substring(this.projectManager.getUserProjectPrefix().length()));
        response.setError("");
        response.setWidth("");
        response.setHeight("");
        return response;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void deployClientComponent(String name, String namespace, String data) throws IOException {

        if (isCloud()) {
            return;
        }
        Resource packagesDir = this.studioConfiguration.createPath(this.studioConfiguration.getCommonDir(), PACKAGES_DIR);

        Resource moduleDir = packagesDir;
        if (namespace != null && namespace.length() > 0) {

            String[] folderList = namespace.split("\\.");
            for (String folder : folderList) {
                moduleDir = this.studioConfiguration.createPath(moduleDir, folder + "/");
            }
        }

        data = modifyJS(data);

        Resource jsFile = moduleDir.createRelative(name + ".js");
        FileCopyUtils.copy(data, new OutputStreamWriter(this.studioConfiguration.getOutputStream(jsFile), ServerConstants.DEFAULT_ENCODING));

        String klass = null;
        if (namespace != null && namespace.length() > 0) {
            klass = namespace + "." + name;
        } else {
            klass = name;
        }
        String moduleString = "\"" + COMMON_MODULE_PREFIX + klass + "\"";
        boolean found = false;
        Resource libJsFile = packagesDir.createRelative(LIB_JS_FILE);
        StringBuffer libJsData = new StringBuffer();
        if (libJsFile.exists()) {
            String libJsOriginal = FileCopyUtils.copyToString(new InputStreamReader(libJsFile.getInputStream(), ServerConstants.DEFAULT_ENCODING));
            if (libJsOriginal.indexOf(moduleString) > -1) {
                found = true;
            }
            libJsData.append(libJsOriginal);
        }
        if (!found) {
            libJsData.append("dojo.require(");
            libJsData.append(moduleString);
            libJsData.append(");\n");
        }
        FileCopyUtils.copy(libJsData.toString(), new OutputStreamWriter(this.studioConfiguration.getOutputStream(libJsFile),
            ServerConstants.DEFAULT_ENCODING));
    }

    private String modifyJS(String val) {
        boolean foundDojo = false;
        boolean foundWidget = false;
        int startIndx = 0;
        int dojoIndx = -1;
        int compositeIndx = -1;
        int dojoEndIndx = -1;
        int widgetIndx = -1;
        int widgetEndIndx = -1;

        while (!foundDojo) {
            dojoIndx = val.indexOf("dojo.declare", startIndx);
            if (dojoIndx > startIndx) {
                startIndx = dojoIndx + 12;
                compositeIndx = val.indexOf("wm.Composite", startIndx);
                if (compositeIndx >= startIndx) {
                    startIndx = compositeIndx + 12;
                    dojoEndIndx = val.indexOf("});", startIndx);
                    if (dojoEndIndx >= compositeIndx) {
                        foundDojo = true;
                        break;
                    }
                }
            } else {
                break;
            }
        }

        if (!foundDojo) {
            return val;
        }

        startIndx = dojoEndIndx;

        while (!foundWidget) {
            widgetIndx = val.indexOf(".components", startIndx);
            if (widgetIndx > startIndx) {
                startIndx = widgetIndx + 11;
                widgetEndIndx = val.indexOf("wm.publish", startIndx);
                if (widgetEndIndx == -1) {
                    widgetEndIndx = val.indexOf("wm.registerPackage", startIndx);
                }
                if (widgetEndIndx > widgetIndx) {
                    foundWidget = true;
                    break;
                }
            } else {
                break;
            }
        }

        if (!foundWidget) {
            return val;
        }

        boolean done = false;
        startIndx = dojoIndx;
        int indx1;
        String rtn = val.substring(0, dojoIndx);
        while (!done) {
            indx1 = val.indexOf("this.", startIndx);
            if (indx1 > 0) {
                rtn += val.substring(startIndx, indx1);
                if (!validJavaVarPart(val.substring(indx1 - 1, indx1))) {
                    int len = elemLen(val, indx1 + 5, widgetIndx, widgetEndIndx);
                    if (len > 0) {
                        rtn += "this.components.";
                    } else {
                        rtn += "this.";
                    }
                } else {
                    rtn += "this.";
                }
                startIndx = indx1 + 5;
            } else {
                rtn += val.substring(startIndx);
                break;
            }
        }

        return rtn;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void deployTheme(String themename, String filename, String data) throws IOException {

        if (isCloud()) {
            return;
        }

        Resource themesDir = this.studioConfiguration.createPath(this.studioConfiguration.getCommonDir(), THEMES_DIR);

        Resource moduleDir = themesDir;
        if (themename != null && themename.length() > 0) {
            String[] folderList = themename.split("\\.");
            for (String folder : folderList) {
                moduleDir = this.studioConfiguration.createPath(moduleDir, folder + "/");
            }
        }
        Resource outputFile = moduleDir.createRelative(filename);
        FileCopyUtils.copy(data, new OutputStreamWriter(this.studioConfiguration.getOutputStream(outputFile), ServerConstants.DEFAULT_ENCODING));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean undeployTheme(String themename) throws IOException {

        if (isCloud()) {
            return false;
        }

        Resource packagesDir = this.studioConfiguration.getCommonDir().createRelative(THEMES_DIR + themename + "/");
        if (!packagesDir.exists()) {
            return false;
        }
        return this.studioConfiguration.deleteFile(packagesDir);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String[] listThemes() throws IOException {

        Resource themesDir = this.studioConfiguration.getCommonDir().createRelative(THEMES_DIR);

        List<Resource> themesDirFiles = this.studioConfiguration.listChildren(themesDir);

        Resource themesFolder = this.studioConfiguration.getStudioWebAppRoot().createRelative("lib/wm/base/widget/themes/");

        List<Resource> widgetThemeFiles = this.studioConfiguration.listChildren(themesFolder, new ResourceFilter() {

            @Override
            public boolean accept(Resource resource) {
                return resource.getFilename().indexOf("wm_") == 0;
            }
        });

        themesDirFiles.addAll(widgetThemeFiles);

        List<String> themeNames = new ArrayList<String>();
        for (Resource theme : themesDirFiles) {
            themeNames.add(theme.getFilename());
        }

        return themeNames.toArray(new String[themeNames.size()]);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @SuppressWarnings("unchecked")
    public void copyTheme(String oldName, String newName) throws IOException {
        Resource oldFile;
        if (oldName.indexOf("wm_") == 0) {
            oldFile = this.studioConfiguration.getStudioWebAppRoot().createRelative("lib/wm/base/widget/themes/" + oldName + "/");
        } else {
            oldFile = this.studioConfiguration.getCommonDir().createRelative(THEMES_DIR + oldName + "/");
        }
        Resource newFile = this.studioConfiguration.getCommonDir().createRelative(THEMES_DIR + newName);
        this.studioConfiguration.copyRecursive(oldFile, newFile, Collections.EMPTY_LIST);

        Resource cssFile = newFile.createRelative("theme.css");
        com.wavemaker.tools.project.ResourceManager.ReplaceTextInFile(this.studioConfiguration.getOutputStream(cssFile), cssFile, "\\." + oldName,
            "." + newName);

    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void deleteTheme(String name) throws IOException {
        this.studioConfiguration.deleteFile(this.studioConfiguration.getCommonDir().createRelative(THEMES_DIR + name + "/"));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String[] listThemeImages(String themename) throws IOException {
        Resource themesDir;
        if (themename.indexOf("wm_") == 0) {
            themesDir = this.studioConfiguration.getStudioWebAppRoot().createRelative("lib/wm/base/widget/themes/" + themename + "/images/");
        } else {
            themesDir = this.studioConfiguration.getCommonDir().createRelative(THEMES_DIR + themename + "/images/");
        }

        String files0[] = getImageFiles(themesDir, null, "repeat,top left,");
        String files1[] = getImageFiles(themesDir, "repeat", "repeat,top left,");
        String files2[] = getImageFiles(themesDir, "repeatx", "repeat-x,top left,");
        String files3[] = getImageFiles(themesDir, "repeaty", "repeat-y,top left,");
        String files4[] = getImageFiles(themesDir, "repeatx_bottom", "repeat-x,bottom left,");
        String files5[] = getImageFiles(themesDir, "repeaty_right", "repeat-y,top right,");

        String[] s = new String[files0.length + files1.length + files2.length + files3.length + files4.length + files5.length];
        int i;
        int index = 0;
        for (i = 0; i < files0.length; i++) {
            s[index++] = files0[i];
        }

        for (i = 0; i < files1.length; i++) {
            s[index++] = files1[i];
        }

        for (i = 0; i < files2.length; i++) {
            s[index++] = files2[i];
        }

        for (i = 0; i < files3.length; i++) {
            s[index++] = files3[i];
        }

        for (i = 0; i < files4.length; i++) {
            s[index++] = files4[i];
        }

        for (i = 0; i < files5.length; i++) {
            s[index++] = files5[i];
        }

        return s;
    }

    private String[] getImageFiles(Resource themeDir, String folderName, String prepend) {
        Resource folder;
        try {
            folder = folderName == null ? themeDir : themeDir.createRelative(folderName + "/");
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
        List<Resource> files = this.studioConfiguration.listChildren(folder, new ResourceFilter() {

            @Override
            public boolean accept(Resource file) {
                String name = file.getFilename().toLowerCase();
                return name.endsWith(".gif") || name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg");
            }
        });

        if (files.size() > 0) {
            String[] imageFiles = new String[files.size()];
            for (int i = 0; i < files.size(); i++) {
                imageFiles[i] = prepend + "url(images/" + (folderName == null ? "" : folderName + "/") + files.get(i).getFilename() + ")";
            }
            return imageFiles;
        } else {
            return new String[0];
        }
    }

    private boolean validJavaVarPart(String val) {
        int v = val.charAt(0);

        if (v >= 48 && v <= 57 || v >= 64 && v <= 90 || v >= 97 && v <= 122 || v == 95) {
            return true;
        } else {
            return false;
        }
    }

    private int elemLen(String val, int indx, int windx, int windx1) {
        int i;
        for (i = 0; i < windx; i++) {
            if (!validJavaVarPart(val.substring(indx + i, indx + i + 1))) {
                break;
            }
        }

        String item = val.substring(indx, indx + i);
        int j = val.substring(windx, windx1).indexOf(item);
        if (j < 0) {
            return -1;
        }

        int k = val.substring(windx + j + item.length(), windx1).indexOf(":");
        if (k < 0) {
            return -1;
        }

        String s = val.substring(windx + j + item.length(), windx + j + item.length() + k);
        if (s.trim().length() > 0) {
            return -1;
        }

        return i;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @SuppressWarnings("unchecked")
    public boolean undeployClientComponent(String name, String namespace, boolean removeSource) throws IOException {

        if (isCloud()) {
            return false;
        }

        Resource packagesDir = this.studioConfiguration.getCommonDir().createRelative(PACKAGES_DIR);
        if (!packagesDir.exists()) {
            return false;
        }

        if (removeSource) {
            Resource moduleDir = packagesDir;
            List<Resource> rmDirs = new ArrayList<Resource>();
            if (namespace != null && namespace.length() > 0) {
                String[] folderList = namespace.split("\\.");
                for (String folder : folderList) {
                    moduleDir = moduleDir.createRelative(folder + "/");
                    rmDirs.add(moduleDir);
                }
            }
            Resource sourceJsFile = moduleDir.createRelative(name + ".js");
            if (sourceJsFile.exists()) {
                this.studioConfiguration.deleteFile(sourceJsFile);
                for (int i = rmDirs.size() - 1; i > -1; i--) {
                    Resource rmDir = rmDirs.get(i);
                    if (this.studioConfiguration.listChildren(rmDir).size() == 0) {
                        this.studioConfiguration.deleteFile(rmDir);
                    } else {
                        break;
                    }
                }
            }
        }

        Resource libJsFile = packagesDir.createRelative(LIB_JS_FILE);
        StringBuffer libJsData = new StringBuffer();
        if (libJsFile.exists()) {
            boolean found = false;
            String klass = null;
            if (namespace != null && namespace.length() > 0) {
                klass = namespace + "." + name;
            } else {
                klass = name;
            }
            List<String> libJsStringList = FileUtils.readLines(libJsFile.getFile(), ServerConstants.DEFAULT_ENCODING);
            for (int i = 0; i < libJsStringList.size(); i++) {
                String s = libJsStringList.get(i);
                if (s.indexOf("\"" + COMMON_MODULE_PREFIX + klass + "\"") > -1) {
                    found = true;
                } else {
                    libJsData.append(s);
                    libJsData.append("\n");
                }
            }
            FileCopyUtils.copy(libJsData.toString(), new OutputStreamWriter(this.studioConfiguration.getOutputStream(libJsFile),
                ServerConstants.DEFAULT_ENCODING));
            return found;
        }
        return false;
    }

    @Override
    public List<DeploymentInfo> getDeploymentInfo() {
        Deployments deployments = readDeployments();
        return deployments.forProject(this.projectManager.getCurrentProject().getProjectName());
    }

    /**
     * @param deploymentInfo
     * @return
     */
    @Override
    public String saveDeploymentInfo(DeploymentInfo deploymentInfo) {
        Resource deploymentsResource;
        Writer writer = null;
        try {
            Deployments deployments = readDeployments();
            deployments.save(this.projectManager.getCurrentProject().getProjectName(), deploymentInfo);

            deploymentsResource = this.studioConfiguration.getCommonDir().createRelative(DEPLOYMENTS_FILE);
            writer = new OutputStreamWriter(this.studioConfiguration.getOutputStream(deploymentsResource));
            JSONMarshaller.marshal(writer, deployments, new JSONState(), false, true);
            writer.flush();
        } catch (IOException e) {
            throw new WMRuntimeException("An error occurred while trying to save deployment.", e);
        } finally {
            if (writer != null) {
                try {
                    writer.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return deploymentInfo.getDeploymentId();
    }

    /**
     * @param deploymentInfo
     * @return
     */
    @Override
    public void deleteDeploymentInfo(String deploymentId) {
        Resource deploymentsResource;
        Writer writer = null;
        try {
            Deployments deployments = readDeployments();
            deployments.remove(this.projectManager.getCurrentProject().getProjectName(), deploymentId);
            deploymentsResource = this.studioConfiguration.getCommonDir().createRelative(DEPLOYMENTS_FILE);
            writer = new OutputStreamWriter(this.studioConfiguration.getOutputStream(deploymentsResource));
            JSONMarshaller.marshal(writer, deployments, new JSONState(), false, true);
            writer.flush();
        } catch (IOException e) {
            throw new WMRuntimeException("An error occurred while trying to save deployment.", e);
        } finally {
            if (writer != null) {
                try {
                    writer.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    protected Deployments readDeployments() {
        Resource deploymentsResource;
        try {
            deploymentsResource = this.studioConfiguration.getCommonDir().createRelative(DEPLOYMENTS_FILE);
            if (!deploymentsResource.exists()) {
                this.projectManager.getCurrentProject().writeFile(deploymentsResource, "{}");
                return new Deployments();
            } else {
                String s = FileCopyUtils.copyToString(new InputStreamReader(deploymentsResource.getInputStream()));
                if (s.length() > 0) {
                    JSON result = JSONUnmarshaller.unmarshal(s);
                    Assert.isTrue(result instanceof JSONObject, deploymentsResource.getDescription() + " is in an unexpected format.");
                    return (Deployments) JSONUtils.toBean((JSONObject) result, Deployments.class);
                } else {
                    return new Deployments();
                }
            }
        } catch (IOException e) {
            throw new WMRuntimeException("Failed to read stored deployments configuration.");
        }
    }

}

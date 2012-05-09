/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.studio.phonegap;

import org.springframework.util.Assert;

import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.runtime.server.Downloadable;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.Including;
import com.wavemaker.tools.io.Including.ResourceAttributeFilter;
import com.wavemaker.tools.io.Resources;
import com.wavemaker.tools.project.DownloadableFolder;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioFileSystem;

/**
 * Service for Phone Gap operations.
 * 
 * @author Michael Kantor
 */
@HideFromClient
public class PhoneGapService {

    private static enum FolderLayout {
        XCODE, ECLIPSE, PHONEGAP_BUILD_SERVICE
    }

    private ProjectManager projectManager;

    private StudioFileSystem fileSystem;

    /**
     * Returns the default host to use when {@link #generateBuild(String, int, String) generating} phone gap builds.
     * 
     * @return the default host
     */
    @ExposeToClient
    public String getDefaultHost() {
        return SystemUtils.getIP();
    }

    /**
     * Generate a PhoneGap folder structure compatible with the PhoneGap build service.
     * 
     * @param serverName the name of the server
     * @param portNumb the port number of the service
     * @param themeName the theme name
     */
    @ExposeToClient
    public void generateBuild(String serverName, int portNumb, String themeName) {
        Project currentProject = this.projectManager.getCurrentProject();
        currentProject.getRootFolder().getFolder("phonegap").createIfMissing();
        getPhoneGapFolder(FolderLayout.PHONEGAP_BUILD_SERVICE).createIfMissing();
        setupPhonegapFiles(FolderLayout.PHONEGAP_BUILD_SERVICE);
        updatePhonegapFiles(serverName, portNumb, FolderLayout.PHONEGAP_BUILD_SERVICE, themeName);
    }

    /**
     * Download a previously {@link #generateBuild(String, int, String) generated} PhoneGap build folder.
     * 
     * @return {@link Downloadable} zip file
     */
    @ExposeToClient
    public Downloadable downloadBuild() {
        Folder phoneGapFolder = getPhoneGapFolder(FolderLayout.PHONEGAP_BUILD_SERVICE);
        return new DownloadableFolder(phoneGapFolder, this.projectManager.getCurrentProject().getProjectName());
    }

    /**
     * Setup the an initial phone gap project structure.
     */
    @ExposeToClient
    public void setupPhonegapFiles() {
        for (FolderLayout layout : FolderLayout.values()) {
            if (layout != FolderLayout.PHONEGAP_BUILD_SERVICE) {
                setupPhonegapFiles(layout);
            }
        }
        fixupXCodeFilesFollowingSetup();
    }

    /**
     * Update an existing phone gap project structure.
     */
    @ExposeToClient
    public void updatePhonegapFiles(int portNumb, String themeName) {
        String serverUrl = SystemUtils.getIP();
        for (FolderLayout layout : FolderLayout.values()) {
            if (layout != FolderLayout.PHONEGAP_BUILD_SERVICE) {
                updatePhonegapFiles(serverUrl, portNumb, layout, themeName);
            }
        }
        fixupXCodeFilesFollowingUpdate();
    }

    private void setupPhonegapFiles(FolderLayout layout) {
        Folder phoneGapWebFolder = getPhoneGapFolder(layout);
        if (!phoneGapWebFolder.exists()) {
            return;
        }
        Folder phoneGapLibFolder = phoneGapWebFolder.getFolder("lib");
        if (phoneGapLibFolder.exists()) {
            return;
        }
        setupPhonegapProjectFiles(phoneGapWebFolder, phoneGapLibFolder);
        purgeUnnecessarySetupFiles(phoneGapLibFolder);
    }

    private void setupPhonegapProjectFiles(final Folder phoneGapWebFolder, Folder phoneGapLibFolder) {
        this.fileSystem.getStudioWebAppRootFolder().getFolder("lib").copyContentsTo(phoneGapLibFolder);
        this.projectManager.getCurrentProject().getRootFolder().getFolder("webapproot/pages").copyContentsTo(phoneGapWebFolder.getFolder("pages"));
        this.fileSystem.getCommonFolder().copyContentsTo(phoneGapWebFolder.getFolder("common"));
        Folder sourceFolder = this.projectManager.getCurrentProject().getWebAppRootFolder();
        for (String filename : new String[] { "config.js", "boot.js" }) {
            File sourceFile = sourceFolder.getFile(filename);
            File destinationFile = phoneGapWebFolder.getFile(filename);
            if (sourceFile.exists() && !destinationFile.exists()) {
                destinationFile.getContent().write(sourceFile);
            }
        }
    }

    private void fixupXCodeFilesFollowingSetup() {
        Folder xcodePhoneGapFolder = getPhoneGapFolder(FolderLayout.XCODE);
        String projectName = this.projectManager.getCurrentProject().getProjectName();
        File mainViewControllerFile = xcodePhoneGapFolder.getFile("../" + projectName + "/Classes/MainViewController.m");

        if (mainViewControllerFile.exists()) {
            String content = mainViewControllerFile.getContent().asString();
            int start = content.indexOf("(BOOL)shouldAutorotateToInterfaceOrientation");
            int end = content.indexOf("}", start) + 1;
            content = content.substring(0, start)
                + "(BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation\n{\nreturn YES;\n}\n"
                + content.substring(end);
            mainViewControllerFile.getContent().write(content);
        }
    }

    private void purgeUnnecessarySetupFiles(Folder phoneGapLibFolder) {
        phoneGapLibFolder.getFolder("build/Gzipped").list(Including.fileNames().ending(".gz")).delete();
        phoneGapLibFolder.getFolder("build/themes").list(Including.resourceNames().notEnding(".css").notMatching("tundra")).delete();
        phoneGapLibFolder.getFolder("build").list(Including.fileNames().ending(".js")).delete();
        phoneGapLibFolder.getFolder("images/boolean/").delete();
        //phoneGapLibFolder.getFolder("github/touchscroll").delete();
        phoneGapLibFolder.getFile("github/beautify.js").delete();
        Folder dojo = phoneGapLibFolder.getFolder("dojo");
        dojo.getFolder("util").delete();
        dojo.getFolder("dojox").delete();
        dojo.getFolder("dojo").list(Including.fileNames().notMatching("dojo_build.js")).delete();
        dojo.getFolder("dijit").list(Including.resourceNames().notMatching("themes")).delete();
        dojo.getFolder("dijit/themes").list(Including.resourceNames().notEnding(".css").notMatching("tundra")).delete();
        Folder wm = phoneGapLibFolder.getFolder("wm");
        wm.getFolder("compressed").delete();
        wm.getFolder("etc").delete();
        Folder base = wm.getFolder("base");
        base.list(Including.resourceNames().matching("deprecated", "components", "design", "drag", "styles", "templates", "debug")).delete();
        base.list(Including.resourceNames().ending(".js")).delete();
        Folder widget = base.getFolder("widget");
        widget.getFolder("Editors").delete(); // all editors are in a build layer
        widget.list(Including.fileNames().ending("_design.js")).delete();
        String[] purgedWidgetResources = { "Buttons/Button_design.js", "Trees/Tree_design.js", "Dialogs/Dialog_design.js", "AccordionLayers.js",
            "DojoMenu.js", "AppRoot.js", "PageContainer.js", "Bevel.js", "EditPanel.js", "Panel.js", "BreadcrumbLayers.js", "Button.js", "Editor.js",
            "Picture.js", "Container.js", "FileUpload.js", "Formatters.js", "Scrim.js", "Select.js", "Html.js", "Spacer.js", "ContextMenuDialog.js",
            "Html.js", "Splitter.js", "Input.js", "DataForm.js", "DataGrid.js", "Label.js", "Layers.js", "DojoChart.js", "Tree.js", "LayoutBox.js",
            "List.js", "DojoGrid.js", "LiveForm.js", "Dialogs", "List" };
        for (String purgedResource : purgedWidgetResources) {
            if (widget.hasExisting(purgedResource)) {
                widget.getExisting(purgedResource).delete();
            }
        }

	Folder themes = widget.getFolder("themes");
	themes.list(Including.resourceNames().notMatching("default")).delete();
    }

    private void updatePhonegapFiles(String host, int port, FolderLayout layout, String themeName) {
        Folder phoneGapFolder = getPhoneGapFolder(layout);
        if (!phoneGapFolder.exists()) {
            return;
        }

        Folder projectFolder = this.projectManager.getCurrentProject().getRootFolder();
        String url = "http://" + host + ":" + port + "/" + this.projectManager.getCurrentProject().getProjectName();

        // Delete all pages, resources and project files so we can re-copy updated version of them
        ResourceAttributeFilter<Resource> skippedResources = Including.resourceNames().notMatching("config.js", "lib");
        phoneGapFolder.list(skippedResources.notStarting("cordova")).delete();
        // Copy project files for phonegap
        projectFolder.getFolder("webapproot").list(skippedResources.notMatching("WEB-INF")).copyTo(phoneGapFolder);

        // Update index and login HTML files
        String phonegapName = getPhoneGapScript(phoneGapFolder);
        updateHtmlFile(phonegapName, phoneGapFolder.getFile("index.html"));
        updateHtmlFile(phonegapName, phoneGapFolder.getFile("login.html"));

        // Combine boot.js and config.js
        phoneGapFolder.getFile("config.js").getContent().write(combineBootAndConfig(url));

        // Copy theme
        Folder theme = getThemeFolder(themeName);
        theme.copyTo(phoneGapFolder);
        phoneGapFolder.getFolder(theme.getName()).rename("theme");
    }

    private String getPhoneGapScript(Folder phoneGapFolder) {
        Resources<Resource> files = phoneGapFolder.list(Including.resourceNames().starting("cordova-").ending(".js"));
        for (Resource resource : files) {
            return resource.getName();
        }
        return "phonegap.js";
    }

    private void updateHtmlFile(String phoneGapScript, File file) {
        if (!file.exists()) {
            return;
        }
        String phoneGapScriptTag = "<script type=\"text/javascript\" src=\"" + phoneGapScript + "\"></script>";
        String insertLocation = "runtimeLoader.js\"></script>";
        String content = file.getContent().asString();
        if (!content.contains(phoneGapScriptTag)) {
            content = content.replace(insertLocation, insertLocation + "\n" + phoneGapScriptTag);
        }
        content = content.replaceAll("/wavemaker/", "");
        String themeUrlVar = "var wmThemeUrl =";
        if (content.contains(themeUrlVar)) {
            int start = content.indexOf(themeUrlVar);
            int end = content.indexOf(";", start);
            content = content.substring(0, start) + themeUrlVar + " \"theme/theme.css\"" + content.substring(end);
        }
        file.getContent().write(content);
    }

    private String combineBootAndConfig(String url) {
        Folder projectRoot = this.projectManager.getCurrentProject().getRootFolder();
        String config = projectRoot.getFile("webapproot/config.js").getContent().asString();
        String boot = projectRoot.getFile("webapproot/boot.js").getContent().asString();
        config = config.replaceAll("/wavemaker/", "/");
        config = config.replace("wm.relativeLibPath = \"../lib/\";", "wm.relativeLibPath = \"lib/\";");
        config = config + "\nwm.xhrPath = '" + url + "/';\n";
        return config + boot;
    }

    private Folder getThemeFolder(String themeName) {
        Folder themeFolder;
        if (themeName.startsWith("wm_")) {
            themeFolder = this.fileSystem.getStudioWebAppRootFolder().getFolder("lib/wm/base/widget/themes/" + themeName);
        } else {
            themeFolder = this.fileSystem.getCommonFolder().getFolder("themes/" + themeName);
        }
        Assert.isTrue(themeFolder.exists(), "Unable to find theme folder for theme " + themeName);
        return themeFolder;
    }

    private void fixupXCodeFilesFollowingUpdate() {
        String projectName = this.projectManager.getCurrentProject().getProjectName();
        Folder xcodePhoneGapFolder = getPhoneGapFolder(FolderLayout.XCODE);
        File file = xcodePhoneGapFolder.getFile("../" + projectName + "/PhoneGap.plist");
        if (file.exists()) {
            String content = file.getContent().asString();
            String startExpression = "<key>ExternalHosts</key>";
            int startindex = content.indexOf(startExpression);
            int startindex1 = startindex + startExpression.length();
            int endindex1 = content.indexOf("</array>", startindex1);
            if (endindex1 != -1) {
                endindex1 += "</array>".length();
            }
            int endindex2 = content.indexOf("<array/>", startindex1);
            if (endindex2 != -1) {
                endindex2 += "<array/>".length();
            }
            int endindex;
            if (endindex1 == -1) {
                endindex = endindex2;
            } else if (endindex2 == -1) {
                endindex = endindex1;
            } else if (endindex1 > endindex2) {
                endindex = endindex2;
            } else {
                endindex = endindex1;
            }
            content = content.substring(0, startindex1) + "<array><string>*</string></array>" + content.substring(endindex);
            file.getContent().write(content);
        }
    }

    private Folder getPhoneGapFolder(FolderLayout layout) {
        Project currentProject = this.projectManager.getCurrentProject();
        switch (layout) {
            case XCODE:
                return currentProject.getRootFolder().getFolder("phonegap/" + currentProject.getProjectName() + "/www");
            case ECLIPSE:
                return currentProject.getRootFolder().getFolder("phonegap/android/assets/www");
            case PHONEGAP_BUILD_SERVICE:
                return currentProject.getRootFolder().getFolder("phonegap/build");
        }
        throw new IllegalStateException("Uknown phonegap layout " + layout);
    }

    public void setProjectManager(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }

    public void setFileSystem(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }
}

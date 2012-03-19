
package com.wavemaker.studio.phonegap;

import java.io.IOException;

import org.springframework.context.ApplicationListener;

import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.studio.StudioService;
import com.wavemaker.studio.StudioServiceWriteWebFileEvent;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.ResourceFilter;
import com.wavemaker.tools.io.Resources;
import com.wavemaker.tools.io.zip.ZippedFolderInputStream;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioFileSystem;
import java.io.ByteArrayOutputStream;
import java.io.ByteArrayInputStream;

/**
 * Service for Phone Gap operations.
 * 
 * @author Michael Kantor
 */
@HideFromClient
public class PhoneGapService implements ApplicationListener<StudioServiceWriteWebFileEvent> {

    // FIXME this class needs a test case

    private ProjectManager projectManager;

    private StudioFileSystem fileSystem;

    // FIXME depending on StudioService is not ideal, we should remove calls to this and work directly with the FS
    private StudioService studioService;

    @Override
    public void onApplicationEvent(StudioServiceWriteWebFileEvent event) {
        try {
            // FIXME it looks like this method is not respecting the canClober attribute
            writePhoneGapFile(event.getPath(), event.getData());
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }

    // FIXME rework to use new Resource abstraction, example here:
    private void exampleUsingNewFileSystem() {

        // Getting the project root folder
        Folder projectFolder = this.projectManager.getCurrentProject().getRootFolder();

        // Getting a subfolder
        Folder phoneFolder = projectFolder.getFolder("/phonegap");

        // Test for file/folder existance
        boolean phoneGapFolderExists = phoneFolder.exists();

        // Creating a sub-folder
        phoneFolder.getFolder("android/assets/www").createIfMissing();

        // Reading contents
        String content = phoneFolder.getFile("example/folder/file.txt").getContent().asString();

        // Writing contents
        phoneFolder.getFile("example/folder/file.txt").getContent().write("New content");

        // Copy folder
        phoneFolder.getFile("lib").copyTo(phoneFolder);

        // List Files matching some pattern
        Resources<File> files = phoneFolder.getFolder("android/assets/www").list(new ResourceFilter<File>() {

            @Override
            public boolean include(File resource) {
                return resource.getName().startsWith("cordova-") && resource.getName().endsWith(".js");
            }
        });

        // Delete files
        files.delete();

        // Delete folder
        phoneFolder.delete();
    }

    private void writePhoneGapFile(String path, String data) throws IOException {
        // XCODE
        String projectName = this.projectManager.getCurrentProject().getProjectName();
        String pathPrefix = "phonegap/" + projectName + "/www/";
        org.springframework.core.io.Resource phonegap = this.projectManager.getCurrentProject().getProjectRoot().createRelative(pathPrefix);

        if (phonegap.exists()) {
            org.springframework.core.io.Resource lib = phonegap.createRelative("lib");
            this.projectManager.getCurrentProject().writeFile(pathPrefix + (path.startsWith("/") ? path.substring(1) : path), data, false);
        }

        // ECLIPSE
        pathPrefix = "phonegap/android/assets/www/";
        phonegap = this.projectManager.getCurrentProject().getProjectRoot().createRelative(pathPrefix);

        if (phonegap.exists()) {
            org.springframework.core.io.Resource lib = phonegap.createRelative("lib");
            this.projectManager.getCurrentProject().writeFile(pathPrefix + (path.startsWith("/") ? path.substring(1) : path), data, false);
        }
    }

    @ExposeToClient
	public String getDefaultHost() {
	return SystemUtils.getIP();
    }

    @ExposeToClient
	public void generateBuild(String serverName, int portNumb, String themeName) throws IOException {

        String projectName = this.projectManager.getCurrentProject().getProjectName();	
	Folder phonegapFolder = this.projectManager.getCurrentProject().getRootFolder().getFolder("phonegap");
	phonegapFolder.createIfMissing();
	Folder buildFolder = phonegapFolder.getFolder("build");
	buildFolder.createIfMissing();
        Folder sourceLib = this.fileSystem.getStudioWebAppRootFolder().getFolder("lib");
        Folder commonFolder = this.fileSystem.getCommonFolder();
        Folder theme = themeName.startsWith("wm_") ? sourceLib.getFolder("wm/base/widget/themes/" + themeName) : commonFolder.getFolder("themes/"
            + themeName);

	buildFolder.createIfMissing();
	setupPhonegapFiles(projectName, buildFolder);
	updatePhonegapFiles(serverName, portNumb, projectName, buildFolder, theme);

        ZippedFolderInputStream inputStream = new ZippedFolderInputStream(buildFolder);
        //ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
	File dest = phonegapFolder.getFile("build.zip");
	dest.getContent().write(inputStream);
    }
    @ExposeToClient
	public DownloadResponse downloadBuild() throws IOException {
	Folder phonegapFolder = this.projectManager.getCurrentProject().getRootFolder().getFolder("phonegap");	
	File dest = phonegapFolder.getFile("build.zip");
        String projectName = this.projectManager.getCurrentProject().getProjectName();	
	DownloadResponse ret = new DownloadResponse();
	ret.setContents(dest.getContent().asInputStream());
	ret.setContentType("application/unknown");
	ret.setFileName(projectName + ".zip");
	return ret;
    }

    @ExposeToClient
    public void setupPhonegapFiles() throws IOException {
        String projectName = this.projectManager.getCurrentProject().getProjectName();

        // XCODE
        String pathPrefix = "phonegap/" + projectName + "/www/";
        Folder phonegapFolder = this.projectManager.getCurrentProject().getRootFolder().getFolder("/" + pathPrefix);
        setupPhonegapFiles(projectName, phonegapFolder);

        // Eclipse
        pathPrefix = "phonegap/android/assets/www/";
        phonegapFolder = this.projectManager.getCurrentProject().getRootFolder().getFolder("/" + pathPrefix);
        setupPhonegapFiles(projectName, phonegapFolder);
    }

    private void setupPhonegapFiles(String projectName, Folder phonegap) throws IOException {
        if (phonegap.exists()) {
            Folder lib = phonegap.getFolder("lib");
            if (!lib.exists()) {
                // Copy studio's lib folder into phonegap's folder
                Folder sourceLib = this.fileSystem.getStudioWebAppRootFolder().getFolder("lib");
                sourceLib.list().copyTo(lib);
                try {
                    // Copy the project's pages folder into phonegap's folder
                    Folder sourcePages = this.projectManager.getCurrentProject().getRootFolder().getFolder("webapproot/pages");
                    sourcePages.list().copyTo(phonegap.getFolder("pages"));
                } catch (Exception e) {
                    System.out.println("FAILED TO COPY PAGES");
                }

                try {
                    // Copy the common folder into phonegap's folder
                    Folder commonFolder = this.fileSystem.getCommonFolder();
                    commonFolder.list().copyTo(phonegap.getFolder("common"));
                } catch (Exception e) {
                    System.out.println("FAILED TO COPY COMMON");
                }
                try {
                    File MainViewerLib = this.projectManager.getCurrentProject().getRootFolder().getFile(
                        "phonegap/" + projectName + "/" + projectName + "/Classes/MainViewController.m");
                    if (MainViewerLib.exists()) {
                        String MainViewerStr = MainViewerLib.getContent().asString();
                        String MainViewerSearchStr = "(BOOL)shouldAutorotateToInterfaceOrientation";
                        int MainViewerStart = MainViewerStr.indexOf(MainViewerSearchStr);
                        int MainViewerEnd = MainViewerStr.indexOf("}", MainViewerStart) + 1;
                        MainViewerStr = MainViewerStr.substring(0, MainViewerStart)
                            + "(BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation\n{\nreturn YES;\n}\n"
                            + MainViewerStr.substring(MainViewerEnd);
                        MainViewerLib.getContent().write(MainViewerStr);
                    }
                } catch (Exception e) {
                    System.out.println("FAILED TO COPY MAINVIEWERLIB");
                }

                /* Purge useless stuff */
                try {

                    try {

                        Folder gzipped = lib.getFolder("build/Gzipped");
                        lib.getFolder("build/Gzipped").list(new ResourceFilter<Resource>() {

                            @Override
                            public boolean include(Resource resource) {
                                return resource.getName().endsWith(".gz");
                            }
                        }).delete();
                    } catch (Exception e) {
                        System.out.println("Failed to delete Gzipped files");
                    }
                    System.out.println("GZIPPED END");
                    try {
                        System.out.println("THEMES:" + lib.getFolder("build/themes").toString());
                        lib.getFolder("build/themes").list(new ResourceFilter<Resource>() {

                            @Override
                            public boolean include(Resource resource) {
                                System.out.println("NAME: " + resource.getName() + " | "
                                    + (!resource.getName().endsWith(".css") && !resource.getName().equals("tundra")));
                                return !resource.getName().endsWith(".css") && !resource.getName().equals("tundra");
                            }
                        }).delete();
                    } catch (Exception e) {
                        System.out.println("Failed to delete dojo themes in build");
                    }
                    try {
                        lib.getFolder("build").list(new ResourceFilter<File>() {

                            @Override
                            public boolean include(File resource) {
                                return resource.getName().endsWith(".js");
                            }
                        }).delete();
                    } catch (Exception e) {
                        System.out.println("Failed to delete misc buildf files");
                    }
                    lib.getFolder("images/boolean/").delete();
                    lib.getFolder("github/touchscroll").delete();
                    lib.getFile("github/beautify.js").delete();
                    Folder dojo = lib.getFolder("dojo");
                    if (dojo.getFolder("util").exists()) {
                        dojo.getFolder("util").delete();
                    }
                    dojo.getFolder("dojox").delete();

                    try {
                        dojo.getFolder("dojo").list(new ResourceFilter<Resource>() {

                            @Override
                            public boolean include(Resource resource) {
                                return !resource.getName().equals("dojo_build.js");
                            }
                        }).delete();
                    } catch (Exception e) {
                        System.out.println("Failed to delete dojo folder");
                    }
                    try {
                        dojo.getFolder("dijit").list(new ResourceFilter<Resource>() {

                            @Override
                            public boolean include(Resource resource) {
                                return !resource.getName().equals("themes");
                            }
                        }).delete();
                    } catch (Exception e) {
                        System.out.println("Failed to delete dijit folder");
                    }
                    try {
                        dojo.getFolder("dijit/themes").list(new ResourceFilter<File>() {

                            @Override
                            public boolean include(File resource) {
                                return !resource.getName().equals("tundra") && !resource.getName().endsWith(".css");
                            }
                        }).delete();
                    } catch (Exception e) {
                        System.out.println("Failed to delete dijit themes files");
                    }
                    Folder wm = lib.getFolder("wm");

                    Folder compressed = wm.getFolder("compressed");
                    if (compressed.exists()) {
                        compressed.delete();
                    }

                    Folder etc = wm.getFolder("etc");
                    if (etc.exists()) {
                        etc.delete();
                    }

                    Folder base = wm.getFolder("base");
                    try {
                        base.list(new ResourceFilter<Resource>() {

                            @Override
                            public boolean include(Resource resource) {
                                String name = resource.getName();
                                return name.endsWith(".js") || name.equals("deprecated") || name.equals("components") || name.equals("design")
                                    || name.equals("drag") || name.equals("styles") || name.equals("templates") || name.equals("debug");
                            }
                        }).delete();
                    } catch (Exception e) {
                        System.out.println("Failed to delete wm files");
                    }

                    Folder widget = base.getFolder("widget");

                    widget.getFolder("Editors").delete(); // all editors are in a build layer
                    widget.list(new ResourceFilter<File>() {

                        @Override
                        public boolean include(File resource) {
                            return resource.getName().endsWith("_design.js");
                        }
                    }).delete();
                    widget.getFile("Buttons/Button_design.js").delete();
                    widget.getFile("Trees/Tree_design.js").delete();
                    widget.getFile("Dialogs/Dialog_design.js").delete();
                    widget.getFile("AccordionLayers.js").delete();
                    widget.getFile("DojoMenu.js").delete();
                    widget.getFile("AppRoot.js").delete();
                    widget.getFile("PageContainer.js").delete();
                    widget.getFile("Bevel.js").delete();
                    widget.getFile("EditPanel.js").delete();
                    widget.getFile("Panel.js").delete();
                    widget.getFile("BreadcrumbLayers.js").delete();
                    widget.getFile("Button.js").delete();
                    widget.getFile("Editor.js").delete();
                    widget.getFile("Picture.js").delete();
                    widget.getFile("Container.js").delete();
                    widget.getFile("FileUpload.js").delete();
                    widget.getFile("Formatters.js").delete();
                    widget.getFile("Scrim.js").delete();
                    widget.getFile("Select.js").delete();
                    widget.getFile("Html.js").delete();
                    widget.getFile("Spacer.js").delete();
                    widget.getFile("ContextMenuDialog.js").delete();
                    widget.getFile("Html.js").delete();
                    widget.getFile("Splitter.js").delete();
                    widget.getFile("Input.js").delete();
                    widget.getFile("DataForm.js").delete();
                    widget.getFile("DataGrid.js").delete();
                    widget.getFile("Label.js").delete();
                    widget.getFile("Layers.js").delete();
                    widget.getFile("DojoChart.js").delete();
                    widget.getFolder("Dialogs").delete();
                    widget.getFile("Tree.js").delete();
                    widget.getFile("LayoutBox.js").delete();
                    widget.getFile("List.js").delete();
                    widget.getFolder("List").delete();
                    widget.getFile("DojoGrid.js").delete();
                    widget.getFile("LiveForm.js").delete();
                    widget.getFolder("themes").list(new ResourceFilter<Folder>() {

                        @Override
                        public boolean include(Folder resource) {
                            return !resource.getName().equals("theme");
                        }
                    }).delete();
                } catch (Exception e) {
                    System.out.println("FAILED:" + e.toString());
                }
		Folder sourceWebapproot = this.projectManager.getCurrentProject().getRootFolder().getFolder("webapproot");
		String[] fileNameList = {"index.html", "login.html", "config.js", "boot.js"};
		for (int i = 0; i < fileNameList.length; i++) {
		    File f1 = phonegap.getFile(fileNameList[i]);
		    if (!f1.exists()) {
			File f2 = sourceWebapproot.getFile(fileNameList[i]);
			if (f2.exists())
			    f2.copyTo(phonegap);
		    }
		}

            }
            System.out.println("FINISHED PHONEGAP SETUP");
        }
    }

    @ExposeToClient
    public void updatePhonegapFiles(int portNumb, String themeName) throws IOException {
        Folder projectFolder = this.projectManager.getCurrentProject().getRootFolder();
        Folder sourceLib = this.fileSystem.getStudioWebAppRootFolder().getFolder("lib");
        Folder commonFolder = this.fileSystem.getCommonFolder();
        Folder theme = themeName.startsWith("wm_") ? sourceLib.getFolder("wm/base/widget/themes/" + themeName) : commonFolder.getFolder("themes/"
            + themeName);
	String serverUrl = SystemUtils.getIP();

        // XCODE
        String projectName = this.projectManager.getCurrentProject().getProjectName();
        String pathPrefix = "phonegap/" + projectName + "/www/";
        Folder phonegapFolder = this.projectManager.getCurrentProject().getRootFolder().getFolder(pathPrefix);
        System.out.println("XCODE:" + phonegapFolder.toString());
        updatePhonegapFiles(serverUrl, portNumb, projectName, phonegapFolder, theme);

        // ANDROID
        pathPrefix = "phonegap/android/assets/www/";
        phonegapFolder = this.projectManager.getCurrentProject().getRootFolder().getFolder(pathPrefix);
        System.out.println("ANDROID:" + phonegapFolder.toString());
        updatePhonegapFiles(serverUrl, portNumb, projectName, phonegapFolder, theme);
    }

    private void updatePhonegapFiles(String serverUrl, int portNumb, String projectName, final Folder phonegap, Folder theme) throws IOException {
        if (phonegap.exists()) {

            /* delete all pages, resources and project files so we can recopy updated version of them */
            phonegap.list(new ResourceFilter<Resource>() {

                @Override
                public boolean include(Resource resource) {
                    System.out.println("DELETE " + resource.getName());
                    return !resource.getName().equals("index.html") && !resource.getName().equals("login.html")
                        && !resource.getName().equals("config.js") && !resource.getName().equals("lib") && !resource.getName().startsWith("cordova");
                }
            }).delete();

            Folder lib = phonegap.getFolder("lib");

            File indexhtml = phonegap.getFile("index.html");
            String indexhtml_text = indexhtml.getContent().asString();

            File loginhtml = phonegap.getFile("login.html");
            String loginhtml_text = "";
            if (loginhtml.exists()) {
                loginhtml_text = indexhtml.getContent().asString();
            }

            // Add phonegap library
            System.out.println("Find Cordova IN: " + phonegap.toString());
            try {
                Resources<Resource> files = phonegap.list(new ResourceFilter<Resource>() {

                    @Override
                    public boolean include(Resource resource) {
                        System.out.println("FOUND: " + resource.getName());
                        return resource.getName().startsWith("cordova-") && resource.getName().endsWith(".js");
                    }
                });

		String phonegapName = "phonegap.js"; // still used by phonegap build service, but may have to update to cordova.js
                for (Resource resource : files) {
		    phonegapName = resource.getName();
		}
		if (indexhtml_text.indexOf("<script type=\"text/javascript\" src=\"" + phonegapName + "\"></script>") == -1) {
                        System.out.println("ADDED cordova.js");
                        indexhtml_text = indexhtml_text.replace("runtimeLoader.js\"></script>",
                            "runtimeLoader.js\"></script>\n<script type=\"text/javascript\" src=\"" + phonegapName + "\"></script>");
                        if (!loginhtml_text.equals("")) {
                            loginhtml_text = loginhtml_text.replace("runtimeLoader.js\"></script>",
                                "runtimeLoader.js\"></script>\n<script type=\"text/javascript\" src=\"" + phonegapName + "\"></script>");
                        }

		}



            } catch (Exception e) {
                System.out.println("Search for Cordova has failed: " + e.toString());
            }

            // Update paths in index.html
            indexhtml_text = indexhtml_text.replaceAll("/wavemaker/", "");
            loginhtml_text = loginhtml_text.replaceAll("/wavemaker/", "");

            if (indexhtml_text.indexOf("var wmThemeUrl =") != -1) {
                int start = indexhtml_text.indexOf("var wmThemeUrl =");
                int end = indexhtml_text.indexOf(";", start);
                indexhtml_text = indexhtml_text.substring(0, start) + "var wmThemeUrl = \"theme/theme.css\"" + indexhtml_text.substring(end);
            }

            if (loginhtml_text.indexOf("var wmThemeUrl =") != -1) {
                int start = loginhtml_text.indexOf("var wmThemeUrl =");
                int end = loginhtml_text.indexOf(";", start);
                loginhtml_text = loginhtml_text.substring(0, start) + "var wmThemeUrl = \"theme/theme.css\"" + loginhtml_text.substring(end);
            }

            indexhtml.getContent().write(indexhtml_text);
            if (!loginhtml_text.equals("")) {
                loginhtml.getContent().write(loginhtml_text);
            }

            // Concatenate boot.js and config.js together and save as config.js
            File configjs = phonegap.getFile("config.js");
            Folder projectFolder = this.projectManager.getCurrentProject().getRootFolder();
            String configjs_text = projectFolder.getFile("webapproot/config.js").getContent().asString();// get the
                                                                                                         // project
                                                                                                         // config.js
                                                                                                         // rather than
                                                                                                         // the phonegap
            // version which has already been modified; TODO: This is
            // bad to constantly clobber changes to config.js; future
            // versions of config.js maybe need to build in boot.js or
            // else add back in loading of boot.js
            String boottext = projectFolder.getFile("webapproot/boot.js").getContent().asString();

            int startDebug = configjs_text.indexOf("djConfig.debugBoot");
            int endDebug = configjs_text.indexOf(";", startDebug);
            // configjs_text = configjs_text.substring(0, startDebug) + "djConfig.debugBoot = " + isDebug +
            // configjs_text.substring(endDebug);
            System.out.println("START: " + startDebug + "; END: " + endDebug);
            configjs_text = configjs_text.replaceAll("/wavemaker/", "/").replace("wm.relativeLibPath = \"../lib/\";",
                "wm.relativeLibPath = \"lib/\";")
                + "\nwm.xhrPath = 'http://" + serverUrl + ":" + portNumb + "/" + projectName + "/';\n" + boottext;
            configjs.getContent().write(configjs_text);

            // Update phonegap.plist (IOS only)
            File phonegap_plist_file = projectFolder.getFile("phonegap/" + projectName + "/PhoneGap.plist");
            if (phonegap_plist_file.exists()) {
                String phonegap_plist = phonegap_plist_file.getContent().asString();
                String startExpression = "<key>ExternalHosts</key>";
                int startindex = phonegap_plist.indexOf(startExpression);
                int startindex1 = startindex + startExpression.length();
                int endindex1 = phonegap_plist.indexOf("</array>", startindex1);
                if (endindex1 != -1) {
                    endindex1 += "</array>".length();
                }
                int endindex2 = phonegap_plist.indexOf("<array/>", startindex1);
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
                phonegap_plist = phonegap_plist.substring(0, startindex1) + "<array><string>" + SystemUtils.getIP() + "</string></array>"
                    + phonegap_plist.substring(endindex);
                phonegap_plist_file.getContent().write(phonegap_plist);
            }

            // Recopy common; TODO: Update registering of modules for this new path
            /*
             * if (phonegap.createRelative("common").getFile().exists()) {
             * IOUtils.deleteRecursive(phonegap.createRelative("common").getFile()); }
             * IOUtils.copy(this.fileSystem.getCommonDir().getFile(), phonegap.createRelative("common").getFile());
             */

            projectFolder.getFolder("webapproot").list(new ResourceFilter<Resource>() {

                @Override
                public boolean include(Resource resource) {
                    return !resource.getName().equals("index.html") && !resource.getName().equals("config.js") && !resource.getName().equals("lib")
                        && !resource.getName().equals("WEB-INF");
                }
            }).copyTo(phonegap);

            theme.copyTo(phonegap);
            phonegap.getFolder(theme.getName()).rename("theme");
        }
    }

    public void setProjectManager(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }

    public void setFileSystem(StudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }

    public void setStudioService(StudioService studioService) {
        this.studioService = studioService;
    }
}

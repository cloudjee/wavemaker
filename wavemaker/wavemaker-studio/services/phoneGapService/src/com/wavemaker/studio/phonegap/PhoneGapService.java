
package com.wavemaker.studio.phonegap;

import java.io.IOException;

import org.springframework.context.ApplicationListener;
import org.springframework.core.io.Resource;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.studio.StudioService;
import com.wavemaker.studio.StudioServiceWriteWebFileEvent;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioFileSystem;

/**
 * Service for Phone Gap operations.
 * 
 * @author Michael Kantor
 */
@HideFromClient
public class PhoneGapService implements ApplicationListener<StudioServiceWriteWebFileEvent> {

    // FIXME this class needs a test case
    // FIXME rework to use new Resource abstraction

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

    private void writePhoneGapFile(String path, String data) throws IOException {
        // XCODE
        String projectName = this.projectManager.getCurrentProject().getProjectName();
        String pathPrefix = "phonegap/" + projectName + "/www/";
        Resource phonegap = this.projectManager.getCurrentProject().getProjectRoot().createRelative(pathPrefix);

        if (phonegap.exists()) {
            Resource lib = phonegap.createRelative("lib");
            this.projectManager.getCurrentProject().writeFile(pathPrefix + (path.startsWith("/") ? path.substring(1) : path), data, false);
        }

        // ECLIPSE
        pathPrefix = "phonegap/assets/www/";
        phonegap = this.projectManager.getCurrentProject().getProjectRoot().createRelative(pathPrefix);

        if (phonegap.exists()) {
            Resource lib = phonegap.createRelative("lib");
            this.projectManager.getCurrentProject().writeFile(pathPrefix + (path.startsWith("/") ? path.substring(1) : path), data, false);
        }
    }

    @ExposeToClient
    public void setupPhonegapFiles(int portNumb, boolean isDebug) throws IOException {
        String projectName = this.projectManager.getCurrentProject().getProjectName();

        // XCODE
        String pathPrefix = "phonegap/" + projectName + "/www/";
        Resource phonegap = this.projectManager.getCurrentProject().getProjectRoot().createRelative(pathPrefix);
        setupPhonegapFiles(portNumb, projectName, phonegap);

        // Eclipse
        pathPrefix = "phonegap/assets/www/";
        phonegap = this.projectManager.getCurrentProject().getProjectRoot().createRelative(pathPrefix);
        setupPhonegapFiles(portNumb, projectName, phonegap);
    }

    private void setupPhonegapFiles(int portNumb, String projectName, Resource phonegap) throws IOException {
        if (phonegap.exists()) {
            Resource lib = phonegap.createRelative("lib");
            if (!lib.exists()) {
                // Copy studio's lib folder into phonegap's folder
                IOUtils.copy(new java.io.File(this.fileSystem.getStudioWebAppRoot().getFile(), "lib"), lib.getFile());

                // Copy the project's pages folder into phonegap's folder
                IOUtils.copy(this.projectManager.getCurrentProject().getWebAppRoot().createRelative("pages").getFile(),
                    phonegap.createRelative("pages").getFile());

                // Copy the common folder into phonegap's folder
                IOUtils.copy(this.fileSystem.getCommonDir().getFile(), phonegap.createRelative("common").getFile());

                Resource MainViewerLib = this.projectManager.getCurrentProject().getProjectRoot().createRelative(
                    "phonegap/" + projectName + "/" + projectName + "/Classes/MainViewController.m");
                if (MainViewerLib.exists()) {
                    System.out.println("MAINVIEWER: " + MainViewerLib.getFile().getAbsolutePath());
                    String MainViewerStr = IOUtils.read(MainViewerLib.getFile());
                    String MainViewerSearchStr = "(BOOL)shouldAutorotateToInterfaceOrientation";
                    int MainViewerStart = MainViewerStr.indexOf(MainViewerSearchStr);
                    int MainViewerEnd = MainViewerStr.indexOf("}", MainViewerStart) + 1;
                    MainViewerStr = MainViewerStr.substring(0, MainViewerStart)
                        + "(BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation\n{\nreturn YES;\n}\n"
                        + MainViewerStr.substring(MainViewerEnd);
                    IOUtils.write(MainViewerLib.getFile(), MainViewerStr);
                }
            }
        }
    }

    @ExposeToClient
    public void updatePhonegapFiles(int portNumb, boolean isDebug) throws IOException {

        // XCODE
        String projectName = this.projectManager.getCurrentProject().getProjectName();
        String pathPrefix = "phonegap/" + projectName + "/www/";
        Resource phonegap = this.projectManager.getCurrentProject().getProjectRoot().createRelative(pathPrefix);
        updatePhonegapFiles(portNumb, isDebug, projectName, phonegap);

        // ECLIPSE
        pathPrefix = "phonegap/assets/www/";
        phonegap = this.projectManager.getCurrentProject().getProjectRoot().createRelative(pathPrefix);
        updatePhonegapFiles(portNumb, isDebug, projectName, phonegap);
    }

    private void updatePhonegapFiles(int portNumb, boolean isDebug, String projectName, Resource phonegap) throws IOException {
        if (phonegap.exists()) {
            Resource lib = phonegap.createRelative("lib");
            Resource indexhtml = phonegap.createRelative("index.html");
            String indexhtml_text = IOUtils.read(indexhtml.getFile());

            // Update paths in index.html
            indexhtml_text = indexhtml_text.replaceAll("/wavemaker/", "");

            // Add phonegap library
            java.io.File[] listing = phonegap.getFile().listFiles(new java.io.FilenameFilter() {

                @Override
                public boolean accept(java.io.File dir, String name) {
                    return name.indexOf("phonegap-") == 0 && name.indexOf(".js") != -1;
                }
            });
            if (indexhtml_text.indexOf("<script type=\"text/javascript\" src=\"" + listing[0].getName() + "\"></script>") == -1) {
                indexhtml_text = indexhtml_text.replace("runtimeLoader.js\"></script>",
                    "runtimeLoader.js\"></script>\n<script type=\"text/javascript\" src=\"" + listing[0].getName() + "\"></script>");
            }
            IOUtils.write(indexhtml.getFile(), indexhtml_text);

            // Concatenate boot.js and config.js together and save as config.js
            Resource configjs = phonegap.createRelative("config.js");
            String configjs_text = this.studioService.readWebFile("config.js"); // get the project config.js rather than
                                                                                // the phonegap
            // version which has already been modified; TODO: This is
            // bad to constantly clobber changes to config.js; future
            // versions of config.js maybe need to build in boot.js or
            // else add back in loading of boot.js
            String boottext = IOUtils.read(lib.createRelative("boot").createRelative("boot.js").getFile());

            int startDebug = configjs_text.indexOf("djConfig.debugBoot");
            int endDebug = configjs_text.indexOf(";", startDebug);
            configjs_text = configjs_text.substring(0, startDebug) + "djConfig.debugBoot = " + isDebug + configjs_text.substring(endDebug);
            System.out.println("START: " + startDebug + "; END: " + endDebug);
            configjs_text = configjs_text.replaceAll("/wavemaker/", "/").replace("wm.relativeLibPath = \"../lib/\";",
                "wm.relativeLibPath = \"lib/\";")
                + "\nwm.xhrPath = 'http://" + SystemUtils.getIP() + ":" + portNumb + "/" + projectName + "/';\n" + boottext;
            IOUtils.write(configjs.getFile(), configjs_text);

            // Update phonegap.plist (IOS only)
            java.io.File phonegap_plist_file = new java.io.File(phonegap.getFile().getParent(), projectName + "/PhoneGap.plist");
            if (phonegap_plist_file.exists()) {
                String phonegap_plist = IOUtils.read(phonegap_plist_file);
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
                IOUtils.write(phonegap_plist_file, phonegap_plist);
            }

            // Recopy common; TODO: Update registering of modules for this new path
            if (phonegap.createRelative("common").getFile().exists()) {
                IOUtils.deleteRecursive(phonegap.createRelative("common").getFile());
            }
            IOUtils.copy(this.fileSystem.getCommonDir().getFile(), phonegap.createRelative("common").getFile());

            // Recopy resources
            if (phonegap.createRelative("resources").getFile().exists()) {
                IOUtils.deleteRecursive(phonegap.createRelative("resources").getFile());
            }
            IOUtils.copy(this.projectManager.getCurrentProject().getWebAppRoot().createRelative("resources").getFile(),
                phonegap.createRelative("resources").getFile());
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

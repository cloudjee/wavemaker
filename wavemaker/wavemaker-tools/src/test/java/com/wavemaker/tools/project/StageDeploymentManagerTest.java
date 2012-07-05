
package com.wavemaker.tools.project;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import com.wavemaker.tools.io.FilterOn;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.local.LocalFolder;

public class StageDeploymentManagerTest {

    @Rule
    public TemporaryFolder temporaryFolder = new TemporaryFolder();

    @Test
    public void test() {

        Folder studioWebAppRoot = new LocalFolder("/Users/pwebb/projects/wavemaker/code/wavemaker/wavemaker-studio/src/main/webapp");
        String customWmDir = AbstractStudioFileSystem.COMMON_DIR;
        com.wavemaker.tools.io.ResourceFilter excluded = FilterOn.antPattern("/dojo/util/**", "/dojo/**/tests/**", "/wm/" + customWmDir + "/**");
        Folder buildAppWebAppRoot = new LocalFolder(this.temporaryFolder.getRoot());
        studioWebAppRoot.getFolder("lib").jail().find().exclude(excluded).files().copyTo(buildAppWebAppRoot.getFolder("lib"));

        System.out.println(this.temporaryFolder.getRoot());
        System.err.println("done");
    }

}

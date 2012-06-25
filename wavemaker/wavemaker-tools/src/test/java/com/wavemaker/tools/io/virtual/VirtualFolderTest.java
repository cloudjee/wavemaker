
package com.wavemaker.tools.io.virtual;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import java.io.FileOutputStream;
import java.io.InputStream;

import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import com.wavemaker.tools.deployment.tomcat.TomcatManager;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.FilterOn;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.ResourceFilter;
import com.wavemaker.tools.io.ResourceOperation;
import com.wavemaker.tools.io.local.LocalFolder;
import com.wavemaker.tools.io.zip.ZipArchive;

@Ignore
public class VirtualFolderTest {

    @Rule
    public TemporaryFolder temporaryFolder = new TemporaryFolder();

    @Test
    public void example() throws Exception {
        LocalFolder localFolder = new LocalFolder(this.temporaryFolder.getRoot());
        localFolder.getFile("/a/b/c.txt").getContent().write("thisisfilec");
        localFolder.getFile("/a/b/d.txt").getContent().write("thisisfiled");

        VirtualFolder virtualFolder = new VirtualFolder();
        localFolder.copyContentsTo(virtualFolder.getFolder("x"));
        virtualFolder.getFile("/x/y.txt").getContent().write("thisisfiley");

        assertThat(virtualFolder.getFolder("x").exists(), is(true));
        assertThat(virtualFolder.getFolder("z").exists(), is(false));
        assertThat(virtualFolder.getFile("x/a/b/c.txt").getContent().asString(), is("thisisfilec"));
        assertThat(virtualFolder.getFile("x/y.txt").getContent().asString(), is("thisisfiley"));
    }

    @Test
    public void exampleWar() throws Exception {
        Folder project = new LocalFolder("/Users/pwebb/Documents/WaveMaker 6.5.0.M1/projects/Project");
        Folder studio = new LocalFolder("/Users/pwebb/projects/wavemaker/code/wavemaker/wavemaker-studio/src/main/webapp");
        File warFile = new LocalFolder("/Users/pwebb/tmp").getFile("builtwar/example.war");
        warFile.getContent().write(assembleWar(project, studio));

        warFile.getContent().copyTo(new FileOutputStream("/Users/pwebb/tmp/builtwar/copy.war"));

        TomcatManager tomcatManager = new TomcatManager("localhost", 8080, "/manager", "manager", "manager");
        tomcatManager.deploy("test", warFile);
    }

    private InputStream assembleWar(Folder project, Folder studio) {
        Folder war = new VirtualFolder();

        ResourceFilter excludedFromStudioLib = FilterOn.antPattern("/dojo/util/**", "/dojo/**/tests/**");
        studio.getFolder("lib").find().exclude(excludedFromStudioLib).files().copyTo(war);
        project.getFolder("webapproot").copyContentsTo(war);

        war.find().include(FilterOn.antPattern("*.html")).files().performOperation(replace("\"", "\"/wavemaker/app/"));
        war.getFile("config.js").performOperation(replace("\"../wavemaker", "\""));
        war.getFile("config.js").performOperation(replace("\"/wavemaker", "\""));

        return ZipArchive.compress(war);
    }

    private ResourceOperation<File> replace(final String target, final String replacement) {
        return new ResourceOperation<File>() {

            @Override
            public void perform(File resource) {
                String content = resource.getContent().asString();
                content = content.replace(target, replacement);
                resource.getContent().write(content);
            }
        };
    }

    void dump(Resource resource) {
        System.out.println(resource);
        if (resource instanceof Folder) {
            for (Resource child : (Folder) resource) {
                dump(child);
            }
        }

    }
}

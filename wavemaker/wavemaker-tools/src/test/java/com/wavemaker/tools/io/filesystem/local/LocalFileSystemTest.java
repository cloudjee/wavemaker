
package com.wavemaker.tools.io.filesystem.local;

import java.io.File;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.filesystem.FileSystemFolder;

public class LocalFileSystemTest {

    @Rule
    public TemporaryFolder temporaryFolder = new TemporaryFolder();

    @Test
    public void test() {
        File newFolder = this.temporaryFolder.newFolder("test");
        System.out.println(newFolder);
        LocalFileSystem localFileSystem = new LocalFileSystem(newFolder);
        Folder root = FileSystemFolder.getRoot(localFileSystem);
        Folder lib = root.getFolder("projects").jail().getFolder("phonegap/build").jail().getFolder("lib");
        lib.getFile("tst").getContent().write("test");
        System.out.println(lib.list().fetchAll());
    }

}

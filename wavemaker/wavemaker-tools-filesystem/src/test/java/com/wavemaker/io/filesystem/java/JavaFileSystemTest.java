
package com.wavemaker.io.filesystem.java;

import java.io.File;
import java.util.Arrays;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import com.wavemaker.io.Folder;
import com.wavemaker.io.filesystem.RootFileSystemFolderFactory;

public class JavaFileSystemTest {

    @Rule
    public TemporaryFolder folder = new TemporaryFolder();

    // FIXME proper test
    @Test
    public void shouldWork() throws Exception {
        File root = this.folder.getRoot();
        JavaFileSystem fileSystem = new JavaFileSystem(root);
        Folder folderRoot = RootFileSystemFolderFactory.getRoot(fileSystem);
        folderRoot.getFolder("a/b").getFile("c.txt").getContent().write("hello");
        folderRoot.getFolder("a/b").getFile("c.bak").touch();
        folderRoot.getFile("a/b/c.txt").moveTo(folderRoot);
        folderRoot.getFolder("a/b").list().delete();
        System.out.println(root);
        System.out.println(Arrays.asList(root.listFiles()));
    }

}


package com.wavemaker.tools.filesystem.tosort;

import java.io.OutputStream;

import com.wavemaker.tools.filesystem.File;
import com.wavemaker.tools.filesystem.Folder;
import com.wavemaker.tools.filesystem.MutableFile;
import com.wavemaker.tools.filesystem.MutableFolder;
import com.wavemaker.tools.filesystem.ResourceFilter;

public class CommonUseCases {

    public void getAsSpecificFileString() throws Exception {
        Folder folder = null;
        folder.getFile("/some/file.txt").getContent().asString();
    }

    public void replaceStringContent() throws Exception {
        MutableFolder folder = null;
        folder.getFile("/some/file.txt").getContent().write("New Content");
    }

    public void copyAFile() throws Exception {
        MutableFolder folder = null;
        MutableFolder destination = folder.getFolder("/other");
        folder.getFile("/some/file.txt").copyTo(destination);
    }

    public void moveAFolder() throws Exception {
        MutableFolder folder = null;
        MutableFolder destination = folder.getFolder("/other");
        folder.getFolder("/some").moveTo(destination);
    }

    public void deleteAFile() throws Exception {
        MutableFolder folder = null;
        folder.getFile("/some/file.txt").delete();
    }

    public void deletAllBackupFiles() throws Exception {
        MutableFolder folder = null;
        folder.list(new PatternResourceFilter("*.bak")).delete();
    }

    public void createFolder() throws Exception {
        MutableFolder folder = null;
        folder.getFolder("/somefolder").touch();
    }

    public void getTheSizeOfAFile() throws Exception {
        MutableFolder folder = null;
        folder.getFile("/some/file.txt").getSize();
    }

    public void getTheLastModifiedAFile() throws Exception {
        MutableFolder folder = null;
        folder.getFile("/some/file.txt").getLastModified();
    }

    public void getChildFolders() throws Exception {
        MutableFolder folder = null;
        for (Folder child : folder.list(ResourceFilter.FOLDERS)) {
            System.out.println(child);
        }
    }

    public void getSha1() throws Exception {
        Folder folder = null;
        folder.getFile("file.txt").getSha1Digest();
    }

    public void uploadToCloudFoundry() throws Exception {
        // FolderApplicationArchiveAdapter archiveAdapter = new FolderApplicationArchiveAdapter(folder);
    }

    public void sendBinaryOverTheWire() throws Exception {
        File file = null;
        OutputStream outputStream = null; // HttpResponse.getOutputStream()
        file.getSize(); // Set content-length
        file.getContent().copyTo(outputStream);
    }

    public void testName(MutableFile givenFile) throws Exception {
        MutableFolder myFolder = null;
        givenFile.copyTo(myFolder);
    }

}

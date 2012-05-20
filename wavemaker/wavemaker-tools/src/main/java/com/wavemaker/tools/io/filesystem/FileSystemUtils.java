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

package com.wavemaker.tools.io.filesystem;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.filesystem.local.LocalFileSystem;

/**
 * Helper class for transitioning from using {@link File} to {@link Folder or @link com.wavemaker.tools.File}
 * 
 * @author Seung Lee
 */
public abstract class FileSystemUtils {

    private FileSystemUtils() {
    }

    public static com.wavemaker.tools.io.Folder convertToFileSystemFolder(java.io.File file) {
        LocalFileSystem fileSystem = new LocalFileSystem(file);
        Folder folder = FileSystemFolder.getRoot(fileSystem);
        return folder;
    }

    public static com.wavemaker.tools.io.File convertToFileSystemFile(java.io.File file) {
        String name = file.getName();
        LocalFileSystem fileSystem = new LocalFileSystem(file.getParentFile());
        Folder folder = FileSystemFolder.getRoot(fileSystem);
        com.wavemaker.tools.io.File f = folder.getFile(name);
        return f;
    }

    public static List<com.wavemaker.tools.io.Folder> convertToFileSystemFolderList(List<File> files) {
        List<com.wavemaker.tools.io.Folder> folders = new ArrayList<com.wavemaker.tools.io.Folder>();
        for (File file : files) {
            folders.add(convertToFileSystemFolder(file));
        }
        return folders;
    }

    public static List<com.wavemaker.tools.io.File> convertToFileSystemFileList(List<File> files) {
        List<com.wavemaker.tools.io.File> rtn = new ArrayList<com.wavemaker.tools.io.File>();
        for (File file : files) {
            rtn.add(convertToFileSystemFile(file));
        }
        return rtn;
    }
}

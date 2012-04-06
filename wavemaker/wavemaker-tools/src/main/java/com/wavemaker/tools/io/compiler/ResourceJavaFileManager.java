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

package com.wavemaker.tools.io.compiler;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.tools.FileObject;
import javax.tools.ForwardingJavaFileManager;
import javax.tools.JavaFileManager;
import javax.tools.JavaFileObject;
import javax.tools.JavaFileObject.Kind;

import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.ResourcePath;
import com.wavemaker.tools.io.ResourceURL;
import com.wavemaker.tools.io.filesystem.FileSystemFolder;
import com.wavemaker.tools.io.zip.ZipFileSystem;

/**
 * A {@link ForwardingJavaFileManager} that manages files contained in {@link com.wavemaker.tools.io.Resource}s.
 * 
 * @author Phillip Webb
 */
public class ResourceJavaFileManager extends ForwardingJavaFileManager<JavaFileManager> {

    private static final Set<Kind> CLASS_OR_SOURCE_KIND = EnumSet.of(Kind.CLASS, Kind.SOURCE);

    private final Map<String, Iterable<Resource>> locations = new HashMap<String, Iterable<Resource>>();

    private final Map<String, Iterable<Folder>> locationFolders = new HashMap<String, Iterable<Folder>>();

    public ResourceJavaFileManager(JavaFileManager fileManager) {
        super(fileManager);
    }

    public JavaFileManager getParentFileManager() {
        return this.fileManager;
    }

    @Override
    public ClassLoader getClassLoader(Location location) {
        try {
            Iterable<Resource> folders = getLocation(location);
            if (folders == null) {
                return null;
            }
            List<URL> urls = ResourceURL.getForResources(folders);
            ClassLoader parent = super.getClassLoader(location);
            return new URLClassLoader(urls.toArray(new URL[urls.size()]), parent);
        } catch (MalformedURLException e) {
            throw new IllegalStateException(e);
        }
    }

    @Override
    public Iterable<JavaFileObject> list(Location location, String packageName, Set<Kind> kinds, boolean recurse) throws IOException {
        List<JavaFileObject> javaFileObjects = new ArrayList<JavaFileObject>();
        Iterable<Folder> folders = getLocationFolders(location);
        if (folders != null) {
            ResourcePath packagePath = asPath(packageName);
            for (Folder folder : folders) {
                collectJavaFileObjects(javaFileObjects, folder, packagePath, kinds, recurse);
            }
        }
        try {
            addAll(javaFileObjects, super.list(location, packageName, kinds, recurse));
        } catch (Exception e) {
            // Treat as missing
        }
        return javaFileObjects;
    }

    private void collectJavaFileObjects(List<JavaFileObject> list, Folder root, ResourcePath packagePath, Set<Kind> kinds, boolean recurse) {
        Folder folder = packagePath.isRootPath() ? root : root.getFolder(packagePath.toString());
        if (!folder.exists() || !folder.toString().endsWith(packagePath + "/")) {
            return;
        }
        for (Resource child : folder.list()) {
            if (child instanceof Folder) {
                Folder childFolder = (Folder) child;
                if (recurse) {
                    collectJavaFileObjects(list, root, packagePath.get(childFolder.getName()), kinds, recurse);
                }
            } else {
                File childFile = (File) child;
                Kind kind = getKind(childFile);
                if (kinds.contains(kind)) {
                    list.add(new ResourceJavaFileObject(childFile, kind));
                }
            }
        }
    }

    private Kind getKind(File file) {
        String extension = StringUtils.getFilenameExtension(file.getName());
        extension = extension == null ? "" : "." + extension;
        for (Kind kind : Kind.values()) {
            if (kind.extension.equals(extension)) {
                return kind;
            }
        }
        return Kind.OTHER;
    }

    @Override
    public String inferBinaryName(Location location, JavaFileObject file) {
        String name = getNameWithoutExtension(file.getName());
        ResourceJavaFileObject javaFileObject = getJavaFile(location, name, file.getKind(), true);
        if (javaFileObject != null) {
            String binaryName = javaFileObject.getFile().toString();
            while (binaryName.startsWith("/")) {
                binaryName = binaryName.substring(1);
            }
            binaryName = getNameWithoutExtension(binaryName);
            binaryName = binaryName.replace("/", ".");
            return binaryName;
        }
        return super.inferBinaryName(location, file);
    }

    @Override
    public boolean isSameFile(FileObject a, FileObject b) {
        if (a instanceof ResourceFileObject && b instanceof ResourceFileObject) {
            return a.equals(b);
        }
        return super.isSameFile(a, b);
    }

    @Override
    public boolean hasLocation(Location location) {
        if (getLocation(location) != null) {
            return true;
        }
        return super.hasLocation(location);
    }

    @Override
    public JavaFileObject getJavaFileForInput(Location location, String className, Kind kind) throws IOException {
        JavaFileObject javaFileObject = getJavaFile(location, className, kind, true);
        if (javaFileObject == null) {
            javaFileObject = super.getJavaFileForInput(location, className, kind);
        }
        return javaFileObject;
    }

    @Override
    public JavaFileObject getJavaFileForOutput(Location location, String className, Kind kind, FileObject sibling) throws IOException {
        JavaFileObject javaFileObject = getJavaFile(location, className, kind, false);
        if (javaFileObject == null) {
            javaFileObject = super.getJavaFileForOutput(location, className, kind, sibling);
        }
        Assert.notNull(javaFileObject, "Unable to get JavaFileObject for output");
        return javaFileObject;
    }

    private ResourceJavaFileObject getJavaFile(Location location, String className, Kind kind, boolean mustExist) {
        if (CLASS_OR_SOURCE_KIND.contains(kind)) {
            Iterable<Folder> folders = getLocationFolders(location);
            if (folders != null) {
                String path = asPath(className) + kind.extension;
                for (Folder folder : folders) {
                    File file = folder.getFile(path);
                    if (file.exists() || !mustExist) {
                        return new ResourceJavaFileObject(file, kind);
                    }
                }
            }
        }
        return null;
    }

    @Override
    public FileObject getFileForInput(Location location, String packageName, String relativeName) throws IOException {
        FileObject fileObject = getFile(location, packageName, relativeName);
        if (fileObject == null) {
            fileObject = super.getFileForInput(location, packageName, relativeName);
        }
        return fileObject;
    }

    @Override
    public FileObject getFileForOutput(Location location, String packageName, String relativeName, FileObject sibling) throws IOException {
        FileObject fileObject = getFile(location, packageName, relativeName);
        if (fileObject == null) {
            fileObject = super.getFileForOutput(location, packageName, relativeName, sibling);
        }
        Assert.notNull(fileObject, "Unable to get FileObject for output");
        return fileObject;
    }

    private ResourceFileObject getFile(Location location, String packageName, String relativeName) throws IOException {
        Iterable<Folder> folders = getLocationFolders(location);
        if (folders != null) {
            String filename = asPath(packageName) + "/" + relativeName.replace("\\", "/");
            for (Folder folder : folders) {
                File file = folder.getFile(filename);
                if (file.exists()) {
                    return new ResourceFileObject(file);
                }
            }
        }
        return null;
    }

    public Iterable<Resource> getLocation(Location location) {
        return this.locations.get(location.getName());
    }

    public void setLocation(Location location, Iterable<? extends Resource> resources) {
        Assert.notNull(location, "Location must not be null");

        List<Resource> resourceList = new ArrayList<Resource>();
        List<Folder> folderList = new ArrayList<Folder>();

        for (Resource resource : resources) {
            resourceList.add(resource);
            folderList.add(asFolder(resource).jail());
        }
        if (location.isOutputLocation()) {
            Assert.isTrue(resourceList.size() <= 1, "Output location '" + location + "' can only have one path");
        }
        this.locations.put(location.getName(), Collections.unmodifiableList(resourceList));
        this.locationFolders.put(location.getName(), Collections.unmodifiableList(folderList));
    }

    public Iterable<Folder> getLocationFolders(Location location) {
        return this.locationFolders.get(location.getName());
    }

    private Folder asFolder(Resource resource) {
        if (resource instanceof Folder) {
            return (Folder) resource;
        }
        File file = (File) resource;
        Assert.isTrue(file.getName().endsWith(".jar") || file.getName().endsWith(".zip"), file + " does not have a jar or zip extension");
        return FileSystemFolder.getRoot(new ZipFileSystem(file));
    }

    private String getNameWithoutExtension(String name) {
        String extension = StringUtils.getFilenameExtension(name);
        if (name == null || extension == null) {
            return name;
        }
        return name.substring(0, name.length() - extension.length() - 1);
    }

    private ResourcePath asPath(String name) {
        if ("".equals(name)) {
            return new ResourcePath();
        }
        StringBuffer classNamePath = new StringBuffer(name.length());
        for (char c : name.toCharArray()) {
            if (c == '\\' || c == '.') {
                c = '/';
            }
            classNamePath.append(c);
        }
        return new ResourcePath().get(classNamePath.toString());
    }

    private <T> void addAll(List<T> list, Iterable<T> iterable) {
        for (T item : iterable) {
            list.add(item);
        }
    }
}

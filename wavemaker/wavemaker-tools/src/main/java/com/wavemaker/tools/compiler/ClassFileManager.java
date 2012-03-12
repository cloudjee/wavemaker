/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.compiler;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.security.SecureClassLoader;
import java.util.*;

import javax.tools.FileObject;
import javax.tools.ForwardingJavaFileManager;
import javax.tools.JavaFileObject;
import javax.tools.JavaFileObject.Kind;
import javax.tools.StandardJavaFileManager;
import javax.tools.StandardLocation;

import org.springframework.core.io.Resource;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.apache.commons.lang.ArrayUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ResourceFilter;
import com.wavemaker.tools.project.StudioFileSystem;

/**
 * {@link Resource}-based <tt>FileManager</tt> implementation that provides file reading and writing services to the
 * compiler.
 * 
 * @author Seung Lee
 * @author Jeremy Grelle
 */
public class ClassFileManager extends ForwardingJavaFileManager<StandardJavaFileManager> implements StandardJavaFileManager {

    private final Project project;

    private final List<Resource> sourceLocations = new ArrayList<Resource>();

    private final StudioFileSystem fileSystem;

    public ClassFileManager(StandardJavaFileManager standardManager, StudioFileSystem fileSystem, Project project) {
        super(standardManager);
        this.fileSystem = fileSystem;
        this.project = project;
        this.sourceLocations.add(project.getMainSrc());
        this.sourceLocations.addAll(project.getAllServiceSrcDirs());
    }

    @Override
    public JavaFileObject getJavaFileForOutput(Location location, String className, JavaFileObject.Kind kind, FileObject sibling) throws IOException {
        Assert.isTrue(hasLocation(location), location + " is not a known location to this FileManager");
        Assert.isTrue(location == StandardLocation.CLASS_OUTPUT, location + " is an invalid location for output by this FileManager.");
        Assert.isTrue(kind == Kind.CLASS, kind + " is an invalid kind for output by this FileManager.");
        return new ClassResourceObject(kind, this.project, getOutputClassResource(className));
    }

    @Override
    public FileObject getFileForOutput(Location location, String packageName, String relativeName, FileObject sibling) throws IOException {
        Assert.isTrue(hasLocation(location), location + " is not a known location to this FileManager");
        Resource outputFile = fromRelativePath(location, packageName, relativeName);
        if (outputFile == null) {
            return null;
        } else if (outputFile.getFilename().endsWith(Kind.SOURCE.extension)) {
            return new JavaResourceObject(Kind.SOURCE, this.project, outputFile);
        } else if (outputFile.getFilename().endsWith(Kind.CLASS.extension)) {
            return new ClassResourceObject(Kind.CLASS, this.project, outputFile);
        } else {
            return new GenericResourceFileObject(this.project, outputFile);
        }
    }

    @Override
    public JavaFileObject getJavaFileForInput(Location location, String className, Kind kind) throws IOException {
        Assert.isTrue(hasLocation(location), location + " is not a known location to this FileManager");
        Assert.isTrue(location == StandardLocation.SOURCE_PATH, location + " is an invalid location for Java source input by this FileManager.");
        Assert.isTrue(kind == Kind.SOURCE, kind + " is an invalid kind for Java source input by this FileManager.");
        Resource inputResource = getInputJavaSourceResource(className);
        return inputResource != null ? new JavaResourceObject(kind, this.project, getInputJavaSourceResource(className)) : null;
    }

    @Override
    public FileObject getFileForInput(Location location, String packageName, String relativeName) throws IOException {
        Assert.isTrue(hasLocation(location), location + " is not a known location to this FileManager");
        Resource inputFile = fromRelativePath(location, packageName, relativeName);
        if (inputFile == null) {
            return null;
        } else if (inputFile.getFilename().endsWith(Kind.SOURCE.extension)) {
            return new JavaResourceObject(Kind.SOURCE, this.project, inputFile);
        } else if (inputFile.getFilename().endsWith(Kind.CLASS.extension)) {
            return new ClassResourceObject(Kind.CLASS, this.project, inputFile);
        } else {
            return new GenericResourceFileObject(this.project, inputFile);
        }
    }

    @Override
    public ClassLoader getClassLoader(final Location location) {
        if (location == StandardLocation.CLASS_OUTPUT) {
            return new SecureClassLoader() {

                @Override
                protected Class<?> findClass(String name) throws ClassNotFoundException {
                    ClassResourceObject fileObj;
                    try {
                        fileObj = (ClassResourceObject) getJavaFileForOutput(location, name, Kind.CLASS, null);
                        byte[] b = fileObj.getBytes();
                        return super.defineClass(name, b, 0, b.length);
                    } catch (IOException e) {
                        throw new ClassNotFoundException("Could not load " + name);
                    }
                }
            };
        } else {
            return super.getClassLoader(location);
        }
    }

    @Override
    public boolean hasLocation(Location location) {
        return location instanceof StandardLocation;
    }

    @Override
    public boolean isSameFile(FileObject a, FileObject b) {
        return a.equals(b);
    }

    @Override
    public Iterable<JavaFileObject> list(Location location, String packageName, Set<Kind> kinds, final boolean recurse) throws IOException {

        if (location != StandardLocation.SOURCE_PATH && location != StandardLocation.CLASS_OUTPUT) {
            return super.list(location, packageName, kinds, recurse);
        }

        final Set<String> extensions = new HashSet<String>();
        for (Kind kind : kinds) {
            if (StringUtils.hasText(kind.extension)) {
                extensions.add(kind.extension.substring(1));
            } else {
                extensions.add("*");
            }
        }

        String path = packageName.replaceAll(".", "/") + "/";
        List<JavaFileObject> fileObjects = new ArrayList<JavaFileObject>();
        if (location == StandardLocation.SOURCE_PATH) {
            List<Resource> resources = new ArrayList<Resource>();
            for (Resource sourceLocation : this.sourceLocations) {
                Resource rootPath = sourceLocation.createRelative(path);
                resources.addAll(locateResources(extensions, rootPath, recurse));
            }
            for (Resource resource : resources) {
                fileObjects.add(new JavaResourceObject(Kind.SOURCE, this.project, resource));
            }
        } else if (location == StandardLocation.CLASS_OUTPUT) {
            Resource rootPath = this.project.getWebInfClasses().createRelative(path);
            List<Resource> resources = locateResources(extensions, rootPath, recurse);
            for (Resource resource : resources) {
                fileObjects.add(new ClassResourceObject(Kind.CLASS, this.project, resource));
            }
        }
        return fileObjects;
    }

    private Resource getInputJavaSourceResource(String className) {
        String resourcePath = className.replace(".", "/") + Kind.SOURCE.extension;
        return fromRelativePath(StandardLocation.SOURCE_PATH, "", resourcePath);
    }

    private Resource getOutputClassResource(String className) throws IOException {
        String resourcePath = className.replace(".", "/") + Kind.CLASS.extension;
        return this.project.getWebInfClasses().createRelative(resourcePath);
    }

    private List<Resource> locateResources(final Set<String> extensions, Resource rootPath, final boolean recurse) {
        final List<Resource> javaResources = new ArrayList<Resource>();
        javaResources.addAll(this.fileSystem.listChildren(rootPath, new ResourceFilter() {

            @Override
            public boolean accept(Resource resource) {
                String extension = StringUtils.getFilenameExtension(resource.getFilename());
                if (extension != null && (extensions.contains(extension) || extensions.contains("*"))) {
                    return true;
                } else if (extension == null && recurse) {
                    javaResources.addAll(locateResources(extensions, resource, recurse));
                }
                return false;
            }
        }));
        return javaResources;
    }

    private Resource fromRelativePath(Location location, String packageName, String relativeName) {
        String extension = StringUtils.getFilenameExtension(relativeName);
        if (extension != null) {
            try {
                if (location == StandardLocation.SOURCE_PATH) {
                    for (Resource sourceLocation : this.sourceLocations) {
                        Resource packagePath = sourceLocation.createRelative(packageName.replace(".", "/") + "/");
                        Resource relativeResource = packagePath.createRelative(relativeName);
                        if (relativeResource.exists()) {
                            return relativeResource;
                        }
                    }
                } else if (location == StandardLocation.CLASS_OUTPUT) {
                    Resource packagePath = this.project.getWebInfClasses().createRelative(packageName.replace(".", "/") + "/");
                    Resource relativeResource = packagePath.createRelative(relativeName);
                    if (relativeResource.exists()) {
                        return relativeResource;
                    }
                }
            } catch (IOException e) {
                throw new IllegalArgumentException("Invalid arguments supplied to locate resource " + relativeName + " within package " + packageName
                    + " for location " + StandardLocation.SOURCE_PATH, e);
            }
        }
        return null;
    }

    // Below methods are to satisfy StandardJavaFileManager contract in such a
    // way as to be compatible with the Eclipse compiler.
    @Override
    public Iterable<? extends JavaFileObject> getJavaFileObjects(File... files) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Iterable<? extends JavaFileObject> getJavaFileObjects(String... names) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Iterable<? extends JavaFileObject> getJavaFileObjectsFromFiles(Iterable<? extends File> files) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Iterable<? extends JavaFileObject> getJavaFileObjectsFromStrings(Iterable<String> names) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Iterable<? extends File> getLocation(Location location) {
        if (location == StandardLocation.CLASS_PATH) {
            try {
                File[] jars = this.fileSystem.getStudioWebAppRoot().createRelative("WEB-INF/lib/").getFile().listFiles(new FilenameFilter() {

                    @Override
                    public boolean accept(File dir, String name) {
                        return StringUtils.getFilenameExtension(name).equals("jar");
                    }
                });
                //If project lib rsource is null, it means that the project is not open yet.  Create project lib in that case.
                Resource projectLib = this.project.getProjectLib() == null ?
                        this.fileSystem.createProjectLib(this.project) : this.project.getProjectLib();
                File[] extraJars = projectLib.getFile().listFiles(new FilenameFilter() {

                    @Override
                    public boolean accept(File dir, String name) {
                        return StringUtils.getFilenameExtension(name).equals("jar");
                    }
                });

                File[] allJars = (File[]) ArrayUtils.addAll(jars, extraJars);
                return Arrays.asList(allJars);
            } catch (IOException e) {
                e.printStackTrace();
                throw new WMRuntimeException(e);
            }
        } else if (location != StandardLocation.SOURCE_PATH && location != StandardLocation.CLASS_OUTPUT) {
            Iterable<? extends File> result = this.fileManager.getLocation(location);
            return result;
        } else {
            return null;
        }
    }

    @Override
    public void setLocation(Location location, Iterable<? extends File> path) throws IOException {
        throw new UnsupportedOperationException();
    }
}

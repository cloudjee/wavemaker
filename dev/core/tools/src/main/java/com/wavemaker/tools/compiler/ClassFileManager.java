/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

import java.io.IOException;
import java.security.SecureClassLoader;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.tools.FileObject;
import javax.tools.ForwardingJavaFileManager;
import javax.tools.JavaFileObject;
import javax.tools.JavaFileObject.Kind;
import javax.tools.StandardJavaFileManager;
import javax.tools.StandardLocation;

import org.springframework.core.io.Resource;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ResourceFilter;
import com.wavemaker.tools.project.StudioConfiguration;

/**
 * File manager that manages compiled java class file
 * 
 * @author slee
 * @author Jeremy Grelle
 *
 */

public class ClassFileManager extends
        ForwardingJavaFileManager<StandardJavaFileManager> {

    private Project project;
    private Resource sourceLocation;
    private StudioConfiguration studioConfiguration;

    public ClassFileManager(StandardJavaFileManager standardManager, StudioConfiguration studioConfiguration, Project project, Resource sourceLocation) {
        super(standardManager);
        this.studioConfiguration = studioConfiguration;
        this.project = project;
        this.sourceLocation = sourceLocation;
    }


    @Override
    public JavaFileObject getJavaFileForOutput(Location location,
        String className, JavaFileObject.Kind kind, FileObject sibling) throws IOException {
    	Assert.isTrue(hasLocation(location), location+" is not a known location to this FileManager");
    	Assert.isTrue(location == StandardLocation.CLASS_OUTPUT, location+" is an invalid location for output by this FileManager.");
    	Assert.isTrue(kind == Kind.CLASS, kind+" is an invalid kind for output by this FileManager.");
        return new ClassResourceObject(kind, project, getOutputClassResource(className));
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
						throw new ClassNotFoundException("Could not load "+name);
					}
                }
            };
    	} else {
    		return super.getClassLoader(location);
    	}
    }
    
    private Resource getOutputClassResource(String className) throws IOException {
    	String resourcePath = className.replace(".", "/")+Kind.CLASS.extension;
    	return project.getWebInfClasses().createRelative(resourcePath);
    }
    

    @Override
	public FileObject getFileForInput(Location location, String packageName,
			String relativeName) throws IOException {
		// TODO Auto-generated method stub
		return super.getFileForInput(location, packageName, relativeName);
	}


	@Override
	public FileObject getFileForOutput(Location location, String packageName,
			String relativeName, FileObject sibling) throws IOException {
		// TODO Auto-generated method stub
		return super.getFileForOutput(location, packageName, relativeName, sibling);
	}


	@Override
	public JavaFileObject getJavaFileForInput(Location location,
			String className, Kind kind) throws IOException {
		Assert.isTrue(hasLocation(location), location+" is not a known location to this FileManager");
    	Assert.isTrue(location == StandardLocation.CLASS_OUTPUT, location+" is an invalid location for output by this FileManager.");
    	Assert.isTrue(kind == Kind.CLASS, kind+" is an invalid kind for output by this FileManager.");
		return super.getJavaFileForInput(location, className, kind);
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
	public Iterable<JavaFileObject> list(Location location, String packageName,
			Set<Kind> kinds, final boolean recurse) throws IOException {
		
		if (location != StandardLocation.SOURCE_PATH && location != StandardLocation.CLASS_OUTPUT) {
			return super.list(location, packageName, kinds, recurse);
		}
		
		final Set<String> extensions = new HashSet<String>();
		for (Kind kind : kinds) {
			if (StringUtils.hasText(kind.extension)) {
				extensions.add(kind.extension.substring(1));
			}
		}
		
		String path = packageName.replaceAll(".", "/")+"/";
		List<JavaFileObject> fileObjects = new ArrayList<JavaFileObject>();
		if (location == StandardLocation.SOURCE_PATH) {
			Resource rootPath = sourceLocation.createRelative(path);
			List<Resource> resources = locateResources(extensions, rootPath, recurse);
			for (Resource resource : resources) {
				fileObjects.add(new JavaResourceObject(Kind.SOURCE, project, resource));
			}
		} else if (location == StandardLocation.CLASS_OUTPUT) {
			Resource rootPath = project.getWebInfClasses().createRelative(path);
			List<Resource> resources = locateResources(extensions, rootPath, recurse);
			for (Resource resource : resources) {
				fileObjects.add(new ClassResourceObject(Kind.CLASS, project, resource));
			}
		}
		return fileObjects;
	}
	
	private List<Resource> locateResources(final Set<String> extensions, Resource rootPath, final boolean recurse) {
		final List<Resource> javaResources = new ArrayList<Resource>();
		javaResources.addAll(studioConfiguration.listChildren(rootPath, new ResourceFilter(){
			public boolean accept(Resource resource) {
				String extension = StringUtils.getFilenameExtension(resource.getFilename());
				if (extensions.contains(extension)){
					return true;
				} else if(extension == null && recurse) {
					javaResources.addAll(locateResources(extensions, resource, recurse));
				}
				return false;
			}
		}));
		return javaResources;
	}
	
	
}


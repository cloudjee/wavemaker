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

import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.StudioConfiguration;

import javax.tools.*;
import java.security.SecureClassLoader;
import java.io.IOException;
import java.util.Map;
import java.util.HashMap;

/**
 * File manager that manages compiled java class file
 * 
 * @author slee
 *
 */

public class ClassFileManager extends
        ForwardingJavaFileManager {

    private Map<String, ClassResourceObject> jclassObjectMap = new HashMap<String, ClassResourceObject>();
    private Project project;
    private StudioConfiguration studioConfiguration;

    public ClassFileManager(StandardJavaFileManager standardManager, Project project, StudioConfiguration studioConfiguration) {
        super(standardManager);
        this.project = project;
        this.studioConfiguration = studioConfiguration;
    }


    @Override
    public JavaFileObject getJavaFileForOutput(Location location,
        String className, JavaFileObject.Kind kind, FileObject sibling)
            throws IOException {
        ClassResourceObject jclassObject = new ClassResourceObject(className, kind, project, studioConfiguration);
        jclassObjectMap.put(className, jclassObject);
        return jclassObject;
    }

    @Override
    public ClassLoader getClassLoader(JavaFileManager.Location location) {
        return new SecureClassLoader() {
            @Override
            protected Class<?> findClass(String name)
                throws ClassNotFoundException {
                byte[] b = jclassObjectMap.get(name).getBytes();
                return super.defineClass(name, jclassObjectMap.get(name).getBytes(), 0, b.length);
            }
        };
    }

    public ClassResourceObject getClassResourceObject(String className) {
        return jclassObjectMap.get(className);  
    }

     public Map<String, ClassResourceObject> getClassResourceObjects() {
        return jclassObjectMap;  
    }
}


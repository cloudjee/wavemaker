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

import java.io.IOException;

import javax.tools.JavaFileObject;

import org.apache.commons.io.IOUtils;
import org.springframework.core.io.Resource;
import org.springframework.util.Assert;

import com.wavemaker.tools.project.Project;

/**
 * This class represents a compiled java class file
 * 
 * @author Seung Lee
 * @author Jeremy Grelle
 */
@Deprecated
public class ClassResourceObject extends ResourceJavaFileObject {

    /**
     * Represents a compiled class object
     * 
     * @param kind the kind of the resource, required to be CLASS in this case.
     * @param project the project containing the class
     * @param classFile the class file resource
     * @throws IOException
     */
    public ClassResourceObject(JavaFileObject.Kind kind, Project project, Resource classFile) throws IOException {
        super(kind, project, classFile);
        Assert.isTrue(isClassOrResource(kind), "Expected a to be a class or resource kind");
    }

    /**
     * Will be used by our file manager to get the byte code that can be put into memory to instantiate our class
     * 
     * @return compiled byte code
     */
    public byte[] getBytes() throws IOException {
        return IOUtils.toByteArray(this.resource.getInputStream());
    }

    @Override
    public boolean equals(Object obj) {
        return obj == this || obj instanceof ClassResourceObject && this.resource.equals(((ClassResourceObject) obj).resource);
    }
}

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

import org.springframework.core.io.Resource;
import org.springframework.util.Assert;

import com.wavemaker.tools.project.Project;

/**
 * This class represents a java class source file
 *
 * @author slee
 * @author Jeremy Grelle
 *
 */

public class JavaResourceObject extends AbstractResourceJavaFileObject {

    /**
     * Represents a Java source file
     * 
     * @param kind the kind of the resource, required to be CLASS in this case.
     * @param project the project containing the class
     * @param classFile the class file resource
     * @throws IOException 
     */
    public JavaResourceObject(Kind kind, Project project, Resource javaFile) throws IOException {
    	super(kind, project, javaFile);
    	Assert.isTrue(kind == Kind.SOURCE, "Expected a to be kind "+Kind.SOURCE);
    }
    
    @Override
    public Kind getKind() {
		return Kind.SOURCE;
	}
    
	@Override
	public boolean equals(Object obj) {
		return (obj == this ||
			    (obj instanceof ClassResourceObject && this.resource.equals(((ClassResourceObject) obj).resource)));
	}
}
 

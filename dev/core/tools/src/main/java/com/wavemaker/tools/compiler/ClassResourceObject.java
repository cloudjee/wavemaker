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

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.apache.commons.io.IOUtils;

import javax.tools.JavaFileObject;
import javax.tools.SimpleJavaFileObject;
import java.io.*;
import java.net.URI;
import java.net.MalformedURLException;

import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.StudioConfiguration;

/**
 * This class represents a compiled java class file
 * 
 * @author slee
 *
 */

public class ClassResourceObject extends SimpleJavaFileObject {
    private String className;
    private StudioConfiguration studioConfiguration;
    private Resource webInfClasses;
    private Resource outputClass;

    /**
    * Byte code created by the compiler will be stored in this
    * OutputStream.
    */
    protected OutputStream os;

    /**
    * Registers the compiled class object under URI
    * containing the class full name
    *
    * @param name
    *            Full name of the compiled class
    * @param kind
    *            Kind of the data. It will be CLASS in our case
    */
    public ClassResourceObject(String name, JavaFileObject.Kind kind, Project project, StudioConfiguration studioConfiguration) {
        super(URI.create("string:///" + name.replace('.', '/')
            + kind.extension), kind);
        this. className = name;
        this.webInfClasses = project.getWebInfClasses();
        this.studioConfiguration = studioConfiguration;
    }

    /**
    * Will be used by our file manager to get the byte code that
    * can be put into memory to instantiate our class
    *
    * @return compiled byte code
    */
    public byte[] getBytes() {
        byte[] bytes = null;
        try {
            bytes = IOUtils.toByteArray(outputClass.getInputStream());
            return bytes;
        } catch (IOException e) {
            e.printStackTrace();
        }

        return bytes;
    }

    /**
    * Will provide the compiler with an output stream that leads
    * to java class file.
    */
    @Override
    public OutputStream openOutputStream() throws IOException {
        //return bos;
        outputClass = webInfClasses.createRelative(className.replace('.', '/') + ".class");
        os = studioConfiguration.getOutputStream(outputClass);

        return os;
    }

    /**
    * Returns URI for the class object
    */
    public URI getURI() {
        return uri;
    }

    /**
    * Return Spring resource instance for the class object
    * @return resource
    */
    public Resource getResource() throws MalformedURLException {
        Resource resource = new UrlResource(uri);
        return resource;
    }

    public String getClassName() {
        return className;
    }
}


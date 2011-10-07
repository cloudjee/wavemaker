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

import javax.tools.JavaFileObject;
import javax.tools.SimpleJavaFileObject;
import java.net.URI;

/**
 * This class represents a java class source file
 *
 * @author slee
 *
 */

public class JavaResourceObject extends SimpleJavaFileObject {

    private CharSequence content;

    /**
    * This constructor will store the source code in the
    * internal "content" variable and register it as a
    * source code, using a URI containing the class full name
    *
    * @param className
    *            name of the public class in the source code
    * @param content
    *            source code to compile
    */
    public JavaResourceObject(String className,
        CharSequence content) {
        super(URI.create("string:///" + className.replace('.', '/')
            + JavaFileObject.Kind.SOURCE.extension), JavaFileObject.Kind.SOURCE);
        this.content = content;
    }

    /**
    * Answers the CharSequence to be compiled. It will give
    * the source code stored in variable "content"
    */
    @Override
    public CharSequence getCharContent(
        boolean ignoreEncodingErrors) {
        return content;
    }
}
 

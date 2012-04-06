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

import javax.lang.model.element.Modifier;
import javax.lang.model.element.NestingKind;
import javax.tools.JavaFileObject;

import com.wavemaker.tools.io.File;

/**
 * Adapts {@link com.wavemaker.toos.io.File}s to {@link javax.toosl.JavaFileObject}s.
 * 
 * @author Phillip Webb
 */
public class ResourceJavaFileObject extends ResourceFileObject implements JavaFileObject {

    private final Kind kind;

    public ResourceJavaFileObject(File file, Kind kind) {
        super(file);
        this.kind = kind;
    }

    @Override
    public Kind getKind() {
        return this.kind;
    }

    @Override
    public boolean isNameCompatible(String simpleName, Kind kind) {
        String name = simpleName + kind.extension;
        return kind.equals(getKind()) && getFile().getName().equals(name);
    }

    @Override
    public NestingKind getNestingKind() {
        return null;
    }

    @Override
    public Modifier getAccessLevel() {
        return null;
    }
}

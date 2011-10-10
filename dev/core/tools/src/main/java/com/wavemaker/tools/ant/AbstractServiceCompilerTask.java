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

package com.wavemaker.tools.ant;

import org.apache.tools.ant.types.ResourceCollection;
import org.apache.tools.ant.types.resources.Resources;

/**
 * Adds a dirset and a destination directory.
 * 
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public abstract class AbstractServiceCompilerTask extends CompilerTask {

    public AbstractServiceCompilerTask() {
        super();
    }

    public AbstractServiceCompilerTask(boolean init) {
        super(init);
    }

    private final Resources union = new Resources();

    public Resources getUnion() {
        return this.union;
    }

    public void add(ResourceCollection rc) {
        this.union.add(rc);
    }
}
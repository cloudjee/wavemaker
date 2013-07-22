/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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

package com.wavemaker.tools.deployment.cloudfoundry.archive;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.springframework.util.Assert;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;

/**
 * Decorator class that can be used to modify the contents of the selectd files
 * 
 * @author Seung Lee
 */
public class ModifiedContentBaseFolder {

    private final List<File> files;

    private List<ContentModifier> modifiers;

    /**
     * Create a new {@link ModifiedContentBaseFolder}.
     * 
     * @param webAppRoot the application base folder
     * @param modifiers modifiers that should be applied to the archive (can be null)
     */
    public ModifiedContentBaseFolder(Folder webAppRoot, Collection<? extends ContentModifier> modifiers) {
        Assert.notNull(webAppRoot, "Base folder must not be null");
        if (modifiers == null) {
            this.modifiers = Collections.emptyList();
        } else {
            this.modifiers = (List<ContentModifier>) modifiers;
        }

        this.files = webAppRoot.list().files().fetchAll();

    }

    public ModifiedContentBaseFolder(Folder webAppRoot, ContentModifier... modifiers) {
        this(webAppRoot, modifiers == null ? null : Arrays.asList(modifiers));
    }

    public void modify() {
        for (File file : this.files) {
            for (ContentModifier modifier : this.modifiers) {
                if (modifier.canModify(file)) {
                    file = modifier.modify(file);
                }
            }
        }
    }

}

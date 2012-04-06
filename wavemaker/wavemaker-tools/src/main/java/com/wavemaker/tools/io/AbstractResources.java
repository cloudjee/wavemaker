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

package com.wavemaker.tools.io;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.util.Assert;

/**
 * Abstract base for {@link Resources} implementations.
 * 
 * @author Phillip Webb
 */
public abstract class AbstractResources<T extends Resource> implements Resources<T> {

    @Override
    public void delete() {
        for (T resource : this) {
            resource.delete();
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public Resources<T> moveTo(Folder folder) {
        Assert.notNull(folder, "Folder must not be null");
        List<T> movedResources = new ArrayList<T>();
        for (T resource : this) {
            movedResources.add((T) resource.moveTo(folder));
        }
        return new ResourcesCollection<T>(movedResources);
    }

    @Override
    @SuppressWarnings("unchecked")
    public Resources<T> copyTo(Folder folder) {
        Assert.notNull(folder, "Folder must not be null");
        List<T> copiedResources = new ArrayList<T>();
        for (T resource : this) {
            copiedResources.add((T) resource.copyTo(folder));
        }
        return new ResourcesCollection<T>(copiedResources);
    }

    @Override
    public void performOperation(ResourceOperation<T> operation) {
        for (T resource : this) {
            operation.perform(resource);
        }
    }

    @Override
    public List<T> fetchAll() {
        List<T> all = new ArrayList<T>();
        for (T resource : this) {
            all.add(resource);
        }
        return Collections.unmodifiableList(all);
    }
}

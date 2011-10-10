/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.json.type;

/**
 * The TypeDefinition class holds type information about individual types in the system. Each instance also allows for
 * new Objects to be created, and for transformations to and from JSON.
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
public interface TypeDefinition {

    /**
     * Checks if the TypeDefinition can be accessed through the {@link com.wavemaker.runtime.service.LiveDataService}
     * APIs.
     * 
     * @return True iff this type can be accessed through the LiveService interface.
     */
    public boolean isLiveService();

    /**
     * Get the unique type name of this TypeDefinition.
     * 
     * @return The type name.
     */
    public String getTypeName();

    /**
     * Get a short name for this type (for instance, the typeName might be java.lang.String, while the short name might
     * be String).
     * 
     * @return The type short name.
     */
    public String getShortName();

    /**
     * Return a new instance of the objects associated with this type.
     * 
     * @param args Any arguments associated with this newInstance. If the method doesn't take them, or they're the wrong
     *        type, they should be ignored, or if they're required, an exception should be thrown.
     * @return The new, unpopulated instance.
     */
    public Object newInstance(Object... args);
}
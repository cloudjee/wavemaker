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

package com.wavemaker.tools.deployment.cloudfoundry.archive;

import java.io.IOException;
import java.io.InputStream;

import org.cloudfoundry.client.lib.archive.ApplicationArchive;

/**
 * Strategy that allows the {@link ApplicationArchive} to be modified.
 * 
 * @author Phillip Webb
 * @see ModifiedContentApplicationArchive
 */
public interface ContentModifier {

    /**
     * Determine if the {@link #modify modify} method should be called for the given entry.
     * 
     * @param entry the application entry
     * @return <tt>true</tt> if the {@link #modify modify} method should be called
     */
    public boolean canModify(ApplicationArchive.Entry entry);

    /**
     * Modify {@link ApplicationArchive.Entry#getInputStream() content} of the given entry. Implementations should
     * return a new {@link InputStream} containing the modified content.
     * 
     * @param inputStream an {@link InputStream} containing the existing content. The stream will be closed by the
     *        caller
     * @return the modified input stream.
     * @throws IOException
     */
    public InputStream modify(InputStream inputStream) throws IOException;

}

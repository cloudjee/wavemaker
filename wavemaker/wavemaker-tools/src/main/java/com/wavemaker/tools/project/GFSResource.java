/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.project;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;

/**
 * Exposes resources stored in a Mongo GridFS database as Spring Resources.
 * 
 * @deprecated prefer the new Wavemaker {@link Resource} abstraction.
 */
@Deprecated
public class GFSResource extends ResourceAdapter {

    public GFSResource(Folder rootFolder, String path) {
        super(rootFolder, path);
    }

    @Override
    protected ResourceAdapter newResourceAdapter(Folder rootFolder, String path) {
        return new GFSResource(rootFolder, path);
    }

    @Override
    public URL getURL() {
        try {
            return getURI().toURL();
        } catch (MalformedURLException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Override
    public URI getURI() {
        try {
            return new URI("gfs://" + getPath());
        } catch (URISyntaxException e) {
            throw new WMRuntimeException(e);
        }
    }
}

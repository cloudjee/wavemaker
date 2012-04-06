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

package com.wavemaker.common.util;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;

/**
 * Helper class for transitioning from using {@link File} to {@link Resource}
 * 
 * @author Jeremy Grelle
 */
public abstract class ConversionUtils {

    private ConversionUtils() {
    }

    public static List<File> convertToFileList(List<Resource> resources) {
        List<File> files = new ArrayList<File>();
        for (Resource resource : resources) {
            try {
                files.add(resource.getFile());
            } catch (IOException ex) {
                throw new WMRuntimeException(ex);
            }
        }
        return files;
    }

    public static List<Resource> convertToResourceList(List<File> files) {
        List<Resource> resources = new ArrayList<Resource>();
        for (File file : files) {
            String path = file.getAbsolutePath();
            if (file.isDirectory() && !path.endsWith("/")) {
                path += "/";
            }
            resources.add(new FileSystemResource(path));
        }
        return resources;
    }
}

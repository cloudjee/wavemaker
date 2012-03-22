/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.project.upgrade;

import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.commons.io.IOUtils;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;

/**
 * Generic upgrade task; reads a file from the template, and writes it into the current project. The file and any
 * messages are provided through Spring properties. No backup (beyond the automatic zip) is made of the project files.
 * 
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class UpgradeTemplateFile implements UpgradeTask {

    private String relativePath;

    private String message;

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        if (this.relativePath == null) {
            throw new WMRuntimeException("No file provided");
        }

        try {
            File localFile = project.getRootFolder().getFile(this.relativePath);

            InputStream resourceStream = this.getClass().getClassLoader().getResourceAsStream(ProjectManager._TEMPLATE_APP_RESOURCE_NAME);
            ZipInputStream resourceZipStream = new ZipInputStream(resourceStream);

            ZipEntry zipEntry = null;

            while ((zipEntry = resourceZipStream.getNextEntry()) != null) {
                if (this.relativePath.equals(zipEntry.getName())) {
                    Writer writer = localFile.getContent().asWriter();
                    IOUtils.copy(resourceZipStream, writer);
                    writer.close();
                }
            }

            resourceZipStream.close();
            resourceStream.close();
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }

        if (this.message != null) {
            upgradeInfo.addMessage(this.message);
        }
    }

    /**
     * The relative path (relative to the project root) for the file to upgrade.
     */
    public void setFile(String file) {
        this.relativePath = file;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

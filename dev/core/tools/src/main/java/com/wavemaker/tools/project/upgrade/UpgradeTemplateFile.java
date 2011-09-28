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

package com.wavemaker.tools.project.upgrade;

import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.commons.io.IOUtils;
import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;

/**
 * Generic upgrade task; reads a file from the template, and writes it into the
 * current project. The file and any messages are provided through Spring
 * properties. No backup (beyond the automatic zip) is made of the project
 * files.
 * 
 * @author small
 * @author Jeremy Grelle
 */
public class UpgradeTemplateFile implements UpgradeTask {

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker
	 * .tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
	 */
	public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

		if (null == relativePath) {
			throw new WMRuntimeException("No file provided");
		}

		try {
			Resource localFile = project.getProjectRoot().createRelative(
					relativePath);

			InputStream resourceStream = this
					.getClass()
					.getClassLoader()
					.getResourceAsStream(
							ProjectManager._TEMPLATE_APP_RESOURCE_NAME);
			ZipInputStream resourceZipStream = new ZipInputStream(
					resourceStream);

			ZipEntry zipEntry = null;

			while ((zipEntry = resourceZipStream.getNextEntry()) != null) {
				if (relativePath.equals(zipEntry.getName())) {
					Writer writer = project.getWriter(localFile);
					IOUtils.copy(resourceZipStream, writer);
					writer.close();
				}
			}

			resourceZipStream.close();
			resourceStream.close();
		} catch (IOException e) {
			throw new WMRuntimeException(e);
		}

		if (null != message) {
			upgradeInfo.addMessage(message);
		}
	}

	// bean properties
	private String relativePath;
	private String message;

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

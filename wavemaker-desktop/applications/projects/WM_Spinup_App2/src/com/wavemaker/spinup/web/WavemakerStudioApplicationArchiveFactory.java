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

package com.wavemaker.spinup.web;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.io.FileInputStream;
import java.util.zip.ZipFile;
import java.net.URL;

import javax.servlet.ServletContext;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.cloudfoundry.client.lib.archive.ApplicationArchive;
import org.cloudfoundry.client.lib.archive.ZipApplicationArchive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.context.ServletContextAware;
import org.springframework.web.context.support.ServletContextResource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.cloudfoundry.spinup.ApplicationArchiveFactory;
import com.wavemaker.tools.cloudfoundry.CloudFoundryUtils;

/**
 * {@link ApplicationArchiveFactory} used to access the wavemaker studio WAR.
 */
@Component
public class WavemakerStudioApplicationArchiveFactory implements ApplicationArchiveFactory, ServletContextAware {

	private final Log logger = LogFactory.getLog(getClass());

	private File studioWarFile;

	private VersionProvider versionProvider;

	@Override
	public void setServletContext(ServletContext servletContext) {
		InputStream reader = null;
		OutputStream out = null;
		String path = null;
		int ByteRead,ByteWritten=0;
		try {			
			String version = this.versionProvider.getVersion(servletContext);
			String studioFileName = "wavemaker-studio-" + version + ".war";
			String uploadDirName = servletContext.getRealPath("/resources/studioWars");
			File uploadDir = new File(uploadDirName);
			uploadDir.mkdirs();
			File localStudioWar =  new File(uploadDir, studioFileName); 		
			byte[] buffer = new byte[5242880];  //5mb
			
			String customURL = CloudFoundryUtils.getEnvironmentVariable("studio_war_url", "");
			if(customURL.isEmpty()){
				path = "http://community.wavemaker.com/Studio/" + studioFileName; 
			}
			else{
				path = customURL;
			}
			if (this.logger.isDebugEnabled()) {
				this.logger.debug("Using studio resource " + path);
			}
			URL url  = new URL(path);
			url.openConnection();
			reader = url.openStream();			
			out = new BufferedOutputStream(new FileOutputStream(localStudioWar));
			while ((ByteRead = reader.read(buffer)) != -1) {
				out.write(buffer, 0, ByteRead);
				ByteWritten += ByteRead;
			}
			
			this.studioWarFile = localStudioWar; 
			
			ServletContextResource studioResource = new ServletContextResource(servletContext, studioWarFile.getPath());
			Assert.state(studioResource.exists(), "Studio resource '" +  studioWarFile.getPath() + "' does not exist");
			Assert.state(studioResource.getFile() != null, "Studio resource '" +  studioWarFile.getPath() + "' cannot be accessed as a File");
			System.out.println("Studio War is " +  studioWarFile.getPath());
			
		} catch (IOException e) {
			e.printStackTrace();
			throw new IllegalStateException(e);
		}
		catch (Exception e){
			throw new WMRuntimeException(e);
		}
	
		finally {
			try {
				reader.close();
				out.close();
			}
			catch (IOException e) {
				e.printStackTrace();
			}}
    }

    @Override
    public ApplicationArchive getArchive() throws Exception {
        return new WavemakerStudioApplicationArchive(new ZipFile(this.studioWarFile));
    }

    @Override
    public void closeArchive(ApplicationArchive archive) throws Exception {
        ((WavemakerStudioApplicationArchive) archive).close();
    }

    @Autowired
    public void setVersionProvider(VersionProvider versionProvider) {
        this.versionProvider = versionProvider;
    }

    private static class WavemakerStudioApplicationArchive extends ZipApplicationArchive {

        private final ZipFile zipFile;

        public WavemakerStudioApplicationArchive(ZipFile zipFile) {
            super(zipFile);
            this.zipFile = zipFile;
        }

        public void close() throws IOException {
            this.zipFile.close();
        }
    }

}

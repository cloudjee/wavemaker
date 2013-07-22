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
package com.wavemaker.spinup.web;

import java.util.Scanner;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.ServletContext;

import org.springframework.stereotype.Component;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.wavemaker.tools.io.local.LocalFolder;
import com.wavemaker.tools.io.zip.ZipArchive;

@Component
public class VersionProvider {

        private final Log log = LogFactory.getLog(VersionProvider.class);

        private String studioVersion = null;

        public String getVersion(ServletContext servletContext) throws IOException {
        	String uploadDirName = servletContext.getRealPath(SpinupConstants.STUDIOD_UPLOAD_DIR);
        	if(studioVersion != null){
        		return this.studioVersion;
        	}
        	ZipArchive studioZip = new ZipArchive(new LocalFolder(uploadDirName).getFile(SpinupConstants.STUDIO_FILE));
        	InputStream configjs = studioZip.getFile("app/config.js").getContent().asInputStream();
        	Scanner s = new Scanner(configjs);
        	while(s.hasNext()){
        		String ln = s.nextLine();
        		if(ln.contains("studioVersion:")){
        			this.studioVersion = ln.substring(ln.indexOf(":")+1).replace(",","").replace("'","").trim();
        			break;
        		}
        	}
        	if (log.isInfoEnabled()) {
        		log.info("*** Studio version is: " + this.studioVersion + "***");
        	}
        	configjs.close();
        	return this.studioVersion;

        }
}
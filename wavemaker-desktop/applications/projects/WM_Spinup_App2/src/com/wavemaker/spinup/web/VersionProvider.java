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

        private final Log logger = LogFactory.getLog(getClass());

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
        	if (this.logger.isInfoEnabled()) {
        		this.logger.info("Studio version is: " + this.studioVersion);
        	}
        	configjs.close();
        	return this.studioVersion;

        }
}
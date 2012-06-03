
package com.wavemaker.spinup.web;

import java.util.Scanner;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.ServletContext;

import org.springframework.stereotype.Component;
import org.springframework.web.context.support.ServletContextResource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.local.LocalFolder;
import com.wavemaker.tools.io.zip.ZipFolder;

@Component
public class VersionProvider {

	private final Log logger = LogFactory.getLog(getClass());

	private String studioVersion = null;

	public String getVersion(ServletContext servletContext) throws IOException {
		String uploadDirName = servletContext.getRealPath(SpinupConstants.STUDIOD_UPLOAD_DIR);
		if(studioVersion != null){
			return this.studioVersion;
		}
		ZipFolder studioZip = new ZipFolder(new LocalFolder(uploadDirName).getFile(SpinupConstants.STUDIO_FILE));
		InputStream configjs = studioZip.getFile("app/config.js").getContent().asInputStream();
		Scanner s = new Scanner(configjs);
		while(s.hasNext()){
			String ln = s.nextLine();
			if(ln.contains("studioVersion:")){
				this.studioVersion = ln.substring(ln.indexOf(":")+1).replace(",","").replace("'","").trim();
				break;
			}
		}
		if (this.logger.isDebugEnabled()) {
			this.logger.debug("Studio version is: " + this.studioVersion);	
		}
		return this.studioVersion;

	}
}

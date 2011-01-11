/*
 * Copyright (C) 2007-2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 
package com.wavemaker.studio;

import java.io.IOException;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.license.LicenseProcessor;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.project.StudioConfiguration;
import org.springframework.web.multipart.MultipartFile;

import com.wavemaker.runtime.server.FileUploadResponse;

@HideFromClient
public class LicensingService {

    // bean properties
    private RuntimeAccess runtimeAccess;
    private StudioConfiguration studioConfiguration;

    public RuntimeAccess getRuntimeAccess() {
        return runtimeAccess;
    }
    public void setRuntimeAccess(RuntimeAccess runtimeAccess) {
        this.runtimeAccess = runtimeAccess;
    }
    public StudioConfiguration getStudioConfiguration() {
        return studioConfiguration;
    }
    public void setStudioConfiguration(StudioConfiguration studioConfiguration) {
        this.studioConfiguration = studioConfiguration;
    }

    @ExposeToClient
    public int getLicenseExpiration() {
	    //return 6; // If a value > 30 is returned, we show no license information.  If user has full license, returning 31, 3000000 or any other large numbers will have the same effect
        return LicenseProcessor.getLicenseExpiration();
    }

    @ExposeToClient
    public FileUploadResponse uploadLicense(
					    MultipartFile file) throws IOException {
	String result = LicenseProcessor.installLicense(file);
    	file.getInputStream().close();
        FileUploadResponse ret = new FileUploadResponse();
	ret.setPath("private");
	if (result != "OK")
	    ret.setError(result);
	ret.setWidth("");
	ret.setHeight("");
	return ret;
    }


    //private String processLicense(InputStream input) throws IOException {
	/* these lines are only here to verify that the input stream your getting is valid; Remove them any time. */
    	/*File tmpDir = new File("/Users/mkantor/Downloads");
    	File outputFile = new File(tmpDir, "tmp.txt");
	System.out.println("OUTPUT:" + outputFile.getAbsolutePath());
    	FileOutputStream fos = new FileOutputStream(outputFile);
    	IOUtils.copy(input, fos);
    	fos.close();

	return "OK";
    }*/
}

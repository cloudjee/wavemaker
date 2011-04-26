/*
 * Copyright (C) 2010-2011 WaveMaker Software, Inc.
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
 import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.runtime.server.DojoFileUploaderResponse;
import com.wavemaker.common.util.IOUtils;

import java.util.Random;
import java.util.Vector;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileInputStream;

import java.io.IOException;
import org.apache.log4j.Logger;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.wavemaker.runtime.server.ParamName;
import com.wavemaker.tools.project.ProjectManager; 
import com.wavemaker.runtime.server.FileUploadResponse;

import java.util.Hashtable;
import java.util.zip.*;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;

import com.wavemaker.common.WMRuntimeException;

import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.common.util.IOUtils;

/**
 * This is a client-facing service class.  All
 * public methods will be exposed to the client.  Their return
 * values and parameters will be passed to the client or taken
 * from the client, respectively.  This will be a singleton
 * instance, shared between all requests. 
 */
public class ResourceFileService {
    protected final Logger logger = Logger.getLogger(getClass());

        private ProjectManager projectManager;

        // Used by spring
    @HideFromClient
    public void setProjectManager(ProjectManager manager) {
	  this.projectManager = manager;
    }

    @HideFromClient
    protected File getProjectDir() {
        File projectDir = this.projectManager.getCurrentProject().getWebAppRoot();
        return projectDir;
    }

    /* Gets the project's resources folder; initializes it if it doesn't yet exist */
    @HideFromClient
    private File getResourcesDir() {
    	File dir = new File(getProjectDir(), "resources");
    	if (!dir.exists()) {
    		dir.mkdir();
    		new File(dir, "images").mkdir();
    		new File(dir, "images/imagelists").mkdir();
    		new File(dir, "images/buttons").mkdir();
    		new File(dir, "images/logos").mkdir();
    		new File(dir, "javascript").mkdir();
    		new File(dir, "css").mkdir();
    		new File(dir, "htmlcontent").mkdir();
    	}
    	return dir;
    }



    /* Respond's to user request to download a resource file */
    public DownloadResponse downloadFile(@ParamName(name="folder") String folderpath,
    		@ParamName(name="filename")
    		String filename) throws IOException {


    	boolean isZip = false;
    	File resourceDir = this.getResourcesDir();
    	File parentDir = new File(resourceDir, folderpath);
    	File localFile = new File(parentDir, filename);
    	if (localFile.isDirectory()) {
    		localFile = com.wavemaker.tools.project.ResourceManager.createZipFile(localFile,projectManager.getTmpDir());
    		if (localFile == null)
    			return (DownloadResponse)null;
    		isZip = true;
    		filename = localFile.getName();
    	}

    	return com.wavemaker.tools.project.ResourceManager.downloadFile(localFile, filename, isZip);

    }
    
  
    /* Respond's to user's request to rename/move a file.  Will append a number to the name if there is already a file with the requested name */
    public String renameFile(@ParamName(name="from") String from,
    		@ParamName(name="to") String to,
    		@ParamName(name="overwrite") boolean overwrite)
    {
    	File resourceDir = this.getResourcesDir();

    	File dest =  new File(resourceDir, to);
    	if (!overwrite) {
	    int lastIndexOfPeriod = to.lastIndexOf(".");
	    String to1 = (lastIndexOfPeriod != -1) ? to.substring(0, to.lastIndexOf(".")) : to;
	    String to_ext = (lastIndexOfPeriod != -1) ? to.substring(to.lastIndexOf(".") + 1) : "";
    		for (int i = 0; i < 1000 && dest.exists(); i++)
		    dest= new File(resourceDir, to1 + i + ((lastIndexOfPeriod != -1) ? "." : "") + to_ext);
	}

    	try {
    		File f = new File(resourceDir, from);
    		if (f.renameTo(dest))
    			return dest.getName();
    	} catch (Exception e) {}
    	return "";
    }
     
    /* Moves a file that was uploaded to the tmp folder to the requested destination.  All uploads go to tmp folder */
    public String moveNewFile(@ParamName(name="from") String from,
			      @ParamName(name="to") String to,
			      @ParamName(name="overwrite") boolean overwrite)
    {
    	File resourceDir = this.getResourcesDir();

    	File dest =  new File(resourceDir, to);

	if (!overwrite) {
	    String to1 = (to.lastIndexOf(".") != -1) ? to.substring(0, to.lastIndexOf(".")) : to;
	    String to_ext = (to.lastIndexOf(".") != -1) ? to.substring(to.lastIndexOf(".") + 1) : "";
	    for (int i = 0; i < 1000 && dest.exists(); i++)
		    dest= new File(resourceDir, to1 + i + "." + to_ext);
	}
    	try {
	    File f = new File(projectManager.getTmpDir(), from);
	    if (f.renameTo(dest)) {
		return dest.getName();
	    }
    	} catch (Exception e) {}
    	return "";
    }

    /* Create a folder; name should have the full relative path within the resources folder*/
    public boolean createFolder(@ParamName(name="name") String name)
      {
        File resourceDir = this.getResourcesDir();
        try {
        File f = new File(resourceDir, name);
        return f.mkdir();
        } catch (Exception e) {return false;}
      }
  
    /* Delete the file; name should be the full relative path within resources folder */
   public boolean deleteFile(@ParamName(name="name") String name)
      {
       File resourceDir = this.getResourcesDir();
       try {
	   File f = new File(resourceDir, name);
	   IOUtils.deleteRecursive(f);
	   return !f.exists();
       } catch (Exception e) {
	   e.printStackTrace();
	   return false;
       }
      }                                   


   /* Send the client a datastruct listing all contents of the resources folder.
    * WARNING: At some point we may want to support larger projects by NOT sending it all at once
    */  
    public Hashtable getResourceFolder() {
       File resourceDir = this.getResourcesDir();
       Hashtable P = new Hashtable();
       P.put("files", com.wavemaker.tools.project.ResourceManager.getListing(resourceDir, new File(resourceDir, ".includeJars")));
         P.put("file", resourceDir.getName());
	 P.put("type", "folder");
         return P; 
    }

    public FileUploadResponse uploadFile(@ParamName(name="file") MultipartFile file, String path) throws IOException {
        //System.out.println("UPLOAD FILE");
        //System.out.println("UPLOAD FILE:" + file.getOriginalFilename());
        FileUploadResponse ret = new FileUploadResponse();
        try {
            File dir = new File(getResourcesDir(), path);
            File outputFile = new File(dir, file.getOriginalFilename().replaceAll("[^a-zA-Z0-9.-_ ]",""));
            //System.out.println("OUTPUT FILE:" + outputFile.getAbsolutePath());
            FileOutputStream fos = new FileOutputStream(outputFile);            
            IOUtils.copy(file.getInputStream(), fos);
            file.getInputStream().close();
            fos.close();
            ret.setPath(outputFile.getAbsolutePath());
            ret.setError("");
            ret.setWidth("");
            ret.setHeight("");

        } catch(Exception e) {
            ret.setError(e.getMessage());
        }
        return ret;
    }

    /*
    public boolean unzipFile(@ParamName(name="file") String file) {
      File zipfile = new File(this.getResourcesDir().getAbsolutePath() + "/" + file);
      File zipfolder = com.wavemaker.tools.project.ResourceManager.unzipFile(zipfile);
      return (zipfolder.exists() && zipfolder.isDirectory());
    }
*/
    /**
     * Unzips a zip file in the tmp folder and moves it to the specified location.
     * NOTE: Will not overwrite an existing folder at that location; instead will rename to avoid collision
     * NOTE: 
     * @see ProjectManager#openProject(String)
     * @return An OpenProjectReturn object containing the current web path, as
     *         well as any upgrades that were performed.
     */
    public boolean unzipAndMoveNewFile(@ParamName(name="file") String path) {
        File zipfile = new File(getResourcesDir(), path);
        File zipfolder = com.wavemaker.tools.project.ResourceManager.unzipFile(zipfile);
      if  (zipfolder.exists() && zipfolder.isDirectory()) {
        /*

	  File dest =  new File(new File(this.getResourcesDir(), to), zipfolder.getName());

	  for (int i = 0; i < 1000 && dest.exists(); i++) {
	      dest= new File(dest.getParent(), zipfolder.getName() + i);
	  }
	  zipfolder.renameTo(dest);
        */
	  return true;
      } else {
	  return false;
      }
    }

    public boolean changeClassPath(String inPath, boolean isInClassPath) {
	  try {
	      if (inPath.indexOf("/") == 0) inPath = inPath.substring(1);
	      String inFileName = inPath.substring(inPath.lastIndexOf("/") != -1 ? inPath.lastIndexOf("/")+1 : 0);
	      File f = new File(this.getResourcesDir(), ".includeJars");
	      String fileContents;
	      StringBuffer newFile = new StringBuffer("");
	      String[] fileList;

	      if (f.exists()) 
		  fileContents = IOUtils.read(f);
	      else
		  fileContents = "";
	      fileList = fileContents.split("\n");

	      boolean found = false;
	      for (int i = 0; i < fileList.length; i++) {
		  boolean addFile = true;
		  if (inPath.equals(fileList[i])) {
		      if (isInClassPath) {
			  found = true;
		      } else {
			  addFile = false;
		      }
		  }
		  if (addFile) {
		      if (newFile.length() > 0) newFile.append("\n");
		      newFile.append(fileList[i]);
		  }
		  
	      }

	      File destFile = new File(getProjectDir(), "WEB-INF/lib/" +  inFileName);
	      if (isInClassPath && !found) {
		      if (newFile.length() > 0) newFile.append("\n");
		      newFile.append(inPath);
		      File sourceFile = new File(this.getResourcesDir(), inPath);
		      IOUtils.copy(sourceFile,destFile);
	      } else if (!isInClassPath) {
		      destFile.delete();
	      }
	      
	      IOUtils.write(f,newFile.toString());
		  
	  } catch(Exception e) {
	      e.printStackTrace();
	      return false;
	  }
	  return true;
    }

}

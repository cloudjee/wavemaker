/*
 *  Copyright (C) 2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Client Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.tools.project;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Hashtable;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import org.springframework.web.multipart.MultipartFile;

import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.common.util.IOUtils;


public class ResourceManager {
	
	public static DownloadResponse downloadFile(File f, String filename, boolean isZip) throws IOException {
	    DownloadResponse ret = new DownloadResponse();
	    
	    // Setup the DownloadResponse
	    FileInputStream fis = new FileInputStream(f);
	    ret.setContents(fis);
	    ret.setContentType((isZip) ? "application/zip" : "application/unknown");
	    ret.setFileName(filename);	    
	    return ret;
	}
	
	  public static File createZipFile(File f, File tmpDir) 
	    {

		File destFile = new File(tmpDir, f.getName() + ".zip");
	     try {

	         FileOutputStream dest = new 
		     FileOutputStream(destFile.toString());
	         ZipOutputStream out = new ZipOutputStream(new 
							   BufferedOutputStream(dest));

		 addToZipStream(f,out, "");

	         out.close();
		 return destFile;
	     } catch(Exception e) {
		 e.printStackTrace();
	     }  
	     return (File)null;
	    }

	    public static void addToZipStream(File f, ZipOutputStream out,String path) 
	    {
		 System.out.println("add to stream: " + path + "/" + f.getName());

	     final int BUFFER = 2048;
	     byte data[] = new byte[BUFFER];
	     BufferedInputStream origin = null;

	     // get a list of files from current directory
	     File files[] = f.listFiles();
	     
	     for (int i=0; i<files.length; i++) {
		 if (files[i].getName().startsWith(".")) continue;
		 if (files[i].isDirectory()) {
		     System.out.println("PATH:" + path + ", NAME: " + f.getName());
		     addToZipStream(files[i],out,  path + "/" + f.getName());
		 } else {
		     try {
			 FileInputStream fi = new 
			     FileInputStream(files[i].toString());

			 origin = new 
			     BufferedInputStream(fi, BUFFER);
			 //ZipEntry entry = new ZipEntry(files[i].toString());
			 ZipEntry entry = new ZipEntry(path + "/" + f.getName() + "/" + files[i].getName());
			 System.out.println("Adding: "+path +"/"+ f.getName() + "/" + files[i].getName());
			 out.putNextEntry(entry);
			 int count;
			 while((count = origin.read(data, 0, 
						    BUFFER)) != -1) {
			     out.write(data, 0, count);
			 }
			 origin.close();
		     } catch(Exception e) {}
		 }
	     }
	    }
	
	    static public String uploadFile(MultipartFile file, File tmpDir) throws IOException {
	        DownloadResponse ret = new DownloadResponse();

	        File outputFile = new File(tmpDir, file.getOriginalFilename());
	        //System.out.println("writing the content of uploaded file to: "+outputFile);                                                                                      

	        FileOutputStream fos = new FileOutputStream(outputFile);
	        IOUtils.copy(file.getInputStream(), fos);
	        file.getInputStream().close();
	        fos.close();
	        return file.getOriginalFilename();
	    }
	    
          static public Hashtable[] getListing(File curdir, File jarListFile) {
	        File[] listing = curdir.listFiles(
	          new java.io.FilenameFilter() {
	            public boolean accept(File dir, String name) {
	              return (name.indexOf(".") != 0);
	            }
	          });
	        Hashtable[] myfiles = new Hashtable[listing.length];
	        for (int i = 0; i < listing.length; i++) {
	          Hashtable F = new Hashtable();
	          String name = listing[i].getName();
	          F.put("file", name);
	          myfiles[i] = F;
	          if (listing[i].isDirectory()) {
	            F.put("type", "folder");
	            F.put("files", getListing(listing[i], jarListFile));    
	          } else {     
	            F.put("type", "file");
		    if (name.endsWith(".jar"))
			F.put("isInClassPath", isJarInClassPath(listing[i], jarListFile));
	            //F.mFiles = new MyFile[0];
	          }     
	        }  
	        return myfiles;
	  }                             
         static public boolean isJarInClassPath(File resourceFile, File jarListFile) {
		if (!jarListFile.exists()) return false;
		try {
		    String[] fileList = IOUtils.read(jarListFile).split("\n");
		    for (int i = 0; i < fileList.length; i++) {
			if (resourceFile.equals(new File(jarListFile.getParentFile(), fileList[i])))
			    return true;
		    }
		} catch(Exception e) {
		    e.printStackTrace();
		}
		return false;
	 }

    /*
    static public void deleteFolderContents(File folder) {
        File[] listing = folder.listFiles();
        for(int i = 0; i < listing.length; i++) {
          if (listing[i].isDirectory())
            deleteFolderContents(listing[i]);
          listing[i].delete();
        }                       
      }

    public static String getTextInFile(File f) {
    	if (f == null)
	    throw new IllegalArgumentException("File not specified");
    	if (!f.exists())
	    throw new IllegalArgumentException("File " + f.toString() + " does not exist");
    	if (!f.isFile())
	    throw new IllegalArgumentException("Invalid file: " + f.toString());


    	StringBuffer sb = new StringBuffer();
    	try {
    		BufferedReader br = new BufferedReader(new FileReader(f));
    		String s = null;
    		int indx = -1;
    		while( (s = br.readLine()) != null)     			
    			sb.append(s + "\n");    		
    	} catch(FileNotFoundException fex) {
    		fex.printStackTrace();
    	} catch(IOException ioex) {
    		ioex.printStackTrace();
    	}

    	return sb.toString();
    }
    */
    public static void ReplaceTextInFile(File f, String findText, String replaceText) {
        try {
	    String newtext = IOUtils.read(f);
	    newtext = newtext.replaceAll(findText, replaceText);
	    IOUtils.write(f,newtext);
	} catch(Exception e) {
	    System.out.println("ERROR:" + e.getMessage());
	    e.printStackTrace();	   
	}
    }
	
	public static File unzipFile(File zipfile) {
		int BUFFER = 2048;


	      String zipname = zipfile.getName();
	      int extindex =  zipname.lastIndexOf(".") ;
	      String folderName;
	      if (extindex == -1)
		  folderName = zipname + "_folder";
	      else
		  folderName = zipname.substring(0,  extindex);

	      File zipFolder= new File(zipfile.getParentFile(), folderName);
	      zipFolder.mkdir();


	      File currentDir = zipFolder;
	      //File currentDir = zipfile.getParentFile();

		try {
			BufferedOutputStream dest = null;
			FileInputStream fis = new 
			FileInputStream(zipfile.toString());
			ZipInputStream zis = new 
			ZipInputStream(new BufferedInputStream(fis));
			ZipEntry entry;
			while((entry = zis.getNextEntry()) != null) {
			    //System.out.println("Extracting: " +entry);
				if (entry.isDirectory()) {
					File f = new File(currentDir, entry.getName());
					if (f.exists()) f.delete(); // relevant if this is the top level folder
					f.mkdir();
				} else {
					int count;
					byte data[] = new byte[BUFFER];
					// write the files to the disk
					FileOutputStream fos = new 
					FileOutputStream(currentDir.toString() + "/" + entry.getName());
					dest = new 
					BufferedOutputStream(fos, BUFFER);
					while ((count = zis.read(data, 0, BUFFER)) 
							!= -1) {
						dest.write(data, 0, count);
					}
					dest.flush();
					dest.close();
				}
			}
			zis.close();

			zipfile.delete();        
			File[] currentDirFiles = currentDir.listFiles();
			if (currentDirFiles.length == 1) {
			    if (currentDir.getName().equals(currentDirFiles[0].getName())) {
				File newtmpfile = new File(currentDir.getParent(),"tmp");
				currentDirFiles[0].renameTo(newtmpfile);
				currentDir.delete();
				newtmpfile.renameTo(currentDir);
			    } else {
				File newtmpfile = new File(currentDir.getParent(), currentDirFiles[0].getName());
				currentDirFiles[0].renameTo(newtmpfile);
				currentDir.delete();
				currentDir= newtmpfile;
			    }
			}
			return currentDir;
		} catch(Exception e) {
			e.printStackTrace();
		}
		return (File)null;

	}}

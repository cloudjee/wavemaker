package com.wavemaker;
import java.net.*;
import java.io.*;
import java.util.*;

import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import org.springframework.web.multipart.MultipartFile;
import com.wavemaker.runtime.server.FileUploadResponse;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.deployment.DeploymentTargetManager;
import com.wavemaker.tools.deployment.tomcat.TomcatDeploymentTarget;


/**
 * This is a client-facing service class.  All
 * public methods will be exposed to the client.  Their return
 * values and parameters will be passed to the client or taken
 * from the client, respectively.  This will be a singleton
 * instance, shared between all requests. 
 * 
 * To log, call the superclass method log(LOG_LEVEL, String) or log(LOG_LEVEL, String, Exception).
 * LOG_LEVEL is one of FATAL, ERROR, WARN, INFO and DEBUG to modify your log level.
 * For info on these levels, look for tomcat/log4j documentation
 */
public class StudioInstallService extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {
    /* Pass in one of FATAL, ERROR, WARN,  INFO and DEBUG to modify your log level;
     *  recommend changing this to FATAL or ERROR before deploying.  For info on these levels, look for tomcat/log4j documentation
     */
    
	private DeploymentTargetManager deploymentTargetManager;
    private static final String studioContextName = "/wavemaker";

	public StudioInstallService() {
       super(INFO);
    }
    public void DownloadPackages() throws IOException {
        File webapproot = new File(RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(""));

     URL url = new URL("https://github.com/wavemaker/WaveMaker-LGPL-Resources/blob/master/repo.zip?raw=true");
      URLConnection urlC = url.openConnection();
          // Copy resource to local file, use remote file
          // if no local file name specified
          InputStream is = url.openStream();
          
          File outputFile = new File(webapproot, "repo.zip");
          System.out.println("WRITE TO " + outputFile.toString());
          FileOutputStream fos = new FileOutputStream(outputFile);
          int oneChar, count=0;
          while ((oneChar=is.read()) != -1)
          {
             fos.write(oneChar);
             count++;
          }
          is.close();
          fos.close();
          System.out.println("WROTE TO " + outputFile.getAbsolutePath());
          if (!outputFile.exists())
            throw new IOException("Insufficient permissions to save zip file");
          File zipFolder = unzipFile(outputFile);
          if (!moveFiles(zipFolder, outputFile)) 
            throw new IOException("Insufficient permissions to copy");;
    }  
    private boolean moveFiles(File zipFolder, File zipFile) {
         boolean result = true;
         File webapproot = new File(RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(""));

         File ace = new File(zipFolder, "ace");
         File newAce = new File(webapproot, "../../studio/app/lib/ace"); 
         ace.renameTo(newAce);
         if (!newAce.exists()) {
            result = false;
            System.out.println("FAILED TO WRITE: " + newAce.getAbsolutePath());
         }            
            
         File h1 = new File(zipFolder, "hibernate-tools.jar");
         if (!h1.renameTo(new File(webapproot, "../../studio/WEB-INF/lib/hibernate-tools.jar"))) {
            result = false;
             System.out.println("FAILED TO WRITE: " + new File("../../studio/WEB-INF/lib/hibernate-tools.jar").getAbsolutePath());
         }

        File h2 = new File(zipFolder, "hibernate3.jar");
         if (!h2.renameTo(new File(webapproot, "../../studio/WEB-INF/lib/hibernate3.jar"))) {
            result = false;
            System.out.println("FAILED TO WRITE: " + new File("../../studio/WEB-INF/lib/hibernate3.jar").getAbsolutePath());
         }
         
         File jtds = new File(zipFolder, "jtds-1.2.1.jar");
         if (!jtds.renameTo(new File(webapproot, "../../studio/WEB-INF/lib/jtds-1.2.1.jar"))) {
            result = false;
                         System.out.println("FAILED TO WRITE: " + new File("../../studio/WEB-INF/lib/jtds-1.2.1.jar").getAbsolutePath());
         }
         
         
    		zipFile.renameTo(new File(webapproot, "../../studio/installed_bundle.zip"));
         /*
        try {
          IOUtils.deleteRecursive(zipFolder);
        } catch(Exception e){}
        */
    return result;
    }
     public FileUploadResponse uploadPackage(MultipartFile file) throws IOException
    {
                 File webapproot = new File(RuntimeAccess.getInstance().getSession().getServletContext().getRealPath(""));

        
        // Create our return object
        FileUploadResponse ret = new FileUploadResponse();
        try {
            /* Find our upload directory, make sure it exists */
            File outputFile = new File(webapproot, "repo.zip");
            if (outputFile.exists())
                outputFile.delete();
            /* Write the file to the filesystem */
            FileOutputStream fos = new FileOutputStream(outputFile);            
            IOUtils.copy(file.getInputStream(), fos);
            file.getInputStream().close();                          
            fos.close();
            if (!outputFile.exists())
                throw new IOException("Insufficient permissions to copy");
            File zipFolder = unzipFile(outputFile);
            if (!moveFiles(zipFolder, outputFile)) 
                throw new IOException("Insufficient permissions to copy"); 
			
			restartStudioApp();

            /* Setup the return object */
            ret.setPath(outputFile.getPath());
            ret.setError("");
            ret.setWidth("");
            ret.setHeight("");
        } catch(Exception e) {
            System.out.println("ERROR:" + e.getMessage() + " | " + e.toString());
            ret.setError(e.getMessage());
        }
        return ret;
    }

    
      public static File unzipFile(File zipfile) {
    	   int BUFFER = 2048;


	      String zipname = zipfile.getName();
          int extindex =  zipname.lastIndexOf(".") ;
	    

	      File zipFolder= new File(zipfile.getParentFile(), zipname.substring(0,extindex));
          if (zipFolder.exists()) 
            zipFolder.delete();
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
                   
			File[] currentDirFiles = currentDir.listFiles();
		    
			return currentDir;
		} catch(Exception e) {
			e.printStackTrace();
		}
		return (File)null;

	}

	@HideFromClient
    public void setDeploymentTargetManager(
            DeploymentTargetManager deploymentTargetManager) {
        this.deploymentTargetManager = deploymentTargetManager;
    }

    private void restartStudioApp() throws Exception {
        String result;

        Map<String, String> m = new LinkedHashMap<String, String>(4);
        m.put(TomcatDeploymentTarget.HOST_PROPERTY_NAME, "localhost");
        String port = Integer.toString(RuntimeAccess.getInstance().getRequest().getServerPort());
        m.put(TomcatDeploymentTarget.PORT_PROPERTY_NAME, port);
        m.put(TomcatDeploymentTarget.MANAGER_USER_PROPERTY_NAME, "manager");
        m.put(TomcatDeploymentTarget.MANAGER_PASSWORD_PROPERTY_NAME, "manager");
        Map<String, String> props = Collections.unmodifiableMap(m);

        result = deploymentTargetManager.getDeploymentTarget("tomcat")
            .stop(studioContextName, props);

        System.out.println(result);

        result = deploymentTargetManager.getDeploymentTarget("tomcat")
            .start(studioContextName, props);

        System.out.println(result);
    }
}

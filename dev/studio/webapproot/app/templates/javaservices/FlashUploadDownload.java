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
 
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.runtime.server.DojoFileUploaderResponse;
import com.wavemaker.common.util.IOUtils;
import java.util.Random;
import java.util.Vector;
import com.wavemaker.runtime.server.FileUploadResponse;
import com.wavemaker.runtime.RuntimeAccess;

import javax.activation.MimetypesFileTypeMap;

public class WMFile {
    public WMFile(String name,long size, String type) {
        this.name = name;
        this.size = size;
        this.type = type;
    }
    String name;
    long size;
    String type;
    public String getName() {return name;}
    public void setName(String s){name = s;}
    public String getType() {return type;}
    public void setType(String s){type = s;}
    public long getSize() {return size;}
    public void setSize(long i) {size = i;}
};


     String uploadDir = "${java.lang.String:uploadDir:Absolute path to the folder where you will upload the file; possibly a tmp folder. Leave blank to use your project's webapproot/resources/data folder}";
protected File getUploadDir() {
    if (uploadDir.length() == 0) {
        uploadDir = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath("resources/data");
    }
    File f = new File(uploadDir);
    f.mkdirs();
    return f;
}


/********************************************************************************
 * NAME: uploadFile
 * DESCRIPTION: The DojoFileUpload widget automatically packages up these paramters:
 *   flashUploadFiles: Contains a single file to be written to filesystem or database
 *   Filename: Original name of that file
 *   ignored: this parameter is unused
 * RETURNS DojoFileUploaderResponse which has the following fields
 *   Path: tells the client where the file was stored so that it can tell the server 
 *         what to do with e files
 *   Name: tells the client what the original name of the file was so that any 
 *         communications with the end user can use a filename familiar to that user.
 *   Type: returns type information to the client
 *   Error:This will NOT trigger an onError, but will allow the user of the widget to 
 *         scan the list of returned files for any errors.
 *   Width/Height: Intended for returning width/height of uploaded images, but in fact 
 *         you can use these to return any custom information you want.
 *
 */

public DojoFileUploaderResponse uploadFile(CommonsMultipartFile file, 
                                           String Filename, 
                                           MultipartFile ignored) throws IOException
{

    DojoFileUploaderResponse ret = new DojoFileUploaderResponse();
    try {
        String name = Filename;
        File outputFile = new File(this.getUploadDir(), name);
        FileOutputStream fos = new FileOutputStream(outputFile);
        
        IOUtils.copy(file.getInputStream(), fos);
        file.getInputStream().close();
        fos.close();
      
        ret.setPath(outputFile.getAbsolutePath());
        ret.setName(Filename);
        ret.setWidth("0");
        ret.setHeight("0");
        ret.setType(Filename.substring(Filename.lastIndexOf(".")));
        ret.setError("");
    } catch(Exception e) {
        ret.setError(e.toString());
        ret.setName(Filename);
    }
    return ret;
}



public WMFile[] listFiles() throws IOException {
    MimetypesFileTypeMap m = new MimetypesFileTypeMap();
    File dir = this.getUploadDir();
    File[] files = dir.listFiles(
        new java.io.FilenameFilter() {
            public boolean accept(File dir, String name) {
                return (name.indexOf(".") != 0);
            }
        });

    WMFile[] result = new WMFile[files.length];
    for (int i = 0; i < files.length; i++) {
        result[i] = new WMFile(files[i].getName(), files[i].length(), m.getContentType(files[i]));
    }
    return result;
} 


public void deleteFiles(String[] files) throws IOException {
    File dir = this.getUploadDir();
    for (int i = 0; i < files.length; i++) {
        File f = (files[i].startsWith("/")) ? new File(files[i]) : new File(dir,files[i]);

      // verify that the path specified by the server is a valid path, and not, say,
      // your operating system, or your .password file.
      if (f.getAbsolutePath().indexOf(dir.getAbsolutePath()) == 0)
        f.delete();
    }
}


public void deleteFile(String file) throws IOException {
    File dir = this.getUploadDir();
      File f = (file.startsWith("/")) ? new File(file) : new File(dir,file);
      
      // verify that the path specified by the server is a valid path, and not, say,
      // your operating system, or your .password file.
      if (f.getAbsolutePath().indexOf(dir.getAbsolutePath()) == 0)
        f.delete();

    
}

    public DownloadResponse downloadFile(String file, String returnname) throws Exception {
        File dir = getUploadDir();
      File f = (file.startsWith("/")) ? new File(file) : new File(dir,file);
      
        // verify that the path specified by the server is a valid path, and not, say,
        // your .password file.
        if (f.getAbsolutePath().indexOf(dir.getAbsolutePath()) != 0)
          throw new Exception("File not in uploadDir");
        
        // Create our return object and setup its properties
        DownloadResponse ret = new DownloadResponse();
    
        returnname = (returnname != null && returnname.length() > 0) ? returnname : f.getName();
        String type = new MimetypesFileTypeMap().getContentType(f);
        // Setup the DownloadResponse
        FileInputStream fis = new FileInputStream(f);
        ret.setContents(fis);
        ret.setContentType(type); 
        ret.setFileName(returnname);      
        return ret;
    }


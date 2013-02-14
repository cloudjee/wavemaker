package dev.wavemaker;

import java.io.*;
import java.math.BigDecimal;

import org.apache.commons.io.IOUtils;
import org.springframework.mail.javamail.ConfigurableMimeFileTypeMap;
import org.springframework.web.multipart.MultipartFile;

import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.runtime.server.ParamName;

import org.json.*;

public class JSFiles extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {

  public JSFiles() {
    super(INFO);
  }

  private String filePath = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath("/uploadData");

  /*
  *  upload file to server folder uploadData
  *
  *  @param   MultipartFile 
  *  @return  void
  */
  public void upload(@ParamName(name="file") MultipartFile inputfile) {
    
    try {
    
      // create a new instance of the method FILE
      File outputFile = new File(filePath, inputfile.getOriginalFilename());
    
      // create a new instance of the method FileOutputStream and write content into it
      FileOutputStream fos = new FileOutputStream(outputFile);

      // copy the inputstream into my new instance of "file"
      IOUtils.copy(inputfile.getInputStream(), fos);
    
      inputfile.getInputStream().close();
      fos.close();
      
      //fSize
    
    } catch(Exception e) {
      log(ERROR, "Error in method upload: ", e);
    }
  }
  
  /*
  *  download file from server folder uploadData
  *
  *  @param   MultipartFile 
  *  @return  DownloadResponse
  */
  public DownloadResponse download(@ParamName(name="filename")String filename) {
  
    DownloadResponse ret = new DownloadResponse();
    
    try {

      File downloadFile = new File(filePath, filename);
      FileInputStream fis = new FileInputStream(downloadFile);
      ret.setContents(fis);
      ret.setFileName(filename);
      
    
    } catch(Exception e) {
      log(ERROR, "Error in method download: ", e);
    }
    return ret;
  }

  /*
  *  deletes file from server folder uploadData
  *
  *  @param   String  inFileName
  *  @return  void
  */  
  public void deleteFile(String inFileName) {
  
    try {
    
      File delFile = new File(filePath, inFileName);
      delFile.delete();  
    
    } catch (Exception e){
      log(ERROR, "Error in method deleteFile: ", e);
    }  
  }
  
  /*
  *  deletes all file from server folder uploadData
  *
  *  @param   String  inFileNames (Json String)
  *  @return  void
  */  
  public void deleteAllFiles(String inFileNames) {
  
    String [] splitString = null;
    boolean success;
  
    try {
    
      if(inFileNames != null) {
      
        // Serialize incoming json string
        JSONArray jArr = new JSONArray(inFileNames );
        for(int i=0; i<jArr.length(); i++) {
          JSONObject obj = new JSONObject(jArr.get(i).toString());
          File delFile = new File(filePath, obj.get("name").toString());
          success = delFile.delete();   
          log(INFO,obj.get("name") + "-" + success);
        }
      }
    
    } catch (Exception e){
      log(ERROR, "Error in method deleteFile: ", e);
    }  
  }

  /*
  *  determines the file size in KB
  *
  *  @param   String  inFileName
  *  @return  String  actual size of file
  */
  public String fSize(String inFileName) {
  
    String retString = null;

    try { 
      
      File f = new File(filePath, inFileName);

      double fileLengthLong = f.length();
      BigDecimal payment = new BigDecimal(Math.abs(fileLengthLong/1024));

      retString = payment.setScale(2,BigDecimal.ROUND_HALF_UP) + " KB";

    } catch (Exception e){
      log(ERROR, "Error in method fSize: ", e);
      retString = "0 KB";
    }
    return retString;
  }

}

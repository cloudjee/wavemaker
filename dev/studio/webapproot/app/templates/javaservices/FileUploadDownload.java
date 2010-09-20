import java.io.File;
import java.io.FileOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;
import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.common.util.IOUtils;
import java.util.Random;

static String destDir = "${java.lang.String:destDir:Absolute path to the folder where you will upload the file}";
static Boolean isTmp = ${java.lang.Boolean:isTmp:Is the folder a tmp folder? If so we'll randomize the name to avoid collisions};

public String uploadFile(MultipartFile file) throws IOException {
    DownloadResponse ret = new DownloadResponse();

    String name;
    if (isTmp)
        name = new Random().nextInt(15) + "_" + file.getOriginalFilename();
    else
        name = file.getOriginalFilename();
    File outputFile = new File(destDir, name);
    //System.out.println("writing the content of uploaded file to: "+outputFile);                                                                                      

    FileOutputStream fos = new FileOutputStream(outputFile);
    IOUtils.copy(file.getInputStream(), fos);
    file.getInputStream().close();
    fos.close();
    return outputFile.getName();
}


public static DownloadResponse downloadFile(String filename, String returnname, String filetype) throws IOException {
    DownloadResponse ret = new DownloadResponse();
    
    // Setup the DownloadResponse
    FileInputStream fis = new FileInputStream(new File(destDir, filename));
    ret.setContents(fis);
    ret.setContentType(filetype);  // it may seem strange to tell the server what file type to return.  Nice trick though is to pass it "application/unknown" so that it will save content to the user's hard drive that the browser might otherwise try to display.  If I want to download an image, I don't actually want to view the image; I probably clicked on the image to request the download...
    ret.setFileName(returnname);	    
    return ret;
}

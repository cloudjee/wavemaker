import org.apache.tools.ant.*;
import java.util.*;
import java.io.*;
import java.lang.reflect.*;
import junit.framework.*;

import java.lang.System;
public class wmRuntimeBrowser extends org.apache.tools.ant.Task {
    
    //private String ie,firefox,safari;
    private String wmBrowser;
	
	       
	public void init() {

		super.init();
	}
	
	// The setter for the "message" attribute
  	public void setwmBrowser(String wmBrowser) {
	    this.wmBrowser = wmBrowser;
  	}
	

  	
	public void execute() throws org.apache.tools.ant.BuildException {
		
		String nameOS = project.getProperty("os.name");
			
		if ((wmBrowser.equals("ie")) && (nameOS.startsWith("Windows")))
		{
			project.setProperty("isIE","true");
		}
		else if(wmBrowser.equals("firefox"))
		{
			project.setProperty("isFirefox","true");
		}
		else if((wmBrowser.equals("safari")) && (nameOS.startsWith("Mac")))
		{
			project.setProperty("isSafari","true");
		}
		else 
		{
			if(nameOS.startsWith("Windows")){
			    project.setProperty("isIE","true");
			    project.setProperty("isFirefox","true");
			}
			else if(nameOS.startsWith("Mac")){
				project.setProperty("isIE","true");
			    project.setProperty("isSafari","true");
		    }
		}

     }
}

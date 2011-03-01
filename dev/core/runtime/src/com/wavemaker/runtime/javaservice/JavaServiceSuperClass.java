/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
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
package com.wavemaker.runtime.javaservice;
import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
import com.wavemaker.runtime.RuntimeAccess;
import javax.servlet.http.HttpSession;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import java.io.File;

import com.wavemaker.common.util.IOUtils;
/**
 * @author Michael
 * @version $Rev: 26365 $ - $Date: 2009-07-04 20:04:57 -0700 (Wed, 29 Apr 2009) $
 *
 */
public class JavaServiceSuperClass {
    private Logger logger;
    public static final int FATAL = 0;
    public static final int ERROR = 1;
    public static final int WARN = 2;
    public static final int INFO = 3;
    public static final int DEBUG = 4;
    public static final String[] LEVELS = {"FATAL", "ERROR","WARN","INFO","DEBUG"};
    public static final String OPEN_PROJECT_SESSION_NAME = "agOpenProjectName";
    public static final String PROJECTHOME_KEY = "wm.projectsDir";
    
    public JavaServiceSuperClass() {
	    init(ERROR);
    }
    public JavaServiceSuperClass(int logLevel) {
	    init(logLevel);
    }
    private void init(int logLevel) {
	logger = Logger.getLogger(this.getClass().getName());

       // Am I running within studio with a logged on user, within studio but in a non-cloud configuration, or in my own context (testrun or fully deployed)?
       
       try {

	   /* Determine if we're in live layout, test run or deployed */
	   String currentPath = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath("");
	   File webapproot = new File(currentPath);
	   boolean isLiveLayout = false;
	   boolean isDeployedApp = false;
	   boolean isTestRun = false;
	   if (new File(webapproot, "app/deploy.js").exists()) 
	       isLiveLayout = true;
	   else if (new File(webapproot, "lib/dojo").exists()) 
	       isDeployedApp = true;
	   else 
	       isTestRun = true;



	   String startLogLine = "START_WM_LOG_LINE %d{ABSOLUTE}";
	   String endLogLine = "END_WM_LOG_LINE";

	   File logFolder = new File(System.getProperty("catalina.home") + "/logs/ProjectLogs");
	   if (!isDeployedApp) {
	       String projectName = webapproot.getParentFile().getName();
	       logFolder = new File(logFolder, projectName);
	   }
	   IOUtils.makeDirectories(logFolder, new File(System.getProperty("catalina.home")));

	   if (isDeployedApp) {
	       startLogLine = "";
	       endLogLine   = "";
	   } 

       System.out.println("LOG FOLDER: "+ logFolder.toString() +  " | " + logFolder.exists());
       //System.out.println("LOG FOLDER IS " + logFolder.toString());


       java.util.Properties props = new java.util.Properties();
       props.setProperty("log4j.logger." + this.getClass().getName(), LEVELS[logLevel] + ", WebServiceLogger1, WebServiceLogger2");
       props.setProperty("log4j.appender.WebServiceLogger1", "org.apache.log4j.RollingFileAppender");     
       props.setProperty("log4j.appender.WebServiceLogger1.File", logFolder.toString() + "/" + this.getClass().getName() + ".log");
       //System.out.println("FILE:" +  logFolder.toString() + "/" + this.getClass().getName() + ".log");
       props.setProperty("log4j.appender.WebServiceLogger1.MaxFileSize", "50KB");
       props.setProperty("log4j.appender.WebServiceLogger1.layout", "org.apache.log4j.PatternLayout");       
       props.setProperty("log4j.appender.WebServiceLogger1.layout.ConversionPattern", startLogLine + " %5p (%F:%L) " + ((isDeployedApp) ? "%d" : "%d{HH:mm:ss}") + " - %m " + endLogLine + "%n");

       props.setProperty("log4j.appender.WebServiceLogger2", "org.apache.log4j.RollingFileAppender");
       props.setProperty("log4j.appender.WebServiceLogger2.File", logFolder.toString() + "/project.log");
       //System.out.println("FILE:" +  logFolder.toString() + "/project.log");
       props.setProperty("log4j.appender.WebServiceLogger2.MaxFileSize", "50KB");
       props.setProperty("log4j.appender.WebServiceLogger2.layout", "org.apache.log4j.PatternLayout");       
       props.setProperty("log4j.appender.WebServiceLogger2.layout.ConversionPattern", startLogLine + " %5p (%F:%L) %d{HH:mm:ss} - %m " + endLogLine + "%n");

       PropertyConfigurator.configure(props);
       } catch(Exception e) {e.printStackTrace();}
    }

    private String getCurrentUsername() {

	/*
	com.wavemaker.runtime.security.SecurityService securityService = (com.wavemaker.runtime.security.SecurityService) RuntimeAccess.getInstance().getService("securityService");
	String username = securityService.getUserName();
	*/
	try {
	    org.acegisecurity.Authentication authentication = org.acegisecurity.context.SecurityContextHolder.getContext().getAuthentication();
	    String username = authentication.getName();
	    username = username.replaceAll("_","__"); // insures that users can't type in mkantor_AT_wavemaker.com; because that gets turned into mkantor__AT__wavemaker.com
	    username = username.replaceAll("\\.", "_DOT_");
	    username = username.replaceAll("@", "_AT_");
	    return username;
	} catch(Exception e) {
	    return null;
	}
    }

    protected void log(int level,String message, Exception e) {
      switch(level) {
      case DEBUG:
	  logger.debug(message,e);
	  break;
      case ERROR:
	  logger.error(message,e);
	  break;
      case INFO:
	  logger.info(message,e);
	  break;
      case WARN:
	  logger.warn(message,e);
	  break;
      case FATAL:
	  logger.fatal(message,e);
	  break;
      }
    }


    protected void log(int level, String message) {
      switch(level) {
      case DEBUG:
	  logger.debug(message);
	  break;
      case ERROR:
	  logger.error(message);
	  break;
      case INFO:
	  logger.info(message);
	  break;
      case WARN:
	  logger.warn(message);
	  break;
      case FATAL:
	  logger.fatal(message);
	  break;
      }
    }

    @HideFromClient
    public void setLogLevel(int level) {
    }
}

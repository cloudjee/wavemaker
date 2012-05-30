package com.wavemaker.spinup.wmclient;

import com.userlogdb.UserlogDB;
import com.userlogdb.data.Userlogin;

import java.util.Hashtable;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Required;
import org.springframework.beans.factory.annotation.Autowired;

import com.wavemaker.spinup.web.SpinupController;
import com.wavemaker.spinup.web.LoginCredentialsBean;

import com.wavemaker.tools.cloudfoundry.spinup.authentication.SharedSecret;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.TransportToken;

import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.javaservice.JavaServiceSuperClass;
import com.wavemaker.runtime.service.annotations.ExposeToClient;



@ExposeToClient
public class SpinUpService extends JavaServiceSuperClass {
   
       private SpinupController spinupController;
       private LoginCredentialsBean loginCredentials;
       private HttpServletRequest request;
       private HttpServletResponse response;
       private static int counter;
       private UserlogDB DBsvc = null;
       private SharedSecret secret;
       private TransportToken transportToken;
  
    public SpinUpService() {
       super(INFO);
       try{
       DBsvc = (UserlogDB)RuntimeAccess.getInstance().getServiceBean("userlogDB");
       } catch(Exception e) {
          log(ERROR, "Login has failed", e);
          log(ERROR, e.getMessage());
       }
       
    }

	public String login(String username, String password){
		username = username.toLowerCase();
		log(INFO, "Processing: " + username);
		try {
		  if(!username.contains("@")){		  
            log(ERROR, "User: " + username + " NOT email");
			return("Please enter the email address for your Cloud Foundry account.");
		  }
          if(!(username.contains("@vmware.com") || username.contains("@springsource.com") || username.contains("@springsource.org") || username.contains("@emc.com") || username.contains(
"@rabbitmq.com"))){
              log(ERROR, "User: " + username + " NOT allowed at this time");
              return("WaveMaker is currently in a limited preview mode.<br>Check back with us soon and join our public beta !");
          }
          log(INFO, "Logging in user: = " + username );
          loginCredentials = new LoginCredentialsBean(username, password);
          Hashtable<String, Object> loginResult = spinupController.processLogin(loginCredentials, RuntimeAccess.getInstance().getRequest());
          secret = (SharedSecret)loginResult.get("secret");
          transportToken = (TransportToken)loginResult.get("token");
          if(secret != null && transportToken != null){
		  return("SUCCESS " + username + " logged in");
          }
          else{
             return("Unable able to authenticate. Problem getting token and/or secret !");
          }
       } catch(Exception e) {
          log(ERROR, "Login has failed" + e.getMessage());
          return("The user name or password you entered is incorrect.");
       }
	}
	
    public Hashtable<String, String> launchStudio() {
       Hashtable<String,String> result  = new Hashtable<String, String>();
       try {
          result = spinupController.performSpinup(loginCredentials, secret, transportToken, RuntimeAccess.getInstance().getResponse());
          recordUserLog(loginCredentials.getUsername());
          log(INFO, "Counter now: " + ++counter);          
       } catch(Exception e) {
          log(ERROR, "Login has failed", e);
          result.put("ERROR", "Unable to deploy studio. " +  e.getMessage());
          log(ERROR, e.getMessage());
       }
       return result;
    }
    
    private void recordUserLog(String userName){
        try{
        DBsvc.begin();
        Userlogin login = new Userlogin();
        login.setUsername(userName);
        login.setLogin(new Date());
        DBsvc.insert(login);
        DBsvc.commit();
        }
        catch(Exception e){
        e.printStackTrace();
        DBsvc.rollback();
        }
    }
    
    @Autowired
    @Required
    public void setSpinupController(SpinupController spinupController) {
        this.spinupController = spinupController;
    }

}

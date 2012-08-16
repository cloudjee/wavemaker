package com.wavemaker.spinup.wmclient;

import com.userlogdb.UserlogDB;
import com.userlogdb.data.Userlogin;

import java.util.Hashtable;
import java.util.Date;
import java.util.Random;
import java.util.GregorianCalendar;

import org.springframework.beans.factory.annotation.Required;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import com.wavemaker.spinup.web.SpinupController;
import com.wavemaker.spinup.web.LoginCredentialsBean;
import com.wavemaker.spinup.web.WavemakerStudioApplicationArchiveFactory;

import com.wavemaker.tools.cloudfoundry.spinup.authentication.SharedSecret;
import com.wavemaker.tools.cloudfoundry.spinup.authentication.TransportToken;

import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.javaservice.JavaServiceSuperClass;
import com.wavemaker.runtime.service.annotations.ExposeToClient;

import org.cloudfoundry.client.lib.CloudFoundryException;

@ExposeToClient
public class SpinUpService extends JavaServiceSuperClass {
   
       private SpinupController spinupController;
       private WavemakerStudioApplicationArchiveFactory wmApplicationArchiveFactory;
       private LoginCredentialsBean loginCredentials;
       private static int counter;
       private static int dailyCounter;
       private static int dailyLimit = 3;
       private static int DOY = 0;
       private static GregorianCalendar gcal;
       private UserlogDB DBsvc = null;
       private SharedSecret secret;
       private TransportToken transportToken;
       private int randKey;
  
    public SpinUpService() {
       super(INFO);
       try{
   	   gcal = new GregorianCalendar();
       DBsvc = (UserlogDB)RuntimeAccess.getInstance().getServiceBean("userlogDB");
       } catch(Exception e) {
          log(ERROR, "Failed to get DB log service", e);
          log(ERROR, e.getMessage());
       }
       
    }

	public String login(String username, String password){
		username = username.toLowerCase();
		log(INFO, "Processing: " + username);
		try {
		  if(!username.contains("@")){		  
            log(ERROR, "User: " + username + " NOT email");
			return("Enter a valid email address for your Cloud Foundry account.");
		  }
          log(DEBUG, "Logging in user: = " + username );
          loginCredentials = new LoginCredentialsBean(username, password);
          Hashtable<String, Object> loginResult = spinupController.processLogin(loginCredentials, RuntimeAccess.getInstance().getRequest());
          secret = (SharedSecret)loginResult.get("secret");
          transportToken = (TransportToken)loginResult.get("token");
          if(secret != null && transportToken != null){
		  return("SUCCESS " + username + " logged in");
          }
          else{
             return("Unable able to authenticate. Problem getting token and/or secret.");
          }
       } catch(Exception e) {
          log(ERROR, "Login has failed" + e.getMessage());
          return("The user name or password you entered is incorrect.");
       }
	}
	
    public Hashtable<String, String> launchStudio() {
        Hashtable<String,String> result  = new Hashtable<String, String>();
    	if(spinupController.isNewDeployment(loginCredentials)){
    		if(dailyLimit()){
    			result.put("ERROR", "Sorry, we have reached the preview limit for today.<BR>Please try back again tomorrow.");
    			return result;
    		}
    	}
    	
       try {
          log(DEBUG, "performing spinup for: " + loginCredentials.getUsername()); 
          result = spinupController.performSpinup(loginCredentials, secret, transportToken, RuntimeAccess.getInstance().getResponse(), false); 
          recordUserLog(loginCredentials.getUsername());
          log(INFO, "Counter now: " + ++counter);          
       } 
       catch(CloudFoundryException cfe) {
          log(ERROR, "Failed to Launch Studio " + cfe.getMessage() + " " + cfe.toString());  
          String msg = cfe.toString();
          if(msg.contains("Not enough memory capacity")){
            String allowed = msg.substring(msg.indexOf("(")+1, msg.indexOf(")"));
            result.put("ERROR", "Insufficent memory to deploy studio to your account.<BR> " + allowed + "<BR>512M is required to start Studio.");
          }
          else{
              result.put("ERROR", "Unable to deploy studio to your account.<BR> " + "Cause: " + cfe.toString());
          }   
       }       
       catch(Exception e) {
          log(ERROR, "Studio Launch has failed", e);
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
    
    /**
     * @return true if daily limit has been reached
     */
    private Boolean dailyLimit(){
    	gcal = new GregorianCalendar();
    	int DOYnow = gcal.get(GregorianCalendar.DAY_OF_YEAR);
    	if (DOYnow != DOY){
    		DOY = DOYnow;
    		dailyCounter = 1;
    		log(INFO, "First customer for: " + DOY);
    		return false;  				
    	}
   		if(dailyCounter < dailyLimit){
   			log(INFO, "Today's counter now: " + ++dailyCounter);
   			return false;
    	}
   		else{
   			log(ERROR,"### ## Daily Limit of " + dailyLimit +" has been reached. No more studios will be deployed for " + DOY +". ## ###");
   			return true;
   		}
    	
    }
    
    public String createKey(){
         Random rand = new Random(); 
         this.randKey = rand.nextInt(2147483646);
         log(INFO, "Key is now: " + this.randKey);
         return ("OK. Now get the key from logs");
    }
    
    public void checkForUpdate(int key){
        Assert.notNull(key, "Update key can not be null");
        if(new Long(randKey).equals(new Long(key))){
            this.wmApplicationArchiveFactory.checkForUpdate();
        }
    }
    
    @Autowired
    @Required
    public void setSpinupController(SpinupController spinupController) {
        this.spinupController = spinupController;
    }

    @Autowired
    public void setWavemakerStudioApplicationArchiveFactory(WavemakerStudioApplicationArchiveFactory wmApplicationArchiveFactory){
        this.wmApplicationArchiveFactory = wmApplicationArchiveFactory;   
    }

}

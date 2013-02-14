package dev.wavemaker;

import java.util.Random;
import java.util.List;

import com.wavemaker.runtime.RuntimeAccess;
import com.Issuecloudv2;
import com.data.User;
import com.data.Issue;
import com.data.Project;
import com.data.output.GetProjectPrefixRtnType;
import com.data.output.GetMAxIssuesByProjectRtnType;

public class JSUtil extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {

  public JSUtil() {
    super(INFO);
  }
    
  private Issuecloudv2 dbService = (Issuecloudv2) RuntimeAccess.getInstance().getService(Issuecloudv2.class);
    

  /**
  * check whether email address already exist 
  *
  * @param  inEmail  incoming email from client
  * @return          return true if email exist
  */
  public Boolean retEmail(String inEmail) {
    try{

      if (dbService.getUserByEmail(inEmail) != null) {
        return true;
      } else {
        return false;
      }
    
    } catch(Exception e) {
      log(ERROR, "Error in method retEmail: ", e);
      return false;
    }
  }   
  

  /**
  * check whether username already exist 
  *
  * @param  inUName  incoming username from client
  * @return          return true if username exist
  */
  public Boolean retUName(String inUName) {
    try{

      if (dbService.getUserByUserName(inUName) != null) {
        return true;
      } else {
        return false;
      }
    
    } catch(Exception e) {
      log(ERROR, "Error in method retUName: ", e);
      return false;
    }
  }  
  
  /**
  *  check whether username already exist
  *
  *  @param  inUName   incoming username from class
  *  @return           return true if number exist
  */
  public Boolean retAccount(Integer inAcNo) {
    try{

      if (dbService.getAccountNo(inAcNo) != null) {
        return true;
      } else {
        return false;
      }
    
    } catch(Exception e) {
      log(ERROR, "Error in method retAccount: ", e);
      return true;
    }
  } 

  /**
  *  create a 6 digit random number account number
  *  and check whether number already exist in DB
  *
  *  @return          return new account number 
  */
  public Integer createAccNumber() {
    
    Integer START = 100000;
    Integer END = 999999;
    Integer accountNo = -1;

    try{
      
      Random random = new Random();
      do {
        // make sure number always has 6 digits
        accountNo = random.nextInt(END-START)+100000;
      } while (retAccount(accountNo) == true);

    } catch(Exception e) {
      log(ERROR, "Error in method createAccNumber: ", e);
    }  
    return accountNo;
  }
  
  /**
  *  checks a given email address
  *
  *  @return true if email format is correct
  */
  public boolean validateEmail(String inEmail){
    String EMAIL_REGEX = "^[\\w-_\\.+]*[\\w-_\\.]\\@([\\w]+\\.)+[\\w]+[\\w]$";
    boolean b = inEmail.matches(EMAIL_REGEX);
    return b;
  }
  
  /**
  *  generate a unique issue prefix for
  *  a given project number
  *
  *  @param  inID     incoming prefix from client side
  *  @return          a new issue prefix
  */
  public String retPrefix(int inID) {
    
    String pfx = null;
    int counter = 1;
    
    try{
    
      if(inID >= 0) {
    
        // instantiate a new GetProjectPrefixRtnType object
        GetProjectPrefixRtnType pp = dbService.getProjectPrefix(inID);
        // gets the prefix from the project
        pfx = pp.getPfx();
        
        // returns the max number of the issues assigned to project id (inID)
        GetMAxIssuesByProjectRtnType max = dbService.getMAxIssuesByProject(inID);
        // stores the amount
        counter = (int) max.getMax().longValue();
        
        // for the first issue
        if(counter <=0) {
          counter = 1;
        } else {
          // increment counter to one
          counter++;
        }
        
        // returns the prefix and the number
        // something like ic-1; make sure it's not ic-0
        return pfx + "-" + counter; 
      } else {
        return "";
      }
    
    } catch(Exception e) {
      log(ERROR, "Error in method retAccount: ", e);
      return null;
    }
  } 

}

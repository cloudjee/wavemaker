package dev.wavemaker;

// Java utility imports
import java.util.Date;
import java.util.Random;

// WaveMaker imports
import com.wavemaker.runtime.RuntimeAccess;
import com.Issuecloudv2;
import com.data.Tenant;
import com.data.User;



public class JSRegistration extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {

  public JSRegistration() {
    super(INFO);
  }
    
  // instantiate a new DB service object
  private Issuecloudv2 dbService = (Issuecloudv2) RuntimeAccess.getInstance().getService(Issuecloudv2.class); 
  // instantiate a new utility object
  private JSUtil util = new JSUtil();
  // instantiate a new send mail object
  private JSSendMail mail = new JSSendMail();

  
  /**
  *  create a new tenant in Tenant table
  *
  *  @return  return retCode which includes 4 codes
  *  0 = everthing worked well
  *  1 = email format not correct
  *  2 = email already in DB or 
  *      username already in DB
  *  -1 = exception occured
  *  4 = email not sent
  */
  public int createTenant(
                             String inFirst,
                             String inLast,
                             String inEmail,
                             String inCompName,
                             String inPhone,
                             String inAddress
                          ) {
                          
    int tenantID = 0;
                          
    try{
    
      dbService.begin();
      
      // create date for createDate
      Date now = new Date();
      
      // instantiate a new tenant DB object
      Tenant tenant = new Tenant();
      
      // checks email for correct format
      if(util.validateEmail(inEmail) == false) {
        return 1;
      }
      
      // check whether email is already in DB
      if(util.retEmail(inEmail) == true) {
        return 2;
      }
      
      // check whether username is already in DB
      /*if(util.retUName(inUName) == true) {
        return 2;
      }*/

      // set DB fields
      tenant.setBillcode(0000000);
      tenant.setCompanyname(inCompName);
      tenant.setAccountnumber(util.createAccNumber());
      tenant.setAddress(inAddress);
      tenant.setPhone(inPhone);
      tenant.setCreatedate(now);
      tenant.setFlag(1);

      // write dataset
      dbService.insert(tenant);
      dbService.commit();
      tenantID = tenant.getTid();
      
      log(INFO, "The newly created ID is : " + tenantID);
      
      // create an ADMIN user account
      createUser(tenantID, inFirst, inLast, inEmail, 1);
      return 0;

    } catch (Exception e) {
      log(ERROR, "Error in method createTenant: ", e);
      dbService.rollback();
      return -1;
    }                   
  }
  
  /**
  *  create a new user in User table
  *
  *  @return  (see createTenant())
  */ 
  public int createUser(
                         int inTenant,
                         String inFirst,
                         String inLast,
                         String inEmail,
                         int inChoice
                       ) { 
                       
    String password = null;
    int sendMail = 0;

    try{
    
      dbService.begin();
      
      // checks email for correct format
      if(util.validateEmail(inEmail) == false) {
        return 1;
      }
      
      // check whether email is already in DB
      if(util.retEmail(inEmail) == true) {
        return 2;
      }
      
      // check whether username is already in DB
      /*if(util.retUName(inUName) == true) {
        return 2;
      }*/
    
      // create date for createDate
      Date now = new Date();
    
      // instantiate a new user DB object
      User user = new User();
            
      // instantiate a new user PassGenerator object
      JSPassGenerator pg = new JSPassGenerator();
      // create a 8 characters long password
      password = pg.generate(8);
      
      // set DB fields
      user.setFirstname(inFirst);
      user.setLastname(inLast);
      user.setUsername(inEmail);
      user.setPassword(password);
      user.setEmail(inEmail);
      user.setCreatedate(now);
      user.setFlag(1);
      
      // checks whether user has admin rights
      if(inChoice == 1) {
        user.setRole("admin");
      } else if(inChoice == 0){
        user.setRole("user");
      }

      // write dataset
      dbService.insert(user);
      dbService.commit();
      
      log(INFO, "THE RETURNED ID is : " + user.getUid());

      // send conformtion email
      sendMail = mail.sendEmailNotification(inEmail, inEmail, password);
      
      // update new user with the new tenant id
      updateTenantID(user.getUid(),inTenant);
      
      if(sendMail == 3) {
        return 0;
      } else {
        return 4;
      }

    } catch (Exception e) {
      log(ERROR, "Error in method createUser: ", e);
      return -1;
    }
  }
  
  /**
  *  because the registration registers tenants and
  *  not users WM uses always the default tenantID
  *  set in the security page
  *  this method changes the tenantid in the user
  *  table after the user has been created
  */
  private void updateTenantID(int inID, int inTenantID) {
    try{
      
      dbService.begin();
      
      // invoke setNewPass query
      dbService.setTenantID(inTenantID, inID);

      dbService.commit();
      
    
    } catch (Exception e) {
      log(ERROR, "Error in method updateTenantID: ", e);
    }      
  } 

  /**
  *  resets the password for given email
  *
  *  @return  return retCode which includes 4 codes
  *  0 = everthing worked well
  *  1 = email does not exits in DB
  *  -1 = exception occured
  */ 
  public int resetEmail(String inEmail) { 
                       
    String password = null;
    String uname = null;
    int id = 0;
    int sendMail = 0;

    try{
    
      dbService.begin();
        
      // check whether email is already in DB
      if(util.retEmail(inEmail) == false) {
        return 1;
      }
      
      // instantiate a new user DB object
      User user = dbService.getUserByEmail(inEmail);
                  
      // instantiate a new user PassGenerator object
      JSPassGenerator pg = new JSPassGenerator();
      // create a 8 characters long password
      password = pg.generate(8);
      
      // get the id
      id = user.getUid();
      
      // set DB fields
      dbService.setNewPass(password, id);

      // write dataset
      dbService.update(user);
      dbService.commit();
      
      // gets the username of the updated dataset
      uname = user.getUsername();
      
      // send conformtion email
      sendMail = mail.sendEmailNotification(inEmail, uname, password);
      
      return 0;

    } catch (Exception e) {
      log(ERROR, "Error in method createUser: ", e);
      return -1;
    }
  } 

}

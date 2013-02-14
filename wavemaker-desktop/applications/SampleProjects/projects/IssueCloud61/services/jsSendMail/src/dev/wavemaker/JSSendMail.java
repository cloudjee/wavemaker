package dev.wavemaker;

import com.wavemaker.runtime.security.*;
import com.wavemaker.runtime.RuntimeAccess;
import com.Issuecloudv2;
import com.data.output.GetIssueEmailsRtnType;
import com.data.output.GetCommentEmailsRtnType;
import com.data.output.GetIssueContentRtnType;
import com.data.output.GetCommentContentRtnType;

import java.util.Locale;
import java.util.Properties;
import java.util.ResourceBundle;
import java.util.List;
import java.util.HashSet;
import java.util.ArrayList;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class JSSendMail extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {

  public JSSendMail() {
    super(INFO);
  }

  /**
    *  Registration_en_US.properties in the src directory
    *  contains email parameters and static string messages
  */
  private Locale locale = new Locale("en", "US");
  public ResourceBundle rbIssue = ResourceBundle.getBundle("dev.wavemaker.Issue_en_US", locale);
  private ResourceBundle rbReg = ResourceBundle.getBundle("dev.wavemaker.Registration_en_US", locale);
  private SecurityService sc = new SecurityService();
  // instantiate a new DB service object
  private Issuecloudv2 dbService = (Issuecloudv2) RuntimeAccess.getInstance().getService(Issuecloudv2.class); 
  
  /**
  * send an registration email to the specified email address
  *
  * @ param String email address of recipient
  * @ param String user name
  * @ param String password 
  * @return int 3 or 4; 3 = sent; 4 = not sent 
  */
  public int sendEmailNotification(String email, String username, String password){ 
    try{
    
      // Use javamail api, set parameters from registration.properties file
      String smtpHost = rbReg.getString("smtpHost");
      String smtpHostUser = rbReg.getString("smtpHostUser");
      String smtpHostPassword = rbReg.getString("smtpHostPassword");
      String from = rbReg.getString("mailFrom");
      
      // Create text message
      StringBuffer mailContent = new StringBuffer();
      mailContent.append(rbReg.getString("newUserMailMsg"));
      mailContent.append("\n\n");
      mailContent.append(rbReg.getString("mailMainMsg"));
      mailContent.append("\n\n");
      mailContent.append(rbReg.getString("mailEmailCaption"));
      mailContent.append(email);
      mailContent.append("\n");
      mailContent.append(rbReg.getString("mailUsernameCaption"));
      mailContent.append(username);
      mailContent.append("\n");
      mailContent.append(rbReg.getString("mailPasswordCaption"));
      mailContent.append(password);
      mailContent.append("\n\n");
      mailContent.append(rbReg.getString("mailEndMsg"));

      // set the session properties
      Properties props = System.getProperties();
      props.put("mail.smtp.starttls.enable", "true");
      props.put("mail.smtp.host", smtpHost);
      props.put("mail.smtp.port", "587");
      props.put("mail.smtp.auth", "true");
      props.put("mail.smtp.starttls.required", "true");
      Session session = Session.getDefaultInstance(props, null);
      
      // Create email message
      MimeMessage message = new MimeMessage(session);
      message.setFrom(new InternetAddress(from));
      message.addRecipient(Message.RecipientType.TO, new InternetAddress(email));
      message.setSubject(rbReg.getString("newUserMailSubject"));
      message.setText(mailContent.toString());
      
      // Send smtp message
      Transport tr = session.getTransport("smtp");
      tr.connect(smtpHost, 587, smtpHostUser, smtpHostPassword);
      message.saveChanges();
      tr.sendMessage(message, message.getAllRecipients());
      tr.close();
      
      return 3;

    } catch (MessagingException e) {
      log(ERROR, "Error in method sendEmailNotification: ", e);
      return 4;
    }
  }
  
  // ******************** POPULATING ISSUE EMAIL ********************
  
  /*
  *  email entry function
  *  this method gathers all infomation to send
  *  emails regarding to issue to all participients
  *
  *  @param  inMailType  type of email "Created" or "Updated"
  *  @param  inID        incoming issue id
  *  @param  inUrl       url of the issue
  *
  *  @return void 
  */
  public void initEmail(String inMailType, int inID, String inUrl) {

    String[] mailArr = new String[2];
    
    try{
      
      // get the email array of mail header [0] and mail content [1]
      mailArr = getContent(inMailType, inID, inUrl);
      System.out.println(mailArr[0]);
      System.out.println(mailArr[1]);
      
      
      
      // gets all involved emails
      String[] involvedArr = getInvolved(inID);
      System.out.println("EMAIL ARRAY LENGTH : " + involvedArr.length);
      // and steps though the array and send off emails
      for(int i=0; i<= involvedArr.length-1; i++) {
        sendIssueNotification(mailArr[0], mailArr[1], involvedArr[i]);
        log(INFO, "Email send to address: " + involvedArr[i].toString());
        System.out.println(involvedArr[i]);
      }
    
    } catch (Exception e) {
      log(ERROR, "Error in method initEmail: ", e);
    }
  }
  
  /**
  *  returns all involved emails
  *
  *  @param  inID     incoming issue id
  *  @return String array of all involved emails
  */
  public String[] getInvolved(int inID) {
  
    String[] emailArr = {};

    try{
    
      // get the emails involved in the issue
      List<GetIssueEmailsRtnType> emailsIssue = dbService.getIssueEmails(inID);
      
      ArrayList imArr = new ArrayList();
      
      for (GetIssueEmailsRtnType el : emailsIssue) {
        imArr.add(el.getReporter());
        imArr.add(el.getAssignee());
      }
      
      // get the emails involved in the comments
      List<GetCommentEmailsRtnType> emailsComment = dbService.getCommentEmails(inID);
      
      ArrayList cmArr = new ArrayList();
      
      for (GetCommentEmailsRtnType cm : emailsComment) {
        cmArr.add(cm.getEmail());
      }
      
      // merge both arrayLists together
      for(int a = 0; a < cmArr.size(); a++){          
        imArr.add(cmArr.get(a));
      }
      
      /*
      *  because HashSet doesn't add duplicates 
      *  all entries are unique email addresses
      */
      HashSet<String> mailFilter = new HashSet();
      
      for(int i=0; i< imArr.size(); i++){
        mailFilter.add((String) imArr.get(i));
      }
      
      emailArr = (String[]) mailFilter.toArray(new String[mailFilter.size()]); 

    } catch(Exception e) {
      log(ERROR, "Error in method getInvolved: ", e);
    }
    return emailArr;
  } 
  
  /**
  *  returns a string containing all
  *  information to send via email
  *
  *  @param  inID, inUrl    incoming issue id, url
  *  @return String         email content
  */
  private String[] getContent(String inMailType, int inID, String inUrl) {
    
    String[] retArr = new String[2];
    StringBuffer header = new StringBuffer();
    StringBuffer mailContent = new StringBuffer();
    int counter = 1;

    try{
    
      GetIssueContentRtnType iContent = dbService.getIssueContent(inID);
      JSSendMail sm = new JSSendMail();
      
      // populating header text
      header.append("[" + iContent.getProject() + "]: ");
      header.append(inMailType + ": (");
      header.append(iContent.getKey() +") ");
      header.append(iContent.getSummary());
      
      // store the header on pos 0
      retArr[0] = header.toString();
      
      // populating mail content
      mailContent.append("\n\n");
      mailContent.append("Summary: " + iContent.getSummary());
      mailContent.append("\n");
      mailContent.append(sm.createUnderline("-",70));
      mailContent.append("\n\n");
      mailContent.append("\t" + "Issue Key: " + iContent.getKey());
      mailContent.append("\n");
      mailContent.append("\t" + "URL: " + inUrl);
      mailContent.append("\n");
      mailContent.append("\t" + "Project: " + iContent.getProject());
      mailContent.append("\n");
      mailContent.append("\t" + "Issue Type: " + iContent.getType());
      mailContent.append("\n");
      mailContent.append("\t" + "Reported Version: " + iContent.getReportedversion());
      mailContent.append("\n");
      mailContent.append("\t" + "Fixed Version: " + iContent.getFixedversion());
      mailContent.append("\n");
      mailContent.append("\t" + "Reporter: " + iContent.getReporter());
      mailContent.append("\n");
      mailContent.append("\t" + "Assignee: " + iContent.getAssignee());
      mailContent.append("\n");
      mailContent.append("\t" + "Status: " + iContent.getStatus());
      mailContent.append("\n\n");
      mailContent.append("\t" + sm.createUnderline("-",60));
      mailContent.append("\n\n");
      if(iContent.getDescription() != null) {
        mailContent.append("\t" + "Description: " + iContent.getDescription().replaceAll("\\<[^>]*>","").trim());
      } else {
        mailContent.append("\t" + "Description: <N/A>");
      }
      mailContent.append("\n\n");
      mailContent.append("\t" + sm.createUnderline("-",60));

      List<GetCommentContentRtnType> cContent = dbService.getCommentContent(inID);
      
      if(cContent != null) {
        for (GetCommentContentRtnType co : cContent) {
          mailContent.append("\n\n");
          mailContent.append("\t" + "Comment " + counter + " :");
          mailContent.append("\n\n");
          mailContent.append("\t" + "Comment by : " + co.getReporter());
          mailContent.append("\t" + " at: " + co.getDate());
          mailContent.append("\n");
          mailContent.append("\t" + "Description: " + co.getComment().replaceAll("\\<[^>]*>","").trim());
          mailContent.append("\n\n");
          mailContent.append("\t" + createUnderline("-",60));
          counter++;
        }
      }
      
      mailContent.append("\n\n");
      mailContent.append(sm.rbIssue.getString("mailEndMsg"));
      
      // store the header on pos 0
      retArr[1] = mailContent.toString();

    } catch(Exception e) {
      log(ERROR, "Error in method getContent: ", e);
    }
    return retArr;
  }
  
  /**
  *  send an email to the specified email addresses
  * 
  *  @param inHeader    email header information
  *  @param inContent   email content information
  *  @param inEmail     email address
  *  @return void 
  */
  private void sendIssueNotification(String inHeader, String inContent, String inEmail){ 
    
    String strMailType = null;

    try{
      
      // set parameters from the properties file
      String smtpHost = rbIssue.getString("smtpHost");
      String smtpHostUser = rbIssue.getString("smtpHostUser");
      String smtpHostPassword = rbIssue.getString("smtpHostPassword");
      String from = rbIssue.getString("mailFrom");
        
      // set the session properties
      Properties props = System.getProperties();
      props.put("mail.smtp.starttls.enable", "true");
      props.put("mail.smtp.host", smtpHost);
      props.put("mail.smtp.port", "587");
      props.put("mail.smtp.auth", "true");
      props.put("mail.smtp.starttls.required", "true");
      Session session = Session.getDefaultInstance(props, null);
  
      // create email message
      MimeMessage message = new MimeMessage(session);
      message.setFrom(new InternetAddress(from));
      message.addRecipient(Message.RecipientType.TO, new InternetAddress(inEmail));
      message.setSubject(inHeader);
      message.setText(inContent);
  
      // send email message
      Transport tr = session.getTransport("smtp");
      tr.connect(smtpHost, 587, smtpHostUser, smtpHostPassword);
      message.saveChanges();
      tr.sendMessage(message, message.getAllRecipients());
      tr.close();

    } catch (MessagingException e) {
      log(ERROR, "Error in method sendIssueNotification: ", e);
    }
  }

  private String createUnderline(String chr, int count) {
    StringBuffer retString = new StringBuffer();
    for(int i=0; i<=count; i++){
      retString.append(chr);
    }
    return retString.toString();
  }

}


package com.wavemaker.studio.cloud;

import java.util.Date;
import java.util.Properties;
import java.util.Random;
import java.util.ResourceBundle;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.studio.clouddb.CloudDB;
import com.wavemaker.studio.clouddb.data.User;

public class UserService {

    private static ResourceBundle rb = ResourceBundle.getBundle("registration");
    private CloudDB clouddb;
    
    public UserService() {
        //clouddb = (CloudDB) RuntimeAccess.getInstance().getService(
        //        CloudDB.class);
        clouddb = (CloudDB) RuntimeAccess.getInstance().getSpringBean(
                "CloudDB");
    }

    public boolean createUser(String email) throws AddressException,
            MessagingException {
        if (clouddb.getUserById(email) != null) {
            return false;
        }
        User user = new User();
        user.setEmail(email);
        String password = generatePassword();
        user.setPassword(password);
        user.setCreateDate(new Date());
        clouddb.insert(user);
        sendEmailNotification(email, password, 
                rb.getString("newUserMailSubject"),
                rb.getString("newUserMailMsg"));
        return true;
    }

    public boolean resetPassword(String email) throws AddressException,
            MessagingException {
        User user = clouddb.getUserById(email);
        if (user == null) {
            return false;
        }
        String password = generatePassword();
        user.setPassword(password);
        clouddb.update(user);
        sendEmailNotification(email, password, 
                rb.getString("resetPwdMailSubject"),
                rb.getString("resetPwdMailMsg"));
        return true;
    }

    private static String generatePassword() {
        Random r = new Random();
        return Long.toString(Math.abs(r.nextLong()), 36);
    }

    private static void sendEmailNotification(String email, String password,
            String subject, String mainMsg) throws AddressException,
            MessagingException {
        String smtpHost = rb.getString("smtpHost");
        String smtpHostUser = rb.getString("smtpHostUser");
        String smtpHostPassword = rb.getString("smtpHostPassword");
        String from = rb.getString("mailFrom");
        StringBuffer mailContent = new StringBuffer();
        mailContent.append(mainMsg);
        mailContent.append("\n\n");
        mailContent.append(rb.getString("mailMainMsg"));
        mailContent.append("\n\n");
        mailContent.append(rb.getString("mailEmailCaption"));
        mailContent.append(email);
        mailContent.append("\n");
        mailContent.append(rb.getString("mailPasswordCaption"));
        mailContent.append(password);
        mailContent.append("\n\n");
        mailContent.append(rb.getString("mailEndMsg"));

        Properties props = System.getProperties();
        props.put("mail.smtp.host", smtpHost);
        props.put("mail.smtp.auth", "true");
        Session session = Session.getDefaultInstance(props, null);
        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress(from));
        message.addRecipient(Message.RecipientType.TO, new InternetAddress(email));
        message.setSubject(subject);
        message.setText(mailContent.toString());
        Transport tr = session.getTransport("smtp");
        tr.connect(smtpHost, 25, smtpHostUser, smtpHostPassword);
        message.saveChanges();
        tr.sendMessage(message, message.getAllRecipients());
        tr.close();
    }

}

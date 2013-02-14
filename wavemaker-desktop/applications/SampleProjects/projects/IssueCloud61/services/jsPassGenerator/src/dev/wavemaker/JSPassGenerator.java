package dev.wavemaker;

import java.util.Random;

public class JSPassGenerator extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {

  public JSPassGenerator() {
    super(INFO);
  }
  
  protected Random m_generator = new Random();
    
  // assigning all usuable characters
  public static final String DIGITS               = "0123456789";
  public static final String LOCASE_CHARACTERS    = "abcdefghijklmnopqrstuvwxyz";
  public static final String UPCASE_CHARACTERS    = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  public static final String PRINTABLE_CHARACTERS = DIGITS + LOCASE_CHARACTERS + UPCASE_CHARACTERS; 

  /**
  *  create random password of a given length
  *  password lenght MUST be greater than 4
  *  
  *  @param    incoming character length (int)
  *  @return   return new password
  */
  public String generate (int passLength) {
    String retPass = null;
    
    if(passLength <= 4) {
      retPass = "Password too short";
      return retPass;
    }
    
    try {

      char[] availableChars = PRINTABLE_CHARACTERS.toCharArray();
      int availableCharsLeft = availableChars.length;
      StringBuffer temp = new StringBuffer(passLength);
      for (int i = 0; i < passLength; i++) {
        int pos = (int) (availableCharsLeft * m_generator.nextDouble());
        temp.append(availableChars[pos]);
        availableChars[pos] = availableChars[availableCharsLeft - 1];
        --availableCharsLeft;
      }
      retPass = String.valueOf(temp);
      
    } catch(Exception e) {
      log(ERROR, "Error in method generate: ", e);
    }      
    return retPass;
  }    

}

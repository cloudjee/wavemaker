/*
 *  Copyright (C) 2007-2010 WaveMaker Software, Inc.
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
package com.util;

//import de.schlichtherle.license.*;

import javax.crypto.*;
import javax.security.auth.x500.X500Principal;
import java.io.*;
import java.security.*;
import java.util.*;
import java.util.prefs.Preferences;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.InterfaceAddress;
import java.net.InetAddress;

import com.wavemaker.tools.license.LicenseManagerExt;
import com.wavemaker.tools.license.LicenseContentExt;
import com.wavemaker.tools.license.LicenseUtil;
import com.wavemaker.tools.license.LicenseProcessor;
import com.Test;
import de.schlichtherle.license.LicenseManager;
import de.schlichtherle.license.LicenseParam;
import de.schlichtherle.license.LicenseContent;
import de.schlichtherle.license.KeyStoreParam;
import de.schlichtherle.license.CipherParam;
import de.schlichtherle.license.wizard.LicenseWizard;


/**
 * Created for the purpose of testing TLC
 *
 * @author S Lee
 *
 */
public class LicenseHandler
{
    KeyStoreParam privateKeyStoreParam;
    CipherParam cipherParam;
    LicenseParam licenseParam;

    KeyStoreParam publicKeyStoreParam;

    public void createLicenseKey(String licensee, String type, String macAddr, int period, String version) {
        privateKeyStoreParam = new KeyStoreParam() {
            public InputStream getStream() throws IOException {
                final String resourceName = "privateKeys.store";
                final InputStream in = getClass().getResourceAsStream(resourceName);
                if (in == null)
                    throw new FileNotFoundException(resourceName);
                return in;
            }
            public String getAlias() {
                return "privatekey";
            }
            public String getStorePwd() {
                return "wm1studio";
            }
            public String getKeyPwd() {
                return "wm1studio";
            }
        };

        cipherParam = new CipherParam() {
            public String getKeyPwd() {
                return "cip1her";
            }
        };

        licenseParam = new LicenseParam() {
            public String getSubject() {
                return "Studio";
            }
            public Preferences getPreferences() {
                return Preferences.userNodeForPackage(LicenseProcessor.class);
            }
            /*public KeyStoreParam getFTPKeyStoreParam() {
                return privateKeyStoreParam;
            }*/
            public KeyStoreParam getKeyStoreParam() {
                return privateKeyStoreParam;
            }
            public CipherParam getCipherParam() {
                return cipherParam;
            }
            /*public int getFTPDays() {
                return 0;
            }

            public boolean isFTPEligible() {
                return true;
            }
            public LicenseContent createFTPLicenseContent() {
                return null;
            }
            public void removeFTPEligibility() {
                //return 0;
            }
            public void ftpGranted(LicenseContent content) {

            }*/
        };

        LicenseContentExt content = createLicenseContent(licensee, type, macAddr, period, version);
       
        // Create a configured license manager.
        LicenseManager manager = new LicenseManager(licenseParam);
        try {
            // Create the license key from the license content and save it to a file.
            manager.store(content, new File("license.lic"));
            System.out.println("License created successfully!");
        } catch (Exception exc) {
            System.err.println("Could not save license key");
            exc.printStackTrace();
        }
    }

    LicenseContentExt createLicenseContent(String licensee, String type, String macAddr, int period, String version) {
        LicenseContentExt result = new LicenseContentExt();
        //X500Principal holder = new X500Principal("CN=The Using Firm");
        X500Principal holder = new X500Principal("CN=licensee");
        result.setHolder(holder);
        X500Principal issuer = new X500Principal(
            "CN=WaveMaker Software, L=San Francisco, ST=California, O=blox,"
            + " OU=Software Development,"
            + " C=United States,"
            + " STREET=1000 Sansome Street Suite 250, "
            + " DC=US UID=Studio");
        result.setIssuer(issuer);
        //result.setConsumerAmount(10000);
        result.setConsumerAmount(1);
        //result.setConsumerType("Documents");
        result.setConsumerType("User");
        //result.setInfo("Limit the number of documents that can be used");
        //result.setInfo("Limit the number of users that can be used");
        /*byte[] macAddr;
        String info;
        try {
            InetAddress address = InetAddress.getLocalHost();
            NetworkInterface ni = NetworkInterface.getByInetAddress(address);
            macAddr = ni.getHardwareAddress();
            info = new String(macAddr);
        } catch (Exception e) {
            e.printStackTrace();
            info = "";
        }*/

        //result.setInfo(LicenseManagerExt.getMacAddr());
        result.setLicensee(licensee);
        result.setType(type);
        result.setMacAddr(macAddr);
        result.setVersion(version);

        /*Date now = new Date();
        result.setIssued(now);
        now.setYear(now.getYear() + 1);
        result.setNotAfter(now);*/
        result.setSubject(licenseParam.getSubject());
        Calendar cal = Calendar.getInstance();
        //cal.add(Calendar.DAY_OF_MONTH, 3);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        cal.add(Calendar.DATE, period+1);
        Date exp = cal.getTime();
        result.setNotAfter(exp);

        cal = Calendar.getInstance();

        Date beg = cal.getTime();
        result.setNotBefore(beg);

        result.setSubject(licenseParam.getSubject());
        return result;
    }

    public void createLicenseKey(LicenseParam parameter, LicenseContent content) {
        // Create a configured license manager.
        LicenseManager manager = new LicenseManager(parameter);
        try {
            // Create the license key from the license content and save it to a file.
            manager.store(content, new File("license.lic"));
        } catch (Exception exc) {
            System.err.println("Could not save license key");
            exc.printStackTrace();
        }
    }

    public void installLicense() {
        publicKeyStoreParam = new KeyStoreParam() {
            public InputStream getStream() throws IOException {
                final String resourceName = "publicCerts.store";
                final InputStream in = getClass().getResourceAsStream(resourceName);
                if (in == null)
                throw new FileNotFoundException(resourceName);
                return in;
            }
            public String getAlias() {
                return "publiccert";
            }
            public String getStorePwd() {
                return "wm2studio";
            }
            public String getKeyPwd() {
                // These parameters are not used to create any licenses.
                // Therefore there should never be a private key in the keystore
                // entry. To enforce this policy, we return null here.
                return null; // causes failure if private key is found in this entry
            }
        };

        cipherParam = new CipherParam() {
            public String getKeyPwd() {
                return "cip1her";
            }
        };

        licenseParam = new LicenseParam() {
            public String getSubject() {
                return "Studio";
            }
            public Preferences getPreferences() {
                return Preferences.userNodeForPackage(LicenseProcessor.class);
            }
            /*public KeyStoreParam getFTPKeyStoreParam() {
                return privateKeyStoreParam;
            }*/
            public KeyStoreParam getKeyStoreParam() {
                return publicKeyStoreParam;
            }
            public CipherParam getCipherParam() {
                return cipherParam;
            }

            /*public int getFTPDays() {
                return 0;
            }

            public boolean isFTPEligible() {
                return true;
            }
            public LicenseContent createFTPLicenseContent() {
                return null;
            }
            public void removeFTPEligibility() {
                //return 0;
            }
            public void ftpGranted(LicenseContent content) {

            }*/

        };

        LicenseManagerExt lm = new LicenseManagerExt(licenseParam);
        File licenseFile = new File("license.lic");
        try {
            lm.installExt(licenseFile);
        } catch (Exception exc) {
            System.err.println("Could not install license");
            exc.printStackTrace();
        }
    }

    public void verifyLicense() {
         publicKeyStoreParam = new KeyStoreParam() {
            public InputStream getStream() throws IOException {
                final String resourceName = "publicCerts.store";
                final InputStream in = getClass().getResourceAsStream(resourceName);
                if (in == null)
                throw new FileNotFoundException(resourceName);
                return in;
            }
            public String getAlias() {
                return "publiccert";
            }
            public String getStorePwd() {
                return "wm2studio"; //correct
                //return "wm3studio"; //wrong (for test)
            }
            public String getKeyPwd() {
                // These parameters are not used to create any licenses.
                // Therefore there should never be a private key in the keystore
                // entry. To enforce this policy, we return null here.
                return null; // causes failure if private key is found in this entry
            }
        };

        cipherParam = new CipherParam() {
            public String getKeyPwd() {
                return "cip1her";
                //return "cip2her";
            }
        };

        licenseParam = new LicenseParam() {
            public String getSubject() {
                return "Studio";
            }
            public Preferences getPreferences() {
                return Preferences.userNodeForPackage(LicenseProcessor.class);
            }
            public KeyStoreParam getKeyStoreParam() {
                return publicKeyStoreParam;
            }
            public CipherParam getCipherParam() {
                return cipherParam;
            }
        };
        
        LicenseManagerExt lm = new LicenseManagerExt(licenseParam);
        LicenseContentExt lc = null;
        try {
            lc = lm.verifyExt();
        } catch (Exception exc) {
            System.err.println("Invalid license");
            exc.printStackTrace();
        }
        System.out.println(lc.getSubject() +" licensed for use on up to "
        +lc.getConsumerAmount() + " " + lc.getConsumerType());
        /*String result = LicenseProcessor.verifyLicense();
        if (result.length() == 0) result = "License is valid";
        System.out.println(result);*/
    }

    public void verifyLicenseNew() {

        String result = LicenseProcessor.verifyLicense();
        if (result.length() == 0) result = "License is valid";
        System.out.println(result);
    }

    public void licenseWizard() {
         publicKeyStoreParam = new KeyStoreParam() {
            public InputStream getStream() throws IOException {
                final String resourceName = "publicCerts.store";
                final InputStream in = getClass().getResourceAsStream(resourceName);
                if (in == null)
                throw new FileNotFoundException(resourceName);
                return in;
            }
            public String getAlias() {
                return "publiccert";
            }
            public String getStorePwd() {
                return "wm2studio";
            }
            public String getKeyPwd() {
                // These parameters are not used to create any licenses.
                // Therefore there should never be a private key in the keystore
                // entry. To enforce this policy, we return null here.
                return null; // causes failure if private key is found in this entry
            }
        };

        publicKeyStoreParam = new KeyStoreParam() {
            public InputStream getStream() throws IOException {
                final String resourceName = "publicCerts.store";
                final InputStream in = getClass().getResourceAsStream(resourceName);
                if (in == null)
                throw new FileNotFoundException(resourceName);
                return in;
            }
            public String getAlias() {
                return "publiccert";
            }
            public String getStorePwd() {
                return "wm2studio";
            }
            public String getKeyPwd() {
                // These parameters are not used to create any licenses.
                // Therefore there should never be a private key in the keystore
                // entry. To enforce this policy, we return null here.
                return null; // causes failure if private key is found in this entry
            }
        };

        cipherParam = new CipherParam() {
            public String getKeyPwd() {
                return "cip1her";
            }
        };

        licenseParam = new LicenseParam() {
            public String getSubject() {
                return "Studio";
            }
            public Preferences getPreferences() {
                return Preferences.userNodeForPackage(LicenseProcessor.class);
            }
            public KeyStoreParam getFTPKeyStoreParam() {
                return publicKeyStoreParam;
            }
            public KeyStoreParam getKeyStoreParam() {
                return publicKeyStoreParam;
            }
            public CipherParam getCipherParam() {
                return cipherParam;
            }
            public int getFTPDays() {
                return 5;
            }

            public boolean isFTPEligible() {
                return true;
            }
            public LicenseContent createFTPLicenseContent() {
                return null;
            }
            public void removeFTPEligibility() {
                //return 0;
            }
            public void ftpGranted(LicenseContent content) {

            }
        };

        LicenseManager lm = new LicenseManager(licenseParam);
        LicenseWizard lw = new LicenseWizard(lm);
        lw.showModalDialog();
    }

    public void listJCEProviderInfo(String[] args) {
        Provider[] providers = Security.getProviders();
        for (int i = 0; i < providers.length; i++) {
            Provider provider = providers[i];
            System.out.println("Provider name: " + provider.getName());
           System.out.println("Provider information: " + provider.getInfo());
            System.out.println("Provider version: " + provider.getVersion());
            Set entries = provider.entrySet();
            Iterator iterator = entries.iterator();
           while (iterator.hasNext()) {
                System.out.println("Property entry: " + iterator.next());
            }
        }
    }

    public void genKey(String[] args) {
        Security.addProvider(new com.sun.crypto.provider.SunJCE());
        try {
            KeyGenerator kg = KeyGenerator.getInstance("PKCS");
            Key key = kg.generateKey();
            System.out.println("Key format: " + key.getFormat());
            System.out.println("Key algorithm: " + key.getAlgorithm());
            System.out.println("Secret Key " + key.getEncoded());
        }
        catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
    }

    public void genCipher(String[] args) {
        Security.addProvider(new com.sun.crypto.provider.SunJCE());
        try {
            Cipher cipher = Cipher.getInstance("RSA");
            System.out.println("Cipher provider: " + cipher.getProvider());
            System.out.println("Cipher algorithm: " + cipher.getAlgorithm());
        }
        catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        catch (NoSuchPaddingException e) {
            e.printStackTrace();
        }

    }

    public void encrypt(String[] args) {
        Security.addProvider(new com.sun.crypto.provider.SunJCE());
        try {
            KeyGenerator kg = KeyGenerator.getInstance("RSA");
            Key key = kg.generateKey();
            Cipher cipher = Cipher.getInstance("RSA");

            byte[] data = "Hello World!".getBytes();
            System.out.println("Original data : " + new String(data));

            cipher.init(Cipher.ENCRYPT_MODE, key);
            byte[] result = cipher.doFinal(data);
            System.out.println("Encrypted data: " + new String(result));

            cipher.init(Cipher.DECRYPT_MODE, key);
            byte[] original = cipher.doFinal(result);
            System.out.println("Decrypted data: " + new String(original));
        }
        catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        catch (NoSuchPaddingException e) {
            e.printStackTrace();
        }
        catch (InvalidKeyException e) {
            e.printStackTrace();
        }
        catch (IllegalStateException e) {
            e.printStackTrace();
        }
        catch (IllegalBlockSizeException e) {
            e.printStackTrace();
        }
        catch (BadPaddingException e) {
            e.printStackTrace();
        }
    }

    public void getHardWareInfo() {
        try {
            InetAddress address = InetAddress.getLocalHost();

            /*
             * Get NetworkInterface for the current host and then read the
             * hardware address.
             */
            System.out.println(address.getCanonicalHostName());
            System.out.println(address.getHostAddress());
            System.out.println(address.isSiteLocalAddress() );
            NetworkInterface ni = NetworkInterface.getByInetAddress(address);

            /*Enumeration<NetworkInterface> en = NetworkInterface.getNetworkInterfaces();
            while (en.hasMoreElements()) {
              NetworkInterface ni = en.nextElement();
              printParameter(ni);
            }*/
            printParameter(ni);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void printParameter(NetworkInterface ni) throws SocketException {
        System.out.println(" Name = " + ni.getName());
        System.out.println(" Display Name = " + ni.getDisplayName());
        System.out.println(" Is up = " + ni.isUp());
        System.out.println(" Support multicast = " + ni.supportsMulticast());
        System.out.println(" Is loopback = " + ni.isLoopback());
        System.out.println(" Is virtual = " + ni.isVirtual());
        System.out.println(" Is point to point = " + ni.isPointToPoint());

        System.out.println(" Hardware address = " + LicenseUtil.getMacAddr());
        
        System.out.println(" MTU = " + ni.getMTU());

        System.out.println("\nList of Interface Addresses:");
        List<InterfaceAddress> list = ni.getInterfaceAddresses();
        Iterator<InterfaceAddress> it = list.iterator();
        
        while (it.hasNext()) {
          InterfaceAddress ia = it.next();
          System.out.println(" Address = " + ia.getAddress());
          System.out.println(" Broadcast = " + ia.getBroadcast());
          System.out.println(" Network prefix length = " + ia.getNetworkPrefixLength());
          System.out.println("");
        }
      }

    public static boolean isMac(){
        String os = System.getProperty("os.name").toLowerCase();
        //Mac
        return (os.indexOf( "mac" ) >= 0); 
    }



}
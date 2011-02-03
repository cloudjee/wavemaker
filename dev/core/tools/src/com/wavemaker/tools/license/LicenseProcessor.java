/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
package com.wavemaker.tools.license;

import java.util.prefs.Preferences;
import java.util.Date;
import java.io.*;

import de.schlichtherle.license.*;
import org.springframework.web.multipart.MultipartFile;
import com.wavemaker.common.WMRuntimeException;

/**
 * @author slee
 * 
 */
public class LicenseProcessor {

    public final static double MILLISECONDS_IN_DAY = 1000*60*60*24;

    public static String installLicense(MultipartFile file) {
        String rtn;

        final KeyStoreParam publicKeyStoreParam = new KeyStoreParam() {
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

        final CipherParam cipherParam = new CipherParam() {
            public String getKeyPwd() {
                return "cip1her";
            }
        };

        LicenseParam licenseParam = new LicenseParam() {
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
        try {
            lm.install(file.getBytes(), lm.getLicenseNotary());
        } catch (Exception exc) {
            rtn = "Could not install license";
            //exc.printStackTrace();
            return rtn;
        }

        rtn = "OK";
        return rtn;
    }

    public static LicenseContentExt verifyLicense1() {

        final KeyStoreParam publicKeyStoreParam = new KeyStoreParam() {
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
                // entry. To enforce this policy,38 we return null here.
                return null; // causes failure if private key is found in this entry
            }
        };

        final CipherParam cipherParam = new CipherParam() {
            public String getKeyPwd() {
                return "cip1her";
                //return "cip2her";
            }
        };

        final LicenseParam licenseParam = new LicenseParam() {
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
            exc.printStackTrace();
            throw new WMRuntimeException(exc);
            //return null;
        }

        return lc;
    }

    public static String verifyLicense() throws WMRuntimeException {
        LicenseContentExt lc = verifyLicense1();
        if (lc == null)
            return "Invalid License";
        else
            return "";
    }

    public static int getLicenseExpiration() throws WMRuntimeException {
        LicenseContentExt lc = verifyLicense1();
        if (lc == null) return -1;

        Date expDate = lc.getNotAfter();
        Date now = new Date();

        long diff = expDate.getTime() - now.getTime();

        if (diff < 0) return -1;
        
        double days = diff / MILLISECONDS_IN_DAY;

        return (int)days;
    }
}
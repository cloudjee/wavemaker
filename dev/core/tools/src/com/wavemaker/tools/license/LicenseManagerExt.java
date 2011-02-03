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

import de.schlichtherle.license.*;
import de.schlichtherle.xml.GenericCertificate;

import java.io.File;

import com.wavemaker.tools.project.StudioConfiguration;

public class LicenseManagerExt extends LicenseManager {

    public LicenseManagerExt(LicenseParam param) throws  NullPointerException,
            IllegalPasswordException {
        super(param);
    }

    public synchronized LicenseContentExt verifyExt() throws Exception {
        LicenseContentExt lc = verify(getLicenseNotary());

        if (lc == null) return null;

        String macAddr = lc.getMacAddr();
        if (!LicenseUtil.hardwareMatched(macAddr)) {
            throw new Exception("Mis-matched hardware information in the license");
        }

        String email = lc.getLicensee();
        String type = lc.getType();
        String LicenseVersion = lc.getVersion();
        String currentVersion = StudioConfiguration.getCurrentVersionInfo().toString();

        if (type.equalsIgnoreCase("Perpetual")) {
            if (!LicenseVersion.equals(currentVersion)) {
                String msg = "License version and Studio version do not match\n" +
                            "     License version = " + LicenseVersion + "\n" +
                            "     Studio version  = " + currentVersion + "\n";
                throw new Exception(msg);    
            }
        }

        return lc;
    }

    @Override
    protected synchronized LicenseContentExt verify(LicenseNotary notary)
    throws Exception {
        GenericCertificate certificate = getCertificate();
        if (certificate != null)
            return (LicenseContentExt) certificate.getContent();

        // Load license key from preferences,
        byte[] key = getLicenseKey();
        if (key == null)
            throw new NoLicenseInstalledException(getLicenseParam().getSubject());
        certificate = getPrivacyGuard().key2cert(key);
        notary.verify(certificate);
        Object result = certificate.getContent();
        LicenseContentExt content = (LicenseContentExt) result;
        validate(content);
        setCertificate(certificate);

        return content;
    }

    public synchronized LicenseNotary getLicenseNotary() {
        return super.getLicenseNotary();
    }

    public synchronized LicenseContentExt installExt(File keyFile)
    throws Exception {
        return install(keyFile, getLicenseNotary());
    }

    protected synchronized LicenseContentExt install(
            File keyFile,
            LicenseNotary notary)
    throws Exception {
        return install(loadLicenseKey(keyFile), notary);
    }

   @Override
   protected synchronized LicenseContentExt install(
            byte[] key,
            LicenseNotary notary)
    throws Exception {
        GenericCertificate certificate = getPrivacyGuard().key2cert(key);
        notary.verify(certificate);
        LicenseContentExt content = (LicenseContentExt) certificate.getContent();
        validate(content);
        setLicenseKey(key);
        setCertificate(certificate);

        return content;
    }
}

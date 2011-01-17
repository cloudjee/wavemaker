package com.wavemaker.tools.license;

import de.schlichtherle.license.*;
import de.schlichtherle.xml.GenericCertificate;

import java.net.InetAddress;
import java.net.NetworkInterface;
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
        String myMacAddr = getMacAddr();
        /*if (!macAddr.equals(getMacAddr())) {
            throw new Exception("Mis-matched hardware information in the license");
        }*/

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
    protected synchronized LicenseContentExt verify(final LicenseNotary notary)
    throws Exception {
        GenericCertificate certificate = getCertificate();
        if (certificate != null)
            return (LicenseContentExt) certificate.getContent();

        // Load license key from preferences,
        final byte[] key = getLicenseKey();
        if (key == null)
            throw new NoLicenseInstalledException(getLicenseParam().getSubject());
        certificate = getPrivacyGuard().key2cert(key);
        notary.verify(certificate);
        final LicenseContentExt content = (LicenseContentExt) certificate.getContent();
        validate(content);
        setCertificate(certificate);

        return content;
    }

    public static String getMacAddr() {
        byte[] macAddr;
        String info;
        try {
            InetAddress address = InetAddress.getLocalHost();
            NetworkInterface ni = NetworkInterface.getByInetAddress(address);
            macAddr = ni.getHardwareAddress();
            info = new String(macAddr);
        } catch (Exception e) {
            e.printStackTrace();
            info = "";
        }

        return info;
        //return "";
    }

    public synchronized LicenseNotary getLicenseNotary() {
        return super.getLicenseNotary();
    }

    /*public synchronized LicenseContentExt install(
            final byte[] key,
            final LicenseNotary notary) throws Exception {
        //return super.install(key, notary);
        return install(key, notary);
    }*/

    public synchronized LicenseContentExt installExt(File keyFile)
    throws Exception {
        return install(keyFile, getLicenseNotary());
    }

    protected synchronized LicenseContentExt install(
            final File keyFile,
            final LicenseNotary notary)
    throws Exception {
        return install(loadLicenseKey(keyFile), notary);
    }

   @Override
   protected synchronized LicenseContentExt install(
            final byte[] key,
            final LicenseNotary notary)
    throws Exception {
        final GenericCertificate certificate = getPrivacyGuard().key2cert(key);
        notary.verify(certificate);
        final LicenseContentExt content = (LicenseContentExt) certificate.getContent();
        validate(content);
        setLicenseKey(key);
        setCertificate(certificate);

        return content;
    }
}

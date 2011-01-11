package com.wavemaker.runtime.license;

import de.schlichtherle.license.*;
import de.schlichtherle.xml.GenericCertificate;

import java.net.InetAddress;
import java.net.NetworkInterface;

public class LicenseManagerExt extends LicenseManager {

    public LicenseManagerExt(LicenseParam param) throws  NullPointerException,
            IllegalPasswordException {
        super(param);
    }

    public synchronized LicenseContent verifyExt() throws Exception {
        LicenseContent lc = super.verify(getLicenseNotary());

        String info = lc.getInfo();
        /*if (!info.equals(getMacAddr())) {
            throw new Exception("Mis-matched hardware information in the license");
        }*/

        return lc;
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
    }

    public synchronized LicenseNotary getLicenseNotary() {
        return super.getLicenseNotary();
    }

    public synchronized LicenseContent install(
            final byte[] key,
            final LicenseNotary notary) throws Exception {
        return super.install(key, notary);
    }
}

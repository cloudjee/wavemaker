package com.wavemaker.runtime.license;

import de.schlichtherle.license.LicenseContent;

/**
 * Extend LicenseContent to contain additional info
 *
 * @author slee
 */
public class LicenseContentExt extends LicenseContent {

    private byte[] macAddr;


    public byte[] getMacAddr() {
        return this.macAddr;
    }

    public void setMacAddr(byte[] val) {
        this.macAddr = val;
    }
}

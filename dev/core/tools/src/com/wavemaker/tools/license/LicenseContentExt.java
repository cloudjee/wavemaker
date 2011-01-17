package com.wavemaker.tools.license;

import de.schlichtherle.license.LicenseContent;

/**
 * Extend LicenseContent to contain additional info
 *
 * @author slee
 */
public class LicenseContentExt extends LicenseContent {

    private String licensee;
    private String type; //Trial or Perpetual
    private String macAddr;
    private String version;

    public String getLicensee() {
        return this.licensee;
    }

    public void setLicensee(String val) {
        this.licensee = val;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String val) {
        this.type = val;
    }

    public String getMacAddr() {
        return this.macAddr;
    }

    public void setMacAddr(String val) {
        this.macAddr = val;
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String val) {
        this.version = val;
    }
}

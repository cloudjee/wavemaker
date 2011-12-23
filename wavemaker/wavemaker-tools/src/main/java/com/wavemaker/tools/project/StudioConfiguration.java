
package com.wavemaker.tools.project;

import java.util.Map;

import com.wavemaker.runtime.RuntimeAccess;

public interface StudioConfiguration {

    RuntimeAccess getRuntimeAccess();

    Map<String, String> getPreferencesMap();

    void setPreferencesMap(Map<String, String> prefs);

    /**
     * Returns true if studio upgrades are supported. If this method returns false the {@link #getCurrentUpgradeKey()}
     * and {@link #setCurrentUpgradeKey(double)} methods must not be called.
     * 
     * @return true if studio upgrade is supported
     */
    boolean isStudioUpgradeSupported();

    /**
     * Returns any previously stored {@link #setCurrentUpgradeKey(Double) upgrade key}. This key is used to track what
     * upgrade tasks should be applied. Once upgrade is complete the {@link #setCurrentUpgradeKey(Double)} method should
     * be called.
     * 
     * @return the current upgrade key
     * @see #setCurrentUpgradeKey(Double)
     */
    double getCurrentUpgradeKey();

    /**
     * Sets the current upgrade key. This method should be called to ensure that updates are not re-applied.
     * 
     * @param key the upgrade key
     * @see #getCurrentUpgradeKey()
     */
    void setCurrentUpgradeKey(double key);

}
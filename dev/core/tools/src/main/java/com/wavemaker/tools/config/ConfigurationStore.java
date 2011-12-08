/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.tools.config;

import java.io.IOException;
import java.util.prefs.BackingStoreException;
import java.util.prefs.Preferences;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.project.LocalStudioConfiguration;
import com.wavemaker.tools.project.VersionInfo;

/**
 * Main configuration storage interface for WaveMaker. Wraps {@link Preferences} in a system-independent manner.
 * 
 * Also adds versioning to preferences. When a preference is marked as "versioned", the follow behaviour is used.
 * 
 * The version information from {@link LocalStudioConfiguration#getCurrentVersionInfo()} is used. When writing:
 * 
 * The value is always written to a sub-node of the requested key, with the version information contained. For instance,
 * if the key is "com/wavemaker/studio/FileLocation", and {@link LocalStudioConfiguration#getCurrentVersionInfo()}
 * returns 1.2.3, then the value will be written to "com/wavemaker/studio/FileLocation/1.2.3/FileLocation".
 * 
 * And when reading Preferences:
 * <ol>
 * <li>If only the requested key exists (but it has no children), the value from that key is returned.</li>
 * <li>If the requested key has children which have proper version information, the version key less than or equal to
 * the current version will be returned. If all explicit versions are greater than the current version, the
 * non-versioned key will be used.</li>
 * </ol>
 * 
 * When removing versioned Preferences, all versions will be removed at the same time (automatically).
 * 
 * @author Matt Small
 */
public class ConfigurationStore {

    protected static final String VERSIONED_KEY = "wm_versioned";

    public static void removePreference(Class<?> klass, String key) {
        Preferences.userNodeForPackage(klass).remove(key);

        // and remove versioning
        try {
            getRootVersionedNode(klass, key).removeNode();
        } catch (BackingStoreException e) {
            throw new WMRuntimeException(e);
        }
    }

    /**
     * Get the preference as a String, or if that doesn't exist, use the default. If the preference has been versioned,
     * this will return the appropriate versioned preference.
     */
    public static String getPreference(Class<?> klass, String key, String defaultValue) {
        return getLessThanEqualVersionedNode(klass, key).get(key, defaultValue);
    }

    /**
     * Get the preference as a boolean, or if that doesn't exist, use the default. If the preference has been versioned,
     * this will return the appropriate versioned preference.
     */
    public static boolean getPreferenceBoolean(Class<?> klass, String key, boolean defaultValue) {
        return getLessThanEqualVersionedNode(klass, key).getBoolean(key, defaultValue);
    }

    /**
     * Get the preference as an int, or if that doesn't exist, use the default. If the preference has been versioned,
     * this will return the appropriate versioned preference.
     */
    public static int getPreferenceInt(Class<?> klass, String key, int defaultValue) {
        return getLessThanEqualVersionedNode(klass, key).getInt(key, defaultValue);
    }

    /**
     * Set the preference. This will not use versioning.
     */
    public static void setPreference(Class<?> klass, String key, String value) {
        Preferences.userNodeForPackage(klass).put(key, value);
    }

    /**
     * Set the preference. This will not use versioning.
     */
    public static void setPreferenceBoolean(Class<?> klass, String key, boolean value) {
        Preferences.userNodeForPackage(klass).putBoolean(key, value);
    }

    /**
     * Set the preference. This will not use versioning.
     */
    public static void setPreferenceInt(Class<?> klass, String key, int value) {
        Preferences.userNodeForPackage(klass).putInt(key, value);
    }

    /**
     * Set the preference. This will use versioning.
     */
    public static void setVersionedPreference(Class<?> klass, String key, String value) {
        getExactVersionedNode(klass, key).put(key, value);
    }

    /**
     * Set the preference. This will use versioning.
     */
    public static void setVersionedPreferenceBoolean(Class<?> klass, String key, boolean value) {
        getExactVersionedNode(klass, key).putBoolean(key, value);
    }

    /**
     * Set the preference. This will use versioning.
     */
    public static void setVersionedPreferenceInt(Class<?> klass, String key, int value) {
        getExactVersionedNode(klass, key).putInt(key, value);
    }

    protected static Preferences getRootVersionedNode(Class<?> klass, String key) {

        Preferences p = Preferences.userNodeForPackage(klass);
        return p.node(VERSIONED_KEY + "__" + key);
    }

    protected static Preferences getLessThanEqualVersionedNode(Class<?> klass, String key) {
        try {
            return getLessThanEqualVersionedNode(klass, key, LocalStudioConfiguration.getCurrentVersionInfo());
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    protected static Preferences getLessThanEqualVersionedNode(Class<?> klass, String key, VersionInfo version) {

        try {
            Preferences p = getRootVersionedNode(klass, key);
            VersionInfo currentStudioVersion = version;
            VersionInfo currentPrefVersion = null;

            for (String name : p.childrenNames()) {
                VersionInfo vi;
                try {
                    vi = new VersionInfo(name);
                } catch (NumberFormatException e) {
                    continue;
                } catch (StringIndexOutOfBoundsException e) {
                    continue;
                }

                if (vi.compareTo(currentStudioVersion) <= 0 && (null == currentPrefVersion || currentPrefVersion.compareTo(vi) < 0)) {
                    currentPrefVersion = vi;
                }
            }

            if (null != currentPrefVersion) {
                return p.node(currentPrefVersion.toString());
            } else {
                return Preferences.userNodeForPackage(klass);
            }
        } catch (BackingStoreException e) {
            throw new WMRuntimeException(e);
        }
    }

    protected static Preferences getExactVersionedNode(Class<?> klass, String key) {

        try {
            return getExactVersionedNode(klass, key, LocalStudioConfiguration.getCurrentVersionInfo());
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    protected static Preferences getExactVersionedNode(Class<?> klass, String key, VersionInfo version) {

        Preferences p = getRootVersionedNode(klass, key);
        return p.node(version.toString());
    }
}

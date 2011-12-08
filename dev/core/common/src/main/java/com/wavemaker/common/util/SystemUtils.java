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

package com.wavemaker.common.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.List;
import java.util.Properties;

import com.wavemaker.common.WMException;
import com.wavemaker.common.WMRuntimeException;

/**
 * @author Simon Toens
 */
public class SystemUtils {

    private static final byte[] KEY = { 12, 7, 28, 127, 97, 69, 77, 122, 11 };

    private static final String ENCRYPTED_PREFIX = "wm_-+";

    private static final String ENCRYPTED_SUFFIX = "==wm-_";

    public static String encrypt(String s) {
        s = ENCRYPTED_PREFIX + s + ENCRYPTED_SUFFIX;
        StringBuilder rtn = new StringBuilder(s.length());
        byte[] bytes = s.getBytes();
        for (int i = 0; i < bytes.length; i++) {
            rtn.append(encrypt(bytes[i], KEY[i % KEY.length]));
        }
        return rtn.toString();
    }

    public static String decrypt(String s) {
        return decrypt(s, true);
    }

    private static String decrypt(String s, boolean removeMarkers) {
        byte[] rtn = new byte[s.length() / 2];
        int j = 0;
        for (int i = 0; i < s.length(); i += 2) {
            String hex = s.substring(i, i + 2);
            rtn[j] = (byte) (Integer.parseInt(hex, 16) ^ KEY[j % KEY.length]);
            j++;
        }
        String d = new String(rtn);
        if (removeMarkers && hasMarkers(d)) {
            return d.substring(ENCRYPTED_PREFIX.length(), d.length() - ENCRYPTED_SUFFIX.length());
        }
        return d;
    }

    public static boolean isEncrypted(String s) {
        if (s == null) {
            return false;
        }
        try {
            String d = decrypt(s, false);
            return hasMarkers(d);
        } catch (RuntimeException ex) {
            return false;
        }
    }

    private static boolean hasMarkers(String s) {
        return s.startsWith(ENCRYPTED_PREFIX) && s.endsWith(ENCRYPTED_SUFFIX);
    }

    private static String encrypt(byte b, byte key) {
        b = (byte) (b ^ key);
        String rtn = Integer.toHexString(b);
        if (rtn.length() == 1) {
            rtn = "0" + rtn;
        }
        return rtn;
    }

    /**
     * Converts byte array to long, assuming the bytes are unsigned.
     */
    public static long getUnsignedValue(byte[] bytes) {

        long rtn = 0;
        for (int i = 0; i < bytes.length; i++) {
            byte b = bytes[i];
            boolean isSignBitSet = (b & 128) == 128;
            if (isSignBitSet) {
                // unset sign bit before 'or'ing with rtn
                b = (byte) (b & 127);
            }
            rtn |= b;
            if (isSignBitSet) {
                // add 'sign' bit as regular bit
                rtn |= 128;
            }

            if (i < bytes.length - 1) {
                rtn <<= 8; // 8 because unsigned
            }
        }

        return rtn;
    }

    /**
     * Remove all wrapping Exceptions that have been "artificially" added to the top-level root Exception.
     */
    public static Throwable unwrapInternalException(Throwable th) {

        while (th instanceof WMRuntimeException || th instanceof WMException) {

            if (th.getCause() != null) {
                th = th.getCause();
            } else {
                break;
            }
        }

        return th;
    }

    public static Throwable getRootException(Throwable th) {

        while (th.getCause() != null) {
            th = th.getCause();
        }

        return th;
    }

    /**
     * Add all properties from p that are not set in org.
     */
    public static void addAllUnlessSet(Properties org, Properties p) {
        for (String s : CastUtils.<String> cast(p.keySet())) {
            if (!org.containsKey(s)) {
                org.setProperty(s, p.getProperty(s));
            }
        }
    }

    public static void setPropertyUnlessSet(String name, String value) {
        if (System.getProperty(name) == null) {
            System.setProperty(name, value);
        }
    }

    public static boolean allPropertiesAreSet(String... propertyNames) {
        return allPropertiesAreSet(System.getProperties(), propertyNames);
    }

    public static boolean allPropertiesAreSet(Properties properties, String... propertyNames) {
        for (String s : propertyNames) {
            if (properties.getProperty(s) == null) {
                return false;
            }
        }
        return true;
    }

    public static Properties loadPropertiesFromResource(String name) {
        InputStream is = null;
        try {
            is = Thread.currentThread().getContextClassLoader().getResourceAsStream(name);
            return loadPropertiesFromStream(is);
        } finally {
            try {
                is.close();
            } catch (Exception ignore) {
            }
        }
    }

    public static Properties loadPropertiesFromFile(String filepath) {
        InputStream is = null;
        try {
            is = new FileInputStream(filepath);
            return loadPropertiesFromStream(is);
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        } finally {
            try {
                is.close();
            } catch (Exception ignore) {
            }
        }
    }

    public static Properties loadPropertiesFromStream(InputStream inputStream) {
        try {
            Properties rtn = new Properties();
            rtn.load(inputStream);
            return rtn;
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    public static void writePropertiesFile(OutputStream os, Properties props) {
        writePropertiesFile(os, props, null, null);
    }

    public static void writePropertiesFile(OutputStream os, Properties props, String comment) {
        writePropertiesFile(os, props, null, comment);
    }

    public static void writePropertiesFile(OutputStream os, Properties props, List<String> includePropertyNames, String comment) {
        try {
            if (includePropertyNames != null) {
                Properties p = new Properties();
                for (String key : CastUtils.<String> cast(props.keySet())) {
                    if (includePropertyNames.contains(key)) {
                        p.setProperty(key, props.getProperty(key));
                    }
                }
                props = p;
            }

            props.store(os, comment);

        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }

    }

    /**
     * Get the native line separator.
     * 
     * @return The property line.separator as a String.
     */
    public static String getLineBreak() {
        return org.apache.commons.lang.SystemUtils.LINE_SEPARATOR;
    }

    public static String getIP() {
        try {
            return InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException ex) {
            return "127.0.0.1";
        }
    }

    private SystemUtils() {
        throw new UnsupportedOperationException();
    }

    public static boolean isLinux() {
        return System.getProperty("os.name").equalsIgnoreCase("linux");
    }

    public static boolean isMacOSX() {
        // see http://developer.apple.com/technotes/tn2002/tn2110.html
        return System.getProperty("os.name").toLowerCase().startsWith("mac os x");
    }

    public static String getWavemakerRoot() {
        String jdkPath = System.getProperty("java.home");
        String wmRoot = new File(jdkPath).getParentFile().getParentFile().getAbsolutePath();

        return wmRoot;
    }

}
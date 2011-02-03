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

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.text.ParseException;
import java.util.StringTokenizer;
import java.util.ArrayList;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.io.*;

public class LicenseUtil {
//[nonemac-begin]
    public static String getMacAddr() {
        StringBuilder sb;
        try {
            InetAddress address = InetAddress.getLocalHost();
            NetworkInterface ni = NetworkInterface.getByInetAddress(address);
            byte[] mac = ni.getHardwareAddress();
            sb = new StringBuilder();
            for (int i = 0; i < mac.length; i++) {
                sb.append(String.format("%02X%s", mac[i], (i < mac.length - 1) ? "-" : ""));
            }
        } catch (Exception e) {
            e.printStackTrace();
            sb = null;
        }

        if (sb == null)
            return "";
        else
            return sb.toString();
    }
//[nonemac-end]
/*//[mac-begin]
    public static String getMacAddr() {
        String mac;
        try {
            mac = osxParseMacAddress(osxRunIfConfigCommand());
        } catch (Exception ex) {
            mac = null;
        }
        return mac;
    }

    private static String osxParseMacAddress(String ipConfigResponse) throws ParseException {
        String localHost = null;
        try {
            localHost = InetAddress.getLocalHost().getHostAddress();
        } catch (java.net.UnknownHostException ex) {
            ex.printStackTrace();
            throw new ParseException(ex.getMessage(), 0);
        }
        StringTokenizer tokenizer = new StringTokenizer(ipConfigResponse, "\n");
        while (tokenizer.hasMoreTokens()) {
            String line = tokenizer.nextToken().trim();
            boolean containsLocalHost = line.indexOf(localHost) >= 0;
            int macAddressPosition = line.indexOf("ether"); // see if line contains MAC address
            if (macAddressPosition != 0) {
                continue;
            }
            String macAddressCandidate = line.substring(macAddressPosition + 6).trim();
            if (osxIsMacAddress(macAddressCandidate)) {
                return macAddressCandidate;
            }
        }
        ParseException ex = new ParseException("cannot read MAC address for " + localHost + " from [" + ipConfigResponse + "]", 0);
        ex.printStackTrace();
        throw ex;
    }

    private static String osxRunIfConfigCommand() throws IOException {
        Process p = Runtime.getRuntime().exec("ifconfig");
        InputStream stdoutStream = new BufferedInputStream(p.getInputStream());
        StringBuilder buffer = new StringBuilder();
        for (;;) {
            int c = stdoutStream.read();
            if (c == -1) {
                break;
            }
            buffer.append((char) c);
        }
        String outputText = buffer.toString();
        stdoutStream.close();
        return outputText;
    }

    private static boolean osxIsMacAddress(String macAddressCandidate) {
        Pattern macPattern = Pattern.compile("[0-9a-fA-F]{2}[-:][0-9a-fA-F]{2}[-:][0-9a-fA-F]{2}[-:][0-9a-fA-F]{2}[-:][0 -9a-fA-F]{2}[-:][0-9a-fA-F]{2}");
        Matcher m = macPattern.matcher(macAddressCandidate);
        return m.matches();
    }
//[mac-end]*/

    public static boolean hardwareMatched(String macAddr) {

        String cmd = "";
        String line = "";
        boolean matched = false;

        String os = System.getProperty("os.name");

        try
        {
            if (os.startsWith("Windows")) {
                cmd = "ipconfig.exe /all";
            }
            else if (os.startsWith("Linux")) {
                cmd = "ifconfig -a";
            }
            else { //Mac OS
                cmd = "ifconfig";
            }

            Process conf = Runtime.getRuntime().exec(cmd);
            BufferedReader buffer = new BufferedReader(new InputStreamReader(conf.getInputStream()));
            while ((line = buffer.readLine()) != null) {
                if (line.contains(macAddr)) {
                    matched = true;
                    break;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return matched;
    }
}

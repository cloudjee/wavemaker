/*
 *  Copyright (C) 2013 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.data;

import java.io.IOException;
import java.io.File;
import java.util.*;

import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.tools.io.local.LocalFolder;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.common.WMRuntimeException;

public final class ConnectionUrl {

    public static final String HSQLDB = ":hsqldb:";

    public static final String HSQLFILE_PROP = "hsqldbFile";

    private final String url;

    private String rewrittenUrl;

    public ConnectionUrl(String url) {
        this.url = url;
        this.rewrittenUrl = url;
    }

    public Properties rewriteProperties(Properties properties) {
        Properties newProps = new Properties();
        Enumeration keys = properties.propertyNames();
        for (;keys.hasMoreElements();) {
            String key = (String)keys.nextElement();
            newProps.setProperty(key, properties.getProperty(key));
        }
        if (isHsqldb()) {
            String hsqldbFileName = extractHsqlDBFileName();
            newProps.setProperty(HSQLFILE_PROP, hsqldbFileName);
            newProps.setProperty(DataServiceConstants.DB_URL_KEY, rewrite(DataServiceConstants.WEB_ROOT_TOKEN + "/data"));
        }
        return newProps;
    }

    private String extractHsqlDBFileName() {
        String s = File.separator + "data";
        int n = toString().indexOf(s) + 6;
        String partialCxn = toString().substring(n);
        int k = partialCxn.indexOf(';');
        return partialCxn.substring(0, k);
    }

    public boolean isHsqldb() {
        return toString().indexOf(HSQLDB) != -1;
    }

    public void setHsqldbRootFolder(LocalFolder folder) {
        try {
            this.rewrittenUrl = rewrite(folder.getLocalFile().getCanonicalPath());
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }

    public void rewriteUrl(String hsqlDbRootFolder) {
        this.rewrittenUrl =  rewrite(hsqlDbRootFolder);   
    }

    private String rewrite(String hsqlDbRootFolder) {
        StringTokenizer cxnStrTokens = new StringTokenizer(this.url, ":");
        String driverType = null;
        String dbType = null;
        String dbFormat = null;
        String dbFileName = null;
        int index = 0;

        ArrayList<String> dbSettings = new ArrayList<String>();

        while (cxnStrTokens.hasMoreElements()) {
            String token = cxnStrTokens.nextToken();
            if (token.equals("jdbc") && index == 0) {
                driverType = token;
            }

            if (token.equals("hsqldb") && index == 1) {
                dbType = token;
            }

            if (token.equals("file") && index == 2) {
                dbFormat = token;
            }

            if (index == 3) {
                // get the file path
                StringTokenizer dbFileCfgTokens = new StringTokenizer(token, ";");
                dbFileName = dbFileCfgTokens.nextToken();
                while (dbFileCfgTokens.hasMoreTokens()) {
                    dbSettings.add(dbFileCfgTokens.nextToken());
                }
            }

            index++;
        }

        // Making sure it is the hsqldb file copy
        assert driverType != null && driverType.equals("jdbc");
        assert dbType != null && dbType.equals("hsqldb");
        assert dbFormat != null && dbFormat.equals("file");
        assert dbFileName != null;
        assert index == 4;

        // String hsqlDBName = hsqlDbRootFolder + "/" + dbFileName;
        String hsqlDBName = hsqlDbRootFolder + "/" + dbFileName;

        // Need more program logic for the settings on url
        String cxnUrl = new String("jdbc" + ":" + "hsqldb" + ":" + "file" + ":" + hsqlDBName);
        Iterator<String> itr = dbSettings.iterator();
        while (itr.hasNext()) {
            cxnUrl += ";";
            cxnUrl += itr.next();
        }
        return cxnUrl;
    }

    @Override
    public String toString() {
        return this.rewrittenUrl;
    }

}

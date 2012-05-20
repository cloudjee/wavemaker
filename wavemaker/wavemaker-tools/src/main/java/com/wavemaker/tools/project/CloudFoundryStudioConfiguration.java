/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.project;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.RuntimeAccess;

/**
 * StudioConfiguration holds configuration data associated with this studio.
 * 
 * @author Matt Small
 * @author Joel Hare
 * @author Jeremy Grelle
 * @author Ed Callahan
 */
public class CloudFoundryStudioConfiguration implements StudioConfiguration {

    private static final String WMHOME_KEY = "wavemakerHome";

    private static final String VERSION_FILE = "version";

    private static final String DEMOHOME_KEY = GridFSStudioFileSystem.DEMOHOME_KEY;

    static final String PROJECTS_DIR = GridFSStudioFileSystem.PROJECTS_DIR;

    private RuntimeAccess runtimeAccess;

    public CloudFoundryStudioConfiguration(GridFSStudioFileSystem fileSystem) {
    }

    @Override
    public Map<String, String> getPreferencesMap() {
        // As setPreferencesMap is a no-op we return empty data here
        Map<String, String> prefs = new HashMap<String, String>();
        prefs.put(WMHOME_KEY, "");
        prefs.put(DEMOHOME_KEY, "");
        return prefs;
    }

    @Override
    public void setPreferencesMap(Map<String, String> prefs) {
        // This is a no-op in CloudFoundry
        return;
    }

    /**
     * Gets the current VersionInfo from the VERSION file.
     */
    public static VersionInfo getCurrentVersionInfo() throws IOException {

        String versionFileString = getCurrentVersionInfoString();

        final Pattern p = Pattern.compile("^Version: (.*)$", Pattern.MULTILINE);
        Matcher m = p.matcher(versionFileString);
        if (!m.find()) {
            throw new WMRuntimeException("bad version string: " + versionFileString);
        }

        return new VersionInfo(m.group(1));
    }

    public static String getCurrentVersionInfoString() throws IOException {

        String versionFile = CloudFoundryStudioConfiguration.class.getPackage().getName().replace(".", "/") + "/" + VERSION_FILE;
        InputStream is = CloudFoundryStudioConfiguration.class.getClassLoader().getResourceAsStream(versionFile);
        String versionFileString = org.apache.commons.io.IOUtils.toString(is);

        return versionFileString;
    }

    @Override
    public RuntimeAccess getRuntimeAccess() {
        return this.runtimeAccess;
    }

    public void setRuntimeAccess(RuntimeAccess runtimeAccess) {
        this.runtimeAccess = runtimeAccess;
    }

    @Override
    public boolean isStudioUpgradeSupported() {
        return false;
    }

    @Override
    public double getCurrentUpgradeKey() {
        // Studio upgrades are not supported on CF
        return 0.0;
    }

    @Override
    public void setCurrentUpgradeKey(double key) {
        // Studio upgrades are not supported on CF
    }
}

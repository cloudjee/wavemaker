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

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.FileAccessException;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.tools.config.ConfigurationStore;
import com.wavemaker.tools.project.upgrade.UpgradeManager;

/**
 * StudioConfiguration holds configuration data associated with this studio.
 * 
 * @author Matt Small
 * @author Joel Hare
 * @author Jeremy Grelle
 */
public class LocalStudioConfiguration implements EmbeddedServerConfiguration {

    private static final String TOMCAT_PORT_KEY = "tomcatPort";

    private static final int TOMCAT_PORT_DEFAULT = 8080;

    private static final String TOMCAT_PORT_ENV = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX + TOMCAT_PORT_KEY;

    private static final String TOMCAT_HOST_KEY = "tomcatHost";

    private static final String TOMCAT_HOST_DEFAULT = "localhost";

    private static final String TOMCAT_HOST_ENV = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX + TOMCAT_HOST_KEY;

    private static final String TOMCAT_MANAGER_USER_KEY = "managerUser";

    private static final String TOMCAT_MANAGER_USER_DEFAULT = "manager";

    private static final String TOMCAT_MANAGER_USER_ENV = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX + TOMCAT_MANAGER_USER_KEY;

    private static final String TOMCAT_MANAGER_PW_KEY = "managerPassword";

    private static final String TOMCAT_MANAGER_PW_DEFAULT = "manager";

    private static final String TOMCAT_MANAGER_PASSWORD_ENV = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX + TOMCAT_MANAGER_PW_KEY;

    private static final String STUDIO_VERSION_KEY = "StudioVersion";

    private static final String VERSION_FILE = "version";

    private static final String VERSION_KEY = "studioVersion";

    private static final String VERSION_DEFAULT = "4.0.0";

    private RuntimeAccess runtimeAccess;

    private final LocalStudioFileSystem fileSystem;

    /**
     * Deprecated construction, required for launcher
     */
    @Deprecated
    public LocalStudioConfiguration() {
        this.fileSystem = null;
    }

    public LocalStudioConfiguration(LocalStudioFileSystem fileSystem) {
        this.fileSystem = fileSystem;
    }

    @Deprecated
    public static Resource staticGetWaveMakerHome() {
        return LocalStudioFileSystem.staticGetWaveMakerHome();
    }

    public int getTomcatPort() {
        String propVal = System.getProperty(TOMCAT_PORT_ENV, null);
        if (propVal != null) {
            return Integer.parseInt(propVal);
        }

        int defaultValue;
        if (getRuntimeAccess() != null && getRuntimeAccess().getRequest() != null) {
            defaultValue = getRuntimeAccess().getRequest().getServerPort();
        } else {
            defaultValue = TOMCAT_PORT_DEFAULT;
        }

        return ConfigurationStore.getPreferenceInt(getClass(), TOMCAT_PORT_KEY, defaultValue);
    }

    public String getTomcatHost() {
        String propVal = System.getProperty(TOMCAT_HOST_ENV, null);
        if (propVal != null) {
            return propVal;
        }

        String defaultValue;
        if (getRuntimeAccess() != null && getRuntimeAccess().getRequest() != null) {
            defaultValue = getRuntimeAccess().getRequest().getServerName();
        } else {
            defaultValue = TOMCAT_HOST_DEFAULT;
        }

        return ConfigurationStore.getPreference(getClass(), TOMCAT_HOST_KEY, defaultValue);
    }

    public String getTomcatManagerUsername() {
        String propVal = System.getProperty(TOMCAT_MANAGER_USER_ENV, null);
        if (propVal != null) {
            return propVal;
        }
        return ConfigurationStore.getPreference(getClass(), TOMCAT_MANAGER_USER_KEY, TOMCAT_MANAGER_USER_DEFAULT);
    }

    public String getTomcatManagerPassword() {
        String propVal = System.getProperty(TOMCAT_MANAGER_PASSWORD_ENV, null);
        if (propVal != null) {
            return propVal;
        }
        return ConfigurationStore.getPreference(getClass(), TOMCAT_MANAGER_PW_KEY, TOMCAT_MANAGER_PW_DEFAULT);
    }

    @Override
    public Map<String, String> getPreferencesMap() {

        Map<String, String> prefs = new HashMap<String, String>();

        try {
            prefs.put(LocalStudioFileSystem.WMHOME_KEY, this.fileSystem.getWaveMakerHome().getFile().getCanonicalPath());
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }

        try {
            prefs.put(AbstractStudioFileSystem.DEMOHOME_KEY, this.fileSystem.getDemoDir().getFile().getCanonicalPath());
            return prefs;
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    /**
     * Change the preferences defined in the map; this will use the accessors.
     * 
     * @param prefs
     * @throws FileAccessException
     */
    @Override
    public void setPreferencesMap(Map<String, String> prefs) {
        if (prefs.containsKey(LocalStudioFileSystem.WMHOME_KEY) && prefs.get(LocalStudioFileSystem.WMHOME_KEY) != null) {
            try {
                LocalStudioFileSystem.setWaveMakerHome(new FileSystemResource(prefs.get(LocalStudioFileSystem.WMHOME_KEY)));
            } catch (FileAccessException e) {
                throw new WMRuntimeException(e);
            }
        }
        if (prefs.containsKey(AbstractStudioFileSystem.DEMOHOME_KEY) && prefs.get(AbstractStudioFileSystem.DEMOHOME_KEY) != null) {
            this.fileSystem.setDemoDir(new File(prefs.get(AbstractStudioFileSystem.DEMOHOME_KEY)));
        }
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
        String versionFile = LocalStudioConfiguration.class.getPackage().getName().replace(".", "/") + "/" + VERSION_FILE;
        InputStream is = LocalStudioConfiguration.class.getClassLoader().getResourceAsStream(versionFile);
        String versionFileString = org.apache.commons.io.IOUtils.toString(is);
        return versionFileString;
    }

    /**
     * Set the registry version.
     */
    public static void setRegisteredVersionInfo(VersionInfo vi) {
        ConfigurationStore.setPreference(LocalStudioConfiguration.class, VERSION_KEY, vi.toString());
    }

    /**
     * Gets the last registered version (i.e., the version stored in the registry).
     */
    public static VersionInfo getRegisteredVersionInfo() {
        String versionString = ConfigurationStore.getPreference(LocalStudioConfiguration.class, VERSION_KEY, VERSION_DEFAULT);
        return new VersionInfo(versionString);
    }

    @Override
    public RuntimeAccess getRuntimeAccess() {
        return this.runtimeAccess;
    }

    public void setRuntimeAccess(RuntimeAccess runtimeAccess) {
        this.runtimeAccess = runtimeAccess;
    }

    @Override
    public Resource getTomcatHome() {
        String tomcatHome = System.getProperty("catalina.home");
        tomcatHome = tomcatHome.endsWith("/") ? tomcatHome : tomcatHome + "/";
        return new FileSystemResource(tomcatHome);
    }

    @Override
    public Resource getProjectLogsFolder() {
        try {
            return getTomcatHome().createRelative("logs/ProjectLogs/");
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    /**
     * @deprecated This method is here to support the launcher and should not be used internally anymore
     */
    @Deprecated
    public File getWaveMakerHome() {
        try {
            return LocalStudioFileSystem.staticGetWaveMakerHome().getFile();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static void setWaveMakerHome(Resource wmHome) throws FileAccessException {
        LocalStudioFileSystem.setWaveMakerHome(wmHome);
    }

    protected static Resource getDefaultWaveMakerHome() {
        return LocalStudioFileSystem.getDefaultWaveMakerHome();
    }

    @Override
    public boolean isStudioUpgradeSupported() {
        return true;
    }

    @Override
    public double getCurrentUpgradeKey() {
        String prefString = ConfigurationStore.getPreference(UpgradeManager.class, STUDIO_VERSION_KEY, "0.0");
        return Double.parseDouble(prefString);
    }

    @Override
    public void setCurrentUpgradeKey(double key) {
        ConfigurationStore.setPreference(UpgradeManager.class, STUDIO_VERSION_KEY, "" + key);
    }
}

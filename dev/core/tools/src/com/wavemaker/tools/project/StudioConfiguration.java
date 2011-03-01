/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
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
package com.wavemaker.tools.project;


import java.io.*;
import java.net.URL;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.jar.JarFile;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.SystemUtils;
import org.apache.commons.io.FileUtils;

import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.FileAccessException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.tools.config.ConfigurationStore;

/**
 * StudioConfiguration holds configuration data associated with this studio.
 *
 * @author Matt Small
 * @author Joel Hare
 * @version $Rev$ - $Date$
 *
 */
public class StudioConfiguration {
    
    public static final String MARKER_RESOURCE_NAME = "marker.resource.txt";

    public static final String WAVEMAKER_HOME = "WaveMaker";
    public static final String PROJECTS_DIR = "projects";
    public static final String COMMON_DIR = "common";
    
    public static final String PROJECTHOME_KEY = "projectsDir";
    public static final String DEMOHOME_KEY = "demoHome";
    public static final String WMHOME_KEY = "wavemakerHome";
    public static final String PROJECTHOME_PROP_KEY = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX +
            PROJECTHOME_KEY;
    public static final String WMHOME_PROP_KEY = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX +
            WMHOME_KEY;
    
    protected static final String TOMCAT_MANAGER_USER_KEY = "managerUser";
    protected static final String TOMCAT_MANAGER_PW_KEY = "managerPassword";
    protected static final String TOMCAT_PORT_KEY = "tomcatPort";
    protected static final String TOMCAT_HOST_KEY = "tomcatHost";
    
    protected static final String TOMCAT_MANAGER_USER_ENV = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX + TOMCAT_MANAGER_USER_KEY;
    protected static final String TOMCAT_MANAGER_PASSWORD_ENV = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX + TOMCAT_MANAGER_PW_KEY;
    protected static final String TOMCAT_PORT_ENV = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX + TOMCAT_PORT_KEY;
    protected static final String TOMCAT_HOST_ENV = CommonConstants.WM_SYSTEM_PROPERTY_PREFIX + TOMCAT_HOST_KEY;
    
    public static final int TOMCAT_PORT_DEFAULT = 8080;
    protected static final String TOMCAT_HOST_DEFAULT = "localhost";
    protected static final String TOMCAT_MANAGER_PW_DEFAULT = "manager";
    protected static final String TOMCAT_MANAGER_USER_DEFAULT = "manager";

    protected static final String VERSION_KEY = "studioVersion";
    protected static final String VERSION_DEFAULT = "4.0.0";
    
    public static final String CMD_GET = "get";
    public static final String CMD_SET = "set";
    protected static final String CMD_DEL = "del";
    protected static final String CMD_NOTSET = "NOTSET";

    protected static final String VERSION_FILE = "version";
 
    /**
     * WaveMaker home override, used for testing.  NEVER set this in production.
     */
    private File testWMHome = null;
    
    /**
     * WaveMaker demo directory override, used for testing.  NEVER set this in
     * production.
     */
    private File testDemoDir = null;
    
    
    /**
     * Return the projects directory ("projects", inside of the
     * path returned by {@link #getWaveMakerHome()}.  This can be overridden
     * with the system property PROJECTHOME_KEY.
     * 
     * @return
     * @throws IOException
     */
    public File getProjectsDir() throws FileAccessException {
        String env = null;
        if (isRuntime()) {
            RuntimeAccess R = RuntimeAccess.getInstance();

            javax.servlet.http.HttpServletRequest R2 = R.getRequest();
            javax.servlet.http.HttpSession H = R.getSession();
            env = (String) RuntimeAccess.getInstance().getSession().getAttribute(PROJECTHOME_PROP_KEY);
        } else {
            env = System.getProperty(PROJECTHOME_PROP_KEY, null);
        }

	
        if (null!=env && 0!=env.length()) {
            return new File(env);
        }
        
        File ret = new File(getWaveMakerHome(), PROJECTS_DIR);
        if (!ret.exists()) {
            IOUtils.makeDirectories(ret, getWaveMakerHome());
        }

        return ret;
    }
    
    private boolean isRuntime() {

	try {
	    if (RuntimeAccess.getInstance() != null && RuntimeAccess.getInstance().getRequest() != null)
		return true;
	} catch(Exception e) {}
	return false;
    }

    private static boolean isCommercial = false;
    public boolean isCommercial(){
	    try {
			org.springframework.core.io.ClassPathResource cpr = new org.springframework.core.io.ClassPathResource("ldap.src.resource");
			isCommercial = cpr.exists();
		    } catch(Exception e) {
			return false;
		    }
	return isCommercial;
    }
    
    private static boolean isCloud;
    private static boolean isCloudInitialized = false;
    public static boolean isCloud() {
	if (!isCloudInitialized) {
	    try {

		org.springframework.core.io.ClassPathResource cpr = new org.springframework.core.io.ClassPathResource("cloud.src.resource");
		isCloud = cpr.exists();
		isCloudInitialized = true;
	    } catch(Exception e) {
		return false;
	    }
	}

	return isCloud;
    }

    public static void setWaveMakerHome(File file) throws FileAccessException {        
        if (isCloud()) return;

        ConfigurationStore.setVersionedPreference(StudioConfiguration.class,
                WMHOME_KEY, file.getAbsolutePath());
        
        if (!file.exists()) {
            IOUtils.makeDirectories(file, file.getParentFile());
        }

        setupDeploymentTargetXML();
    }
    
    public void setTestWaveMakerHome(File file) {
        this.testWMHome = file;
    }
    
    public File getWaveMakerHome() {

        if (null!=this.testWMHome) {
            return this.testWMHome;
        }
        
        return staticGetWaveMakerHome();
    }
    
    public static File staticGetWaveMakerHome() {

        File ret = null;
        
        String env = System.getProperty(WMHOME_PROP_KEY, null);
        if (null!=env && 0!=env.length()) {
            ret = new File(env);
        }
        
        if (null == ret) {
            String pref = ConfigurationStore.getPreference(
                    StudioConfiguration.class, WMHOME_KEY, null);
            if (null != pref && 0 != pref.length()) {
                ret = new File(pref);
            }
        }
        
        
        // we couldn't find a test value, a property, or a preference, so use
        // a default
        if (null==ret) {
            ret = getDefaultWaveMakerHome();
        }
        
        if (!ret.exists()) {
            ret.mkdir();
        }
        
        return ret;
    }
    
    protected static File getDefaultWaveMakerHome() {
        
        File userHome = null;
        if (SystemUtils.IS_OS_WINDOWS) {
            if (null!=System.getenv("USERPROFILE")) {
                userHome = new File(System.getenv("USERPROFILE"));
            }
        }
        if (null==userHome) {
            userHome = new File(System.getProperty("user.home"));
        }
        
        String osVersionStr = System.getProperty("os.version");
        if (osVersionStr.contains(".")) {
            String sub = osVersionStr.substring(osVersionStr.indexOf(".")+1);
            if (sub.contains(".")) {
                osVersionStr = osVersionStr.substring(0,
                        osVersionStr.indexOf('.', osVersionStr.indexOf('.')+1));
            }
        }
        
        if (SystemUtils.IS_OS_WINDOWS) {
            userHome = javax.swing.filechooser.FileSystemView.getFileSystemView().getDefaultDirectory();
        } else if (SystemUtils.IS_OS_MAC) {
            userHome = new File(userHome, "Documents");
        }

        if (!userHome.exists()) {
            throw new WMRuntimeException(Resource.PROJECT_USERHOMEDNE,
                    userHome);
        }
        


        File wmHome = new File(userHome, WAVEMAKER_HOME);
        if (!wmHome.exists()) {
            wmHome.mkdir();
        }

        return wmHome;
    }
    
    public File getDemoDir() {
	if (isCloud()) return null;

        if (null!=testDemoDir) {
            return this.testDemoDir;
        }
        
        String location = ConfigurationStore.getPreference(getClass(),
                DEMOHOME_KEY, null);
        File ret;
        if (null!=location) {
            ret = new File(location);
        } else {
            ret = new File(getStudioWebAppRootFile(), "../Samples");
        }
        
        return ret;
    }
    
    public void setDemoDir(File file) {
        if (isCloud()) return;

        ConfigurationStore.setPreference(getClass(),
                DEMOHOME_KEY, file.getAbsolutePath());
    }
    
    public void setTestDemoDir(File file) {
        if (isCloud()) return;

        this.testDemoDir = file;
    }
    
    /**
     * Get the common WM directory.  This is always relative to the user's
     * WaveMaker home.
     * @throws IOException
     */
    public File getCommonDir() throws IOException {
        File ret = new File(getWaveMakerHome(), COMMON_DIR);
        
        if (!ret.exists() && getWaveMakerHome().exists()) {
            createCommonDir(ret);
        }
        
        return ret;
    }
    
    private synchronized void createCommonDir(File commonDir)
            throws IOException {

        if (!commonDir.exists()) {
            File templateFile = new File(getStudioWebAppRootFile(), "lib/wm/"
                    + COMMON_DIR);
            if (templateFile.exists()) {
                IOUtils.copy(templateFile, commonDir,
                                IOUtils.DEFAULT_EXCLUSION);
            }
        }
    }

    public int getTomcatPort() {
        
        String propVal = System.getProperty(TOMCAT_PORT_ENV, null);
        if (null!=propVal) {
            return Integer.parseInt(propVal);
        }
        
        int defaultValue;
        if (null!=getRuntimeAccess() && null!=getRuntimeAccess().getRequest()) {
            defaultValue = getRuntimeAccess().getRequest().getServerPort();
        } else {
            defaultValue = TOMCAT_PORT_DEFAULT;
        }
        
        return ConfigurationStore.getPreferenceInt(getClass(), TOMCAT_PORT_KEY,
                defaultValue);
    }
    
    public String getTomcatHost() {
        String propVal = System.getProperty(TOMCAT_HOST_ENV, null);
        if (null!=propVal) {
            return propVal;
        }
        
        String defaultValue;
        if (null!=getRuntimeAccess() && null!=getRuntimeAccess().getRequest()) {
            defaultValue = getRuntimeAccess().getRequest().getServerName();
        } else {
            defaultValue = TOMCAT_HOST_DEFAULT;
        }
        
        return ConfigurationStore.getPreference(getClass(), TOMCAT_HOST_KEY,
                defaultValue);
    }
    
    public String getTomcatManagerUsername() {

        String propVal = System.getProperty(TOMCAT_MANAGER_USER_ENV, null);
        if (null!=propVal) {
            return propVal;
        }
        
        return ConfigurationStore.getPreference(getClass(),
                TOMCAT_MANAGER_USER_KEY, TOMCAT_MANAGER_USER_DEFAULT);
    }
    
    public String getTomcatManagerPassword() {

        String propVal = System.getProperty(TOMCAT_MANAGER_PASSWORD_ENV, null);
        if (null!=propVal) {
            return propVal;
        }
        
        return ConfigurationStore.getPreference(getClass(),
                TOMCAT_MANAGER_PW_KEY, TOMCAT_MANAGER_PW_DEFAULT);
    }

    // other studio information
    public File getStudioWebAppRootFile() {
        URL url = getClass().getClassLoader().getResource(MARKER_RESOURCE_NAME);
        if (url == null) {
            throw new RuntimeException("Could not find resource " + MARKER_RESOURCE_NAME);
        }
        try {
            String decodedURL = URLDecoder.decode(url.getFile(),
                    ServerConstants.DEFAULT_ENCODING);
            File markerFile = new File(decodedURL);
            File webAppRootFile = markerFile.getParentFile().getParentFile().getParentFile();
            return webAppRootFile;
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
    
    /**
     * Get a map of all known preferences.
     */
    public Map<String,String> getPreferencesMap() {

        Map<String,String> ret = new HashMap<String, String>();
        
        ret.put(WMHOME_KEY, getWaveMakerHome().getAbsolutePath());
        ret.put(DEMOHOME_KEY, (isCloud()) ? null : getDemoDir().getAbsolutePath());
        
        return ret;
    }
    
    /**
     * Change the preferences defined in the map; this will use the accessors.
     * @param prefs
     * @throws FileAccessException
     */
    public void setPreferencesMap(Map<String,String> prefs)
            throws FileAccessException {

	    if (isCloud()) return;


        if (prefs.containsKey(WMHOME_KEY) && null!=prefs.get(WMHOME_KEY)) {

            setWaveMakerHome(new File(prefs.get(WMHOME_KEY)));
        }
        if (prefs.containsKey(DEMOHOME_KEY) && null!=prefs.get(DEMOHOME_KEY)) {
            setDemoDir(new File(prefs.get(DEMOHOME_KEY)));
        }
    }

    /** Gets the current VersionInfo from the VERSION file.
     */
    public static VersionInfo getCurrentVersionInfo() throws IOException {

        String versionFileString = getCurrentVersionInfoString();

        final Pattern p = Pattern.compile("^Version: (.*)$",
                Pattern.MULTILINE);
        Matcher m = p.matcher(versionFileString);
        if(!m.find()) {
            throw new WMRuntimeException("bad version string: "+
                    versionFileString);
        }

        return new VersionInfo(m.group(1));
    }
    
    public static String getCurrentVersionInfoString() throws IOException {

        String versionFile = StudioConfiguration.class.getPackage().getName()
                .replace(".", "/")
                + "/" + VERSION_FILE;
        InputStream is = StudioConfiguration.class.getClassLoader()
                .getResourceAsStream(versionFile);
        String versionFileString = org.apache.commons.io.IOUtils.toString(is);

        return versionFileString;
    }

    /** Set the registry version.
     */
    public static void setRegisteredVersionInfo(VersionInfo vi) {
        ConfigurationStore.setPreference(StudioConfiguration.class,
                VERSION_KEY, vi.toString());
    }

    /**
     * Gets the last registered version (i.e., the version stored in the
     * registry).
     */
    public static VersionInfo getRegisteredVersionInfo() {
        String versionString = ConfigurationStore.getPreference(
                StudioConfiguration.class, VERSION_KEY,
                VERSION_DEFAULT);
        return new VersionInfo(versionString);
    }

    // bean properties
    private RuntimeAccess runtimeAccess;

    public RuntimeAccess getRuntimeAccess() {
        return runtimeAccess;
    }
    public void setRuntimeAccess(RuntimeAccess runtimeAccess) {
        this.runtimeAccess = runtimeAccess;
    }

    /**
     *Copies deployment property file in class path to wavemaker home directory.
     */
    public static void setupDeploymentTargetXML() {
        try {
            String name = "com/wavemaker/tools/deployment/xmlhandlers/" + CommonConstants.DEPLOYMENT_TARGETS_XML;
            InputStream in = StudioConfiguration.class.getClassLoader().getResourceAsStream(name);

            File efile = new File(staticGetWaveMakerHome().getAbsolutePath(), CommonConstants.DEPLOYMENT_TARGETS_XML);

            if (efile.exists()) return;
            
            OutputStream out = new BufferedOutputStream(new FileOutputStream(efile));
            byte[] buffer = new byte[2048];

            int len;
            while ((len = in.read(buffer)) > 0){
                out.write(buffer, 0, len);
            }
            
            out.flush();
            out.close();
            in.close();
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new WMRuntimeException(e);
        }
    }
    
    public static void main(String[] args) throws FileAccessException {
        
        if (args.length>1) {
            String command = args[0];
            String key = args[1];
            
            if (CMD_GET.equals(command)) {
                System.out.println(ConfigurationStore.getPreference(StudioConfiguration.class, key, CMD_NOTSET));
            } else if (CMD_DEL.equals(command)) {
                ConfigurationStore.removePreference(StudioConfiguration.class, key);
            } else if (CMD_SET.equals(command)) {
                if (args.length<3) {
                    throw new WMRuntimeException("need more args for set: "+Arrays.toString(args));
                }
                
                setWaveMakerHome(new File(args[2]));
            } else {
                throw new WMRuntimeException("unknown command: "+command);
            }
        } else {
            throw new WMRuntimeException("bad cmdline: "+Arrays.toString(args));
        }
    }

    
}

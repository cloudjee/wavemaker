/*
 * Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */
package com.wavemaker.desktop.launcher;

import com.wavemaker.desktop.launcher.ui.MainConsole;
import com.wavemaker.desktop.launcher.ui.ProgressDialog;
import com.wavemaker.desktop.launcher.ui.StudioUpgradeDialog;

import java.awt.DisplayMode;
import java.awt.GraphicsEnvironment;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintStream;
import java.io.Writer;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Arrays;

import org.apache.catalina.startup.Catalina;

/**
 * Main method for launching WaveMaker's Catalina wrapper ({@link Launcher}.)
 *
 * @author small
 * @version $Rev$ - $Date: 2009-03-09 17:06:44 -0700 (Mon, 09 Mar 2009)
 *          $
 */
public class Main
{
    public static final String STUDIO_DIR = "studio";
    public static final String studioWebApp = "wavemaker";
    public static final String SRC_DEMOS_DIR = "Samples";
    public static final String DEST_DEMOS_DIR = "samples";
    public static File CatalinaHome;
    public static TomcatConfig tomcatConfig;
    public static PrintStream consoleOut;
    public static PrintStream consoleErr;
    public static PrintStream logOut;

    /**
     * Return the path for the default Tomcat server.xml file
     *
     * @throws URISyntaxException
     */
    public static File getTomcatServerXML() throws URISyntaxException,
            MalformedURLException
    {
        try
        {
            File wmHomeConf = new File(getWaveMakerHome(), "server.xml");
            if (wmHomeConf.exists())
            {
                return wmHomeConf;
            }
        }
        catch (SecurityException e)
        {
            throw new RuntimeException(e);
        }
        catch (IllegalArgumentException e)
        {
            throw new RuntimeException(e);
        }

        try
        {
            File catalinaHomeConf = new File(getCatalinaHome(),
                    "conf/server.xml");
            if (catalinaHomeConf.exists())
            {
                return catalinaHomeConf;
            }
        }
        catch (URISyntaxException e)
        {
            throw new RuntimeException(e);
        }

        return null;
    }

    public static void setDefaultTomcatConfiguration(TomcatConfig config)
            throws IOException, URISyntaxException
    {
        try
        {
            File wmHomeConf = new File(getWaveMakerHome(), "server.xml");
            FileOutputStream fos = new FileOutputStream(wmHomeConf);
            config.serialize(fos);
            fos.close();
        }
        catch (SecurityException e)
        {
            throw new RuntimeException(e);
        }
        catch (IllegalArgumentException e)
        {
            throw new RuntimeException(e);
        }
    }

    public static File getCatalinaHome() throws URISyntaxException
    {
        URL resource = Main.class.getClassLoader().getResource(
                "catalina.home.marker");
        URI uri;
        File file = null;
        if (resource != null)
        {
            uri = new URI(resource.toString());
            file = new File(uri).getParentFile();
        }
        else
        {
            file = new File("C:\\program files\\WaveMaker\\Tomcat\\");
        }
        return file;
    }

    public static File getSourceDemosDir() throws URISyntaxException
    {

        File catalinaHome = getCatalinaHome();
        File ret = new File(catalinaHome, "../" + SRC_DEMOS_DIR);
        return ret;
    }

    public static File getStudioDir() throws URISyntaxException
    {
        return new File(new File(getCatalinaHome(), ".."), STUDIO_DIR);
    }

    protected static void createDefaultContextXml(File contextDir)
            throws IOException
    {

        File defaultContext = new File(contextDir, "context.xml.default");

        Writer writer = new FileWriter(defaultContext);
        writer.write("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>"
                + "<Context>\n"
                + "\t<Manager className=\"org.apache.catalina.session.PersistentManager\" saveOnRestart=\"false\"/>\n"
                + "</Context>\n");
        writer.close();
    }

    protected static void createContextXml(File contextDir, File webAppDir,
            String webAppName) throws IOException
    {

        Writer writer = new FileWriter(
                new File(contextDir, webAppName + ".xml"));
        writer.write("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>"
                + "<Context antiJARLocking=\"false\" antiResourceLocking=\"false\" "
                + "\t\tdocBase=\""
                + webAppDir.getAbsolutePath()
                + "\" path=\"/"
                + webAppName
                + "\" privileged=\"true\">\n" + "</Context>\n");
        writer.close();
    }

    /**
     * Starts Catalina. If no arguments are provided, will default to "start".
     * For the MySQLThreadFix to function, a MySQL connector jar should be on
     * the classpath when this main is started.
     *
     * @param args
     *            See {@link Catalina#usage()} for usage information.
     * @throws InterruptedException
     * @throws URISyntaxException
     * @throws IOException
     */
    public static void main(String[] args) throws InterruptedException,
            URISyntaxException, IOException
    {
        if (GraphicsEnvironment.isHeadless())
        {
            // Run silently
            if (0 == args.length)
            {
                args = new String[]
                        {
                            "start"
                        };
            }
            boolean starting = Arrays.asList(args).contains("start");
            if (starting)
            {
                start(args, false);
            }
            else
            {
                stop(args);
            }
        }
        else
        {
            // Run graphically
            GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
            DisplayMode display = ge.getDefaultScreenDevice().getDisplayMode();
            // Check for Studio Upgrade
            if (isStudioUpgrade())
            {
                StudioUpgradeDialog sud = new StudioUpgradeDialog(
                    getCurrentVersionString(),
                    getWaveMakerHome(), getNewDefaultWMHome(),
                    isMajorUpgrade());
                
                sud.setLocation(display.getWidth() / 2 - sud.getWidth() / 2,
                    display.getHeight() / 2 - sud.getHeight() / 2);
                
                sud.setVisible(true);
                // Perform new installation
                ProgressDialog progress = new ProgressDialog("Studio Upgrade:",
                        "Please wait while the Studio upgrade is completed.",
                        false, false);
                
                progress.start();
                
                try
                {
                    doUpgrade(sud.getSelectedProjectsPath());
                }
                catch (RuntimeException e)
                {
                    e.printStackTrace();
                }
                progress.stop();
            }
            tomcatConfig = TomcatConfig.GetDefaultConfig();
            // MainLauncherUI ui = new MainLauncherUI(getCurrentVersionString(), tomcatConfig);
            MainConsole ui = new MainConsole(getCurrentVersionString(), tomcatConfig);
            ui.pack();
            ui.setLocation(display.getWidth() / 2 - ui.getWidth() / 2,
                    display.getHeight() / 2 - ui.getHeight() / 2);
            
            ui.begin();
        }
    }

    public static Launcher start(String[] args, boolean noStdoutRedirect)
            throws IOException, URISyntaxException
    {
        return start(args, null, noStdoutRedirect);
    }

    public static Launcher start(TomcatConfig config, boolean noStdoutRedirect)
            throws IOException, URISyntaxException
    {
        return start(new String[] {"start"}, config, noStdoutRedirect);
    }

    public static Launcher start(String[] args, TomcatConfig config,
            boolean noStdoutRedirect) throws IOException, URISyntaxException
    {

        AppServer server = getServerInstance(args, config, noStdoutRedirect);
        server.start();
        return server.getLauncher();
    }

    public static AppServer getServerInstance(String[] args,
            boolean noStdoutRedirect) throws IOException, URISyntaxException
    {
        return getServerInstance(args, null, noStdoutRedirect);
    }

    public static AppServer getServerInstance(TomcatConfig config,
            boolean noStdoutRedirect) throws IOException, URISyntaxException
    {
        return getServerInstance(new String[] {"start"}, config, noStdoutRedirect);
    }

    public static AppServer getServerInstance(String[] args,
            TomcatConfig config, boolean noStdoutRedirect) throws IOException,
            URISyntaxException
    {

        File catalinaHome = init(noStdoutRedirect, config);

        printlnToLog("Studio Version is " + getCurrentVersionString());
        printlnToLog("Java version is " + System.getProperty("java.version"));
        printlnToLog("Starting Tomcat");

        // create context dir
        File catalinaDir = new File(new File(catalinaHome, "conf"), "Catalina");
        catalinaDir.mkdir();
        File localhostDir = new File(catalinaDir, "localhost");
        localhostDir.mkdir();

        // create our default context
        createDefaultContextXml(localhostDir);

        // create our context file for studio
        File studioDir = getStudioDir();
        if (studioDir.exists())
        {
            createContextXml(localhostDir, studioDir, studioWebApp);
        }

        File oldCatalinaWebApps = new File(getCatalinaHome(), "webapps");
        createContextXml(localhostDir, new File(oldCatalinaWebApps, "ROOT"),
                "ROOT");
        createContextXml(localhostDir, new File(oldCatalinaWebApps, "manager"),
                "manager");

        return createLauncher(args, catalinaHome);
    }

    public static void stop() throws URISyntaxException
    {
        stop(new String[]
                {
                    "stop"
                });
    }

    public static void stop(String[] args) throws URISyntaxException
    {
        File catalinaHome = getCatalinaHome();
        AppServer server = createLauncher(args, catalinaHome);
        server.start();
    }

    private static AppServer createLauncher(String[] args, File catalinaHome)
    {
        printlnToLog("Catalina Home is: " + catalinaHome);
        final Launcher launcher = new Launcher();
        launcher.setCatalinaHome(catalinaHome.getAbsolutePath());
        AppServer server = new AppServer(launcher, args);
        return server;
    }

    /**
     * Creates a classloader, then starts doInit(); Returns the new Catalina
     * home.
     *
     * @throws URISyntaxException
     * @throws IOException
     * @throws ClassNotFoundException
     */
    private static File init(boolean noStdoutRedirect,
            TomcatConfig configuration) throws IOException, URISyntaxException
    {

        File catalinaHome;
        try
        {
            catalinaHome = initHome(configuration);

            if (!noStdoutRedirect)
            {
                initStreams();
            }

            initDemosDir();
        }
        catch (SecurityException e)
        {
            throw new RuntimeException(e);
        }
        catch (IllegalArgumentException e)
        {
            throw new RuntimeException(e);
        }
        catch (ClassNotFoundException e)
        {
            throw new RuntimeException(e);
        }
        catch (NoSuchMethodException e)
        {
            throw new RuntimeException(e);
        }
        catch (IllegalAccessException e)
        {
            throw new RuntimeException(e);
        }
        catch (InvocationTargetException e)
        {
            throw new RuntimeException(e);
        }
        catch (InstantiationException e)
        {
            throw new RuntimeException(e);
        }

        CatalinaHome = catalinaHome;
        return catalinaHome;
    }

    /**
     * Create a temporary catalinaHome, copy everything into it, and return the
     * new location.
     */
    private static File initHome(TomcatConfig configuration)
            throws IOException, URISyntaxException, ClassNotFoundException,
            SecurityException, IllegalArgumentException, NoSuchMethodException,
            IllegalAccessException, InvocationTargetException
    {

        File newCatalinaHome = createTempDirectory("WMCatalinaHome", ".temp");
        File oldCatalinaHome = getCatalinaHome();

        copy(new File(oldCatalinaHome, "conf"), new File(newCatalinaHome,
                "conf"));
        if (configuration != null)
        {
            // Write current configuration to new home
            File serverXML = new File(newCatalinaHome, File.separator + "conf"
                    + File.separator + "server.xml");
            FileOutputStream os = new FileOutputStream(serverXML);
            configuration.serialize(os);
            os.close();
        }

        File webapp = new File(newCatalinaHome, "webapps");
        webapp.mkdir();

        return newCatalinaHome;
    }

    /**
     * Initialize the demos directory. Copies demos from the installer directory
     * to a directory in the user's wmHome, and then sets the registry key for
     * them.
     *
     * @throws InstantiationException
     */
    private static void initDemosDir() throws URISyntaxException, IOException,
            SecurityException, IllegalArgumentException,
            ClassNotFoundException, NoSuchMethodException,
            IllegalAccessException, InvocationTargetException,
            InstantiationException
    {

        File srcDemosDir = getSourceDemosDir();
        File destDemosDir = new File(getWaveMakerHome(), DEST_DEMOS_DIR);
        if (!destDemosDir.exists())
        {
            destDemosDir.mkdir();
        }

        if (null != srcDemosDir && srcDemosDir.exists())
        {
            for (File file : srcDemosDir.listFiles())
            {
                File destFile = new File(destDemosDir, file.getName());
                if (file.isDirectory() && !destFile.exists())
                {
                    copy(file, destFile);
                }
            }

            setDemosDir(destDemosDir);
        }
    }

    private static PrintStream initLogs() throws SecurityException,
            IllegalArgumentException, ClassNotFoundException,
            InstantiationException, IllegalAccessException,
            NoSuchMethodException, InvocationTargetException,
            URISyntaxException, MalformedURLException
    {
        File wmHome = getWaveMakerHome();
        File logDir = new File(wmHome, "logs");
        if (!logDir.exists())
        {
            logDir.mkdir();
        }
        File logFile = new File(logDir, "wm.log");

        PrintStream ps = null;
        try
        {
            ps = new PrintStream(new FileOutputStream(logFile, true));
            logOut = ps;
        }
        catch (FileNotFoundException e)
        {
            throw new RuntimeException("failed to init logging: "
                    + e.getMessage(), e);
        }
        return ps;
    }

    private static void initStreams() throws SecurityException,
            IllegalArgumentException, ClassNotFoundException,
            InstantiationException, IllegalAccessException,
            NoSuchMethodException, InvocationTargetException,
            URISyntaxException, MalformedURLException
    {
        // Create Logs
        PrintStream ps = initLogs();

        // Preserve Console Streams
        consoleOut = System.out;
        consoleErr = System.err;

        // Replace Console Streams
        System.setOut(ps);
        System.setErr(ps);
    }

    public static synchronized void printlnToConsole(String line)
    {
        if (consoleOut != null)
        {
            consoleOut.println(line);
        }
        else
        {
            System.out.println(line);
        }
    }

    public static synchronized void printlnToLog(String line)
    {
        if (logOut == null)
        {
            try
            {
                initLogs();
            }
            catch (SecurityException e)
            {
            }
            catch (IllegalArgumentException e)
            {
            }
            catch (MalformedURLException e)
            {
            }
            catch (ClassNotFoundException e)
            {
            }
            catch (InstantiationException e)
            {
            }
            catch (IllegalAccessException e)
            {
            }
            catch (NoSuchMethodException e)
            {
            }
            catch (InvocationTargetException e)
            {
            }
            catch (URISyntaxException e)
            {
            }
        }
        line = "WaveMaker: " + line;
        PrintStream ps = logOut;
        if (ps != null)
        {
            ps.println(line);
        }
        else
        {
            System.out.println(line);
        }
    }

    // wrapper methods around library classes
    private static ClassLoader getToolsClassLoader() throws URISyntaxException,
            MalformedURLException
    {

        File studioDir = getStudioDir();
        File wmToolsJar = new File(studioDir, "WEB-INF/lib/wmtools.jar");
        if (!wmToolsJar.exists())
        {
            throw new RuntimeException("No wmtools.jar found: " + wmToolsJar);
        }

        File wmCommonJar = new File(studioDir, "WEB-INF/lib/wmcommon.jar");
        if (!wmToolsJar.exists())
        {
            throw new RuntimeException("No wmcommon.jar found: " + wmCommonJar);
        }

        return new URLClassLoader(new URL[]
                {
                    wmToolsJar.toURI().toURL(),
                    wmCommonJar.toURI().toURL()
                });
    }

    private static Object invokeFromWM(String fqClass, String methodName,
            Class<?>[] argTypes, Object[] args, boolean isStatic)
    {

        try
        {
            ClassLoader old = Thread.currentThread().getContextClassLoader();
            try
            {
                ClassLoader cl = getToolsClassLoader();
                Thread.currentThread().setContextClassLoader(cl);

                Class<?> klass = cl.loadClass("com.wavemaker.tools.project.LauncherHelper");
                Method m = klass.getMethod("invoke", new Class<?>[]
                        {
                            ClassLoader.class, String.class, String.class,
                            (new Class<?>[]
                            {
                            }).getClass(),
                            (new Object[]
                            {
                            }).getClass(), Boolean.TYPE
                        });
                return m.invoke(null, new Object[]
                        {
                            cl, fqClass, methodName,
                            argTypes, args, isStatic
                        });
            }
            finally
            {
                Thread.currentThread().setContextClassLoader(old);
            }
        }
        catch (ClassNotFoundException e)
        {
            throw new RuntimeException(e);
        }
        catch (MalformedURLException e)
        {
            throw new RuntimeException(e);
        }
        catch (URISyntaxException e)
        {
            throw new RuntimeException(e);
        }
        catch (IllegalAccessException e)
        {
            throw new RuntimeException(e);
        }
        catch (SecurityException e)
        {
            throw new RuntimeException(e);
        }
        catch (NoSuchMethodException e)
        {
            throw new RuntimeException(e);
        }
        catch (IllegalArgumentException e)
        {
            throw new RuntimeException(e);
        }
        catch (InvocationTargetException e)
        {
            throw new RuntimeException(e);
        }
    }

    private static void copy(File source, File dest)
    {

        invokeFromWM("com.wavemaker.common.util.IOUtils", "copy",
                new Class<?>[]
                {
                    File.class, File.class
                }, new Object[]
                {
                    source, dest
                }, true);
    }

    public static File createTempDirectory(String prefix, String suffix)
    {

        return (File) invokeFromWM("com.wavemaker.common.util.IOUtils",
                "createTempDirectory", new Class<?>[]
                {
                    String.class,
                    String.class
                }, new Object[]
                {
                    prefix, suffix
                }, true);
    }

    private static File getWaveMakerHome()
    {

        Object result = invokeFromWM(
                "com.wavemaker.tools.project.StudioConfiguration",
                "getWaveMakerHome", new Class<?>[]
                {
                }, new Object[]
                {
                }, false);
        return (File) result;
    }

    private static void setDemosDir(File newDemosDir)
    {

        invokeFromWM("com.wavemaker.tools.project.StudioConfiguration",
                "setDemoDir", new Class<?>[]
                {
                    File.class
                },
                new Object[]
                {
                    newDemosDir
                }, false);
    }

    private static boolean isStudioUpgrade()
    {

        return (Boolean) invokeFromWM(
                "com.wavemaker.tools.project.LauncherHelper",
                "isStudioUpgrade", new Class<?>[]
                {
                }, new Object[]
                {
                }, false);
    }

    /**
     * Return true iff this is an upgrade and it's a major upgrade.
     */
    private static boolean isMajorUpgrade()
    {
        return (Boolean) invokeFromWM(
                "com.wavemaker.tools.project.LauncherHelper", "isMajorUpgrade",
                new Class<?>[]
                {
                }, new Object[]
                {
                }, false);
    }

    private static void doUpgrade(File waveMakerHome)
    {

        invokeFromWM("com.wavemaker.tools.project.LauncherHelper", "doUpgrade",
                new Class<?>[]
                {
                    File.class
                }, new Object[]
                {
                    waveMakerHome
                },
                false);
    }

    private static String getCurrentVersionString()
    {

        return (String) invokeFromWM(
                "com.wavemaker.tools.project.LauncherHelper",
                "getCurrentVersionString", new Class<?>[]
                {
                }, new Object[]
                {
                },
                false);
    }

    private static File getNewDefaultWMHome()
    {

        File result = null;
        String path = (String) invokeFromWM(
                "com.wavemaker.tools.project.LauncherHelper",
                "getNewDefaultWMHome", new Class<?>[]
                {
                }, new Object[]
                {
                }, false);

        if (path != null)
        {
            result = new File(path);
        }
        return result;
    }
}

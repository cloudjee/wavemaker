/*
 * Copyright (C) 2010-2011 WaveMaker Software, Inc.
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

/*
 * MainConsole.java
 *
 * Created on Dec 30, 2010, 2:13:25 PM
 */

package com.wavemaker.desktop.launcher.ui;

import com.wavemaker.desktop.launcher.AppServer;
import com.wavemaker.desktop.launcher.AppServer.SERVER_STATUS;
import com.wavemaker.desktop.launcher.InvalidServerConfigurationException;
import com.wavemaker.desktop.launcher.Main;
import com.wavemaker.desktop.launcher.TomcatConfig;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.prefs.Preferences;
import javax.swing.JDialog;
import javax.swing.JOptionPane;
import javax.swing.SwingUtilities;

import org.apache.catalina.Lifecycle;
import org.apache.catalina.LifecycleEvent;
import org.apache.catalina.LifecycleListener;

/**
 * MainConsole is the UI for the WM Studio Launcher (replaces MainLauncherUI as of v6.3.x).
 * The UI consist of a Start/Stop toggle button for starting the Tomcat server
 * and launching the default browser, and shutting the Tomcat server down.
 * Launch options for Studio debug, Live Layout, display page container content,
 * server port and shutdown port can be modified, as well.
 *
 * @author Craig Conover, cconover@wavemaker.com
 * @since 6.3
 */
public class MainConsole extends javax.swing.JFrame
{
    private static final long serialVersionUID = 1L;
    private static final ResourceBundle bundle = 
        ResourceBundle.getBundle("com/wavemaker/desktop/launcher/ui/Bundle");
    
    public static String OPTION_AUTO_LAUNCH = "autoLaunch";
    public static String OPTION_ENABLE_DEBUG = "debug";
    public static String OPTION_ENABLE_LIVELAYOUT = "livelayout";
    public static String OPTION_ENABLE_SUBPAGES = "subpages";
    public static String OPTION_SERVER_PORT = "serverport";
    public static String OPTION_SHUTDOWN_PORT = "shutdownport";
    public static String OPTION_STUDIO_BROWSER = "studioBrowser";
    
    public final static String VAL_SYS_DEF_BROWSER = bundle.getString("SYSTEM_DEFAULT_BROWSER");

    private final String version;
    private AppServer appServer;
    protected final TomcatConfig tomcatConfig;
    protected Preferences prefs = Preferences.userNodeForPackage(MainConsole.class);
    protected Map<String, String> optionsSave = new HashMap<String, String>();

    /** Creates new form MainConsole */
    public MainConsole(String version, TomcatConfig config)
    {
        initComponents();
        this.getContentPane().setBackground(Color.WHITE);
        
        String javaVersion = System.getProperty("java.version");
        
        if (!javaVersion.startsWith("1.6"))
        {
            Main.printlnToLog("########## no splash screen ##########");
            setVisible(true);
            pbStatus.setIndeterminate(true);
            pbStatus.setVisible(true);
        }
        
        this.version = version;
        setTitle(bundle.getString("MainConsole.title") + " " + version);

        try
        {
            BufferedImage source = javax.imageio.ImageIO.read(
                MainConsole.class.getResourceAsStream("wavemaker_small.png"));
            
            if (source != null)
            {
                BufferedImage icon = source;
                this.setIconImage(icon);
            }
        }
        catch (IOException e)
        {
            System.out.println("*****   exception: " + e.getMessage());
            e.printStackTrace();
        }

        tomcatConfig = config;
//        initPropertyListeners();
    }

//    static private boolean hasSplashScreen()
//    {
//        try
//        {
//            Class clazz = Class.forName("SplashScreen");
//            Method meth = clazz.getMethod("getSplashScreen");
//            return meth.invoke(null, new Object(){}) != null;
//        }
//        catch (IllegalAccessException ex)
//        {
//            Logger.getLogger(MainConsole.class.getName()).log(Level.SEVERE, null, ex);
//            return false;
//        }
//        catch (IllegalArgumentException ex)
//        {
//            Logger.getLogger(MainConsole.class.getName()).log(Level.SEVERE, null, ex);
//            return false;
//        }
//        catch (InvocationTargetException ex)
//        {
//            Logger.getLogger(MainConsole.class.getName()).log(Level.SEVERE, null, ex);
//            return false;
//        }        
//        catch (NoSuchMethodException ex)
//        {
//            Logger.getLogger(MainConsole.class.getName()).log(Level.SEVERE, null, ex);
//            return false;
//        }
//        catch (SecurityException ex)
//        {
//            Logger.getLogger(MainConsole.class.getName()).log(Level.SEVERE, null, ex);
//            return false;
//        }        
//        catch (ClassNotFoundException ex)
//        {
//            Logger.getLogger(MainConsole.class.getName()).log(Level.SEVERE, null, ex);
//            return false;
//        }
//    }


    private void initPropertyListeners()
    {
        // Setup Event handling for port status/fields
        tomcatConfig.addPropertyChangeListener(new PropertyChangeListener()
        {
            public void propertyChange(PropertyChangeEvent evt)
            {
                if (evt.getPropertyName().equals(TomcatConfig.PROPERTY_SHUTDOWN_PORT))
                {
                    //lblCurShutdownPortVal.setText(Integer.toString(tomcatConfig.getShutdownPort()));
                    //tfNewShutdownPort.setText(Integer.toString(tomcatConfig.getShutdownPort()));
                }
                else if (evt.getPropertyName().equals(TomcatConfig.PROPERTY_SERVICE_PORT))
                {
                    //lblCurServerPortVal.setText(Integer.toString(tomcatConfig.getServicePort()));
                    //tfNewServerPort.setText(Integer.toString(tomcatConfig.getServicePort()));
                }
            }
        });
    }
       
    public void begin()
    {
        if (prefs.getBoolean(OPTION_AUTO_LAUNCH, true)) 
        {
            btnStart.doClick();
        }
        else 
        {
            setVisible(true);
        }
    }

    public void openBrowser(String appName)
    {
        String attributes = "";

        if (prefs.getBoolean(OPTION_ENABLE_DEBUG, false))
        {
            attributes += "?debug";
        }
        
        if (!prefs.getBoolean(OPTION_ENABLE_LIVELAYOUT, true))
        {
            if (attributes.length() == 0)
            {
                attributes += "?nolive";
            }
            else
            {
                attributes += "&nolive";
            }
        }

        if (!prefs.getBoolean(OPTION_ENABLE_SUBPAGES, true))
        {
            if (attributes.length() == 0)
            {
                attributes += "?nopages";
            }
            else
            {
                attributes += "&nopages";
            }
        }

        try
        {
            URL target = new URL(
                "http://localhost:"
                + this.tomcatConfig.getServicePort()
                + "/" + Main.studioWebApp
                + "/" + attributes);

            String browser = prefs.get(OPTION_STUDIO_BROWSER, VAL_SYS_DEF_BROWSER);

            if (browser.equals(VAL_SYS_DEF_BROWSER))
            {
                BrowserLauncher.openURL(target);
            }
            else 
            {
                BrowserLauncher.openURL(target, browser);
            }
        }
        catch (MalformedURLException e)
        {
            e.printStackTrace();
        }
    }

    /** This method is called from within the constructor to
     * initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is
     * always regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        lblStatus = new javax.swing.JLabel();
        pbStatus = new javax.swing.JProgressBar();
        lblWMTitleLogo = new javax.swing.JLabel();
        jPanel1 = new javax.swing.JPanel();
        btnStart = new javax.swing.JButton();
        btnStop = new javax.swing.JButton();
        jPanel2 = new javax.swing.JPanel();
        btnAdvOpts = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        java.util.ResourceBundle bundle = java.util.ResourceBundle.getBundle("com/wavemaker/desktop/launcher/ui/Bundle"); // NOI18N
        setTitle(bundle.getString("MainConsole.title")); // NOI18N
        setBackground(new java.awt.Color(255, 255, 255));

        lblStatus.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblStatus.setText(bundle.getString("STATUS_MSG_STOPPED")); // NOI18N
        lblStatus.setBorder(javax.swing.BorderFactory.createEtchedBorder());

        pbStatus.setMaximum(4);

        lblWMTitleLogo.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblWMTitleLogo.setIcon(new javax.swing.ImageIcon(getClass().getResource("/com/wavemaker/desktop/launcher/ui/wm_title.png"))); // NOI18N
        lblWMTitleLogo.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        btnStart.setText(bundle.getString("MainConsole.btnStart.text")); // NOI18N
        btnStart.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnStartActionPerformed(evt);
            }
        });

        btnStop.setText(bundle.getString("MainConsole.btnStop.text")); // NOI18N
        btnStop.setEnabled(false);
        btnStop.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnStopActionPerformed(evt);
            }
        });

        org.jdesktop.layout.GroupLayout jPanel1Layout = new org.jdesktop.layout.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(org.jdesktop.layout.GroupLayout.TRAILING, jPanel1Layout.createSequentialGroup()
                .add(62, 62, 62)
                .add(btnStart, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 100, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                .add(106, 106, 106)
                .add(btnStop, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 100, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(75, Short.MAX_VALUE))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(org.jdesktop.layout.GroupLayout.TRAILING, jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .add(jPanel1Layout.createParallelGroup(org.jdesktop.layout.GroupLayout.BASELINE)
                    .add(btnStop, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 27, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                    .add(btnStart, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 27, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        jPanel2.setBackground(new java.awt.Color(255, 255, 255));

        btnAdvOpts.setText(bundle.getString("MainConsole.btnAdvOpts.text")); // NOI18N
        btnAdvOpts.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnAdvOptsActionPerformed(evt);
            }
        });

        org.jdesktop.layout.GroupLayout jPanel2Layout = new org.jdesktop.layout.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(org.jdesktop.layout.GroupLayout.TRAILING, jPanel2Layout.createSequentialGroup()
                .add(128, 128, 128)
                .add(btnAdvOpts, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 186, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(129, Short.MAX_VALUE))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .add(btnAdvOpts, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 27, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        org.jdesktop.layout.GroupLayout layout = new org.jdesktop.layout.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(layout.createSequentialGroup()
                .addContainerGap()
                .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
                    .add(lblWMTitleLogo, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 443, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                    .add(jPanel1, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                    .add(lblStatus, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, 443, Short.MAX_VALUE)
                    .add(pbStatus, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 443, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                    .add(jPanel2, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE))
                .addContainerGap())
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(layout.createSequentialGroup()
                .addContainerGap()
                .add(lblWMTitleLogo, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 31, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                .add(15, 15, 15)
                .add(jPanel1, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED)
                .add(lblStatus, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 26, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(org.jdesktop.layout.LayoutStyle.UNRELATED)
                .add(pbStatus, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 20, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED, 33, Short.MAX_VALUE)
                .add(jPanel2, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void btnAdvOptsActionPerformed(java.awt.event.ActionEvent evt)//GEN-FIRST:event_btnAdvOptsActionPerformed
    {//GEN-HEADEREND:event_btnAdvOptsActionPerformed
        try 
        {
            Main.printlnToLog("*** start btnAdvOptsActionPerformed");
            JDialog optsDlg = new LauncherAdvOptsDialog(this, true);
            optsDlg.getContentPane().setBackground(Color.WHITE);
            optsDlg.setLocationRelativeTo(this);
            optsDlg.setVisible(true);
            Main.printlnToLog("--- end btnAdvOptsActionPerformed");
        }
        catch (Exception e)
        {
            Main.printlnToLog(e.getMessage());
        }
    }//GEN-LAST:event_btnAdvOptsActionPerformed

    private void btnStartActionPerformed(java.awt.event.ActionEvent evt)//GEN-FIRST:event_btnStartActionPerformed
    {//GEN-HEADEREND:event_btnStartActionPerformed
//        int option = JOptionPane.showConfirmDialog(rootPane,
//            "Please wait while the Studio is being launched into your default browser."
//            + "\n\tDo you want to continue to see this message in the future?",
//            "Tomcat & Studio Launching...", JOptionPane.QUESTION_MESSAGE);
//
//        if (option == JOptionPane.NO_OPTION)
//        {
//            // set property to prevent showing this dialog in the future
//        }

        Runnable runner = new Runnable() 
        {
            public void run()
            {
                btnStart.setEnabled(false);
                btnAdvOpts.setEnabled(false);
                btnStop.setEnabled(true);
//                pbStatus.setIndeterminate(true);
//                pbStatus.setVisible(true);
            }
        };
        SwingUtilities.invokeLater(runner);

        if (appServer == null)
        {
            try
            {
                Main.printlnToLog(bundle.getString("STATUS_MSG_STARTING"));
                com.wavemaker.desktop.launcher.Server.ValidateConfig(tomcatConfig);
                appServer = Main.getServerInstance(tomcatConfig, false);

                appServer.getLauncher().addLifecycleListener(
                    new LifecycleListener()
                    {
                        public void lifecycleEvent(LifecycleEvent event)
                        {
                            if (Lifecycle.INIT_EVENT.equals(event.getType()))
                            {
//                                        updateSplashProgress(25,"Initializing");
                                        lblStatus.setText(bundle.getString("STATUS_MSG_INITIALIZING"));
//                                        pbStatus.setIndeterminate(false);
//                                        pbStatus.setValue(1);
                            }
                            else if (Lifecycle.BEFORE_START_EVENT.equals(event.getType()))
                            {
//                                        updateSplashProgress(50,"Starting...");
//                                        lblStatus.setText("Preparing to start... please wait");
//                                        pbStatus.setValue(2);
                            }
                            else if (Lifecycle.START_EVENT.equals(event.getType()))
                            {
//                                        updateSplashProgress(75,"Starting...");
//                                        lblStatus.setText("Starting...");
//                                        pbStatus.setValue(3);
                            }
                            else if (Lifecycle.AFTER_START_EVENT.equals(event.getType()))
                            {
//                                        updateSplashProgress(90,"STARTED");
//                                        pbStatus.setVisible(false);
//                                        pbStatus.setValue(4);
                                        lblStatus.setText(bundle.getString("STATUS_MSG_RUNNING"));
                                        if (!isVisible())
                                        {
                                            setVisible(true);
                                        }
                            }
                            else if (Lifecycle.BEFORE_STOP_EVENT.equals(event.getType()))
                            {
                                        lblStatus.setText(bundle.getString("STATUS_MSG_STOPPING"));
                                        btnStop.setEnabled(false);
                                        pbStatus.setVisible(true);
                                        pbStatus.setIndeterminate(true);
                            }
                            else if (Lifecycle.AFTER_STOP_EVENT.equals(event.getType()))
                            {
                                        lblStatus.setText(bundle.getString("STATUS_MSG_STOPPED"));
                                        pbStatus.setVisible(false);
                                        pbStatus.setIndeterminate(false);
                                        btnStart.setEnabled(true);
                                        btnStop.setEnabled(false);
                                        btnAdvOpts.setEnabled(true);
                            }
                        }
                    }
                );
            }
            catch (IOException e)
            {
                e.printStackTrace();
            }
            catch (URISyntaxException e)
            {
                e.printStackTrace();
            }
            catch (InvalidServerConfigurationException e)
            {
                JOptionPane.showMessageDialog(getParent(),
                    bundle.getString("STATUS_MSG_NO_PORTS_FOUND"));

                Main.printlnToLog(e.getMessage());
                if (Main.logOut != null)
                {
                    e.printStackTrace(Main.logOut);
                }
                else
                {
                    e.printStackTrace();
                }
            }
        }
        if ((appServer != null) && (appServer.getStatus() != SERVER_STATUS.RUNNING))
        {
            // Start Server
//            updateSplashProgress(25,"Starting WaveMaker... Please Wait.");
            // lblStatus.setText("STARTING");
            appServer.start();

            // Wait for server
            for (int i = 0; (i < 600) && (appServer.getStatus() != SERVER_STATUS.RUNNING); i++)
            {
                try
                {
                    Thread.sleep(100);
                }
                catch (InterruptedException e)
                {
                }
            }
            if (appServer.getStatus() != SERVER_STATUS.RUNNING)
            {
                JOptionPane.showMessageDialog(getParent(),
                    bundle.getString("STATUS_MSG_DID_NOT_START") + appServer.getStatus());
            }
        }

        try {
            if ((appServer != null) && (appServer.getStatus() == SERVER_STATUS.RUNNING))
            {
                btnStart.setEnabled(false);
    //            pbStatus.setVisible(false);
                if (Main.jarsAreMissing()) {
                    openBrowser(Main.studioConfigApp);
                } else {
					openBrowser(Main.studioWebApp);
				}
            }
            else
            {
                btnStart.setEnabled(true);
    //            pbStatus.setVisible(false);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }

//        pbStatus.setVisible(false);
        //btnStart.setEnabled(true);
    }//GEN-LAST:event_btnStartActionPerformed

    private void btnStopActionPerformed(java.awt.event.ActionEvent evt)//GEN-FIRST:event_btnStopActionPerformed
    {//GEN-HEADEREND:event_btnStopActionPerformed
        if (appServer != null)
        {
            appServer.stop();
        }
    }//GEN-LAST:event_btnStopActionPerformed
    
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btnAdvOpts;
    private javax.swing.JButton btnStart;
    private javax.swing.JButton btnStop;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JLabel lblStatus;
    private javax.swing.JLabel lblWMTitleLogo;
    private javax.swing.JProgressBar pbStatus;
    // End of variables declaration//GEN-END:variables

}

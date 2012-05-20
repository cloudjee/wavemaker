/*
 * Copyright (C) 2010-2012 WaveMaker Software, Inc.
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

/*
 * MainConsole.java
 *
 * Created on Dec 30, 2010, 2:13:25 PM
 */

package com.wavemaker.desktop.launcher.ui;

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

import org.apache.catalina.Lifecycle;
import org.apache.catalina.LifecycleEvent;
import org.apache.catalina.LifecycleListener;

import com.wavemaker.desktop.launcher.AppServer;
import com.wavemaker.desktop.launcher.AppServer.SERVER_STATUS;
import com.wavemaker.desktop.launcher.InvalidServerConfigurationException;
import com.wavemaker.desktop.launcher.Main;
import com.wavemaker.desktop.launcher.TomcatConfig;

/**
 * MainConsole is the UI for the WM Studio Launcher (replaces MainLauncherUI as of v6.3.x). The UI consist of a
 * Start/Stop toggle button for starting the Tomcat server and launching the default browser, and shutting the Tomcat
 * server down. Launch options for Studio debug, Live Layout, display page container content, server port and shutdown
 * port can be modified, as well.
 * 
 * @author Craig Conover
 * @since 6.3
 */
public class MainConsole extends javax.swing.JFrame {

    private Thread appServerThread = null;

    private static final long serialVersionUID = 1L;

    private static final ResourceBundle bundle = ResourceBundle.getBundle("com/wavemaker/desktop/launcher/ui/Bundle");

    public static String OPTION_AUTO_LAUNCH = "autoLaunch";

    public static String OPTION_ENABLE_DEBUG = "debug";

    public static String OPTION_ENABLE_LIVELAYOUT = "livelayout";

    public static String OPTION_ENABLE_SUBPAGES = "subpages";

    public static String OPTION_SERVER_PORT = "serverport";

    public static String OPTION_SHUTDOWN_PORT = "shutdownport";

    public static String OPTION_STUDIO_BROWSER = "studioBrowser";

    public static String OPTION_PROXY_ENABLED = "proxyEnabled";

    public static String OPTION_PROXY_SERVER = "proxyServer";

    public static String OPTION_PROXY_PORT = "proxyPort";

    public static String OPTION_PROXY_USERNAME = "proxyUsername";

    public static String OPTION_PROXY_PASSWORD = "proxyPassword";

    public final static String VAL_SYS_DEF_BROWSER = bundle.getString("SYSTEM_DEFAULT_BROWSER");

    private AppServer appServer;

    protected final TomcatConfig tomcatConfig;

    protected Preferences prefs = Preferences.userNodeForPackage(MainConsole.class);

    protected Map<String, String> optionsSave = new HashMap<String, String>();

    /** Creates new form MainConsole */
    public MainConsole(String version, TomcatConfig config) {
        initComponents();
        this.getContentPane().setBackground(Color.WHITE);

        String javaVersion = System.getProperty("java.version");

        if (!javaVersion.startsWith("1.6")) {
            Main.printlnToLog("########## no splash screen ##########");
            setVisible(true);
            this.pbStatus.setIndeterminate(true);
            this.pbStatus.setVisible(true);
        }

        // version is obtained from wavemaker-tools\src\main\resources\com\wavemaker\tools\project\version
        setTitle(bundle.getString("MainConsole.title") + " " + version);

        try {
            BufferedImage source = javax.imageio.ImageIO.read(MainConsole.class.getResourceAsStream("wavemaker_small.png"));

            if (source != null) {
                BufferedImage icon = source;
                this.setIconImage(icon);
            }
        } catch (IOException e) {
            System.out.println("*****   exception: " + e.getMessage());
            e.printStackTrace();
        }
        this.tomcatConfig = config;
        updatePortValues();
        initPropertyListeners();
    }

    private void initPropertyListeners() {
        // Setup Event handling for port status/fields
        this.tomcatConfig.addPropertyChangeListener(new PropertyChangeListener() {

            @Override
            public void propertyChange(PropertyChangeEvent evt) {
                if (evt.getPropertyName().equals(TomcatConfig.PROPERTY_SHUTDOWN_PORT)) {
                    MainConsole.this.lblCurrentShutdownPortVal.setText(Integer.toString(MainConsole.this.tomcatConfig.getShutdownPort()));
                    // tfNewShutdownPort.setText(Integer.toString(tomcatConfig.getShutdownPort()));
                } else if (evt.getPropertyName().equals(TomcatConfig.PROPERTY_SERVICE_PORT)) {
                    MainConsole.this.lblCurrentServerPortVal.setText(Integer.toString(MainConsole.this.tomcatConfig.getServicePort()));
                    // tfNewServerPort.setText(Integer.toString(tomcatConfig.getServicePort()));
                }
            }
        });
    }

    public void begin() {
        setVisible(true);

        if (this.prefs.getBoolean(OPTION_AUTO_LAUNCH, true)) {
            this.btnStart.doClick();
        }
    }

    public void openBrowser(String appName) {
        String attributes = "";

        if (this.prefs.getBoolean(OPTION_ENABLE_DEBUG, false)) {
            attributes += "?debug";
        }

        if (!this.prefs.getBoolean(OPTION_ENABLE_LIVELAYOUT, true)) {
            if (attributes.length() == 0) {
                attributes += "?nolive";
            } else {
                attributes += "&nolive";
            }
        }

        if (!this.prefs.getBoolean(OPTION_ENABLE_SUBPAGES, true)) {
            if (attributes.length() == 0) {
                attributes += "?nopages";
            } else {
                attributes += "&nopages";
            }
        }

        try {
            URL target = new URL("http://localhost:" + this.tomcatConfig.getServicePort() + "/" + appName + "/" + attributes);

            String browser = this.prefs.get(OPTION_STUDIO_BROWSER, VAL_SYS_DEF_BROWSER);

            if (browser.equals(VAL_SYS_DEF_BROWSER)) {
                BrowserLauncher.openURL(target);
            } else {
                BrowserLauncher.openURL(target, browser);
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
    }

    /**
     * This method is called from within the constructor to initialize the form. WARNING: Do NOT modify this code. The
     * content of this method is always regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {
        java.awt.GridBagConstraints gridBagConstraints;

        this.lblStatus = new javax.swing.JLabel();
        this.pbStatus = new javax.swing.JProgressBar();
        this.lblWMTitleLogo = new javax.swing.JLabel();
        this.pnlServerOps = new javax.swing.JPanel();
        this.btnStart = new javax.swing.JButton();
        this.btnStop = new javax.swing.JButton();
        this.pnlAdvOpts = new javax.swing.JPanel();
        this.btnAdvOpts = new javax.swing.JButton();
        this.pnlPortLbls = new javax.swing.JPanel();
        this.lblCurrentServerPort = new javax.swing.JLabel();
        this.lblCurrentShutdownPort = new javax.swing.JLabel();
        this.pnlPortVals = new javax.swing.JPanel();
        this.lblCurrentServerPortVal = new javax.swing.JLabel();
        this.lblCurrentShutdownPortVal = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        java.util.ResourceBundle bundle = java.util.ResourceBundle.getBundle("com/wavemaker/desktop/launcher/ui/Bundle"); // NOI18N
        setTitle(bundle.getString("MainConsole.title")); // NOI18N
        setBackground(new java.awt.Color(255, 255, 255));
        getContentPane().setLayout(new java.awt.GridBagLayout());

        this.lblStatus.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        this.lblStatus.setText(bundle.getString("STATUS_MSG_STOPPED")); // NOI18N
        this.lblStatus.setBorder(javax.swing.BorderFactory.createEtchedBorder());
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipady = 8;
        gridBagConstraints.insets = new java.awt.Insets(17, 10, 0, 0);
        getContentPane().add(this.lblStatus, gridBagConstraints);

        this.pbStatus.setMaximum(4);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 6;
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.insets = new java.awt.Insets(11, 10, 11, 10);
        getContentPane().add(this.pbStatus, gridBagConstraints);

        this.lblWMTitleLogo.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        this.lblWMTitleLogo.setIcon(new javax.swing.ImageIcon(getClass().getResource("/com/wavemaker/desktop/launcher/ui/wm_title.png"))); // NOI18N
        this.lblWMTitleLogo.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.insets = new java.awt.Insets(11, 10, 0, 0);
        getContentPane().add(this.lblWMTitleLogo, gridBagConstraints);

        this.pnlServerOps.setBackground(new java.awt.Color(255, 255, 255));
        this.pnlServerOps.setLayout(new java.awt.GridBagLayout());

        this.btnStart.setText(bundle.getString("MainConsole.btnStart.text")); // NOI18N
        this.btnStart.addActionListener(new java.awt.event.ActionListener() {

            @Override
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnStartActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.ipadx = 43;
        gridBagConstraints.ipady = 4;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(0, 150, 0, 0);
        this.pnlServerOps.add(this.btnStart, gridBagConstraints);

        this.btnStop.setText(bundle.getString("MainConsole.btnStop.text")); // NOI18N
        this.btnStop.setEnabled(false);
        this.btnStop.addActionListener(new java.awt.event.ActionListener() {

            @Override
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnStopActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.ipadx = 45;
        gridBagConstraints.ipady = 4;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(0, 70, 0, 148);
        this.pnlServerOps.add(this.btnStop, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.gridwidth = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.insets = new java.awt.Insets(15, 10, 0, 0);
        getContentPane().add(this.pnlServerOps, gridBagConstraints);

        this.pnlAdvOpts.setBackground(new java.awt.Color(255, 255, 255));
        this.pnlAdvOpts.setLayout(new java.awt.GridBagLayout());

        this.btnAdvOpts.setText(bundle.getString("MainConsole.btnAdvOpts.text")); // NOI18N
        this.btnAdvOpts.addActionListener(new java.awt.event.ActionListener() {

            @Override
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnAdvOptsActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.ipadx = 55;
        gridBagConstraints.ipady = 4;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(0, 190, 0, 180);
        this.pnlAdvOpts.add(this.btnAdvOpts, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 3;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.insets = new java.awt.Insets(18, 10, 0, 0);
        getContentPane().add(this.pnlAdvOpts, gridBagConstraints);

        this.pnlPortLbls.setBackground(new java.awt.Color(255, 255, 255));
        this.pnlPortLbls.setPreferredSize(new java.awt.Dimension(558, 20));
        this.pnlPortLbls.setLayout(new java.awt.GridBagLayout());

        this.lblCurrentServerPort.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        this.lblCurrentServerPort.setLabelFor(this.lblCurrentServerPortVal);
        this.lblCurrentServerPort.setText(bundle.getString("MainConsole.lblCurrentServerPort.text")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.gridheight = 2;
        gridBagConstraints.ipadx = 40;
        gridBagConstraints.ipady = 3;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        this.pnlPortLbls.add(this.lblCurrentServerPort, gridBagConstraints);

        this.lblCurrentShutdownPort.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
        this.lblCurrentShutdownPort.setLabelFor(this.lblCurrentShutdownPortVal);
        this.lblCurrentShutdownPort.setText(bundle.getString("MainConsole.lblCurrentShutdownPort.text")); // NOI18N
        this.lblCurrentShutdownPort.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);
        this.lblCurrentShutdownPort.setPreferredSize(new java.awt.Dimension(60, 14));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.ipadx = 40;
        gridBagConstraints.ipady = 3;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHEAST;
        gridBagConstraints.insets = new java.awt.Insets(0, 310, 0, 0);
        this.pnlPortLbls.add(this.lblCurrentShutdownPort, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 4;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.insets = new java.awt.Insets(18, 10, 0, 10);
        getContentPane().add(this.pnlPortLbls, gridBagConstraints);

        this.pnlPortVals.setBackground(new java.awt.Color(255, 255, 255));
        this.pnlPortVals.setPreferredSize(new java.awt.Dimension(558, 20));
        this.pnlPortVals.setLayout(new java.awt.GridBagLayout());

        this.lblCurrentServerPortVal.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
        this.lblCurrentServerPortVal.setText(bundle.getString("MainConsole.lblCurrentServerPortVal.text")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.ipadx = 60;
        gridBagConstraints.ipady = 15;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        this.pnlPortVals.add(this.lblCurrentServerPortVal, gridBagConstraints);

        this.lblCurrentShutdownPortVal.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
        this.lblCurrentShutdownPortVal.setText(bundle.getString("MainConsole.lblCurrentShutdownPortVal.text")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.ipadx = 60;
        gridBagConstraints.ipady = 15;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHEAST;
        gridBagConstraints.insets = new java.awt.Insets(0, 340, 0, 0);
        this.pnlPortVals.add(this.lblCurrentShutdownPortVal, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridy = 5;
        getContentPane().add(this.pnlPortVals, gridBagConstraints);

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void btnAdvOptsActionPerformed(java.awt.event.ActionEvent evt)// GEN-FIRST:event_btnAdvOptsActionPerformed
    {// GEN-HEADEREND:event_btnAdvOptsActionPerformed
        try {
            Main.printlnToLog("*** start btnAdvOptsActionPerformed");
            JDialog optsDlg = new LauncherAdvOptsDialog(this, true);
            optsDlg.getContentPane().setBackground(Color.WHITE);
            optsDlg.setLocationRelativeTo(this);
            optsDlg.setVisible(true);
            updatePortValues();
            Main.printlnToLog("--- end btnAdvOptsActionPerformed");
        } catch (Exception e) {
            Main.printlnToLog(e.getMessage());
        }
    }// GEN-LAST:event_btnAdvOptsActionPerformed

    private void btnStartActionPerformed(java.awt.event.ActionEvent evt)// GEN-FIRST:event_btnStartActionPerformed
    {// GEN-HEADEREND:event_btnStartActionPerformed

        this.btnStart.setEnabled(false);
        this.btnAdvOpts.setEnabled(false);
        this.pbStatus.setIndeterminate(true);
        this.pbStatus.setVisible(true);

        if (this.appServerThread == null) {
            Runnable runner = new Runnable() {

                @Override
                public void run() {
                    startServer();
                }
            };
            this.appServerThread = new Thread(runner);
        }

        this.appServerThread.start();
    }// GEN-LAST:event_btnStartActionPerformed

    private void btnStopActionPerformed(java.awt.event.ActionEvent evt)// GEN-FIRST:event_btnStopActionPerformed
    {// GEN-HEADEREND:event_btnStopActionPerformed
        if (this.appServer != null) {
            if (this.appServerThread != null) {
                this.appServerThread.stop();
                this.appServerThread = null;
            }
            this.appServer.stop();
        }
    }// GEN-LAST:event_btnStopActionPerformed

    private void startServer() {
        if (this.appServer == null) {
            this.btnStart.setEnabled(false);
            this.lblStatus.setText(bundle.getString("STATUS_MSG_INITIALIZING"));
            this.pbStatus.setIndeterminate(true);

            try {
                Main.printlnToLog(bundle.getString("STATUS_MSG_STARTING"));
                com.wavemaker.desktop.launcher.Server.ValidateConfig(this.tomcatConfig);
                this.appServer = Main.getServerInstance(this.tomcatConfig, false);

                this.appServer.getLauncher().addLifecycleListener(new LifecycleListener() {

                    @Override
                    public void lifecycleEvent(LifecycleEvent event) {
                        if (Lifecycle.INIT_EVENT.equals(event.getType())) {
                            MainConsole.this.btnStart.setEnabled(false);
                            MainConsole.this.lblStatus.setText(bundle.getString("STATUS_MSG_INITIALIZING"));
                            MainConsole.this.pbStatus.setIndeterminate(true);
                            // pbStatus.setValue(1);
                        } else if (Lifecycle.BEFORE_START_EVENT.equals(event.getType())) {
                            MainConsole.this.lblStatus.setText(bundle.getString("STATUS_MSG_ABOUT_TO_START"));
                            // pbStatus.setValue(2);
                        } else if (Lifecycle.START_EVENT.equals(event.getType())) {
                            MainConsole.this.lblStatus.setText(bundle.getString("STATUS_MSG_STARTING"));
                            // pbStatus.setValue(3);
                        } else if (Lifecycle.AFTER_START_EVENT.equals(event.getType())) {
                            MainConsole.this.lblStatus.setText(bundle.getString("STATUS_MSG_RUNNING"));
                            MainConsole.this.btnStart.setEnabled(false);
                            MainConsole.this.btnAdvOpts.setEnabled(false);
                            MainConsole.this.btnStop.setEnabled(true);
                            // pbStatus.setValue(4);
                            MainConsole.this.pbStatus.setVisible(false);
                            doLaunch();
                        } else if (Lifecycle.BEFORE_STOP_EVENT.equals(event.getType())) {
                            MainConsole.this.lblStatus.setText(bundle.getString("STATUS_MSG_STOPPING"));
                            MainConsole.this.btnStop.setEnabled(false);
                            MainConsole.this.pbStatus.setVisible(true);
                            MainConsole.this.pbStatus.setIndeterminate(true);
                        } else if (Lifecycle.AFTER_STOP_EVENT.equals(event.getType())) {
                            MainConsole.this.lblStatus.setText(bundle.getString("STATUS_MSG_STOPPED"));
                            MainConsole.this.pbStatus.setVisible(false);
                            MainConsole.this.pbStatus.setIndeterminate(false);
                            MainConsole.this.btnStart.setEnabled(true);
                            MainConsole.this.btnStop.setEnabled(false);
                            MainConsole.this.btnAdvOpts.setEnabled(true);
                        }
                    }
                });
            } catch (IOException e) {
                e.printStackTrace();
            } catch (URISyntaxException e) {
                e.printStackTrace();
            } catch (InvalidServerConfigurationException e) {
                JOptionPane.showMessageDialog(getParent(), bundle.getString("STATUS_MSG_NO_PORTS_FOUND"));

                Main.printlnToLog(e.getMessage());

                if (Main.logOut != null) {
                    e.printStackTrace(Main.logOut);
                } else {
                    e.printStackTrace();
                }
            }
        }

        if (this.appServer != null && this.appServer.getStatus() != SERVER_STATUS.RUNNING) {
            // Start Server
            configureProxySettings();
            this.appServer.start();

            // Wait for server
            // for (int i = 0; (i < 600) && (appServer.getStatus() != SERVER_STATUS.RUNNING); i++) {
            // try {
            // Thread.sleep(100);
            // } catch (InterruptedException e) {
            // e.printStackTrace();
            // }
            // }
            // if (appServer.getStatus() != SERVER_STATUS.RUNNING) {
            // JOptionPane.showMessageDialog(getParent(),
            // bundle.getString("STATUS_MSG_DID_NOT_START") + appServer.getStatus());
            // }
        }

        doLaunch();
    }

    private void doLaunch() {
        try {
            if (this.appServer != null && this.appServer.getStatus() == SERVER_STATUS.RUNNING) {
                this.btnStart.setEnabled(false);
                // pbStatus.setVisible(false);
                if (Main.jarsAreMissing()) {
                    if (Main.noWritePermission()) {
                        JOptionPane.showMessageDialog(getParent(), bundle.getString("STATUS_MSG_NO_ADMIN_CAPA"));
                        this.appServer.stop();
                        // this.dispose();
                    } else {
                        openBrowser(Main.studioConfigWebApp);
                    }
                } else {
                    openBrowser(Main.studioWebApp);
                }
            }
            // else
            // {
            // btnStart.setEnabled(true);
            // pbStatus.setVisible(false);
            // }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btnAdvOpts;

    private javax.swing.JButton btnStart;

    private javax.swing.JButton btnStop;

    private javax.swing.JLabel lblCurrentServerPort;

    private javax.swing.JLabel lblCurrentServerPortVal;

    private javax.swing.JLabel lblCurrentShutdownPort;

    private javax.swing.JLabel lblCurrentShutdownPortVal;

    private javax.swing.JLabel lblStatus;

    private javax.swing.JLabel lblWMTitleLogo;

    private javax.swing.JProgressBar pbStatus;

    private javax.swing.JPanel pnlAdvOpts;

    private javax.swing.JPanel pnlPortLbls;

    private javax.swing.JPanel pnlPortVals;

    private javax.swing.JPanel pnlServerOps;

    // End of variables declaration//GEN-END:variables

    protected void configureProxySettings() {
        if (this.prefs.getBoolean(OPTION_PROXY_ENABLED, false)) {
            // proxy settings are enabled
            System.getProperties().put("proxySet", "true");

            Object prop = this.prefs.get(OPTION_PROXY_SERVER, null);
            System.getProperties().put("http.proxyHost", prop);

            if (prop != null) {
                prop = this.prefs.get(OPTION_PROXY_PORT, null);
                if (prop != null) {
                    System.getProperties().put("http.proxyPort", prop);
                }

                prop = this.prefs.get(OPTION_PROXY_USERNAME, null);
                if (prop != null) {
                    System.getProperties().put("http.proxyUser", prop);

                    prop = this.prefs.get(OPTION_PROXY_PASSWORD, null);
                    if (prop != null) {
                        System.getProperties().put("http.proxyPassword", prop);
                    }
                }
            }
        } else {
            // proxy settings are NOT enabled
            System.getProperties().setProperty("proxySet", "");
            System.getProperties().setProperty("http.proxyHost", "");
            System.getProperties().setProperty("http.proxyPort", "");
            System.getProperties().setProperty("http.proxyUser", "");
            System.getProperties().setProperty("http.proxyPassword", "");
        }
    }

    private void updatePortValues() {
        this.lblCurrentServerPortVal.setText(String.valueOf(this.tomcatConfig.getServicePort()));
        this.lblCurrentShutdownPortVal.setText(String.valueOf(this.tomcatConfig.getShutdownPort()));
    }
}

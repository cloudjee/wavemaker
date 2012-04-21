/*
 * Copyright (C) 2012 VMWare, Inc. All rights reserved.
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
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * LauncherAdvOptsDialog.java
 *
 * Created on Jan 5, 2011, 11:43:55 AM
 */
package com.wavemaker.desktop.launcher.ui;

import com.wavemaker.desktop.launcher.Main;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ResourceBundle;
import javax.swing.JFileChooser;
import javax.swing.JOptionPane;

/**
 *
 * @author cconover
 */
public class LauncherAdvOptsDialog extends javax.swing.JDialog
{
    private static final ResourceBundle bundle = 
        ResourceBundle.getBundle("com/wavemaker/desktop/launcher/ui/Bundle");
    
    private MainConsole console;
    private String folder = null;

    /** Creates new form LauncherAdvOptsDialog */
    public LauncherAdvOptsDialog(java.awt.Frame parent, boolean modal)
    {
        super(parent, modal);
        console = (MainConsole)parent;
        initComponents();
        initOptions();
    }
    
    private void initOptions()
    {
        ckbAutoLaunch.setSelected(console.prefs.getBoolean(MainConsole.OPTION_AUTO_LAUNCH, false));
        tfBrowser.setText(console.prefs.get(MainConsole.OPTION_STUDIO_BROWSER, MainConsole.VAL_SYS_DEF_BROWSER));
        ckbStudioDebug.setSelected(console.prefs.getBoolean(MainConsole.OPTION_ENABLE_DEBUG, false));
        ckbLiveLayout.setSelected(console.prefs.getBoolean(MainConsole.OPTION_ENABLE_LIVELAYOUT, true));
        ckbSubPageDisplay.setSelected(console.prefs.getBoolean(MainConsole.OPTION_ENABLE_SUBPAGES, true));
        tfNewServerPort.setText(String.valueOf(console.tomcatConfig.getServicePort()));
        tfNewShutdownPort.setText(String.valueOf(console.tomcatConfig.getShutdownPort()));

        ckbProxyEnabled.setSelected(console.prefs.getBoolean(MainConsole.OPTION_PROXY_ENABLED, false));
        tfNewProxyServer.setText(console.prefs.get(MainConsole.OPTION_PROXY_SERVER, null));
        tfNewProxyPort.setText(console.prefs.get(MainConsole.OPTION_PROXY_PORT, null));
        tfNewProxyUsername.setText(console.prefs.get(MainConsole.OPTION_PROXY_USERNAME, null));

//        String pwd = console.prefs.get(MainConsole.OPTION_PROXY_PASSWORD, null);
//        if (pwd != null)
//        {
//            tfNewProxyPassword.setText("********");
//        }
        
        console.optionsSave.put(MainConsole.OPTION_AUTO_LAUNCH,
            String.valueOf(console.prefs.getBoolean(MainConsole.OPTION_AUTO_LAUNCH, true)));

        console.optionsSave.put(MainConsole.OPTION_STUDIO_BROWSER, 
            String.valueOf(console.prefs.get(MainConsole.OPTION_STUDIO_BROWSER, MainConsole.VAL_SYS_DEF_BROWSER)));

        console.optionsSave.put(MainConsole.OPTION_ENABLE_DEBUG,
            String.valueOf(console.prefs.getBoolean(MainConsole.OPTION_ENABLE_DEBUG, false)));

        console.optionsSave.put(MainConsole.OPTION_ENABLE_LIVELAYOUT, 
            String.valueOf(console.prefs.getBoolean(MainConsole.OPTION_ENABLE_LIVELAYOUT, true)));

        console.optionsSave.put(MainConsole.OPTION_ENABLE_SUBPAGES, 
            String.valueOf(console.prefs.getBoolean(MainConsole.OPTION_ENABLE_SUBPAGES, true)));

        console.optionsSave.put(MainConsole.OPTION_SERVER_PORT, 
            String.valueOf(console.tomcatConfig.getServicePort()));

        console.optionsSave.put(MainConsole.OPTION_SHUTDOWN_PORT,
            String.valueOf(console.tomcatConfig.getShutdownPort()));

        console.optionsSave.put(MainConsole.OPTION_PROXY_ENABLED,
            String.valueOf(console.prefs.getBoolean(MainConsole.OPTION_PROXY_ENABLED, true)));

        console.optionsSave.put(MainConsole.OPTION_PROXY_SERVER, 
            String.valueOf(console.prefs.get(MainConsole.OPTION_PROXY_SERVER, "")));

        console.optionsSave.put(MainConsole.OPTION_PROXY_PORT, 
            String.valueOf(console.prefs.get(MainConsole.OPTION_PROXY_PORT, "")));

        console.optionsSave.put(MainConsole.OPTION_PROXY_USERNAME, 
            String.valueOf(console.prefs.get(MainConsole.OPTION_PROXY_USERNAME, "")));

        console.optionsSave.put(MainConsole.OPTION_PROXY_PASSWORD, 
            String.valueOf(console.prefs.get(MainConsole.OPTION_PROXY_PASSWORD, "")));
        
        configureProxyFields(ckbProxyEnabled.isSelected());
    }

    /** This method is called from within the constructor to
     * initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is
     * always regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {
        java.awt.GridBagConstraints gridBagConstraints;

        btnReset = new javax.swing.JButton();
        ckbAutoLaunch = new javax.swing.JCheckBox();
        lblBrowser = new javax.swing.JLabel();
        tfBrowser = new javax.swing.JTextField();
        btnFileChooser = new javax.swing.JButton();
        btnDefBrowser = new javax.swing.JButton();
        pnlCheckboxes = new javax.swing.JPanel();
        ckbLiveLayout = new javax.swing.JCheckBox();
        ckbSubPageDisplay = new javax.swing.JCheckBox();
        ckbStudioDebug = new javax.swing.JCheckBox();
        pnlPorts = new javax.swing.JPanel();
        lblNewServerPort = new javax.swing.JLabel();
        tfNewServerPort = new javax.swing.JTextField();
        lblNewShutdownPort = new javax.swing.JLabel();
        tfNewShutdownPort = new javax.swing.JTextField();
        pnlProxy = new javax.swing.JPanel();
        ckbProxyEnabled = new javax.swing.JCheckBox();
        lblNewProxyServer = new javax.swing.JLabel();
        tfNewProxyServer = new javax.swing.JTextField();
        lblNewProxyPort = new javax.swing.JLabel();
        tfNewProxyPort = new javax.swing.JTextField();
        lblNewProxyUsername = new javax.swing.JLabel();
        tfNewProxyUsername = new javax.swing.JTextField();
        lblNewProxyPassword = new javax.swing.JLabel();
        tfNewProxyPassword = new javax.swing.JPasswordField();
        pnlButtons = new javax.swing.JPanel();
        btnCancel = new javax.swing.JButton();
        btnSave = new javax.swing.JButton();

        java.util.ResourceBundle bundle = java.util.ResourceBundle.getBundle("com/wavemaker/desktop/launcher/ui/Bundle"); // NOI18N
        btnReset.setText(bundle.getString("LauncherAdvOptsDialog.btnReset.text")); // NOI18N
        btnReset.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnResetActionPerformed(evt);
            }
        });

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);
        setTitle(bundle.getString("LauncherAdvOptsDialog.title")); // NOI18N
        setAlwaysOnTop(true);
        setName("LaunchAdvOptsDlg"); // NOI18N
        getContentPane().setLayout(new java.awt.GridBagLayout());

        ckbAutoLaunch.setBackground(new java.awt.Color(255, 255, 255));
        ckbAutoLaunch.setSelected(true);
        ckbAutoLaunch.setText(bundle.getString("LauncherAdvOptsDialog.ckbAutoLaunch.text")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.gridwidth = 2;
        gridBagConstraints.ipadx = 23;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(7, 10, 0, 0);
        getContentPane().add(ckbAutoLaunch, gridBagConstraints);

        lblBrowser.setLabelFor(tfBrowser);
        lblBrowser.setText(bundle.getString("LauncherAdvOptsDialog.lblBrowser.text")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.ipadx = 32;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(5, 10, 0, 0);
        getContentPane().add(lblBrowser, gridBagConstraints);

        tfBrowser.setEditable(false);
        tfBrowser.setText(bundle.getString("SYSTEM_DEFAULT_BROWSER")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.gridwidth = 9;
        gridBagConstraints.gridheight = 2;
        gridBagConstraints.ipadx = 650;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 4, 0, 0);
        getContentPane().add(tfBrowser, gridBagConstraints);

        btnFileChooser.setIcon(new javax.swing.ImageIcon(getClass().getResource("/com/wavemaker/desktop/launcher/ui/folder.png"))); // NOI18N
        btnFileChooser.setText(bundle.getString("LauncherAdvOptsDialog.btnFileChooser.text")); // NOI18N
        btnFileChooser.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnFileChooserActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 18;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.gridheight = 2;
        gridBagConstraints.ipadx = -19;
        gridBagConstraints.ipady = -5;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 6, 0, 10);
        getContentPane().add(btnFileChooser, gridBagConstraints);

        btnDefBrowser.setText(bundle.getString("LauncherAdvOptsDialog.btnDefBrowser.text")); // NOI18N
        btnDefBrowser.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnDefBrowserActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 3;
        gridBagConstraints.gridwidth = 4;
        gridBagConstraints.ipadx = 31;
        gridBagConstraints.ipady = 4;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(6, 4, 0, 0);
        getContentPane().add(btnDefBrowser, gridBagConstraints);

        pnlCheckboxes.setBackground(new java.awt.Color(255, 255, 255));
        pnlCheckboxes.setBorder(javax.swing.BorderFactory.createTitledBorder(bundle.getString("LauncherAdvOptsDialog.pnlCheckboxes.border.title"))); // NOI18N
        pnlCheckboxes.setLayout(new java.awt.GridBagLayout());

        ckbLiveLayout.setBackground(new java.awt.Color(255, 255, 255));
        ckbLiveLayout.setSelected(true);
        ckbLiveLayout.setText(bundle.getString("LauncherAdvOptsDialog.ckbLiveLayout.text")); // NOI18N
        ckbLiveLayout.setToolTipText(bundle.getString("LauncherAdvOptsDialog.ckbLiveLayout.toolTipText")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.ipadx = 62;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(29, 14, 0, 14);
        pnlCheckboxes.add(ckbLiveLayout, gridBagConstraints);

        ckbSubPageDisplay.setBackground(new java.awt.Color(255, 255, 255));
        ckbSubPageDisplay.setSelected(true);
        ckbSubPageDisplay.setText(bundle.getString("LauncherAdvOptsDialog.ckbSubPageDisplay.text")); // NOI18N
        ckbSubPageDisplay.setToolTipText(bundle.getString("LauncherAdvOptsDialog.ckbSubPageDisplay.toolTipText")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.ipadx = 12;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(3, 14, 0, 14);
        pnlCheckboxes.add(ckbSubPageDisplay, gridBagConstraints);

        ckbStudioDebug.setBackground(new java.awt.Color(255, 255, 255));
        ckbStudioDebug.setText(bundle.getString("LauncherAdvOptsDialog.ckbStudioDebug.text")); // NOI18N
        ckbStudioDebug.setToolTipText(bundle.getString("LauncherAdvOptsDialog.ckbStudioDebug.toolTipText")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.ipadx = 86;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(3, 14, 63, 14);
        pnlCheckboxes.add(ckbStudioDebug, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 4;
        gridBagConstraints.gridwidth = 3;
        gridBagConstraints.ipady = -30;
        gridBagConstraints.insets = new java.awt.Insets(11, 10, 0, 0);
        getContentPane().add(pnlCheckboxes, gridBagConstraints);

        pnlPorts.setBackground(new java.awt.Color(255, 255, 255));
        pnlPorts.setBorder(javax.swing.BorderFactory.createTitledBorder(bundle.getString("LauncherAdvOptsDialog.pnlPorts.border.title"))); // NOI18N
        pnlPorts.setLayout(new java.awt.GridBagLayout());

        lblNewServerPort.setLabelFor(tfNewServerPort);
        lblNewServerPort.setText(bundle.getString("LauncherAdvOptsDialog.lblNewServerPort.text")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.ipadx = 39;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(31, 18, 0, 0);
        pnlPorts.add(lblNewServerPort, gridBagConstraints);

        tfNewServerPort.setText("8194");
        tfNewServerPort.setToolTipText(bundle.getString("LauncherAdvOptsDialog.tfNewServerPort.toolTipText")); // NOI18N
        tfNewServerPort.addFocusListener(new java.awt.event.FocusAdapter() {
            public void focusLost(java.awt.event.FocusEvent evt) {
                tfNewServerPortFocusLost(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.gridheight = 2;
        gridBagConstraints.ipadx = 34;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(28, 10, 0, 18);
        pnlPorts.add(tfNewServerPort, gridBagConstraints);

        lblNewShutdownPort.setLabelFor(tfNewShutdownPort);
        lblNewShutdownPort.setText(bundle.getString("LauncherAdvOptsDialog.lblNewShutdownPort.text")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.ipadx = 20;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(9, 18, 0, 0);
        pnlPorts.add(lblNewShutdownPort, gridBagConstraints);

        tfNewShutdownPort.setText("8119");
        tfNewShutdownPort.setToolTipText(bundle.getString("LauncherAdvOptsDialog.tfNewShutdownPort.toolTipText")); // NOI18N
        tfNewShutdownPort.addFocusListener(new java.awt.event.FocusAdapter() {
            public void focusLost(java.awt.event.FocusEvent evt) {
                tfNewShutdownPortFocusLost(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.gridheight = 2;
        gridBagConstraints.ipadx = 34;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(6, 10, 93, 18);
        pnlPorts.add(tfNewShutdownPort, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 4;
        gridBagConstraints.gridy = 4;
        gridBagConstraints.gridwidth = 5;
        gridBagConstraints.ipadx = 24;
        gridBagConstraints.ipady = -30;
        gridBagConstraints.insets = new java.awt.Insets(11, 10, 0, 0);
        getContentPane().add(pnlPorts, gridBagConstraints);

        pnlProxy.setBackground(new java.awt.Color(255, 255, 255));
        pnlProxy.setBorder(javax.swing.BorderFactory.createTitledBorder(bundle.getString("LauncherAdvOptsDialog.pnlProxy.border.title"))); // NOI18N
        pnlProxy.setLayout(new java.awt.GridBagLayout());

        ckbProxyEnabled.setBackground(new java.awt.Color(255, 255, 255));
        ckbProxyEnabled.setText(bundle.getString("LauncherAdvOptsDialog.ckbProxyEnabled.text")); // NOI18N
        ckbProxyEnabled.setToolTipText(bundle.getString("LauncherAdvOptsDialog.ckbProxyEnabled.toolTipText")); // NOI18N
        ckbProxyEnabled.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                ckbProxyEnabledActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.gridwidth = 3;
        gridBagConstraints.ipadx = 114;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(22, 14, 0, 0);
        pnlProxy.add(ckbProxyEnabled, gridBagConstraints);

        lblNewProxyServer.setLabelFor(tfNewProxyServer);
        lblNewProxyServer.setText(bundle.getString("LauncherAdvOptsDialog.lblNewProxyServer.text")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.ipadx = 10;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(8, 18, 0, 0);
        pnlProxy.add(lblNewProxyServer, gridBagConstraints);

        tfNewProxyServer.setText("null");
        tfNewProxyServer.setToolTipText(bundle.getString("LauncherAdvOptsDialog.tfNewProxyServer.toolTipText")); // NOI18N
        tfNewProxyServer.setEnabled(false);
        tfNewProxyServer.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                tfNewProxyServerActionPerformed(evt);
            }
        });
        tfNewProxyServer.addFocusListener(new java.awt.event.FocusAdapter() {
            public void focusLost(java.awt.event.FocusEvent evt) {
                tfNewProxyServerFocusLost(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.gridwidth = 4;
        gridBagConstraints.gridheight = 2;
        gridBagConstraints.ipadx = 156;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(5, 10, 0, 18);
        pnlProxy.add(tfNewProxyServer, gridBagConstraints);

        lblNewProxyPort.setLabelFor(tfNewProxyPort);
        lblNewProxyPort.setText(bundle.getString("LauncherAdvOptsDialog.lblNewProxyPort.text")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 3;
        gridBagConstraints.ipadx = 19;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(9, 18, 0, 0);
        pnlProxy.add(lblNewProxyPort, gridBagConstraints);

        tfNewProxyPort.setText("null");
        tfNewProxyPort.setToolTipText(bundle.getString("LauncherAdvOptsDialog.tfNewProxyPort.toolTipText")); // NOI18N
        tfNewProxyPort.setEnabled(false);
        tfNewProxyPort.addFocusListener(new java.awt.event.FocusAdapter() {
            public void focusLost(java.awt.event.FocusEvent evt) {
                tfNewProxyPortFocusLost(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 3;
        gridBagConstraints.gridheight = 2;
        gridBagConstraints.ipadx = 34;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(6, 10, 0, 0);
        pnlProxy.add(tfNewProxyPort, gridBagConstraints);
        tfNewProxyPort.getAccessibleContext().setAccessibleDescription(bundle.getString("LauncherAdvOptsDialog.tfNewProxyPort.AccessibleContext.accessibleDescription")); // NOI18N

        lblNewProxyUsername.setLabelFor(tfNewProxyPort);
        lblNewProxyUsername.setText(bundle.getString("LauncherAdvOptsDialog.lblNewProxyUsername.text")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 5;
        gridBagConstraints.ipadx = 25;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(9, 18, 0, 0);
        pnlProxy.add(lblNewProxyUsername, gridBagConstraints);

        tfNewProxyUsername.setText("null");
        tfNewProxyUsername.setToolTipText(bundle.getString("LauncherAdvOptsDialog.tfNewProxyUsername.toolTipText")); // NOI18N
        tfNewProxyUsername.setEnabled(false);
        tfNewProxyUsername.addFocusListener(new java.awt.event.FocusAdapter() {
            public void focusLost(java.awt.event.FocusEvent evt) {
                tfNewProxyUsernameFocusLost(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 5;
        gridBagConstraints.gridwidth = 4;
        gridBagConstraints.gridheight = 2;
        gridBagConstraints.ipadx = 156;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(6, 10, 0, 18);
        pnlProxy.add(tfNewProxyUsername, gridBagConstraints);

        lblNewProxyPassword.setLabelFor(tfNewProxyPort);
        lblNewProxyPassword.setText(bundle.getString("LauncherAdvOptsDialog.lblNewProxyPassword.text")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 7;
        gridBagConstraints.ipadx = 27;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(9, 18, 0, 0);
        pnlProxy.add(lblNewProxyPassword, gridBagConstraints);

        tfNewProxyPassword.setText("null");
        tfNewProxyPassword.setToolTipText(bundle.getString("LauncherAdvOptsDialog.tfNewProxyPassword.toolTipText")); // NOI18N
        tfNewProxyPassword.setEnabled(false);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 7;
        gridBagConstraints.gridwidth = 4;
        gridBagConstraints.gridheight = 2;
        gridBagConstraints.ipadx = 156;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(6, 10, 19, 18);
        pnlProxy.add(tfNewProxyPassword, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 9;
        gridBagConstraints.gridy = 4;
        gridBagConstraints.gridwidth = 10;
        gridBagConstraints.ipadx = -42;
        gridBagConstraints.ipady = -30;
        gridBagConstraints.insets = new java.awt.Insets(11, 10, 0, 10);
        getContentPane().add(pnlProxy, gridBagConstraints);

        pnlButtons.setBackground(new java.awt.Color(255, 255, 255));
        pnlButtons.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                pnlButtonsMouseClicked(evt);
            }
        });
        pnlButtons.setLayout(new java.awt.GridBagLayout());

        btnCancel.setText(bundle.getString("LauncherAdvOptsDialog.btnCancel.text")); // NOI18N
        btnCancel.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnCancelActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.ipadx = 15;
        gridBagConstraints.ipady = 4;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(11, 18, 11, 10);
        pnlButtons.add(btnCancel, gridBagConstraints);

        btnSave.setText(bundle.getString("LauncherAdvOptsDialog.btnSave.text")); // NOI18N
        btnSave.setCursor(new java.awt.Cursor(java.awt.Cursor.DEFAULT_CURSOR));
        btnSave.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnSaveActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.ipadx = 23;
        gridBagConstraints.ipady = 4;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(11, 544, 11, 0);
        pnlButtons.add(btnSave, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 5;
        gridBagConstraints.gridwidth = 19;
        gridBagConstraints.ipadx = 72;
        gridBagConstraints.insets = new java.awt.Insets(18, 10, 11, 10);
        getContentPane().add(pnlButtons, gridBagConstraints);

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void btnSaveActionPerformed(java.awt.event.ActionEvent evt)//GEN-FIRST:event_btnSaveActionPerformed
    {//GEN-HEADEREND:event_btnSaveActionPerformed
        System.out.println("*** start btnSaveActionPerformed");
//        if (JOptionPane.showConfirmDialog(JOptionPane.getRootFrame(),
//                "Save current Studio launch options for future sessions?",
//                "Save Launch Options", JOptionPane.YES_NO_OPTION) == JOptionPane.YES_OPTION)
//        {
        
        console.prefs.putBoolean(MainConsole.OPTION_AUTO_LAUNCH, ckbAutoLaunch.isSelected());
        console.prefs.put(MainConsole.OPTION_STUDIO_BROWSER, tfBrowser.getText());
        console.prefs.putBoolean(MainConsole.OPTION_ENABLE_LIVELAYOUT, ckbLiveLayout.isSelected());
        console.prefs.putBoolean(MainConsole.OPTION_ENABLE_SUBPAGES, ckbSubPageDisplay.isSelected());
        console.prefs.putBoolean(MainConsole.OPTION_ENABLE_DEBUG, ckbStudioDebug.isSelected());
        
        console.prefs.putBoolean(MainConsole.OPTION_PROXY_ENABLED, ckbProxyEnabled.isSelected());
        console.prefs.put(MainConsole.OPTION_PROXY_SERVER, tfNewProxyServer.getText());
        console.prefs.put(MainConsole.OPTION_PROXY_PORT, tfNewProxyPort.getText());
        console.prefs.put(MainConsole.OPTION_PROXY_USERNAME, tfNewProxyUsername.getText());
        console.prefs.putByteArray(MainConsole.OPTION_PROXY_PASSWORD, new String(tfNewProxyPassword.getPassword()).getBytes());

        try
        {
            int newPort = Integer.parseInt(tfNewServerPort.getText());
            if (newPort != console.tomcatConfig.getServicePort())
            {
                console.tomcatConfig.setServicePort(newPort);
            }

            newPort = Integer.parseInt(tfNewShutdownPort.getText());
            if (newPort != console.tomcatConfig.getShutdownPort())
            {
                console.tomcatConfig.setShutdownPort(newPort);
            }

/* 
            newPort = Integer.parseInt(tfNewProxyPort.getText());
            if (newPort != console.tomcatConfig.getProxyPort())
            {
                console.tomcatConfig.setProxyPort(newPort);
            }

            byte[] newPwd = new String(tfNewProxyPassword.getPassword()).getBytes();
            if (newPort != console.tomcatConfig.getProxyPassword())
            {
                console.tomcatConfig.setProxyPassword(newPwd);
            }
*/
            Main.setDefaultTomcatConfiguration(console.tomcatConfig);
        }
        catch (IOException e)
        {
            e.printStackTrace();
            JOptionPane.showConfirmDialog(JOptionPane.getRootFrame(),
                "Error storing server configuration information:\n"
                + e.getMessage(), "Save Preferences",
                JOptionPane.OK_OPTION,
                JOptionPane.ERROR_MESSAGE);
        }
        catch (URISyntaxException e)
        {
            e.printStackTrace();
        }

        initOptions();
        System.out.println("    about to dispose of advanced dialog");
        dispose();
        System.out.println("--- end btnSaveActionPerformed");
//        }
}//GEN-LAST:event_btnSaveActionPerformed

    private void btnResetActionPerformed(java.awt.event.ActionEvent evt)//GEN-FIRST:event_btnResetActionPerformed
    {//GEN-HEADEREND:event_btnResetActionPerformed
        console.prefs.putBoolean(MainConsole.OPTION_AUTO_LAUNCH, Boolean.parseBoolean(
            console.optionsSave.get(MainConsole.OPTION_AUTO_LAUNCH)));

        console.prefs.put(MainConsole.OPTION_STUDIO_BROWSER,
            console.optionsSave.get(MainConsole.OPTION_STUDIO_BROWSER));

        console.prefs.putBoolean(MainConsole.OPTION_ENABLE_DEBUG, Boolean.parseBoolean(
            console.optionsSave.get(MainConsole.OPTION_ENABLE_DEBUG)));

        console.prefs.putBoolean(MainConsole.OPTION_ENABLE_LIVELAYOUT,
            Boolean.parseBoolean(console.optionsSave.get(MainConsole.OPTION_ENABLE_LIVELAYOUT)));

        console.prefs.putBoolean(MainConsole.OPTION_ENABLE_SUBPAGES,
            Boolean.parseBoolean(console.optionsSave.get(MainConsole.OPTION_ENABLE_SUBPAGES)));

        console.tomcatConfig.setServicePort(Integer.parseInt(
            console.optionsSave.get(MainConsole.OPTION_SERVER_PORT)));

        console.tomcatConfig.setShutdownPort(Integer.parseInt(
            console.optionsSave.get(MainConsole.OPTION_SHUTDOWN_PORT)));

        console.prefs.putBoolean(MainConsole.OPTION_PROXY_ENABLED, Boolean.parseBoolean(
            console.optionsSave.get(MainConsole.OPTION_PROXY_ENABLED)));

        console.prefs.put(MainConsole.OPTION_PROXY_SERVER,
            console.optionsSave.get(MainConsole.OPTION_PROXY_SERVER));

        console.prefs.put(MainConsole.OPTION_PROXY_PORT,
            console.optionsSave.get(MainConsole.OPTION_PROXY_PORT));

        console.prefs.put(MainConsole.OPTION_PROXY_USERNAME,
            console.optionsSave.get(MainConsole.OPTION_PROXY_USERNAME));

        console.prefs.put(MainConsole.OPTION_PROXY_PASSWORD,
            console.optionsSave.get(MainConsole.OPTION_PROXY_PASSWORD));

        initOptions();
}//GEN-LAST:event_btnResetActionPerformed

    private void tfNewServerPortFocusLost(java.awt.event.FocusEvent evt)//GEN-FIRST:event_tfNewServerPortFocusLost
    {//GEN-HEADEREND:event_tfNewServerPortFocusLost
        try
        {
            int newPort = Integer.parseInt(tfNewServerPort.getText());
        }
        catch (NumberFormatException e)
        {
            tfNewServerPort.setText(Integer.toString(console.tomcatConfig.getServicePort()));
        }
}//GEN-LAST:event_tfNewServerPortFocusLost

    private void tfNewShutdownPortFocusLost(java.awt.event.FocusEvent evt)//GEN-FIRST:event_tfNewShutdownPortFocusLost
    {//GEN-HEADEREND:event_tfNewShutdownPortFocusLost
        try
        {
            int newPort = Integer.parseInt(tfNewShutdownPort.getText());
        }
        catch (NumberFormatException e)
        {
            tfNewShutdownPort.setText(Integer.toString(console.tomcatConfig.getShutdownPort()));
        }
}//GEN-LAST:event_tfNewShutdownPortFocusLost

    private void btnFileChooserActionPerformed(java.awt.event.ActionEvent evt)//GEN-FIRST:event_btnFileChooserActionPerformed
    {//GEN-HEADEREND:event_btnFileChooserActionPerformed
        final JFileChooser chooser = new JFileChooser();
        if (folder != null)
        {
            chooser.setCurrentDirectory(new File(folder));
        }

        if (chooser.showOpenDialog(getParent()) == JFileChooser.APPROVE_OPTION)
        {
            tfBrowser.setText(chooser.getSelectedFile().getAbsolutePath());
            folder = chooser.getCurrentDirectory().getAbsolutePath();
        }
    }//GEN-LAST:event_btnFileChooserActionPerformed

    private void btnCancelActionPerformed(java.awt.event.ActionEvent evt)//GEN-FIRST:event_btnCancelActionPerformed
    {//GEN-HEADEREND:event_btnCancelActionPerformed
        dispose();
    }//GEN-LAST:event_btnCancelActionPerformed

    private void btnDefBrowserActionPerformed(java.awt.event.ActionEvent evt)//GEN-FIRST:event_btnDefBrowserActionPerformed
    {//GEN-HEADEREND:event_btnDefBrowserActionPerformed
        tfBrowser.setText(MainConsole.VAL_SYS_DEF_BROWSER);
    }//GEN-LAST:event_btnDefBrowserActionPerformed

    private void pnlButtonsMouseClicked(java.awt.event.MouseEvent evt)//GEN-FIRST:event_pnlButtonsMouseClicked
    {//GEN-HEADEREND:event_pnlButtonsMouseClicked
        if (evt.isControlDown()) btnReset.doClick();
    }//GEN-LAST:event_pnlButtonsMouseClicked

    private void tfNewProxyServerFocusLost(java.awt.event.FocusEvent evt) {//GEN-FIRST:event_tfNewProxyServerFocusLost
        // TODO add your handling code here:
    }//GEN-LAST:event_tfNewProxyServerFocusLost

    private void tfNewProxyServerActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_tfNewProxyServerActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_tfNewProxyServerActionPerformed

    private void tfNewProxyPortFocusLost(java.awt.event.FocusEvent evt) {//GEN-FIRST:event_tfNewProxyPortFocusLost
        // TODO add your handling code here:
    }//GEN-LAST:event_tfNewProxyPortFocusLost

    private void tfNewProxyUsernameFocusLost(java.awt.event.FocusEvent evt) {//GEN-FIRST:event_tfNewProxyUsernameFocusLost
        // TODO add your handling code here:
    }//GEN-LAST:event_tfNewProxyUsernameFocusLost

    private void ckbProxyEnabledActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_ckbProxyEnabledActionPerformed
        configureProxyFields(ckbProxyEnabled.isSelected());
        
    }//GEN-LAST:event_ckbProxyEnabledActionPerformed

    private void configureProxyFields(boolean enabled)
    {
        tfNewProxyServer.setEnabled(enabled);
        tfNewProxyPort.setEnabled(enabled);
        tfNewProxyUsername.setEnabled(enabled);
        tfNewProxyPassword.setEnabled(enabled);
    }
    /**
     * @param args the command line arguments
     */
    public static void main(String args[])
    {
        java.awt.EventQueue.invokeLater(new Runnable()
        {
            public void run()
            {
                LauncherAdvOptsDialog dialog = new LauncherAdvOptsDialog(new javax.swing.JFrame(), true);
                dialog.addWindowListener(new java.awt.event.WindowAdapter()
                {
                    @Override
                    public void windowClosing(java.awt.event.WindowEvent e)
                    {
                        System.exit(0);
                    }
                });
                dialog.setVisible(true);
            }
        });
    }
    
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btnCancel;
    private javax.swing.JButton btnDefBrowser;
    private javax.swing.JButton btnFileChooser;
    private javax.swing.JButton btnReset;
    private javax.swing.JButton btnSave;
    private javax.swing.JCheckBox ckbAutoLaunch;
    private javax.swing.JCheckBox ckbLiveLayout;
    private javax.swing.JCheckBox ckbProxyEnabled;
    private javax.swing.JCheckBox ckbStudioDebug;
    private javax.swing.JCheckBox ckbSubPageDisplay;
    private javax.swing.JLabel lblBrowser;
    private javax.swing.JLabel lblNewProxyPassword;
    private javax.swing.JLabel lblNewProxyPort;
    private javax.swing.JLabel lblNewProxyServer;
    private javax.swing.JLabel lblNewProxyUsername;
    private javax.swing.JLabel lblNewServerPort;
    private javax.swing.JLabel lblNewShutdownPort;
    private javax.swing.JPanel pnlButtons;
    private javax.swing.JPanel pnlCheckboxes;
    private javax.swing.JPanel pnlPorts;
    private javax.swing.JPanel pnlProxy;
    private javax.swing.JTextField tfBrowser;
    private javax.swing.JPasswordField tfNewProxyPassword;
    private javax.swing.JTextField tfNewProxyPort;
    private javax.swing.JTextField tfNewProxyServer;
    private javax.swing.JTextField tfNewProxyUsername;
    private javax.swing.JTextField tfNewServerPort;
    private javax.swing.JTextField tfNewShutdownPort;
    // End of variables declaration//GEN-END:variables

}

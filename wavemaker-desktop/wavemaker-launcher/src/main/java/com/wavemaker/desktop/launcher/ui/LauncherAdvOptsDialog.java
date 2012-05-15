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

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ResourceBundle;

import javax.swing.JFileChooser;
import javax.swing.JOptionPane;

import com.wavemaker.desktop.launcher.Main;

/**
 * 
 * @author cconover
 */
public class LauncherAdvOptsDialog extends javax.swing.JDialog {

    private static final ResourceBundle bundle = ResourceBundle.getBundle("com/wavemaker/desktop/launcher/ui/Bundle");

    private final MainConsole console;

    private String folder = null;

    /** Creates new form LauncherAdvOptsDialog */
    public LauncherAdvOptsDialog(java.awt.Frame parent, boolean modal) {
        super(parent, modal);
        this.console = (MainConsole) parent;
        initComponents();
        initOptions();
    }

    private void initOptions() {
        this.ckbAutoLaunch.setSelected(this.console.prefs.getBoolean(MainConsole.OPTION_AUTO_LAUNCH, false));
        this.tfBrowser.setText(this.console.prefs.get(MainConsole.OPTION_STUDIO_BROWSER, MainConsole.VAL_SYS_DEF_BROWSER));
        this.ckbStudioDebug.setSelected(this.console.prefs.getBoolean(MainConsole.OPTION_ENABLE_DEBUG, false));
        this.ckbLiveLayout.setSelected(this.console.prefs.getBoolean(MainConsole.OPTION_ENABLE_LIVELAYOUT, true));
        this.ckbSubPageDisplay.setSelected(this.console.prefs.getBoolean(MainConsole.OPTION_ENABLE_SUBPAGES, true));
        this.tfNewServerPort.setText(String.valueOf(this.console.tomcatConfig.getServicePort()));
        this.tfNewShutdownPort.setText(String.valueOf(this.console.tomcatConfig.getShutdownPort()));

        this.ckbProxyEnabled.setSelected(this.console.prefs.getBoolean(MainConsole.OPTION_PROXY_ENABLED, false));
        this.tfNewProxyServer.setText(this.console.prefs.get(MainConsole.OPTION_PROXY_SERVER, null));
        this.tfNewProxyPort.setText(this.console.prefs.get(MainConsole.OPTION_PROXY_PORT, null));
        this.tfNewProxyUsername.setText(this.console.prefs.get(MainConsole.OPTION_PROXY_USERNAME, null));

        // String pwd = console.prefs.get(MainConsole.OPTION_PROXY_PASSWORD, null);
        // if (pwd != null)
        // {
        // tfNewProxyPassword.setText("********");
        // }

        this.console.optionsSave.put(MainConsole.OPTION_AUTO_LAUNCH,
            String.valueOf(this.console.prefs.getBoolean(MainConsole.OPTION_AUTO_LAUNCH, true)));

        this.console.optionsSave.put(MainConsole.OPTION_STUDIO_BROWSER,
            String.valueOf(this.console.prefs.get(MainConsole.OPTION_STUDIO_BROWSER, MainConsole.VAL_SYS_DEF_BROWSER)));

        this.console.optionsSave.put(MainConsole.OPTION_ENABLE_DEBUG,
            String.valueOf(this.console.prefs.getBoolean(MainConsole.OPTION_ENABLE_DEBUG, false)));

        this.console.optionsSave.put(MainConsole.OPTION_ENABLE_LIVELAYOUT,
            String.valueOf(this.console.prefs.getBoolean(MainConsole.OPTION_ENABLE_LIVELAYOUT, true)));

        this.console.optionsSave.put(MainConsole.OPTION_ENABLE_SUBPAGES,
            String.valueOf(this.console.prefs.getBoolean(MainConsole.OPTION_ENABLE_SUBPAGES, true)));

        this.console.optionsSave.put(MainConsole.OPTION_SERVER_PORT, String.valueOf(this.console.tomcatConfig.getServicePort()));

        this.console.optionsSave.put(MainConsole.OPTION_SHUTDOWN_PORT, String.valueOf(this.console.tomcatConfig.getShutdownPort()));

        this.console.optionsSave.put(MainConsole.OPTION_PROXY_ENABLED,
            String.valueOf(this.console.prefs.getBoolean(MainConsole.OPTION_PROXY_ENABLED, true)));

        this.console.optionsSave.put(MainConsole.OPTION_PROXY_SERVER, String.valueOf(this.console.prefs.get(MainConsole.OPTION_PROXY_SERVER, "")));

        this.console.optionsSave.put(MainConsole.OPTION_PROXY_PORT, String.valueOf(this.console.prefs.get(MainConsole.OPTION_PROXY_PORT, "")));

        this.console.optionsSave.put(MainConsole.OPTION_PROXY_USERNAME, String.valueOf(this.console.prefs.get(MainConsole.OPTION_PROXY_USERNAME, "")));

        this.console.optionsSave.put(MainConsole.OPTION_PROXY_PASSWORD, String.valueOf(this.console.prefs.get(MainConsole.OPTION_PROXY_PASSWORD, "")));

        configureProxyFields(this.ckbProxyEnabled.isSelected());
    }

    /**
     * This method is called from within the constructor to initialize the form. WARNING: Do NOT modify this code. The
     * content of this method is always regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {
        java.awt.GridBagConstraints gridBagConstraints;

        this.btnReset = new javax.swing.JButton();
        this.ckbAutoLaunch = new javax.swing.JCheckBox();
        this.lblBrowser = new javax.swing.JLabel();
        this.tfBrowser = new javax.swing.JTextField();
        this.btnFileChooser = new javax.swing.JButton();
        this.btnDefBrowser = new javax.swing.JButton();
        this.pnlCheckboxes = new javax.swing.JPanel();
        this.ckbLiveLayout = new javax.swing.JCheckBox();
        this.ckbSubPageDisplay = new javax.swing.JCheckBox();
        this.ckbStudioDebug = new javax.swing.JCheckBox();
        this.pnlPorts = new javax.swing.JPanel();
        this.lblNewServerPort = new javax.swing.JLabel();
        this.tfNewServerPort = new javax.swing.JTextField();
        this.lblNewShutdownPort = new javax.swing.JLabel();
        this.tfNewShutdownPort = new javax.swing.JTextField();
        this.pnlProxy = new javax.swing.JPanel();
        this.ckbProxyEnabled = new javax.swing.JCheckBox();
        this.lblNewProxyServer = new javax.swing.JLabel();
        this.tfNewProxyServer = new javax.swing.JTextField();
        this.lblNewProxyPort = new javax.swing.JLabel();
        this.tfNewProxyPort = new javax.swing.JTextField();
        this.lblNewProxyUsername = new javax.swing.JLabel();
        this.tfNewProxyUsername = new javax.swing.JTextField();
        this.lblNewProxyPassword = new javax.swing.JLabel();
        this.tfNewProxyPassword = new javax.swing.JPasswordField();
        this.pnlButtons = new javax.swing.JPanel();
        this.btnCancel = new javax.swing.JButton();
        this.btnSave = new javax.swing.JButton();

        java.util.ResourceBundle bundle = java.util.ResourceBundle.getBundle("com/wavemaker/desktop/launcher/ui/Bundle"); // NOI18N
        this.btnReset.setText(bundle.getString("LauncherAdvOptsDialog.btnReset.text")); // NOI18N
        this.btnReset.addActionListener(new java.awt.event.ActionListener() {

            @Override
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnResetActionPerformed(evt);
            }
        });

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);
        setTitle(bundle.getString("LauncherAdvOptsDialog.title")); // NOI18N
        setAlwaysOnTop(true);
        setName("LaunchAdvOptsDlg"); // NOI18N
        getContentPane().setLayout(new java.awt.GridBagLayout());

        this.ckbAutoLaunch.setBackground(new java.awt.Color(255, 255, 255));
        this.ckbAutoLaunch.setSelected(true);
        this.ckbAutoLaunch.setText(bundle.getString("LauncherAdvOptsDialog.ckbAutoLaunch.text")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.gridwidth = 2;
        gridBagConstraints.ipadx = 23;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(7, 10, 0, 0);
        getContentPane().add(this.ckbAutoLaunch, gridBagConstraints);

        this.lblBrowser.setLabelFor(this.tfBrowser);
        this.lblBrowser.setText(bundle.getString("LauncherAdvOptsDialog.lblBrowser.text")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.ipadx = 32;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(5, 10, 0, 0);
        getContentPane().add(this.lblBrowser, gridBagConstraints);

        this.tfBrowser.setEditable(false);
        this.tfBrowser.setText(bundle.getString("SYSTEM_DEFAULT_BROWSER")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.gridwidth = 9;
        gridBagConstraints.gridheight = 2;
        gridBagConstraints.ipadx = 650;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 4, 0, 0);
        getContentPane().add(this.tfBrowser, gridBagConstraints);

        this.btnFileChooser.setIcon(new javax.swing.ImageIcon(getClass().getResource("/com/wavemaker/desktop/launcher/ui/folder.png"))); // NOI18N
        this.btnFileChooser.setText(bundle.getString("LauncherAdvOptsDialog.btnFileChooser.text")); // NOI18N
        this.btnFileChooser.addActionListener(new java.awt.event.ActionListener() {

            @Override
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
        getContentPane().add(this.btnFileChooser, gridBagConstraints);

        this.btnDefBrowser.setText(bundle.getString("LauncherAdvOptsDialog.btnDefBrowser.text")); // NOI18N
        this.btnDefBrowser.addActionListener(new java.awt.event.ActionListener() {

            @Override
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
        getContentPane().add(this.btnDefBrowser, gridBagConstraints);

        this.pnlCheckboxes.setBackground(new java.awt.Color(255, 255, 255));
        this.pnlCheckboxes.setBorder(javax.swing.BorderFactory.createTitledBorder(bundle.getString("LauncherAdvOptsDialog.pnlCheckboxes.border.title"))); // NOI18N
        this.pnlCheckboxes.setLayout(new java.awt.GridBagLayout());

        this.ckbLiveLayout.setBackground(new java.awt.Color(255, 255, 255));
        this.ckbLiveLayout.setSelected(true);
        this.ckbLiveLayout.setText(bundle.getString("LauncherAdvOptsDialog.ckbLiveLayout.text")); // NOI18N
        this.ckbLiveLayout.setToolTipText(bundle.getString("LauncherAdvOptsDialog.ckbLiveLayout.toolTipText")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.ipadx = 62;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(29, 14, 0, 14);
        this.pnlCheckboxes.add(this.ckbLiveLayout, gridBagConstraints);

        this.ckbSubPageDisplay.setBackground(new java.awt.Color(255, 255, 255));
        this.ckbSubPageDisplay.setSelected(true);
        this.ckbSubPageDisplay.setText(bundle.getString("LauncherAdvOptsDialog.ckbSubPageDisplay.text")); // NOI18N
        this.ckbSubPageDisplay.setToolTipText(bundle.getString("LauncherAdvOptsDialog.ckbSubPageDisplay.toolTipText")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.ipadx = 12;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(3, 14, 0, 14);
        this.pnlCheckboxes.add(this.ckbSubPageDisplay, gridBagConstraints);

        this.ckbStudioDebug.setBackground(new java.awt.Color(255, 255, 255));
        this.ckbStudioDebug.setText(bundle.getString("LauncherAdvOptsDialog.ckbStudioDebug.text")); // NOI18N
        this.ckbStudioDebug.setToolTipText(bundle.getString("LauncherAdvOptsDialog.ckbStudioDebug.toolTipText")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.ipadx = 86;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(3, 14, 63, 14);
        this.pnlCheckboxes.add(this.ckbStudioDebug, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 4;
        gridBagConstraints.gridwidth = 3;
        gridBagConstraints.ipady = -30;
        gridBagConstraints.insets = new java.awt.Insets(11, 10, 0, 0);
        getContentPane().add(this.pnlCheckboxes, gridBagConstraints);

        this.pnlPorts.setBackground(new java.awt.Color(255, 255, 255));
        this.pnlPorts.setBorder(javax.swing.BorderFactory.createTitledBorder(bundle.getString("LauncherAdvOptsDialog.pnlPorts.border.title"))); // NOI18N
        this.pnlPorts.setLayout(new java.awt.GridBagLayout());

        this.lblNewServerPort.setLabelFor(this.tfNewServerPort);
        this.lblNewServerPort.setText(bundle.getString("LauncherAdvOptsDialog.lblNewServerPort.text")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.ipadx = 39;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(31, 18, 0, 0);
        this.pnlPorts.add(this.lblNewServerPort, gridBagConstraints);

        this.tfNewServerPort.setText("8194");
        this.tfNewServerPort.setToolTipText(bundle.getString("LauncherAdvOptsDialog.tfNewServerPort.toolTipText")); // NOI18N
        this.tfNewServerPort.addFocusListener(new java.awt.event.FocusAdapter() {

            @Override
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
        this.pnlPorts.add(this.tfNewServerPort, gridBagConstraints);

        this.lblNewShutdownPort.setLabelFor(this.tfNewShutdownPort);
        this.lblNewShutdownPort.setText(bundle.getString("LauncherAdvOptsDialog.lblNewShutdownPort.text")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.ipadx = 20;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(9, 18, 0, 0);
        this.pnlPorts.add(this.lblNewShutdownPort, gridBagConstraints);

        this.tfNewShutdownPort.setText("8119");
        this.tfNewShutdownPort.setToolTipText(bundle.getString("LauncherAdvOptsDialog.tfNewShutdownPort.toolTipText")); // NOI18N
        this.tfNewShutdownPort.addFocusListener(new java.awt.event.FocusAdapter() {

            @Override
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
        this.pnlPorts.add(this.tfNewShutdownPort, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 4;
        gridBagConstraints.gridy = 4;
        gridBagConstraints.gridwidth = 5;
        gridBagConstraints.ipadx = 24;
        gridBagConstraints.ipady = -30;
        gridBagConstraints.insets = new java.awt.Insets(11, 10, 0, 0);
        getContentPane().add(this.pnlPorts, gridBagConstraints);

        this.pnlProxy.setBackground(new java.awt.Color(255, 255, 255));
        this.pnlProxy.setBorder(javax.swing.BorderFactory.createTitledBorder(bundle.getString("LauncherAdvOptsDialog.pnlProxy.border.title"))); // NOI18N
        this.pnlProxy.setLayout(new java.awt.GridBagLayout());

        this.ckbProxyEnabled.setBackground(new java.awt.Color(255, 255, 255));
        this.ckbProxyEnabled.setText(bundle.getString("LauncherAdvOptsDialog.ckbProxyEnabled.text")); // NOI18N
        this.ckbProxyEnabled.setToolTipText(bundle.getString("LauncherAdvOptsDialog.ckbProxyEnabled.toolTipText")); // NOI18N
        this.ckbProxyEnabled.addActionListener(new java.awt.event.ActionListener() {

            @Override
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
        this.pnlProxy.add(this.ckbProxyEnabled, gridBagConstraints);

        this.lblNewProxyServer.setLabelFor(this.tfNewProxyServer);
        this.lblNewProxyServer.setText(bundle.getString("LauncherAdvOptsDialog.lblNewProxyServer.text")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.ipadx = 10;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(8, 18, 0, 0);
        this.pnlProxy.add(this.lblNewProxyServer, gridBagConstraints);

        this.tfNewProxyServer.setText("null");
        this.tfNewProxyServer.setToolTipText(bundle.getString("LauncherAdvOptsDialog.tfNewProxyServer.toolTipText")); // NOI18N
        this.tfNewProxyServer.setEnabled(false);
        this.tfNewProxyServer.addActionListener(new java.awt.event.ActionListener() {

            @Override
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                tfNewProxyServerActionPerformed(evt);
            }
        });
        this.tfNewProxyServer.addFocusListener(new java.awt.event.FocusAdapter() {

            @Override
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
        this.pnlProxy.add(this.tfNewProxyServer, gridBagConstraints);

        this.lblNewProxyPort.setLabelFor(this.tfNewProxyPort);
        this.lblNewProxyPort.setText(bundle.getString("LauncherAdvOptsDialog.lblNewProxyPort.text")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 3;
        gridBagConstraints.ipadx = 19;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(9, 18, 0, 0);
        this.pnlProxy.add(this.lblNewProxyPort, gridBagConstraints);

        this.tfNewProxyPort.setText("null");
        this.tfNewProxyPort.setToolTipText(bundle.getString("LauncherAdvOptsDialog.tfNewProxyPort.toolTipText")); // NOI18N
        this.tfNewProxyPort.setEnabled(false);
        this.tfNewProxyPort.addFocusListener(new java.awt.event.FocusAdapter() {

            @Override
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
        this.pnlProxy.add(this.tfNewProxyPort, gridBagConstraints);
        this.tfNewProxyPort.getAccessibleContext().setAccessibleDescription(
            bundle.getString("LauncherAdvOptsDialog.tfNewProxyPort.AccessibleContext.accessibleDescription")); // NOI18N

        this.lblNewProxyUsername.setLabelFor(this.tfNewProxyPort);
        this.lblNewProxyUsername.setText(bundle.getString("LauncherAdvOptsDialog.lblNewProxyUsername.text")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 5;
        gridBagConstraints.ipadx = 25;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(9, 18, 0, 0);
        this.pnlProxy.add(this.lblNewProxyUsername, gridBagConstraints);

        this.tfNewProxyUsername.setText("null");
        this.tfNewProxyUsername.setToolTipText(bundle.getString("LauncherAdvOptsDialog.tfNewProxyUsername.toolTipText")); // NOI18N
        this.tfNewProxyUsername.setEnabled(false);
        this.tfNewProxyUsername.addFocusListener(new java.awt.event.FocusAdapter() {

            @Override
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
        this.pnlProxy.add(this.tfNewProxyUsername, gridBagConstraints);

        this.lblNewProxyPassword.setLabelFor(this.tfNewProxyPort);
        this.lblNewProxyPassword.setText(bundle.getString("LauncherAdvOptsDialog.lblNewProxyPassword.text")); // NOI18N
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 7;
        gridBagConstraints.ipadx = 27;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(9, 18, 0, 0);
        this.pnlProxy.add(this.lblNewProxyPassword, gridBagConstraints);

        this.tfNewProxyPassword.setText("null");
        this.tfNewProxyPassword.setToolTipText(bundle.getString("LauncherAdvOptsDialog.tfNewProxyPassword.toolTipText")); // NOI18N
        this.tfNewProxyPassword.setEnabled(false);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 7;
        gridBagConstraints.gridwidth = 4;
        gridBagConstraints.gridheight = 2;
        gridBagConstraints.ipadx = 156;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(6, 10, 19, 18);
        this.pnlProxy.add(this.tfNewProxyPassword, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 9;
        gridBagConstraints.gridy = 4;
        gridBagConstraints.gridwidth = 10;
        gridBagConstraints.ipadx = -42;
        gridBagConstraints.ipady = -30;
        gridBagConstraints.insets = new java.awt.Insets(11, 10, 0, 10);
        getContentPane().add(this.pnlProxy, gridBagConstraints);

        this.pnlButtons.setBackground(new java.awt.Color(255, 255, 255));
        this.pnlButtons.addMouseListener(new java.awt.event.MouseAdapter() {

            @Override
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                pnlButtonsMouseClicked(evt);
            }
        });
        this.pnlButtons.setLayout(new java.awt.GridBagLayout());

        this.btnCancel.setText(bundle.getString("LauncherAdvOptsDialog.btnCancel.text")); // NOI18N
        this.btnCancel.addActionListener(new java.awt.event.ActionListener() {

            @Override
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
        this.pnlButtons.add(this.btnCancel, gridBagConstraints);

        this.btnSave.setText(bundle.getString("LauncherAdvOptsDialog.btnSave.text")); // NOI18N
        this.btnSave.setCursor(new java.awt.Cursor(java.awt.Cursor.DEFAULT_CURSOR));
        this.btnSave.addActionListener(new java.awt.event.ActionListener() {

            @Override
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
        this.pnlButtons.add(this.btnSave, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 5;
        gridBagConstraints.gridwidth = 19;
        gridBagConstraints.ipadx = 72;
        gridBagConstraints.insets = new java.awt.Insets(18, 10, 11, 10);
        getContentPane().add(this.pnlButtons, gridBagConstraints);

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void btnSaveActionPerformed(java.awt.event.ActionEvent evt)// GEN-FIRST:event_btnSaveActionPerformed
    {// GEN-HEADEREND:event_btnSaveActionPerformed
        System.out.println("*** start btnSaveActionPerformed");
        // if (JOptionPane.showConfirmDialog(JOptionPane.getRootFrame(),
        // "Save current Studio launch options for future sessions?",
        // "Save Launch Options", JOptionPane.YES_NO_OPTION) == JOptionPane.YES_OPTION)
        // {

        this.console.prefs.putBoolean(MainConsole.OPTION_AUTO_LAUNCH, this.ckbAutoLaunch.isSelected());
        this.console.prefs.put(MainConsole.OPTION_STUDIO_BROWSER, this.tfBrowser.getText());
        this.console.prefs.putBoolean(MainConsole.OPTION_ENABLE_LIVELAYOUT, this.ckbLiveLayout.isSelected());
        this.console.prefs.putBoolean(MainConsole.OPTION_ENABLE_SUBPAGES, this.ckbSubPageDisplay.isSelected());
        this.console.prefs.putBoolean(MainConsole.OPTION_ENABLE_DEBUG, this.ckbStudioDebug.isSelected());

        this.console.prefs.putBoolean(MainConsole.OPTION_PROXY_ENABLED, this.ckbProxyEnabled.isSelected());
        this.console.prefs.put(MainConsole.OPTION_PROXY_SERVER, this.tfNewProxyServer.getText());
        this.console.prefs.put(MainConsole.OPTION_PROXY_PORT, this.tfNewProxyPort.getText());
        this.console.prefs.put(MainConsole.OPTION_PROXY_USERNAME, this.tfNewProxyUsername.getText());
        this.console.prefs.putByteArray(MainConsole.OPTION_PROXY_PASSWORD, new String(this.tfNewProxyPassword.getPassword()).getBytes());

        try {
            int newPort = Integer.parseInt(this.tfNewServerPort.getText());
            if (newPort != this.console.tomcatConfig.getServicePort()) {
                this.console.tomcatConfig.setServicePort(newPort);
            }

            newPort = Integer.parseInt(this.tfNewShutdownPort.getText());
            if (newPort != this.console.tomcatConfig.getShutdownPort()) {
                this.console.tomcatConfig.setShutdownPort(newPort);
            }

            /*
             * newPort = Integer.parseInt(tfNewProxyPort.getText()); if (newPort != console.tomcatConfig.getProxyPort())
             * { console.tomcatConfig.setProxyPort(newPort); }
             * 
             * byte[] newPwd = new String(tfNewProxyPassword.getPassword()).getBytes(); if (newPort !=
             * console.tomcatConfig.getProxyPassword()) { console.tomcatConfig.setProxyPassword(newPwd); }
             */
            Main.setDefaultTomcatConfiguration(this.console.tomcatConfig);
        } catch (IOException e) {
            e.printStackTrace();
            JOptionPane.showConfirmDialog(JOptionPane.getRootFrame(), "Error storing server configuration information:\n" + e.getMessage(),
                "Save Preferences", JOptionPane.OK_OPTION, JOptionPane.ERROR_MESSAGE);
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }

        initOptions();
        System.out.println("    about to dispose of advanced dialog");
        dispose();
        System.out.println("--- end btnSaveActionPerformed");
        // }
    }// GEN-LAST:event_btnSaveActionPerformed

    private void btnResetActionPerformed(java.awt.event.ActionEvent evt)// GEN-FIRST:event_btnResetActionPerformed
    {// GEN-HEADEREND:event_btnResetActionPerformed
        this.console.prefs.putBoolean(MainConsole.OPTION_AUTO_LAUNCH,
            Boolean.parseBoolean(this.console.optionsSave.get(MainConsole.OPTION_AUTO_LAUNCH)));

        this.console.prefs.put(MainConsole.OPTION_STUDIO_BROWSER, this.console.optionsSave.get(MainConsole.OPTION_STUDIO_BROWSER));

        this.console.prefs.putBoolean(MainConsole.OPTION_ENABLE_DEBUG,
            Boolean.parseBoolean(this.console.optionsSave.get(MainConsole.OPTION_ENABLE_DEBUG)));

        this.console.prefs.putBoolean(MainConsole.OPTION_ENABLE_LIVELAYOUT,
            Boolean.parseBoolean(this.console.optionsSave.get(MainConsole.OPTION_ENABLE_LIVELAYOUT)));

        this.console.prefs.putBoolean(MainConsole.OPTION_ENABLE_SUBPAGES,
            Boolean.parseBoolean(this.console.optionsSave.get(MainConsole.OPTION_ENABLE_SUBPAGES)));

        this.console.tomcatConfig.setServicePort(Integer.parseInt(this.console.optionsSave.get(MainConsole.OPTION_SERVER_PORT)));

        this.console.tomcatConfig.setShutdownPort(Integer.parseInt(this.console.optionsSave.get(MainConsole.OPTION_SHUTDOWN_PORT)));

        this.console.prefs.putBoolean(MainConsole.OPTION_PROXY_ENABLED,
            Boolean.parseBoolean(this.console.optionsSave.get(MainConsole.OPTION_PROXY_ENABLED)));

        this.console.prefs.put(MainConsole.OPTION_PROXY_SERVER, this.console.optionsSave.get(MainConsole.OPTION_PROXY_SERVER));

        this.console.prefs.put(MainConsole.OPTION_PROXY_PORT, this.console.optionsSave.get(MainConsole.OPTION_PROXY_PORT));

        this.console.prefs.put(MainConsole.OPTION_PROXY_USERNAME, this.console.optionsSave.get(MainConsole.OPTION_PROXY_USERNAME));

        this.console.prefs.put(MainConsole.OPTION_PROXY_PASSWORD, this.console.optionsSave.get(MainConsole.OPTION_PROXY_PASSWORD));

        initOptions();
    }// GEN-LAST:event_btnResetActionPerformed

    private void tfNewServerPortFocusLost(java.awt.event.FocusEvent evt)// GEN-FIRST:event_tfNewServerPortFocusLost
    {// GEN-HEADEREND:event_tfNewServerPortFocusLost
        try {
            Integer.parseInt(this.tfNewServerPort.getText());
        } catch (NumberFormatException e) {
            this.tfNewServerPort.setText(Integer.toString(this.console.tomcatConfig.getServicePort()));
        }
    }// GEN-LAST:event_tfNewServerPortFocusLost

    private void tfNewShutdownPortFocusLost(java.awt.event.FocusEvent evt)// GEN-FIRST:event_tfNewShutdownPortFocusLost
    {// GEN-HEADEREND:event_tfNewShutdownPortFocusLost
        try {
            Integer.parseInt(this.tfNewShutdownPort.getText());
        } catch (NumberFormatException e) {
            this.tfNewShutdownPort.setText(Integer.toString(this.console.tomcatConfig.getShutdownPort()));
        }
    }// GEN-LAST:event_tfNewShutdownPortFocusLost

    private void btnFileChooserActionPerformed(java.awt.event.ActionEvent evt)// GEN-FIRST:event_btnFileChooserActionPerformed
    {// GEN-HEADEREND:event_btnFileChooserActionPerformed
        final JFileChooser chooser = new JFileChooser();
        if (this.folder != null) {
            chooser.setCurrentDirectory(new File(this.folder));
        }

        if (chooser.showOpenDialog(getParent()) == JFileChooser.APPROVE_OPTION) {
            this.tfBrowser.setText(chooser.getSelectedFile().getAbsolutePath());
            this.folder = chooser.getCurrentDirectory().getAbsolutePath();
        }
    }// GEN-LAST:event_btnFileChooserActionPerformed

    private void btnCancelActionPerformed(java.awt.event.ActionEvent evt)// GEN-FIRST:event_btnCancelActionPerformed
    {// GEN-HEADEREND:event_btnCancelActionPerformed
        dispose();
    }// GEN-LAST:event_btnCancelActionPerformed

    private void btnDefBrowserActionPerformed(java.awt.event.ActionEvent evt)// GEN-FIRST:event_btnDefBrowserActionPerformed
    {// GEN-HEADEREND:event_btnDefBrowserActionPerformed
        this.tfBrowser.setText(MainConsole.VAL_SYS_DEF_BROWSER);
    }// GEN-LAST:event_btnDefBrowserActionPerformed

    private void pnlButtonsMouseClicked(java.awt.event.MouseEvent evt)// GEN-FIRST:event_pnlButtonsMouseClicked
    {// GEN-HEADEREND:event_pnlButtonsMouseClicked
        if (evt.isControlDown()) {
            this.btnReset.doClick();
        }
    }// GEN-LAST:event_pnlButtonsMouseClicked

    private void tfNewProxyServerFocusLost(java.awt.event.FocusEvent evt) {// GEN-FIRST:event_tfNewProxyServerFocusLost
        // TODO add your handling code here:
    }// GEN-LAST:event_tfNewProxyServerFocusLost

    private void tfNewProxyServerActionPerformed(java.awt.event.ActionEvent evt) {// GEN-FIRST:event_tfNewProxyServerActionPerformed
        // TODO add your handling code here:
    }// GEN-LAST:event_tfNewProxyServerActionPerformed

    private void tfNewProxyPortFocusLost(java.awt.event.FocusEvent evt) {// GEN-FIRST:event_tfNewProxyPortFocusLost
        // TODO add your handling code here:
    }// GEN-LAST:event_tfNewProxyPortFocusLost

    private void tfNewProxyUsernameFocusLost(java.awt.event.FocusEvent evt) {// GEN-FIRST:event_tfNewProxyUsernameFocusLost
        // TODO add your handling code here:
    }// GEN-LAST:event_tfNewProxyUsernameFocusLost

    private void ckbProxyEnabledActionPerformed(java.awt.event.ActionEvent evt) {// GEN-FIRST:event_ckbProxyEnabledActionPerformed
        configureProxyFields(this.ckbProxyEnabled.isSelected());

    }// GEN-LAST:event_ckbProxyEnabledActionPerformed

    private void configureProxyFields(boolean enabled) {
        this.tfNewProxyServer.setEnabled(enabled);
        this.tfNewProxyPort.setEnabled(enabled);
        this.tfNewProxyUsername.setEnabled(enabled);
        this.tfNewProxyPassword.setEnabled(enabled);
    }

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        java.awt.EventQueue.invokeLater(new Runnable() {

            @Override
            public void run() {
                LauncherAdvOptsDialog dialog = new LauncherAdvOptsDialog(new javax.swing.JFrame(), true);
                dialog.addWindowListener(new java.awt.event.WindowAdapter() {

                    @Override
                    public void windowClosing(java.awt.event.WindowEvent e) {
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

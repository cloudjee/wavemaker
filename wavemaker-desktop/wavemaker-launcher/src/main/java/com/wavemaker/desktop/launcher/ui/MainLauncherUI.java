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

/**
 * 
 */

package com.wavemaker.desktop.launcher.ui;

import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.image.BufferedImage;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.prefs.Preferences;

import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.SoftBevelBorder;
import javax.swing.border.TitledBorder;

import org.apache.catalina.Lifecycle;
import org.apache.catalina.LifecycleEvent;
import org.apache.catalina.LifecycleListener;

import com.wavemaker.desktop.launcher.AppServer;
import com.wavemaker.desktop.launcher.AppServer.SERVER_STATUS;
import com.wavemaker.desktop.launcher.InvalidServerConfigurationException;
import com.wavemaker.desktop.launcher.Main;
import com.wavemaker.desktop.launcher.TomcatConfig;

/**
 * @author rkirkland
 * 
 */
public class MainLauncherUI extends JFrame {

    private static final long serialVersionUID = 1L;

    /** Variables */
    // Constants
    public static String OPTION_ENABLE_DEBUG = "debug";

    public static String OPTION_ENABLE_LIVELAYOUT = "livelayout";

    // Members
    protected String version;

    protected TomcatConfig config;

    protected AppServer appServer;

    protected JButton startButton;

    protected JButton stopButton;

    protected JButton optionsButton;

    protected JPanel optionsPanel;

    protected JPanel statusBar;

    protected JCheckBox debugCheckbox;

    protected JCheckBox noLiveCheckbox;

    protected JTextField servicePortField;

    protected JTextField shutdownPortField;

    protected JLabel servicePortStatus;

    protected JLabel shutdownPortStatus;

    protected JLabel serverStatus;

    /** Construction\Destruction */
    public MainLauncherUI(String version, TomcatConfig config) {
        this.version = version;
        this.setTitle("WaveMaker Studio " + version + " ");
        try {
            BufferedImage source = javax.imageio.ImageIO.read(MainLauncherUI.class.getResourceAsStream("wavemaker_small.png"));
            if (source != null) {
                /*
                 * Color transparentColor = Color.WHITE; // Generate Image with Transparency BufferedImage icon = new
                 * BufferedImage(source.getWidth(), source.getHeight(), BufferedImage.TYPE_INT_ARGB); Graphics2D
                 * graphics = icon.createGraphics(); graphics.setComposite(AlphaComposite.Src);
                 * graphics.drawImage(source, null, 0, 0); graphics.dispose(); // Set Transparent Pixels for (int i = 0;
                 * i < icon.getHeight(); i++) { for (int j = 0; j < icon.getWidth(); j++) { if (icon.getRGB(j, i) ==
                 * transparentColor.getRGB()) { icon.setRGB(j, i, 0x8F1C1C); } } }
                 */
                BufferedImage icon = source;
                this.setIconImage(icon);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        this.config = config;
        this.init();
    }

    /** Instance Methods */
    private void initOptions() {
        this.optionsPanel = new JPanel();
        this.optionsPanel.setBorder(new TitledBorder("WaveMaker Options:"));
        this.optionsPanel.setLayout(new GridBagLayout());

        // Browser Options
        final Preferences prefs = Preferences.userNodeForPackage(MainLauncherUI.class);
        this.debugCheckbox = new JCheckBox("Enable Debug");
        this.debugCheckbox.setSelected(prefs.getBoolean(OPTION_ENABLE_DEBUG, false));
        this.optionsPanel.add(this.debugCheckbox, new GridBagConstraints(0, 0, 1, 1, 0.25, 0.0, GridBagConstraints.NORTHWEST,
            GridBagConstraints.HORIZONTAL, new Insets(2, 2, 2, 2), 0, 0));
        this.noLiveCheckbox = new JCheckBox("Enable LiveLayout");
        this.noLiveCheckbox.setSelected(prefs.getBoolean(OPTION_ENABLE_LIVELAYOUT, true));
        this.optionsPanel.add(this.noLiveCheckbox, new GridBagConstraints(0, 1, 1, 1, 0.25, 0.0, GridBagConstraints.NORTHWEST,
            GridBagConstraints.HORIZONTAL, new Insets(2, 2, 2, 2), 0, 0));

        // Server Ports
        this.servicePortField = new JTextField(Integer.toString(this.config.getServicePort()));
        this.servicePortField.addFocusListener(new FocusListener() {

            @Override
            public void focusGained(FocusEvent arg0) {
            }

            @Override
            public void focusLost(FocusEvent arg0) {
                try {
                    int newPort = Integer.parseInt(MainLauncherUI.this.servicePortField.getText());
                    if (newPort != MainLauncherUI.this.config.getServicePort()) {
                        MainLauncherUI.this.config.setServicePort(newPort);
                    }
                } catch (NumberFormatException e) {
                    MainLauncherUI.this.servicePortField.setText(Integer.toString(MainLauncherUI.this.config.getServicePort()));
                }
            }
        });
        this.optionsPanel.add(new JLabel("Server Port:"), new GridBagConstraints(0, 2, 1, 1, 0.0, 0.0, GridBagConstraints.NORTHWEST,
            GridBagConstraints.NONE, new Insets(2, 2, 2, 2), 0, 0));
        this.optionsPanel.add(this.servicePortField, new GridBagConstraints(1, 2, 1, 1, 0.75, 0.0, GridBagConstraints.NORTHWEST,
            GridBagConstraints.HORIZONTAL, new Insets(2, 2, 2, 2), 0, 0));

        this.shutdownPortField = new JTextField(Integer.toString(this.config.getShutdownPort()));
        this.shutdownPortField.addFocusListener(new FocusListener() {

            @Override
            public void focusGained(FocusEvent arg0) {
            }

            @Override
            public void focusLost(FocusEvent arg0) {
                try {
                    int newPort = Integer.parseInt(MainLauncherUI.this.shutdownPortField.getText());
                    if (newPort != MainLauncherUI.this.config.getShutdownPort()) {
                        MainLauncherUI.this.config.setShutdownPort(newPort);
                    }
                } catch (NumberFormatException e) {
                    MainLauncherUI.this.shutdownPortField.setText(Integer.toString(MainLauncherUI.this.config.getShutdownPort()));
                }
            }
        });
        this.optionsPanel.add(new JLabel("Shutdown Port:"), new GridBagConstraints(0, 3, 1, 1, 0.0, 0.0, GridBagConstraints.NORTHWEST,
            GridBagConstraints.NONE, new Insets(2, 2, 2, 2), 0, 0));
        this.optionsPanel.add(this.shutdownPortField, new GridBagConstraints(1, 3, 1, 1, 0.75, 0.0, GridBagConstraints.NORTHWEST,
            GridBagConstraints.HORIZONTAL, new Insets(2, 2, 2, 2), 0, 0));

        // Save Options
        JButton saveButton = new JButton("Save Preferences");
        saveButton.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent arg0) {
                if (JOptionPane.showConfirmDialog(JOptionPane.getRootFrame(), "Save current options for future sessions?", "Save Preferences",
                    JOptionPane.YES_NO_OPTION) == JOptionPane.YES_OPTION) {
                    prefs.putBoolean(OPTION_ENABLE_DEBUG, MainLauncherUI.this.debugCheckbox.isSelected());
                    prefs.putBoolean(OPTION_ENABLE_LIVELAYOUT, MainLauncherUI.this.noLiveCheckbox.isSelected());
                    try {
                        Main.setDefaultTomcatConfiguration(MainLauncherUI.this.config);
                    } catch (IOException e) {
                        e.printStackTrace();
                        JOptionPane.showConfirmDialog(JOptionPane.getRootFrame(),
                            "Error storing server configuration information:\n" + e.getMessage(), "Save Preferences", JOptionPane.OK_OPTION,
                            JOptionPane.ERROR_MESSAGE);
                    } catch (URISyntaxException e) {
                        e.printStackTrace();
                    }
                }
            }
        });
        this.optionsPanel.add(saveButton, new GridBagConstraints(1, 4, 1, 1, 0.0, 0.0, GridBagConstraints.SOUTHEAST, GridBagConstraints.NONE,
            new Insets(2, 2, 2, 2), 0, 0));
    }

    private void init() {
        this.setDefaultCloseOperation(EXIT_ON_CLOSE);
        this.setLayout(new GridBagLayout());
        this.startButton = new JButton("Start WaveMaker");
        this.add(this.startButton, new GridBagConstraints(0, 0, 1, 1, 0.0, 0.0, GridBagConstraints.NORTHWEST, GridBagConstraints.NONE, new Insets(2,
            2, 2, 2), 0, 0));

        this.stopButton = new JButton("Stop WaveMaker");
        this.stopButton.setEnabled(false);
        this.add(this.stopButton, new GridBagConstraints(2, 0, 1, 1, 0.0, 0.0, GridBagConstraints.NORTHWEST, GridBagConstraints.NONE, new Insets(2,
            2, 2, 2), 0, 0));

        this.initOptions();
        this.optionsPanel.setVisible(false);
        this.optionsButton = new JButton("Advanced >>");
        this.add(this.optionsButton, new GridBagConstraints(1, 1, 1, 1, 0.0, 0.0, GridBagConstraints.CENTER, GridBagConstraints.NONE, new Insets(2,
            2, 2, 2), 0, 0));
        this.add(this.optionsPanel, new GridBagConstraints(0, 2, 3, 1, 1.0, 1.0, GridBagConstraints.CENTER, GridBagConstraints.BOTH, new Insets(2, 2,
            2, 2), 0, 0));

        // Status Bar
        this.statusBar = new JPanel();
        this.statusBar.setLayout(new GridBagLayout());
        this.statusBar.setBorder(new SoftBevelBorder(1));
        // service port
        JLabel label = new JLabel("ServerPort:");
        // label.setBorder(new SoftBevelBorder(1));
        this.statusBar.add(label, new GridBagConstraints(0, 0, 1, 1, 0.0, 0.0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 0, 0,
            0), 0, 0));
        this.servicePortStatus = new JLabel(this.servicePortField.getText());
        // this.servicePortStatus.setBorder(new SoftBevelBorder(1));
        this.statusBar.add(this.servicePortStatus, new GridBagConstraints(1, 0, 1, 1, 0.2, 0.0, GridBagConstraints.WEST, GridBagConstraints.NONE,
            new Insets(0, 2, 0, 0), 0, 0));
        // shutdown port
        label = new JLabel("ShutdownPort:");
        // label.setBorder(new SoftBevelBorder(1));
        this.statusBar.add(label, new GridBagConstraints(2, 0, 1, 1, 0.0, 0.0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 0, 0,
            0), 0, 0));
        this.shutdownPortStatus = new JLabel(this.shutdownPortField.getText());
        // this.shutdownPortStatus.setBorder(new SoftBevelBorder(1));
        this.statusBar.add(this.shutdownPortStatus, new GridBagConstraints(3, 0, 1, 1, 0.2, 0.0, GridBagConstraints.WEST, GridBagConstraints.NONE,
            new Insets(0, 2, 0, 0), 0, 0));
        // server status
        label = new JLabel("Status:");
        // label.setBorder(new SoftBevelBorder(1));
        this.statusBar.add(label, new GridBagConstraints(4, 0, 1, 1, 0.0, 0.0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 0, 0,
            0), 0, 0));
        this.serverStatus = new JLabel("Stopped");
        // this.serverStatus.setBorder(new SoftBevelBorder(1));
        this.statusBar.add(this.serverStatus, new GridBagConstraints(5, 0, 1, 1, 0.0, 0.0, GridBagConstraints.WEST, GridBagConstraints.NONE,
            new Insets(0, 2, 0, 0), 0, 0));
        this.add(this.statusBar, new GridBagConstraints(0, 3, 3, 1, 1.0, 0.0, GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL, new Insets(0,
            0, 0, 0), 0, 0));

        // Setup Event handling
        // port status/fields
        this.config.addPropertyChangeListener(new PropertyChangeListener() {

            @Override
            public void propertyChange(PropertyChangeEvent evt) {
                if (evt.getPropertyName() == TomcatConfig.PROPERTY_SHUTDOWN_PORT) {
                    MainLauncherUI.this.shutdownPortField.setText(Integer.toString(MainLauncherUI.this.config.getShutdownPort()));
                    MainLauncherUI.this.shutdownPortStatus.setText(Integer.toString(MainLauncherUI.this.config.getShutdownPort()));
                } else if (evt.getPropertyName() == TomcatConfig.PROPERTY_SERVICE_PORT) {
                    MainLauncherUI.this.servicePortField.setText(Integer.toString(MainLauncherUI.this.config.getServicePort()));
                    MainLauncherUI.this.servicePortStatus.setText(Integer.toString(MainLauncherUI.this.config.getServicePort()));
                }
            }
        });
        // start button
        this.startButton.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent arg0) {
                MainLauncherUI.this.startButton.setEnabled(false);
                MainLauncherUI.this.stopButton.setEnabled(true);
                if (MainLauncherUI.this.appServer == null) {
                    try {
                        Main.printlnToLog("Starting WaveMaker ");
                        com.wavemaker.desktop.launcher.Server.ValidateConfig(MainLauncherUI.this.config);
                        MainLauncherUI.this.appServer = Main.getServerInstance(MainLauncherUI.this.config, false);
                        MainLauncherUI.this.appServer.getLauncher().addLifecycleListener(new LifecycleListener() {

                            @Override
                            public void lifecycleEvent(LifecycleEvent event) {
                                if (Lifecycle.INIT_EVENT.equals(event.getType())) {
                                    MainLauncherUI.this.serverStatus.setText("Initializing");
                                } else if (Lifecycle.BEFORE_START_EVENT.equals(event.getType())) {
                                    MainLauncherUI.this.serverStatus.setText("Starting");
                                } else if (Lifecycle.START_EVENT.equals(event.getType())) {
                                    MainLauncherUI.this.serverStatus.setText("Started");
                                } else if (Lifecycle.AFTER_START_EVENT.equals(event.getType())) {
                                    MainLauncherUI.this.serverStatus.setText("Running");
                                } else if (Lifecycle.BEFORE_STOP_EVENT.equals(event.getType())) {
                                    MainLauncherUI.this.serverStatus.setText("Stopping");
                                } else if (Lifecycle.AFTER_STOP_EVENT.equals(event.getType())) {
                                    MainLauncherUI.this.serverStatus.setText("Stopped");
                                }
                            }
                        });
                    } catch (IOException e) {
                        e.printStackTrace();
                    } catch (URISyntaxException e) {
                        e.printStackTrace();
                    } catch (InvalidServerConfigurationException e) {
                        JOptionPane.showMessageDialog(getParent(), "Unable to locate an available port.");
                        Main.printlnToLog(e.getMessage());
                        if (Main.logOut != null) {
                            e.printStackTrace(Main.logOut);
                        } else {
                            e.printStackTrace();
                        }
                    }
                }
                if (MainLauncherUI.this.appServer != null && MainLauncherUI.this.appServer.getStatus() != SERVER_STATUS.RUNNING) {
                    // Start Server
                    MainLauncherUI.this.appServer.start();
                    // Wait for server
                    for (int i = 0; i < 600 && MainLauncherUI.this.appServer.getStatus() != SERVER_STATUS.RUNNING; i++) {
                        try {
                            Thread.sleep(100);
                        } catch (InterruptedException e) {
                        }
                    }
                    if (MainLauncherUI.this.appServer.getStatus() != SERVER_STATUS.RUNNING) {
                        JOptionPane.showMessageDialog(getParent(),
                            "Server did not start. Server Status: " + MainLauncherUI.this.appServer.getStatus());
                    }
                }
                if (MainLauncherUI.this.appServer != null && MainLauncherUI.this.appServer.getStatus() == SERVER_STATUS.RUNNING) {
                    MainLauncherUI.this.stopButton.setEnabled(true);
                    openBrowser();
                } else {
                    MainLauncherUI.this.stopButton.setEnabled(false);
                }
                MainLauncherUI.this.startButton.setEnabled(true);
            }
        });
        // stop button
        this.stopButton.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent arg0) {
                if (MainLauncherUI.this.appServer != null) {
                    MainLauncherUI.this.appServer.stop();
                }
                MainLauncherUI.this.stopButton.setEnabled(false);
            }
        });
        // option button
        this.optionsButton.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent arg0) {
                if (MainLauncherUI.this.optionsPanel.isVisible()) {
                    MainLauncherUI.this.optionsButton.setText("Advanced >>");
                    MainLauncherUI.this.optionsPanel.setVisible(false);
                } else {
                    MainLauncherUI.this.optionsPanel.setVisible(true);
                    MainLauncherUI.this.optionsButton.setText("Advanced <<");
                }
                pack();
            }
        });
    }

    public void clickStart() {
        this.serverStatus.setText("Starting");
        this.startButton.doClick();
    }

    public void openBrowser() {
        String attributes = "";
        if (this.debugCheckbox.isSelected()) {
            attributes += "?debug";
        }
        if (!this.noLiveCheckbox.isSelected()) {
            if (attributes.length() == 0) {
                attributes += "?nolive";
            } else {
                attributes += "&nolive";
            }
        }
        try {
            URL target = new URL("http://localhost:" + this.config.getServicePort() + "/" + Main.studioWebApp + "/" + attributes);
            BrowserLauncher.openURL(target);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
    }
}

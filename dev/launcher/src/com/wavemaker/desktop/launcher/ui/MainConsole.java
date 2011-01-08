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
import java.awt.SplashScreen;
import java.awt.image.BufferedImage;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
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
    public static String OPTION_ENABLE_DEBUG = "debug";
    public static String OPTION_ENABLE_LIVELAYOUT = "livelayout";
    public static String OPTION_ENABLE_SUBPAGES = "subpages";
    public static String OPTION_SERVER_PORT = "serverport";
    public static String OPTION_SHUTDOWN_PORT = "shutdownport";
    public static String OPTION_STUDIO_BROWSER = "studioBrowser";
    public final static String VAL_SYS_DEF_BROWSER = "<system default browser>";

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

        SplashScreen splash = SplashScreen.getSplashScreen();
        if (splash == null)
        {
            setVisible(true);
            pbStatus.setIndeterminate(true);
            pbStatus.setVisible(true);
        }
        
        this.version = version;
        setTitle("WaveMaker Studio Server Console " + version + " ");
        
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
       
    public void clickStart()
    {
        this.btnStart.doClick();
    }

    public void openBrowser()
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
        setTitle("WaveMaker Console 6.3.0GA");
        setBackground(new java.awt.Color(255, 255, 255));

        lblStatus.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblStatus.setText(" STOPPED - click Start button to Start Studio in a browser.");
        lblStatus.setBorder(javax.swing.BorderFactory.createEtchedBorder());

        pbStatus.setMaximum(4);

        lblWMTitleLogo.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblWMTitleLogo.setIcon(new javax.swing.ImageIcon(getClass().getResource("/com/wavemaker/desktop/launcher/ui/wm_title.png"))); // NOI18N

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        btnStart.setText("Start");
        btnStart.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnStartActionPerformed(evt);
            }
        });

        btnStop.setText("Stop");
        btnStop.setEnabled(false);
        btnStop.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnStopActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                .addGap(62, 62, 62)
                .addComponent(btnStart, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 106, Short.MAX_VALUE)
                .addComponent(btnStop, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(75, 75, 75))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(btnStop, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(btnStart, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap())
        );

        jPanel2.setBackground(new java.awt.Color(255, 255, 255));

        btnAdvOpts.setText("Advanced Options...");
        btnAdvOpts.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnAdvOptsActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addGap(132, 132, 132)
                .addComponent(btnAdvOpts, javax.swing.GroupLayout.DEFAULT_SIZE, 169, Short.MAX_VALUE)
                .addGap(142, 142, 142))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(btnAdvOpts, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(lblWMTitleLogo, javax.swing.GroupLayout.DEFAULT_SIZE, 443, Short.MAX_VALUE)
                    .addComponent(jPanel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(lblStatus, javax.swing.GroupLayout.DEFAULT_SIZE, 443, Short.MAX_VALUE)
                    .addComponent(pbStatus, javax.swing.GroupLayout.DEFAULT_SIZE, 443, Short.MAX_VALUE)
                    .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addContainerGap())
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(lblWMTitleLogo, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(15, 15, 15)
                .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(lblStatus, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(pbStatus, javax.swing.GroupLayout.PREFERRED_SIZE, 20, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 33, Short.MAX_VALUE)
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void btnAdvOptsActionPerformed(java.awt.event.ActionEvent evt)//GEN-FIRST:event_btnAdvOptsActionPerformed
    {//GEN-HEADEREND:event_btnAdvOptsActionPerformed
        JDialog optsDlg = new LauncherAdvOptsDialog(this, true);
        optsDlg.getContentPane().setBackground(Color.WHITE);
        optsDlg.setLocationRelativeTo(this);
        optsDlg.setVisible(true);
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
                Main.printlnToLog("Starting WaveMaker ");
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
                                        lblStatus.setText("Initializing... please wait");
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
                                        lblStatus.setText("RUNNING: To stop WaveMaker, click the Stop button.");
                                        if (!isVisible())
                                        {
                                            setVisible(true);
                                        }
                            }
                            else if (Lifecycle.BEFORE_STOP_EVENT.equals(event.getType()))
                            {
                                        lblStatus.setText("Stopping WaveMaker...");
                                        btnStop.setEnabled(false);
                                        pbStatus.setVisible(true);
                                        pbStatus.setIndeterminate(true);
                            }
                            else if (Lifecycle.AFTER_STOP_EVENT.equals(event.getType()))
                            {
                                        lblStatus.setText("STOPPED - click Start button to launch Studio in a browser.");
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
                    "Unable to locate an available port.");

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
                    "WaveMaker did not start. Status: " + appServer.getStatus());
            }
        }

        if ((appServer != null) && (appServer.getStatus() == SERVER_STATUS.RUNNING))
        {
            btnStart.setEnabled(false);
//            pbStatus.setVisible(false);
            openBrowser();
        }
        else
        {
            btnStart.setEnabled(true);
//            pbStatus.setVisible(false);
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

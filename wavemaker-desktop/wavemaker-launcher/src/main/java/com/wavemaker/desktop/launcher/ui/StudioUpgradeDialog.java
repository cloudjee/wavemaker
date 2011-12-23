/*
 * Copyright (C) 2011 VMWare, Inc. All rights reserved.
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
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.File;

import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JFileChooser;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.JTextField;
import javax.swing.border.TitledBorder;

import com.wavemaker.desktop.launcher.Main;

/**
 * @author rkirkland
 * 
 */
public class StudioUpgradeDialog extends JDialog {

	private static final long serialVersionUID = 1L;

	/** Variables */
	// Constants
	// Members
	private	boolean normalClose = false;
	protected String version;
	protected File projectsDir;
	protected File existingDir;
	protected JButton okButton;
	protected JRadioButton oldProjectsButton;
	protected JRadioButton copyProjectsButton;
	protected JPanel subPanel;
	protected JTextField projectsPathField;
	protected JButton browseButton;

	/** Construction\Destruction 
	 * @param string */
	public StudioUpgradeDialog(String version, File existingProjectsDirectory, File defaultProjectsDirectory, boolean majorUpgrade) {
		this.dialogInit();
		this.version = version;
		this.existingDir = existingProjectsDirectory;
		this.projectsDir = existingProjectsDirectory;
		if(defaultProjectsDirectory != null){
		this.projectsDir = defaultProjectsDirectory;
		}
		this.oldProjectsButton = new JRadioButton("Share projects directory with the previous version at \"" + this.existingDir.getAbsolutePath() + "\"");
		this.copyProjectsButton = new JRadioButton("Copy projects from \"" + this.existingDir.getAbsolutePath() + "\" to a new project directory.");
		this.projectsPathField = new JTextField(this.projectsDir.getAbsolutePath());
		ButtonGroup optionsGroup = new ButtonGroup();
		optionsGroup.add(this.oldProjectsButton);
		optionsGroup.add(this.copyProjectsButton);
		if(majorUpgrade)
		{
			this.copyProjectsButton.setSelected(true);
		}
		else
		{
			this.oldProjectsButton.setSelected(true);
		}
		this.init();
		this.setModal(true);
		this.setSize(this.getPreferredSize());
		this.updateSubPanel();
	}

	public StudioUpgradeDialog(String version, File existingProjectsDirectory, File defaultProjectsDirectory) {
		this(version, existingProjectsDirectory, defaultProjectsDirectory, false);
	}

	/** Instance Methods */
	private void init() {
		this.setTitle("WaveMaker Studio Upgrade:");
		this.setDefaultCloseOperation(DISPOSE_ON_CLOSE);
		this.addWindowListener(new WindowAdapter(){
            public void windowClosed(WindowEvent e) {
				if(!normalClose)
				{
					Main.printlnToConsole("User terminated application.");
					System.exit(0);
				}
			}
		});
		this.getContentPane().setLayout(new GridBagLayout());
		this.getContentPane().add(new JLabel("<html>Congratulations! You have successfully installed WaveMaker v" + this.version + "<P>Clear your browser's cache of previous version to ensure proper operation of Studio</html>" ),
						new GridBagConstraints(0, 0, 1, 1, 0.0, 0.0,
								GridBagConstraints.NORTHWEST,
								GridBagConstraints.NONE,
								new Insets(2, 2, 2, 2), 0, 0));
		this.getContentPane().add(this.oldProjectsButton, new GridBagConstraints(0, 1, 1, 1, 0.0, 0.0,
						GridBagConstraints.NORTHWEST, GridBagConstraints.NONE,
						new Insets(2, 2, 2, 2), 0, 0));
		this.getContentPane().add(new JLabel("Or"), new GridBagConstraints(0, 2, 1, 1, 0.0, 0.0,
				GridBagConstraints.NORTHWEST, GridBagConstraints.NONE,
				new Insets(2, 2, 2, 2), 0, 0));		
		this.getContentPane().add(this.copyProjectsButton, new GridBagConstraints(0, 3, 1, 1, 0.0, 0.0,
				GridBagConstraints.NORTHWEST, GridBagConstraints.NONE,
				new Insets(2, 2, 2, 2), 0, 0));
		this.subPanel = new JPanel();
		subPanel.setLayout(new GridBagLayout());
		subPanel.setBorder(new TitledBorder("Project Settings:"));
		this.getContentPane().add(subPanel, new GridBagConstraints(0, 4, 1, 1, 1.0, 1.0,
				GridBagConstraints.CENTER, GridBagConstraints.BOTH, new Insets(
						2, 2, 2, 2), 0, 0));
		subPanel.add(new JLabel("New Projects Directory:"),
				new GridBagConstraints(0, 0, 1, 1, 0.0, 0.1,
						GridBagConstraints.EAST, GridBagConstraints.VERTICAL,
						new Insets(2, 2, 2, 2), 0, 0));
		subPanel.add(this.projectsPathField, new GridBagConstraints(1, 0, 1, 1, 0.6, 0.1,
				GridBagConstraints.CENTER, GridBagConstraints.BOTH,
				new Insets(2, 2, 2, 2), 0, 0));
		this.browseButton = new JButton("Browse...");
		subPanel.add(this.browseButton, new GridBagConstraints(2, 0, 1, 1,
				0.0, 0.1, GridBagConstraints.WEST,
				GridBagConstraints.VERTICAL, new Insets(2, 2, 2, 2), 0, 0));
		// OK button
		this.okButton = new JButton("OK");
		this.getContentPane().add(this.okButton, new GridBagConstraints(0, 5, 1, 1, 0.0, 0.0,
				GridBagConstraints.CENTER, GridBagConstraints.NONE, new Insets(
						2, 2, 4, 2), 0, 0));
		this.pack();

		// Event Handling
		//browse Button
		this.browseButton.addActionListener(new ActionListener(){
			public void actionPerformed(ActionEvent ev){
				final JFileChooser jfc = new JFileChooser(existingDir);
				jfc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
				if(jfc.showOpenDialog(null) == JFileChooser.APPROVE_OPTION)
				{
					File temp = jfc.getSelectedFile();
					if(temp.isFile()){
						temp = temp.getParentFile();
					}
					projectsDir = temp;
					projectsPathField.setText(projectsDir.getAbsolutePath());
				}
			}
		});
		//shutdown Port Field
		// oldProjectsButton
		this.oldProjectsButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
				updateSubPanel();
			}
		});
		this.copyProjectsButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
				updateSubPanel();
			}
		});

		// OK button
		this.okButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
				boolean success = true;
				if(upgradeSelected())
				{
					// Test Projects directory
					File proposed = new File(projectsPathField.getText());
					if(!proposed.equals(projectsDir))
					{
						// Check if path exists
						if(proposed.exists())
						{
							// Check if a directory
							if(proposed.isDirectory())
							{
								// Check if writable
								if(proposed.canWrite())
								{
									// Store
									projectsDir = proposed;
								}
								else
								{
									JOptionPane.showMessageDialog(JOptionPane.getRootFrame(), "Unable to write to \"" + proposed.getAbsolutePath() + "\".\nPlease correct the permissions or select a different location.", "Error Opening Projects Directory:", JOptionPane.ERROR_MESSAGE);
									success = false;
								}
							}
							else
							{
								JOptionPane.showMessageDialog(JOptionPane.getRootFrame(), "\"" + proposed.getAbsolutePath() + "\" is not a directory.\nPlease select a different location.", "Error Opening Projects Directory:", JOptionPane.ERROR_MESSAGE);
								success = false;
							}
						}
						else
						{
							// Create
							if(proposed.mkdirs())
							{
								// Store
								projectsDir = proposed;
							}
							else
							{
								// Unable to create directories
								JOptionPane.showMessageDialog(JOptionPane.getRootFrame(), "", "Error Creating Projects Directory:", JOptionPane.ERROR_MESSAGE);
								success = false;
							}
						}
					}
				}
				if(success)
				{
					normalClose = true;
					dispose();
				}
			}
		});
	}

	public File getSelectedProjectsPath()
	{
		return this.projectsDir;
	}

	protected void updateSubPanel()
	{
		boolean isUpgrade = this.upgradeSelected();
		if(!isUpgrade)
		{
			this.projectsDir = this.existingDir;
		}
		for(int i = this.subPanel.getComponentCount() - 1 ; i >= 0; i--)
		{
			this.subPanel.getComponent(i).setEnabled(isUpgrade);
		}
	}

	public boolean upgradeSelected()
	{
		return this.copyProjectsButton.isSelected();
	}
}

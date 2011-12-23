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
 

package com.wavemaker.desktop.launcher.ui;

import java.awt.Cursor;
import java.awt.DisplayMode;
import java.awt.GraphicsEnvironment;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;

import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JProgressBar;

public class ProgressDialog extends JDialog {
	/**
	 * 
	 */
	private static final long serialVersionUID = -8319548537136757995L;
	/** Variables */
	//instance
	protected boolean allowCancel;
	protected boolean allowVetoes;
	protected boolean isRunning;
	protected Thread thread;
	protected JLabel messageLabel;
	protected JButton cancelButton;
	protected JProgressBar progress;
	//event notification
	protected ArrayList<CancelListener> listeners = new ArrayList<CancelListener>();

	/** Construction\Destruction */
	public ProgressDialog(){
		this.dialogInit();
		this.isRunning = false;
		this.messageLabel = new JLabel("");
		this.cancelButton = new JButton("Cancel");
		this.cancelButton.setEnabled(false);
		this.progress = new JProgressBar();
		this.progress.setIndeterminate(true);
		this.init();
	}
	public ProgressDialog(String title, String message, boolean allowCancel, boolean allowVeto){
		this.dialogInit();
		this.allowCancel = allowCancel;
		this.allowVetoes = allowVeto;
		this.isRunning = false;
		this.setTitle(title);
		this.messageLabel = new JLabel(message);
		this.cancelButton = new JButton("Cancel");
		this.cancelButton.setEnabled(allowCancel);
		this.progress = new JProgressBar();
		this.progress.setIndeterminate(true);
		this.init();
	}

	/** Static Methods */
	public static void main(String[] args)
	{
		ProgressDialog pd = new ProgressDialog("Test Progress", "This is a test of the emergency progress system.", true, false);
		pd.start();
	}

	/** Instance Methods */
	public void addCancelListener(CancelListener listener)
	{
		this.listeners.add(listener);
		if(this.allowCancel)
		{
			this.cancelButton.setEnabled(true);
		}
	}

	public void removeCancelListener(CancelListener listener)
	{
		this.listeners.remove(listener);
		if(this.listeners.size() == 0)
		{
			this.cancelButton.setEnabled(false);
		}
	}

	protected void notifyListeners()
	{
		if(this.isVetoable())
		{
			for(CancelListener listener : this.listeners)
			{
				if(!listener.cancelRequested(new CancelEvent()))
				{
					if(this.isVetoable())
					{
						return;
					}
				}
			}
		}
		for(CancelListener listener : this.listeners)
		{
			listener.cancelPerformed(new CancelEvent());
		}
		this.dispose();
		return;
	}

	public boolean isCancellable()
	{
		return this.allowCancel;
	}

	public boolean isVetoable() {
		return this.allowVetoes;
	}

	protected void init()
	{
		this.setDefaultCloseOperation(DO_NOTHING_ON_CLOSE);
		this.setSize(300, 200);
		this.progress.setVisible(true);
		this.getContentPane().setLayout(new GridBagLayout());
		this.getContentPane().add(this.messageLabel, new GridBagConstraints(0, 0, 1, 1, 1.0, 0.0,
				GridBagConstraints.NORTHWEST, GridBagConstraints.HORIZONTAL,
				new Insets(2, 2, 2, 2), 0, 0));
		this.getContentPane().add(this.progress, new GridBagConstraints(0, 1, 1, 1, 1.0, 0.0,
				GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL,
				new Insets(2, 2, 2, 2), 0, 0));
		this.getContentPane().add(this.cancelButton, new GridBagConstraints(0, 2, 1, 1, 0.0, 0.0,
				GridBagConstraints.CENTER, GridBagConstraints.NONE,
				new Insets(2, 2, 2, 2), 0, 0));
		this.pack();
		// this.setLocationByPlatform(true);
		GraphicsEnvironment ge = GraphicsEnvironment
		.getLocalGraphicsEnvironment();
		DisplayMode display = ge.getDefaultScreenDevice().getDisplayMode();
		if(display != null){
			this.setLocation(display.getWidth() / 2 - this.getWidth() / 2,
				display.getHeight() / 2 - this.getHeight() / 2);
		}
		else{	
			this.setLocation(300,300);
		}
		this.setCursor(Cursor.getPredefinedCursor(Cursor.WAIT_CURSOR));
		this.cancelButton.setCursor(Cursor.getDefaultCursor());
		// Event Handling
		//cancel Button
		this.cancelButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
				notifyListeners();
			}
		});
	}

	public void setCancellable(boolean allowCancel)
	{
		this.allowCancel = allowCancel;
		if((this.allowCancel) && (this.listeners.size() > 0))
		{
			this.cancelButton.setEnabled(true);
		}
	}

	public void setIndeterminate(boolean state)
	{
		progress.setIndeterminate(true);
	}

	public void setVetoable(boolean allowVetoes)
	{
		this.allowVetoes = allowVetoes;
	}

	public void start()
	{
		this.thread = new Thread(new Runnable(){
			public void run(){
				setVisible(true);
			}
		});
		this.isRunning = true;
		this.thread.start();
	}

	public void stop()
	{
		this.isRunning = false;
		this.setVisible(false);
		try{
			this.thread.join();
		} catch (InterruptedException e) {}
	}
}

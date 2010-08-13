/**
 * 
 */
package com.wavemaker.desktop.launcher.ui;

/**
 * @author RJ
 *
 */
public interface CancelListener {
	public boolean cancelRequested(CancelEvent ev);
	public void cancelPerformed(CancelEvent ev);
}

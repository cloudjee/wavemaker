package com.wavemaker.desktop.launcher.ui;

/////////////////////////////////////////////////////////
//Bare Bones Browser Launch                            //
//Version 1.5 (December 10, 2005)                      //
//By Dem Pilafian                                      //
//Supports: Mac OS X, GNU/Linux, Unix, Windows XP      //
//Example Usage:                                       //
// String url = "http://www.centerkey.com/";           //
// BareBonesBrowserLaunch.openURL(url);		       //
//Public Domain Software -- Free to Use as You Like    //
/////////////////////////////////////////////////////////

import java.lang.reflect.Method;
import java.net.URL;
import javax.swing.JOptionPane;

public class BrowserLauncher
{

    private static final String errMsg = "Error attempting to launch web browser";

    public static void main(String[] args)
    {
        final String b1 = "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe";
        final String b2 = "C:\\Users\\cconover\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";
        openURL("http://www.wavemaker.com", b1);
    }
            
    public static void openURL(String url)
    {
        openURL(url, null);
    }

    public static void openURL(String url, String browserPath)
    {
        String osName = System.getProperty("os.name");
        try
        {
            if (browserPath != null)
            {
                Runtime.getRuntime().exec(new String[]{browserPath, url});
            }
            else if(osName.startsWith("Mac OS"))
            {
                Class<?> fileMgr = Class.forName("com.apple.eio.FileManager");

                Method openURL = fileMgr.getDeclaredMethod(
                    "openURL", new Class[]{String.class});

                openURL.invoke(null, new Object[] {url});
            }
            else if (osName.startsWith("Windows"))
            {
                Runtime.getRuntime().exec("rundll32 url.dll,FileProtocolHandler " + url);
            }
            else // assume Unix or Linux
            { 
                String[] browsers =
                {
					// this uses the first browser it finds - is there a way to get the default browser for UNIX/Linux?
                    "chrome", "firefox", "opera", "konqueror",
                    "epiphany", "mozilla", "netscape"
                };
                String browser = null;
                for (int count = 0; count < browsers.length && browser == null; count++)
                {
                    if (Runtime.getRuntime().exec(new String[] {"which", browsers[count]}).waitFor() == 0)
                    {
                        browser = browsers[count];
                    }
                }
                if (browser == null)
                {
                    throw new Exception("Could not find web browser");
                }
                else
                {
                    Runtime.getRuntime().exec(new String[]{browser, url});
                }
            }
        }
        catch (Exception e)
        {
            JOptionPane.showMessageDialog(null, errMsg + ":\n" + e.getLocalizedMessage());
        }
    }

    public static void openURL(URL target)
    {
        openURL(target.toString());
    }

    public static void openURL(URL target, String browser)
    {
        openURL(target.toString(), browser);
    }
}

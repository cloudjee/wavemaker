/*
 * See COPYING for license information.
 */ 

package com.wavemaker.tools.cloudmgr.rackspace;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Properties;

import org.apache.log4j.Logger;
import org.apache.commons.codec.net.URLCodec;
import org.apache.commons.codec.EncoderException;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.project.StudioConfiguration;

/**
 *  Cloud Files utilities 
 */
public class CommonUtil {
    private static Logger logger = Logger.getLogger(CommonUtil.class);
	/**
	 *  The name of the properties file we're looking for 
	 */
	private final static String file = "cloud.properties";
	
	/**
	 *  A cache of the properties
	 */
	private static Properties props = null;
	
	/**
	 * Find the properties file in the class path and load it.
	 * 
	 * @throws IOException
	 */
	private static void loadPropertiesFromClasspath() throws IOException {
        props = new Properties();
        //InputStream inputStream = CommonUtil.class.getClassLoader()
        //    .getResourceAsStream(file);

        String name = "com/wavemaker/tools/cloudmgr/rackspace/" + file;
        InputStream inputStream = StudioConfiguration.class.getClassLoader().getResourceAsStream(name);


        if (inputStream == null) {
            throw new FileNotFoundException("Property file '" + file
                + "' not found in the classpath");
        }
        props.load(inputStream);
	}
	
	/**
	 * Look up a property from the properties file.
	 * 
	 * @param key The name of the property to be found
	 * @return    The value of the property
	 */
	public static String getProperty(String key)
	{
		if (props == null)
		{
			try
			{
				loadPropertiesFromClasspath();
			}
			catch (Exception ioe)
			{
				logger.warn("Unable to load properties file.");
				//return null;
                throw new WMRuntimeException(ioe);
            }
		}
		return props.getProperty(key);
	}
	
	/**
	 * Look up a property from the properties file.
	 * 
	 * @param key The name of the property to be found
	 * @return    The value of the property
	 */
        public static String getProperty(String key, String defaultValue)
	{
		if (props == null)
		{
			try
			{
				loadPropertiesFromClasspath();
			}
			catch (Exception ioe)
			{
				logger.warn("Unable to load properties file.");
				//return null;
                throw new WMRuntimeException(ioe);
            }
		}
		return props.getProperty(key, defaultValue);
	}
	
	/**
	 * Looks up the value of a key from the properties file and converts it to an integer.
	 * 
	 * @param key
	 * @return The value of that key
	 */
	public static int getIntProperty(String key) {
		String property = getProperty(key);
		
		if (property == null) {
			logger.warn("Could not load integer property " + key);
			//return -1;
            throw new WMRuntimeException("Could not load integer property " + key);
        }
		try {
			return Integer.parseInt(property);
		}
		catch (NumberFormatException nfe) { 
			logger.warn("Invalid format for a number in properties file: " + property, nfe);
			//return -1;
            throw new WMRuntimeException("Invalid format for a number in properties file: " + property, nfe);
        }
	}

    /**
     * Reads an input stream into a stream
     *
     * @param stream The input stream
     * @param encoding The encoding method
     * @return The contents of the stream stored in a string.
     * @throws IOException
     */
    public static String inputStreamToString(InputStream stream, String encoding) throws IOException {
    	char buffer[] = new char[4096];
    	StringBuilder sb = new StringBuilder();
    	InputStreamReader isr = new InputStreamReader(stream, "utf-8"); // For now, assume utf-8 to work around server bug

    	int nRead = 0;
    	while((nRead = isr.read(buffer)) >= 0) {
    		sb.append(buffer, 0, nRead);
    	}
    	isr.close();

    	return sb.toString();
    }

    /**
     * Encode any unicode characters that will cause us problems.
     *
     * @param str
     * @return The string encoded for a URI
     */
    public static String sanitizeForURI(String str) {
    	URLCodec codec= new URLCodec();
    	try {
    		return codec.encode(str).replaceAll("\\+", "%20").replaceAll("%2F", "/");
    	}
    	catch (EncoderException ee) {
    		logger.warn("Error trying to encode string for URI", ee);
    		//return str;
            throw new WMRuntimeException("Error trying to encode string for URI", ee);
        }
    }
}

/**
 * Copyright (c) 2013 - 2014 CloudJee Inc. All Rights Reserved.
 *
 * This software is the confidential and proprietary information of CloudJee Inc.
 * You shall not disclose such Confidential Information and shall use it only in accordance
 * with the terms of the source code license agreement you entered into with CloudJee Inc.
 */
package com.wavemaker.tools.service.cloujeewrapper;

import com.wavemaker.runtime.RuntimeAccess;
import org.springframework.core.io.ClassPathResource;

import javax.servlet.ServletContext;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;


/**
 * @author <a href="mailto:pankaj.n@imaginea.com">pankaj</a>
 *
 */
public class ConfigProperties {
	// deploy urls
    public static final String AUTH_LOGIN_URI;
    public static final String AUTH_LOGOUT_URI;
	public static final String DEPLOY;
	public static final String UNDEPLOY;
	public static final String START;
	public static final String STOP;
	public static final String LIST;
    public static final String ACCOUNTINFO;
    public static final String SIGNUP;
    public static final String ACCOUNTTARGETSUFFIX;
    public static final String LOGINTARGET;
    public static final String HOST_NAME;
    public static final String PROTOCOL;
    public static final String SERVICE;


    private static Properties properties = new Properties();

	static {
		init();
        PROTOCOL = properties.getProperty("PROTO");
        HOST_NAME = properties.getProperty("HOSTNAME");
        SERVICE = properties.getProperty("SERVICE");
		AUTH_LOGIN_URI = PROTOCOL+ HOST_NAME +"/" + properties.getProperty("loginUri");
        AUTH_LOGOUT_URI = PROTOCOL+ HOST_NAME +"/" + properties.getProperty("logoutUri");
		DEPLOY = PROTOCOL+ HOST_NAME +"/" + SERVICE + "/" + properties.getProperty("deploy");
		UNDEPLOY = PROTOCOL+ HOST_NAME +"/" + SERVICE + "/" + properties.getProperty("undeploy");
		START = PROTOCOL+ HOST_NAME +"/" + SERVICE + "/" + properties.getProperty("start");
		STOP = PROTOCOL+ HOST_NAME +"/" + SERVICE + "/" + properties.getProperty("stop");
		LIST = PROTOCOL+ HOST_NAME +"/" + SERVICE + "/" + properties.getProperty("list");
        ACCOUNTINFO = PROTOCOL+ HOST_NAME +"/"  +properties.getProperty("accountInfo");
        SIGNUP = PROTOCOL+ HOST_NAME +"/" + properties.getProperty("signUp");
        ACCOUNTTARGETSUFFIX = HOST_NAME;
        LOGINTARGET = PROTOCOL+ HOST_NAME;

	}

	public static void init() {
		try {
            //ClassPathResource cjProperties=  new ClassPathResource("com/wavemaker/tools/service/cloudjeeconfig.properties");
            ServletContext context = RuntimeAccess.getInstance().getSession().getServletContext();
            String webinf = context.getRealPath("WEB-INF");
            InputStream is = new FileInputStream(webinf + File.separator + "wavemakercloudconfig.properties");
			properties.load(is);
		} catch (IOException e) {
			e.printStackTrace();
		}
    }



}

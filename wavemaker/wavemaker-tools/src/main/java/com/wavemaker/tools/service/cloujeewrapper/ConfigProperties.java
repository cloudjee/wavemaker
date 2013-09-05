/**
 * Copyright (c) 2013 - 2014 CloudJee Inc. All Rights Reserved.
 *
 * This software is the confidential and proprietary information of CloudJee Inc.
 * You shall not disclose such Confidential Information and shall use it only in accordance
 * with the terms of the source code license agreement you entered into with CloudJee Inc.
 */
package com.wavemaker.tools.service.cloujeewrapper;

import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.util.Properties;


/**
 * @author <a href="mailto:pankaj.n@imaginea.com">pankaj</a>
 *
 */
public class ConfigProperties {

	// Autentication
	public static final String USER_NAME;
	public static final String PASSWORD;
	public static final String USER_NAMES;
	public static final String HOST_NAME;
	public static final String AUTH_LOGIN_URI;
	public static final String BASE_URI;
	public static final String GROUP_URI;
	public static final String PROVISION_URI;
	public static final String ACTIVITY_PROGRESS_URI;
	public static final String APPLICATION_URI;
	public static final String CREATE_GROUP_METHOD_NAME;
	public static final String CREATE_GRP_INVO_CNT;
	
	// Application
	public static final String APP_NAME;
	public static final String APP_PATH;
	
	// deploy urls
	public static final String DEPLOY;
	public static final String UNDEPLOY;
	public static final String START;
	public static final String STOP;
	public static final String LIST;
    public static final String ACCOUNTINFO;
	
	private static Properties properties = new Properties();

	static {
		init();
		USER_NAME = properties.getProperty("userName");
		PASSWORD = properties.getProperty("password");
		USER_NAMES = properties.getProperty("userNames");
		HOST_NAME = properties.getProperty("hostName");
		AUTH_LOGIN_URI = properties.getProperty("loginUri");
		BASE_URI = properties.getProperty("baseUri");
		GROUP_URI = BASE_URI + properties.getProperty("groupService");
		PROVISION_URI = BASE_URI + properties.getProperty("provisionService");
		ACTIVITY_PROGRESS_URI = BASE_URI + properties.getProperty("activityService");
		APPLICATION_URI = BASE_URI + properties.getProperty("applicationService");
		CREATE_GROUP_METHOD_NAME = properties.getProperty("createGroupMethod");
		CREATE_GRP_INVO_CNT = properties.getProperty("createGrpInvocationCount");	
		
		APP_NAME = properties.getProperty("appName");
		APP_PATH = properties.getProperty("appPath");
		
		DEPLOY = properties.getProperty("deploy");
		UNDEPLOY = properties.getProperty("undeploy");
		START = properties.getProperty("start");
		STOP = properties.getProperty("stop");
		LIST = properties.getProperty("list");
        ACCOUNTINFO = properties.getProperty("accountInfo");
	}

	public static void init() {
		try {

            ClassPathResource cjProperties=  new ClassPathResource("com/wavemaker/tools/service/cloudjeeconfig.properties");
			properties.load(cjProperties.getInputStream());
		} catch (IOException e) {
			e.printStackTrace();
		}
    }



}

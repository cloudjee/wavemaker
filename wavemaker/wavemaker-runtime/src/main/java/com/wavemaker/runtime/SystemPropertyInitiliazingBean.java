package com.wavemaker.runtime;

import java.util.Iterator;
import java.util.Map;

import org.springframework.beans.factory.InitializingBean;

public class SystemPropertyInitiliazingBean implements InitializingBean {

	private Map<String, ?> systemProperties;

	public void afterPropertiesSet() 
			throws Exception {
		if (systemProperties == null || systemProperties.isEmpty()) {
			return;
		}

		Iterator<String> i = systemProperties.keySet().iterator();
		while (i.hasNext()) {
			String key = (String) i.next();
			String value = (String) systemProperties.get(key);
			System.setProperty(key, value);
		}
	}

	public void setSystemProperties(Map<String, String> systemProperties) {
		this.systemProperties = systemProperties;
	}

}


package com.wavemaker.runtime;

import java.util.Iterator;
import java.util.Map;

import org.springframework.beans.factory.InitializingBean;

public class SystemPropertyInitiliazingBean implements InitializingBean {

    private Map<String, ?> systemProperties;

    @Override
    public void afterPropertiesSet() throws Exception {
        if (this.systemProperties == null || this.systemProperties.isEmpty()) {
            return;
        }

        Iterator<String> i = this.systemProperties.keySet().iterator();
        while (i.hasNext()) {
            String key = i.next();
            String value = (String) this.systemProperties.get(key);
            System.setProperty(key, value);
        }
    }

    public void setSystemProperties(Map<String, String> systemProperties) {
        this.systemProperties = systemProperties;
    }

}

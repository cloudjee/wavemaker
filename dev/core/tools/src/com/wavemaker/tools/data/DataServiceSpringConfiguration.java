/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.data;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jndi.JndiObjectFactoryBean;

import com.wavemaker.runtime.data.spring.WMPropertyPlaceholderConfigurer;
import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.runtime.data.spring.ConfigurationAndSessionFactoryBean;
import com.wavemaker.runtime.data.spring.SpringDataServiceManager;
import com.wavemaker.runtime.data.sqlserver.SqlServerUserImpersonatingDataSourceProxy;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.data.util.DataServiceUtils;
import com.wavemaker.tools.service.FileService;
import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.spring.beans.ConstructorArg;
import com.wavemaker.tools.spring.beans.DefaultableBoolean;
import com.wavemaker.tools.spring.beans.Entry;
import com.wavemaker.tools.spring.beans.Map;
import com.wavemaker.tools.spring.beans.Property;
import com.wavemaker.tools.spring.beans.Value;

/**
 * Encapsulates access to the Data Model Spring configuration.
 * 
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class DataServiceSpringConfiguration {

    public static final String JNDI_NAME_PROPERTY = "jndiName";

    private final String rootPath;

    private final String path;

    private final FileService fileService;

    private final String propertiesFile;

    private final String serviceId;

    private Beans beans;

    private boolean isDirty = false;

    public DataServiceSpringConfiguration(FileService fileService,
            String rootPath, String configFile, String serviceName) {
        this.rootPath = rootPath;
        this.path = rootPath + "/" + configFile;
        this.fileService = fileService;
        this.beans = DataServiceUtils.readBeans(fileService, path);
        this.serviceId = serviceName;
        this.propertiesFile = getConnectionPropertiesFileName();
    }

    void revert() {
        beans = DataServiceUtils.readBeans(fileService, path);
        isDirty = false;
    }

    void write() {

        if (!isDirty) {
            if (DataServiceLoggers.parserLogger.isDebugEnabled()) {
                DataServiceLoggers.parserLogger
                        .info("No changes to write to Spring Configuration at "
                                + path);
            }
            return;

        }

        DataServiceUtils.writeBeans(beans, fileService, path);

        if (DataServiceLoggers.parserLogger.isInfoEnabled()) {
            DataServiceLoggers.parserLogger
                    .info("Wrote Spring Configuration at " + path);
        }

        isDirty = false;

    }

    String getPath() {
        return path;
    }

    Properties readProperties() {
        return readProperties(false);
    }

    Properties readProperties(boolean removePrefix) {
        try {
            String s = fileService.readFile(propertiesFile);
            ByteArrayInputStream bais = new ByteArrayInputStream(s.getBytes());
            Properties rtn = DataServiceUtils.readProperties(bais);
            if (removePrefix) {
                DataServiceUtils.removePrefix(rtn);
            }
            return rtn;
        } catch (IOException ex) {
            throw new ConfigurationException(ex);
        }
    }
    
    Properties readCombinedProperties(boolean removePrefix) {
    	Properties props = readProperties(removePrefix);
    	readExecuteAsProperties(props);
    	return props;
    }

    void readExecuteAsProperties(Properties props) {
		List<Bean> dsProxyBeans = beans.getBeansByType(SqlServerUserImpersonatingDataSourceProxy.class);
		if (dsProxyBeans.size() == 0) {
			return;
		}
		props.put("executeAs", "true");
		Bean proxyBean = dsProxyBeans.get(0);
		props.put("activeDirectoryDomain", proxyBean.getProperty("activeDirectoryDomain").getValue());
	}

	boolean useIndividualCRUDperations() {
        String s = getPropertyValue(DataServiceConstants.GENERATE_OLD_STYLE_OPRS_PROPERTY);
        return Boolean.valueOf(s);
    }

    void setRefreshEntities(List<String> refreshEntities) {
        setPropertyValue(DataServiceConstants.REFRESH_ENTITIES_PROPERTY,
                ObjectUtils.toString(refreshEntities));
    }

    List<String> getRefreshEntities() {
        String s = getPropertyValue(DataServiceConstants.REFRESH_ENTITIES_PROPERTY);
        if (s == null) {
            return new ArrayList<String>();
        } else {
            return StringUtils.split(s);
        }
    }

    public void writeProperties(Properties props) {
        writeProperties(props, true);
    }

    public void writeProperties(Properties props, boolean validate) {

        if (!validate) {
        	updateSpringConfigIfNecessary(props);
            writeProps(filterProps(props));
            return;
        }

        // when sent from the client, there's no prefix. however, when called as
        // an api, as some of the tests do, there may be a prefix
        DataServiceUtils.removePrefix(props);

        String key = StringUtils.removeIfStartsWith(
                DataServiceConstants.DB_URL, ".");
        String connectionUrl = props.getProperty(key);
        if (connectionUrl == null) {
            throw new IllegalArgumentException(key + " must be set");
        }

        key = StringUtils.removeIfStartsWith(
                DataServiceConstants.DB_DRIVER_CLASS_NAME, ".");
        String driverClassName = props.getProperty(key);
        if (ObjectUtils.isNullOrEmpty(driverClassName)) {
            String dbtype = BaseDataModelSetup.getDBTypeFromURL(connectionUrl);
            if (dbtype == null) {
                throw new IllegalArgumentException(key + " must bet set");
            }
            String value = BaseDataModelSetup.getDriverClassForDBType(dbtype);
            props.setProperty(key, value);
        }

        key = StringUtils.removeIfStartsWith(DataServiceConstants.DB_DIALECT,
                ".");
        String dialect = props.getProperty(key);
        if (ObjectUtils.isNullOrEmpty(dialect)) {
            String dbtype = BaseDataModelSetup.getDBTypeFromURL(connectionUrl);
            if (dbtype == null) {
                throw new IllegalArgumentException(key + " must bet set");
            }
            String value = BaseDataModelSetup.getDialectForDBType(dbtype);
            props.setProperty(key, value);
        }

        Properties org = readCombinedProperties(false);

        DataServiceUtils.removePrefix(org);

        // don't override properties that can't be edited in the UI
        SystemUtils.addAllUnlessSet(props, org);

        // don't do anything unless some changes have been made
        if (props.equals(org)) {
            return;
        }

        updateSpringConfigIfNecessary(props);
        writeProps(DataServiceUtils.addPrefix(serviceId, filterProps(props)));
    }

    private Properties filterProps(Properties props) {
    	Properties filtered = new Properties();
    	filtered.putAll(props);
    	filtered.remove("executeAs");
    	filtered.remove(serviceId+".executeAs");
    	filtered.remove("activeDirectoryDomain");
    	filtered.remove(serviceId+".activeDirectoryDomain");
		return filtered;
	}

	void addMapping(String path) {
        Property p = getMappingFilesProperty();
        List<String> l = new ArrayList<String>(p.getListValue());
        l.add(path);
        setMappings(l);
    }

    void removeMapping(String path) {
        Property p = getMappingFilesProperty();
        List<String> l = new ArrayList<String>(p.getListValue());
        l.remove(path);
        setMappings(l);
    }

    List<String> getMappings() {
        return getMappingFilesProperty().getListValue();
    }

    public boolean isKnownConfiguration() {
        try {
            getSpringDataServiceManager();
            return true;
        } catch (SpringDataServiceManagerNotFound ex) {
            return false;
        }
    }

    public List<Bean> getBeansByType(Class<?> type) {
        return beans.getBeansByType(type.getName());
    }

    void configureJNDIDataSource(String jndiName) {

        List<Bean> l = beans.getBeansByType(DriverManagerDataSource.class
                .getName());

        if (l.size() != 1) {
            throw new AssertionError("Expected one datasource bean");
        }

        Bean ds = l.iterator().next();
        ds.setClazz(JndiObjectFactoryBean.class.getName());
        ds.removeProperties();
        ds.addProperty(JNDI_NAME_PROPERTY, jndiName);
        isDirty = true;
    }

    private void setPropertyValue(String key, String value) {
        Map m = getOrCreatePropertiesMap();
        Entry e = getEntry(m, key, true);
        e.setValue(value);
        isDirty = true;
    }

    private String getPropertyValue(String key) {
        Map m = getOrCreatePropertiesMap();
        Entry e = getEntry(m, key, false);
        if (e == null) {
            return null;
        } else {
            return e.getValue();
        }
    }

    private Entry getEntry(Map m, String key, boolean create) {
        for (Entry e : m.getEntries()) {
            if (e.getKey().equals(key)) {
                return e;
            }
        }
        if (create) {
            Entry e = new Entry();
            e.setKey(key);
            m.getEntries().add(e);
            return e;
        } else {
            return null;
        }
    }

    private Map getOrCreatePropertiesMap() {
        Bean b = getSpringDataServiceManager();
        List<ConstructorArg> l = b.getConstructorArgs();
        Map rtn = null;
        if (l.size() < 4) {
            rtn = new Map();
            ConstructorArg a = new ConstructorArg();
            a.setMap(rtn);
            b.getMetasAndConstructorArgsAndProperties().add(a);
        } else {
            ConstructorArg a = l.get(4);
            rtn = a.getMap();
        }
        return rtn;
    }

    private void setMappings(List<String> l) {
        Property p = getMappingFilesProperty();

        Collections.sort(l);

        List<Object> l2 = new ArrayList<Object>();
        for (String s2 : l) {
            Value v = new Value();
            List<String> temp = new ArrayList<String>(1);
            temp.add(s2);
            v.setContent(temp);
            l2.add(v);
        }
        p.getList().setRefElement(l2);

        isDirty = true;
    }

    private void writeProps(Properties props) {
        try {
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            DataServiceUtils.writeProperties(props, bos, serviceId);
            fileService.writeFile(propertiesFile, bos.toString());
        } catch (IOException ex) {
            throw new ConfigurationException(ex);
        }
    }

    private void updateSpringConfigIfNecessary(Properties props) {
		if (Boolean.parseBoolean(props.getProperty("executeAs", "false"))) {
			Bean proxyBean;
			List<Bean> dsProxyBeans = beans.getBeansByType(SqlServerUserImpersonatingDataSourceProxy.class);
			if (dsProxyBeans.size() > 0) {
				proxyBean = dsProxyBeans.get(0);
			} else {
				Bean dsBean = beans.getBeanById(serviceId+"DataSource");
				dsBean.setId(serviceId+"TargetDataSource");
				
				proxyBean = new Bean();
				proxyBean.setId(serviceId+"DataSource");
				proxyBean.setClazz(SqlServerUserImpersonatingDataSourceProxy.class.getName());
				proxyBean.setLazyInit(DefaultableBoolean.TRUE);
				Property targetDataSourceProp = new Property();
				targetDataSourceProp.setName("targetDataSource");
				targetDataSourceProp.setRef(serviceId+"TargetDataSource");
				proxyBean.addProperty(targetDataSourceProp);
				beans.addBean(proxyBean);
				isDirty = true;
			}
			String adDomain = props.getProperty("activeDirectoryDomain", "");
			Property adDomainProp = proxyBean.getProperty("activeDirectoryDomain");
			if (adDomainProp == null) {
				adDomainProp = new Property();
				adDomainProp.setName("activeDirectoryDomain");
				adDomainProp.setValue("");
				proxyBean.addProperty(adDomainProp);
			}
			if (!adDomain.equals(adDomainProp.getValue())) {
				adDomainProp.setValue(adDomain);
				isDirty = true;
			}
		} else {
			List<Bean> dsProxyBeans = beans.getBeansByType(SqlServerUserImpersonatingDataSourceProxy.class);
			if (dsProxyBeans.size() > 0) {
				beans.removeBeanById(dsProxyBeans.get(0).getId());
				Bean dsBean = beans.getBeanById(serviceId+"TargetDataSource");
				dsBean.setId(serviceId+"DataSource");
				isDirty=true;
			}
		}
		write();
	}

	private Property getMappingFilesProperty() {
        return getSessionFactoryBean().getProperty(
                DataServiceConstants.SPRING_CFG_MAPPINGS_ATTR);
    }

    private Bean getSessionFactoryBean() {

        List<Bean> sessionFactoryBean = beans
                .getBeansByType(ConfigurationAndSessionFactoryBean.class
                        .getName());

        // package rename
        if (sessionFactoryBean.isEmpty()) {
            sessionFactoryBean = beans
                    .getBeansByType(DataServiceConstants.OLD_SESSION_FACTORY_CLASS_NAME);
        }

        if (sessionFactoryBean.isEmpty()) {
            throw new ConfigurationException(path
                    + ": unable to find SessionFactory class \""
                    + ConfigurationAndSessionFactoryBean.class.getName()
                    + "\"");
        }

        return sessionFactoryBean.get(0);
    }

    private String getConnectionPropertiesFileName() {

        List<Bean> propertyPlaceholders = beans
                .getBeansByType(WMPropertyPlaceholderConfigurer.class.getName());

        // backward compat
        propertyPlaceholders.addAll(beans
                .getBeansByType(PropertyPlaceholderConfigurer.class.getName()));

        String rtn = null;

        // only support single prop file for now
        for (Bean b : propertyPlaceholders) {
            List<String> l = b.getProperty(
                    DataServiceConstants.SPRING_CFG_LOCATIONS_ATTR)
                    .getListValue();
            for (String s : l) {
                rtn = rootPath + "/"
                        + StringUtils.fromFirstOccurrence(s, "classpath:");
            }
        }

        return rtn;
    }

    private Bean getSpringDataServiceManager() {
        List<Bean> l = beans.getBeansByType(SpringDataServiceManager.class
                .getName());
        if (l.isEmpty()) {
            // backward compat
            l = beans
                    .getBeansByType(DataServiceConstants.OLD_SPRING_DATA_SERVICE_MANAGER_NAME);
        }
        if (l.size() != 1) {
            throw new SpringDataServiceManagerNotFound();
        }
        return l.get(0);
    }

    @SuppressWarnings("serial")
    private class SpringDataServiceManagerNotFound extends RuntimeException {
        SpringDataServiceManagerNotFound() {
            super("Could not find SpringDataServiceManager bean");
        }
    }
}

/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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

package com.wavemaker.tools.project.upgrade.six_dot_six_dot_zero_dot_M3;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.bind.JAXBException;

import org.springframework.core.io.ClassPathResource;

import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.security.DatabaseOptions;
import com.wavemaker.tools.security.SecuritySpringSupport;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.spring.beans.Property;
import com.wavemaker.tools.spring.beans.Value;

/**
 * Updates the 'userid' field to 'username' field in 'authoritiesByUsernameQuery'.
 * @author Uday Shankar
 */

public class UpdateUserIdToUsernameForSpringDBSecurity implements UpgradeTask {

	private File secXmlFile = null;

	private String content = null;

	@Override
	/**
	 * Determines previous security provider type.
	 * Sends off to provider specific function for upgrade. 
	 */
	public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
		this.secXmlFile = project.getSecurityXmlFile();
		this.content = secXmlFile.getContent().asString();
		if(!(content.length()>1)){
			throw new ConfigurationException("Problem getting project-security.xml file !!!");
		}
		Beans beans = getSpringSecurityBeans();
        DatabaseOptions databaseOptions = SecuritySpringSupport.constructDatabaseOptions(beans);
        String userNameColumn = databaseOptions.getUnameColumnName();
        String userIdColumn = databaseOptions.getUidColumnName();

        Bean jdbcDaoBean = SecuritySpringSupport.getJdbcDaoBean(beans);
        String authoritiesByUsernameQuery = SecuritySpringSupport.getPropertyValueString(jdbcDaoBean, SecuritySpringSupport.AUTHORITIES_BY_USERNAME_QUERY_PROPERTY);

        String updatedQuery = updateQuery(userNameColumn, userIdColumn, authoritiesByUsernameQuery);
        SecuritySpringSupport.setPropertyValueString(jdbcDaoBean, SecuritySpringSupport.AUTHORITIES_BY_USERNAME_QUERY_PROPERTY, updatedQuery);
        saveSecuritySpringBeans(beans);
    }

    private String updateQuery(String userNameColumn, String userIdColumn, String authoritiesByUsernameQuery) {
        Pattern pattern = Pattern.compile("[\\s]*\\=[\\s]*\\?");
        Matcher matcher = pattern.matcher(authoritiesByUsernameQuery);

        if(matcher.find()) {
            String group = matcher.group();
            int temp = authoritiesByUsernameQuery.indexOf(group);
            int endIndexOfUidColumn = temp;
            while(Character.isLetterOrDigit(authoritiesByUsernameQuery.charAt(--temp))) {
                if(temp<=0) {
                    break;
                }
            }
            int startIndexOfUidColumn = temp+1;
            String originalColumn = authoritiesByUsernameQuery.substring(startIndexOfUidColumn, endIndexOfUidColumn);
            if(originalColumn.equals(userIdColumn)) {
                return authoritiesByUsernameQuery.substring(0, startIndexOfUidColumn) + userNameColumn + authoritiesByUsernameQuery.substring(endIndexOfUidColumn);
            }
        }
        return authoritiesByUsernameQuery;
    }

    private void saveSecuritySpringBeans(Beans beans) {
		try {
			SpringConfigSupport.writeSecurityBeans(beans, secXmlFile);
		} catch (JAXBException e) {
			e.printStackTrace();
			throw new ConfigurationException(e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			throw new ConfigurationException(e.getMessage());
		}
	}

	private Beans getSpringSecurityBeans() {
		Beans beans = null;
		try {
			beans = SpringConfigSupport.readBeans(this.secXmlFile);
		} catch (JAXBException e) {
            throw new ConfigurationException("Problem reading Spring security Beans !!! Cannot understand the xml file");
		}catch (IOException e) {
            throw new ConfigurationException("Problem reading Spring security Beans !!! Cannot read the xml file");
		}
		if(beans == null){
			throw new ConfigurationException("Problem getting Spring security Beans !!!");
		}
		return beans;
	}
}

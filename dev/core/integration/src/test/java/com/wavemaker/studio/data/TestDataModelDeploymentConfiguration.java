/*
 * Copyright (C) 2008 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */
package com.wavemaker.studio.data;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.data.DataModelDeploymentConfiguration;
//import com.wavemaker.tools.data.util.DataServiceTestUtils;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.util.DesignTimeUtils;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
@Ignore
public class TestDataModelDeploymentConfiguration extends StudioTestCase {

    private static final String serviceId = "sakila";

    private DesignServiceManager designMgr = null;

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();
        File root = makeProject("foo");
        populateProject(root, true);
        designMgr = DesignTimeUtils.getDSMForProjectRoot(root);
        //DataServiceTestUtils.setupSakilaConfiguration(new File(root,
        //        DesignServiceManager.getRuntimeRelativeDir(serviceId)));
    }

    @Test public void testConfigureGlobalJndiDataSource() throws Exception {

        String jndiName = "jdbc/sakilads";
        Map<String, String> m = new HashMap<String, String>(1);
        m.put(DataModelDeploymentConfiguration.JNDI_NAME_PROPERTY, jndiName);
        DataModelDeploymentConfiguration cfg = new DataModelDeploymentConfiguration();
        cfg.prepare(serviceId, m, designMgr, 1);

        //DataServiceTestUtils.verifyJNDIDataSource(serviceId, designMgr,
        //        jndiName);
        checkResourceRef(false);
    }

    @Test public void testConfigureAppScopedJndiDataSource() throws Exception {

        String jndiName = "java:comp/env/local/jdbc/sakilads";
        Map<String, String> m = new HashMap<String, String>(1);
        m.put(DataModelDeploymentConfiguration.JNDI_NAME_PROPERTY, jndiName);
        DataModelDeploymentConfiguration cfg = new DataModelDeploymentConfiguration();
        cfg.prepare(serviceId, m, designMgr, 1);

        //DataServiceTestUtils.verifyJNDIDataSource(serviceId, designMgr,
        //        jndiName);

        checkResourceRef(true);
    }

    private void checkResourceRef(boolean shouldExist) throws IOException {
        File webXml = designMgr.getProjectManager().getCurrentProject()
                .getWebXml();
        String s = FileUtils.readFileToString(webXml);

        // simplistic check that only works as long as we only have
        // datasource resource refs
        int i = s.indexOf(DataModelDeploymentConfiguration.RESOURCE_REF);
        if (i == -1 && shouldExist) {
            throw new AssertionError("web.xml should have "
                    + DataModelDeploymentConfiguration.RESOURCE_REF);
        }

        if (i != -1 && !shouldExist) {
            throw new AssertionError("web.xml shouldn't have "
                    + DataModelDeploymentConfiguration.RESOURCE_REF);
        }
    }

}

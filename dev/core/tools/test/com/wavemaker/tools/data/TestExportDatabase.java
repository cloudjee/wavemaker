/*
 *  Copyright (C) 2007-2009 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.tools.data;

import java.io.File;
import java.io.IOException;
import java.util.Properties;

import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.tools.data.util.DataServiceTestUtils;

/**
 * @author stoens
 * @version $Rev$ - $Date$
 * 
 */
public class TestExportDatabase extends WMTestCase {

    public void testExportNewDB() throws IOException {

        SpringUtils.initSpringConfig();

        Properties p = DataServiceTestUtils.loadSakilaConnectionProperties();
            
        ExportDB e = new ExportDB();

        e.addProperties(p);

        String s = "com/wavemaker/tools/data/exporttest/Actor.hbm.xml";

        File f = ClassLoaderUtils.getClasspathFile(s);
        
        assertTrue(f.exists());
        
        e.setHbmFilesDir(f.getParentFile());

        e.setVerbose(false);

        e.setOverrideTable(true);

        e.init();

        e.run();

        int i = e.getDDL().indexOf("create table sakila.actor (");

        assertTrue(i > -1);
    }

}

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

import org.apache.commons.io.FileUtils;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Beans;

/**
 * @author stoens
 * @version $Rev$ - $Date$
 * 
 */
public class TestSpringCfgGenerator extends WMTestCase {

    public void testGenerateSpringConfig() throws Exception {

        File f = IOUtils.createTempDirectory();
        try {
            SpringUtils.initSpringConfig();
            SpringCfgGenerator g = new SpringCfgGenerator();
            g.setDestDir(f);
            g.setClassName("Foo");
            g.setPackage("com.blah");
            g.run();

            File s = new File(f, "foo" + DataServiceConstants.SPRING_CFG_EXT);

            Beans b = SpringConfigSupport.readBeans(FileUtils.readFileToString(s, "UTF-8"));

            assertEquals("beans: " + b.getBeanList(), 10, b.getBeanList().size());
        } finally {
            IOUtils.deleteRecursive(f);
        }
    }

}

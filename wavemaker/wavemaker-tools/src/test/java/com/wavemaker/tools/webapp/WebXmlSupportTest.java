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

package com.wavemaker.tools.webapp;

import java.io.File;

import org.apache.commons.io.FileUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;

import com.wavemaker.infra.WMTestCase;
import com.wavemaker.tools.project.LocalStudioFileSystem;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.webapp.schema.DisplayNameType;
import com.wavemaker.tools.webapp.schema.ServletType;
import com.wavemaker.tools.webapp.schema.WebAppType;

/**
 * @author Matt Small
 */
public class WebXmlSupportTest extends WMTestCase {

    public void testReadWrite() throws Exception {

        File f = new ClassPathResource("com/wavemaker/tools/webapp/" + ProjectConstants.WEB_XML).getFile();
        assertTrue(f.exists());

        WebAppType wat = WebXmlSupport.readWebXml(new FileSystemResource(f));

        for (Object o : wat.getDescriptionAndDisplayNameAndIcon()) {
            if (o instanceof DisplayNameType) {
                DisplayNameType dnt = (DisplayNameType) o;
                assertEquals("ActiveGrid Studio", dnt.getValue());
            } else if (o instanceof ServletType) {
                ServletType st = (ServletType) o;
                assertEquals("springapp", st.getServletName().getValue());
            } else {
                // System.out.println("o: "+o);
            }
        }

        File fp = File.createTempFile("TestWebXmlSupport_testReadWrite", ".xml");
        fp.deleteOnExit();

        try {
            WebXmlSupport.writeWebXml(new Project(new FileSystemResource(fp.getParentFile()), new LocalStudioFileSystem()), wat,
                new FileSystemResource(fp));
            String fpContents = FileUtils.readFileToString(fp);

            assertTrue(fpContents.contains("ActiveGrid Studio"));
            assertTrue(fpContents.contains("springapp"));

            WebXmlSupport.readWebXml(new FileSystemResource(fp));
        } finally {
            fp.delete();
        }
    }
}

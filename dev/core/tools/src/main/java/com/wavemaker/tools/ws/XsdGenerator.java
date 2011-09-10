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

package com.wavemaker.tools.ws;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.xmlbeans.XmlException;
import org.apache.xmlbeans.XmlObject;
import org.apache.xmlbeans.XmlOptions;
import org.apache.xmlbeans.impl.inst2xsd.Inst2Xsd;
import org.apache.xmlbeans.impl.inst2xsd.Inst2XsdOptions;
import org.apache.xmlbeans.impl.xb.xsdschema.SchemaDocument;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.runtime.ws.util.Constants;

/**
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class XsdGenerator {

    public static List<String> generate(String xml) throws IOException, XmlException {
        File tempDir = IOUtils.createTempDirectory();
        try {
            File xmlFile = new File(tempDir, "instance.xml");
            org.apache.commons.io.FileUtils.writeStringToFile(xmlFile, xml,
                    ServerConstants.DEFAULT_ENCODING);

            List<File> schemaFiles = generate(xmlFile, tempDir);
            List<String> schemas = new ArrayList<String>();
            for (File schemaFile : schemaFiles) {
                schemas.add(FileUtils.readFileToString(schemaFile,
                        ServerConstants.DEFAULT_ENCODING));
            }
            return schemas;
        } finally {
            IOUtils.deleteRecursive(tempDir);
        }
    }

    public static List<File> generate(File xmlFile, File outputDir)
            throws IOException, XmlException {

        Inst2XsdOptions inst2XsdOptions = new Inst2XsdOptions();
        inst2XsdOptions.setSimpleContentTypes(
                Inst2XsdOptions.SIMPLE_CONTENT_TYPES_STRING);
        inst2XsdOptions.setUseEnumerations(Inst2XsdOptions.ENUMERATION_NEVER);

        XmlObject[] xmlInstances = new XmlObject[1];
        xmlInstances[0] = XmlObject.Factory.parse(xmlFile);

        SchemaDocument[] schemaDocs = Inst2Xsd.inst2xsd(xmlInstances,
                inst2XsdOptions);
        List<File> schemaFiles = new ArrayList<File>();
        for (int i = 0; i < schemaDocs.length; i++) {
            SchemaDocument schema = schemaDocs[i];
            File schemaFile = new File(outputDir, "schema" + i + Constants.XSD_EXT);
            schema.save(schemaFile, new XmlOptions().setSavePrettyPrint());
            schemaFiles.add(schemaFile);
        }
        return schemaFiles;
    }
}

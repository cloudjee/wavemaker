/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
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
package com.wavemaker.tools.data.parser;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

import com.wavemaker.common.util.XMLUtils;
import com.wavemaker.common.util.XMLWriter;
import com.wavemaker.tools.common.ConfigurationException;

/**
 * @author Simon Toens
 * @version $Rev:22685 $ - $Date:2008-05-30 16:19:36 -0700 (Fri, 30 May 2008) $
 *
 */
public abstract class BaseHbmWriter {
    
    protected XMLWriter xmlWriter = null;
    
    public BaseHbmWriter(File f) {
        try {
            xmlWriter = XMLUtils.newXMLWriter(
                new PrintWriter(new BufferedWriter(new FileWriter(f))));
        } catch (IOException ex) {
            throw new ConfigurationException(ex);
        }
        init();
    }

    public BaseHbmWriter(PrintWriter pw) {
        xmlWriter = XMLUtils.newXMLWriter(pw);
        init();
    }
    
    private void init() {
        xmlWriter.addDoctype(HbmConstants.MAPPING_EL,
                             HbmConstants.HBM_PUBLIC_ID, 
                             HbmConstants.HBM_SYSTEM_ID);
    }
    
    public void write() {
        xmlWriter.addElement(HbmConstants.MAPPING_EL);
        writeCustom();
        xmlWriter.finish();
    }
    
    protected abstract void writeCustom();
}

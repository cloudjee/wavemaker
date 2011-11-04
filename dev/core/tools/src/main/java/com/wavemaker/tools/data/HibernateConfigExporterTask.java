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

import java.io.FileWriter;
import java.io.IOException;

import org.apache.tools.ant.BuildException;
import org.hibernate.tool.ant.Hbm2CfgXmlExporterTask;
import org.hibernate.tool.ant.HibernateToolTask;
import org.hibernate.tool.hbm2x.Exporter;

/**
 * @author Simon Toens
 */
public class HibernateConfigExporterTask extends Hbm2CfgXmlExporterTask {

    private String configurationFile = null;

    public HibernateConfigExporterTask(HibernateToolTask parent) {
        super(parent);
    }

    public void setConfigurationFile(String configurationFile) {
        this.configurationFile = configurationFile;
    }

    @Override
    public String getName() {
        String s = "hbm2cfgxml (Generates ";
        if (this.configurationFile == null) {
            s += "hibernate.cfg.xml)";
        } else {
            s += this.configurationFile + ")";
        }
        return s;
    }

    @Override
    public Exporter createExporter() {
        WMHibernateConfigurationExporter rtn = new WMHibernateConfigurationExporter();
        if (this.configurationFile != null) {
            try {
                rtn.setOutput(new FileWriter(this.configurationFile));
            } catch (IOException ex) {
                throw new BuildException(ex);
            }
        }
        return rtn;
    }

}

/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

import org.hibernate.tool.ant.GenericExporterTask;
import org.hibernate.tool.ant.HibernateToolTask;
import org.hibernate.tool.hbm2x.Exporter;
import org.springframework.core.io.Resource;
import com.wavemaker.tools.io.Folder;

/**
 * @author Simon Toens
 */
public class QueryExporterTask extends GenericExporterTask {

    private final String serviceName;
    private Folder destDir;

    public QueryExporterTask(HibernateToolTask parent, String serviceName, Folder destDir) {
        super(parent);
        this.serviceName = serviceName;
        this.destDir = destDir;
    }

    @Override
    public Exporter createExporter() {
        return new QueryExporter(this.serviceName);
    }

    @Override
    protected Exporter configureExporter(Exporter exp) {
        super.setFilePattern(null);
        super.setForEach(null);
        super.setTemplate(null);
        return super.configureExporter(exp);
    }

    @Override
    public String getName() {
        return "ag-queryexportertask (Generates a set of ql.xml files)";
    }

    public HibernateToolTask getParent() {
        return super.parent;
    }

    public void setDestDir(Folder destDir) {
        this.destDir = destDir;
    }

    public Folder getDestDir() {
        return this.destDir;
    }
}

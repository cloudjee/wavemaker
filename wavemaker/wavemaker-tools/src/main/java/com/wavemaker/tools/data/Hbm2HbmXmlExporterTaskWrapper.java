package com.wavemaker.tools.data;

import org.hibernate.tool.ant.HibernateToolTask;
import org.hibernate.tool.ant.Hbm2HbmXmlExporterTask;
import org.springframework.core.io.Resource;

public class Hbm2HbmXmlExporterTaskWrapper extends Hbm2HbmXmlExporterTask {
    private Resource destDir;
    
    public Hbm2HbmXmlExporterTaskWrapper(HibernateToolTask parent, Resource destDir) {
        super(parent);
        this.destDir = destDir;
    }

    public HibernateToolTask getParent() {
        return super.parent;
    }

    public void setDestDir(Resource destDir) {
        this.destDir = destDir;
    }

    public Resource getDestDir() {
        return this.destDir;
    }
}
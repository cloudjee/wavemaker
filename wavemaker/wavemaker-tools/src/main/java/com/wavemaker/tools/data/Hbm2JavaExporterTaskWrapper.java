package com.wavemaker.tools.data;

import org.hibernate.tool.ant.HibernateToolTask;
import org.hibernate.tool.ant.Hbm2JavaExporterTask;
import org.springframework.core.io.Resource;

public class Hbm2JavaExporterTaskWrapper extends Hbm2JavaExporterTask {
    private Resource destDir;
    
    public Hbm2JavaExporterTaskWrapper(HibernateToolTask parent, Resource destDir) {
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
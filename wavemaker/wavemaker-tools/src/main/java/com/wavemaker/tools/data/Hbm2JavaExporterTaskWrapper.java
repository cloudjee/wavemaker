package com.wavemaker.tools.data;

import org.hibernate.tool.ant.HibernateToolTask;
import org.hibernate.tool.ant.Hbm2JavaExporterTask;

public class Hbm2JavaExporterTaskWrapper extends Hbm2JavaExporterTask {
    public Hbm2JavaExporterTaskWrapper(HibernateToolTask parent) {
        super(parent);
    }

    public HibernateToolTask getParent() {
        return super.parent;
    }
}
package com.wavemaker.tools.data;

import org.hibernate.tool.ant.HibernateToolTask;
import org.hibernate.tool.ant.Hbm2HbmXmlExporterTask;

public class Hbm2HbmXmlExporterTaskWrapper extends Hbm2HbmXmlExporterTask {
    public Hbm2HbmXmlExporterTaskWrapper(HibernateToolTask parent) {
        super(parent);
    }

    public HibernateToolTask getParent() {
        return super.parent;
    }
}
package com.wavemaker.tools.data;

import org.hibernate.tool.ant.HibernateToolTask;
import org.hibernate.tool.ant.ExporterTask;
import org.hibernate.tool.ant.Hbm2JavaExporterTask;
import org.hibernate.tool.ant.Hbm2HbmXmlExporterTask;

public class LocalExporterFactory implements ExporterFactory {
    public ExporterTask getExporter(String type, HibernateToolTask parent, String serviceName) {

        ExporterTask task = null;
        if (type.equals("config")) {
            task = new HibernateConfigExporterTask(parent);
        } else if (type.equals("java")) {
            task = new Hbm2JavaExporterTask(parent);
        } else if (type.equals("query")) {
            task = new QueryExporterTask(parent, serviceName);
        } else if (type.equals("mapping")) {
            task = new Hbm2HbmXmlExporterTask(parent);
        }
        return task;
    }
}
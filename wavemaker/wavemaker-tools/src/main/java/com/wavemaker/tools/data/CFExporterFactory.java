package com.wavemaker.tools.data;

import org.hibernate.tool.ant.HibernateToolTask;
import org.hibernate.tool.ant.ExporterTask;
import net.sf.cglib.proxy.Enhancer;

public class CFExporterFactory implements ExporterFactory {
    public ExporterTask getExporter(String type, HibernateToolTask parent, String serviceName) {
        Enhancer enhancer = new Enhancer();
        enhancer.setCallbackType(ExporterTaskInterceptor.class);
        enhancer.setCallback(new ExporterTaskInterceptor());

        ExporterTask proxy = null;
        if (type.equals("config")) {
            enhancer.setSuperclass(HibernateConfigExporterTask.class);
            enhancer.setClassLoader(HibernateConfigExporterTask.class.getClassLoader());
            proxy = (HibernateConfigExporterTask)enhancer.create(new Class[] {HibernateToolTask.class},
                        new Object[] {parent}) ;
        } else if (type.equals("java")) {
            enhancer.setSuperclass(Hbm2JavaExporterTaskWrapper.class);
            enhancer.setClassLoader(Hbm2JavaExporterTaskWrapper.class.getClassLoader());
            proxy = (Hbm2JavaExporterTaskWrapper)enhancer.create(new Class[] {HibernateToolTask.class},
                        new Object[] {parent}) ;
        } else if (type.equals("query")) {
            enhancer.setSuperclass(QueryExporterTask.class);
            enhancer.setClassLoader(QueryExporterTask.class.getClassLoader());
            proxy = (QueryExporterTask)enhancer.create(new Class[] {HibernateToolTask.class, String.class},
                        new Object[] {parent, serviceName}) ;
        } else if (type.equals("mapping")) {
            enhancer.setSuperclass(Hbm2HbmXmlExporterTaskWrapper.class);
            enhancer.setClassLoader(Hbm2HbmXmlExporterTaskWrapper.class.getClassLoader());
            proxy = (Hbm2HbmXmlExporterTaskWrapper)enhancer.create(new Class[] {HibernateToolTask.class},
                        new Object[] {parent}) ;
        }
        return proxy;
    }
}
package com.wavemaker.tools.data;

import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;
import java.io.File;

import org.hibernate.tool.ant.HibernateToolTask;
import org.hibernate.tool.ant.ExporterTask;
import org.apache.commons.io.FileUtils;
import com.wavemaker.common.util.IOUtils;

public class ExporterTaskInterceptor implements MethodInterceptor {
    public Object intercept(Object object, Method method, Object[] args,
                            MethodProxy methodProxy) throws Throwable {

        HibernateToolTask parent = null;

        if (!method.getName().equals("execute")) {
            return methodProxy.invokeSuper(object, args);
        }

        if (object instanceof HibernateConfigExporterTask) {
            HibernateConfigExporterTask task = (HibernateConfigExporterTask)object;
            parent = task.getParent();
        } else if (object instanceof Hbm2JavaExporterTaskWrapper) {
            Hbm2JavaExporterTaskWrapper task = (Hbm2JavaExporterTaskWrapper)object;
            parent = task.getParent();
        } else if (object instanceof QueryExporterTask) {
            QueryExporterTask task = (QueryExporterTask)object;
            parent = task.getParent();
        } else if (object instanceof Hbm2HbmXmlExporterTaskWrapper) {
            Hbm2HbmXmlExporterTaskWrapper task = (Hbm2HbmXmlExporterTaskWrapper)object;
            parent = task.getParent();
        }

        File origDestDir = new File(parent.getDestDir().getAbsolutePath());

        File tempDestDir = IOUtils.createTempDirectory();
        parent.setDestDir(tempDestDir);

        Object rtn = methodProxy.invokeSuper(object, args);

        FileUtils.copyDirectory(tempDestDir, origDestDir);
        parent.setDestDir(origDestDir);

        return rtn;
    }
}
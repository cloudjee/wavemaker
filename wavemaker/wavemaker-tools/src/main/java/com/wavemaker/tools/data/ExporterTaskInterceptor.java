package com.wavemaker.tools.data;

import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;
import java.io.File;

import org.hibernate.tool.ant.HibernateToolTask;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.tools.project.StudioFileSystem;
import com.wavemaker.runtime.RuntimeAccess;


public class ExporterTaskInterceptor implements MethodInterceptor {

    private StudioFileSystem fileSystem;

    public ExporterTaskInterceptor() {
        fileSystem = (StudioFileSystem)RuntimeAccess.getInstance().getSpringBean("fileSystem");
    }

    public Object intercept(Object object, Method method, Object[] args,
                            MethodProxy methodProxy) throws Throwable {

        HibernateToolTask parent = null;
        Resource destDir = null;

        if (!method.getName().equals("execute")) {
            return methodProxy.invokeSuper(object, args);
        }

        if (object instanceof HibernateConfigExporterTask) {
            HibernateConfigExporterTask task = (HibernateConfigExporterTask)object;
            parent = task.getParent();
            destDir = task.getDestDir();
        } else if (object instanceof Hbm2JavaExporterTaskWrapper) {
            Hbm2JavaExporterTaskWrapper task = (Hbm2JavaExporterTaskWrapper)object;
            parent = task.getParent();
            destDir = task.getDestDir();
        } else if (object instanceof QueryExporterTask) {
            QueryExporterTask task = (QueryExporterTask)object;
            parent = task.getParent();
            destDir = task.getDestDir();
        } else if (object instanceof Hbm2HbmXmlExporterTaskWrapper) {
            Hbm2HbmXmlExporterTaskWrapper task = (Hbm2HbmXmlExporterTaskWrapper)object;
            parent = task.getParent();
            destDir = task.getDestDir();
        } else if (object instanceof HibernateSpringConfigExporterTask) {
            HibernateSpringConfigExporterTask task = (HibernateSpringConfigExporterTask)object;
            parent = task.getParent();
            destDir = task.getDestDir();
        }

        //File origDestDir = new File(parent.getDestDir().getAbsolutePath());

        File tempDestDir = IOUtils.createTempDirectory("dataService_directory", null);
        parent.setDestDir(tempDestDir);

        Object rtn = methodProxy.invokeSuper(object, args);

        fileSystem.copyRecursive(tempDestDir, destDir, null);

        return rtn;
    }
}
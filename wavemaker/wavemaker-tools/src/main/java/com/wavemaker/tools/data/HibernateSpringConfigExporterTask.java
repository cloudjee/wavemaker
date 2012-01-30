package com.wavemaker.tools.data;

import org.hibernate.tool.ant.HibernateToolTask;
import org.hibernate.tool.ant.Hbm2HbmXmlExporterTask;
import org.hibernate.tool.ant.GenericExporterTask;
import org.hibernate.tool.hbm2x.Exporter;
import org.springframework.core.io.Resource;

public class HibernateSpringConfigExporterTask extends GenericExporterTask {
    private Resource destDir;
    private String serviceName;
    private String packageName;
    private String dataPackage;
    private String className;
    private boolean useIndividualCRUDOperations;
    private boolean impersonateUser;
    private String activeDirectoryDomain;
    
    public HibernateSpringConfigExporterTask(HibernateToolTask parent, Resource destDir, String serviceName,
                         String packageName, String dataPackage, String className, boolean useIndividualCRUDOperations,
                         boolean impersonateUser, String activeDirectoryDomain) {
        super(parent);
        this.destDir = destDir;
        this.serviceName = serviceName;
        this.packageName = packageName;
        this.dataPackage = dataPackage;
        this.className = className;
        this.useIndividualCRUDOperations = useIndividualCRUDOperations;
        this.impersonateUser = impersonateUser;
        this.activeDirectoryDomain = activeDirectoryDomain;
    }

    @Override
    public Exporter createExporter() {
        return new HibernateSpringConfigExporter(this.serviceName, this.packageName,
            this.dataPackage, this.className, useIndividualCRUDOperations,
            this.impersonateUser, this.activeDirectoryDomain);
    }

    public Resource getDestDir() {
        return this.destDir;
    }

    public HibernateToolTask getParent() {
        return super.parent;
    }
}
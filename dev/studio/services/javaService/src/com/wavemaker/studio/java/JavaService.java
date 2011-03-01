/*
 * Copyright (C) 2007-2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 
package com.wavemaker.studio.java;

import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.apache.commons.io.FileUtils;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.tools.javaservice.JavaServiceDefinition;
import com.wavemaker.tools.project.BuildExceptionWithOutput;
import com.wavemaker.tools.project.DeploymentManager;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.DataObject;
import com.wavemaker.tools.service.definitions.Service;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
@HideFromClient
public class JavaService {

    @ExposeToClient
    public String newClass(String serviceId, String fqClassName)
            throws IOException, ClassNotFoundException, LinkageError {

        designServiceManager.validateServiceId(serviceId);

        String packageName = JavaServiceDefinition.getPackage(fqClassName);
        String className = JavaServiceDefinition.getClass(fqClassName);

        File classFile = new File(designServiceManager
                .getServiceRuntimeDirectory(serviceId), JavaServiceDefinition
                .getRelPathFromClass(fqClassName));
        FileUtils.forceMkdir(classFile.getParentFile());

        Writer classFileWriter = getProjectManager().getCurrentProject()
                .getWriter(classFile);
        BufferedWriter bw = new BufferedWriter(classFileWriter);

        if (null != packageName) {
            bw.write("package " + packageName + ";");
            bw.newLine();
            bw.newLine();
        }

        bw.write("/**");
        bw.newLine();
        bw.write(" * This is a client-facing service class.  All");
        bw.newLine();
        bw
                .write(" * public methods will be exposed to the client.  Their return");
        bw.newLine();
        bw
                .write(" * values and parameters will be passed to the client or taken");
        bw.newLine();
        bw.write(" * from the client, respectively.  This will be a singleton");
        bw.newLine();
        bw.write(" * instance, shared between all requests. ");
        bw.newLine();
        bw.write(" * ");
        bw.newLine();
        bw.write(" * To log, call the superclass method log(LOG_LEVEL, String) or log(LOG_LEVEL, String, Exception).");
	bw.newLine();
	bw.write(" * LOG_LEVEL is one of FATAL, ERROR, WARN, INFO and DEBUG to modify your log level.");
	bw.newLine();
        bw.write(" * For info on these levels, look for tomcat/log4j documentation");
	bw.newLine();
        bw.write(" */");
        bw.newLine();
        bw.write("public class " + className + " extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {");
        bw.newLine();
	bw.write("    /* Pass in one of FATAL, ERROR, WARN,  INFO and DEBUG to modify your log level;");
        bw.newLine();
	bw.write("     *  recommend changing this to FATAL or ERROR before deploying.  For info on these levels, look for tomcat/log4j documentation");
        bw.newLine();
	bw.write("     */");
        bw.newLine();
	bw.write("    public " + className + "() {");
        bw.newLine();
	bw.write("       super(INFO);");
        bw.newLine();
        bw.write("    }");
        bw.newLine();
        bw.newLine();
	bw.write("    public String sampleJavaOperation() {");
        bw.newLine();
	bw.write("       String result  = null;");
        bw.newLine();
	bw.write("       try {");
        bw.newLine();
	bw.write("          log(INFO, \"Starting sample operation\");");
        bw.newLine();
	bw.write("          result = \"Hello World\";");
        bw.newLine();
	bw.write("          log(INFO, \"Returning \" + result);");
        bw.newLine();
	bw.write("       } catch(Exception e) {");
        bw.newLine();
	bw.write("          log(ERROR, \"The sample java service operation has failed\", e);");
        bw.newLine();
        bw.write("       }");
        bw.newLine();
	bw.write("       return result;");
        bw.newLine();
        bw.write("    }");
        bw.newLine();
        bw.newLine();
        bw.write("}");
        bw.newLine();
        bw.close();

        deploymentManager.build();
        doServiceDefine(serviceId, fqClassName);

        return FileUtils.readFileToString(classFile);
    }

    /**
     * Saves &amp; compiles the class. Returns the output of the compile.
     */
    @ExposeToClient
    public CompileOutput saveClass(String serviceId, String contents)
            throws IOException, ClassNotFoundException, LinkageError {

        if (!designServiceManager.getServiceIds().contains(serviceId)) {
            throw new WMRuntimeException(Resource.STUDIO_UNKNOWN_SERVICE,
                    serviceId);
        }

        Service service = designServiceManager.getService(serviceId);
        String klass = service.getClazz();

        File classFile = new File(designServiceManager
                .getServiceRuntimeDirectory(serviceId), JavaServiceDefinition
                .getRelPathFromClass(klass));
        if (!classFile.getParentFile().exists()) {
            FileUtils.forceMkdir(classFile.getParentFile());
        }
        FileUtils.writeStringToFile(classFile, contents, getProjectManager()
                .getCurrentProject().getEncoding());

        CompileOutput ret = new CompileOutput();
        try {
            String compileOutput = deploymentManager.build();
            ret.setBuildSucceeded(true);
            ret.setCompileOutput(compileOutput);
        } catch (BuildExceptionWithOutput e) {
            ret.setBuildSucceeded(false);
            ret.setCompileOutput(e.getCompilerOutput());

            // we need to break out early; trying to do the servicedef stuff
            // will (at best) give bad results, and (at worst) totally fail
            return ret;
        }

        doServiceDefine(serviceId, klass);

        return ret;
    }

    @ExposeToClient
    public String openClass(String serviceId) throws IOException {

        Service service = designServiceManager.getService(serviceId);
        String klass = service.getClazz();

        File classFile = new File(designServiceManager
                .getServiceRuntimeDirectory(serviceId), JavaServiceDefinition
                .getRelPathFromClass(klass));
        return FileUtils.readFileToString(classFile,
                getProjectManager().getCurrentProject().getEncoding());
    }

    /**
     * Get the service definition (JavaServiceDefinition). You must have
     * compiled before calling this method.
     */
    protected ServiceDefinition getServiceDefinition(String serviceId,
            String className) throws ClassNotFoundException, LinkageError {

        File buildDir = projectManager.getCurrentProject().getWebInfClasses();

        // assemble a list of types to be excluded
        List<String> excludeTypeNames = new ArrayList<String>();
        Collection<String> serviceIds = designServiceManager.getServiceIds();
        for (String id : serviceIds) {
            if (serviceId.equals(id)) {
                // ignore this services' types
            } else {
                List<DataObject> dos = designServiceManager
                        .getLocalDataObjects(id);
                for (DataObject d : dos) {
                    excludeTypeNames.add(d.getJavaType());
                }
            }
        }

        ServiceDefinition serviceDef = new JavaServiceDefinition(className,
                serviceId, buildDir,
                projectManager.getCurrentProject().getWebInfLib(),
                excludeTypeNames);

        return serviceDef;
    }

    /**
     * Java services need to all be refreshed when any one Java service has
     * changed, in case they've greedily grabbed each other's classes. So, let's
     * step through and do that after we've defined this service.
     * 
     * @param serviceId
     *                The serviceId of the service currently being defined.
     * @param sd
     *                The class name of the service currently being defined.
     * @throws LinkageError
     * @throws ClassNotFoundException
     */
    protected void doServiceDefine(String serviceId, String className)
            throws ClassNotFoundException, LinkageError {

        ServiceDefinition sd = getServiceDefinition(serviceId, className);
        designServiceManager.defineService(sd);

        // for (Service service:
        // designServiceManager.getServicesByType(ServiceType.JAVA_SERVICE)) {
        // sd = getServiceDefinition(service.getId(), service.getClazz());
        // designServiceManager.defineService(sd);
        // }
    }

    // spring bean attrs
    private DesignServiceManager designServiceManager;

    private DeploymentManager deploymentManager;

    private ProjectManager projectManager;

    public DesignServiceManager getDesignServiceManager() {
        return designServiceManager;
    }

    public void setDesignServiceManager(
            DesignServiceManager designServiceManager) {
        this.designServiceManager = designServiceManager;
    }

    public DeploymentManager getDeploymentManager() {
        return deploymentManager;
    }

    public void setDeploymentManager(DeploymentManager deploymentManager) {
        this.deploymentManager = deploymentManager;
    }

    public ProjectManager getProjectManager() {
        return projectManager;
    }

    public void setProjectManager(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }

    /**
     * Class containing compiler output, for the client to parse.
     */
    public static class CompileOutput {

        private boolean buildSucceeded;

        private String compileOutput;

        public CompileOutput() {
        }

        public CompileOutput(boolean buildSucceeded, String compileOutput) {

            this();
            this.buildSucceeded = buildSucceeded;
            this.compileOutput = compileOutput;
        }

        public boolean isBuildSucceeded() {
            return buildSucceeded;
        }

        public void setBuildSucceeded(boolean buildSucceeded) {
            this.buildSucceeded = buildSucceeded;
        }

        public String getCompileOutput() {
            return compileOutput;
        }

        public void setCompileOutput(String compileOutput) {
            this.compileOutput = compileOutput;
        }
    }
}
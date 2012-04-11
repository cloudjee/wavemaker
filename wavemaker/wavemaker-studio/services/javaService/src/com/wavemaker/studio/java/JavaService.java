/*
 * Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.studio.java;

import java.io.BufferedWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.core.io.Resource;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.javaservice.JavaServiceDefinition;
import com.wavemaker.tools.project.DeploymentManager;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.DataObject;
import com.wavemaker.tools.service.definitions.Service;

/**
 * @author Matt Small
 * @author Jeremy Grelle
 */
@HideFromClient
public class JavaService {

    @ExposeToClient
    public String newClass(String serviceId, String fqClassName) throws IOException, ClassNotFoundException, LinkageError {

        this.designServiceManager.validateServiceId(serviceId);

        String sourceFilename = JavaServiceDefinition.getRelPathFromClass(fqClassName);
        String packageName = JavaServiceDefinition.getPackage(fqClassName);
        String className = JavaServiceDefinition.getClass(fqClassName);

        File sourceFile = this.designServiceManager.getServiceRuntimeFolder(serviceId).getFile(sourceFilename);

        BufferedWriter writer = new BufferedWriter(sourceFile.getContent().asWriter());
        try {
            if (packageName != null) {
                writer.write("package " + packageName + ";");
                writer.newLine();
                writer.newLine();
            }
            writer.write("import com.wavemaker.runtime.javaservice.JavaServiceSuperClass;");
            writer.newLine();
            writer.write("import com.wavemaker.runtime.service.annotations.ExposeToClient;");
            writer.newLine();
            writer.newLine();
            writer.write("/**");
            writer.newLine();
            writer.write(" * This is a client-facing service class.  All");
            writer.newLine();
            writer.write(" * public methods will be exposed to the client.  Their return");
            writer.newLine();
            writer.write(" * values and parameters will be passed to the client or taken");
            writer.newLine();
            writer.write(" * from the client, respectively.  This will be a singleton");
            writer.newLine();
            writer.write(" * instance, shared between all requests. ");
            writer.newLine();
            writer.write(" * ");
            writer.newLine();
            writer.write(" * To log, call the superclass method log(LOG_LEVEL, String) or log(LOG_LEVEL, String, Exception).");
            writer.newLine();
            writer.write(" * LOG_LEVEL is one of FATAL, ERROR, WARN, INFO and DEBUG to modify your log level.");
            writer.newLine();
            writer.write(" * For info on these levels, look for tomcat/log4j documentation");
            writer.newLine();
            writer.write(" */");
            writer.newLine();
            writer.write("@ExposeToClient");
            writer.newLine();
            writer.write("public class " + className + " extends JavaServiceSuperClass {");
            writer.newLine();
            writer.write("    /* Pass in one of FATAL, ERROR, WARN,  INFO and DEBUG to modify your log level;");
            writer.newLine();
            writer.write("     *  recommend changing this to FATAL or ERROR before deploying.  For info on these levels, look for tomcat/log4j documentation");
            writer.newLine();
            writer.write("     */");
            writer.newLine();
            writer.write("    public " + className + "() {");
            writer.newLine();
            writer.write("       super(INFO);");
            writer.newLine();
            writer.write("    }");
            writer.newLine();
            writer.newLine();
            writer.write("    public String sampleJavaOperation() {");
            writer.newLine();
            writer.write("       String result  = null;");
            writer.newLine();
            writer.write("       try {");
            writer.newLine();
            writer.write("          log(INFO, \"Starting sample operation\");");
            writer.newLine();
            writer.write("          result = \"Hello World\";");
            writer.newLine();
            writer.write("          log(INFO, \"Returning \" + result);");
            writer.newLine();
            writer.write("       } catch(Exception e) {");
            writer.newLine();
            writer.write("          log(ERROR, \"The sample java service operation has failed\", e);");
            writer.newLine();
            writer.write("       }");
            writer.newLine();
            writer.write("       return result;");
            writer.newLine();
            writer.write("    }");
            writer.newLine();
            writer.newLine();
            writer.write("}");
            writer.newLine();
        } finally {
            writer.close();
        }
        this.deploymentManager.compile();
        return sourceFile.getContent().asString();
    }

    /**
     * Saves &amp; compiles the class. Returns the output of the compile.
     */
    @ExposeToClient
    public CompileOutput saveClass(String serviceId, String contents) throws IOException, ClassNotFoundException, LinkageError {

        if (!this.designServiceManager.getServiceIds().contains(serviceId)) {
            throw new WMRuntimeException(MessageResource.STUDIO_UNKNOWN_SERVICE, serviceId);
        }

        Service service = this.designServiceManager.getService(serviceId);
        String klass = service.getClazz();

        Resource classFile = this.designServiceManager.getServiceRuntimeDirectory(serviceId).createRelative(
            JavaServiceDefinition.getRelPathFromClass(klass));

        getProjectManager().getCurrentProject().writeFile(classFile, contents);

        CompileOutput ret = new CompileOutput();
        try {
            String compileOutput = this.deploymentManager.compile();
            ret.setBuildSucceeded(true);
            ret.setCompileOutput(compileOutput);
        } catch (Throwable e) {
            ret.setBuildSucceeded(false);
            ret.setCompileOutput(e.getMessage());
        }
        return ret;
    }

    @ExposeToClient
    public String openClass(String serviceId) throws IOException {

        Service service = this.designServiceManager.getService(serviceId);
        String klass = service.getClazz();

        Resource classFile = this.designServiceManager.getServiceRuntimeDirectory(serviceId).createRelative(
            JavaServiceDefinition.getRelPathFromClass(klass));
        return getProjectManager().getCurrentProject().readFile(classFile);
    }

    /**
     * Get the service definition (JavaServiceDefinition). You must have compiled before calling this method.
     * 
     * @throws IOException
     */
    protected ServiceDefinition getServiceDefinition(String serviceId, String className) throws ClassNotFoundException, LinkageError, IOException {

        Resource buildDir = this.projectManager.getCurrentProject().getWebInfClasses();

        // assemble a list of types to be excluded
        List<String> excludeTypeNames = new ArrayList<String>();
        Collection<String> serviceIds = this.designServiceManager.getServiceIds();
        for (String id : serviceIds) {
            if (serviceId.equals(id)) {
                // ignore this services' types
            } else {
                List<DataObject> dos = this.designServiceManager.getLocalDataObjects(id);
                for (DataObject d : dos) {
                    excludeTypeNames.add(d.getJavaType());
                }
            }
        }

        ServiceDefinition serviceDef = new JavaServiceDefinition(className, serviceId, buildDir,
            this.projectManager.getCurrentProject().getWebInfLib(), excludeTypeNames);

        return serviceDef;
    }

    // spring bean attrs
    private DesignServiceManager designServiceManager;

    private DeploymentManager deploymentManager;

    private ProjectManager projectManager;

    public DesignServiceManager getDesignServiceManager() {
        return this.designServiceManager;
    }

    public void setDesignServiceManager(DesignServiceManager designServiceManager) {
        this.designServiceManager = designServiceManager;
    }

    public DeploymentManager getDeploymentManager() {
        return this.deploymentManager;
    }

    public void setDeploymentManager(DeploymentManager deploymentManager) {
        this.deploymentManager = deploymentManager;
    }

    public ProjectManager getProjectManager() {
        return this.projectManager;
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
            return this.buildSucceeded;
        }

        public void setBuildSucceeded(boolean buildSucceeded) {
            this.buildSucceeded = buildSucceeded;
        }

        public String getCompileOutput() {
            return this.compileOutput;
        }

        public void setCompileOutput(String compileOutput) {
            this.compileOutput = compileOutput;
        }
    }
}
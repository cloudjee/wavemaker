/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.service;

import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.SortedMap;
import java.util.SortedSet;
import java.util.TreeMap;
import java.util.TreeSet;

import javax.xml.bind.JAXBException;

import org.springframework.core.io.Resource;

import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSONMarshaller;
import com.wavemaker.json.JSONState;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.runtime.service.TypeManager;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.service.definitions.DataObject;
import com.wavemaker.tools.service.definitions.DataObject.Element;
import com.wavemaker.tools.service.definitions.DataObjects;
import com.wavemaker.tools.service.definitions.Operation;
import com.wavemaker.tools.service.definitions.Operation.Parameter;
import com.wavemaker.tools.service.definitions.OperationComparator;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.service.smd.Method;
import com.wavemaker.tools.service.smd.Param;
import com.wavemaker.tools.service.smd.SMD;
import com.wavemaker.tools.service.types.ComplexType;
import com.wavemaker.tools.service.types.Field;
import com.wavemaker.tools.service.types.PrimitiveType;
import com.wavemaker.tools.service.types.TypeValueTransformer;
import com.wavemaker.tools.service.types.Types;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.spring.beans.DefaultableBoolean;
import com.wavemaker.tools.spring.beans.Entry;
import com.wavemaker.tools.spring.beans.Property;
import com.wavemaker.tools.spring.beans.Value;
import com.wavemaker.tools.ws.salesforce.SalesforceHelper;

/**
 * Responsible for generating the runtime configuration files.
 * 
 * @author Matt Small
 */
public class ConfigurationCompiler {

    private ConfigurationCompiler() {
    }

    public static final String SERVICE_MANAGER_BEAN_ID = "serviceManager";

    public static final String SERVICE_SMD_EXTENSION = "smd";

    public static final String EVENT_MANAGER_BEAN_ID = "eventManager";

    public static final String TYPE_MANAGER_BEAN_ID = "typeManager";

    public static final String TYPE_MANAGER_PARENT = "typeManagerBase";

    public static final String TYPE_MANAGER_TYPES = "types";

    public static final String TYPE_RUNTIME_FILE = "types.js";

    /**
     * Runtime services directory.
     */
    public static final String RUNTIME_SERVICES_DIR = "services/";

    /**
     * Services spring xml configuration.
     */
    public static final String RUNTIME_SERVICES = "project-services.xml";

    /**
     * Managers spring xml configuration.
     */
    public static final String RUNTIME_MANAGERS = "project-managers.xml";

    public static final String SINGLETON = "singleton";

    public static final String WM_TYPES_PREPEND = "wm.types = ";

    public static final String WM_TYPES_APPEND = ";";

    /**
     * Converts a type name to an array type name (suitable to send through an SMD).
     * 
     * @param type
     * @return
     */
    public static String typeToArrayType(String type) {
        return "[" + type + "]";
    }

    /**
     * Get the runtime projectname-services.xml file.
     * 
     * @param p
     * @return
     */
    public static Resource getRuntimeServicesXml(Project p) {
        try {
            return p.getWebInf().createRelative(RUNTIME_SERVICES);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    /**
     * Get the runtime projectname-managers.xml file.
     * 
     * @param project
     * @return
     */
    @Deprecated
    public static Resource getRuntimeManagersXml(Project project) {
        try {
            return project.getWebInf().createRelative(RUNTIME_MANAGERS);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    /**
     * Get the runtime projectname-managers.xml file.
     * 
     * @param project
     * @return
     */
    public static File getRuntimeManagersXmlFile(Project project) {
        return project.getWebInfFolder().getFile(RUNTIME_MANAGERS);
    }

    /**
     * Get the runtime SMD directory.
     * 
     * @param servicesDir service directory
     * @param serviceName service name
     * @return
     */
    @Deprecated
    public static Resource getSmdResource(Resource servicesDir, String serviceName) {
        try {
            return servicesDir.createRelative(serviceName + "." + SERVICE_SMD_EXTENSION);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public static File getSmdFile(Folder servicesFolder, String serviceName) {
        return servicesFolder.getFile(serviceName + "." + SERVICE_SMD_EXTENSION);
    }

    @Deprecated
    public static Resource getSmdResource(Project currentProject, String serviceName) {
        try {
            return getSmdResource(currentProject.getWebAppRoot().createRelative(RUNTIME_SERVICES_DIR), serviceName);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public static File getSmdFile(Project currentProject, String serviceName) {
        return getSmdFile(currentProject.getWebAppRootFolder().getFolder(RUNTIME_SERVICES_DIR), serviceName);
    }

    public static Resource getTypesFile(Resource webAppRoot) {
        try {
            return webAppRoot.createRelative(TYPE_RUNTIME_FILE);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    public static Resource getTypesFile(Project project) {
        return getTypesFile(project.getWebAppRoot());
    }

    @Deprecated
    public static void generateServices(FileService fileService, Resource servicesXml, SortedSet<Service> services) throws JAXBException, IOException {
        // Previously the top service file included imports for service bean spring definitions, since 6.5 all
        // *.spring.xml files are loaded using classpath scanning so the imports are no londer necessary. For now we
        // still write an empty file to ensure older projects remain operational.
        SpringConfigSupport.writeBeans(new Beans(), servicesXml, fileService);
    }

    public static void generateServices(File servicesXml, SortedSet<Service> services) throws JAXBException, IOException {
        // Previously the top service file included imports for service bean spring definitions, since 6.5 all
        // *.spring.xml files are loaded using classpath scanning so the imports are no londer necessary. For now we
        // still write an empty file to ensure older projects remain operational.
        SpringConfigSupport.writeBeans(new Beans(), servicesXml);
    }

    public static SortedSet<Method> getMethods(List<Operation> ops, String serviceName) {

        Collections.sort(ops, new OperationComparator());

        SortedMap<String, Method> methodMap = new TreeMap<String, Method>();

        for (int i = 0; i < ops.size(); i++) {
            Operation op = ops.get(i);

            Method meth = new Method();

            String methodName = op.getName();
            meth.setName(methodName);
            meth.setOperationType(op.getOperationType());

            if (op.getReturn() != null && op.getReturn().getTypeRef() != null) {
                String type = op.getReturn().getTypeRef();

                if (op.getReturn().isIsList()) {
                    type = typeToArrayType(type);
                }

                meth.setReturnType(type);
            }

            List<Parameter> params = op.getParameter();
            if (params.size() > 0) {
                List<Param> methArgs = new ArrayList<Param>();

                for (Parameter param : params) {
                    Param p = new Param();
                    p.setName(param.getName());

                    String type = param.getTypeRef();
                    if (param.isIsList()) {
                        type = typeToArrayType(type);
                    }
                    p.setType(type);

                    methArgs.add(p);
                }

                meth.setParameters(methArgs);
            }

            if (params.size() > 0 && methodMap.get(methodName) != null) {
                Method oldMethod = methodMap.get(methodName);
                List<Param> oldMapParams = oldMethod.getParameters();
                List<Param> curMapParams = meth.getParameters();

                if (oldMapParams == null) {
                    // hard to beat no parameters; leave the old one in the
                    // list
                } else if (oldMapParams.size() > curMapParams.size()) {
                    methodMap.put(methodName, meth);
                } else if (oldMapParams.size() == curMapParams.size()) {
                    throw new WMRuntimeException(MessageResource.JSONUTILS_BADMETHODOVERLOAD, serviceName, methodName);
                } else {
                    // the existing method has fewer parameters than this one,
                    // so leave that one
                }
            } else {
                methodMap.put(methodName, meth);
            }
        }

        // convert from the methodMap to a list of method definitions
        SortedSet<Method> methods = new TreeSet<Method>();
        for (Method elem : methodMap.values()) {
            methods.add(elem);
        }

        return methods;
    }

    protected static SMD getSMD(Service service) {

        SMD ret = new SMD();

        ret.setServiceType(ServerConstants.SERVICE_JSON_RPC);
        ret.setServiceURL(service.getId() + ".json");
        ret.setMethods(getMethods(service.getOperation(), service.getId()));

        return ret;
    }

    public static void generateSMDs(Project currentProject, SortedSet<Service> services) throws IOException, NoSuchMethodException {
        Resource servicesDir = currentProject.getWebAppRoot().createRelative(RUNTIME_SERVICES_DIR);
        generateSMDs(currentProject, servicesDir, services);
    }

    @Deprecated
    public static void generateSMDs(FileService fileService, Resource servicesDir, SortedSet<Service> services) throws IOException,
        NoSuchMethodException {
        for (Service service : services) {
            SMD smd = getSMD(service);
            Resource smdFile = getSmdResource(servicesDir, service.getId());
            JSONState js = new JSONState();
            Writer writer = fileService.getWriter(smdFile);
            JSONMarshaller.marshal(writer, smd, js, true, true);
            writer.close();
        }
    }

    public static void generateSMDs(Folder servicesFolder, SortedSet<Service> services) throws IOException, NoSuchMethodException {
        for (Service service : services) {
            SMD smd = getSMD(service);
            File smdFile = getSmdFile(servicesFolder, service.getId());
            JSONState js = new JSONState();
            Writer writer = smdFile.getContent().asWriter();
            try {
                JSONMarshaller.marshal(writer, smd, js, true, true);
            } finally {
                writer.close();
            }
        }
    }

    public static void generateSMD(Project project, Service service) throws IOException, NoSuchMethodException {
        SMD smd = getSMD(service);
        File smdFile = getSmdFile(project, service.getId());
        JSONState js = new JSONState();
        Writer writer = smdFile.getContent().asWriter();
        try {
            JSONMarshaller.marshal(writer, smd, js, true, true);
        } finally {
            writer.close();
        }
    }

    @Deprecated
    public static void generateManagers(FileService fileService, Resource managersXml, SortedSet<Service> services) throws JAXBException, IOException {
        Beans beans = getManagers(services);
        SpringConfigSupport.writeBeans(beans, managersXml, fileService);
    }

    public static void generateManagers(File managersXml, SortedSet<Service> services) throws JAXBException, IOException {
        Beans beans = getManagers(services);
        SpringConfigSupport.writeBeans(beans, managersXml);
    }

    private static Beans getManagers(SortedSet<Service> services) {
        Beans beans = new Beans();

        // create a type manager
        Bean tm = new Bean();
        tm.setScope(SINGLETON);
        tm.setClazz(TypeManager.class.getCanonicalName());
        tm.setParent(TYPE_MANAGER_PARENT);
        tm.setId(TYPE_MANAGER_BEAN_ID);

        Property prop = new Property();
        prop.setName(TYPE_MANAGER_TYPES);
        com.wavemaker.tools.spring.beans.Map typesMap = new com.wavemaker.tools.spring.beans.Map();
        typesMap.setMerge(DefaultableBoolean.TRUE);

        for (Service service : services) {
            if (service.getDataobjects() != null) {
                Entry entry = new Entry();
                entry.setKey(service.getId());
                com.wavemaker.tools.spring.beans.List typesList = new com.wavemaker.tools.spring.beans.List();

                for (DataObject dao : service.getDataobjects().getDataobject()) {
                    Value val = new Value();
                    List<String> content = new ArrayList<String>();
                    content.add(dao.getJavaType());
                    val.setContent(content);

                    typesList.getRefElement().add(val);
                }

                entry.getRefElement().add(typesList);
                typesMap.getEntries().add(entry);
            }
        }

        prop.setMap(typesMap);
        tm.addProperty(prop);

        beans.addBean(tm);
        return beans;
    }

    @Deprecated
    public static void generateTypes(FileService fileService, Resource typesFile, SortedSet<Service> services, List<DataObject> primitiveTypes)
        throws IOException {
        Writer writer = fileService.getWriter(typesFile);
        generateTypes(services, primitiveTypes, writer);
    }

    public static void generateTypes(File typesFile, SortedSet<Service> services, List<DataObject> primitiveTypes) throws IOException {
        generateTypes(services, primitiveTypes, typesFile.getContent().asWriter());
    }

    private static void generateTypes(SortedSet<Service> services, List<DataObject> primitiveTypes, Writer writer) throws IOException {
        try {
            Types types = getTypesFromServices(services, primitiveTypes);
            writer.write(WM_TYPES_PREPEND);
            JSONState js = new JSONState();
            js.setValueTransformer(new TypeValueTransformer());
            JSONMarshaller.marshal(writer, types, js, true, true);
            writer.write(WM_TYPES_APPEND);
        } finally {
            writer.close();
        }
    }

    public static Types getTypesFromServices(SortedSet<Service> services, List<DataObject> primitiveTypes) {

        Types ret = new Types();
        for (Service service : services) {
            DataObjects objs = service.getDataobjects();
            if (objs != null) {
                getTypesFromDataObjects(service.getId(), objs.getDataobject(), ret);
            }
        }
        if (primitiveTypes != null) {
            getTypesFromDataObjects("noServicePrimitiveType", primitiveTypes, ret);
        }

        return ret;
    }

    public static void getTypesFromDataObjects(String serviceId, List<DataObject> daos, Types types) {

        for (DataObject dao : daos) {
            if (dao.getJsType() == null) {
                ComplexType type = new ComplexType();

                if (dao.isSupportsQuickData()) {
                    type.setLiveService(true);
                }
                type.setService(serviceId);
                type.setInternal(dao.isInternal());

                int fieldOrder = 0;
                for (Element et : dao.getElement()) {
                    if (serviceId.equals(CommonConstants.SALESFORCE_SERVICE)) {
                        if (SalesforceHelper.skipElement(et, serviceId)) {
                            continue; // salesforce
                        }
                    }
                    Field f = new Field();
                    f.setType(et.getTypeRef());
                    f.setIsList(et.isIsList());
                    f.setRequired(!et.isAllowNull());
                    f.setExclude(et.getExclude());
                    f.setNoChange(et.getNoChange());
                    f.setInclude(et.getRequire());
                    f.setFieldOrder(fieldOrder);
                    f.setFieldSubType(et.getSubType()); // salesforce

                    type.getFields().put(et.getName(), f);
                    fieldOrder++;
                }

                types.getTypes().put(dao.getJavaType(), type);
            } else {
                PrimitiveType type = new PrimitiveType();
                type.setInternal(dao.isInternal());
                type.setPrimitiveType(dao.getJsType());
                types.getTypes().put(dao.getJavaType(), type);
            }
        }
    }
}

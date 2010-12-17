/*
 *  Copyright (C) 2007-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.tools.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeMap;
import java.util.TreeSet;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import org.apache.commons.io.FileUtils;
import org.springframework.core.io.ClassPathResource;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.ObjectTypeDefinition;
import com.wavemaker.json.type.OperationEnumeration;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.runtime.service.definition.ReflectServiceDefinition;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.runtime.service.definition.ServiceOperation;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.data.util.DataServiceUtils;
import com.wavemaker.tools.project.DeploymentManager;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.service.definitions.DataObject;
import com.wavemaker.tools.service.definitions.DataObjects;
import com.wavemaker.tools.service.definitions.Operation;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.service.definitions.ServiceComparator;
import com.wavemaker.tools.service.definitions.DataObject.Element;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.spring.beans.DefaultableBoolean;
import com.wavemaker.tools.spring.beans.Property;

/**
 * The DesignServiceManager provides design-time access to service descriptor
 * information, including types..
 * 
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class DesignServiceManager {

    private static final JAXBContext definitionsContext;

    private static final String SERVICES_DIR = "services";

    private static final String SERVICE_DEF_XML = "servicedef.xml";

    private static final String RUNTIME_DIR = "src";

    private static final String DESIGNTIME_DIR = "designtime";

    private static final Collection<String> RESERVED_WORDS = new HashSet<String>(
            DataServiceUtils.RESERVED_WORDS.size());
    static {
        RESERVED_WORDS.addAll(DataServiceUtils.RESERVED_WORDS);
    }

    private final Map<Project, Map<String, Service>> serviceDefinitions;

    private final List<DataObject> primitiveTypes;

    private final Map<String, String> primitivesMap;

    private final Service runtimeService;

    public static final String RUNTIME_SERVICE_ID = "runtimeService";

    private static final String SERVICE_BEAN_XML_POSTFIX = ".spring.xml";

    static {
        try {
            definitionsContext = JAXBContext
                    .newInstance("com.wavemaker.tools.service.definitions");
        } catch (JAXBException e) {
            throw new WMRuntimeException(e);
        }
    }

    public DesignServiceManager() throws JAXBException, IOException {

        serviceDefinitions = new HashMap<Project, Map<String, Service>>();

        Unmarshaller unmarshaller = definitionsContext.createUnmarshaller();
        ClassPathResource primitiveServiceFile = new ClassPathResource(
                "com/wavemaker/tools/service/primitive_types.xml");
        Service primitiveService = (Service) unmarshaller
                .unmarshal(primitiveServiceFile.getInputStream());
        primitiveTypes = Collections.unmodifiableList(primitiveService
                .getDataobjects().getDataobject());

        Map<String, String> m = new TreeMap<String, String>();

        for (DataObject o : primitiveTypes) {
            if (!o.isInternal()) {
                m.put(o.getName(), o.getJavaType());
            }
        }

        primitivesMap = Collections.unmodifiableMap(m);

        ClassPathResource runtimeServiceFile = new ClassPathResource(
                "com/wavemaker/runtime/service/runtimeServiceDef.xml");
        runtimeService = loadServiceDefinition(runtimeServiceFile
                .getInputStream());
    }

    // -----------------------------------------------------------------------
    // static methods
    // -----------------------------------------------------------------------

    /**
     * Return the design time directory, relative to the project root.
     * 
     * @return
     */
    public static String getDesigntimeRelativeDir(String serviceId) {
        return SERVICES_DIR + "/" + serviceId + "/" + DESIGNTIME_DIR;
    }

    /**
     * Return the runtime directory, relative to the project root.
     * 
     * @return
     */
    public static String getRuntimeRelativeDir(String serviceId) {
        return SERVICES_DIR + "/" + serviceId + "/" + RUNTIME_DIR;
    }

    /**
     * Return the services directory, relative to the project root.
     * 
     * @return
     */
    public static String getServicesRelativeDir() {
        return SERVICES_DIR;
    }

    /**
     * Return the service def xml filename (relative to DesigntimeRelativeDir).
     * 
     * @return
     */
    public static String getServiceXmlRelative() {
        return SERVICE_DEF_XML;
    }

    public static String getServiceBeanName(String serviceId) {
        return serviceId + SERVICE_BEAN_XML_POSTFIX;
    }

    /**
     * Return the path (relative to the project root) to the service bean file
     * for the specified service.
     * 
     * @param serviceId
     *                The service to get the bean file for.
     * @return The path to the service bean file for service serviceId.
     */
    public static String getServiceBeanRelative(String serviceId) {

        return getRuntimeRelativeDir(serviceId) + "/"
                + getServiceBeanName(serviceId);
    }

    /**
     * Generates (and returns) a Beans object containing a single bean, one
     * which will correctly create the specified bean.
     * 
     * @param serviceId
     *                The service's id.
     * @param serviceClass
     *                The service's class.
     * @param project
     * @param serviceBeanFile
     * @return A Beans object containing the correct service-specific bean.
     * @throws IOException
     * @throws JAXBException
     */
    public static void generateSpringServiceConfig(String serviceId,
            String serviceClass, DesignServiceType designServiceType,
            File serviceBeanFile, Project project)
            throws JAXBException, IOException {
        
        Beans beans = new Beans();
        Bean bean = new Bean();
        bean.setClazz(serviceClass);
        bean.setId(serviceId);
        bean.setScope(ConfigurationCompiler.SINGLETON);
        bean.setLazyInit(DefaultableBoolean.TRUE);
        beans.addBean(bean);

        Bean serviceWireBean = generateServiceWireBean(designServiceType, serviceId);
        beans.addBean(serviceWireBean);
        
        SpringConfigSupport.writeBeans(beans, serviceBeanFile, project);
    }
    
    /**
     * Generates the now-required ServiceWire bean.
     */
    public static Bean generateServiceWireBean(DesignServiceType designServiceType, String serviceId) {
        
        // serviceType bean
        Bean serviceTypeBean = new Bean();
        serviceTypeBean.setClazz(designServiceType.getServiceType().getClass().getName());
        Property serviceTypeProp = new Property();
        serviceTypeProp.setName("serviceType");
        serviceTypeProp.setRef(designServiceType.getServiceType());

        // and generate the default wire
        Bean serviceWireBean = new Bean();
        serviceWireBean.setClazz(designServiceType.getServiceWire().getName());
        serviceWireBean.setScope(ConfigurationCompiler.SINGLETON);
        serviceWireBean.setLazyInit(DefaultableBoolean.FALSE);
        serviceWireBean.addProperty("serviceId", serviceId);
        serviceWireBean.addProperty(serviceTypeProp);
        
        return serviceWireBean;
    }
    

    // -----------------------------------------------------------------------
    // operations & services
    // -----------------------------------------------------------------------

    /**
     * Remove the service, and delete the service home.
     * 
     * @param serviceId
     * @throws IOException
     * @throws JAXBException
     */
    public void deleteService(String serviceId)
        throws IOException, NoSuchMethodException {

        Map<String, Service> serviceDefs = getCurrentServiceDefinitions();
        serviceDefs.remove(serviceId);

        File serviceHome = getServiceHome(serviceId);
        FileUtils.deleteDirectory(serviceHome);
        ConfigurationCompiler.getSmdFile(
                getProjectManager().getCurrentProject(), serviceId).delete();
        generateRuntimeConfiguration(null);// XXX MAV-569 should do a real
                                            // build

        deploymentManager.testRunClean();
    }

    /**
     * Remove smd files only for passed service id
     *
     * @param serviceId
     * @throws IOException
     * @throws JAXBException
     */
    public void deleteServiceSmd(String serviceId)
        throws IOException, NoSuchMethodException {
        
        ConfigurationCompiler.getSmdFile(
                getProjectManager().getCurrentProject(), serviceId).delete();
        generateRuntimeConfiguration(null);// XXX MAV-569 should do a real
                                            // build

        deploymentManager.testRunClean();
    }

    /**
     * Define the definition of a service; this will destroy any existing
     * configuration associated with the serviceid.
     * 
     * @param serviceDef
     *                The service definition for the newly defined service.
     */
    public void defineService(ServiceDefinition serviceDef) {

        try {
            validateServiceId(serviceDef.getServiceId());
        } catch (DuplicateServiceIdException ignore) {
            // ignore
        }

        Service oldService = getService(serviceDef.getServiceId());

        Service service = new Service();
        getCurrentServiceDefinitions().put(serviceDef.getServiceId(), service);

        try {
            for (ServiceOperation op : serviceDef.getServiceOperations()) {
                doUpdateOperation(op, service, serviceDef);
            }
            service.setId(serviceDef.getServiceId());
            service.setType(serviceDef.getServiceType().getTypeName());
            service.setCRUDService(serviceDef.isLiveDataService());
            if (serviceDef instanceof ReflectServiceDefinition) {
                service.setClazz(((ReflectServiceDefinition)serviceDef).getServiceClass());
            }

            if (null != serviceDef.getRuntimeConfiguration()) {
                service.setSpringFile(serviceDef.getRuntimeConfiguration());
            } else if (null != oldService && null != oldService.getSpringFile()) {
                service.setSpringFile(oldService.getSpringFile());
            }

            updateServiceTypes(service, serviceDef);
        } catch (WMRuntimeException e) {
            // if we had an error, remove the service def so we'll use the last
            // known-good one
            getCurrentServiceDefinitions().remove(serviceDef.getServiceId());
            throw e;
        }

        defineService(service);
    }

    /**
     * Define the definition of a service; this will destroy any existing
     * configuration associated with the serviceid.
     * 
     * @param service
     *                The service for the newly defined service.
     */
    public void defineService(Service service) {

        if (null == service.getSpringFile()) {
            service.setSpringFile(getServiceBeanName(service.getId()));
        }

        saveServiceDefinition(service.getId());

        // and, create the service bean
        File serviceBeanFile = getServiceBeanXml(service.getId());
        if (getServiceBeanName(service.getId()).equals(service.getSpringFile())
                && !serviceBeanFile.exists()) {
            if (!serviceBeanFile.getParentFile().exists()) {
                serviceBeanFile.getParentFile().mkdir();
            }
            
            try {
                generateSpringServiceConfig(service.getId(),
                        service.getClazz(), getDesignServiceType(service.getType()),
                        serviceBeanFile, projectManager.getCurrentProject());
            } catch (JAXBException e) {
                throw new WMRuntimeException(e);
            } catch (IOException e) {
                throw new WMRuntimeException(e);
            }
        }
    }

    /**
     * Validates a serviceid.
     * 
     * @throws ConfigurationException
     *                 is the serviceid is invalid.
     */
    public void validateServiceId(String id) {

        if (ObjectUtils.isNullOrEmpty(id)) {
            throw new InvalidServiceIdException(id,
                    "it cannot be null or empty");
        }

        if (RESERVED_WORDS.contains(id)) {
            throw new InvalidServiceIdException(id,
                    "it contains a reserved word");
        }

        if (!StringUtils.isValidJavaIdentifier(id)) {
            throw new InvalidServiceIdException(id,
                    "it must be a valid java identifier");
        }

        // last check should be for already existing service id
        if (getServiceIds().contains(id)) {
            throw new DuplicateServiceIdException(id);
        }
    }

    /**
     * Return the services directory.
     * 
     * @return
     */
    public File getServicesDir() {

        return new File(getProjectManager().getCurrentProject()
                .getProjectRoot(), SERVICES_DIR);
    }

    /**
     * Return the service directory.
     * 
     * @param serviceId
     * @return
     */
    public File getServiceHome(String serviceId) {

        return new File(getServicesDir(), serviceId);
    }

    /**
     * Return the service's runtime directory. This is
     * project/services/serviceId/src.
     * 
     * @param serviceId
     * @return
     */
    public File getServiceRuntimeDirectory(String serviceId) {

        return new File(getServiceHome(serviceId), RUNTIME_DIR);
    }

    /**
     * Return the service's design time directory.
     * 
     * @param serviceId
     * @return
     */
    public File getServiceDesigntimeDirectory(String serviceId) {

        return new File(getServiceHome(serviceId), DESIGNTIME_DIR);
    }

    /**
     * Return the path to a service's design-time service definition xml.
     * 
     * @param serviceId
     * @return
     */
    public File getServiceDefXml(String serviceId) {

        return new File(getServiceDesigntimeDirectory(serviceId),
                SERVICE_DEF_XML);
    }

    /**
     * Return the path to a service's bean definition file.
     * 
     * @param serviceId
     *                The service to find the bean definition file for.
     * @return The path to the bean definition file for service serviceId.
     */
    public File getServiceBeanXml(String serviceId) {

        return new File(getProjectManager().getCurrentProject()
                .getProjectRoot(), getServiceBeanRelative(serviceId));
    }

    /**
     * Get the ServiceDefinition with id serviceId from the current project's
     * services; if it hasn't been loaded, try to load it from disk.
     * 
     * @param serviceId
     * @return
     */
    public Service getCurrentServiceDefinition(String serviceId) {

        Service ret;

        if (getCurrentServiceDefinitions().containsKey(serviceId)) {
            ret = getCurrentServiceDefinitions().get(serviceId);
        } else {
            Service service = loadServiceDefinition(serviceId);
            getCurrentServiceDefinitions().put(serviceId, service);
            ret = service;
        }

        return ret;
    }

    /**
     * Return a set of all currently known services. Services are found by
     * checking every directory in the project home for the service xml.
     * 
     * @return
     */
    public SortedSet<String> getServiceIds() {

        SortedSet<String> ret = new TreeSet<String>();
        File servicesDir = getServicesDir();
        File serviceXml;

        if (servicesDir.exists()) {
            for (File child : servicesDir.listFiles()) {
                if (child.isDirectory()) {
                    serviceXml = getServiceDefXml(child.getName());
                    if (serviceXml.exists()) {
                        ret.add(child.getName());
                    }
                }
            }
        }
        ret.add(RUNTIME_SERVICE_ID);

        return ret;
    }

    /**
     * Return all services in the current project.
     */
    public SortedSet<Service> getServices() {

        SortedSet<String> serviceIds = getServiceIds();
        SortedSet<Service> ret = new TreeSet<Service>(new ServiceComparator());

        for (String id : serviceIds) {
            ret.add(getService(id));
        }

        return ret;
    }

    /**
     * Return a list of all services with the specified type.
     * 
     * @param type
     * @return
     */
    public SortedSet<Service> getServicesByType(String type) {

        SortedSet<Service> services = getServices();
        SortedSet<Service> ret = new TreeSet<Service>(new ServiceComparator());

        for (Service service : services) {
            if (service.getType().equals(type)) {
                ret.add(service);
            }
        }

        return ret;
    }

    public SortedSet<Service> getServicesByType(String[] types) { //xxx

        SortedSet<Service> services = getServices();
        SortedSet<Service> ret = new TreeSet<Service>(new ServiceComparator());

        for (String type : types) {
            for (Service service : services) {
                if (service.getType().equals(type)) {
                    ret.add(service);
                }
            }
        }

        return ret;
    }

    /**
     * Get the DesignServiceType corresponding with the tyepId, or null if no
     * DesignServiceType matches.
     * 
     * @param typeId
     *            The type name to look for.
     * @return The appropriate DesignServiceType; if none was found, throws an
     *         exception.
     */
    public DesignServiceType getDesignServiceType(String typeId) {
        
        for (DesignServiceType dst: getDesignServiceTypes()) {
            if (dst.getServiceType().equals(typeId)) {
                return dst;
            }
        }
        
        throw new WMRuntimeException(Resource.NO_DESIGN_SERVICE_TYPE_FOUND,
                typeId);
    }

    /**
     * Returns true if a service with the given serviceId exists, false
     * otherwise.
     */
    public boolean serviceExists(String serviceId) {

        try {
            return (getService(serviceId) == null ? false : true);
        } catch (RuntimeException ex) {
        }

        return false;
    }

    /**
     * Return the Service corresponding with the specified service id. Returns
     * null if the service does not exist, or if the service is not valid.
     * 
     * @param serviceId
     * @return
     */
    public Service getService(String serviceId) {

        return getCurrentServiceDefinition(serviceId);
    }

    /**
     * Return a list of all operations registered with a given service.
     * 
     * @param serviceId
     *                The service to examine.
     * @return
     */
    public List<String> getOperationNames(String serviceId) {

        Service service = getCurrentServiceDefinition(serviceId);
        List<Operation> operations = service.getOperation();
        List<String> ret = new ArrayList<String>(operations.size());
        for (Operation op : operations) {
            ret.add(op.getName());
        }

        return ret;
    }

    /**
     * Return the operation for the passed name, or null if it doesn't exist.
     */
    public Operation getOperation(String serviceId, String name) {

        Service service = getCurrentServiceDefinition(serviceId);
        for (Operation operation : service.getOperation()) {
            if (operation.getName().equals(name)) {
                return operation;
            }
        }
        return null;
    }

    /**
     * Generate the appropriate runtime configuration for the current project.
     * Currently, project-services.xml and project-managers.xml are generated.
     * 
     * @param services
     *                The list of services to update; if null, all services'
     *                SMDs are generated.
     * 
     * @throws JAXBException
     * @throws IOException
     */
    private void generateRuntimeConfiguration(SortedSet<Service> services)
            throws IOException, NoSuchMethodException {

        Project project = getProjectManager().getCurrentProject();

        if (null == services) {
            services = getServices();
        }
        SortedSet<Service> allServices = getServices();

        try {
            ConfigurationCompiler.generateServices(project,
                    ConfigurationCompiler.getRuntimeServicesXml(project),
                    allServices);

            ConfigurationCompiler.generateManagers(project,
                    ConfigurationCompiler.getRuntimeManagersXml(project),
                    allServices);
        } catch (JAXBException ex) {
            throw new WMRuntimeException(ex);
        }

        ConfigurationCompiler.generateSMDs(project, services);

        ConfigurationCompiler.generateTypes(project,
                ConfigurationCompiler.getTypesFile(project),
                allServices, getPrimitiveDataObjects());
    }

    // -----------------------------------------------------------------------
    // data types
    // -----------------------------------------------------------------------
    /**
     * Update the types associated with a given service. Currently, this will
     * clobber all types associated with the given service.
     * 
     * @param service
     * @param serviceDef
     */
    public void updateServiceTypes(Service service, ServiceDefinition serviceDef) {

        if (null == service.getDataobjects()) {
            service.setDataobjects(new DataObjects());
        }
        List<DataObject> dos = service.getDataobjects().getDataobject();
        dos.clear();

        List<TypeDefinition> elementTypes = serviceDef.getLocalTypes();
        for (TypeDefinition et : elementTypes) {

            if (null != findDataObjectFromJavaType(et.getTypeName())) {
                throw new WMRuntimeException("Conflicting java type: "
                        + et.getTypeName());
            }

            DataObject dso = new DataObject();
            dos.add(dso);

            dso.setJavaType(et.getTypeName());
            dso.setName(et.getShortName());
            dso.setSupportsQuickData(et.isLiveService());

            if (et instanceof ObjectTypeDefinition) {
                ObjectTypeDefinition otd = (ObjectTypeDefinition) et;
                List<Element> dsoelems = dso.getElement();
                for (Map.Entry<String, FieldDefinition> entry: otd.getFields().entrySet()) {

                    Element e = new Element();
                    dsoelems.add(e);
                    if (0!=entry.getKey().compareTo(entry.getValue().getName())) {
                        throw new WMRuntimeException("key: "+entry.getKey()+" != "+entry.getValue().getName());
                    }
                    
                    // key or value.name?
                    e.setName(entry.getKey());
                    
                    if (null!=entry.getValue().getTypeDefinition()) {
                        e.setTypeRef(entry.getValue().getTypeDefinition().getTypeName());
                    }
                    e.setIsList(entry.getValue().getDimensions() > 0);
                    e.setAllowNull(entry.getValue().isAllowNull());
                    e.setSubType(entry.getValue().getSubType()); //xxx

                    for (OperationEnumeration oe : entry.getValue().getRequire()) {
                        e.getRequire().add(oe);
                    }
                    for (OperationEnumeration oe : entry.getValue().getExclude()) {
                        e.getExclude().add(oe);
                    }
                    for (OperationEnumeration oe : entry.getValue().getNoChange()) {
                        e.getNoChange().add(oe);
                    }
                }
            }
        }
    }

    /**
     * Return a Map of Strings: short name: fully qualified type name.
     * 
     * @return
     */
    public Map<String, String> getPrimitives() {
        return primitivesMap;
    }

    /**
     * Return a list of all DataObjects in this project, and all global data
     * objects (such as simple types).
     * 
     * @return
     */
    public List<DataObject> getDataObjects() {

        List<DataObject> ret = new ArrayList<DataObject>();
        ret.addAll(primitiveTypes);
        ret.addAll(getLocalDataObjects());

        return ret;
    }

    /**
     * Return data objects specific to this project's services.
     * 
     * @return
     */
    public List<DataObject> getLocalDataObjects() {

        Set<DataObject> ret = new HashSet<DataObject>();
        Collection<Service> services = getServices();

        for (Service service : services) {
            if (null != service.getDataobjects()) {
                List<DataObject> serviceObjects = service.getDataobjects()
                        .getDataobject();
                ret.addAll(serviceObjects);
            }
        }

        return new ArrayList<DataObject>(ret);
    }

    /**
     * Return the dataobjects specific to the specified service.
     * 
     * @param serviceId
     * @return
     */
    public List<DataObject> getLocalDataObjects(String serviceId) {

        Service service = getService(serviceId);
        if (null != service.getDataobjects()) {
            return service.getDataobjects().getDataobject();
        } else {
            return new ArrayList<DataObject>();
        }
    }

    /**
     * Return all primitive types.
     * 
     * @return
     */
    public List<DataObject> getPrimitiveDataObjects() {

        return primitiveTypes;
    }

    /**
     * Return the DataObject with a javaType as specified, or null if no
     * DataObject was found in this project.
     * 
     * @param javaType
     *                The javaType to search for.
     * @return
     */
    public DataObject findDataObjectFromJavaType(String javaType) {

        for (DataObject dataobject : getLocalDataObjects()) {
            if (dataobject.getJavaType().equals(javaType)) {
                return dataobject;
            }
        }

        return null;
    }

    /**
     * Get a list of service types that belong to any service except for the one
     * specified in the argument.
     * 
     * @param serviceId
     * @return
     */
    public List<String> getExcludeTypeNames(String serviceId) {

        List<String> excludeTypeNames = new ArrayList<String>();
        Collection<String> serviceIds = getServiceIds();
        for (String id : serviceIds) {
            if (serviceId.equals(id)) {
                // ignore this services' types
            } else {
                List<DataObject> dos = getLocalDataObjects(id);
                for (DataObject d : dos) {
                    excludeTypeNames.add(d.getJavaType());
                }
            }
        }

        return excludeTypeNames;
    }

    public ClassLoader getServiceRuntimeClassLoader(String sid) {

        // classloader has service runtime home (src) dir and build dir.
        // it has the src dir also so that services have the option of not
        // relying on 'testrun' having run
        ClassLoader rtn = ClassLoaderUtils.getClassLoaderForFile(
                getServiceRuntimeDirectory(sid),
                projectManager.getCurrentProject().getWebInfClasses());
        return rtn;
    }

    // -----------------------------------------------------------------------
    // internal ops
    // -----------------------------------------------------------------------
    protected void doUpdateOperation(ServiceOperation so, Service service,
            ServiceDefinition sd) {

        List<Operation> ops = service.getOperation();

        Operation op = null;
        for (Operation opTemp : ops) {
            if (opTemp.getName().equals(so.getName())) {
                op = opTemp;
                break;
            }
        }
        if (null == op) {
            op = new Operation();
            op.setName(so.getName());
            ops.add(op);
        }
        
        List<Operation.Parameter> params = op.getParameter();

        if (params.size() > 0) {
            params.clear();
        }
        
        for (FieldDefinition input: so.getParameterTypes()) {
            Operation.Parameter param = new Operation.Parameter();
            param.setIsList(input.getDimensions()>0);
            param.setName(input.getName());
            if (null!=input.getTypeDefinition()) {
                param.setTypeRef(input.getTypeDefinition().getTypeName());
            }
            params.add(param);
        }
        

        if (null!=so.getReturnType()) {
            Operation.Return ret = new Operation.Return();
            ret.setIsList(so.getReturnType().getDimensions()>0);
            if (null!=so.getReturnType().getTypeDefinition()) {
                ret.setTypeRef(so.getReturnType().getTypeDefinition().getTypeName());
            }
            op.setReturn(ret);
        }
    }

    /**
     * Accessor method for use by DSMProjectEventListener, in particular.
     * 
     * @return
     */
    public Map<Project, Map<String, Service>> getAllServiceDefinitions() {
        return this.serviceDefinitions;
    }

    /**
     * WARNING: this is not an exhaustive list, just a list of those services
     * which have been loaded.. so, use getCurrentServiceDefinition(String)
     * instead.
     */
    private Map<String, Service> getCurrentServiceDefinitions() {

        Map<String, Service> ret;
        Project currentProject = getProjectManager().getCurrentProject();

        if (serviceDefinitions.containsKey(currentProject)) {
            ret = serviceDefinitions.get(currentProject);
        } else {
            ret = new HashMap<String, Service>();
            ret.put(RUNTIME_SERVICE_ID, runtimeService);
            serviceDefinitions.put(currentProject, ret);
        }

        return ret;
    }

    /**
     * Convert a bean class to a default bean id.
     * 
     * @param beanClass
     * @return
     */
    public static String beanClassToId(String beanClass) {

        String ret = beanClass;
        if (-1 != ret.indexOf('.')) {
            ret = ret.substring(ret.lastIndexOf('.') + 1);
        }
        ret = ret.substring(0, 1).toLowerCase() + ret.substring(1);

        return ret;
    }

    private Service loadServiceDefinition(String serviceId) {

        Service ret = null;

        File serviceDefFile = getServiceDefXml(serviceId);

        if (serviceDefFile.exists()) {
            try {
                ret = loadServiceDefinition(serviceDefFile);
                if (null == ret.getId() || "" == ret.getId()) {
                    throw new WMRuntimeException(
                            Resource.INVALID_SERVICE_DEF_NO_ID, serviceId);
                }
            } catch (JAXBException e) {
                throw new WMRuntimeException(Resource.ERROR_LOADING_SERVICEDEF,
                        e, serviceId, serviceDefFile, e.getMessage());
            }
        }

        return ret;
    }

    public static Service loadServiceDefinition(File serviceDefXml)
            throws JAXBException {

        Unmarshaller unmarshaller = definitionsContext.createUnmarshaller();
        Service svc = (Service) unmarshaller.unmarshal(serviceDefXml);
        return svc;
    }

    public static Service loadServiceDefinition(InputStream serviceDefIS)
            throws JAXBException {

        Unmarshaller unmarshaller = definitionsContext.createUnmarshaller();
        return (Service) unmarshaller.unmarshal(serviceDefIS);
    }

    public void saveServiceDefinition(String serviceId) {

        File serviceDefFile = getServiceDefXml(serviceId);
        Service service = getCurrentServiceDefinition(serviceId);

        Service oldService = null; //xxx-s
        if (serviceId.equals("salesforceService")) {
            oldService = loadServiceDefinition(serviceId);

            for (Operation op : oldService.getOperation()) {
                service.addOperation(op);
            }

            List<DataObject> dataObjects = service.getDataobjects().getDataobject();
            for (DataObject dobj : oldService.getDataobjects().getDataobject()) {
                dataObjects.add(dobj);
            }

            service.setType(oldService.getType());
            service.setCRUDService(oldService.getCRUDService());
        } //xxx-e

        try {
            FileUtils.forceMkdir(
                    getServiceDesigntimeDirectory(service.getId()));

            Marshaller marshaller = definitionsContext.createMarshaller();
            marshaller.setProperty("jaxb.formatted.output", true);
            marshaller.marshal(service, serviceDefFile);

            // XXX MAV-569 should do a real build here, or actually outside
            // this method maybe
            SortedSet<Service> s = new TreeSet<Service>();
            s.add(service);
            generateRuntimeConfiguration(s);
        } catch (JAXBException e) {
            throw new WMRuntimeException(e);
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        } catch (NoSuchMethodException e) {
            throw new WMRuntimeException(e);
        }
    }

    // spring-controlled bean properties
    private ProjectManager projectManager;

    private DeploymentManager deploymentManager;
    
    private List<DesignServiceType> designServiceTypes;

    public void setProjectManager(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }

    public ProjectManager getProjectManager() {
        return projectManager;
    }

    public DeploymentManager getDeploymentManager() {
        return deploymentManager;
    }

    public void setDeploymentManager(DeploymentManager deploymentManager) {
        this.deploymentManager = deploymentManager;
    }

    public void setDesignServiceTypes(List<DesignServiceType> designServiceTypes) {
        this.designServiceTypes = designServiceTypes;
    }

    public List<DesignServiceType> getDesignServiceTypes() {
        return designServiceTypes;
    }

    public JAXBContext getDefinitionsContext() { //xxx
        return definitionsContext;
    }
}

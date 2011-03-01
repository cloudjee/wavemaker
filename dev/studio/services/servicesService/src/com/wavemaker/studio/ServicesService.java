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
package com.wavemaker.studio;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;
import java.util.Map.Entry;

import javax.xml.bind.JAXBException;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.client.TreeNode;
import com.wavemaker.runtime.server.InternalRuntime;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.data.InitData;
import com.wavemaker.tools.project.DeploymentManager;
import com.wavemaker.tools.service.ConfigurationCompiler;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.definitions.DataObject;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.service.definitions.DataObject.Element;
import com.wavemaker.tools.service.types.ComplexType;
import com.wavemaker.tools.service.types.Field;
import com.wavemaker.tools.service.types.PrimitiveType;
import com.wavemaker.tools.service.types.Type;
import com.wavemaker.tools.service.types.TypeValueTransformer;
import com.wavemaker.tools.service.types.Types;

/**
 * Service to manage services with.
 * 
 * @author small
 * @version $Rev$ - $Date$
 *
 */
@HideFromClient
public class ServicesService {
    
    public static final String SUPPORTS_RUNTIME_ACCESS_KEY = "supportsRuntimeAccess";
    
    /**
     * Return a list of services registered with the current application.
     * 
     * @return The set of all service ids associated with the current
     *         application.
     */
    @ExposeToClient
    public Set<String> listServices() {
        
        Set<String> services = designServiceManager.getServiceIds();
        services.remove(DesignServiceManager.RUNTIME_SERVICE_ID);
        return services;
    }

    /**
     * Return a list of services (as from {@link #listServices()}), but include
     * the type of the service (DataService, WebService, JavaService) as well.
     * 
     * @return A Map<String,String> from service ids (the same set as from
     *         {@link #listServices()}) to their service type (DataService,
     *         JavaService, WebService).
     */
    @ExposeToClient
    public Map<String, String> listServicesWithType() {
        Map<String, String> services = new LinkedHashMap<String, String>();
        Set<String> serviceIds = listServices();
        for (String serviceId : serviceIds) {
            services.put(serviceId, getServiceType(serviceId));
        }
        return services;
    }

    /**
     * Delete a service.
     * 
     * @param serviceId
     * @throws IOException
     * @throws JAXBException
     */
    @ExposeToClient
    public void deleteService(String serviceId)
            throws IOException, JAXBException, NoSuchMethodException {
        
        designServiceManager.deleteService(serviceId);
    }
    
    /**
     * Return a list of operations associated with a given service id.
     * @param serviceId
     * @return
     */
    @ExposeToClient
    public List<String> listOperations(String serviceId) {
        
        List<String> ops = designServiceManager.getOperationNames(serviceId);
        Collections.sort(ops);
        return ops;
    }

    /**
     * Returns the list of primitives.
     * @return
     */
    @ExposeToClient
    public Map<String, String> listPrimitives() {
        
        return designServiceManager.getPrimitives();
    }
    
    /**
     * Return a list of all dataobjects (contained in all known services), with
     * no primitive types.
     * @return
     */
    @ExposeToClient
    public Map<String, Map<String, Map<String, Object>>> listDataObjects() {
        
        List<DataObject> allDataObjects =
            designServiceManager.getLocalDataObjects();
        return convertDataObjects(allDataObjects, designServiceManager.getServices());
    }
    
    /**
     * Return a list of all types, including service types and primitive types.
     * @return
     */
    @ExposeToClient
    public Types listTypes() {
        
        InternalRuntime.getInstance().getJSONState().setValueTransformer(new TypeValueTransformer());
        
        Types types = ConfigurationCompiler.getTypesFromServices(
                designServiceManager.getServices(),
                designServiceManager.getPrimitiveDataObjects());
        
        return types;
    }
    
    /**
     * Get types in a tree, sorted by their service.
     * @return
     */
    @ExposeToClient
    public InitData listTypesTree() {
        
        Set<Service> services = designServiceManager.getServices();
        List<TreeNode> serviceNodes = new ArrayList<TreeNode>(services.size());
        SortedSet<Service> singleService;
        for (Service service: services) {
            TreeNode node = new TreeNode();
            node.setContent(service.getId());
            serviceNodes.add(node);
            
            singleService = new TreeSet<Service>();
            singleService.add(service);
            Types types = ConfigurationCompiler.getTypesFromServices(
                    singleService, null);
            
            for (Entry<String, Type> entry: types.getTypes().entrySet()) {
                TreeNode typeNode = new TreeNode();
                typeNode.setContent(entry.getKey());
                
                if (entry.getValue() instanceof ComplexType) {
                    ComplexType ct = (ComplexType) entry.getValue();
                    for (Entry<String, Field> fieldEntry:
                            ct.getFields().entrySet()) {
                        TreeNode fieldNode = new TreeNode();
                        fieldNode.setContent(fieldEntry.getKey());
                        
                        TreeNode javaTypeNode = new TreeNode();
                        javaTypeNode.setContent("type: "+
                                fieldEntry.getValue().getType());
                        fieldNode.addChild(javaTypeNode);
                        
                        TreeNode isListNode = new TreeNode();
                        isListNode.setContent("is list: "+
                                fieldEntry.getValue().isIsList());
                        fieldNode.addChild(isListNode);
                        
                        typeNode.addChild(fieldNode);
                    }
                } else if (entry.getValue() instanceof PrimitiveType) {
                    
                } else {
                    throw new WMRuntimeException("unknown type: "+
                            entry.getValue().getClass());
                }
                
                node.addChild(typeNode);
            }
        }
        
        return new InitData(serviceNodes);
    }

    /**
     * Returns the service type for the given service ID.
     * @param serviceId The service ID.
     * @return The service type.
     */
    @ExposeToClient
    public String getServiceType(String serviceId) {
        
        Service service = designServiceManager.getService(serviceId);
        if (service != null) {
            return service.getType();
        }
        return null;
    }
    
    /**
     * Convert from internal, service-side DataObjects to the correct client
     * format.  It should look like this:
     * 
     * {typeName:
     *          { componentName: {type: fqJavaType, isList: true},
     *            componentName2: {type: fqJavaType, isList: false}},
     *  typeName2: ...
     * }
     * 
     * @param daos The DataObjects to convert
     * @param allServices All the current services
     */
    protected static Map<String, Map<String, Map<String, Object>>>
            convertDataObjects(List<DataObject> daos,
                    Set<Service> allServices) {
        
        Map<String, Map<String, Map<String, Object>>> ret =
            new HashMap<String, Map<String, Map<String, Object>>>(daos.size());
        
        for (DataObject dao: daos) {
            Map<String, Map<String, Object>> entry =
                new HashMap<String, Map<String, Object>>();
            for (Element elem: dao.getElement()) {
                Map<String, Object> type = new HashMap<String, Object>();
                type.put("type", elem.getTypeRef());
                type.put("isList", elem.isIsList());
                type.put(SUPPORTS_RUNTIME_ACCESS_KEY, false);
                type.put("isObject", Boolean.FALSE);

                for (Service service: allServices) {
                    for (DataObject daoT:
                            service.getDataobjects().getDataobject()) {
                        if (daoT.getJavaType().equals(elem.getTypeRef())) {
                            type.put(SUPPORTS_RUNTIME_ACCESS_KEY,
                                    service.getCRUDService());
                            type.put("isObject", true);
                        }
                    }
                }
                
                entry.put(elem.getName(), type);
            }
            
            ret.put(dao.getJavaType(), entry);
        }
        
        return ret;
    }

    
    // spring-managed beans
    private DesignServiceManager designServiceManager;
    private DeploymentManager deploymentManager;

    public DesignServiceManager getDesignServiceManager() {
        return designServiceManager;
    }

    public void setDesignServiceManager(DesignServiceManager designServiceManager) {
        this.designServiceManager = designServiceManager;
    }

    public DeploymentManager getDeploymentManager() {
        return deploymentManager;
    }

    public void setDeploymentManager(DeploymentManager deploymentManager) {
        this.deploymentManager = deploymentManager;
    }
}

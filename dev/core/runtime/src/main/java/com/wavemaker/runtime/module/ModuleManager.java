/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.module;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.xml.bind.JAXBException;

import org.apache.log4j.Logger;
import org.springframework.beans.MutablePropertyValues;
import org.springframework.beans.PropertyValue;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.TypedStringValue;
import org.springframework.beans.factory.support.SimpleBeanDefinitionRegistry;
import org.springframework.beans.factory.xml.XmlBeanDefinitionReader;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.util.ResourceUtils;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.Tuple;

/**
 * The ModulesManager. This provides methods to access all known modules.
 * 
 * @author Matt Small
 */
public class ModuleManager {

    /** Logger for this class and subclasses */
    protected final Logger logger = Logger.getLogger(getClass());

    private final ClassLoader classLoader;

    /**
     * Map from module name to a tuple&lt;location of module-config, the modulewire&gt;.
     */
    private final Map<String, Tuple.Two<URL, ModuleWire>> moduleLocations = new HashMap<String, Tuple.Two<URL, ModuleWire>>();

    public static final String MODULE_CONFIG_FILE = "module-configuration.xml";

    public ModuleManager() {
        this.classLoader = null;
    }

    public ModuleManager(ClassLoader cl) {
        this.classLoader = cl;
    }

    /**
     * Get a single module that corresponds with the entryPoint.
     * 
     * @param extensionPoint
     * @return A single module, null if no modules matched.
     * @throws WMRuntimeException if more than one module matching entryPoint is found.
     */
    public ModuleWire getModule(String extensionPoint) {

        List<ModuleWire> modules = getModules(extensionPoint);
        if (modules.size() > 1) {
            throw new WMRuntimeException(MessageResource.TOO_MANY_MODULES_FOR_EXTENSION_POINT, extensionPoint, modules);
        } else if (modules.size() == 1) {
            return modules.get(0);
        } else {
            return null;
        }
    }

    /**
     * Get all modules matching the entryPoint.
     * 
     * @param extensionPoint
     * @return A list of all modules matching the entryPoint (the list will be empty if none are found).
     */
    public List<ModuleWire> getModules(String extensionPoint) {

        List<ModuleWire> ret = new ArrayList<ModuleWire>();
        for (Tuple.Two<URL, ModuleWire> tuple : this.moduleLocations.values()) {
            if (extensionPoint.equals(tuple.v2.getExtensionPoint())) {
                ret.add(tuple.v2);
            }
        }
        return ret;
    }

    /**
     * Get the module with the specified unique name.
     * 
     * @param name The name to search for.
     * @return The corresponding ModuleWire, or null if none was found.
     */
    public ModuleWire getModuleByName(String name) {

        if (this.moduleLocations.containsKey(name)) {
            return this.moduleLocations.get(name).v2;
        } else {
            return null;
        }
    }

    /**
     * Add a ModuleWire to the current configuration.
     * 
     * @param moduleWire The ModuleWire to add.
     */
    public void addModuleWire(ModuleWire moduleWire) {

        URL ur;
        try {
            ur = findModuleLocation(moduleWire.getName());
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        } catch (JAXBException e) {
            throw new WMRuntimeException(e);
        }

        if (null == ur) {
            throw new WMRuntimeException(MessageResource.MODULE_NOT_FOUND, moduleWire.getName(), moduleWire);
        } else if (this.moduleLocations.containsKey(moduleWire.getName())) {
            if (this.moduleLocations.get(moduleWire.getName()).v1.equals(ur)) {
                this.logger.debug("Skipping ModuleWire that already exists " + moduleWire.getName() + " (location " + ur + ")");
            } else {
                throw new WMRuntimeException(MessageResource.MODULE_DUPLICATE, moduleWire.getName(),
                    this.moduleLocations.get(moduleWire.getName()).v1, ur);
            }
        } else {
            this.logger.info("Adding ModuleWire " + moduleWire.getName() + " (" + moduleWire + ") at location " + ur);
            this.moduleLocations.put(moduleWire.getName(), new Tuple.Two<URL, ModuleWire>(ur, moduleWire));
        }
    }

    /**
     * List all the extension points that loaded modules have registered for. In other words, this isn't a list of all
     * the available extension points, but rather the ones that the current set of modules are available for.
     * 
     * @return The list of extension points, in an unmodifiable Set.
     */
    public Set<String> listExtensionPoints() {

        Set<String> ret = new HashSet<String>();
        for (Tuple.Two<URL, ModuleWire> tuple : this.moduleLocations.values()) {
            ret.add(tuple.v2.getExtensionPoint());
        }

        return Collections.unmodifiableSet(ret);
    }

    /**
     * List all available module ids.
     * 
     * @return The list of module ids, in an unmodifiable Set.
     */
    public Set<String> listModules() {

        return Collections.unmodifiableSet(this.moduleLocations.keySet());
    }

    /**
     * Get the specified Resource from the specified ModuleWire.
     * 
     * @param moduleWire The ModuleWire to access resources in.
     * @param relativePath The relative path within the module to access.
     * @return The resource, suitable for reading.
     */
    public URL getModuleResource(ModuleWire moduleWire, String relativePath) throws MalformedURLException, FileNotFoundException {

        File moduleRoot = getModuleRoot(moduleWire.getName());

        if (moduleRoot.isDirectory()) {
            File f = new File(moduleRoot, relativePath);
            return f.toURL();
        } else {
            StringBuffer ret = new StringBuffer();

            ret.append("jar:" + moduleRoot.toURL() + "!");
            if (!relativePath.startsWith("/")) {
                ret.append("/");
            }
            ret.append(relativePath);

            return new URL(ret.toString());
        }
    }

    /**
     * Find the modules location.
     * 
     * @param name The name of the module.
     * @return The location on disk; either the module's root, or a pointer to the jar containing the module.
     * @throws MalformedURLException
     * @throws FileNotFoundException
     */
    protected File getModuleRoot(String name) throws MalformedURLException, FileNotFoundException {

        Tuple.Two<URL, ModuleWire> tuple = this.moduleLocations.get(name);
        if (null == tuple) {
            throw new WMRuntimeException(MessageResource.MODULE_UNINITIALIZED, name);
        }

        URL url = tuple.v1;
        if (ResourceUtils.isJarURL(url)) {
            URL jarURL = ResourceUtils.extractJarFileURL(url);
            return ResourceUtils.getFile(jarURL);
        } else {
            return ResourceUtils.getFile(url).getParentFile();
        }
    }

    /**
     * Scan the classpath for all modules, and add them to the registry.
     * 
     * @throws IOException
     * @throws JAXBException
     */
    protected URL findModuleLocation(String moduleName) throws IOException, JAXBException {

        PathMatchingResourcePatternResolver searcher;
        if (null == this.classLoader) {
            searcher = new PathMatchingResourcePatternResolver();
        } else {
            searcher = new PathMatchingResourcePatternResolver(this.classLoader);
        }

        org.springframework.core.io.Resource resources[] = searcher.getResources("classpath*:/" + MODULE_CONFIG_FILE);
        for (org.springframework.core.io.Resource resource : resources) {
            if (resource instanceof UrlResource) {
                UrlResource ur = (UrlResource) resource;

                List<BeanDefinition> beans = readSpringBean(resource);
                for (BeanDefinition bean : beans) {
                    MutablePropertyValues props = bean.getPropertyValues();

                    PropertyValue val = props.getPropertyValue("name");
                    String name;
                    if (null == val) {
                        throw new WMRuntimeException(MessageResource.MODULEWIRE_MISSING_NAME, ur);
                    } else if (null != val.getConvertedValue()) {
                        name = (String) val.getConvertedValue();
                    } else if (val.getValue() instanceof TypedStringValue) {
                        name = ((TypedStringValue) val.getValue()).getValue();
                    } else {
                        throw new WMRuntimeException(MessageResource.MODULE_BAD_NAME, val.getValue(),
                            null != val.getValue() ? val.getValue().getClass() : null, ur);
                    }

                    if (null == name || "".equals(name)) {
                        throw new WMRuntimeException(MessageResource.MODULEWIRE_MISSING_NAME, ur);
                    }

                    if (moduleName.equals(name)) {
                        return resource.getURL();
                    }
                }
            } else {
                throw new WMRuntimeException(MessageResource.MODULE_UNKNOWN_RESOURCE_TYPE, resource, resource.getClass());
            }
        }

        return null;
    }

    protected Map<String, Tuple.Two<URL, ModuleWire>> getModuleLocations() {
        return this.moduleLocations;
    }

    private List<BeanDefinition> readSpringBean(org.springframework.core.io.Resource resource) {

        SimpleBeanDefinitionRegistry registry = new SimpleBeanDefinitionRegistry();
        XmlBeanDefinitionReader reader = new XmlBeanDefinitionReader(registry);
        reader.loadBeanDefinitions(resource);

        List<BeanDefinition> ret = new ArrayList<BeanDefinition>();

        for (String beanName : registry.getBeanDefinitionNames()) {
            BeanDefinition beandef = registry.getBeanDefinition(beanName);
            if (beandef.getBeanClassName().equals(ModuleWire.class.getName())) {
                ret.add(beandef);
            }
        }

        return ret;
    }
}

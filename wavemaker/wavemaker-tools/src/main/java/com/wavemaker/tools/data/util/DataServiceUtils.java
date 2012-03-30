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

package com.wavemaker.tools.data.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.xml.bind.JAXBException;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.CastUtils;
import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.common.util.XMLWriter;
import com.wavemaker.json.type.OperationEnumeration;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.data.DataServiceDefinition;
import com.wavemaker.runtime.data.DataServiceInternal;
import com.wavemaker.runtime.data.DataServiceMetaData;
import com.wavemaker.runtime.data.DataServiceRuntimeException;
import com.wavemaker.runtime.data.ExternalDataModelConfig;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.runtime.service.definition.ServiceDefinition;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.data.BeanInfo;
import com.wavemaker.tools.data.ColumnInfo;
import com.wavemaker.tools.data.DataModelConfiguration;
import com.wavemaker.tools.data.EntityInfo;
import com.wavemaker.tools.data.PropertyInfo;
import com.wavemaker.tools.data.RelatedInfo;
import com.wavemaker.tools.data.SpringCfgGenerator;
import com.wavemaker.tools.data.parser.HbmConstants;
import com.wavemaker.tools.project.StudioFileSystem;
import com.wavemaker.tools.service.FileService;
import com.wavemaker.tools.service.codegen.GenerationUtils;
import com.wavemaker.tools.service.definitions.DataObject;
import com.wavemaker.tools.service.definitions.DataObject.Element;
import com.wavemaker.tools.service.definitions.DataObjects;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.SpringServiceDefinitionWrapper;
import com.wavemaker.tools.spring.beans.Beans;

/**
 * @author Simon Toens
 */
public class DataServiceUtils {

    private static final String CONSTANTS_CLASS_SUFFIX = "Constants";

    private static List<OperationEnumeration> NO_CHANGE_OPERATIONS = new ArrayList<OperationEnumeration>(3);
    static {
        NO_CHANGE_OPERATIONS.add(OperationEnumeration.delete);
        NO_CHANGE_OPERATIONS.add(OperationEnumeration.read);
        NO_CHANGE_OPERATIONS.add(OperationEnumeration.update);
    }

    private static List<OperationEnumeration> EXCLUDE_OPERATIONS = new ArrayList<OperationEnumeration>(1);
    static {
        EXCLUDE_OPERATIONS.add(OperationEnumeration.insert);
    }

    private static final Collection<String> QUERY_ANNOTATIONS = new HashSet<String>(1);
    static {
        QUERY_ANNOTATIONS.add(DataServiceConstants.GENERATED_QUERY);
    }

    public static final DataModelConfiguration.UpdateCallback NOOP_UPDATE_CALLBACK = new DataModelConfiguration.UpdateCallback() {

        @Override
        public void update(DataServiceDefinition dataServiceDefinition) {
        }
    };

    public static final Collection<String> RESERVED_WORDS = new HashSet<String>(1);

    static {
        RESERVED_WORDS.add(DataServiceConstants.DATA_PACKAGE_NAME);
    }

    public static List<Class<?>> getTypesForGeneratedQueries(DataServiceMetaData metaData) {
        if (metaData.getEntityClasses().isEmpty()) {
            return Collections.emptyList();
        }
        List<Class<?>> rtn = new ArrayList<Class<?>>(1);
        for (Class<?> c : metaData.getEntityClasses()) {
            String idPropertyName = metaData.getIdPropertyName(c);
            if (!metaData.isCompositeProperty(c, idPropertyName)) {
                // prefer a type that doesn't have a composite id
                rtn.add(c);
                return rtn;
            }
        }
        rtn.add(metaData.getEntityClasses().iterator().next());
        return rtn;
    }

    public static String getCfgFileName(String serviceId) {
        return serviceId + DataServiceConstants.SPRING_CFG_EXT;
    }

    public static void setupElementTypeFactory(final DataModelConfiguration mgr, DataServiceInternal dataServiceDefinition) {

        dataServiceDefinition.setElementTypeFactory(new DataServiceDefinition.ElementTypeFactory() {

            @Override
            public ElementType getElementType(String javaType) {

                ElementType rtn = new ElementType(javaType);

                if (!mgr.isKnownType(javaType)) {
                    return rtn;
                }

                String s = mgr.getEntityName(javaType);

                if (mgr.isHelperType(javaType)) {

                    // query output wrapper
                    BeanInfo bi = mgr.getBean(s);

                    if (bi == null) {
                        throw new AssertionError("BeanInfo for " + s + " cannot be null");
                    }

                    Map<String, String> props = bi.getProperties();

                    for (Map.Entry<String, String> e : props.entrySet()) {
                        String propName = e.getKey();
                        String propType = e.getValue();
                        boolean isList = false;

                        Tuple.Two<String, String> t = GenerationUtils.splitGenericType(propType);
                        if (t != null) {
                            propType = t.v2;
                            isList = true;
                        }

                        ElementType el = new ElementType(propName, propType, isList);
                        rtn.addProperty(el);
                    }

                } else {

                    rtn.setSupportsQuickData(true);

                    EntityInfo ei = mgr.getEntity(s);

                    Collection<PropertyInfo> properties = mgr.getProperties(s);

                    for (PropertyInfo p : properties) {

                        ElementType el = new ElementType(p.getName(), getJavaTypeName(p), isList(p));

                        configureElementType(p, el);

                        rtn.addProperty(el);

                        if (mgr.isValueType(el.getJavaType())) {
                            el.setTopLevel(true);
                        }

                        addCompositeProperties(ei, p, el);
                    }
                }
                return rtn;
            }
        });
    }

    public static ServiceDefinition unwrap(ServiceDefinition def) {
        if (def instanceof SpringServiceDefinitionWrapper) {
            return ((SpringServiceDefinitionWrapper) def).unwrap();
        }
        return def;
    }

    public static DataServiceDefinition unwrapAndCast(ServiceDefinition def) {
        if (def instanceof SpringServiceDefinitionWrapper) {
            def = ((SpringServiceDefinitionWrapper) def).unwrap();
        }
        return (DataServiceDefinition) def;
    }

    public static String getDefaultPackage(String serviceName) {
        return DataServiceConstants.DEFAULT_PACKAGE_ROOT + serviceName;
    }

    public static String getDefaultDataPackage(String serviceName) {
        return StringUtils.fq(getDefaultPackage(serviceName), DataServiceConstants.DATA_PACKAGE_NAME);
    }

    public static String removePrefix(Properties p) {

        String rtn = null;

        for (String key : new HashSet<String>(CastUtils.<String> cast(p.keySet()))) {

            String newKey = key;

            int i = key.indexOf(".");

            if (i > -1) {
                rtn = key.substring(0, i);
                newKey = key.substring(i + 1);
            }

            String value = (String) p.remove(key);
            p.setProperty(newKey, value);
        }

        if (ObjectUtils.isNullOrEmpty(rtn)) {
            rtn = null;
        }

        return rtn;
    }

    public static Properties addPrefix(String prefix, Properties p) {

        if (prefix == null) {
            return p;
        }

        Properties rtn = new Properties();

        if (!prefix.endsWith(DataServiceConstants.PROP_SEP)) {
            prefix += DataServiceConstants.PROP_SEP;
        }

        for (String key : new HashSet<String>(CastUtils.<String> cast(p.keySet()))) {

            String newKey = key;
            if (!newKey.startsWith(prefix)) {
                newKey = prefix + key;
            }
            rtn.setProperty(newKey, p.getProperty(key));
        }

        return rtn;
    }

    public static Properties readProperties(InputStream is) {
        return SystemUtils.loadPropertiesFromStream(is);
    }

    public static void writeProperties(Properties p, File destdir, String serviceName) {

        File f = new File(destdir, serviceName + DataServiceConstants.PROPERTIES_FILE_EXT);

        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(f);
            writeProperties(p, fos, serviceName);
        } catch (IOException ex) {
            throw new DataServiceRuntimeException(ex);
        } finally {
            try {
                fos.close();
            } catch (Exception ignore) {
            }
        }
    }

    public static void writeProperties(Properties p, Resource destdir, String serviceName) {
        StudioFileSystem fileSystem = (StudioFileSystem) RuntimeAccess.getInstance().getSpringBean("fileSystem");
        writeProperties(p, destdir, serviceName, fileSystem);
    }

    public static void writeProperties(Properties p, Resource destdir, String serviceName, StudioFileSystem fileSystem) {
        Resource f = null;
        try {
            f = destdir.createRelative(serviceName + DataServiceConstants.PROPERTIES_FILE_EXT);
        } catch (IOException ex) {

        }

        OutputStream fos = null;
        try {
            // fos = new FileOutputStream(f);
            fos = fileSystem.getOutputStream(f);
            writeProperties(p, fos, serviceName);
            // } catch (IOException ex) {
            // throw new DataServiceRuntimeException(ex);
        } finally {
            try {
                fos.close();
            } catch (Exception ignore) {
            }
        }
    }

    public static void writeProperties(Properties p, OutputStream os, String serviceName) {

        String comment = getPropertiesFileComment(serviceName);

        // obfuscate password
        String key = serviceName + DataServiceConstants.DB_PASS;
        String pw = p.getProperty(key);
        if (pw != null && !SystemUtils.isEncrypted(pw)) {
            p.setProperty(key, SystemUtils.encrypt(pw));
        }

        SystemUtils.writePropertiesFile(os, p, comment);
    }

    public static String getPropertiesFileComment(String serviceName) {
        return "Properties for " + serviceName;
    }

    public static Properties addServiceName(Properties p, String serviceName) {

        String prefix = serviceName + DataServiceConstants.PROP_SEP;

        return addPrefix(prefix, p);
    }

    public static Resource createEmptyDataModel(Resource destDir, String serviceId, String packageName, String dataPackage) {

        // File rtn = new File(destDir, getCfgFileName(serviceId));
        Resource rtn;
        try {
            rtn = destDir.createRelative(getCfgFileName(serviceId));
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }

        StudioFileSystem fileSystem = (StudioFileSystem) RuntimeAccess.getInstance().getSpringBean("fileSystem");

        SpringCfgGenerator g = new SpringCfgGenerator();
        try {
            g.setDestDir(fileSystem.getParent(rtn));
            g.setPackage(packageName);
            g.setDataPackage(dataPackage);
            g.setServiceName(serviceId);
            // write some parsable values into
            // connection properties
            g.setDefaultDBType();

            g.run();
        } finally {
            g.dispose();
        }

        return rtn;
    }

    public static String sanitizeComment(String comment) {
        if (comment == null) {
            return null;
        }
        for (String anno : QUERY_ANNOTATIONS) {
            int i = comment.indexOf(anno);
            if (i > -1) {
                String s = comment.substring(0, i);
                int j = i + anno.length();
                if (j == anno.length()) {
                    comment = s;
                } else {
                    comment = s + comment.substring(j);
                }
            }
        }
        return comment.trim();
    }

    public static String getDefaultQueryFileName(Collection<String> reservedNames) {
        return StringUtils.getUniqueName(DataServiceConstants.DEFAULT_QUERY_FILE, reservedNames);
    }

    public static boolean isDefaultQueryStore(String comment) {
        return queryHasAnnotation(comment, DataServiceConstants.DEFAULT_QUERY_STORE);
    }

    public static boolean isGeneratedQuery(String comment) {
        return queryHasAnnotation(comment, DataServiceConstants.GENERATED_QUERY);
    }

    public static String addGeneratedAnnotation(String comment, XMLWriter writer) {
        return addAnnotation(comment, DataServiceConstants.GENERATED_QUERY, writer);
    }

    public static Service toService(Collection<EntityInfo> entities) {
        Service rtn = new Service();
        rtn.setDataobjects(new DataObjects());
        for (EntityInfo ei : entities) {
            String javaType = StringUtils.fq(ei.getPackageName(), ei.getEntityName());
            List<PropertyInfo> properties = new ArrayList<PropertyInfo>();

            if (ei.getId() == null) {
                throw new AssertionError("id property cannot be null");
            }

            properties.add(ei.getId());
            properties.addAll(ei.getProperties());
            addTypeToService(javaType, rtn, properties);
        }
        return rtn;
    }

    public static Collection<String> getServiceClassNames(String packageName, String serviceName) {
        Collection<String> rtn = new HashSet<String>(2);
        String serviceClassName = StringUtils.fq(packageName, getServiceClassName(serviceName));
        rtn.add(serviceClassName);
        rtn.add(getConstantsClassName(serviceClassName));
        return rtn;
    }

    public static ExternalDataModelConfig getDummyExternalConfig() {
        return new ExternalDataModelConfig() {

            @Override
            public boolean returnsSingleResult(String operationName) {
                return false;
            }

            @Override
            public String getOutputType(String operationName) {
                return null;
            }

            @Override
            public String getServiceClass() {
                return "";
            }
        };
    }

    public static Beans readBeans(FileService fileService, String path) {
        String springConfig = null;
        try {
            springConfig = fileService.readFile(path);
        } catch (IOException ex) {
            throw new ConfigurationException(ex);
        }
        try {
            return SpringConfigSupport.readBeans(springConfig);
        } catch (JAXBException ex) {
            throw new ConfigurationException(ex);
        } catch (IOException ex) {
            throw new ConfigurationException(ex);
        }
    }

    public static Beans readBeans(File springConfig, FileService fileService) {
        try {
            return SpringConfigSupport.readBeans(new FileSystemResource(springConfig), fileService);
        } catch (JAXBException ex) {
            throw new ConfigurationException(ex);
        } catch (IOException ex) {
            throw new ConfigurationException(ex);
        }
    }

    @Deprecated
    public static void writeBeans(Beans beans, FileService fileService, String path) {
        Writer writer = null;
        try {
            writer = fileService.getWriter(path);
            SpringConfigSupport.writeBeans(beans, writer);
            writer.close();
        } catch (IOException ex) {
            throw new ConfigurationException(ex);
        } catch (JAXBException ex) {
            throw new ConfigurationException(ex);
        } finally {
            try {
                writer.close();
            } catch (Exception ignore) {
            }
        }
    }

    public static boolean isAllowNull(PropertyInfo p) {

        if (p.getIsInverse()) {
            return true;
        }

        ColumnInfo ci = p.getColumn();

        if (ci != null) {
            return !ci.getNotNull();
        }

        return false;
    }

    public static List<OperationEnumeration> getExcludedOperations(PropertyInfo p) {

        ColumnInfo ci = p.getColumn();

        if (p.getIsId()) {
            if (ci != null && ci.generated()) {
                return EXCLUDE_OPERATIONS;
            }
        }

        return Collections.emptyList();
    }

    public static List<OperationEnumeration> getNoChangeOperations(PropertyInfo p) {

        if (p.getIsId()) {
            return NO_CHANGE_OPERATIONS;
        }
        return Collections.emptyList();
    }

    public static List<OperationEnumeration> getRequiredOperations(PropertyInfo p) {

        List<OperationEnumeration> rtn = new ArrayList<OperationEnumeration>();

        ColumnInfo ci = p.getColumn();

        if (p.getIsId()) {
            rtn.add(OperationEnumeration.delete);
            rtn.add(OperationEnumeration.read);
            rtn.add(OperationEnumeration.update);

            if (ci == null) {
                rtn.add(OperationEnumeration.insert);
            } else {
                if (!ci.generated()) {
                    rtn.add(OperationEnumeration.insert);
                }
            }
        }

        return rtn;
    }

    public static String getServiceClassName(String serviceName) {
        return StringUtils.upperCaseFirstLetter(serviceName);
    }

    public static String getConstantsClassName(String serviceClassName) {
        return serviceClassName + CONSTANTS_CLASS_SUFFIX;
    }

    private static void addTypeToService(String javaType, Service service, Collection<PropertyInfo> properties) {
        DataObject o = new DataObject();
        service.getDataobjects().getDataobject().add(o);
        o.setJavaType(javaType);
        o.setName(StringUtils.splitPackageAndClass(javaType).v2);
        Collection<PropertyInfo> added = new HashSet<PropertyInfo>();
        for (PropertyInfo pi : properties) {
            if (added.contains(pi)) {
                continue;
            }
            addProperty(pi, o);
            added.add(pi);
            if (!pi.getIsRelated() && pi.hasCompositeProperties()) {
                addTypeToService(pi.getFullyQualifiedType(), service, pi.getCompositeProperties());
            }
        }
    }

    private static void addProperty(PropertyInfo pi, DataObject o) {
        Element e = new Element();
        o.getElement().add(e);
        e.setName(pi.getName());
        e.setTypeRef(pi.javaType());
        e.setIsList(pi.getIsInverse());
    }

    private static boolean queryHasAnnotation(String comment, String anno) {
        return getAnnotation(comment, anno) != null;
    }

    private static String getAnnotation(String comment, String anno) {

        if (comment == null) {
            return null;
        }

        int i = comment.indexOf(anno);
        if (i == -1) {
            return null;
        }

        int j = comment.indexOf(DataServiceConstants.ANNO_CHAR, i + 1);

        if (j == -1) {
            j = comment.length();
        }

        return comment.substring(i + anno.length(), j).trim();
    }

    private static String addAnnotation(String comment, String anno, XMLWriter writer) {

        if (comment == null) {
            comment = "";
        }
        String sep = writer.willCloseOnNewLine() ? writer.getLineSep() : "";
        StringBuilder sb = new StringBuilder();
        if (writer.willCloseOnNewLine()) {
            sb.append(writer.getIndent());
            for (int i = 0; i < HbmConstants.COMMENT_ATTR.length() + 2; i++) {
                sb.append(" ");
            }
        }
        return comment + sep + sb.toString() + anno;
    }

    private static boolean isList(PropertyInfo p) {
        return p.getCardinality() != null && p.getCardinality() == RelatedInfo.Cardinality.OneToMany;
    }

    private static String getJavaTypeName(PropertyInfo p) {
        return p.javaType();
    }

    private static void configureElementType(PropertyInfo p, ElementType el) {

        el.setAllowNull(isAllowNull(p));
        el.setNoChange(getNoChangeOperations(p));
        el.setRequire(getRequiredOperations(p));
        el.setExclude(getExcludedOperations(p));
    }

    private static void addCompositeProperties(EntityInfo ei, PropertyInfo p, ElementType el) {

        if (p.getCompositeProperties() == null) {
            return;
        }

        for (PropertyInfo p2 : p.getCompositeProperties()) {
            ElementType el2 = new ElementType(p2.getName(), getJavaTypeName(p2), isList(p2));
            configureElementType(p2, el2);
            el.addProperty(el2);
            addCompositeProperties(ei, p2, el2);
        }
    }

    private DataServiceUtils() {
        throw new UnsupportedOperationException();
    }
}

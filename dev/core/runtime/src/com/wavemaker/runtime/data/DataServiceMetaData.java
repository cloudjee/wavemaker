/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
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
package com.wavemaker.runtime.data;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.File;
import java.lang.reflect.Method;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.engine.NamedQueryDefinition;
import org.hibernate.mapping.Component;
import org.hibernate.mapping.Property;
import org.hibernate.mapping.RootClass;
import org.hibernate.mapping.Value;
import org.hibernate.type.Type;

import com.wavemaker.common.Resource;
import com.wavemaker.common.util.*;
import com.wavemaker.runtime.data.spring.ConfigurationRegistry;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.data.util.DataServiceUtils;
import com.wavemaker.runtime.data.parser.HbmQueryParser;
import com.wavemaker.runtime.WMAppContext;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.ws.salesforce.SalesforceSupport;

/**
 * Interface to wraps a Data Source Configuration with convenience methods.
 * 
 * @author slee
 */
public interface DataServiceMetaData {

    public void init(Session session, boolean useIndividualCRUDOperations);

    public void init(String configurationName);

    public void dispose();

    public String getName();

    public String getServiceClassName();

    public void setHelperClassNames(Collection<String> helperClassNames);

    public Collection<String> getHelperClassNames();

    public void setServiceClassName(String serviceClassName);

    public Configuration getConfiguration();

    public Collection<String> getEntityClassNames();

    public List<Class<?>> getEntityClasses();

    public boolean refreshEntity(Class<?> c);

    public String getIdPropertyName(Class<?> c);

    public boolean isCompositeProperty(Class<?> c, String propertyName);

    public Collection<String> getRelPropertyNames(Class<?> c);

    public Property getProperty(String className, String propertyName);

    public String getDataPackage();

    public boolean isEntity(Class<?> c);

    public Collection<String> getOperationNames();

    public NamedQueryDefinition getQueryDefinition(String queryName);

    public DataServiceOperation getOperation(String operationName);
}

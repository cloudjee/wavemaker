/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.data;

import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;

import org.hibernate.Hibernate;
import org.hibernate.type.Type;

import com.wavemaker.common.util.StringUtils;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class DataTypeMapper {

    public static Class<?> getJavaType(Type type) {
        return HB_TYPE_TO_JAVA_TYPE.get(type);
    }
    
    public static Class<?> getJavaType(String type) {
        return HB_STR_TYPE_TO_JAVA_TYPE.get(type);
    }
    
    public static String getHibernateType(String type) {
        Type t = JAVA_TYPE_TO_HB_TYPE.get(type);
        if (t == null) {
            return StringUtils.fromLastOccurrence(type, ".");
        }
        return t.getName();
    }
    
    public static String getFQHibernateType(String type) {
        Type t = JAVA_TYPE_TO_HB_TYPE.get(type);
        if (t == null) {
            return type;
        }
        return t.getName();
    }

    private static final Collection<Type> HB_TYPES = 
	new LinkedHashSet<Type>(31);
    static {
        HB_TYPES.add(Hibernate.BIG_DECIMAL);
        HB_TYPES.add(Hibernate.BIG_INTEGER);
        HB_TYPES.add(Hibernate.BINARY);
        HB_TYPES.add(Hibernate.BLOB);
        HB_TYPES.add(Hibernate.BOOLEAN);
        HB_TYPES.add(Hibernate.BYTE);
        HB_TYPES.add(Hibernate.CALENDAR);
        HB_TYPES.add(Hibernate.CALENDAR_DATE);
        HB_TYPES.add(Hibernate.CHARACTER);
        HB_TYPES.add(Hibernate.CHARACTER_ARRAY);
        HB_TYPES.add(Hibernate.CHAR_ARRAY);
        HB_TYPES.add(Hibernate.CLASS);
        HB_TYPES.add(Hibernate.CLOB);
        HB_TYPES.add(Hibernate.CURRENCY);
        HB_TYPES.add(Hibernate.DATE);
        HB_TYPES.add(Hibernate.DOUBLE);
        HB_TYPES.add(Hibernate.FLOAT);
        HB_TYPES.add(Hibernate.INTEGER);
        HB_TYPES.add(Hibernate.LOCALE);
        HB_TYPES.add(Hibernate.LONG);
        HB_TYPES.add(Hibernate.OBJECT);
        HB_TYPES.add(Hibernate.SERIALIZABLE);
        HB_TYPES.add(Hibernate.SHORT);
        HB_TYPES.add(Hibernate.STRING);
        HB_TYPES.add(Hibernate.TEXT);
        HB_TYPES.add(Hibernate.TIME);
        HB_TYPES.add(Hibernate.TIMESTAMP);
        HB_TYPES.add(Hibernate.TIMEZONE);
        HB_TYPES.add(Hibernate.TRUE_FALSE);
        HB_TYPES.add(Hibernate.WRAPPER_BINARY);
        HB_TYPES.add(Hibernate.YES_NO);
    }
    
    private static final Map<String, Type> JAVA_TYPE_TO_HB_TYPE = 
	new HashMap<String, Type>(HB_TYPES.size() + 2);
    static {
	for (Type t : HB_TYPES) {
	    
	    // don't map java boolean type to Hibernate's 
	    // TRUE_FALSE/YES_NO types by default
	    if (t == Hibernate.TRUE_FALSE || t == Hibernate.YES_NO) {
	        continue;
	    }
	    
	    JAVA_TYPE_TO_HB_TYPE.put(t.getReturnedClass().getName(), t);
	}

	JAVA_TYPE_TO_HB_TYPE.put("java.lang.String", Hibernate.STRING);
        JAVA_TYPE_TO_HB_TYPE.put("int", Hibernate.INTEGER);
        JAVA_TYPE_TO_HB_TYPE.put(java.sql.Date.class.getName(), 
				 Hibernate.DATE);        
    }
        
    private static final Map<Type, Class<?>> HB_TYPE_TO_JAVA_TYPE = 
	new HashMap<Type, Class<?>>(HB_TYPES.size());
    static {
	for (Type t : HB_TYPES) {
	    HB_TYPE_TO_JAVA_TYPE.put(t, t.getReturnedClass());
	}
    }
    
    private static final Map<String, Class<?>> HB_STR_TYPE_TO_JAVA_TYPE = 
	new HashMap<String, Class<?>>(HB_TYPE_TO_JAVA_TYPE.size());
    static {
        for (Map.Entry<Type, Class<?>> e : HB_TYPE_TO_JAVA_TYPE.entrySet()) {
            HB_STR_TYPE_TO_JAVA_TYPE.put(e.getKey().getName(), e.getValue());
        }
    }

    private DataTypeMapper() {
        throw new UnsupportedOperationException();
    }
}

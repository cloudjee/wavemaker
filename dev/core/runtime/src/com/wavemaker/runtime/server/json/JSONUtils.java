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
package com.wavemaker.runtime.server.json;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMException;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.AlternateJSONTransformer;
import com.wavemaker.json.JSONArray;
import com.wavemaker.json.JSONObject;
import com.wavemaker.json.JSONState;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.TypeState;
import com.wavemaker.json.type.reflect.ReflectTypeUtils;
import com.wavemaker.runtime.server.JSONParameterTypeField;
import com.wavemaker.runtime.service.ParsedServiceArguments;

/**
 * JSON utility methods.
 * 
 * @author Matt Small
 * @version $Rev$ - $Date$
 * 
 */
public/* static */class JSONUtils {

    private JSONUtils() {
        throw new UnsupportedOperationException();
    }
    
    private static final Log logger = LogFactory.getLog(JSONUtils.class);
    
    /**
     * Convert a JSONArray into an array of objects, with types as specified in
     * the paramTypes argument.
     * 
     * @param params
     *            JSONArray of data to convert.
     * @param paramTypes
     *            An array of Class objects, specifying the output types.
     * @return An array of Objects; data is from params, and the types match
     *         those of paramTypes.
     * @throws WMException
     */
    public static ParsedServiceArguments convertJSONToObjects(JSONArray params,
            Method method, JSONState jsonState) {
        
        return convertJSONToObjects(params,
                getParameterTypes(method, params, jsonState.getTypeState()),
                jsonState);
    }

    /**
     * Convert a JSONArray into an array of objects, with types as specified in
     * the paramTypes argument.
     * 
     * @param params
     *            JSONArray of data to convert.
     * @param fieldDefinitions
     *            A List of FieldDefinitions, specifying the type of each
     *            argument (in an order matching that of the arguments).
     * @return An array of Objects; data is from params, and the types match
     *         those of paramTypes.
     * @throws WMException
     */
    public static ParsedServiceArguments convertJSONToObjects(JSONArray params,
            List<FieldDefinition> fieldDefinitions, JSONState jsonState) {
        
        Object[] objects = new Object[fieldDefinitions.size()];
        List<List<String>> deserializedProps = new ArrayList<List<String>>(fieldDefinitions.size());
        
        for (int i=0;i<fieldDefinitions.size();i++) {
            Object elem = params.get(i);
            FieldDefinition fieldDefinition = fieldDefinitions.get(i);
            
            objects[i] = AlternateJSONTransformer.toObject(jsonState,
                    elem, fieldDefinition);
            
            deserializedProps.add(i, jsonState.getSettersCalled());
            jsonState.setSettersCalled(new ArrayList<String>());
        }
        
        if (logger.isDebugEnabled()) {
            logger.debug("Deserialized properties " + deserializedProps);
        }
        
        ParsedServiceArguments psa = new ParsedServiceArguments();
        psa.setArguments(objects);
        psa.setGettersCalled(deserializedProps);
        return psa;
    }

    public static List<FieldDefinition> getParameterTypes(Method m,
            JSONArray params, TypeState typeState) {

        List<FieldDefinition> fieldDefinitions = new ArrayList<FieldDefinition>();
        for (Type type: m.getGenericParameterTypes()) {
            fieldDefinitions.add(ReflectTypeUtils.getFieldDefinition(type,
                    typeState, false, null));
        }
        
        Annotation[][] paramAnnotations = m.getParameterAnnotations();

        for (int i = 0; i < paramAnnotations.length; i++) {
            for (Annotation ann : paramAnnotations[i]) {
                if (ann instanceof JSONParameterTypeField) {

                    JSONParameterTypeField paramTypeField = (JSONParameterTypeField) ann;
                    int pos = paramTypeField.typeParameter();
                    String typeString = (String) params.get(pos);

                    try {
                        Class<?> newType = org.springframework.util.ClassUtils.forName(typeString);
                        
                        if (Collection.class.isAssignableFrom(newType)) {
                            throw new WMRuntimeException(
                                    Resource.JSONUTILS_PARAMTYPEGENERIC, i, m.getName());
                        }
                        
                        fieldDefinitions.set(i,
                                ReflectTypeUtils.getFieldDefinition(newType,
                                        typeState, false, null));
                    } catch (ClassNotFoundException e) {
                        throw new WMRuntimeException(
                                Resource.JSONPARAMETER_COULD_NOTLLOAD_TYPE, e,
                                typeString, m.getName(), i);
                    } catch (LinkageError e) {
                        throw new WMRuntimeException(e);
                    }
                }
            }
        }

        return fieldDefinitions;
    }
    
    public static Object toBean(JSONObject jo, Class<?> klass) {
        
        return AlternateJSONTransformer.toObject(jo, klass);
    }
    
    public static Object toBean(Object jo, Class<?> klass) {

        return AlternateJSONTransformer.toObject(new JSONState(), jo, klass);
    }
    
    public static Object toBean(Object jo, FieldDefinition fieldDefinition,
            JSONState jsonState) {

        return AlternateJSONTransformer.toObject(jsonState, jo,
                fieldDefinition);
    }
}
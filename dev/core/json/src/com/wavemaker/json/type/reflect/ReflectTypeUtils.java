/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.json.type.reflect;

import java.beans.PropertyDescriptor;

import java.lang.reflect.Array;
import java.lang.reflect.GenericArrayType;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import com.wavemaker.common.Resource;
import com.wavemaker.common.WMRuntimeException;

import com.wavemaker.common.util.Tuple;

import com.wavemaker.json.JSON;

import com.wavemaker.json.core.JSONUtils;

import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.GenericFieldDefinition;
import com.wavemaker.json.type.ListTypeDefinition;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.json.type.TypeState;

import org.apache.commons.beanutils.PropertyUtilsBean;

import org.apache.log4j.Logger;

import org.springframework.util.ClassUtils;

/**
 * Type utility methods.  Includes methods for creating types & fields.
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
public class ReflectTypeUtils {

    /** Logger for this class and subclasses */
    protected static final Logger logger = Logger.getLogger(ReflectTypeUtils.class);
    
    /**
     * Gets a ListTypeDefinition from the given type.
     * @param type
     * @param typeState
     * @param strict
     * @return
     */
    public static ListTypeDefinition getListTypeDefinition(Type type,
            TypeState typeState, boolean strict) {

        ListReflectTypeDefinition lrtd = new ListReflectTypeDefinition();
        if (type instanceof Class) {
            Class<?> klass = (Class<?>) type;

            // we already know about this type; we're done
            if (typeState.isTypeKnown(ReflectTypeUtils.getTypeName(klass))) {
                return (ListTypeDefinition) typeState.getType(ReflectTypeUtils.getTypeName(klass));
            }
            
            lrtd.setKlass(klass);
            lrtd.setTypeName(ReflectTypeUtils.getTypeName(type));
        } else if (type instanceof ParameterizedType) {
            ParameterizedType pt = (ParameterizedType) type;
            
            if (!(pt.getRawType() instanceof Class)) {
                throw new WMRuntimeException(Resource.JSON_RAW_TYPE_NOT_CLASS,
                        pt.getRawType());
            }
            
            Class<?> klass = (Class<?>) pt.getRawType();
            if (!(Collection.class.isAssignableFrom(klass))) {
                throw new WMRuntimeException(Resource.JSON_EXPECTED_COLLECTION,
                        klass);
            }

            // we already know about this type; we're done
            if (null != typeState.getType(ReflectTypeUtils.getTypeName(klass))) {
                return (ListTypeDefinition) typeState.getType(ReflectTypeUtils.getTypeName(klass));
            }
            
            lrtd.setKlass(klass);
            lrtd.setTypeName(ReflectTypeUtils.getTypeName(type));
        } else {
            throw new WMRuntimeException(Resource.JSON_UNKNOWN_TYPE, type);
        }
        
        // in other methods, this has to happen earlier to deal with cycles.
        // those shouldn't be a problem here, but if you change the logic above,
        // it might get fucked.
        typeState.addType(lrtd);
        
        return lrtd;
    }

    /**
     * Initializes a TypeDefinition from a given class. The first entry in the
     * return list is the TypeDefinition for the parameter class; any entries
     * after that (if any) are TypeDefinitions for any other types that were
     * required as fields for that root TypeDefinition.
     * 
     * @param klass
     *            The Class object to describe.
     * @param typeState
     *            The TypeState for the current operation.
     * @param strict
     *            True indicates that processing should stop on ambiguous
     *            entries; false indicates that null should be entered.
     * @return A list of TypeDefinitions; the first entry is the root
     *         (corresponding with the klass parameter), any other entries in
     *         the list were required to describe the root TypeDefinition's
     *         fields. The return may also be null, if sufficient information
     *         was not provided to determine the type.
     */
    public static TypeDefinition getTypeDefinition(Type type,
            TypeState typeState, boolean strict) {
        
        Class<?> klass;
        
        // we already know about this type; we're done
        if (typeState.isTypeKnown(ReflectTypeUtils.getTypeName(type))) {
            return typeState.getType(ReflectTypeUtils.getTypeName(type));
        }
        
        // if the type is Object, return null, we can't figure out anything more
        if (type instanceof Class && Object.class.equals(type)) {
            return null;
        }
        
        // if we don't have enough information, return null
        if (!strict) {
            if (type instanceof Class
                    && Map.class.isAssignableFrom((Class<?>) type)
                    && !Properties.class.isAssignableFrom((Class<?>)type)) {
                if (!JSON.class.isAssignableFrom((Class<?>)type)) {
                    logger.warn(Resource.JSON_TYPE_NOGENERICS.getMessage(type));
                }
                return null;
            } else if (type instanceof Class
                    && List.class.isAssignableFrom((Class<?>) type)) {
                if (!JSON.class.isAssignableFrom((Class<?>)type)) {
                    logger.warn(Resource.JSON_TYPE_NOGENERICS.getMessage(type));
                }
                return null;
            }
        }
        
        TypeDefinition ret;
        
        if (type instanceof Class &&
                Properties.class.isAssignableFrom((Class<?>)type)) {
            MapReflectTypeDefinition mtdret = new MapReflectTypeDefinition();
            mtdret.setTypeName(ReflectTypeUtils.getTypeName(type));
            mtdret.setShortName(ReflectTypeUtils.getShortName(type));
            typeState.addType(mtdret);
            
            klass = (Class<?>) type;
            mtdret.setKlass(klass);
            
            TypeDefinition stringType = getTypeDefinition(String.class,
                    typeState, false);
            mtdret.setKeyFieldDefinition(new GenericFieldDefinition(stringType));
            mtdret.setValueFieldDefinition(new GenericFieldDefinition(stringType));
            
            ret = mtdret;
        } else if (type instanceof Class && JSONUtils.isPrimitive((Class<?>)type)) {
            PrimitiveReflectTypeDefinition ptret;
            if (((Class<?>)type).isEnum()) {
                ptret = new EnumPrimitiveReflectTypeDefinition();
            } else {
                ptret = new PrimitiveReflectTypeDefinition();
            }
            
            ptret.setTypeName(ReflectTypeUtils.getTypeName(type));
            ptret.setShortName(ReflectTypeUtils.getShortName(type));
            typeState.addType(ptret);
            
            klass = (Class<?>) type;
            ptret.setKlass(klass);
            
            ret = ptret;
        } else if (type instanceof Class) {
            klass = (Class<?>) type;

            if (Collection.class.isAssignableFrom(klass)) {
                throw new WMRuntimeException(Resource.JSON_TYPE_NOGENERICS,
                        klass);
            } else if (klass.isArray()) {
                throw new WMRuntimeException(Resource.JSON_USE_FIELD_FOR_ARRAY,
                        klass);
            } else if (Map.class.isAssignableFrom(klass)) {
                throw new WMRuntimeException(Resource.JSON_TYPE_NOGENERICS,
                        klass);
            } else if (ClassUtils.isPrimitiveOrWrapper(klass) ||
                    CharSequence.class.isAssignableFrom(klass)) {
                PrimitiveReflectTypeDefinition ptret = new PrimitiveReflectTypeDefinition();
                ptret.setTypeName(ReflectTypeUtils.getTypeName(type));
                ptret.setShortName(ReflectTypeUtils.getShortName(type));
                typeState.addType(ptret);
                
                ptret.setKlass(klass);
                
                ret = ptret;
            } else {
                ObjectReflectTypeDefinition otret = new ObjectReflectTypeDefinition();
                otret.setTypeName(ReflectTypeUtils.getTypeName(type));
                otret.setShortName(ReflectTypeUtils.getShortName(type));
                otret.setKlass(klass);
                typeState.addType(otret);
                
                PropertyUtilsBean pub = ((ReflectTypeState)typeState).getPropertyUtilsBean();
                PropertyDescriptor[] pds = pub.getPropertyDescriptors(klass);
                otret.setFields(new LinkedHashMap<String, FieldDefinition>(
                        pds.length));

                for (PropertyDescriptor pd : pds) {
                    if (pd.getName().equals("class")) {
                        continue;
                    }
                    
                    Type paramType;
                    if (null!=pd.getReadMethod()) {
                        paramType = pd.getReadMethod().getGenericReturnType();
                    } else if (null!=pd.getWriteMethod()) {
                        paramType = pd.getWriteMethod().getGenericParameterTypes()[0];
                    } else {
                        logger.warn("No getter in type " + pd.getName());
                        continue;
                    }

                    otret.getFields().put(pd.getName(),
                            getFieldDefinition(paramType, typeState, strict,
                                    pd.getName()));
                }
                
                ret = otret;
            }
        } else if (type instanceof ParameterizedType) {
            ParameterizedType pt = (ParameterizedType) type;
            
            if (pt.getRawType() instanceof Class &&
                    Map.class.isAssignableFrom((Class<?>)pt.getRawType())) {
                MapReflectTypeDefinition mtdret = new MapReflectTypeDefinition();
                mtdret.setTypeName(ReflectTypeUtils.getTypeName(type));
                mtdret.setShortName(ReflectTypeUtils.getShortName(type));
                typeState.addType(mtdret);
                
                Type[] types = pt.getActualTypeArguments();
                
                mtdret.setKeyFieldDefinition(getFieldDefinition(types[0],
                        typeState, strict, null));
                mtdret.setValueFieldDefinition(getFieldDefinition(types[1],
                        typeState, strict, null));
                mtdret.setKlass((Class<?>)pt.getRawType());
                
                ret = mtdret;
            } else {
                throw new WMRuntimeException(Resource.JSON_TYPE_UNKNOWNRAWTYPE,
                        pt.getOwnerType(), pt);
            }
        } else {
            throw new WMRuntimeException(Resource.JSON_TYPE_UNKNOWNPARAMTYPE,
                    type, (null!=type)?type.getClass():null);
        }
        
        
        return ret;
    }
    
    /**
     * Retrieves the field definition from that field's read method.  This will
     * recursively call get
     * @param method
     * @return
     */
    public static FieldDefinition getFieldDefinition(
            Method method, TypeState typeState, boolean strict, String name) {
        
        return getFieldDefinition(method.getGenericReturnType(), typeState,
                strict, name);
    }

    /**
     * Returns the FieldDefinition for a field of the specified type.
     * 
     * @param type
     * @param typeState
     * @param strict
     *            True if strict mode is on; not enough information will result
     *            in exceptions instead of warnings.
     * @param The
     *            name of this field (if known)
     * @return The corresponding fieldDefinition to the type.
     */
    public static FieldDefinition getFieldDefinition(Type type,
            TypeState typeState, boolean strict, String name) {

        GenericFieldDefinition ret = new GenericFieldDefinition();
        ret.setName(name);
        
        if (null==type) {
            // do nothing, it's null, but do return a FieldDefinition
        } else if (type instanceof Class) {
            Class<?> returnTypeClass = (Class<?>) type;
            
            if (returnTypeClass.isArray()) {
                Tuple.Two<TypeDefinition, List<ListTypeDefinition>> dimAndClass =
                    getArrayDimensions(returnTypeClass, typeState, strict);
                ret.setTypeDefinition(dimAndClass.v1);
                ret.setArrayTypes(dimAndClass.v2);
            } else if (!strict &&
                    Collection.class.isAssignableFrom(returnTypeClass)) {
                if (!JSON.class.isAssignableFrom(returnTypeClass)) {
                    logger.warn(Resource.JSON_TYPE_NOGENERICS.getMessage(returnTypeClass));
                }

                ret.setArrayTypes(new ArrayList<ListTypeDefinition>(1));
                ret.getArrayTypes().add(getListTypeDefinition(returnTypeClass,
                        typeState, strict));
            } else if (ClassUtils.isPrimitiveOrWrapper(returnTypeClass)) {
                TypeDefinition td = getTypeDefinition(returnTypeClass,
                        typeState, strict);
                ret.setTypeDefinition(td);
            } else {
                TypeDefinition td = getTypeDefinition(returnTypeClass,
                        typeState, strict);
                ret.setTypeDefinition(td);
            }
        } else if (type instanceof ParameterizedType) {
            ParameterizedType pt = (ParameterizedType) type;
            
            if (Class.class == pt.getRawType()) {
                TypeDefinition td = getTypeDefinition(Class.class, typeState,
                        strict);
                ret.setTypeDefinition(td);
            } else if (pt.getRawType() instanceof Class &&
                    Collection.class.isAssignableFrom((Class<?>)pt.getRawType())) {
                Tuple.Two<TypeDefinition, List<ListTypeDefinition>> dimAndClass =
                    getArrayDimensions(pt, typeState, strict);
                ret.setTypeDefinition(dimAndClass.v1);
                ret.setArrayTypes(dimAndClass.v2);
            } else if (pt.getRawType() instanceof Class &&
                    Map.class.isAssignableFrom((Class<?>)pt.getRawType())) {
                TypeDefinition td = getTypeDefinition(pt, typeState, strict);
                ret.setTypeDefinition(td);
            } else {
                if (strict) {
                    throw new WMRuntimeException(
                            Resource.JSON_TYPE_UNKNOWNRAWTYPE,
                            pt.getOwnerType(), pt);
                } else {
                    logger.warn(Resource.JSON_TYPE_UNKNOWNRAWTYPE.getMessage(
                                    pt.getOwnerType(), pt));
                }
            }
        } else if (type instanceof GenericArrayType) {
            Tuple.Two<TypeDefinition, List<ListTypeDefinition>> dimAndClass =
                getArrayDimensions(type, typeState, strict);
            ret.setTypeDefinition(dimAndClass.v1);
            ret.setArrayTypes(dimAndClass.v2);
        } else {
            throw new WMRuntimeException(Resource.JSON_TYPE_UNKNOWNPARAMTYPE,
                    type, (null!=type)?type.getClass():null);
        }
        
        return ret;
    }

    /**
     * Returns information about array or collection types.
     * 
     * @param type
     *            The type to introspect.
     * @param typeState
     *            The current TypeState.
     * @param strict
     *            True indicates that processing should stop on ambiguous
     *            entries; false indicates that null should be entered.
     * @return A Tuple.Two containing:
     *         <ol>
     *         <li>The enclosed nested Type; String[][] would return
     *         String.class, while List<Map<String,String>> will return the Type
     *         of Map<String,String>.</li>
     *         <li>The list of all enclosing classes. String[][] will return
     *         [String[][].class, String[].class].</li>
     *         </ol>
     */
    protected static Tuple.Two<TypeDefinition, List<ListTypeDefinition>> getArrayDimensions(
            Type type, TypeState typeState, boolean strict) {
        
        if (type instanceof ParameterizedType) {
            ParameterizedType pt = (ParameterizedType) type;
            
            Type[] types = pt.getActualTypeArguments();
            if (1==types.length) {
                Tuple.Two<TypeDefinition, List<ListTypeDefinition>> temp =
                    getArrayDimensions(types[0], typeState, strict);
                temp.v2.add(0, getListTypeDefinition(pt.getRawType(),
                        typeState, strict));
                return temp;
            } else {
                return new Tuple.Two<TypeDefinition, List<ListTypeDefinition>>(
                        getTypeDefinition(pt, typeState, strict),
                        new ArrayList<ListTypeDefinition>());
            }
        } else if (type instanceof GenericArrayType) {
            GenericArrayType gat = (GenericArrayType) type;
            
            Class<?> klass;
            try {
                klass = ClassUtils.forName(gat.toString());
            } catch (ClassNotFoundException e) {
                klass = null;
            } catch (LinkageError e) {
                klass = null;
            }
            if (null==klass && gat.getGenericComponentType() instanceof Class) {
                klass = Array.newInstance(
                        (Class<?>)gat.getGenericComponentType(), 0).getClass();
            }
            if (null==klass) {
                throw new WMRuntimeException(Resource.JSON_FAILED_GENERICARRAYTYPE,
                        gat, gat.getGenericComponentType());
            }
            
            Tuple.Two<TypeDefinition, List<ListTypeDefinition>> temp =
                getArrayDimensions(gat.getGenericComponentType(), typeState,
                        strict);
            temp.v2.add(0, getListTypeDefinition(klass, typeState, strict));
            
            return temp;
        } else if (type instanceof Class && ((Class<?>)type).isArray()) {
            Tuple.Two<TypeDefinition, List<ListTypeDefinition>> temp =
                getArrayDimensions(((Class<?>)type).getComponentType(),
                        typeState, strict);
            temp.v2.add(0, getListTypeDefinition(type, typeState, strict));
            
            return temp;
        } else if (type instanceof Class) {
            return new Tuple.Two<TypeDefinition, List<ListTypeDefinition>>(
                    getTypeDefinition(type, typeState, strict),
                    new ArrayList<ListTypeDefinition>());
        } else {
            throw new WMRuntimeException(Resource.JSON_TYPE_UNKNOWNPARAMTYPE,
                    type, (null!=type)?type.getClass():null);
        }
    }

    /**
     * Return the type name for the corresponding class and fields.
     * 
     * @param klass
     *            Generally, the klass is sufficient to identify the class.
     * @param mapFields
     *            If klass is a Map type, this should be the generic parameters.
     * @return A String uniquely identifying this type.
     */
    public static String getTypeName(Type type) {
        
        if (type instanceof Class) {
            return ((Class<?>)type).getName();
        } else if (type instanceof ParameterizedType) {
            return type.toString().replace(" ", "");
        } else {
            throw new WMRuntimeException(Resource.JSON_TYPE_UNKNOWNPARAMTYPE,
                    type, (null!=type)?type.getClass():null);
        }
    }
    
    public static String getShortName(Type type) {
        
        if (type instanceof Class) {
            return ((Class<?>)type).getSimpleName();
        } else {
            return null;
        }
    }
}
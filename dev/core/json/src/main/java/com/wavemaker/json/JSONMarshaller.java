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

package com.wavemaker.json;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.lang.reflect.Array;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Type;
import java.util.Collection;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.Stack;
import java.util.TreeSet;

import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang.NullArgumentException;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.EntryComparator;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.GenericFieldDefinition;
import com.wavemaker.json.type.MapTypeDefinition;
import com.wavemaker.json.type.ObjectTypeDefinition;
import com.wavemaker.json.type.PrimitiveTypeDefinition;
import com.wavemaker.json.type.TypeState;
import com.wavemaker.json.type.converters.WriteObjectConverter;
import com.wavemaker.json.type.reflect.ReflectTypeUtils;

/**
 * @author Matt Small
 */
public final class JSONMarshaller {

    private static final boolean DEFAULT_PRETTY_PRINT = false;

    private static final boolean DEFAULT_SORT = false;

    /** Logger for this class and subclasses */
    protected static final Logger logger = Logger.getLogger(JSONMarshaller.class);

    /**
     * Marshal the given Object into a JSON-formatted character stream (written out onto the writer parameter). This
     * method will not attempt to sort the output.
     * 
     * @param obj The Object to marshal; this must be an JavaBean-style Object, a Collection, or an array.
     * @return The JSON-formatted String representation of obj.
     */
    public static String marshal(Object obj) throws IOException {
        return marshal(obj, new JSONState(), DEFAULT_SORT);
    }

    /**
     * Marshal the given Object into a JSON-formatted character stream (written out onto the writer parameter). This
     * method will not attempt to sort the output.
     * 
     * @param obj The Object to marshal; this must be an JavaBean-style Object, a Collection, or an array.
     * @param jsonState Any configuration.
     * @return The JSON-formatted String representation of obj.
     */
    public static String marshal(Object obj, JSONState jsonState) throws IOException {
        return marshal(obj, jsonState, DEFAULT_SORT);
    }

    /**
     * Marshal the given Object into a JSON-formatted character stream (written out onto the writer parameter).
     * 
     * @param obj The Object to marshal; this must be an JavaBean-style Object, a Collection, or an array.
     * @param jsonState Any configuration.
     * @param sort True if the output should be sorted (only bean properties will be sorted, currently).
     * @return The JSON-formatted String representation of obj.
     */
    public static String marshal(Object obj, JSONState jsonState, boolean sort) throws IOException {
        return marshal(obj, jsonState, sort, DEFAULT_PRETTY_PRINT);
    }

    /**
     * Marshal the given Object into a JSON-formatted character stream (written out onto the writer parameter).
     * 
     * @param obj The Object to marshal; this must be an JavaBean-style Object, a Collection, or an array.
     * @param jsonState Any configuration.
     * @param sort True if the output should be sorted (only bean properties will be sorted, currently).
     * @return The JSON-formatted String representation of obj.
     */
    public static String marshal(Object obj, JSONState jsonState, boolean sort, boolean prettyPrint) throws IOException {

        StringWriter sw = new StringWriter();
        marshal(sw, obj, jsonState, sort, prettyPrint);

        String ret = sw.toString();
        sw.close();

        return ret;
    }

    /**
     * Marshal the given Object into a JSON-formatted character stream (written out onto the writer parameter).
     * 
     * @param obj The Object to marshal; this must be an JavaBean-style Object, a Collection, or an array.
     * @param jsonState Any configuration.
     * @param sort True if the output should be sorted (only bean properties will be sorted, currently).
     * @return The JSON-formatted String representation of obj.
     */
    public static String marshal(Object obj, JSONState jsonState, FieldDefinition fieldDefinition, boolean sort) throws IOException {

        StringWriter sw = new StringWriter();
        marshal(sw, obj, jsonState, fieldDefinition, sort, DEFAULT_PRETTY_PRINT);

        String ret = sw.toString();
        sw.close();

        return ret;
    }

    /**
     * Marshal the given Object into a JSON-formatted character stream (written out onto the writer parameter).
     * 
     * @param writer The Writer to write the JSON-formatted representation of obj to.
     * @param obj The Object to marshal; this must be an JavaBean-style Object, a Collection, or an array.
     */
    public static void marshal(Writer writer, Object obj) throws IOException {
        marshal(writer, obj, new JSONState(), DEFAULT_SORT);
    }

    /**
     * Marshal the given Object into a JSON-formatted character stream (written out onto the writer parameter).
     * 
     * @param writer The Writer to write the JSON-formatted representation of obj to.
     * @param obj The Object to marshal; this must be an JavaBean-style Object, a Collection, or an array.
     * @param jsonState Any configuration.
     * @param sort True if the output should be sorted (only bean properties will be sorted, currently).
     */
    public static void marshal(Writer writer, Object obj, JSONState jsonState, boolean sort) throws IOException {
        marshal(writer, obj, jsonState, sort, DEFAULT_PRETTY_PRINT);
    }

    /**
     * Marshal the given Object into a JSON-formatted character stream (written out onto the writer parameter). This
     * will infer the root object type from the type of the obj parameter.
     * 
     * @param writer The Writer to write the JSON-formatted representation of obj to.
     * @param obj The Object to marshal; this must be an JavaBean-style Object, a Collection, or an array.
     * @param jsonState Any configuration.
     * @param sort True if the output should be sorted (only bean properties will be sorted, currently).
     * @param prettyPrint True if the output should be formatted.
     */
    public static void marshal(Writer writer, Object obj, JSONState jsonState, boolean sort, boolean prettyPrint) throws IOException {

        TypeState typeState = jsonState.getTypeState();
        FieldDefinition fieldDefinition;

        if (obj == null) {
            fieldDefinition = ReflectTypeUtils.getFieldDefinition((Type) null, typeState, false, null);
        } else {
            fieldDefinition = ReflectTypeUtils.getFieldDefinition(obj.getClass(), typeState, false, null);
        }

        marshal(writer, obj, jsonState, fieldDefinition, sort, prettyPrint);
    }

    /**
     * Marshal the given Object into a JSON-formatted character stream (written out onto the writer parameter).
     * 
     * @param writer The Writer to write the JSON-formatted representation of obj to.
     * @param obj The Object to marshal; this must be an JavaBean-style Object, a Collection, or an array.
     * @param jsonState Any configuration.
     * @param sort True if the output should be sorted (only bean properties will be sorted, currently).
     * @param prettyPrint True if the output should be formatted.
     */
    public static void marshal(Writer writer, Object obj, JSONState jsonState, FieldDefinition rootFieldDefinition, boolean sort, boolean prettyPrint)
        throws IOException {

        TypeState typeState = jsonState.getTypeState();

        doMarshal(writer, obj, obj, jsonState, sort, true, new Stack<Object>(), new Stack<String>(), rootFieldDefinition, 0, typeState, prettyPrint,
            0, Logger.getLogger(JSONMarshaller.class));
    }

    /**
     * doMarshal() returns some status Objects.
     * 
     * CYCLE_DETECTED_OBJECT will be returned if a cycle was detected at a lower level, and this level needs to be not
     * written.
     * 
     * fieldDefinition should never be null; its enclosed typeDefinition may very well be null.
     */
    protected static Object doMarshal(Writer writer, Object obj, Object root, JSONState js, boolean sort, boolean topLevel,
        Stack<Object> touchedObjects, Stack<String> propertyNames, FieldDefinition fieldDefinition, int arrayLevel, TypeState typeState,
        boolean prettyPrint, int level, Logger logger) throws IOException {

        if (fieldDefinition == null) {
            throw new NullArgumentException("fieldDefinition");
        }

        touchedObjects.push(obj);
        try {
            if (obj != null && fieldDefinition.getTypeDefinition() == null) {
                fieldDefinition = ReflectTypeUtils.getFieldDefinition(obj.getClass(), typeState, false, null);
                arrayLevel = 0;
            }

            // do value conversion
            if (js.getValueTransformer() != null) {
                Tuple.Three<Object, FieldDefinition, Integer> tuple = js.getValueTransformer().transformToJSON(obj, fieldDefinition, arrayLevel,
                    root, getPropertyName(propertyNames, js), js.getTypeState());
                if (tuple != null) {
                    obj = tuple.v1;
                    fieldDefinition = tuple.v2;
                    arrayLevel = tuple.v3;
                }
            }

            if (arrayLevel == fieldDefinition.getDimensions() && fieldDefinition.getTypeDefinition() != null
                && fieldDefinition.getTypeDefinition() instanceof WriteObjectConverter) {
                ((WriteObjectConverter) fieldDefinition.getTypeDefinition()).writeObject(obj, root, getPropertyName(propertyNames, js), writer);
            } else if (obj == null) {
                writer.write("null");

                // handle arrays & Collections
            } else if (arrayLevel < fieldDefinition.getDimensions() || obj.getClass().isArray()) {

                writer.write("[");
                boolean firstElement = true;

                if (obj instanceof Collection) {
                    for (Object elem : (Collection<?>) obj) {
                        if (!firstElement) {
                            writer.write(",");

                            if (prettyPrint) {
                                writer.write(" ");
                            }
                        }

                        doMarshal(writer, elem, root, js, sort, false, touchedObjects, propertyNames, fieldDefinition, arrayLevel + 1, typeState,
                            prettyPrint, level, logger);

                        if (firstElement) {
                            firstElement = false;
                        }
                    }
                } else if (obj.getClass().isArray()) {
                    int length = Array.getLength(obj);
                    Object elem;

                    for (int i = 0; i < length; i++) {
                        elem = Array.get(obj, i);

                        if (!firstElement) {
                            writer.write(",");

                            if (prettyPrint) {
                                writer.write(" ");
                            }
                        }

                        doMarshal(writer, elem, root, js, sort, false, touchedObjects, propertyNames, fieldDefinition, arrayLevel + 1, typeState,
                            prettyPrint, level, logger);
                        if (firstElement) {
                            firstElement = false;
                        }
                    }
                } else {
                    throw new WMRuntimeException(MessageResource.JSON_UNKNOWN_COLL_OR_ARRAY, obj, obj.getClass());
                }

                writer.write("]");
                // check for primitives
            } else if (fieldDefinition.getTypeDefinition() != null && fieldDefinition.getTypeDefinition() instanceof PrimitiveTypeDefinition) {
                ((PrimitiveTypeDefinition) fieldDefinition.getTypeDefinition()).toJson(writer, obj);
                // handle maps & objects
            } else {
                handleObject(obj, root, js, writer, touchedObjects, propertyNames, sort, fieldDefinition, arrayLevel, typeState, prettyPrint, level,
                    logger);
            }

            return null;
        } finally {
            touchedObjects.pop();
        }
    }

    /**
     * Recursively write out maps and objects.
     * 
     * @param writer
     * @throws IOException
     */
    private static void handleObject(Object obj, Object root, JSONState js, Writer writer, Stack<Object> touchedObjects, Stack<String> propertyNames,
        boolean sort, FieldDefinition fieldDefinition, int arrayLevel, TypeState typeState, boolean prettyPrint, int level, Logger logger)
        throws IOException {

        if (fieldDefinition == null) {
            throw new NullArgumentException("fieldDefinition");
        }

        writer.write('{');
        boolean firstProperty = true;

        if (obj instanceof Map || fieldDefinition.getTypeDefinition() instanceof MapTypeDefinition) {
            Set<Entry<?, ?>> entries = null;
            if (sort) {
                Set<Entry<?, ?>> entriesTemp = new TreeSet<Entry<?, ?>>(new EntryComparator());
                entriesTemp.addAll(((Map<?, ?>) obj).entrySet());
                entries = entriesTemp;
            }

            for (Entry<?, ?> entry : entries == null ? ((Map<?, ?>) obj).entrySet() : entries) {
                String key = (String) entry.getKey();

                if (fieldDefinition.getTypeDefinition() != null && fieldDefinition.getTypeDefinition() instanceof MapTypeDefinition) {
                    fieldDefinition = ((MapTypeDefinition) fieldDefinition.getTypeDefinition()).getValueFieldDefinition();
                } else {
                    fieldDefinition = new GenericFieldDefinition();
                }

                firstProperty = handleObjectInternal(obj, root, key, entry.getValue(), firstProperty, js, writer, touchedObjects, propertyNames,
                    sort, fieldDefinition, arrayLevel, typeState, prettyPrint, level + 1, logger);
            }

        } else if (fieldDefinition.getTypeDefinition() instanceof ObjectTypeDefinition) {
            ObjectTypeDefinition otd = (ObjectTypeDefinition) fieldDefinition.getTypeDefinition();
            if (otd.getTypeName().equals(obj.getClass().getName())) {
                for (Entry<String, FieldDefinition> entry : otd.getFields().entrySet()) {
                    String name = entry.getKey();
                    fieldDefinition = entry.getValue();

                    Object value;
                    try {
                        value = PropertyUtils.getProperty(obj, name);
                    } catch (IllegalArgumentException e) {
                        throw new WMRuntimeException(MessageResource.ERROR_GETTING_PROPERTY, e, name, obj, obj.getClass().getName());
                    } catch (IllegalAccessException e) {
                        throw new WMRuntimeException(MessageResource.ERROR_GETTING_PROPERTY, e, name, obj, obj.getClass().getName());
                    } catch (InvocationTargetException e) {
                        throw new WMRuntimeException(MessageResource.ERROR_GETTING_PROPERTY, e, name, obj, obj.getClass().getName());
                    } catch (NoSuchMethodException e) {
                        logger.warn(MessageResource.JSON_NO_GETTER_IN_TYPE.getMessage(name, obj, obj.getClass().getName()));
                        continue;
                    }

                    firstProperty = handleObjectInternal(obj, root, name, value, firstProperty, js, writer, touchedObjects, propertyNames, sort,
                        fieldDefinition, 0, typeState, prettyPrint, level + 1, logger);
                }
            }
        } else {
            throw new WMRuntimeException(MessageResource.JSON_BAD_HANDLE_TYPE, fieldDefinition.getTypeDefinition());
        }

        if (prettyPrint) {
            writer.write("\n");
            writeIndents(writer, level);
        }
        writer.write('}');
    }

    private static boolean handleObjectInternal(Object object, Object root, String key, Object value, boolean firstProperty, JSONState js,
        Writer writer, Stack<Object> touchedObjects, Stack<String> propertyNames, boolean sort, FieldDefinition fieldDefinition, int arrayLevel,
        TypeState typeState, boolean prettyPrint, int level, Logger logger) throws IOException {

        if (fieldDefinition == null) {
            throw new NullArgumentException("fieldDefinition");
        }

        propertyNames.push(key);
        String propertyName = getPropertyName(propertyNames, js);
        try {
            if (js.getExcludes().contains(propertyName)) {
                return firstProperty;
            }

            if (js.getPropertyFilter() != null) {
                if (js.getPropertyFilter().filter(object, key, value)) {
                    return firstProperty;
                }
            }

            // cycle
            if (isCycle(value, touchedObjects, propertyName, js)) {
                if (logger.isInfoEnabled()) {
                    logger.info(MessageResource.JSON_CYCLE_FOUND.getMessage(value, js.getCycleHandler()));
                }

                if (js.getCycleHandler().equals(JSONState.CycleHandler.FAIL)) {
                    throw new WMRuntimeException(MessageResource.JSON_CYCLE_FOUND, value, js.getCycleHandler());
                } else if (js.getCycleHandler().equals(JSONState.CycleHandler.NULL)) {
                    value = null;
                } else if (js.getCycleHandler().equals(JSONState.CycleHandler.NO_PROPERTY)) {
                    return firstProperty;
                } else {
                    throw new WMRuntimeException(MessageResource.JSON_BAD_CYCLE_HANDLER, js.getCycleHandler());
                }
            }

            if (!firstProperty) {
                writer.write(',');
            }

            if (prettyPrint) {
                writer.write("\n");
                writeIndents(writer, level);
            }

            if (js.isUnquoteKeys()) {
                writer.write(key + ":");
            } else {
                writer.write("\"" + key + "\":");
            }

            if (prettyPrint) {
                writer.write(" ");
            }

            doMarshal(writer, value, root, js, sort, false, touchedObjects, propertyNames, fieldDefinition, arrayLevel, typeState, prettyPrint,
                level, logger);

            if (firstProperty) {
                firstProperty = false;
            }

            return firstProperty;
        } finally {
            propertyNames.pop();
        }
    }

    private static void writeIndents(Writer writer, int level) throws IOException {

        for (int i = 0; i < level; i++) {
            writer.write('\t');
        }
    }

    private static String getPropertyName(Stack<String> propertyNames, JSONState js) {
        return StringUtils.join(propertyNames.subList(js.getTrimStackLevel(), propertyNames.size()), AlternateJSONTransformer.PROP_SEP);
    }

    private static boolean isCycle(Object obj, Stack<Object> touchedObjects, String propertyName, JSONState js) {

        boolean cycle = -1 != touchedObjects.search(obj);
        if (cycle && js.getRequiredProperties() != null && js.getRequiredProperties().contains(propertyName)) {
            cycle = false;
        }
        return cycle;
    }
}
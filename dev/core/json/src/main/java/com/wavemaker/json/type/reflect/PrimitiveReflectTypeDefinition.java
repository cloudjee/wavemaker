/*
 *  Copyright (C) 2009-2011 VMWare, Inc. All rights reserved.
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

import java.io.IOException;
import java.io.Writer;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.util.ClassUtils;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.core.JSONUtils;
import com.wavemaker.json.type.PrimitiveTypeDefinition;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class PrimitiveReflectTypeDefinition extends ReflectTypeDefinition implements PrimitiveTypeDefinition {

    @Override
    public Object newInstance(Object... args) {

        if (!(1 == args.length || 2 == args.length && args[1] instanceof Class)) {
            throw new IllegalArgumentException(MessageResource.JSON_PRIM_NEWINSTANCE_ARG_REQ.getMessage(Arrays.toString(args)));
        }
        Object obj = args[0];

        Class<?> klass;
        if (args.length > 1) {
            klass = (Class<?>) args[1];
        } else {
            klass = getKlass();
        }

        Object ret;
        if (Class.class.isAssignableFrom(klass)) {
            try {
                ret = ClassUtils.forName(obj.toString());
            } catch (ClassNotFoundException e) {
                throw new WMRuntimeException(e);
            } catch (LinkageError e) {
                throw new WMRuntimeException(e);
            }
        } else if (ClassUtils.isAssignable(klass, obj.getClass())) {
            ret = obj;
        } else if (klass.isPrimitive()) {
            if (obj instanceof Number) {
                Number number = (Number) obj;

                if (byte.class.equals(klass)) {
                    ret = number.byteValue();
                } else if (short.class.equals(klass)) {
                    ret = number.shortValue();
                } else if (int.class.equals(klass)) {
                    ret = number.intValue();
                } else if (long.class.equals(klass)) {
                    ret = number.longValue();
                } else if (float.class.equals(klass)) {
                    ret = number.floatValue();
                } else if (double.class.equals(klass)) {
                    ret = number.doubleValue();
                } else {
                    throw new WMRuntimeException(MessageResource.JSON_UNKNOWN_NUMBER_TYPE, klass, obj);
                }
            } else {
                String string = obj.toString();
                try {
                    if (byte.class.equals(klass)) {
                        ret = Byte.valueOf(string);
                    } else if (short.class.equals(klass)) {
                        ret = Short.valueOf(string);
                    } else if (int.class.equals(klass)) {
                        ret = Integer.valueOf(string);
                    } else if (long.class.equals(klass)) {
                        ret = Long.valueOf(string);
                    } else if (float.class.equals(klass)) {
                        ret = Float.valueOf(string);
                    } else if (double.class.equals(klass)) {
                        ret = Double.valueOf(string);
                    } else if (boolean.class.equals(klass)) {
                        ret = Boolean.valueOf(string);
                    } else if (char.class.equals(klass)) {
                        ret = string.charAt(0);
                    } else {
                        throw new WMRuntimeException(MessageResource.JSON_UNKNOWN_NUMBER_TYPE, klass, string);
                    }
                } catch (NumberFormatException e) {
                    throw new WMRuntimeException(MessageResource.JSON_FAILED_TO_CONVERT, e, string, klass);
                }
            }
        } else if (klass.equals(AtomicInteger.class) && obj instanceof Number) {
            Number number = (Number) obj;
            ret = new AtomicInteger(number.intValue());
        } else if (klass.equals(AtomicLong.class) && obj instanceof Number) {
            Number number = (Number) obj;
            ret = new AtomicLong(number.longValue());
        } else {
            Constructor<?> c;
            try {
                c = klass.getConstructor(String.class);
                ret = c.newInstance(obj.toString());
            } catch (SecurityException e) {
                throw new WMRuntimeException(e);
            } catch (NoSuchMethodException e) {
                throw new WMRuntimeException(e);
            } catch (IllegalArgumentException e) {
                throw new WMRuntimeException(e);
            } catch (InstantiationException e) {
                throw new WMRuntimeException(e);
            } catch (IllegalAccessException e) {
                throw new WMRuntimeException(e);
            } catch (InvocationTargetException e) {
                throw new WMRuntimeException(e);
            }
        }

        return ret;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.json.type.PrimitiveTypeDefinition#toJson(java.io.Writer, java.lang.Object)
     */
    @Override
    public void toJson(Writer writer, Object obj) throws IOException {

        if (CharSequence.class.isAssignableFrom(obj.getClass())) {
            writer.write(JSONUtils.quote(obj.toString()));
        } else if (Character.class.isAssignableFrom(obj.getClass())) {
            writer.write(JSONUtils.quote(obj.toString()));
        } else if (Number.class.isAssignableFrom(obj.getClass())) {
            writer.write(JSONUtils.numberToString((Number) obj));
        } else if (Boolean.class.isAssignableFrom(obj.getClass())) {
            writer.write(obj.toString());
        } else if (Class.class.isAssignableFrom(obj.getClass())) {
            writer.write(JSONUtils.quote(((Class<?>) obj).getName()));
        } else {
            throw new WMRuntimeException(MessageResource.JSON_UNKNOWN_PRIMITIVE_TYPE, obj, obj.getClass());
        }
    }
}
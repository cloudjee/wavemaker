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
package com.wavemaker.runtime.server;

import java.io.IOException;
import java.io.InputStream;
import java.lang.annotation.Annotation;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.apache.log4j.NDC;
import org.springframework.aop.support.AopUtils;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

import com.thoughtworks.paranamer.AdaptiveParanamer;
import com.thoughtworks.paranamer.ParameterNamesNotFoundException;
import com.wavemaker.common.Resource;
import com.wavemaker.common.WMException;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.common.util.ClassUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.json.JSONState;
import com.wavemaker.runtime.service.ParsedServiceArguments;
import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.runtime.service.TypedServiceReturn;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.runtime.service.events.ServiceEventNotifier;

/**
 * Utility methods for the server components.
 * 
 * @author Matt Small
 * @version $Rev$ - $Date$
 *
 */
public/* static */class ServerUtils {
    
    /** Logger for this class and subclasses */
    protected final static Logger logger = Logger.getLogger(ServerUtils.class);
    
    
    static final Pattern extensionPattern;
    static {
        extensionPattern = Pattern.compile("^(.*)\\.("+ServerConstants.DOWNLOAD_EXTENSION+"|"+ServerConstants.UPLOAD_EXTENSION+"|"+ServerConstants.FLASH_UPLOAD_EXTENSION+"|"+ServerConstants.JSON_EXTENSION+")$");
    }

    private ServerUtils() {
    }

    public static String getFileName(HttpServletRequest request) {

        String uri = request.getRequestURI();

        if (-1 != uri.lastIndexOf('/')) {
            uri = uri.substring(uri.lastIndexOf('/') + 1);
        }

        return uri;
    }
    
    /**
     * Returns the service name, if the URL points to a valid service, or
     * null if not.
     */
    public static String getServiceName(HttpServletRequest request) {
        
        String fileName = getFileName(request);
        Matcher matcher = extensionPattern.matcher(fileName);
        
        if (matcher.matches()) {
            return matcher.group(1);
        } else {
            return null;
        }
    }

    public static String getDirectory(HttpServletRequest request) {

        String uri = request.getRequestURI();

        if (-1 != uri.lastIndexOf('/')) {
            uri = uri.substring(0, uri.lastIndexOf('/'));
        }
        if (0 == "".compareTo(uri)) {
            uri = "/";
        }

        return uri;
    }


    public static String readInput(HttpServletRequest request)
            throws IOException {

        InputStream is = request.getInputStream();
        if (null == is) {
            throw new WMRuntimeException("no input stream found in request");
        }
        
        String input = IOUtils.toString(is, ServerConstants.DEFAULT_ENCODING);
        
        is.close();

        return input;
    }
    
    /**
     * Try to determine parameter names for a given method. This will check
     * {@link ParamName} attributes and debugging symbols; if no name can be
     * found, a default "arg-&lt;position>" name will be used.
     * 
     * This will also continue working of method has been loaded by a
     * non-default classloader.
     * 
     * @param method
     *                The method to introspect.
     * @return The names of the parameters in an ordered list.
     */
    public static List<String> getParameterNames(Method method) {
        
        int numParams = method.getParameterTypes().length;
        List<String> ret = new ArrayList<String>(numParams);
        Annotation[][] paramAnnotations = method.getParameterAnnotations();
        Class<?> paramNameClass = ClassLoaderUtils.loadClass(
                ParamName.class.getName(),
                method.getDeclaringClass().getClassLoader());

        String[] methodParameterNames;
        
        try {
            AdaptiveParanamer ap = new AdaptiveParanamer();
            methodParameterNames = ap.lookupParameterNames(method);
            ap = null;
        } catch (ParameterNamesNotFoundException e) {
            logger.info("No parameter names found for method "+method.getName());
            methodParameterNames = new String[numParams];
        }
        
        for (int i=0;i<numParams;i++) {
            String paramName = null;
            
            if (null == paramName) {
                for (Annotation ann : paramAnnotations[i]) {
                    if (paramNameClass.isAssignableFrom(ann.annotationType())) {
                        try {
                            Method nameMethod = paramNameClass.getMethod("name");
                            paramName = (String) nameMethod.invoke(ann);
                        } catch (SecurityException e) {
                            throw new WMRuntimeException(e);
                        } catch (NoSuchMethodException e) {
                            throw new WMRuntimeException(e);
                        } catch (IllegalAccessException e) {
                            throw new WMRuntimeException(e);
                        } catch (InvocationTargetException e) {
                            throw new WMRuntimeException(e);
                        }
                        
                        break;
                    }
                }
            }
            
            if (null==paramName && null!=methodParameterNames) {
                paramName = methodParameterNames[i];
            }
            
            if (null==paramName) {
                logger.warn("no parameter name information for parameter "+i+
                        ", method: "+method.getName());
                paramName = "arg-"+(i+1);
            }
            
            ret.add(paramName);
        }
        
        return ret;
    }
    
    /**
     * Get the method parameter from the parameters map; as a side effect,
     * remove that entry.
     * 
     * @param params
     *                The map - this is side-effected, and the method entry is
     *                removed.
     * @return The method to invoke.
     */
    public static String getMethod(Map<String, Object[]> params) {
        
        String method = null;
        if (params.containsKey(ServerConstants.METHOD)) {
            Object methodO = params.get(ServerConstants.METHOD);
            if (methodO instanceof String[]) {
                if (1==((String[])methodO).length) {
                    method = ((String[])methodO)[0];
                }
            }
        }
        if (null==method) {
            throw new WMRuntimeException(Resource.SERVER_NOMETHODORID, params);
        }
        params.remove(ServerConstants.METHOD);
        
        return method;
    }
    
    /**
     * Merge parameters from fileMap (if it exists) and parametersMap. All
     * parameters are returned in Object[], even those from fileMap.
     * 
     * @param request
     *                The original request.
     * @return A merged map of all parameters.
     */
    @SuppressWarnings("unchecked")
    public static Map<String, Object[]> mergeParams(HttpServletRequest request) {
        
        Map<String, Object[]> params = new HashMap<String, Object[]>();
        //Set<Map.Entry<?, ?>> entries;
        Set<Map.Entry<String, MultipartFile>> entries;
        
        if (request instanceof MultipartHttpServletRequest) {
            MultipartHttpServletRequest mrequest = (MultipartHttpServletRequest) request;
            entries = mrequest.getFileMap().entrySet();
            for (Map.Entry<?, ?> e : entries) {
                params.put((String) e.getKey(), new Object[]{e.getValue()});
            }
        }
        
        entries = request.getParameterMap().entrySet();
        for (Map.Entry<?, ?> e: entries) {
            String key = (String) e.getKey();
            Object[] value = (Object[]) e.getValue();
            if (null==params.get(key)) {
                params.put(key, (Object[])e.getValue());
            } else {
                Object[] newArray = new Object[value.length+params.get(key).length];
                System.arraycopy(params.get(key), 0, newArray, 0, params.get(key).length);
                System.arraycopy(value, 0, newArray, params.get(key).length, value.length);
                params.put(key, newArray);
            }
        }
        
        return params;
    }

    
    public static TypedServiceReturn invokeMethodWithEvents(
            ServiceEventNotifier serviceEventNotifier, ServiceWire sw,
            String method, ParsedServiceArguments args, JSONState jsonState,
            boolean throwExceptions)
            throws WMException {
        
        TypedServiceReturn ret = null;
        
        try {
            NDC.push("invoke " + sw.getServiceId() + "." + method);

            Throwable exception = null;
            
            // log the method arguments after conversion
            if (logger.isDebugEnabled()) {
                StringBuilder logMessage = new StringBuilder();
                logMessage.append("Invoking method \""+method+"\" with translated parameters: [");
                
                for (Object arg: args.getArguments()) {
                    logMessage.append(arg);
                    if (null!=arg) {
                        logMessage.append(" ("+arg.getClass()+")");
                    }
                    logMessage.append(", ");
                }
                logMessage.append("]");
                logger.debug(logMessage.toString());
            }

            args.setArguments(serviceEventNotifier.executePreOperation(sw,
                    method, args.getArguments()));
            try {
                ret = sw.getServiceType().invokeMethod(sw, method, args,
                        jsonState);
            } catch (Throwable t) {
                if (throwExceptions) {
                    throw new WMRuntimeException(t);
                }
                
                exception = SystemUtils.unwrapInternalException(t);
            }

            try {
                ret = serviceEventNotifier.executePostOperation(sw, method,
                                ret, exception);
            } catch (Throwable t) {
                if (t instanceof WMException) {
                    throw (WMException) t;
                } else if (t instanceof RuntimeException) {
                    throw (RuntimeException) t;
                } else {
                    // some exception messages are not useful when taken outside
                    // of the context of the exception type (ClassCastException,
                    // ClassNotFoundException, etc) so include the type in the
                    // msg
                    String msg = StringUtils.fromLastOccurrence(
                            t.getClass().getName(), ".");
                    if (t.getMessage() != null) {
                        msg += ": " + t.getMessage();
                    }
                    throw new WMRuntimeException(msg, t);
                }
            }
        } finally {
            NDC.pop();
        }
        
        return ret;
    }

    /**
     * Detect proxy class, and find underlying class. <br>
     * An inglorious hack: This simple version works for CGLIB proxy; as used by
     * Springframework.security. No guarantee (or even expectation) that other
     * AOP proxies will be detected. Java (or CGLIB) may have more deterministic
     * ways to find the underlying class.
     * <p>
     * Used by FileUploadController and FileDownloadController, which to
     * findMethod() on SpringBeans obtained at runtime.
     * 
     * @param sClass
     *            the class of an object that may be wrapped by a proxy object.
     * @return the underlying Class of the object that was wrapped
     */
    public static Class<?> getRealClass(Object o) {

        Class<?> ret;
        if (AopUtils.isAopProxy(o)) {
            ret = AopUtils.getTargetClass(o);
        } else {
            ret = o.getClass();
        }
        return ret;
    }
    
    /**
     * Get a list of methods to be exposed to the client. This will obey
     * restrictions from {@link ExposeToClient} and {@link HideFromClient}.
     * 
     * @param klass
     *                The class to examine.
     * @return A list of methods to expose to the client in the specified class.
     */
    @SuppressWarnings("unchecked")
    public static List<Method> getClientExposedMethods(Class<?> klass) {
        
        List<Method> allMethods = ClassUtils.getPublicMethods(klass);
        List<Method> ret = new ArrayList<Method>(allMethods.size());
        ClassLoader cl = klass.getClassLoader();
        
        Class<Annotation> hideFromClient = (Class<Annotation>) ClassLoaderUtils
                .loadClass(HideFromClient.class.getCanonicalName(), cl);
        Class<Annotation> exposeToClient = (Class<Annotation>) ClassLoaderUtils
                .loadClass(ExposeToClient.class.getCanonicalName(), cl);
        
        if (null != klass.getAnnotation(hideFromClient)) {
            for (Method meth: allMethods) {
                if (null != meth.getAnnotation(exposeToClient)) {
                    ret.add(meth);
                }
            }
        } else {
            for (Method meth: allMethods) {
                if (null == meth.getAnnotation(hideFromClient)) {
                    ret.add(meth);
                }
            }
        }
        
        return ret;
    }

    /**
     * Calculate the server time offset against UTC
     *
     * @return the server time offset in mili-seconds
     */
    public static String getServerTimeOffset() {
        Calendar now = Calendar.getInstance();
        int totalOffset = now.get(Calendar.ZONE_OFFSET) + now.get(Calendar.DST_OFFSET);

        return Integer.toString(totalOffset);
    }
}
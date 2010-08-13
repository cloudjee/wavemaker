/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
package com.wavemaker.testsupport.spring;

import java.io.IOException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.wavemaker.common.WMRuntimeException;

import com.wavemaker.common.util.CastUtils;

import com.wavemaker.json.JSON;
import com.wavemaker.json.JSONMarshaller;
import com.wavemaker.json.JSONObject;
import com.wavemaker.json.JSONState;
import com.wavemaker.json.JSONUnmarshaller;

import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.GenericFieldDefinition;

import com.wavemaker.json.type.reflect.ObjectReflectTypeDefinition;
import com.wavemaker.json.type.reflect.ReflectTypeUtils;

import com.wavemaker.runtime.server.ControllerBase;
import com.wavemaker.runtime.server.InternalRuntime;
import com.wavemaker.runtime.server.ServerConstants;

import com.wavemaker.runtime.server.json.JSONUtils;

import com.wavemaker.runtime.server.view.TypedView;

import com.wavemaker.runtime.service.ServiceManager;

import com.wavemaker.runtime.service.events.EventManager;

import com.wavemaker.runtime.service.response.LiveDataServiceResponse;

import com.wavemaker.tools.project.StudioConfiguration;

import com.wavemaker.tools.service.ConfigurationCompiler;

import org.apache.commons.lang.ArrayUtils;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;

import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import org.springframework.test.AbstractDependencyInjectionSpringContextTests;

import org.springframework.util.ClassUtils;

import org.springframework.web.context.WebApplicationContext;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.RequestScope;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.context.request.SessionScope;

import org.springframework.web.servlet.HandlerExecutionChain;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.ModelAndView;

import org.springframework.web.servlet.mvc.AbstractController;
import org.springframework.web.servlet.mvc.Controller;

/**
 * Provides a test framework for WaveMaker applications' spring configuration.
 * This will load all required spring files, and provide hooks to specify any
 * others.
 *
 * @author Matt Small
 * @version $Rev:22675 $ - $Date:2008-05-30 14:53:23 -0700 (Fri, 30 May 2008) $
 *
 */
public abstract class SpringTestCase extends
        AbstractDependencyInjectionSpringContextTests {
    
    public SpringTestCase() {
        super();
    }
    
    public SpringTestCase(String name) {
        super(name);
    }

    private static final String URL_MAPPING_BEAN_ID = "urlMapping";
    protected static final String[] DEFAULT_LOCATIONS = {"springapp.xml"};

    @Override
    public void onTearDown() throws Exception {
        RequestContextHolder.resetRequestAttributes();
    }

    @Override
    protected String[] getConfigLocations() {

        String[] defaultLocs = DEFAULT_LOCATIONS;
        String[] webappLocs = getWebAppConfigLocations();

        return (String[]) ArrayUtils.addAll(defaultLocs, webappLocs);
    }

    /**
     * Return web-app config locations specific to this test case.
     */
    protected abstract String[] getWebAppConfigLocations();
    
    /**
     * Get the current http session.
     */
    protected abstract HttpSession getHttpSession();

    @Override
    protected ConfigurableApplicationContext createApplicationContext(String[] locations) {
        
        ConfigurableApplicationContext cac = super.createApplicationContext(locations);

        cac.getBeanFactory().registerScope(WebApplicationContext.SCOPE_REQUEST,
                new RequestScope());
        cac.getBeanFactory().registerScope(WebApplicationContext.SCOPE_SESSION,
                new SessionScope());
        return cac;
    }
    
    protected ServiceManager getServiceManager() {
        return (ServiceManager) getBean(ConfigurationCompiler.SERVICE_MANAGER_BEAN_ID);
    }
    
    protected EventManager getEventManager() {
        return (EventManager) getBean(ConfigurationCompiler.EVENT_MANAGER_BEAN_ID);
    }
    
    protected Object getBean(String beanID) {
        return getApplicationContext().getBean(beanID);
    }

    /**
     * If the current context needs to know about the request attributes, set
     * them through this interface.
     *
     * @param request
     */
    protected void setRequestAttributes(HttpServletRequest request) {

        ServletRequestAttributes attributes = new ServletRequestAttributes(
                request);
        RequestContextHolder.setRequestAttributes(attributes);
    }

    /**
     * Invoke a service, and translate the return into the an object of type
     * returnClass (with generics information provided in returnTypes).
     */
    public Object invokeService_toObject(String service, String operation,
            Object[] parameters) throws Exception {
        
        MockHttpServletResponse mhresp = new MockHttpServletResponse();
        FieldDefinition returnFD = invokeService(service, operation, parameters,
                mhresp);

        String content = mhresp.getContentAsString();
        JSON jsonResult = JSONUnmarshaller.unmarshal(content);
        if (!jsonResult.isObject()) {
            throw new WMRuntimeException("json wasn't an object: "+content);
        }
        JSONObject json = (JSONObject) jsonResult;
        
        if (json.containsKey(ServerConstants.ERROR_PART)) {
            throw new WMRuntimeException(json.get(ServerConstants.ERROR_PART)
                    .toString());
        }
        
        InternalRuntime ir = InternalRuntime.getInstance();
        JSONState jsonState = ir.getJSONState();
        
        Object result = JSONUtils.toBean(json, returnFD, jsonState);
        if (result instanceof Map) {
            Map<String, Object> map = CastUtils.cast((Map<?, ?>) result);
            return map.get(ServerConstants.RESULTS_PART);
        } else if (result instanceof LiveDataServiceResponse) {
            return ((LiveDataServiceResponse) result).getResult();
        } else {
            throw new WMRuntimeException("unknown result: "+result+" ("+
                    result.getClass()+")");
        }
    }
    
    public FieldDefinition invokeService(String service, String operation,
            Object[] parameters, HttpServletResponse response) throws Exception {

        MockHttpServletRequest mhr = new MockHttpServletRequest(
                AbstractController.METHOD_POST,
                "/" + service + ".json");
        mhr.setServerPort(StudioConfiguration.TOMCAT_PORT_DEFAULT);
        String content = createJSONRPCCall(operation, parameters,
                getApplicationContext());
        mhr.setContent(content.getBytes());
        mhr.setSession(getHttpSession());
        
        return invokeService(mhr, response);
    }
    
    public FieldDefinition invokeService(HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        FieldDefinition ret = null;
        
        setRequestAttributes(request);
        
        HandlerMapping mapping = (HandlerMapping) getApplicationContext().getBean(URL_MAPPING_BEAN_ID);
        HandlerExecutionChain executionChain = mapping.getHandler(request);
        Object handler = executionChain.getHandler();
        
        if (!(handler instanceof Controller)) {
            fail("handler must be an instance of Controller; was: "+
                    handler.getClass());
        }
        
        Controller control = (Controller) handler;
        ModelAndView mav =  control.handleRequest(request, response);
        if (mav.getView() instanceof TypedView) {
            ret = ((TypedView) mav.getView()).getRootType();
        }
        mav.getView().render(mav.getModel(), request, response);
        
        return ret;
    }
    
    
    


    /**
     * ID accumulation, used in createJSONRPCCall().
     */
    private static int createJSONRPCCallId = 1;
    
    /**
     * Create a JSONRPC formatted call (formatted as Dojo would do it).
     * 
     * @param operation
     *            The operation to call.
     * @param parameters
     *            The parameters for the operation.
     * @return The JSON-formatted String representing the call.
     */
    public static String createJSONRPCCall(String operation,
            Object[] parameters, ApplicationContext ac)
            throws IOException, ClassNotFoundException {

        Map<String, Object> req = new HashMap<String, Object>(3);
        req.put(ServerConstants.METHOD, operation);
        req.put(ServerConstants.ID, new Integer(createJSONRPCCallId));
        createJSONRPCCallId++;
        if (null != parameters) {
            req.put(ServerConstants.PARAMETERS, parameters);
        }

        JSONState js = ControllerBase.createJSONState();

        FieldDefinition stringFD = ReflectTypeUtils.getFieldDefinition(
                String.class, js.getTypeState(), false, null);
        FieldDefinition intFD = ReflectTypeUtils.getFieldDefinition(
                Integer.class, js.getTypeState(), false, null);
        FieldDefinition objectArrFD = ReflectTypeUtils.getFieldDefinition(
                ClassUtils.forName("java.lang.Object[]"), js.getTypeState(),
                false, null);

        ObjectReflectTypeDefinition ortd = new ObjectReflectTypeDefinition();

        ortd.getFields().put(ServerConstants.METHOD, stringFD);
        ortd.getFields().put(ServerConstants.ID, intFD);
        ortd.getFields().put(ServerConstants.PARAMETERS, objectArrFD);

        FieldDefinition fd = new GenericFieldDefinition(ortd);

        String ret = JSONMarshaller.marshal(req, js, fd, false);
        
        return ret;
    }
    
    
    /**
     * Compares a list to a set.
     * 
     * @param expectedList
     * @param actualSet
     */
    public static void assertEquals(List<?> expectedList, Set<?> actualSet) {
        
        assertEquals("list size: "+expectedList.size()+
                " != set size "+actualSet.size(),
                expectedList.size(), actualSet.size());
        
        int i = 0;
        for(Object o: actualSet) {
            assertEquals(expectedList.get(i), o);
            i++;
        }
    }
}

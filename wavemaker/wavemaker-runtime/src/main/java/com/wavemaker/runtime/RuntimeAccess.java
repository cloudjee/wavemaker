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

package com.wavemaker.runtime;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.core.NamedThreadLocal;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.WMRuntimeInitException;
import com.wavemaker.runtime.service.ServiceManager;
import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.runtime.service.reflect.ReflectServiceWire;

/**
 * Runtime bean. Provides an interface to the session, request and response objects, and other WaveMaker interfaces.
 * This is the primary interface point for any WaveMaker system access.
 * 
 * This class supersedes the old AGRuntime class.
 * 
 * This should only be used as a bean property or through the static {@link #getInstance()} method; other instantiation
 * methods are unsupported. Using it as a bean property is recommended (see {@link #getInstance()} for more
 * information). The RuntimeAccess bean is named runtimeAccess, an example:
 * 
 * <pre>
 * &lt;bean id="myServiceBeanId" class="myServiceBeanClass"
 *          scope="singleton" lazy-init="true">
 *   &lt;property name="runtimeAccess">
 *       &lt;ref bean="runtimeAccess" />
 *   &lt;/property>
 * &lt;/bean>
 * </pre>
 * 
 * @author Matt Small
 */
public class RuntimeAccess {

    private static ThreadLocal<RuntimeAccess> runtimeThreadLocal = new NamedThreadLocal<RuntimeAccess>("Wavemake Runtime");

    private HttpServletRequest request = null;

    private ServiceManager serviceManager = null;

    /**
     * Do not use this constructor; instead, use either {@link #getInstance()} or access this class through bean
     * properties.
     */
    public RuntimeAccess() {
    }

    /**
     * Statically return the current instance of RuntimeAccess. This depends on the Spring bean being already loaded.
     * 
     * This will only return valid values after a request has already been initialized; for this reason, it is
     * inappropriate to use this in a constructor or static initializer. Either call {@link #getInstance()} in your
     * service call, or use a Spring property on your service class to reference the runtime bean. Using a Spring
     * property is recommended.
     * 
     * @return The RuntimeAccess instance.
     */
    public static RuntimeAccess getInstance() {
        RuntimeAccess runtimeAccess = runtimeThreadLocal.get();
        if (runtimeAccess == null) {
            throw new WMRuntimeInitException("RuntimeAccess uninitialized; request init failed.");
        }
        return runtimeAccess;
    }

    /**
     * Retrieve the current HttpSession. This call is only valid after the request has been initialized.
     * 
     * @return The current session (from the request object).
     */
    public HttpSession getSession() {
        return this.request.getSession();
    }

    /**
     * Get the current HttpServletRequest. This call is only valid after the request has been initialized.
     * 
     * @return The current request.
     */
    public HttpServletRequest getRequest() {
        return this.request;
    }

    /**
     * Get the service with the specified service id.
     * 
     * @param serviceId The service ID to look for.
     * @return The service bean (if a bean with the id exists).
     * @throws WMRuntimeException If a bean with the specified id is not found, or if Spring has not yet initialized
     *         this bean.
     */
    @SuppressWarnings("deprecation")
    public Object getService(String serviceId) {
        return this.serviceManager.getService(serviceId);
    }

    /**
     * Deprecated. Use {@link #getService(String)} Get the service (of the corresponding serviceType). An
     * WMRuntimeException will be thrown if more than one bean matches the serviceType class. It may be better to use
     * {@link #getService(String)}, since the serviceId is guaranteed unique (whereas the service class is not).
     * 
     * @param serviceType The class of the service to search for.
     * @return The service bean.
     * @throws WMRuntimeException If a bean with the specified class is not found, more than one bean with the specified
     *         class is found, or if Spring has not yet initialized this bean.
     */
    @Deprecated
    public Object getService(Class<?> serviceType) {
        return this.serviceManager.getService(serviceType);
    }

    public ServiceWire getServiceWire(String serviceId) {
        return this.serviceManager.getServiceWire(serviceId);
    }

    /**
     * Get the service of the corresponding service id. An WMRuntimeException will be thrown if more than one bean
     * matches the serviceType class.
     * 
     * @param serviceId The id of the service to search for.
     * @return The service bean.
     * @throws WMRuntimeException If a bean with the specified class is not found, more than one bean with the specified
     *         class is found, or if Spring has not yet initialized this bean.
     */
    public Object getServiceBean(String serviceId) {
        return ((ReflectServiceWire) this.getServiceWire(serviceId)).getServiceBean();
    }

    public static void setRuntimeBean(RuntimeAccess bean) {
        if (bean == null) {
            runtimeThreadLocal.remove();
        } else {
            runtimeThreadLocal.set(bean);
        }
    }

    public void setRequest(HttpServletRequest request) {
        this.request = request;
    }

    public void setServiceManager(ServiceManager serviceManager) {
        this.serviceManager = serviceManager;
    }

    public void setTenantId(int val) {
        this.getSession().setAttribute(CommonConstants.LOGON_TENANT_ID, val);
    }

    public int getTenantId() {
        Object o = this.getSession().getAttribute(CommonConstants.LOGON_TENANT_ID);
        if (o == null) {
            return -1;
        }

        return (Integer) o;
    }

    public Object getSpringBean(String beanId) {
        ServletContext context = this.request.getSession().getServletContext();
        WebApplicationContext applicationContext = WebApplicationContextUtils.getWebApplicationContext(context);

        return applicationContext.getBean(beanId);
    }
}
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

package com.activegrid.runtime;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.RuntimeAccess;

/**
 * Runtime bean. Provides an interface to the session, request and response objects, and other WaveMaker interfaces.
 * This is the primary interface point for any WaveMaker system access.
 * 
 * This should only be used as a bean property or through the static {@link #getInstance()} method; other instantiation
 * methods are unsupported. Using it as a bean property is recommended (see {@link #getInstance()} for more
 * information). The AGRuntime bean is named runtime, an example:
 * 
 * <pre>
 * &lt;bean id=&quot;myServiceBeanId&quot; class=&quot;myServiceBeanClass&quot;
 *          scope=&quot;singleton&quot; lazy-init=&quot;true&quot;&gt;
 *   &lt;property name=&quot;runtime&quot;&gt;
 *       &lt;ref bean=&quot;runtime&quot; /&gt;
 *   &lt;/property&gt;
 * &lt;/bean&gt;
 * </pre>
 * 
 * @author Matt Small
 * @version $Rev$ - $Date$
 * 
 * @deprecated AGRuntime is now deprecated; instead, use {@link RuntimeAccess}. In a future release, AGRuntime will be
 *             removed. Also, note that {@link RuntimeAccess} uses a different bean name (runtimeAccess).
 * 
 */
@Deprecated
public class AGRuntime {

    private static AGRuntime staticRuntime = null;

    /**
     * Do not use this constructor; instead, use either {@link #getInstance()} or access this class through bean
     * properties.
     */
    public AGRuntime() {
    }

    /**
     * Statically return the current instance of AGRuntime. This depends on the Spring bean being already loaded.
     * 
     * This will only return valid values after a request has already been initialized; for this reason, it is
     * inappropriate to use this in a constructor or static initializer. Either call {@link #getInstance()} in your
     * service call, or use a Spring property on your service class to reference the runtime bean. Using a Spring
     * property is recommended.
     * 
     * @return The AGRuntime instance.
     */
    public static AGRuntime getInstance() {

        if (null == AGRuntime.staticRuntime) {
            throw new WMRuntimeException("AGRuntime uninitialized; request init failed.");
        }

        return AGRuntime.staticRuntime;
    }

    public static void setRuntimeBean(AGRuntime bean) {
        AGRuntime.staticRuntime = bean;
    }

    /**
     * Retrieve the current HttpSession. This call is only valid after the request has been initialized.
     * 
     * @return The current session (from the request object).
     */
    public HttpSession getSession() {
        return this.getRuntimeAccess().getSession();
    }

    /**
     * Get the current HttpServletRequest. This call is only valid after the request has been initialized.
     * 
     * @return The current request.
     */
    public HttpServletRequest getRequest() {
        return this.getRuntimeAccess().getRequest();
    }

    /**
     * Get the service with the specified service id.
     * 
     * @param serviceId The service ID to look for.
     * @return The service bean (if a bean with the id exists).
     * @throws AGRuntimeException If a bean with the specified id is not found, or if Spring has not yet initialized
     *         this bean.
     */
    public Object getService(String serviceId) {
        return this.getRuntimeAccess().getService(serviceId);
    }

    /**
     * Get the service (of the corresponding serviceType). An AGRuntimeException will be thrown if more than one bean
     * matches the serviceType class. It may be better to use {@link #getService(String)}, since the serviceId is
     * guaranteed unique (whereas the service class is not).
     * 
     * @param serviceType The class of the service to search for.
     * @return The service bean.
     * @throws AGRuntimeException If a bean with the specified class is not found, more than one bean with the specified
     *         class is found, or if Spring has not yet initialized this bean.
     */
    public Object getService(Class<?> serviceType) {
        return this.getRuntimeAccess().getService(serviceType);
    }

    // bean accessors
    private RuntimeAccess runtimeAccess;

    public RuntimeAccess getRuntimeAccess() {
        return this.runtimeAccess;
    }

    public void setRuntimeAccess(RuntimeAccess runtimeAccess) {
        this.runtimeAccess = runtimeAccess;
    }
}
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

package com.wavemaker.common;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
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
 * @author slee
 */
public class CommonRuntimeAccess {

    private static CommonRuntimeAccess staticRuntime = null;

    private HttpServletRequest request = null;

    /**
     * Do not use this constructor; instead, use either {@link #getInstance()} or access this class through bean
     * properties.
     */
    public CommonRuntimeAccess() {
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
    public static CommonRuntimeAccess getInstance() {

        if (CommonRuntimeAccess.staticRuntime == null) {
            throw new WMRuntimeInitException("CommonRuntimeAccess uninitialized; request init failed.");
        }

        return CommonRuntimeAccess.staticRuntime;
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

    public static void setCommonRuntimeBean(CommonRuntimeAccess bean) {
        CommonRuntimeAccess.staticRuntime = bean;
    }

    public void setRequest(HttpServletRequest request) {
        this.request = request;
    }

    public Object getSpringBean(String beanId) {
        ServletContext context = this.request.getSession().getServletContext();
        WebApplicationContext applicationContext = WebApplicationContextUtils.getWebApplicationContext(context);

        return applicationContext.getBean(beanId);
    }
}
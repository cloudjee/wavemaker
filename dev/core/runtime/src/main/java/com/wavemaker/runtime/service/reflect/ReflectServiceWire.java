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

package com.wavemaker.runtime.service.reflect;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

import com.wavemaker.runtime.service.LiveDataService;
import com.wavemaker.runtime.service.ServiceType;
import com.wavemaker.runtime.service.ServiceWire;

/**
 * ServiceWire for ServiceTypes supporting default reflection. This ServiceWire type adds a property to hold the service
 * bean object.
 * 
 * @author Matt Small
 */
public class ReflectServiceWire implements ServiceWire, ApplicationContextAware {

    /**
     * The serviceType associated with this ServiceWire.
     */
    private ServiceType serviceType;

    /**
     * The ID of the service.
     */
    private String serviceId;

    /**
     * The bean of the associated service.
     */
    private Object serviceBean;

    private ApplicationContext applicationContext;

    /**
     * Get the service bean object.
     * 
     * @return Gets the service bean associated with this ReflectServiceWire's service id.
     */
    public Object getServiceBean() {
        if (null != this.serviceBean) {
            return this.serviceBean;
        } else {
            Object bean = this.applicationContext.getBean(getServiceId());
            setServiceBean(bean);
            return bean;
        }
    }

    @Override
    public String toString() {
        return "" + super.toString() + "(" + this.getServiceId() + ", " + this.getServiceType() + ")";
    }

    /**
     * Sets the service bean object.
     * 
     * @param obj The service bean object.
     */
    public void setServiceBean(Object obj) {
        this.serviceBean = obj;
    }

    @Override
    public void setServiceType(ServiceType serviceType) {
        this.serviceType = serviceType;
    }

    @Override
    public ServiceType getServiceType() {
        return this.serviceType;
    }

    @Override
    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    @Override
    public String getServiceId() {
        return this.serviceId;
    }

    @Override
    public boolean isLiveDataService() {

        return this.getServiceBean() instanceof LiveDataService;
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
}
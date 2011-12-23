/*
 *  Copyright (C) 2008-2009 WaveMaker Software, Inc.
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

package com.wavemaker.runtime.data.crud;

import org.junit.After;
import org.junit.Before;
import org.springframework.context.ApplicationContext;

import com.wavemaker.runtime.data.DataServiceTestConstants;
import com.wavemaker.runtime.data.DefaultTaskManager;
import com.wavemaker.runtime.data.RuntimeDataSpringContextTestCase;
import com.wavemaker.runtime.data.TaskManager;
import com.wavemaker.runtime.data.ThreadContext;
import com.wavemaker.runtime.data.sample.sakila.Sakila;
import com.wavemaker.runtime.service.ServiceConstants;
import com.wavemaker.runtime.service.ServiceManager;
import com.wavemaker.runtime.service.reflect.ReflectServiceWire;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public abstract class BaseCRUDServiceTest extends RuntimeDataSpringContextTestCase {

    protected Sakila sakila = null;

    protected TaskManager taskMgr = null;

    @Before
    public void setUp() throws Exception {

        ThreadContext.setPreProcessorTask(DefaultTaskManager.getInstance().getPreProcessorRouterTask());

        ApplicationContext ctx = getApplicationContext();
        ServiceManager serviceMgr = (ServiceManager) ctx.getBean(ServiceConstants.SERVICE_MANAGER_NAME);
        this.sakila = (Sakila) ((ReflectServiceWire) serviceMgr.getServiceWire(DataServiceTestConstants.SAKILA_SERVICE_SPRING_ID_2)).getServiceBean();

        this.taskMgr = (TaskManager) getBean(DataServiceTestConstants.SAKILA_TASK_MGR);
    }

    @After
    @Override
    public void tearDown() throws Exception {
        super.tearDown();

        ThreadContext.unsetPreProcessorTask();

        this.sakila.getDataServiceManager().dispose();
    }

}

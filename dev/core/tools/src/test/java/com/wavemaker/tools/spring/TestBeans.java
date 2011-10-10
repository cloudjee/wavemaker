/*
 *  Copyright (C) 2007-2009 WaveMaker Software, Inc.
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

package com.wavemaker.tools.spring;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.tools.project.LocalStudioConfiguration;
import com.wavemaker.tools.service.AbstractFileService;
import com.wavemaker.tools.service.FileService;
import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;

/**
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class TestBeans extends WMTestCase {

    private FileService fileService;

    @Override
    public void setUp() throws Exception {
        this.fileService = new AbstractFileService(new LocalStudioConfiguration()) {

            public Resource getFileServiceRoot() {
                try {
                    return ClassLoaderUtils.getClasspathFile("com/wavemaker/tools/spring/");
                } catch (IOException e) {
                    throw new WMRuntimeException(e);
                }
            }

        };
    }

    public void testGetBeanById() throws Exception {
        File configFile = ClassLoaderUtils.getClasspathFile("com/wavemaker/tools/spring/spring-test1.xml").getFile();
        Beans beans = SpringConfigSupport.readBeans(new FileSystemResource(configFile), this.fileService);
        Bean bean = beans.getBeanById("book2");
        assertNotNull(bean);
        assertEquals("com.wavemaker.tools.spring.Book", bean.getClazz());
    }

    public void testAddBean() throws Exception {
        File configFile = ClassLoaderUtils.getClasspathFile("com/wavemaker/tools/spring/spring-test1.xml").getFile();
        Beans beans = SpringConfigSupport.readBeans(new FileSystemResource(configFile), this.fileService);
        Bean bean1 = new Bean();
        bean1.setId("book3");
        bean1.setClazz("com.wavemaker.tools.spring.Book");
        beans.addBean(bean1);
        Bean bean2 = beans.getBeanById("book3");
        assertNotNull(bean2);
        assertEquals(bean1.getId(), bean2.getId());
        assertEquals(bean1.getClazz(), bean2.getClazz());
    }

    public void testRemoveBean() throws Exception {
        File configFile = ClassLoaderUtils.getClasspathFile("com/wavemaker/tools/spring/spring-test1.xml").getFile();
        Beans beans = SpringConfigSupport.readBeans(new FileSystemResource(configFile), this.fileService);
        assertTrue(beans.removeBeanById("book1"));
        assertEquals(2, beans.getImportsAndAliasAndBean().size());
    }

    public void testGetBeanList() throws Exception {
        File configFile = ClassLoaderUtils.getClasspathFile("com/wavemaker/tools/spring/spring-test1.xml").getFile();
        Beans beans = SpringConfigSupport.readBeans(new FileSystemResource(configFile), this.fileService);
        List<Bean> beanList = beans.getBeanList();
        assertEquals(3, beanList.size());
    }

    public void testSetBeanList() throws Exception {
        File configFile = ClassLoaderUtils.getClasspathFile("com/wavemaker/tools/spring/spring-test1.xml").getFile();
        Beans beans = SpringConfigSupport.readBeans(new FileSystemResource(configFile), this.fileService);
        List<Bean> beanList = beans.getBeanList();
        Bean bean = new Bean();
        bean.setId("test");
        beanList.add(bean);
        beans.setBeanList(beanList);
        assertEquals(4, beans.getBeanList().size());
    }
}

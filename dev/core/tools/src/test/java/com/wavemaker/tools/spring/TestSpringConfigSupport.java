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
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.List;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.spring.SpringConfigSupport;
import com.wavemaker.tools.spring.beans.Bean;
import com.wavemaker.tools.spring.beans.Beans;
import com.wavemaker.tools.spring.beans.ListOrSetType;
import com.wavemaker.tools.spring.beans.Property;

/**
 * @author ffu
 * @version $Rev:22686 $ - $Date:2008-05-30 16:27:22 -0700 (Fri, 30 May 2008) $
 * 
 */
public class TestSpringConfigSupport extends WMTestCase {

    public void testReadBeans() throws Exception {
        
        File configFile = ClassLoaderUtils
                .getClasspathFile("com/wavemaker/tools/spring/spring-test1.xml");
        Project project = new Project(configFile.getParentFile());
        Beans beans = SpringConfigSupport.readBeans(configFile, project);
        List<Object> beansChildren = beans.getImportsAndAliasAndBean();
        assertEquals(3, beansChildren.size());
        for (Object o1 : beansChildren) {
            if (o1 instanceof Bean) {
                Bean bean = (Bean) o1;
                String beanId = bean.getId();
                if (beanId.equals("book1")) {
                    assertEquals("com.wavemaker.tools.spring.Book", bean
                            .getClazz());
                } else if (beanId.equals("bookManager")) {
                    List<Object> beanChildren = bean
                            .getMetasAndConstructorArgsAndProperties();
                    assertEquals(1, beanChildren.size());
                    for (Object o2 : beanChildren) {
                        if (o2 instanceof Property) {
                            Property pt = (Property) o2;
                            ListOrSetType list = pt.getList();
                            assertEquals(2, list.getRefElement().size());
                        }
                    }
                }
            }
        }
    }

    public void testWriteBeans() throws Exception {
        Beans beans = new Beans();
        Bean bean1 = new Bean();
        bean1.setId("book1");
        bean1.setClazz("com.wavemaker.tools.spring.Book");
        List<Object> importOrAliasOrBeanList = beans.getImportsAndAliasAndBean();
        importOrAliasOrBeanList.add(bean1);

        File configFile = null;
        try {
            configFile = File.createTempFile("spring-text", ".xml");
            Writer writer = new OutputStreamWriter(
                    new FileOutputStream(configFile),
                    ServerConstants.DEFAULT_ENCODING);
            SpringConfigSupport.writeBeans(beans, writer);
            writer.close();

            // Need to use MockFileSystemXmlApplicationContext since
            // FileSystemXmlApplicatinoContext turns "/tmp/abc.xml" to a
            // relative path "tmp/abc.xml"
            ApplicationContext ctx = new MockFileSystemXmlApplicationContext(
                    configFile.getPath());
            Object bean = ctx.getBean("book1");
            assertEquals(Book.class, bean.getClass());
        } finally {
            if (configFile != null) {
                configFile.delete();
            }
        }
    }

    public static class MockFileSystemXmlApplicationContext extends
            FileSystemXmlApplicationContext {

        public MockFileSystemXmlApplicationContext(String configLocation)
                throws BeansException {
            super(configLocation);
        }

        @Override
        protected Resource getResourceByPath(String path) {
            return new FileSystemResource(path);
        }
    }
}

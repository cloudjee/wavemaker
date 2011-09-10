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
package com.wavemaker.runtime.server;

import java.util.Map;

import org.springframework.beans.factory.xml.XmlBeanDefinitionReader;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.core.io.ClassPathResource;

import com.wavemaker.infra.WMTestCase;
import com.wavemaker.runtime.server.testspring.BeanClass;
import com.wavemaker.runtime.server.testspring.BeanMap;
import com.wavemaker.runtime.server.testspring.CircularA;
import com.wavemaker.runtime.server.testspring.CircularB;
import com.wavemaker.runtime.server.testspring.UtilMapBeanClass;

/**
 * @author Matt Small
 * @version $Rev$ - $Date$
 * 
 */
public class TestSpring extends WMTestCase {

    private static final String BEAN_MAP1_NAME = "mapBean1";
    private static final String BEAN_MAP2_NAME = "mapBean2";
    private static final String BEAN1_MAPKEY = "bean1";
    private static final String OBJECT_BEAN1_NAME = "ObjectBean1";
    private static final String OBJECT_BEAN1 = "objectBean1";
    private static final String BEAN2_MAPKEY = "bean2";
    private static final String OBJECT_BEAN2_NAME = "ObjectBean2";
    private static final String OBJECT_BEAN2 = "objectBean2";

    public void testMapSingle() {
        
        GenericApplicationContext ctx = new GenericApplicationContext();
        XmlBeanDefinitionReader xmlReader = new XmlBeanDefinitionReader(ctx);
        xmlReader.loadBeanDefinitions(new ClassPathResource(
                "com/wavemaker/runtime/server/testspring/one.xml"));
        xmlReader.loadBeanDefinitions(new ClassPathResource(
                "com/wavemaker/runtime/server/testspring/beanclass.xml"));

        assertNotNull(ctx);
        assertTrue(ctx.containsBean(OBJECT_BEAN1));
        assertTrue(ctx.containsBean(BEAN_MAP1_NAME));

        BeanMap bm = (BeanMap) ctx.getBean(BEAN_MAP1_NAME);
        assertNotNull(bm);
        Map<?,?> bmMap = bm.getMapping();

        assertTrue(bmMap.containsKey(BEAN1_MAPKEY));
        BeanClass bc = (BeanClass) bmMap.get(BEAN1_MAPKEY);
        assertEquals(OBJECT_BEAN1_NAME, bc.getName());
    }

    public void testMapMerge() {
        
        GenericApplicationContext ctx = new GenericApplicationContext();
        XmlBeanDefinitionReader xmlReader = new XmlBeanDefinitionReader(ctx);
        xmlReader.loadBeanDefinitions(new ClassPathResource(
                "com/wavemaker/runtime/server/testspring/one.xml"));
        xmlReader.loadBeanDefinitions(new ClassPathResource(
                "com/wavemaker/runtime/server/testspring/two.xml"));
        xmlReader.loadBeanDefinitions(new ClassPathResource(
                "com/wavemaker/runtime/server/testspring/beanclass.xml"));

        assertNotNull(ctx);
        assertTrue(ctx.containsBean(BEAN_MAP1_NAME));
        assertTrue(ctx.containsBean(OBJECT_BEAN1));
        assertTrue(ctx.containsBean(OBJECT_BEAN2));

        {
            BeanMap bm = (BeanMap) ctx.getBean(BEAN_MAP1_NAME);
            assertNotNull(bm);
            Map<?,?> bmMap = bm.getMapping();
            assertNotNull(bmMap);

            assertTrue(bmMap.containsKey(BEAN1_MAPKEY));
            BeanClass bc1 = (BeanClass) bmMap.get(BEAN1_MAPKEY);
            assertEquals(OBJECT_BEAN1_NAME, bc1.getName());
        }

        {
            BeanMap bm2 = (BeanMap) ctx.getBean(BEAN_MAP2_NAME);
            assertNotNull(bm2);
            Map<?,?> bmMap2 = bm2.getMapping();
            assertNotNull(bmMap2);

            assertTrue(bmMap2.containsKey(BEAN1_MAPKEY));
            BeanClass bc2_1 = (BeanClass) bmMap2.get(BEAN1_MAPKEY);
            assertEquals(OBJECT_BEAN1_NAME, bc2_1.getName());

            assertTrue(bmMap2.containsKey(BEAN2_MAPKEY));
            BeanClass bc2_2 = (BeanClass) bmMap2.get(BEAN2_MAPKEY);
            assertEquals(OBJECT_BEAN2_NAME, bc2_2.getName());
        }
    }
    
    public void testUtilMap() throws Exception {
        
        GenericApplicationContext ctx = new GenericApplicationContext();
        XmlBeanDefinitionReader xmlReader = new XmlBeanDefinitionReader(ctx);
        xmlReader.loadBeanDefinitions(new ClassPathResource(
                "com/wavemaker/runtime/server/testspring/test-utilmap.xml"));
        
        assertNotNull(ctx);
        assertTrue(ctx.containsBean("utilMapBeanClass"));
        UtilMapBeanClass umbc = (UtilMapBeanClass) ctx.getBean("utilMapBeanClass");
        
        Map<String, String> configMap = umbc.getMap();
        assertTrue(configMap.containsKey("activeGridHome"));
        assertEquals("fooBar", configMap.get("activeGridHome"));
    }
    
    public void testCircular() throws Exception {
        
        GenericApplicationContext ctx = new GenericApplicationContext();
        XmlBeanDefinitionReader xmlReader = new XmlBeanDefinitionReader(ctx);
        xmlReader.loadBeanDefinitions(new ClassPathResource(
                "com/wavemaker/runtime/server/testspring/circular.xml"));
        
        assertNotNull(ctx);
        assertTrue(ctx.containsBean("a"));
        assertTrue(ctx.containsBean("b"));
        CircularA a = (CircularA) ctx.getBean("a");
        CircularB b = (CircularB) ctx.getBean("b");
        
        assertSame(a, b.getA());
        assertSame(b, a.getB());
    }
    
    public void testLazyLoading() throws Exception {
        
        GenericApplicationContext ctx = new GenericApplicationContext();
        XmlBeanDefinitionReader xmlReader = new XmlBeanDefinitionReader(ctx);
        xmlReader.loadBeanDefinitions(new ClassPathResource(
                "com/wavemaker/runtime/server/testspring/test-lazybeans.xml"));
        
        try {
            ctx.getBean("badConstructor");
            fail("should have failed");
        } catch (RuntimeException e) {
            // good
        }
        
        try {
            ctx.getBean("fixableConstructor");
            fail("should have failed");
        } catch (RuntimeException e) {
            // good
        }
        
        FixableConstructor.fixConstructor = true;
        ctx.getBean("fixableConstructor");
    }
    
    public static class BadConstructor {
        
        public BadConstructor() {
            throw new RuntimeException("bad constructor");
        }
    }
    
    public static class FixableConstructor {
        
        public static boolean fixConstructor = false;
        
        public FixableConstructor() {
            
            if (!fixConstructor) {
                throw new RuntimeException("bad constructor");
            }
        }
    }
}
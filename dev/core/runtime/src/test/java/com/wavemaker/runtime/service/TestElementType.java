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

package com.wavemaker.runtime.service;

import java.util.List;

import org.springframework.util.ClassUtils;

import com.wavemaker.common.util.CollectionUtils;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.json.type.FieldDefinition;
import com.wavemaker.json.type.ObjectTypeDefinition;
import com.wavemaker.json.type.OperationEnumeration;
import com.wavemaker.json.type.TypeDefinition;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class TestElementType extends WMTestCase {

    @Override
    public void setUp() throws Exception {
        SpringUtils.initSpringConfig();
    }

    public void testPropertyFromClass() throws Exception {

        ElementType et = new ElementType(this.getClass());
        assertEquals("com.wavemaker.runtime.service.TestElementType", et.getJavaType());
        assertEquals(4, et.getProperties().size());

        for (ElementType prop : et.getProperties()) {
            if (prop.getName().equals("stringList")) {
                assertEquals("java.lang.String", prop.getJavaType());
                assertTrue(prop.isList());
                prop.setRequire(CollectionUtils.createList(OperationEnumeration.read, OperationEnumeration.update, OperationEnumeration.delete));
                prop.setExclude(CollectionUtils.createList(OperationEnumeration.insert));
                prop.setNoChange(CollectionUtils.createList(OperationEnumeration.update));
            } else if (prop.getName().equals("intVal")) {
                assertEquals("int", prop.getJavaType());
                assertFalse(prop.isList());
                prop.setSupportsQuickData(true);
            } else if (prop.getName().equals("stringArray")) {
                assertEquals("java.lang.String", prop.getJavaType());
                assertTrue(prop.isList());
            } else if (prop.getName().equals("name")) {
                continue;
            } else {
                fail("unknown prop: " + prop.getName());
            }
        }

        // and test fd conversion
        FieldDefinition fd = et.toFieldDefinition();
        assertEquals(0, fd.getDimensions());
        assertNotNull(fd.getTypeDefinition());

        TypeDefinition td = fd.getTypeDefinition();
        assertEquals(et.getJavaType(), td.getTypeName());

        assertTrue(td instanceof ObjectTypeDefinition);
        ObjectTypeDefinition otd = (ObjectTypeDefinition) td;
        assertEquals(et.getProperties().size(), otd.getFields().size());

        for (ElementType prop : et.getProperties()) {

            if (prop.getName().equals("name")) {
                continue;
            }

            FieldDefinition field = otd.getFields().get(prop.getName());
            checkAttributes(prop, field);
        }
    }

    public void testWithArrayField() throws Exception {

        ElementType nested = new ElementType(ClassUtils.forName("int[]"));
        nested.setList(true);

        ElementType et = new ElementType("foo.bar.Baz");
        et.addProperty(nested);

        FieldDefinition fd = et.toFieldDefinition();
        assertEquals("foo.bar.Baz", fd.getTypeDefinition().getTypeName());

        assertTrue(fd.getTypeDefinition() instanceof ObjectTypeDefinition);
        ObjectTypeDefinition otd = (ObjectTypeDefinition) fd.getTypeDefinition();

        assertEquals(1, otd.getFields().size());
        FieldDefinition nestedFD = otd.getFields().values().iterator().next();
        assertEquals("int", nestedFD.getTypeDefinition().getTypeName());
        assertTrue(nestedFD.getDimensions() > 0);
    }

    protected void checkAttributes(ElementType prop, FieldDefinition field) {

        assertNotNull(field);
        assertNotNull(field.getTypeDefinition());

        assertEquals(prop.isList() ? 1 : 0, field.getDimensions());
        assertEquals(prop.isAllowNull(), field.isAllowNull());
        assertEquals(prop.getName(), field.getName());

        assertEquals(prop.isSupportsQuickData(), field.getTypeDefinition().isLiveService());
        assertEquals(prop.getJavaType(), field.getTypeDefinition().getTypeName());

        assertEquals(prop.getExclude().size(), field.getExclude().size());
        assertEquals(prop.getRequire().size(), field.getRequire().size());
        assertEquals(prop.getNoChange().size(), field.getNoChange().size());
        for (int i = 0; i < prop.getExclude().size(); i++) {
            assertEquals(prop.getExclude().get(i), field.getExclude().get(i));
        }
        for (int i = 0; i < prop.getNoChange().size(); i++) {
            assertEquals(prop.getNoChange().get(i), field.getNoChange().get(i));
        }
        for (int i = 0; i < prop.getRequire().size(); i++) {
            assertEquals(prop.getRequire().get(i), field.getRequire().get(i));
        }
    }

    private String[] stringArray;

    private List<String> stringList;

    private int intVal;

    public List<String> getStringList() {
        return this.stringList;
    }

    public void setStringList(List<String> stringList) {
        this.stringList = stringList;
    }

    public int getIntVal() {
        return this.intVal;
    }

    public void setIntVal(int intVal) {
        this.intVal = intVal;
    }

    public String[] getStringArray() {
        return this.stringArray;
    }

    public void setStringArray(String[] stringArray) {
        this.stringArray = stringArray;
    }
}
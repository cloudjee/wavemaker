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

package com.wavemaker.tools.service.definitions;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import org.apache.commons.io.FileUtils;

import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.json.type.OperationEnumeration;
import com.wavemaker.runtime.ws.WebServiceType;
import com.wavemaker.tools.service.definitions.DataObject.Element;

/**
 * @author Matt Small
 */
public class ServiceDefinitionsTest extends WMTestCase {

    JAXBContext jaxbContext;

    Unmarshaller unmarshaller;

    Marshaller marshaller;

    @Override
    public void setUp() throws Exception {

        this.jaxbContext = JAXBContext.newInstance("com.wavemaker.tools.service.definitions");
        this.unmarshaller = this.jaxbContext.createUnmarshaller();
        this.marshaller = this.jaxbContext.createMarshaller();
    }

    public void testBasicFoo() throws Exception {

        File configFile = ClassLoaderUtils.getClasspathFile("com/wavemaker/tools/service/definitions/sd-testbasic.xml").getFile();
        Service service = (Service) this.unmarshaller.unmarshal(configFile);

        assertEquals("fooService", service.getId());
        assertEquals("foo.bar.FooService", service.getClazz());
        assertEquals(WebServiceType.TYPE_NAME, service.getType());
        assertNotNull(service.getOperation());
        List<Operation> operations = service.getOperation();

        assertEquals(2, operations.size());

        Operation op = null;
        for (Operation o : operations) {
            if ("getFoo".equals(o.getName())) {
                op = o;
                break;
            }
        }
        assertNotNull(op);
        assertEquals("getFoo", op.getName());

        List<Operation.Parameter> params = op.getParameter();
        assertEquals(2, params.size());
        for (Operation.Parameter param : params) {
            if (param.getName().equals("arg1")) {
                assertEquals("string", param.getTypeRef());
                assertEquals(false, param.isIsList());
            } else if (param.getName().equals("arg2")) {
                assertEquals("int", param.getTypeRef());
                assertEquals(false, param.isIsList());
            } else {
                fail("Unknown parameter: " + param.getName());
            }
        }

        Operation.Return ret = op.getReturn();
        assertEquals("string", ret.getTypeRef());
        assertEquals(false, ret.isIsList());

        DataObjects dataobjectss = service.getDataobjects();
        List<DataObject> dos = dataobjectss.getDataobject();
        assertEquals(1, dos.size());

        List<Element> elements = dos.get(0).getElement();
        assertEquals(2, elements.size());
        assertEquals("firstName", elements.get(0).getName());
        assertEquals("String", elements.get(0).getTypeRef());
        assertEquals(1, elements.get(0).getRequire().size());
        assertEquals(OperationEnumeration.read, elements.get(0).getRequire().get(0));

        assertEquals("lastName", elements.get(1).getName());
        assertEquals("FooString", elements.get(1).getTypeRef());
        assertEquals(0, elements.get(1).getRequire().size());
        assertEquals(1, elements.get(1).getNoChange().size());
        assertEquals(2, elements.get(1).getExclude().size());
        assertEquals(OperationEnumeration.delete, elements.get(1).getNoChange().get(0));
        assertTrue(elements.get(1).getExclude().contains(OperationEnumeration.insert));
        assertTrue(elements.get(1).getExclude().contains(OperationEnumeration.update));

    }

    public void testBasicBar() throws Exception {

        File configFile = ClassLoaderUtils.getClasspathFile("com/wavemaker/tools/service/definitions/sd-testbasic.xml").getFile();
        Service service = (Service) this.unmarshaller.unmarshal(configFile);

        assertEquals("fooService", service.getId());
        assertEquals("foo.bar.FooService", service.getClazz());
        assertNotNull(service.getOperation());
        List<Operation> operations = service.getOperation();

        assertEquals(2, operations.size());

        Operation op = null;
        for (Operation o : operations) {
            if ("getBar".equals(o.getName())) {
                op = o;
                break;
            }
        }
        assertNotNull(op);
        assertEquals("getBar", op.getName());

        List<Operation.Parameter> params = op.getParameter();
        assertEquals(1, params.size());
        for (Operation.Parameter param : params) {
            if (param.getName().equals("arg1")) {
                assertEquals("float", param.getTypeRef());
                assertEquals(true, param.isIsList());
            } else {
                fail("Unknown parameter: " + param.getName());
            }
        }

        Operation.Return ret = op.getReturn();
        assertEquals("string", ret.getTypeRef());
        assertEquals(true, ret.isIsList());
    }

    public void testOperationComparator() throws Exception {

        List<Operation> ops = new ArrayList<Operation>();
        Operation op = new Operation();
        op.setName("b");
        ops.add(op);

        op = new Operation();
        op.setName("a");
        ops.add(op);

        op = new Operation();
        op.setName("c");
        op.getParameter().add(new Operation.Parameter());
        op.getParameter().add(new Operation.Parameter());
        ops.add(op);

        op = new Operation();
        op.setName("c");
        op.getParameter().add(new Operation.Parameter());
        ops.add(op);

        assertEquals("b", ops.get(0).getName());
        assertEquals(2, ops.get(2).getParameter().size());

        Collections.sort(ops, new OperationComparator());

        assertEquals("a", ops.get(0).getName());
        assertEquals(2, ops.get(3).getParameter().size());
    }

    public void testServiceComparator() throws Exception {

        List<Service> services = new ArrayList<Service>();
        Service service = new Service();
        service.setId("b");
        services.add(service);

        service = new Service();
        service.setId("a");
        services.add(service);

        assertEquals("b", services.get(0).getId());

        Collections.sort(services, new ServiceComparator());
        assertEquals("a", services.get(0).getId());

        /*
         * this will NPE: service = new Service(); services.add(service); Collections.sort(services, new
         * ServiceComparator());
         */
    }

    public void testMarshaller() throws Exception {

        File file = File.createTempFile("testMarshaller", ".xml");
        file.deleteOnExit();

        Service service = new Service();
        service.setClazz("foo.bar");
        service.setId("fooService");
        service.setDataobjects(new DataObjects());

        DataObject dao = new DataObject();
        service.getDataobjects().getDataobject().add(dao);
        dao.setJavaType("foo.bar.Private");
        dao.setName("PrivateType");

        Element elem = new Element();
        elem.getExclude().add(OperationEnumeration.read);
        dao.getElement().add(elem);
        elem = new Element();
        elem.getRequire().add(OperationEnumeration.insert);
        elem.getRequire().add(OperationEnumeration.update);
        dao.getElement().add(elem);

        this.marshaller.marshal(service, file);

        String contents = FileUtils.readFileToString(file);

        assertTrue(contents.contains("javaType=\"foo.bar.Private\""));
        assertTrue(contents.contains("<exclude>read</exclude>"));
        assertTrue(contents.contains("<require>insert</require>"));
        assertTrue(contents.contains("<require>update</require>"));

        file.delete();
    }
}

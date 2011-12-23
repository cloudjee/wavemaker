/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.ws.jaxb.boolean_getter;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.xml.sax.ErrorHandler;
import org.xml.sax.SAXException;

import com.sun.codemodel.JMethod;
import com.sun.tools.xjc.Options;
import com.sun.tools.xjc.Plugin;
import com.sun.tools.xjc.outline.ClassOutline;
import com.sun.tools.xjc.outline.Outline;

/**
 * This Plugin will rename isXXX methods to getXXX methods for <code>java.lang.Boolean</code> type properties. If the
 * element is of type xsd:boolean and optional, JAXB would generate <code>java.lang.Boolean</code> type for the element
 * and the getter method would be named isXXX. But according to JavaBeans spec, the getter method for
 * <code>java.lange.Boolean</code> should be named getXXX. This plugin is handy if you want to use your XJC generated
 * classes in frameworks that need to deal with JavaBeans.
 * 
 * @author Frankie Fu
 */
public class PluginImpl extends Plugin {

    @Override
    public String getOptionName() {
        return "Xboolean-getter";
    }

    @Override
    public List<String> getCustomizationURIs() {
        return Collections.singletonList(Const.NS);
    }

    @Override
    public boolean isCustomizationTagName(String nsUri, String localName) {
        return nsUri.equals(Const.NS) && localName.equals("boolean");
    }

    @Override
    public String getUsage() {
        return "  -Xboolean-getter\t:  replace isXXX method to getXXX method for Boolean type properties";
    }

    @Override
    public boolean run(Outline model, Options opt, ErrorHandler errorHandler) throws SAXException {
        for (ClassOutline co : model.getClasses()) {
            Collection<JMethod> methods = co.implClass.methods();
            for (JMethod method : methods) {
                if (method.name().startsWith("is") && method.type().fullName().equals(Boolean.class.getName())) {
                    method.name("get" + method.name().substring(2));
                }
            }
        }
        return true;
    }

}

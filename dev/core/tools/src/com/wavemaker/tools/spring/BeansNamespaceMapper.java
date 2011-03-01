/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
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

import com.sun.xml.bind.marshaller.NamespacePrefixMapper;

/**
 * @author ffu
 * @version $Rev$ - $Date$
 *
 */
public class BeansNamespaceMapper extends NamespacePrefixMapper {

    @Override
    public String getPreferredPrefix(String namespaceUri,
            String suggestion, boolean requirePrefix) {
        if ("http://www.springframework.org/schema/beans".equals(namespaceUri)) {
            return "";
        } else if ("http://www.w3.org/2001/XMLSchema-instance".equals(namespaceUri)) {
            return "xsi";
        } else {
            return null;
        }
    }
}

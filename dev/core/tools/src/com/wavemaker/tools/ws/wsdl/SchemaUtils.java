/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
package com.wavemaker.tools.ws.wsdl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.ws.commons.schema.XmlSchemaComplexType;
import org.apache.ws.commons.schema.XmlSchemaElement;
import org.apache.ws.commons.schema.XmlSchemaObjectCollection;
import org.apache.ws.commons.schema.XmlSchemaParticle;
import org.apache.ws.commons.schema.XmlSchemaSequence;
import org.apache.ws.commons.schema.XmlSchemaType;

import com.wavemaker.common.util.CastUtils;

/**
 * Schema related utility methods.
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 */
public class SchemaUtils {

    public static List<XmlSchemaElement> getChildElements(
            XmlSchemaType schemaType) {
        List<XmlSchemaElement> childElements = new ArrayList<XmlSchemaElement>();
        if (schemaType instanceof XmlSchemaComplexType) {
            XmlSchemaComplexType cmplxType = (XmlSchemaComplexType) schemaType;
            XmlSchemaParticle particle = cmplxType.getParticle();
            if (cmplxType.getParticle() != null) {
                if (particle instanceof XmlSchemaSequence) {
                    XmlSchemaSequence sequence = (XmlSchemaSequence) particle;
                    XmlSchemaObjectCollection items = sequence.getItems();

                    if (items.getCount() > 0) {
                        for (Iterator<Object> i = CastUtils.cast(items.getIterator()); i.hasNext();) {
                            Object item = i.next();
                            if (item instanceof XmlSchemaElement) {
                                childElements.add((XmlSchemaElement) item);
                            }
                        }
                    }
                }
            }
        }
        return childElements;
    }

}

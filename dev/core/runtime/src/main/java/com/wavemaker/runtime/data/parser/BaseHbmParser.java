/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.data.parser;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.io.StringReader;

import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLResolver;
import javax.xml.stream.XMLStreamConstants;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.ClassLoaderUtils;

/**
 * @author Simon Toens
 */
public abstract class BaseHbmParser {

    private Reader reader = null;

    protected XMLStreamReader xmlReader = null;

    protected String currentElementName = null;

    protected StringBuilder currentText = new StringBuilder();

    public abstract void initAll();

    protected BaseHbmParser() {
    }

    protected BaseHbmParser(String s) {
        this(new StringReader(s));
    }

    protected BaseHbmParser(File f) {
        this(init(f));
    }

    protected BaseHbmParser(Reader reader) {
        if (reader == null) {
            throw new IllegalArgumentException("Reader cannot be null");
        }
        this.reader = reader;
        try {
            XMLInputFactory factory = XMLInputFactory.newInstance();
            setupEntityResolver(factory);
            this.xmlReader = factory.createXMLStreamReader(reader);
        } catch (XMLStreamException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    protected String nextNested(String parentElementName, String... elementNames) {
        if (elementNames.length == 0) {
            // called like this by accident: nextNested("foo")
            // compiles because of varargs
            throw new AssertionError("nextNested requires at least 2 args");
        }
        return nextInternal(parentElementName, -1, elementNames);
    }

    protected String next(String... elementNames) {
        return nextInternal(null, -1, elementNames);
    }

    public void close() {
        try {
            this.xmlReader.close();
        } catch (Exception ignore) {
        }
        try {
            this.reader.close();
        } catch (Exception ignore) {
        }
    }

    protected String next() {
        return nextInternal(null, 1, (String[]) null);
    }

    protected String nextCharacterData() {
        return nextInternal(this.currentElementName, -1, (String[]) null);
    }

    protected String nextInternal(String parentElementName, int numTries, String... elementNames) {

        int i = 1;

        try {

            for (int event = this.xmlReader.next(); event != XMLStreamConstants.END_DOCUMENT; event = this.xmlReader.next()) {

                switch (event) {
                    case XMLStreamConstants.START_ELEMENT:

                        this.currentText.delete(0, this.currentText.length());
                        this.currentElementName = this.xmlReader.getName().toString();

                        if (numTries > -1) {
                            if (i == numTries) {
                                return this.currentElementName;
                            } else if (i > numTries) {
                                return null;
                            }
                        }

                        i++;

                        if (elementNames != null) {
                            for (String s : elementNames) {
                                if (s.equals(this.currentElementName)) {
                                    return this.currentElementName;
                                }
                            }
                        }
                        break;
                    case XMLStreamConstants.END_ELEMENT:
                        String endElementName = this.xmlReader.getName().toString();
                        if (endElementName.equals(parentElementName)) {
                            return null;
                        }
                        break;
                    case XMLStreamConstants.CHARACTERS:
                        this.currentText.append(this.xmlReader.getText());
                        break;
                    case XMLStreamConstants.CDATA:
                        break;
                }
            }

        } catch (XMLStreamException ex) {
            throw new WMRuntimeException(ex);
        }

        return null;

    }

    private static Reader init(File f) {
        try {
            return new BufferedReader(new FileReader(f));
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    private static void setupEntityResolver(XMLInputFactory factory) {

        factory.setXMLResolver(new XMLResolver() {

            @Override
            public Object resolveEntity(String publicId, String systemId, String s1, String s2) {
                if (HbmConstants.HBM_SYSTEM_ID.equals(systemId)) {
                    InputStream rtn = ClassLoaderUtils.getResourceAsStream("com/wavemaker/tools/data/hibernate-mapping-3.0.dtd");
                    if (rtn == null) {
                        // get rid of references to "tools" package
                        Log parserLogger = LogFactory.getLog("com.wavemaker.tools.data.parser");
                        parserLogger.warn("Did not find local copy of \"hibernate-mapping-3.0.dtd\"");
                        // DataServiceLoggers.parserLogger.warn( //
                        // "Did not find local copy of \"hibernate-mapping-3.0.dtd\"");
                    } else {
                        return rtn;
                    }
                }
                return null;
            }
        });
    }

}

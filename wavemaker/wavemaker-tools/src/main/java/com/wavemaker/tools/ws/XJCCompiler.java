/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.ws;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.File;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.io.Resource;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXParseException;

import com.sun.codemodel.JCodeModel;
import com.sun.tools.ws.processor.modeler.wsdl.ClassNameAllocatorImpl;
import com.sun.tools.xjc.Options;
import com.sun.tools.xjc.api.ClassNameAllocator;
import com.sun.tools.xjc.api.ErrorListener;
import com.sun.tools.xjc.api.S2JJAXBModel;
import com.sun.tools.xjc.api.SchemaCompiler;
import com.sun.tools.xjc.api.SpecVersion;
import com.sun.tools.xjc.api.XJC;
import com.wavemaker.runtime.ws.util.Constants;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.tools.ws.jaxws.SimpleClassNameCollector;
import com.wavemaker.tools.ws.wsdl.WSDL.WebServiceType;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.filesystem.FileSystem;
import com.wavemaker.tools.io.filesystem.FileSystemFolder;
import com.wavemaker.tools.io.filesystem.local.LocalFileSystem;
import com.wavemaker.common.util.IOUtils;

/**
 * JAXB binding compiler.
 * 
 * @author Frankie Fu
 * @author Jeremy Grelle
 */
public class XJCCompiler {

    private static Log log = LogFactory.getLog(XJCCompiler.class);

    public static void generate(S2JJAXBModel model, Folder outputDir) throws GenerationException {
        JAXBCompilerErrorListener listener = new JAXBCompilerErrorListener();
        JCodeModel generateCode = model.generateCode(null, listener);
        if (listener.hasError) {
            throw listener.getException();
        }
        try {
            // TODO - Cheating for now, as the com.sun.* stuff will potentially need to be replaced on CF
            if (outputDir.getResourceOrigin().equals(FileSystem.ResourceOrigin.MONGO_DB)) {
                File tempOutputDir = IOUtils.createTempDirectory("ws_out_directory", null);
                generateCode.build(tempOutputDir, tempOutputDir, null);
                LocalFileSystem fileSystem = new LocalFileSystem(tempOutputDir);
                Folder folder = FileSystemFolder.getRoot(fileSystem);
                folder.copyTo(outputDir);
            } else {
                generateCode.build((File)outputDir.getOriginalResource(), (File)outputDir.getOriginalResource(), null);
            }
        } catch (IOException e) {
            throw new GenerationException(e);
        }
        if (listener.hasError) {
            throw listener.getException();
        }
    }

    @SuppressWarnings("deprecation")
    public static S2JJAXBModel createSchemaModel(Map<String, Element> schemas, List<com.wavemaker.tools.io.File> bindingFiles, String packageName,
        Set<String> auxiliaryClasses, WebServiceType type) throws GenerationException {
        if (schemas == null || schemas.isEmpty()) {
            return null;
        }
        SchemaCompiler sc = XJC.createSchemaCompiler();
        if (type == WebServiceType.SOAP) {
            // mimic what JAXWS's WsimportTool would do for SEI class name and
            // JAXB class name collision.
            ClassNameAllocator allocator = new ClassNameAllocatorImpl(new SimpleClassNameCollector(auxiliaryClasses));
            sc.setClassNameAllocator(allocator);
        }
        JAXBCompilerErrorListener listener = new JAXBCompilerErrorListener();
        sc.setErrorListener(listener);
        try {
            Field ncc = sc.getClass().getDeclaredField("NO_CORRECTNESS_CHECK");
            ncc.setAccessible(true);
            ncc.set(sc, true);
        } catch (Exception e) {
            throw new GenerationException(e);
        }

        if (packageName != null) {
            sc.setDefaultPackageName(packageName);
        }

        for (Entry<String, Element> entry : schemas.entrySet()) {
            Element schema = entry.getValue();
            // need to remove xsd:import or you will get element/type already
            // defined error during sc.bind()
            Element updatedSchema = removeImportElement(schema);

            sc.parseSchema(entry.getKey(), updatedSchema);
        }

        if (bindingFiles != null) {
            for (com.wavemaker.tools.io.File file : bindingFiles) {
                //try {
                    InputSource inputSource = new InputSource(file.getContent().asInputStream());
                    //cftempfix
                    //inputSource.setSystemId(file.getURI().toString());
                    sc.parseSchema(inputSource);
                //} catch (FileNotFoundException e) {
                //    throw new GenerationException(e);
                //} catch (IOException e) {
                //    throw new GenerationException(e);
                //}
            }
        }

        Options options = sc.getOptions();
        options.target = SpecVersion.V2_1;
        // suppress generation of package level annotations
        options.packageLevelAnnotations = false;
        // generate setter methods for Collection based properties
        options.activePlugins.add(new com.sun.tools.xjc.addon.collection_setter_injector.PluginImpl());
        // replace isXXX with getXXX for Boolean type properties
        options.activePlugins.add(new com.wavemaker.tools.ws.jaxb.boolean_getter.PluginImpl());

        S2JJAXBModel model = sc.bind();
        if (listener.hasError) {
            throw listener.getException();
        }
        return model;
    }

    private static Element removeImportElement(Element element) {
        NodeList nodeList = element.getElementsByTagNameNS(Constants.XSD_NS, "import");
        if (nodeList.getLength() == 0) {
            return element; // simply returns the original one
        }

        // do a clone since we are going to remove the import stuffs from the
        // element
        Element elementClone = (Element) element.cloneNode(true);
        nodeList = elementClone.getElementsByTagNameNS(Constants.XSD_NS, "import");
        List<Node> ns = new ArrayList<Node>();
        for (int tmp = 0; tmp < nodeList.getLength(); tmp++) {
            Node importNode = nodeList.item(tmp);
            ns.add(importNode);
        }
        for (Node item : ns) {
            Node schemaNode = item.getParentNode();
            schemaNode.removeChild(item);
        }
        return elementClone;
    }

    static class JAXBCompilerErrorListener implements ErrorListener {

        private boolean hasError;

        private final List<SAXParseException> saxParseExceptions = new ArrayList<SAXParseException>();

        public boolean hasError() {
            return this.hasError;
        }

        public GenerationException getException() {
            if (this.saxParseExceptions == null || this.saxParseExceptions.isEmpty()) {
                return null;
            } else if (this.saxParseExceptions.size() == 1) {
                return new GenerationException(getErrorMessage(this.saxParseExceptions.get(0)), this.saxParseExceptions.get(0));
            } else {
                StringBuilder sb = new StringBuilder();
                for (SAXParseException saxEx : this.saxParseExceptions) {
                    sb.append(getErrorMessage(saxEx));
                    sb.append('\n');
                }
                return new GenerationException(sb.toString());
            }
        }

        public void resetError() {
            this.hasError = false;
            this.saxParseExceptions.clear();
        }

        @Override
        public void error(SAXParseException exception) {
            this.hasError = true;
            this.saxParseExceptions.add(exception);
            log.warn(getErrorMessage(exception), exception);
        }

        @Override
        public void fatalError(SAXParseException exception) {
            error(exception);
        }

        @Override
        public void info(SAXParseException exception) {
            log.info(getErrorMessage(exception), exception);
        }

        @Override
        public void warning(SAXParseException exception) {
            info(exception);
        }

        private String getErrorMessage(SAXParseException exception) {
            return exception.getLocalizedMessage();
        }
    }
}

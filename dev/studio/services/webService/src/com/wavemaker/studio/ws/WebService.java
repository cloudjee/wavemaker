/*
 * Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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
 
package com.wavemaker.studio.ws;

import java.io.IOException;
import java.util.List;

import javax.xml.bind.JAXBException;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;

import org.apache.xmlbeans.XmlException;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;

import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.runtime.server.DownloadResponse;
import com.wavemaker.runtime.server.ParamName;
import com.wavemaker.runtime.ws.BindingProperties;
import com.wavemaker.runtime.ws.WebServiceException;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.ws.RESTInputParam;
import com.wavemaker.tools.ws.RESTWsdlSettings;
import com.wavemaker.tools.ws.WebServiceToolsManager;
import com.wavemaker.tools.ws.wsdl.WSDLException;

/**
 * Service to provide interfaces to do Web Service toolings.
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class WebService {

    private WebServiceToolsManager wsToolsMgr;

    private ProjectManager projectManager;

    private DesignServiceManager designServiceManager;

    public ProjectManager getProjectManager() {
        return projectManager;
    }

    public void setProjectManager(ProjectManager projectMgr)
            throws WSDLException {
        this.projectManager = projectMgr;
    }

    public DesignServiceManager getDesignServiceManager() {
        return designServiceManager;
    }

    public void setDesignServiceManager(DesignServiceManager designServiceMgr) {
        this.designServiceManager = designServiceMgr;
    }

    private WebServiceToolsManager getWSToolsMgr() {
        if (wsToolsMgr == null) {
            if (projectManager == null) {
                SpringUtils.throwSpringNotInitializedError(ProjectManager.class);
            }
            if (designServiceManager == null) {
                SpringUtils.throwSpringNotInitializedError(DesignServiceManager.class);
            }
            wsToolsMgr = new WebServiceToolsManager(projectManager,
                    designServiceManager);
        }
        return wsToolsMgr;
    }

    /*public String importWSDL(String path, String serviceId, boolean overwrite)
            throws WSDLException, IOException, JAXBException {
        //if (path.toLowerCase().endsWith("wadl")) {
        //    return getWSToolsMgr().importWADL(path, serviceId, overwrite);
        //}
        return importWSDL(path, serviceId, overwrite, null, null);
    }*/

    public String importWSDL(String path, String serviceId, boolean overwrite, String username, String password)
            throws WSDLException, IOException, JAXBException, ParserConfigurationException, SAXException, TransformerException { //salesforce
        if (path.toLowerCase().endsWith("wadl")) {
            return getWSToolsMgr().importWADL(path, serviceId, overwrite);
        }
        return getWSToolsMgr().importWSDL(path, serviceId, overwrite, username, password);
    }

    /*public String uploadWSDL(@ParamName(name = "file")
            MultipartFile file, String serviceId, String overwrite)
            throws IOException, WSDLException, JAXBException {
        return uploadWSDL(file, serviceId, overwrite, null, null);
    }*/

    public String uploadWSDL(@ParamName(name = "file")
            MultipartFile file, String serviceId, String overwrite, String username, String password) //salesforce
            throws IOException, WSDLException, JAXBException {
        return getWSToolsMgr().importUploadedFile(file, serviceId, overwrite, username, password);
    }

    public String buildRestService(String serviceName, String operationName,
            List<RESTInputParam> inputs, String parameterizedUrl,
            String method, String contentType, String outputType,
            String xmlSchema, String xmlSchemaPath, boolean overwrite)
            throws WSDLException, IOException, javax.wsdl.WSDLException,
            SAXException, ParserConfigurationException, JAXBException,
            TransformerException {
        return getWSToolsMgr().buildRestService(serviceName, operationName,
                inputs, parameterizedUrl, method, contentType, outputType,
                xmlSchema, xmlSchemaPath, overwrite);
    }

    public List<String> getSchemaElementTypes(String xmlSchemaPath,
            String xmlSchemaText) throws IOException,
            ParserConfigurationException, SAXException {
        return getWSToolsMgr().getSchemaElementTypes(xmlSchemaPath,
                xmlSchemaText);
    }

    public String convertXmlToSchema(String xml) throws IOException, XmlException {
        return getWSToolsMgr().convertXmlToSchema(xml);
    }

    public List<String> invokeRestCall(String endpointAddress) {
        return getWSToolsMgr().invokeRestCall(endpointAddress);
    }

    public RESTWsdlSettings generateRESTWsdlSettings(String endpointAddress)
            throws WebServiceException, IOException, XmlException {
        return getWSToolsMgr().generateRESTWsdlSettings(endpointAddress);
    }

    public String registerFeedService() throws JAXBException, IOException {
        return getWSToolsMgr().registerFeedService();
    }

    public String getWSDL(String serviceId) throws IOException {
        return getWSToolsMgr().getWSDL(serviceId);
    }

    public DownloadResponse downloadWSDL(@ParamName(name = "serviceId")
            String serviceId) throws IOException {
        return getWSToolsMgr().downloadWSDL(serviceId);
    }

    public BindingProperties getBindingProperties(String serviceId)
            throws JAXBException, IOException {
        return getWSToolsMgr().getBindingProperties(serviceId);
    }

    public void setBindingProperties(String serviceId,
            BindingProperties bindingProperties) throws JAXBException,
            IOException {
        getWSToolsMgr().setBindingProperties(serviceId, bindingProperties);
    }
}

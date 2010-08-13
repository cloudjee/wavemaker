/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
package com.wavemaker.tools.cloudmgr.opsource.listimages.proc;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;
import java.io.InputStream;
import java.io.IOException;

import javax.xml.namespace.QName;
import javax.xml.ws.Service;
import javax.xml.ws.Dispatch;
import javax.xml.ws.BindingProvider;
import javax.xml.ws.handler.MessageContext;
import javax.xml.ws.http.HTTPBinding;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.activation.DataSource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.cloudmgr.opsource.listimages.response.ServerImages;

/**
 * This class is to manage opSource cloud server instances.
 *
 * @author slee
 */
public class ListImagesProc {

    public ServerImages listImages(String orgId, String userName, String passWord) {

        String endPointAddress = "https://api.opsourcecloud.net/oec/0.9/" + orgId + "/image/web";
        QName thisQName = new QName(endPointAddress, "opsourcecloud");
        Service s = Service.create(thisQName);
        ServerImages images = null;

        try {
            URI address = new URI(endPointAddress);

            s.addPort(thisQName, HTTPBinding.HTTP_BINDING, address.toString());

            Dispatch<DataSource> d = s.createDispatch(thisQName, DataSource.class, Service.Mode.MESSAGE);
            Map<String, Object> requestContext = d.getRequestContext();
            requestContext.put(MessageContext.HTTP_REQUEST_METHOD, "GET");

            requestContext.put(BindingProvider.USERNAME_PROPERTY, userName);
            requestContext.put(BindingProvider.PASSWORD_PROPERTY, passWord);

            DataSource response = d.invoke(null);

            InputStream inputStream = response.getInputStream();

            JAXBContext context = JAXBContext.newInstance(ServerImages.class);
            Unmarshaller unmarshaller = context.createUnmarshaller();
            Object object = unmarshaller.unmarshal(inputStream);
            images =  ServerImages.class.cast(object);

        } catch (URISyntaxException ex1) {
            throw new WMRuntimeException(ex1);
        } catch (JAXBException ex2) {
            throw new WMRuntimeException(ex2);
        } catch (IOException ex3) {
            throw new WMRuntimeException(ex3);    
        }

        return images;
    }
}

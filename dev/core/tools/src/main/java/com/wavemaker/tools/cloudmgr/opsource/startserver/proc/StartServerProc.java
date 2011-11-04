/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.cloudmgr.opsource.startserver.proc;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;

import javax.activation.DataSource;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.namespace.QName;
import javax.xml.ws.BindingProvider;
import javax.xml.ws.Dispatch;
import javax.xml.ws.Service;
import javax.xml.ws.handler.MessageContext;
import javax.xml.ws.http.HTTPBinding;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.cloudmgr.opsource.startserver.response.Status;

/**
 * This class is to manage opSource cloud server instances.
 * 
 * @author Seung Lee
 */
public class StartServerProc {

    public Status startServer(String serverId, String orgId, String userName, String passWord) {

        String endPointAddress = "https://api.opsourcecloud.net/oec/0.9/" + orgId + "/server/" + serverId + "?start";
        QName thisQName = new QName(endPointAddress, "opsourcecloud");
        Service s = Service.create(thisQName);
        Status status = null;

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

            JAXBContext context = JAXBContext.newInstance(Status.class);
            Unmarshaller unmarshaller = context.createUnmarshaller();
            Object object = unmarshaller.unmarshal(inputStream);
            status = Status.class.cast(object);

        } catch (URISyntaxException ex1) {
            throw new WMRuntimeException(ex1);
        } catch (JAXBException ex2) {
            throw new WMRuntimeException(ex2);
        } catch (IOException ex3) {
            throw new WMRuntimeException(ex3);
        }

        return status;
    }
}

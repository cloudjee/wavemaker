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

package com.wavemaker.tools.cloudmgr.opsource.deployserver.proc;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
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
import com.wavemaker.runtime.ws.HTTPBindingSupport;
import com.wavemaker.runtime.ws.WebServiceException;
import com.wavemaker.tools.cloudmgr.opsource.ProcStatus;
import com.wavemaker.tools.cloudmgr.opsource.deployserver.request.Server;
import com.wavemaker.tools.cloudmgr.opsource.deployserver.response.Status;
import com.wavemaker.tools.cloudmgr.opsource.listservers.proc.ListServersProc;
import com.wavemaker.tools.cloudmgr.opsource.listservers.response.Servers;
import com.wavemaker.tools.cloudmgr.opsource.startserver.proc.StartServerProc;

/**
 * This class is to manage opSource cloud server instances.
 * 
 * @author slee
 */
public class DeployServerProc {

    public ProcStatus deployServer(String orgId, String name, String desc, String networkId, String image, String adminPasswd, String userName,
        String passWord) {

        String endPointAddress = "https://api.opsourcecloud.net/oec/0.9/" + orgId + "/server";
        QName thisQName = new QName(endPointAddress, "opsourcecloud");
        Service s = Service.create(thisQName);
        Server svrReq = new Server();
        String vlanResourcePath = "/oec/" + orgId + "/network/" + networkId;
        image = "/oec/opsource/image/" + image;
        Status status;
        com.wavemaker.tools.cloudmgr.opsource.startserver.response.Status status1;

        try {
            URI address = new URI(endPointAddress);

            s.addPort(thisQName, HTTPBinding.HTTP_BINDING, address.toString());

            Dispatch<DataSource> d = s.createDispatch(thisQName, DataSource.class, Service.Mode.MESSAGE);
            Map<String, Object> requestContext = d.getRequestContext();
            requestContext.put(MessageContext.HTTP_REQUEST_METHOD, "POST");

            requestContext.put(BindingProvider.USERNAME_PROPERTY, userName);
            requestContext.put(BindingProvider.PASSWORD_PROPERTY, passWord);

            svrReq.setName(name);
            svrReq.setDescription(desc);
            svrReq.setVlanResourcePath(vlanResourcePath);
            svrReq.setImageResourcePath(image);
            svrReq.setAdministratorPassword(adminPasswd);
            String msg = HTTPBindingSupport.convertToXMLString(svrReq);

            DataSource postSource = HTTPBindingSupport.createDataSource("application/xml", msg);

            DataSource response = d.invoke(postSource);

            InputStream inputStream = response.getInputStream();

            JAXBContext respContext = JAXBContext.newInstance(Status.class);
            Unmarshaller unmarshaller = respContext.createUnmarshaller();

            Object object = unmarshaller.unmarshal(inputStream);
            status = Status.class.cast(object);

            String resultCode = status.getResultCode();
            if (!resultCode.equals("REASON_0") && !resultCode.equals("REASON_40")) {
                throw new WMRuntimeException(status.getResultDetail());
            }

            boolean serverCreated = false;
            int n = 0;
            StartServerProc startServerProc = new StartServerProc(); // xxx
            ListServersProc listServersProc = new ListServersProc(); // xxx
            String serverId = null;

            while (!serverCreated && n < 600) {
                Servers svrs = listServersProc.listServers(orgId, userName, passWord);
                List<Servers.Server> servers = svrs.getServer();
                for (Servers.Server server : servers) {
                    String serverName = server.getName();
                    if (name.equals(serverName)) {
                        serverCreated = true;
                        serverId = server.getId();
                        break;
                    } else {
                        Thread.sleep(2000);
                        n++;
                    }
                }
            }

            if (!serverCreated) {
                throw new WMRuntimeException("Timed out - Failure creating a new OpSource server instance");
            }

            // Somehow, if we try to start the server right away, it fails to start the server.
            // It cannot even be deleted after the problem. So, let's wait for 5 seconds before we try to start the
            // server.
            Thread.sleep(5000);

            status1 = startServerProc.startServer(serverId, orgId, userName, passWord);
            resultCode = status1.getResultCode();
            if (!resultCode.equals("REASON_0")) {
                throw new WMRuntimeException(status1.getResultDetail());
            }

        } catch (URISyntaxException ex) {
            throw new WMRuntimeException(ex);
        } catch (JAXBException ex) {
            throw new WMRuntimeException(ex);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        } catch (WebServiceException ex) {
            throw new WMRuntimeException(ex);
        } catch (InterruptedException ie) {
            throw new WMRuntimeException(ie);
        }

        return status1;
    }
}

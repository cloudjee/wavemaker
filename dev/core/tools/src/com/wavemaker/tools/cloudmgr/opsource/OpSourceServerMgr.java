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
package com.wavemaker.tools.cloudmgr.opsource;

import java.util.Collection;
import java.util.List;
import java.util.ArrayList;

import com.wavemaker.tools.cloudmgr.*;
import com.wavemaker.tools.cloudmgr.opsource.deployserver.proc.DeployServerProc;
import com.wavemaker.tools.cloudmgr.opsource.deleteserver.proc.DeleteServerProc;
import com.wavemaker.tools.cloudmgr.opsource.deleteserver.response.Status;
import com.wavemaker.tools.cloudmgr.opsource.listservers.proc.ListServersProc;
import com.wavemaker.tools.cloudmgr.opsource.listservers.response.Servers;
import com.wavemaker.tools.cloudmgr.opsource.listimages.proc.ListImagesProc;
import com.wavemaker.tools.cloudmgr.opsource.listimages.response.ServerImages;
import com.wavemaker.tools.cloudmgr.opsource.listnetworks.proc.ListNetworksProc;
import com.wavemaker.tools.cloudmgr.opsource.listnetworks.response.Networks;
import com.wavemaker.tools.cloudmgr.opsource.myaccount.proc.MyAccountProc;
import com.wavemaker.tools.cloudmgr.opsource.myaccount.response.Account;
import com.wavemaker.common.WMRuntimeException;

/**
 * This class is to manage OpSource cloud server instances.
 *
 * @author slee
 */
public class OpSourceServerMgr implements CloudServerMgr {

    private DeployServerProc deployServerProc = new DeployServerProc();
    private DeleteServerProc deleteServerProc = new DeleteServerProc();
    private ListServersProc listServersProc = new ListServersProc();
    private ListImagesProc listImagesProc = new ListImagesProc();
    private ListNetworksProc listNetworksProc = new ListNetworksProc();
    private String userName = null;
    private String passWord = null;

    private String orgId = null;

    public Collection<CloudServer> createServer(String serverName,
                                                String desc,
                                                String image,
                                                String flavorId,
                                                String network,
                                                String adminPass,
                                                String keyPair,
                                                String vmType,
                                                List<String> securityGroup,
                                                CloudAuth auth) {

        if (!loggedIn(auth)) {
            String un = auth.getUsername();
            String pw = auth.getPassword();
            MyAccountProc proc = new MyAccountProc();
            Account acct = proc.getMyAccount(un, pw);
            orgId = acct.getOrgId();
            userName = un;
            passWord = pw;
        }

        ProcStatus status = deployServerProc.deployServer(orgId, serverName, desc, network, image, adminPass,
                userName, passWord);

        if (!status.getResultCode().equals("REASON_0")) {
            throw new WMRuntimeException(status.getResultDetail());
        }

        return getServerList(null, auth);
    }

    public Collection<CloudServer> deleteServer(String serverId,
                                                CloudAuth auth) {
        if (!loggedIn(auth)) {
            String un = auth.getUsername();
            String pw = auth.getPassword();
            MyAccountProc proc = new MyAccountProc();
            Account acct = proc.getMyAccount(un, pw);
            orgId = acct.getOrgId();
            userName = un;
            passWord = pw;
        }

        Status status = deleteServerProc.deleteServer(orgId, serverId, userName, passWord);

        if (!status.getResultCode().equals("REASON_0")) {
            throw new WMRuntimeException(status.getResultDetail());
        }

        return getServerList(null, auth);
    }

    public Collection<CloudServer> getServerList(String image,
                                                CloudAuth auth) {
        if (!loggedIn(auth)) {
            String un = auth.getUsername();
            String pw = auth.getPassword();
            MyAccountProc proc = new MyAccountProc();
            Account acct = proc.getMyAccount(un, pw);
            orgId = acct.getOrgId();
            userName = un;
            passWord = pw;
        }

        Servers svrs = listServersProc.listServers(orgId, userName, passWord);

        List<Servers.Server> servers = svrs.getServer();
        Collection<CloudServer> rtn = new ArrayList<CloudServer>();
        for (Servers.Server server : servers) {
            CloudServer cloudServer = new CloudServer(server.getName(),
                                                    server.getDescription(),
                                                    server.getId(),
                                                    server.getImageResourcePath(),
                                                    null,
                                                    server.getVlanResourcePath(),
                                                    null,
                                                    null,
                                                    server.getPrivateIPAddress(),
                                                    server.getCreated());
            rtn.add(cloudServer);
        }

        return rtn;
    }

    public Collection<CloudImage> getImageList(CloudAuth auth) {
        if (!loggedIn(auth)) {
            String un = auth.getUsername();
            String pw = auth.getPassword();
            MyAccountProc proc = new MyAccountProc();
            Account acct = proc.getMyAccount(un, pw);
            orgId = acct.getOrgId();
            userName = un;
            passWord = pw;
        }

        ServerImages imgs = listImagesProc.listImages(orgId, userName, passWord);

        List<ServerImages.ServerImage> images = imgs.getServerImage();
        Collection<CloudImage> rtn = new ArrayList<CloudImage>();
        for (ServerImages.ServerImage image : images) {
            List<ServerImages.ServerImage.OperatingSystem> osl = image.getOperatingSystem();
            String osName = "";
            if (osl != null && osl.size() > 0) {
                osName = osl.get(0).getDisplayName();
            }
            CloudImage cloudImage = new CloudImage(image.getId(),
                                                    image.getName(),
                                                    image.getDescription(),
                                                    image.getCpuCount(),
                                                    image.getMemory(),
                                                    image.getOsStorage(),
                                                    null,
                                                    osName,
                                                    image.getCreated());
            rtn.add(cloudImage);
        }

        return rtn;
    }

    public Collection<CloudNetwork> getNetworkList(CloudAuth auth) {
        if (!loggedIn(auth)) {
            String un = auth.getUsername();
            String pw = auth.getPassword();
            MyAccountProc proc = new MyAccountProc();
            Account acct = proc.getMyAccount(un, pw);
            orgId = acct.getOrgId();
            userName = un;
            passWord = pw;
        }

        Networks nets = listNetworksProc.listNetworks(orgId, userName, passWord);

        List<Networks.Network> networks = nets.getNetwork();
        Collection<CloudNetwork> rtn = new ArrayList<CloudNetwork>();
        for (Networks.Network network : networks) {
            CloudNetwork cloudNetwork = new CloudNetwork(network.getId(),
                                                    network.getName(),
                                                    network.getDescription());
            rtn.add(cloudNetwork);
        }

        return rtn;
    }

    private boolean loggedIn(CloudAuth auth) {
        String un = auth.getUsername();
        String pw = auth.getPassword();
        if (orgId != null && userName != null && passWord != null && userName.equals(un) && passWord.equals(pw))
            return true;
        else
            return false;
    }

    public Collection<CloudFlavor> getFlavorList(CloudAuth authObj) {return null;}

    public Collection<CloudSecurityGroup> getSecurityGroupList(CloudAuth authObj) {return null;}

    public Collection<CloudKeyPair> getKeyPairList(CloudAuth authObj) {return null;}
}


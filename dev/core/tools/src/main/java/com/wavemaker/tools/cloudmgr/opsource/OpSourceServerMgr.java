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

package com.wavemaker.tools.cloudmgr.opsource;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.cloudmgr.CloudAuth;
import com.wavemaker.tools.cloudmgr.CloudFlavor;
import com.wavemaker.tools.cloudmgr.CloudImage;
import com.wavemaker.tools.cloudmgr.CloudKeyPair;
import com.wavemaker.tools.cloudmgr.CloudNetwork;
import com.wavemaker.tools.cloudmgr.CloudSecurityGroup;
import com.wavemaker.tools.cloudmgr.CloudServer;
import com.wavemaker.tools.cloudmgr.CloudServerMgr;
import com.wavemaker.tools.cloudmgr.opsource.deleteserver.proc.DeleteServerProc;
import com.wavemaker.tools.cloudmgr.opsource.deleteserver.response.Status;
import com.wavemaker.tools.cloudmgr.opsource.deployserver.proc.DeployServerProc;
import com.wavemaker.tools.cloudmgr.opsource.listimages.proc.ListImagesProc;
import com.wavemaker.tools.cloudmgr.opsource.listimages.response.ServerImages;
import com.wavemaker.tools.cloudmgr.opsource.listnetworks.proc.ListNetworksProc;
import com.wavemaker.tools.cloudmgr.opsource.listnetworks.response.Networks;
import com.wavemaker.tools.cloudmgr.opsource.listservers.proc.ListServersProc;
import com.wavemaker.tools.cloudmgr.opsource.listservers.response.Servers;
import com.wavemaker.tools.cloudmgr.opsource.myaccount.proc.MyAccountProc;
import com.wavemaker.tools.cloudmgr.opsource.myaccount.response.Account;

/**
 * This class is to manage OpSource cloud server instances.
 * 
 * @author Seung Lee
 */
public class OpSourceServerMgr implements CloudServerMgr {

    private final DeployServerProc deployServerProc = new DeployServerProc();

    private final DeleteServerProc deleteServerProc = new DeleteServerProc();

    private final ListServersProc listServersProc = new ListServersProc();

    private final ListImagesProc listImagesProc = new ListImagesProc();

    private final ListNetworksProc listNetworksProc = new ListNetworksProc();

    private String userName = null;

    private String passWord = null;

    private String orgId = null;

    @Override
    public Collection<CloudServer> createServer(String serverName, String desc, String image, String flavorId, String network, String adminPass,
        String keyPair, String vmType, List<String> securityGroup, CloudAuth auth) {

        if (!loggedIn(auth)) {
            String un = auth.getUsername();
            String pw = auth.getPassword();
            MyAccountProc proc = new MyAccountProc();
            Account acct = proc.getMyAccount(un, pw);
            this.orgId = acct.getOrgId();
            this.userName = un;
            this.passWord = pw;
        }

        ProcStatus status = this.deployServerProc.deployServer(this.orgId, serverName, desc, network, image, adminPass, this.userName, this.passWord);

        if (!status.getResultCode().equals("REASON_0")) {
            throw new WMRuntimeException(status.getResultDetail());
        }

        return getServerList(null, auth);
    }

    @Override
    public Collection<CloudServer> deleteServer(String serverId, CloudAuth auth) {
        if (!loggedIn(auth)) {
            String un = auth.getUsername();
            String pw = auth.getPassword();
            MyAccountProc proc = new MyAccountProc();
            Account acct = proc.getMyAccount(un, pw);
            this.orgId = acct.getOrgId();
            this.userName = un;
            this.passWord = pw;
        }

        Status status = this.deleteServerProc.deleteServer(this.orgId, serverId, this.userName, this.passWord);

        if (!status.getResultCode().equals("REASON_0")) {
            throw new WMRuntimeException(status.getResultDetail());
        }

        return getServerList(null, auth);
    }

    @Override
    public Collection<CloudServer> getServerList(String image, CloudAuth auth) {
        if (!loggedIn(auth)) {
            String un = auth.getUsername();
            String pw = auth.getPassword();
            MyAccountProc proc = new MyAccountProc();
            Account acct = proc.getMyAccount(un, pw);
            this.orgId = acct.getOrgId();
            this.userName = un;
            this.passWord = pw;
        }

        Servers svrs = this.listServersProc.listServers(this.orgId, this.userName, this.passWord);

        List<Servers.Server> servers = svrs.getServer();
        Collection<CloudServer> rtn = new ArrayList<CloudServer>();
        for (Servers.Server server : servers) {
            CloudServer cloudServer = new CloudServer(server.getName(), server.getDescription(), server.getId(), server.getImageResourcePath(), null,
                server.getVlanResourcePath(), null, null, server.getPrivateIPAddress(), server.getCreated());
            rtn.add(cloudServer);
        }

        return rtn;
    }

    @Override
    public Collection<CloudImage> getImageList(CloudAuth auth) {
        if (!loggedIn(auth)) {
            String un = auth.getUsername();
            String pw = auth.getPassword();
            MyAccountProc proc = new MyAccountProc();
            Account acct = proc.getMyAccount(un, pw);
            this.orgId = acct.getOrgId();
            this.userName = un;
            this.passWord = pw;
        }

        ServerImages imgs = this.listImagesProc.listImages(this.orgId, this.userName, this.passWord);

        List<ServerImages.ServerImage> images = imgs.getServerImage();
        Collection<CloudImage> rtn = new ArrayList<CloudImage>();
        for (ServerImages.ServerImage image : images) {
            List<ServerImages.ServerImage.OperatingSystem> osl = image.getOperatingSystem();
            String osName = "";
            if (osl != null && osl.size() > 0) {
                osName = osl.get(0).getDisplayName();
            }
            CloudImage cloudImage = new CloudImage(image.getId(), image.getName(), image.getDescription(), image.getCpuCount(), image.getMemory(),
                image.getOsStorage(), null, osName, image.getCreated());
            rtn.add(cloudImage);
        }

        return rtn;
    }

    @Override
    public Collection<CloudNetwork> getNetworkList(CloudAuth auth) {
        if (!loggedIn(auth)) {
            String un = auth.getUsername();
            String pw = auth.getPassword();
            MyAccountProc proc = new MyAccountProc();
            Account acct = proc.getMyAccount(un, pw);
            this.orgId = acct.getOrgId();
            this.userName = un;
            this.passWord = pw;
        }

        Networks nets = this.listNetworksProc.listNetworks(this.orgId, this.userName, this.passWord);

        List<Networks.Network> networks = nets.getNetwork();
        Collection<CloudNetwork> rtn = new ArrayList<CloudNetwork>();
        for (Networks.Network network : networks) {
            CloudNetwork cloudNetwork = new CloudNetwork(network.getId(), network.getName(), network.getDescription());
            rtn.add(cloudNetwork);
        }

        return rtn;
    }

    private boolean loggedIn(CloudAuth auth) {
        String un = auth.getUsername();
        String pw = auth.getPassword();
        if (this.orgId != null && this.userName != null && this.passWord != null && this.userName.equals(un) && this.passWord.equals(pw)) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public Collection<CloudFlavor> getFlavorList(CloudAuth authObj) {
        return null;
    }

    @Override
    public Collection<CloudSecurityGroup> getSecurityGroupList(CloudAuth authObj) {
        return null;
    }

    @Override
    public Collection<CloudKeyPair> getKeyPairList(CloudAuth authObj) {
        return null;
    }
}

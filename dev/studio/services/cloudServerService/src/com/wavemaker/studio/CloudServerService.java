/*
 * Copyright (C) 2007-2010 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 
package com.wavemaker.studio;

import java.util.Collection;
import java.util.List;

import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.cloudmgr.*;
import com.wavemaker.tools.deployment.ServiceDeploymentManager;
import com.wavemaker.common.util.Tuple;

/**
 * @author slee
 *
 */
public class CloudServerService {

    private CloudServerMgrBeans cloudServerMgrBeans;

    public Collection<CloudServer> createServer(String serviceProvider,
                            String name,
                            String desc,
                            String image,
                            String flavorId,
                            String network,
                            String adminPassword,
                            String keyPair,
                            String vmType,
                            List<String> securityGroup,
                            String username,
                            String password,
                            String accessKeyId,
                            String seceretAccessKey,
                            String signatureVersion,
                            String serviceURL) {
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey,
                signatureVersion, serviceURL);
        return cloudServerMgrBeans.getCloudServerMgr(serviceProvider).
                createServer(name, desc, image, flavorId, network, adminPassword, keyPair, vmType, securityGroup, auth);
    }

    public Collection<CloudServer> deleteServer(String serviceProvider,
                            String serverId,
                            String username,
                            String password,
                            String accessKeyId,
                            String seceretAccessKey,
                            String signatureVersion,
                            String serviceURL) {
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey,
                signatureVersion, serviceURL);
        return cloudServerMgrBeans.getCloudServerMgr(serviceProvider).deleteServer(serverId, auth);
    }

    public Collection<CloudServer> getServerList(String serviceProvider,
                            String image,
                            String username,
                            String password,
                            String accessKeyId,
                            String seceretAccessKey,
                            String signatureVersion,
                            String serviceURL) {
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey,
                signatureVersion, serviceURL);
        return cloudServerMgrBeans.getCloudServerMgr(serviceProvider).getServerList(image, auth);
    }

    public Collection<CloudImage> getImageList(String serviceProvider,
                            String username,
                            String password,
                            String accessKeyId,
                            String seceretAccessKey,
                            String signatureVersion,
                            String serviceURL) {
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey,
                signatureVersion, serviceURL);
        return cloudServerMgrBeans.getCloudServerMgr(serviceProvider).getImageList(auth);
    }

    public Collection<CloudFlavor> getFlavorList(String serviceProvider,
                            String username,
                            String password,
                            String accessKeyId,
                            String seceretAccessKey) {
        if (!serviceProvider.equals("rackspace")) return null;
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey);
        return cloudServerMgrBeans.getCloudServerMgr(serviceProvider).getFlavorList(auth);
    }

    public Collection<CloudNetwork> getNetworkList(String serviceProvider,
                            String username,
                            String password,
                            String accessKeyId,
                            String seceretAccessKey) {
        if (!serviceProvider.equals("opsource")) return null;
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey);
        return cloudServerMgrBeans.getCloudServerMgr(serviceProvider).getNetworkList(auth);
    }

    public Collection<CloudKeyPair> getKeyPairList(String serviceProvider,
                            String username,
                            String password,
                            String accessKeyId,
                            String seceretAccessKey,
                            String signatureVersion,
                            String serviceURL) {
        if (!serviceProvider.equals("amazon") && !serviceProvider.equals("eucalyptus")) return null;
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey,
                signatureVersion, serviceURL);
        return cloudServerMgrBeans.getCloudServerMgr(serviceProvider).getKeyPairList(auth);
    }

    public Collection<CloudSecurityGroup> getSecurityGroupList(String serviceProvider,
                            String username,
                            String password,
                            String accessKeyId,
                            String seceretAccessKey,
                            String signatureVersion,
                            String serviceURL) {
        if (!serviceProvider.equals("amazon") && !serviceProvider.equals("eucalyptus")) return null;
        CloudAuth auth = new CloudAuth(username, password, accessKeyId, seceretAccessKey,
                signatureVersion, serviceURL);
        return cloudServerMgrBeans.getCloudServerMgr(serviceProvider).getSecurityGroupList(auth);
    }

    public Tuple.Four<Collection<CloudImage>, Collection<CloudFlavor>, Collection<CloudNetwork>, Collection<CloudSecurityGroup>>
            getServerBaseInfo(String serviceProvider,
                            String username,
                            String password,
                            String accessKeyId,
                            String seceretAccessKey,
                            String signatureVersion,
                            String serviceURL) {
        Collection<CloudImage> images = getImageList(serviceProvider, username, password, accessKeyId,
                seceretAccessKey, signatureVersion, serviceURL);
        Collection<CloudFlavor> flavors = getFlavorList(serviceProvider, username, password, accessKeyId,
                seceretAccessKey);
        Collection<CloudNetwork> networks = getNetworkList(serviceProvider, username, password, accessKeyId,
                seceretAccessKey);

        Collection<CloudSecurityGroup> groups = getSecurityGroupList(serviceProvider, username,
                password, accessKeyId, seceretAccessKey, signatureVersion, serviceURL);

        Tuple.Four<Collection<CloudImage>, Collection<CloudFlavor>, Collection<CloudNetwork>, Collection<CloudSecurityGroup>> rtn
                = new Tuple.Four<Collection<CloudImage>, Collection<CloudFlavor>,
                    Collection<CloudNetwork>, Collection<CloudSecurityGroup>>(images, flavors, networks, groups);

        return rtn;
    }

    @HideFromClient
    public void setCloudServerMgrBeans(
            CloudServerMgrBeans cloudServerMgrBeans) {
        this.cloudServerMgrBeans = cloudServerMgrBeans;
    }
}

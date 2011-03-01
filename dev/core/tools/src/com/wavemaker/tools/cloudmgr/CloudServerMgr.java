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
package com.wavemaker.tools.cloudmgr;

import java.util.Collection;
import java.util.List;

/**
 * @author slee
 *
 */
public interface CloudServerMgr {

    /**
     * Manages cloud servers
     *
     * @param name  the server name
     * @param desc  the server description
     * @param image  the image id
     * @param network  the network id (usuallyt VPN id)
     * @param adminPassword the root user password
     * @param keyPair the SSH key pair name
     * @param vmType the VM type (m1.small, m1.large, etc...)
     * @param securityGroup the security group
     * @param auth  the authetication credential info, such as access key, user id, password etc...
     * @return Collection  the collection of server objects owned by the user.
     */
    public Collection<CloudServer> createServer(String name,
                            String desc,
                            String image,
                            String flavorId,
                            String network,
                            String adminPassword,
                            String keyPair,
                            String vmType,
                            List<String> securityGroup,
                            CloudAuth auth);

    /**
     * Deletes a cloud server
     *
     * @param serverId  the server id
     * @param auth  the authetication credential info, such as access key, user id, password etc...
     * @return Collection  the collection of server objects owned by the user.
     */
    public Collection<CloudServer> deleteServer(String serverId,
                            CloudAuth auth);

    /**
     * Get information for a specific a cloud server
     *
     * @param serverId  the server id
     * @param auth  the authetication credential info, such as access key, user id, password etc...
     * @return CloudServer  the server object.
     */
    //CloudServer getServerInfo(String serverId,
    //                          CloudAuth auth);

    /**
     * Get information of servers for a specific image.
     *
     * @param image  the image id.  if null is passed. information for all servers owned by the user are returned.
     * @param auth  the authetication credential info, such as access key, user id, password etc...
     * @return Collection  collection of server objects for specific image passed.
     */
    public Collection<CloudServer> getServerList(String image,
                              CloudAuth auth);

    /**
     * Get information of server imagaes.
     *
     * @param auth  the authetication credential info, such as access key, user id, password etc...
     * @return Collection  collection of server images.
     */
    public Collection<CloudImage> getImageList(CloudAuth auth);

    /**
     * Get information of server flavors.
     *
     * @param auth  the authetication credential info, such as access key, user id, password etc...
     * @return Collection  collection of server flavors.
     */
    public Collection<CloudFlavor> getFlavorList(CloudAuth auth);

    /**
     * Get information of server flavors.
     *
     * @param auth  the authetication credential info, such as access key, user id, password etc...
     * @return Collection  collection of server flavors.
     */
    public Collection<CloudNetwork> getNetworkList(CloudAuth auth);

    /**
     * Get information of security group (for amazon EC2)
     *
     * @param auth  the authetication credential info, such as access key, user id, password etc...
     * @return Collection  collection of security groups.
     */
    public Collection<CloudSecurityGroup> getSecurityGroupList(CloudAuth auth);

    /**
     * Get information of SSH key pair (for amazon EC2)
     *
     * @param auth  the authetication credential info, such as access key, user id, password etc...
     * @return Collection  collection of key pairs.
     */
    public Collection<CloudKeyPair> getKeyPairList(CloudAuth auth);

}

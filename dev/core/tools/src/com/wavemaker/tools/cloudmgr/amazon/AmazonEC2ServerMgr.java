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
package com.wavemaker.tools.cloudmgr.amazon;

import java.util.*;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.cloudmgr.*;
import com.amazonaws.ec2.model.*;
import com.amazonaws.ec2.AmazonEC2;
import com.amazonaws.ec2.AmazonEC2Client;
import com.amazonaws.ec2.AmazonEC2Exception;
import com.amazonaws.ec2.AmazonEC2Config;

/**
 * @author slee
 *
 */
public class AmazonEC2ServerMgr implements CloudServerMgr {

    private AmazonEC2 service = null;
    private String accessKeyId = null;
    private String secretAccessKey = null;
    private String serviceURL = null;
    private String signatureVersion = null;
    public Collection<CloudServer> getServerList(String ec2AMI, CloudAuth auth)
    {

        TreeMap<String, CloudServer> tm = new TreeMap<String, CloudServer>();
        String instId = "", ami = "", host = "", sTime = "";
        String key = "";
        int stateCode = 0;

        String awsAccessKeyId = auth.getAccessKeyId();
        String awsSecretAccessKey = auth.getSeceretAccessKey();
        String ec2SignatureVersion = auth.getEC2SignatureVersion();
        String ec2ServiceURL = auth.getEC2ServiceURL();

        try {
            if (!loggedIn(auth)) {
                AmazonEC2Config config = new AmazonEC2Config();
                config.setSignatureVersion(ec2SignatureVersion);
                config.setServiceURL(ec2ServiceURL);
                service = new AmazonEC2Client(awsAccessKeyId, awsSecretAccessKey, config);
                accessKeyId = awsAccessKeyId;
                secretAccessKey = awsSecretAccessKey;
                serviceURL = ec2ServiceURL;
                signatureVersion = ec2SignatureVersion;
            }

            DescribeInstancesRequest request = new DescribeInstancesRequest();

            DescribeInstancesResponse response = service.describeInstances(request);

            DescribeInstancesResult  describeInstancesResult = response.getDescribeInstancesResult();
            List<Reservation> reservationList = describeInstancesResult.getReservation();
            
            for (Reservation reservation : reservationList) {
                List<RunningInstance> runningInstanceList = reservation.getRunningInstance();
                for (RunningInstance runningInstance : runningInstanceList) {
                    if (runningInstance.isSetInstanceId()) {
                        instId = runningInstance.getInstanceId();
                    }
                    if (runningInstance.isSetImageId()) {
                        ami = runningInstance.getImageId();
                        if (ec2AMI != null && !ami.equals(ec2AMI)) continue;
                    }
                    if (runningInstance.isSetInstanceState()) {
                        InstanceState  instanceState = runningInstance.getInstanceState();
                        if (instanceState.isSetCode()) {
                            stateCode = instanceState.getCode();
                            if (stateCode != 16) continue;
                        }
                    }
                    if (runningInstance.isSetPublicDnsName()) {
                        host = runningInstance.getPublicDnsName();
                    }
                    if (runningInstance.isSetLaunchTime()) {
                        sTime = runningInstance.getLaunchTime();
                    }

                    key = sTime + " | " + instId;
                    CloudServer cs = new CloudServer(null, null, instId, ami, null, null, host, null, null, sTime);

                    tm.put(key, cs);
                }
            }
        } catch (AmazonEC2Exception ex) {
            throw new WMRuntimeException(ex.getMessage());
        }
        
        return new ArrayList<CloudServer>(tm.values());
    }

    public Collection<CloudServer> deleteServer(String ec2InstanceId, CloudAuth auth)
    {
        int stateCode;

        ArrayList<String> id = new ArrayList<String>();
        id.add(ec2InstanceId);

        String awsAccessKeyId = auth.getAccessKeyId();
        String awsSecretAccessKey = auth.getSeceretAccessKey();
        String ec2SignatureVersion = auth.getEC2SignatureVersion();
        String ec2ServiceURL = auth.getEC2ServiceURL();
        
        try {
            if (!loggedIn(auth)) {
                AmazonEC2Config config = new AmazonEC2Config();
                config.setSignatureVersion(ec2SignatureVersion);
                config.setServiceURL(ec2ServiceURL);
                service = new AmazonEC2Client(awsAccessKeyId, awsSecretAccessKey, config);
                accessKeyId = awsAccessKeyId;
                secretAccessKey = awsSecretAccessKey;
                serviceURL = ec2ServiceURL;
                signatureVersion = ec2SignatureVersion;
            }

            TerminateInstancesRequest request = new TerminateInstancesRequest(id);

            TerminateInstancesResponse response = service.terminateInstances(request);

            if (response.isSetTerminateInstancesResult()) {
                TerminateInstancesResult  terminateInstancesResult = response.getTerminateInstancesResult();
                List<TerminatingInstance> terminatingInstanceList = terminateInstancesResult.getTerminatingInstance();
                for (TerminatingInstance terminatingInstance : terminatingInstanceList) {
                    if (terminatingInstance.isSetShutdownState()) {
                        InstanceState  shutdownState = terminatingInstance.getShutdownState();
                        if (shutdownState.isSetCode()) {
                            stateCode = shutdownState.getCode();
                        }
                    }
                }
            } 
        } catch (AmazonEC2Exception ex) {
            throw new WMRuntimeException(ex.getMessage());
        }

        return getServerList(null, auth);
    }

    public Collection<CloudServer> createServer(String serverName,
                                               String desc,
                                               String ec2AMI,
                                               String flavorId,
                                               String network,
                                               String adminPassword,
                                               String keyPair,
                                               String vmType,
                                               List<String> securityGroup,
                                               CloudAuth auth) {

        ArrayList<String> instanceId = new ArrayList<String>();
        String instId = "";

        String awsAccessKeyId = auth.getAccessKeyId();
        String awsSecretAccessKey = auth.getSeceretAccessKey();
        String ec2SignatureVersion = auth.getEC2SignatureVersion();
        String ec2ServiceURL = auth.getEC2ServiceURL();

        // First, launch a new instance

        try {
            if (!loggedIn(auth)) {
                AmazonEC2Config config = new AmazonEC2Config();
                config.setSignatureVersion(ec2SignatureVersion);
                config.setServiceURL(ec2ServiceURL);
                service = new AmazonEC2Client(awsAccessKeyId, awsSecretAccessKey, config);
                accessKeyId = awsAccessKeyId;
                secretAccessKey = awsSecretAccessKey;
                serviceURL = ec2ServiceURL;
                signatureVersion = ec2SignatureVersion;
            }

            int minCount = 1;
            int maxCount = 1;
            //String keyName = null;
            //List<String> securityGroup = null;
            String userData = null;
            //String instanceType = null;
            Placement placement = null;
            String kernelId = null;
            String ramdiskId = null;
            List<BlockDeviceMapping> blockDeviceMapping = null;
            Boolean monitoring = null;

            RunInstancesRequest request = new RunInstancesRequest(ec2AMI,
                                                                minCount,
                                                                maxCount,
                                                                keyPair,
                                                                securityGroup,
                                                                userData,
                                                                vmType,
                                                                placement,
                                                                kernelId,
                                                                ramdiskId,
                                                                blockDeviceMapping,
                                                                monitoring);

            RunInstancesResponse response = service.runInstances(request);

            if (response.isSetRunInstancesResult()) {
                RunInstancesResult runInstancesResult = response.getRunInstancesResult();
                if (runInstancesResult.isSetReservation()) {
                    Reservation  reservation = runInstancesResult.getReservation();

                    List<RunningInstance> runningInstanceList = reservation.getRunningInstance();
                    for (RunningInstance runningInstance : runningInstanceList) {
                        if (runningInstance.isSetInstanceId()) {
                             instanceId.add(runningInstance.getInstanceId());
                        }
                    }
                }
            }

            // The instance has been created but it is not "running" state yet.

            boolean hostReturned = false;
            int n = 0;

            while (!hostReturned && n <600) {
                DescribeInstancesRequest request1 = new DescribeInstancesRequest(instanceId);
                DescribeInstancesResponse response1 = service.describeInstances(request1);

                if (response1.isSetDescribeInstancesResult()) {
                    DescribeInstancesResult  describeInstancesResult = response1.getDescribeInstancesResult();
                    List<Reservation> reservationList = describeInstancesResult.getReservation();
                    for (Reservation reservation : reservationList) {
                        if (reservation.isSetReservationId()) {
                            List<RunningInstance> runningInstanceList = reservation.getRunningInstance();
                            for (RunningInstance runningInstance : runningInstanceList) {
                                //while (!hostReturned && n < 100) {
                                if (runningInstance.isSetInstanceState()) {
                                    InstanceState  instanceState = runningInstance.getInstanceState();
                                    if (instanceState.isSetCode()) {
                                        int stateCode = instanceState.getCode();
                                        if (stateCode == 16) { //running state
                                            hostReturned = true;
                                            //hostName = runningInstance.getPublicDnsName();
                                            instId = runningInstance.getInstanceId();
                                            break;
                                        } else {
                                            Thread.sleep(2000);
                                            n++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (!hostReturned) {
                throw new AssertionError("Timed out - Please check the result later");
            }
        } catch (AmazonEC2Exception ex) {
            throw new WMRuntimeException(ex.getMessage());
        } catch (InterruptedException ie) {
            throw new WMRuntimeException(ie.getMessage());
        }

        return getServerList(null, auth);
    }

    /**
     * Get information of server imagaes.
     *
     * @param auth  the authetication credential info, such as access key, user id, password etc...
     * @return Collection  collection of server images.
     */
    public Collection<CloudImage> getImageList(CloudAuth auth) {

        String awsAccessKeyId = auth.getAccessKeyId();
        String awsSecretAccessKey = auth.getSeceretAccessKey();
        String ec2SignatureVersion = auth.getEC2SignatureVersion();
        String ec2ServiceURL = auth.getEC2ServiceURL();
        Collection<CloudImage> rtn = null;

        try {
            if (!loggedIn(auth)) {
                AmazonEC2Config config = new AmazonEC2Config();
                config.setSignatureVersion(ec2SignatureVersion);
                config.setServiceURL(ec2ServiceURL);
                service = new AmazonEC2Client(awsAccessKeyId, awsSecretAccessKey, config);
                accessKeyId = awsAccessKeyId;
                secretAccessKey = awsSecretAccessKey;
                serviceURL = ec2ServiceURL;
                signatureVersion = ec2SignatureVersion;
            }

            DescribeImagesRequest request = new DescribeImagesRequest();
            List<String> ownerList = new ArrayList<String>();
            if (!ec2ServiceURL.contains("Eucalyptus")) {
                ownerList.add("093867875159");
                request.setOwner(ownerList);
            }

            DescribeImagesResponse response = service.describeImages(request);

            if (response.isSetDescribeImagesResult()) {
                DescribeImagesResult  describeImagesResult = response.getDescribeImagesResult();
                List<Image> imageList = describeImagesResult.getImage();
                rtn = new ArrayList<CloudImage>();
                for (Image image : imageList) {
                    CloudImage cloudImage = new CloudImage();
                    if (ec2ServiceURL.contains("Eucalyptus") && !image.getImageType().equals("machine")) continue;
                    if (image.isSetImageId()) {
                        cloudImage.setId(image.getImageId());
                    }

                    if (image.isSetArchitecture()) {
                        cloudImage.setDescription(image.getVisibility());
                    }

                    if (image.isSetPlatform()) {
                        cloudImage.setOS("architecture: " + image.getArchitecture());
                    }
                    rtn.add(cloudImage);
                }
            }
        } catch (AmazonEC2Exception ex) {
            throw new WMRuntimeException(ex.getMessage());
        }

        return rtn;
    }

    public Collection<CloudSecurityGroup> getSecurityGroupList(CloudAuth auth) {
        String awsAccessKeyId = auth.getAccessKeyId();
        String awsSecretAccessKey = auth.getSeceretAccessKey();
        String ec2SignatureVersion = auth.getEC2SignatureVersion();
        String ec2ServiceURL = auth.getEC2ServiceURL();
        Collection<CloudSecurityGroup> rtn = null;

        try {
            if (!loggedIn(auth)) {
                AmazonEC2Config config = new AmazonEC2Config();
                config.setSignatureVersion(ec2SignatureVersion);
                config.setServiceURL(ec2ServiceURL);
                service = new AmazonEC2Client(awsAccessKeyId, awsSecretAccessKey, config);
                accessKeyId = awsAccessKeyId;
                secretAccessKey = awsSecretAccessKey;
                serviceURL = ec2ServiceURL;
                signatureVersion = ec2SignatureVersion;
            }

            DescribeSecurityGroupsRequest request = new DescribeSecurityGroupsRequest();

            DescribeSecurityGroupsResponse response = service.describeSecurityGroups(request);

            if (response.isSetDescribeSecurityGroupsResult()) {
                DescribeSecurityGroupsResult  describeSecurityGroupsResult = response.getDescribeSecurityGroupsResult();
                List<SecurityGroup> groupList = describeSecurityGroupsResult.getSecurityGroup();

                rtn = new ArrayList<CloudSecurityGroup>();
                for (SecurityGroup group : groupList) {
                    CloudSecurityGroup cloudSecGroup = new CloudSecurityGroup();
                    if (group.isSetOwnerId()) {
                        cloudSecGroup.setOwner(group.getOwnerId());
                    }

                    if (group.isSetGroupName()) {
                        cloudSecGroup.setName(group.getGroupName());
                    }

                    if (group.isSetGroupDescription()) {
                        cloudSecGroup.setDescription(group.getGroupDescription());
                    }
                    rtn.add(cloudSecGroup);
                }
            }
        } catch (AmazonEC2Exception ex) {
            throw new WMRuntimeException(ex.getMessage());
        }

        return rtn;
    }

    public Collection<CloudKeyPair> getKeyPairList(CloudAuth auth) {
            String awsAccessKeyId = auth.getAccessKeyId();
            String awsSecretAccessKey = auth.getSeceretAccessKey();
            String ec2SignatureVersion = auth.getEC2SignatureVersion();
            String ec2ServiceURL = auth.getEC2ServiceURL();
            Collection<CloudKeyPair> rtn = null;

            try {
                if (!loggedIn(auth)) {
                AmazonEC2Config config = new AmazonEC2Config();
                config.setSignatureVersion(ec2SignatureVersion);
                config.setServiceURL(ec2ServiceURL);
                service = new AmazonEC2Client(awsAccessKeyId, awsSecretAccessKey, config);
                accessKeyId = awsAccessKeyId;
                secretAccessKey = awsSecretAccessKey;
                serviceURL = ec2ServiceURL;
                signatureVersion = ec2SignatureVersion;
            }

                DescribeKeyPairsRequest request = new DescribeKeyPairsRequest();

                DescribeKeyPairsResponse response = service.describeKeyPairs(request);

                if (response.isSetDescribeKeyPairsResult()) {
                    DescribeKeyPairsResult  describeKeyPairsResult = response.getDescribeKeyPairsResult();
                    List<KeyPair> keyPairList = describeKeyPairsResult.getKeyPair();

                    rtn = new ArrayList<CloudKeyPair>();
                    for (KeyPair keyPair : keyPairList) {
                        CloudKeyPair cloudKeyPair = new CloudKeyPair();
                        if (keyPair.isSetKeyName()) {
                            cloudKeyPair.setKeyname(keyPair.getKeyName());
                        }

                        if (keyPair.isSetKeyFingerprint()) {
                            cloudKeyPair.setFingerprint(keyPair.getKeyFingerprint());
                        }

                        if (keyPair.isSetKeyMaterial()) {
                            cloudKeyPair.setMaterial(keyPair.getKeyMaterial());
                        }
                        rtn.add(cloudKeyPair);
                    }
                }
            } catch (AmazonEC2Exception ex) {
                throw new WMRuntimeException(ex.getMessage());
            }

            return rtn;
        }


    /**
     * Get information of server flavors.
     *
     * @param authObj  the authetication credential info, such as access key, user id, password etc...
     * @return Collection  collection of server flavors.
     */
    public Collection<CloudFlavor> getFlavorList(CloudAuth authObj) {
        return null;
    }

    /**
     * Get information of server flavors.
     *
     * @param authObj  the authetication credential info, such as access key, user id, password etc...
     * @return Collection  collection of server flavors.
     */
    public Collection<CloudNetwork> getNetworkList(CloudAuth authObj) {
        return null;
    }

    private boolean loggedIn(CloudAuth auth) {
        String awsAccessKeyId = auth.getAccessKeyId();
        String awsSecretAccessKey = auth.getSeceretAccessKey();
        String ec2SignatureVersion = auth.getEC2SignatureVersion();
        String ec2ServiceURL = auth.getEC2ServiceURL();
        if (service != null && accessKeyId != null && secretAccessKey != null && serviceURL != null &&
                signatureVersion != null && accessKeyId.equals(awsAccessKeyId) && secretAccessKey.equals(awsSecretAccessKey) &&
                signatureVersion.equals(ec2SignatureVersion) && serviceURL.equals(ec2ServiceURL))
            return true;
        else
            return false;
    }
}

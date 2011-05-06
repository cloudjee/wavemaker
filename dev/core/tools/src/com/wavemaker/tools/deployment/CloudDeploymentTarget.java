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

package com.wavemaker.tools.deployment;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.wavemaker.common.NotYetImplementedException;

/**
 * DeploymentTarget test.
 *
 * @author Simon Toens
 * @version $Rev$ - $Date$
 *
 */
public class CloudDeploymentTarget implements DeploymentTarget {


    private Map<String, String> properties = new HashMap<String, String>(3);

    public CloudDeploymentTarget() {
        properties.put("cluster-url", null);
        properties.put("federated-failover", "enabled");
        properties.put("dynamic-resource-allocation", "enabled");
    }

    public Map<String, String> getConfigurableProperties() {
        return properties;
    }

    public Map<String, String> getConfigurableProperties(String ec2AMI,
                                                         String awsAccessKeyId,
                                                         String awsSecretAccessKey) {
        return null;
    }

    public String deploy(File f, String contextRoot,
                         Map<String, String> props) {
        throw new NotYetImplementedException();
    }

    public String undeploy(String contextRoot, Map<String, String> props) {
        throw new NotYetImplementedException();
    }

    public String redeploy(String contextRoot, Map<String, String> props) {
        throw new NotYetImplementedException();
    }

    public List<AppInfo> listDeploymentNames(Map<String, String> props) {
        throw new NotYetImplementedException();
    }

    //This method is never used
    /*public Map<String, String> getConfigurableProperties1(String ec2InstanceInfo,
                                                          String awsAccessKeyId,
                                                          String awsSecretAccessKey)
    {
        return null;
    }*/

    //This method is never used
    public String getEC2InstanceInfo(String ec2AMI,      
                                     String awsAccessKeyId,
                                     String awsSecretAccessKey)
    {
        return null;
    }

    //This method is never used
    public String terminateEC2Instance(String instanceId,
                                       String ec2AMI,
                                       String awsAccessKeyId,
                                       String awsSecretAccessKey)
    {
        return null;
    }

    //This method is never used
    public String launchEC2Instance(String ec2AMI,
                                String awsAccessKeyId,
                                String awsSecretAccessKey)
    {
        return null;
    }

    //This method is never used
    public String getS3BucketInfo(String awsAccessKeyId,
                           String awsSecretAccessKey)
    {
        return null;
    }

    //This method is never used
    public String createS3Bucket(String bucket,
                          String location,
                          String awsAccessKeyId,
                          String awsSecretAccessKey)
    {
        return null;
    }  

    //This method is never used
    public String deleteS3Bucket(String bucket,
                           String awsAccessKeyId,
                           String awsSecretAccessKey)
    {
        return null;
    }

    //This method is never used
    public String copyWarFileToS3(String bucket,
                           File warFile,
                           String awsAccessKeyId,
                           String awsSecretAccessKey)
    {
        return null;
    }

    //This method is never used
    public String deleteWarFileInS3(String bucket,
                             String warFile,
                             String awsAccessKeyId,
                             String awsSecretAccessKey)
    {
        return null;
    }

}

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
package com.wavemaker.tools.deployment.tomcat;

import java.io.File;
import java.util.*;

import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.common.Resource;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.deployment.DeploymentTarget;
import com.amazonaws.ec2.model.*;
import com.amazonaws.ec2.AmazonEC2;
import com.amazonaws.ec2.AmazonEC2Client;
import com.amazonaws.ec2.AmazonEC2Exception;

/**
 * @author slee
 *
 */
public class EC2DeploymentTarget extends TomcatDeploymentTarget {

    public Map<String, String> getConfigurableProperties(String hostName) {

        Map<String, String> m = super.getConfigurableProperties();
	
        HashMap<String, String> hm = new HashMap<String, String>(m);
        hm.put(HOST_PROPERTY_NAME, hostName);
        hm.put(PORT_PROPERTY_NAME, "80");
        hm.put(MANAGER_PASSWORD_PROPERTY_NAME, "juhUFre5enu5");
        return hm;
    }
}

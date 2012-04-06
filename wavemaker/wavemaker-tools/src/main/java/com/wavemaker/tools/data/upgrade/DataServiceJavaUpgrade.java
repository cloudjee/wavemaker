/*
 *  Copyright (C) 2009-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.data.upgrade;

import java.io.IOException;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.tools.service.definitions.Service;

/**
 * 
 * Upgrade the Java service class. Currently, this touches the Spring file so the next build will regenerate the
 * service's Java class.
 * 
 * @author Matt Small
 */
public class DataServiceJavaUpgrade extends BaseDataUpgradeTask {

    @Override
    protected void upgrade(Service service) {

        try {
            IOUtils.touch(getCfgFile(service.getId()));
            Thread.sleep(1000);
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        } catch (InterruptedException e) {
            throw new WMRuntimeException(e);
        }
    }
}
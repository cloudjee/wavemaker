/*
 * Copyright (C) 2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.studio.pws;

import java.util.List;

import com.wavemaker.runtime.pws.IPwsLoginManager;
import com.wavemaker.runtime.pws.PwsLoginInfo;
import com.wavemaker.runtime.pws.PwsLoginManagerBeanFactory;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import com.wavemaker.tools.pws.IPwsRestImporter;
import com.wavemaker.tools.pws.PwsRestImporterBeanFactory;

/**
 * Partner Web Service class This class provides the list of services and operations and import web services
 * 
 * @author Seung Lee
 */
@ExposeToClient
public class PwsImportService {

    private PwsLoginManagerBeanFactory pwsLoginManagerBeanFactory;

    private PwsRestImporterBeanFactory pwsRestImporterBeanFactory;

    public String listProjects(PwsLoginInfo loginInfo) throws Exception {

        IPwsLoginManager loginMgr = this.pwsLoginManagerBeanFactory.getPwsLoginManager(loginInfo.getPartnerName());
        IPwsRestImporter importer = this.pwsRestImporterBeanFactory.getPwsRestImporter(loginInfo.getPartnerName());

        String sessionId = loginMgr.logIn(loginInfo);
        loginInfo.setSessionId(sessionId);

        return importer.listServices(loginInfo);
    }

    public String listOperations(PwsLoginInfo loginInfo, String serviceName) throws Exception {
        IPwsLoginManager loginMgr = this.pwsLoginManagerBeanFactory.getPwsLoginManager(loginInfo.getPartnerName());
        IPwsRestImporter importer = this.pwsRestImporterBeanFactory.getPwsRestImporter(loginInfo.getPartnerName());

        String sessionId = loginMgr.logIn(loginInfo);
        loginInfo.setSessionId(sessionId);

        return importer.listOperations(loginInfo, serviceName);
    }

    public String listAllOperations(PwsLoginInfo loginInfo) throws Exception {
        IPwsLoginManager loginMgr = this.pwsLoginManagerBeanFactory.getPwsLoginManager(loginInfo.getPartnerName());
        IPwsRestImporter importer = this.pwsRestImporterBeanFactory.getPwsRestImporter(loginInfo.getPartnerName());

        String sessionId = loginMgr.logIn(loginInfo);
        loginInfo.setSessionId(sessionId);

        return importer.listAllOperations(loginInfo);
    }

    public void importOperations(PwsLoginInfo loginInfo, String serviceName, List<String> operations)
            throws Exception {
        importOperations(loginInfo, serviceName, null, operations);
    }

    public void importOperations(PwsLoginInfo loginInfo, String serviceName, String serviceAlias, List<String> operations)
            throws Exception {
        IPwsLoginManager loginMgr = pwsLoginManagerBeanFactory.getPwsLoginManager(loginInfo.getPartnerName());
        IPwsRestImporter importer = pwsRestImporterBeanFactory.getPwsRestImporter(loginInfo.getPartnerName());

        String sessionId = loginMgr.logIn(loginInfo);
        loginInfo.setSessionId(sessionId);

        importer.importOperations(loginInfo, serviceName, serviceAlias, operations);
    }

    @HideFromClient
    public void setPwsLoginManagerBeanFactory(PwsLoginManagerBeanFactory pwsLoginManagerBeanFactory) {
        this.pwsLoginManagerBeanFactory = pwsLoginManagerBeanFactory;
    }

    @HideFromClient
    public void setPwsRestImporterBeanFactory(PwsRestImporterBeanFactory pwsRestImporterBeanFactory) {
        this.pwsRestImporterBeanFactory = pwsRestImporterBeanFactory;
    }
}

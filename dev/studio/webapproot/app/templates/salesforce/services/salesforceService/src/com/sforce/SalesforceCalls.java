/*
 *  Copyright (C) 2007-2010 VMWare, Inc. All rights reserved.
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

package com.sforce;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.WMAppContext;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.util.CastUtils;
import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.common.util.SystemUtils;
import com.sforce.soap.enterprise.salesforceservice.QueryResponse;
import com.sforce.soap.enterprise.salesforceservice.SObjectType;
import com.sforce.soap.enterprise.salesforceservice.SforceService;
import com.sforce.soap.enterprise.salesforceservice.Query;
import com.sforce.soap.enterprise.salesforceservice.SessionHeader;
import com.sforce.soap.enterprise.salesforceservice.QueryOptions;
import com.sforce.services.LoginService;

import java.util.*;
import java.io.InputStream;

/**
 * Helper class for Salesforce.
 * 
 * @author slee
 */
public class SalesforceCalls {

    private LoginService loginSvcBean = (LoginService) RuntimeAccess.getInstance().getSpringBean(CommonConstants.SFLOGIN_SERVICE);
    private static final String pfname = "salesforceService.properties";

    public List<Object> executeSforceQueryFromEditor(String qry, Map<String, Class<?>> types, Object... input) {
        InputStream is = ClassLoaderUtils.getResourceAsStream(pfname);
        Properties props = new Properties();
        try {
            props.load(is);
            String usernameKey = CommonConstants.SALESFORCE_SERVICE + DataServiceConstants.DB_USERNAME;
            String passwordKey = CommonConstants.SALESFORCE_SERVICE + DataServiceConstants.DB_PASS;
            String un = props.getProperty(usernameKey);
            String pw = props.getProperty(passwordKey);

            if (pw != null && SystemUtils.isEncrypted(pw)) {
                pw = SystemUtils.decrypt(pw);
            }

            String result = loginSvcBean.logIn(un, pw);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }

        return executeSforceQuery(qry, types, input);
    }

    public List<Object> executeSforceQuery (String qry, Map<String, Class<?>> types, Object... input) {
        Query parameters = new Query();
        parameters.setQueryString(qry);
        QueryOptions qo = new QueryOptions();
        //int len = input.length;
        //PagingOptions po = (PagingOptions)input[len-1];
        //Long psize = po.getMaxResults();
        //long firstrec = po.getFirstResult();
        //qo.setBatchSize(psize.intValue());

        QueryResponse response;

        try {
            SessionHeader sessionHeader = LoginService.getSessionHeader();
            SforceService service= LoginService.getSforceService();
            response = service.query(parameters, sessionHeader, qo, null, null);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }

        List<SObjectType> sobjs = response.getResult().getRecords();

        return CastUtils.cast(sobjs);
    }


}

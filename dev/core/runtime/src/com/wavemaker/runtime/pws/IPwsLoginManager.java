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

package com.wavemaker.runtime.pws;

import javax.xml.namespace.QName;
import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

/**
 * @author slee
 *
 */
public interface IPwsLoginManager {

    String logIn(String serviceName) throws Exception;
    
    String logIn(PwsLoginInfo loginInfo) throws Exception;

    String logOut(String host, String port, String sessId) throws Exception;

    String getSessionId();

    void setPartnerName(String partnerName);
}

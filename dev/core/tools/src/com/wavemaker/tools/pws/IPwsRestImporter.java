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

package com.wavemaker.tools.pws;

import com.wavemaker.runtime.pws.PwsLoginInfo;

import java.util.List;

/**
 * @author slee
 *
 */
public interface IPwsRestImporter {

    String listServices(PwsLoginInfo loginInfo) throws Exception;

    String listOperations(PwsLoginInfo loginInfo, String service) throws Exception;

    String listAllOperations(PwsLoginInfo loginInfo) throws Exception;

    void importOperations(PwsLoginInfo loginInfo, String service, List<String> selectedOperations) throws Exception;

}

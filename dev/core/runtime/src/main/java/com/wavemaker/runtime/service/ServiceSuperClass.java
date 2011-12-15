/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.service;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.server.ServiceResponse;
import com.wavemaker.json.JSONObject;

import java.util.UUID;

/**
 * @author slee
 *
 */
public class ServiceSuperClass {
    private ServiceResponse serviceResponse = null;
    
    public JSONObject getResponseFromService(String requestId) {
        if (this.serviceResponse == null) {
            this.serviceResponse = (ServiceResponse)RuntimeAccess.getInstance().getSpringBean("serviceResponse");
        }

        JSONObject result = this.serviceResponse.getResponseFromService(requestId);
        String status = (String)result.get("status");
        if (status.equals("processing")) {
            Thread originalThread = serviceResponse.getRequestThread(requestId);
            if (originalThread == null || !originalThread.isAlive() || !originalThread.isAlive()) {
                result = this.serviceResponse.getResponseFromService(requestId);
                status = (String)result.get("status");
                if (status.equals("processing")) {
                    if (originalThread == null || !originalThread.isAlive()) {
                        JSONObject resp = new JSONObject();
                        resp.put("status", "error");
                        resp.put("result", "Error: The original request thread is lost");
                        return resp;
                    } else if (!originalThread.isAlive()) {
                        JSONObject resp = new JSONObject();
                        resp.put("status", "error");
                        resp.put("result", "Error: The original request thread has been terminated");
                        return resp;
                    }
                }
            }
        }

        return result;
    }

    public String getRequestId() {
        UUID uuid = UUID.randomUUID();
        return uuid.toString();
    }
}

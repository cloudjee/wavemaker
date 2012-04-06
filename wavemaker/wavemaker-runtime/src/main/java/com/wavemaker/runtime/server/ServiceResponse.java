/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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
package com.wavemaker.runtime.server;

import com.wavemaker.common.WMUnfinishedProcException;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.json.JSONObject;
import com.wavemaker.runtime.RuntimeAccess;

import java.util.Hashtable;
import java.util.Map;
import java.lang.reflect.Method;

public class ServiceResponse {

    private static final int DEFAULT_CONNECTION_TIMEOUT = 30;
    private static final int DEFAULT_PROCESSING_CUTOFF = DEFAULT_CONNECTION_TIMEOUT - 5;
    private static final String INITIAL_REQUEST = "wm-initial-request";
    private static final String POLLING_REQUEST = "wm-polling-request";
    private static final String JSON_RESPONSE_STATUS = "wm-json-response-status";
    private final Map<String, Tuple.Two<Long, JSONObject>> serviceResponseTable = new Hashtable<String, Tuple.Two<Long, JSONObject>>();
    private final Map<String, Thread> threads = new Hashtable<String, Thread>();

    private RuntimeAccess runtimeAccess;
    private int connectionTimeout;

    public ServiceResponse() {
    }

    public Object invokeMethod(Method method, Object serviceObject, Object[] args) throws Exception {
        Object ret;
        this.threads.put(this.getRequestId(), Thread.currentThread());
        if (!isPollingRequest()) {
            ret = addResponse(System.currentTimeMillis(), method.invoke(serviceObject, args));
        } else {
            ret = getResponseFromService();
        }
        
        return ret;
    }

    public synchronized Object addResponse(long startTime, Object obj) {
        String requestId = this.getRequestId();
        if (System.currentTimeMillis() - runtimeAccess.getStartTime() > (connectionTimeout - 3) * 1000) {
            this.cleanup();
            JSONObject jsonObj = new JSONObject();
            jsonObj.put("status", "done");
            jsonObj.put("result", obj);
            Tuple.Two<Long, JSONObject> t = new Tuple.Two<Long, JSONObject>(System.currentTimeMillis(), jsonObj);
            this.serviceResponseTable.put(requestId, t);
        } else {
            this.threads.remove(requestId);
        }

        return obj;
    }

    private void cleanup() {
        for (Map.Entry<String, Thread> entry : this.threads.entrySet()) {
            String requestId = entry.getKey();
            Thread thread = entry.getValue();
            if (!thread.isAlive()) {
                Tuple.Two<Long, JSONObject> t = this.serviceResponseTable.get(requestId);
                if (t != null) {
                    long time = t.v1;
                    if (System.currentTimeMillis() - time > (connectionTimeout - 3) * 1000 * 2) {
                        this.serviceResponseTable.remove(requestId);
                        this.threads.remove(requestId);
                    }
                }
            }
        }
    }

    public synchronized void addError(Object obj) {
        JSONObject resp = new JSONObject();
        resp.put("status", "error");
        resp.put("result", obj);
        Tuple.Two<Long, JSONObject> t = new Tuple.Two<Long, JSONObject>(System.currentTimeMillis(), resp);
        this.serviceResponseTable.put(this.getRequestId(), t);
    }

    public Object getResponseFromService() {

        JSONObject result = this.getResponseBeforeTimeout();
        String status = (String)result.get("status");
        if (status.equals("processing")) {
            Thread originalThread = this.getRequestThread();
            if (originalThread == null || !originalThread.isAlive()) {
                result = this.getResponseTryOnce();
                status = (String)result.get("status");
                if (status.equals("processing")) {
                    if (originalThread == null) {
                        throw new WMRuntimeException("Error: The original request thread is lost");
                    } else {
                        throw new WMRuntimeException("Error: The original request thread has been terminated");
                    }
                }
            }
        }

        if (status.equals("error")) {
            throw new WMRuntimeException((Exception)result.get("result"));
        }

        setJsonResponseStatus((String)result.get("status"));
        return result.get("result");
    }

    private void setJsonResponseStatus(String status) {
        this.runtimeAccess.getResponse().setHeader(JSON_RESPONSE_STATUS, status);
    }

    public JSONObject getResponseBeforeTimeout() {
        int time = 0;
        JSONObject result;

        while (time < (connectionTimeout - 3)) {
            try {
                result = getResponse();
                return result;
            } catch (WMUnfinishedProcException ex1) {
                try {
                    Thread.sleep(2000);
                    time = time + 2;
                } catch (InterruptedException ex2) {
                    throw new WMRuntimeException(ex2);
                }
            }
        }

        result = new JSONObject();
        result.put("status", "processing");
        result.put("requestId", this.getRequestId());
        return result;
    }

    private JSONObject getResponseTryOnce() {
        JSONObject result;
        try {
            result = getResponse();
        } catch (WMUnfinishedProcException ex1) {
            result = new JSONObject();
            result.put("status", "processing");
            result.put("requestId", this.getRequestId());
        }
        return result;
    }

    public synchronized JSONObject getResponse() {
        String requestId = this.getRequestId();
        if (this.serviceResponseTable.containsKey(requestId)) {
            Tuple.Two<Long, JSONObject> t = this.serviceResponseTable.get(requestId);
            JSONObject rtn = t.v2;
            this.serviceResponseTable.remove(requestId);
            this.threads.remove(requestId);
            return rtn;
        } else {
            throw new WMUnfinishedProcException("still processing");
        }
    }

    public synchronized void addRequestThread(String requestId, Thread thread) {
        this.threads.put(requestId, thread);
    }

    public synchronized Thread getRequestThread() {
        return this.threads.get(this.getRequestId());
    }

    public boolean isPollingRequest() {
        return (this.runtimeAccess.getRequest().getHeader(POLLING_REQUEST) != null);
    }

    public String getRequestId() {
        String reqId;
        reqId = this.runtimeAccess.getRequest().getHeader(POLLING_REQUEST);
        if (reqId == null) {
            reqId = this.runtimeAccess.getRequest().getHeader(INITIAL_REQUEST);
        }
        if (reqId == null) {
            throw new WMRuntimeException("Service request Id is missing in the request, service = "
                    + ServerUtils.getServiceName(this.runtimeAccess.getRequest()));
        }

        return reqId;
    }

    public RuntimeAccess getRuntimeAccess() {
        return this.runtimeAccess;
    }

    public void setRuntimeAccess(RuntimeAccess runtimeAccess) {
        this.runtimeAccess = runtimeAccess;
    }

    public void setConnectionTimeout(int connectionTimeout) {
        this.connectionTimeout = connectionTimeout;
    }

    public int getConnectionTimeout() {
        return this.connectionTimeout;
    }
}

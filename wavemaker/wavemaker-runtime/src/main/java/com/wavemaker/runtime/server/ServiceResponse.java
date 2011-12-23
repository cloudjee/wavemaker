package com.wavemaker.runtime.server;

import com.wavemaker.common.WMUnfinishedProcException;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSONObject;

import java.util.Hashtable;

public class ServiceResponse {

    private final Hashtable<String, JSONObject> responses = new Hashtable<String, JSONObject>();
    private final Hashtable<String, Thread> threads = new Hashtable<String, Thread>();

    public ServiceResponse() {
    }

    public synchronized JSONObject addResponse(String requestId, Object obj) {
        JSONObject resp = new JSONObject();
        resp.put("status", "done");
        resp.put("result", obj);
        this.responses.put(requestId, resp);
        return resp;
    }

    public synchronized void addError(String requestId, Object obj) {
        JSONObject resp = new JSONObject();
        resp.put("status", "error");
        resp.put("result", obj);
        this.responses.put(requestId, resp);
    }

    public JSONObject getResponseFromService(String requestId) {
        int time = 0;
        JSONObject result;

        while (time < 27) {
            try {
                result = getResponse(requestId);
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
        result.put("requestId", requestId);
        return result;
    }

    public synchronized JSONObject getResponse(String requestId) {
        if (this.responses.containsKey(requestId)) {
            JSONObject rtn = this.responses.get(requestId);
            this.responses.remove(requestId);
            this.threads.remove(requestId);
            return rtn;
        } else {
            throw new WMUnfinishedProcException("still processing");
        }
    }

    public synchronized void addRequestThread(String requestId, Thread thread) {
        this.threads.put(requestId, thread);
    }

    public synchronized Thread getRequestThread(String requestId) {
        return this.threads.get(requestId);
    }
}

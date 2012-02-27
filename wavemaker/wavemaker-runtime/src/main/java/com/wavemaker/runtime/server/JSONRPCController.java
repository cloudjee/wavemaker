/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.JsonView;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.WMException;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSONArray;
import com.wavemaker.json.JSONObject;
import com.wavemaker.json.JSONUnmarshaller;
import com.wavemaker.json.type.reflect.ReflectTypeUtils;
import com.wavemaker.runtime.server.view.TypedView;
import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.runtime.service.TypedServiceReturn;
import com.wavemaker.runtime.service.response.ErrorResponse;

/**
 * Controller (in the MVC sense) implementing a JSON interface and view onto the AG framework.
 * 
 * @author Matt Small
 */
public class JSONRPCController extends ControllerBase {

    /** Logger for this class and subclasses */
    protected final Logger logger = Logger.getLogger(getClass());

    @Override
    protected ModelAndView executeRequest(HttpServletRequest request, HttpServletResponse response) throws IOException, WMException {

        String serviceName = ServerUtils.getServiceName(request);
        ModelAndView ret = null;
        String method = null;
        JSONArray params = null;

        String input;
        if (request.getContentLength() == 0 || request.getInputStream() == null) {
            input = "";
        } else {
            input = ServerUtils.readInput(request);
        }

        if (this.logger.isDebugEnabled()) {
            this.logger.debug("Request body: '" + input + "'");
        }

        JSONObject jsonReq = (JSONObject) JSONUnmarshaller.unmarshal(input, getInternalRuntime().getJSONState());

        if (jsonReq == null) {
            throw new WMRuntimeException(MessageResource.FAILED_TO_PARSE_REQUEST, input);
        } else if (!jsonReq.containsKey(ServerConstants.METHOD) || !jsonReq.containsKey(ServerConstants.ID)) {
            throw new WMRuntimeException(MessageResource.SERVER_NOMETHODORID, input);
        }

        method = (String) jsonReq.get(ServerConstants.METHOD);
        params = null;
        if (jsonReq.containsKey(ServerConstants.PARAMETERS)) {
            Object rawParams = jsonReq.get(ServerConstants.PARAMETERS);

            if (rawParams instanceof JSONArray) {
                params = (JSONArray) rawParams;
            } else if (rawParams == null) {
                params = new JSONArray();
            } else if (rawParams instanceof JSONObject) {
                JSONObject tjo = (JSONObject) rawParams;
                if (tjo.isEmpty()) {
                    params = new JSONArray();
                } else {
                    throw new WMRuntimeException(MessageResource.JSONRPC_CONTROLLER_BAD_PARAMS_NON_EMPTY, tjo, jsonReq);
                }
            } else {
                throw new WMRuntimeException(MessageResource.JSONRPC_CONTROLLER_BAD_PARAMS_UNKNOWN_TYPE, rawParams.getClass(), jsonReq);
            }
        } else {
            params = new JSONArray();
        }

        if (this.logger.isInfoEnabled()) {
            this.logger.info("Invoke Service: " + serviceName + ", Method: " + method);
            if (this.logger.isDebugEnabled()) {
                this.logger.debug("Method " + method + " Parameters: " + params);
            }
        }

        ServiceWire sw = this.getServiceManager().getServiceWire(serviceName);
        if (sw == null) {
            throw new WMRuntimeException(MessageResource.NO_SERVICEWIRE, serviceName);
        }

        boolean longResponseTime = false;
        String requestId = null;
        if (params.size() > 1) {
            int len = params.size();
            Object lrt = params.get(len - 2);
            if (lrt != null && lrt.toString().equals("longResponseTime")) {
                this.logger.debug("LongResponse used for: " + serviceName + " " + method);
                requestId = (String) params.get(len - 1);
                longResponseTime = true;
                params.remove(len - 1);
                params.remove(len - 2);
                this.serviceResponse.addRequestThread(requestId, Thread.currentThread());
            }
        }
        TypedServiceReturn reflInvokeRef = invokeMethod(sw, method, params, null, this.serviceResponse, longResponseTime, requestId);

        if (this.logger.isDebugEnabled()) {
            this.logger.debug("method " + method + " result: " + reflInvokeRef);
        }

        JsonView jv = getView();
        ret = getModelAndView(jv, reflInvokeRef);

        return ret;
    }

    @Override
    protected JsonView getView() {

        JsonView ret = new JsonView();
        ret.setJsonConfig(getInternalRuntime().getJSONState());
        return ret;
    }

    @Override
    protected ModelAndView handleError(final String message, Throwable t) {

        TypedView view = getView();

        ErrorResponse er = new ErrorResponse() {

            @Override
            public String getError() {
                return message;
            }
        };

        TypedServiceReturn tsr = new TypedServiceReturn();
        tsr.setReturnValue(er);
        tsr.setReturnType(ReflectTypeUtils.getFieldDefinition(er.getClass(), getInternalRuntime().getJSONState().getTypeState(), false, null));

        return getModelAndView(view, tsr);
    }
}
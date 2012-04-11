/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;

import com.wavemaker.common.WMException;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.server.view.FlashUploadResponseView;
import com.wavemaker.runtime.server.view.TypedView;
import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.runtime.service.TypedServiceReturn;

/**
 * @author Matt Small
 */
public class FlashFileUploadController extends ControllerBase {

    /** Logger for this class and subclasses */
    protected final Logger logger = Logger.getLogger(getClass());

    /**
     * UPLOADS stores the location of files on disk. Windows users must update this; Mac & Linux should be fine.
     */

    @Override
    protected ModelAndView executeRequest(HttpServletRequest request, HttpServletResponse response) throws IOException, WMException {

        String serviceName = ServerUtils.getServiceName(request);
        Map<String, Object[]> params = ServerUtils.mergeParams(request);
        String method = ServerUtils.getMethod(params);
        if (this.logger.isInfoEnabled()) {
            this.logger.info("invoke service: " + serviceName + ", method: " + method);
            if (this.logger.isDebugEnabled()) {
                this.logger.debug("method " + method + " parameters: " + params);
            }
        }

        ServiceWire sw = this.getServiceManager().getServiceWire(serviceName);
        TypedServiceReturn reflInvokeRef = invokeMethod(sw, method, null, params);

        return getModelAndView(getView(), reflInvokeRef);
    }

    @Override
    protected TypedView getView() {
        return new FlashUploadResponseView();
    }

    @Override
    protected ModelAndView handleError(String message, Throwable t) {
        throw new WMRuntimeException(t);
    }
}
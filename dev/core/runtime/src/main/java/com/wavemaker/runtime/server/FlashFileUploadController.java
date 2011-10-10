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
 * @author small
 * @version $Rev: 29059 $ - $Date: 2010-04-29 17:19:33 -0700 (Thu, 29 Apr 2010) $
 * 
 */
public class FlashFileUploadController extends ControllerBase {

    /** Logger for this class and subclasses */
    protected final Logger logger = Logger.getLogger(getClass());

    /**
     * UPLOADS stores the location of files on disk. Windows users must update this; Mac & Linux should be fine.
     */

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.server.ControllerBase#executeRequest(javax.servlet.http.HttpServletRequest,
     * javax.servlet.http.HttpServletResponse)
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

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.server.ControllerBase#getView()
     */
    @Override
    protected TypedView getView() {
        return new FlashUploadResponseView();
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.server.ControllerBase#handleError(java.lang.String, java.lang.Throwable)
     */
    @Override
    protected ModelAndView handleError(String message, Throwable t) {
        throw new WMRuntimeException(t);
    }
}
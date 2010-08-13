/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
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
import com.wavemaker.runtime.server.view.UploadResponseView;
import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.runtime.service.TypedServiceReturn;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class FileUploadController extends JSONRPCController {

    /** Logger for this class and subclasses */
    protected final Logger logger = Logger.getLogger(getClass());
    
    /* (non-Javadoc)
     * @see com.wavemaker.runtime.server.ControllerBase#executeRequest(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected ModelAndView executeRequest(HttpServletRequest request,
            HttpServletResponse response) throws IOException, WMException {
        
        String serviceName = ServerUtils.getServiceName(request);
        Map<String, Object[]> params = ServerUtils.mergeParams(request);
        String method = ServerUtils.getMethod(params);
        
        if (logger.isInfoEnabled()) {
            logger.info("invoke service: " + serviceName + ", method: " + method);
            if (logger.isDebugEnabled()) {
                logger.debug("method "+method+" parameters: "+params);
            }
        }
        
        ServiceWire sw = this.getServiceManager().getServiceWire(serviceName);
        TypedServiceReturn reflInvokeRef = invokeMethod(sw, method, null, params);
        

        if (logger.isDebugEnabled()) {
            logger.debug("method "+method+" result: "+reflInvokeRef);
        }

        return getModelAndView(getView(), reflInvokeRef);
    }

    /* (non-Javadoc)
     * @see com.wavemaker.runtime.server.ControllerBase#getView()
     */
    @Override
    protected UploadResponseView getView() {
        
        UploadResponseView ret = new UploadResponseView();
        ret.setJsonConfig(getInternalRuntime().getJSONState());

        return ret;
    }
}
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

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;

import com.wavemaker.common.WMException;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.server.view.FlashUploadResponseView;
import com.wavemaker.runtime.server.view.DownloadView;
import com.wavemaker.runtime.server.view.TypedView;
import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.runtime.service.TypedServiceReturn;

/**
 * @author small
 * @version $Rev: 29059 $ - $Date: 2010-04-29 17:19:33 -0700 (Thu, 29 Apr 2010) $
 *
 */
public class FlashFileUploadController extends ControllerBase {
    

    @Override
    protected ModelAndView executeRequest(HttpServletRequest request,
            HttpServletResponse response) throws IOException, WMException {
        
        return null;
    }

    @Override
    protected TypedView getView() {
        return null;
    }

    @Override
    protected ModelAndView handleError(String message, Throwable t) {
        throw new WMRuntimeException(t);
    }
}
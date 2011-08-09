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

import com.wavemaker.runtime.ws.WebServiceException;

/**
 * This interfcae is implemented by a WaveMaker standard class <tt>DefaultResponseProcessor<tt>. When a web service is
 * called (or requested) in the WaveMaker framework, the standard WaveMaker web service module assumes that the response
 * is in XML format and process the response using JAXB APIs.  Developers can change the standard behaviour by extending
 * <tt>DefaultResponseProcessor<tt>. Usually, developers may want to override the standard implementations for the
 * following reasons.
 *      - The response may need to be manipilated before it is submitted to JAXB APIs or after processed by JAXB
 *      - The response is not in XML format.  It can be JSON or something else.
 *      - Exceptions need to be caught explicitly.  For example, authorization errors such expired session need to
 *        be caught so that a login attempt can be made.
 *
 * @author slee
 *
 */
public interface IPwsResponseProcessor {

    /**
     * Some web service calls returns exceptios in the response object.  This method anayzes the response and throws
     * an exception when the response contains the data of specific concern. The exception should be caught later in the
     * custom REST service processor which extends <tt>RESTService<tt> for proper handling.
     *
     * @param bytes byte array containing web service response data
     * @throws PwsException when the response data contains the data of specific concenr
     * @throws WebServiceException any exception encountered while analyzing the response data
     */
    public void detectExcetionsBeforeProcess(byte[] bytes) throws WebServiceException, PwsException;

    /**
     * Process response data
     *
     * @param bytes byte array containing web service response data
     * @param responseType the java class of the response object
     * @return the response object
     * @throws WebServiceException if an error occurs
     */
    public <T extends Object> T processServiceResponse(byte[] bytes, Class<T> responseType)
                throws WebServiceException;
}

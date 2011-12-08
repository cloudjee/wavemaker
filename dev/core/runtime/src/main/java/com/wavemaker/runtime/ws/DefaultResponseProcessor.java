/*
 * Copyright (C) 2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.ws;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;

import com.wavemaker.runtime.pws.IPwsResponseProcessor;
import com.wavemaker.runtime.pws.PwsException;

/**
 * Default Http Response processor
 */
public class DefaultResponseProcessor implements IPwsResponseProcessor {

    @Override
    public <T extends Object> T processServiceResponse(byte[] bytes, Class<T> responseType) throws WebServiceException {
        ByteArrayInputStream is = new ByteArrayInputStream(bytes);
        try {
            if (responseType == Void.class) {
                return null;
            } else if (responseType == String.class) {
                String responseString = HTTPBindingSupport.convertStreamToString(is);
                return responseType.cast(responseString);
            } else {
                JAXBContext context = JAXBContext.newInstance(responseType);
                Unmarshaller unmarshaller = context.createUnmarshaller();
                Object object = unmarshaller.unmarshal(is);
                return responseType.cast(object);
            }
        } catch (IOException e) {
            throw new WebServiceException(e);
        } catch (JAXBException e) {
            throw new WebServiceException(e);
        }
    }

    @Override
    public void detectExceptionsBeforeProcess(byte[] bytes) throws WebServiceException, PwsException {
    }
}

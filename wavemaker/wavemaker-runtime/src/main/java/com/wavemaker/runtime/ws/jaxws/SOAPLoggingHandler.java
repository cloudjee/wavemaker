/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.ws.jaxws;

import java.io.ByteArrayOutputStream;
import java.util.Set;

import javax.xml.namespace.QName;
import javax.xml.soap.SOAPMessage;
import javax.xml.ws.handler.MessageContext;
import javax.xml.ws.handler.soap.SOAPHandler;
import javax.xml.ws.handler.soap.SOAPMessageContext;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * This handler is used to log inbound and outbound SOAP messages.
 * 
 * @author Frankie Fu
 */
public class SOAPLoggingHandler implements SOAPHandler<SOAPMessageContext> {

    private static Log log = LogFactory.getLog(SOAPLoggingHandler.class);

    @Override
    public Set<QName> getHeaders() {
        return null;
    }

    @Override
    public boolean handleMessage(SOAPMessageContext context) {
        log(context);
        return true;
    }

    @Override
    public boolean handleFault(SOAPMessageContext context) {
        log(context);
        return true;
    }

    @Override
    public void close(MessageContext messageContext) {
    }

    private void log(SOAPMessageContext context) {
        Boolean outboundProperty = (Boolean) context.get(MessageContext.MESSAGE_OUTBOUND_PROPERTY);
        String messageText;
        if (outboundProperty.booleanValue()) {
            messageText = "Outbound SOAP message:\n";
        } else {
            messageText = "Inbound SOAP message:\n";
        }

        SOAPMessage message = context.getMessage();
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            message.writeTo(baos);
            log.debug(messageText + baos.toString());
            baos.close();
        } catch (Exception e) {
            log.error(e);
        }
    }
}
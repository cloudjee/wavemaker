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

package com.wavemaker.tools.ws.wsdl;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.wavemaker.common.MessageResource;
import com.wavemaker.tools.common.ConfigurationException;

/**
 * This class manages WSDLs.
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 */
public class WSDLManager {

    private static WSDLManager instance;

    private Map<String, WSDL> wsdlMap;

    private WSDLManager() {
        wsdlMap = new HashMap<String, WSDL>();
    }

    public static synchronized WSDLManager getInstance() {
        if (instance == null) {
            instance = new WSDLManager();
        }
        return instance;
    }

    /**
     * Registers the WSDL via the specified URI.
     * 
     * @param wsdlURI
     *                A URI (can be a filename or URL) poiniting to a WSDL
     *                definition.
     * @param serviceId
     *                The service ID for this WSDL. If this is null, a generated
     *                one will be set in the WSDL.
     * @return The imported WSDL object.
     * @throws WSDLException
     */
    public WSDL registerWSDL(String wsdlURI, String serviceId) throws WSDLException {
        WSDL wsdl = processWSDL(wsdlURI, serviceId);
        wsdlMap.put(wsdl.getServiceId(), wsdl);
        return wsdl;
    }

    /**
     * Returns a WSDL object via the specified URI. This does not register the
     * WSDL to the manager. An exception will be thrown if the WSDL is
     * PRC/encoded style.
     * 
     * @param wsdlURI
     *                A URI (can be a filename or URL) poiniting to a WSDL
     *                definition.
     * @param serviceId
     *                The service ID for this WSDL. If this is null, a generated
     *                one will be set in the WSDL.
     * @return The WSDL object.
     * @throws WSDLException
     */
    public static WSDL processWSDL(String wsdlURI, String serviceId) throws WSDLException {
        if (wsdlURI == null) {
            throw new IllegalArgumentException(MessageResource.WS_NULL_WSDL_URI.getMessage());
        }
        WSDL wsdl = (new WSDLBuilder(wsdlURI)).buildWSDL(serviceId);
        if (wsdl.isRPC() && wsdl.isSOAPEncoded()) {
            throw new ConfigurationException(MessageResource.WS_RPC_ENCODED_NOT_SUPPORTED);
        }
        return wsdl;
    }

    /**
     * Returns the WSDL corresponding to the given service ID.
     * 
     * @param serviceId
     *            The service ID for the desired WSDL.
     * @return The WSDL.
     */
    public WSDL getWSDL(String serviceId) {
        return wsdlMap.get(serviceId);
    }

    /**
     * Removes the specified WSDL.
     * 
     * @param serviceId
     *            The service ID of the WSDL to be removed.
     */
    public void removeWSDL(String serviceId) {
        wsdlMap.remove(serviceId);
    }
    
    /**
     * Writes the WSDL to the specified file.
     * 
     * @param wsdl The WSDL to be written.
     * @param file The file to wirte the XML to.
     * @throws WSDLException
     */
    public static void writeWSDL(WSDL wsdl, File file) throws WSDLException, IOException {
        WSDLUtils.writeDefinition(wsdl.getDefinition(), file);
    }

    /**
     * Returns all service IDs.
     * 
     * @return An array of service IDs.
     */
    public String[] getAllServiceIds() {
        return (String[]) wsdlMap.keySet().toArray(new String[wsdlMap.size()]);
    }

}

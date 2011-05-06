/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.runtime.service.events;

import com.wavemaker.common.util.Tuple.Two;
import com.wavemaker.runtime.service.ServiceWire;
import com.wavemaker.runtime.service.TypedServiceReturn;


/**
 * ServiceEventListner provides an interface to listeners concerned with
 * service-level events (such as pre/post operation invokes).  This will
 * operate in a way similar to ServletEventListener (and the listener/notifier
 * layer).
 * 
 * As mentioned in ServletEventListener's docs, there is no guarantee of order
 * in the EventListeners.  Especially here, where several postOperations may
 * alter the same result value, they should not depend on each other's
 * operation.
 * 
 * @see ServletEventListener
 * 
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public interface ServiceEventListener {
    
    /**
     * Notification before an operation is called.
     * 
     * @param service
     *                The ServiceWire upon which the method will be invoked.
     * @param operationName
     *                The operation that will be invoked.
     * @param params
     *                An Object array of all parameters that were passed to the
     *                server (this may have been passed through additional
     *                ServiceEventListeners).
     * @return The parameters to use in the actual invocation; they can be the
     *         same as those passed in, or they could be altered by this method
     *         (this may be passed through additional ServiceEventListeners).
     */
    public Object[] preOperation(ServiceWire serviceWire, String operationName,
            Object[] params);
    
    /**
     * Callback providing notification after the successful invocation of a
     * method. There may be multiple callbacks, even if an error occurs,
     * although the order is not guaranteed. If the an error does occur, but the
     * first postOperation() properly handles it, further postOperation() calls
     * will have a null throwable argument.
     * 
     * @param serviceWire
     *                The ServiceWire upon which the method was invoked.
     * @param operationName
     *                The operation that has been invoked.
     * @param result
     *                The return from the method (this may have been passed
     *                through additional ServiceEventListeners). This may be
     *                null if the service invocation threw an exception, or if
     *                the method returned null after a normal exit.
     * @param throwable
     *                Any resulting exception from the service invocation. If a
     *                ServiceEventListener method throws an exception,
     *                postOperation() will not be called. This will be null iff
     *                the service exited normally.
     * @return The value that should be returned to the client (this may be
     *         passed through additional ServiceEventListeners); this is a
     *         {@link Two} containing both the actual result Object and the
     *         FieldDefinition for the type of that Object.
     */
    public TypedServiceReturn postOperation(
            ServiceWire serviceWire, String operationName,
            TypedServiceReturn result, Throwable throwable)
            throws Throwable;
}
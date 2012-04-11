/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.cloudfoundry.spinup;

import com.wavemaker.tools.cloudfoundry.spinup.authentication.TransportToken;

/**
 * A started application returned from the {@link SpinupService}. Generally clients will need to store the transport
 * token as a cookie before redirecting to the application URL.
 * 
 * @author Phillip Webb
 */
public interface StartedApplication {

    /**
     * Returns the transport token that should be passed to the running application. Generally cookies are the
     * recommended method of transferring the transport token.
     * 
     * @return the transport token
     */
    TransportToken getTransportToken();

    /**
     * Returns the URL of the spun up application.
     * 
     * @return the application URL
     */
    String getApplicationUrl();

    /**
     * Returns the domain of the spun up application in a form that can be used with a cookie.
     * 
     * @return the domain or <tt>null</tt>.
     */
    String getDomain();

}

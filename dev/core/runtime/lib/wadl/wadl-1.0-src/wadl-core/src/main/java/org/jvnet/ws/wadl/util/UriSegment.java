/*
 * The contents of this file are subject to the terms
 * of the Common Development and Distribution License
 * (the "License").  You may not use this file except
 * in compliance with the License.
 * 
 * You can obtain a copy of the license at
 * http://www.opensource.org/licenses/cddl1.php
 * See the License for the specific language governing
 * permissions and limitations under the License.
 */

package org.jvnet.ws.wadl.util;

import java.util.ArrayList;

/*
 * UriSegment.java
 *
 * Created on February 7, 2007, 10:55 AM
 */
class UriSegment extends ArrayList<String> {
    private String pathSegment;
    
    /**
     * Create a new instance
     */
    public UriSegment(String path) {
        pathSegment = path;
    }
    
    /**
     * Get the assocaited path segment
     * @return the path segment
     */
    public String getPathSegment() {
        return pathSegment;
    }
    
}
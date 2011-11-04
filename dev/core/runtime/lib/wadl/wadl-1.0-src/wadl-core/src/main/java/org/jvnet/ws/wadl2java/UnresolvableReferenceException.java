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

/*
 * UnresolvableReferenceException.java
 *
 * Created on June 1, 2006, 10:05 AM
 */

package org.jvnet.ws.wadl2java;

/**
 * Thrown when a reference cannot be resolved
 * @author mh124079
 */
public class UnresolvableReferenceException extends java.lang.Exception {
    
    /**
     * Creates a new instance of <code>UnresolvableReferenceException</code> without detail message.
     */
    public UnresolvableReferenceException() {
    }
    
    
    /**
     * Constructs an instance of <code>UnresolvableReferenceException</code> with the specified detail message.
     * @param msg the detail message.
     */
    public UnresolvableReferenceException(String msg) {
        super(msg);
    }
}

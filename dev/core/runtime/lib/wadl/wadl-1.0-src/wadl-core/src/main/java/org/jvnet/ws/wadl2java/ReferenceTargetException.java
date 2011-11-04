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
 * ReferenceTargetException.java
 *
 * Created on June 1, 2006, 10:07 AM
 */

package org.jvnet.ws.wadl2java;

/**
 * Thrown when a reference resolves to an object of the incorrect type
 * @author mh124079
 */
public class ReferenceTargetException extends java.lang.Exception {
    
    /**
     * Creates a new instance of <code>ReferenceTargetException</code> without detail message.
     */
    public ReferenceTargetException() {
    }
    
    
    /**
     * Constructs an instance of <code>ReferenceTargetException</code> with the specified detail message.
     * 
     * @param msg the detail message.
     */
    public ReferenceTargetException(String msg) {
        super(msg);
    }
}

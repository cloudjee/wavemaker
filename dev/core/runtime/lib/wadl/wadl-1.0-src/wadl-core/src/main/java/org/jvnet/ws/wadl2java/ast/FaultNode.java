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
 * FaultNode.java
 *
 * Created on August 16, 2006, 1:00 PM
 */

package org.jvnet.ws.wadl2java.ast;

import org.jvnet.ws.wadl.RepresentationType;
import org.jvnet.ws.wadl.Param;
import org.jvnet.ws.wadl.Doc;
import org.jvnet.ws.wadl2java.GeneratorUtil;
import java.util.List;
import javax.xml.namespace.QName;

/**
 * Represents a WADL fault
 * @author mh124079
 */
public class FaultNode {
    
    private RepresentationType fault;
    String className;
    
    /**
     * Creates a new instance of FaultNode
     * @param f the unmarshalled JAXB-generated fault object
     */
    public FaultNode(RepresentationType f) {
        fault = f;
        if (f.getId()!=null)
            className = GeneratorUtil.makeClassName(f.getId());
        else if (f.getElement()!=null)
            className = GeneratorUtil.makeClassName(f.getElement().getLocalPart());
        else
            className = getMediaTypeAsClassName();
        className+="Exception";
    }
    
    /**
     * Convenience function for generating a suitable Java class name for this WADL
     * fault
     * @return a suitable class name
     */
    public String getClassName() {
        return className;
    }

    /**
     * Convenience function for generating a suitable Java class name for this WADL
     * fault based on the media type
     * @return a suitable class name
     */
    public String getMediaTypeAsClassName() {
        return GeneratorUtil.makeClassName(getMediaType());
    }
    
    /**
     * Get the media type of the fault
     * @return the media type
     */
    public String getMediaType() {
        return fault.getMediaType();
    }
    
    /**
     * Get the XML root element of the fault representation
     * @return the XML qualified name of the root element
     */
    public QName getElement() {
        return fault.getElement();
    }
    
    /**
     * Get the child parameters
     * @return a list of child parameters
     */
    public List<Param> getParam() {
        return fault.getParam();
    }

    /**
     * List of child documentation elements
     * @return documentation list, one item per language
     */
    public List<Doc> getDoc() {
        return fault.getDoc();
    }
}

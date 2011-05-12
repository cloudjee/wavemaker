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
 * RepresentationNode.java
 *
 * Created on August 16, 2006, 12:59 PM
 *
 */

package org.jvnet.ws.wadl2java.ast;

import org.jvnet.ws.wadl.Doc;
import org.jvnet.ws.wadl.Param;
import org.jvnet.ws.wadl.RepresentationType;
import org.jvnet.ws.wadl2java.GeneratorUtil;
import java.util.List;
import javax.xml.namespace.QName;

/**
 * Represents a WADL representation
 * @author mh124079
 */
public class RepresentationNode {
    
    RepresentationType rep;
    
    /**
     * Creates a new instance of RepresentationNode
     * @param r the unmarshalled JAXB-generated representation object
     */
    public RepresentationNode(RepresentationType r) {
        rep = r;
    }
    
    /**
     * Convenience function for generating a suitable Java class name for this WADL
     * representation based on the media type
     * @return a suitable name
     */
    public String getMediaTypeAsClassName() {
        return GeneratorUtil.makeClassName(getMediaType());
    }
    
    /**
     * Get the media type of the representation
     * @return the media type
     */
    public String getMediaType() {
        return rep.getMediaType();
    }
    
    /**
     * Get the list of link profiles used to described the relationships of 
     * embedded links
     * @return list of profiles
     */
    public List<String> getProfiles() {
        return rep.getProfile();
    }

    /**
     * Get the XML root element name for the representation
     * @return the qualified name of the root XML element
     */
    public QName getElement() {
        return rep.getElement();
    }
    
    /**
     * Get a list of child parameters
     * @return child parameters
     */
    public List<Param> getParam() {
        return rep.getParam();
    }

    /**
     * List of child documentation elements
     * @return documentation list, one item per language
     */
    public List<Doc> getDoc() {
        return rep.getDoc();
    }
    
    /**
     * Get the representation id (if any)
     * @return the id or null if no id
     */
    public String getId() {
        return rep.getId();
    }
}

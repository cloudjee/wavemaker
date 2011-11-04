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
 * ResourceTypeNode.java
 *
 * Created on August 16, 2006, 12:58 PM
 */

package org.jvnet.ws.wadl2java.ast;

import com.sun.codemodel.JDefinedClass;
import org.jvnet.ws.wadl.Doc;
import org.jvnet.ws.wadl.Param;
import org.jvnet.ws.wadl.ResourceType;
import org.jvnet.ws.wadl2java.GeneratorUtil;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a WADL resource_type
 * @author mh124079
 */
public class ResourceTypeNode {
    
    private String interfaceName;
    private List<MethodNode> methods;
    private PathSegment pathSegment;
    private List<Doc> doc;
    private JDefinedClass generatedInterface;
    
    /**
     * Create a new instance of ResourceTypeNode
     * @param resourceType the unmarshalled JAXB-generated object
     */
    public ResourceTypeNode(ResourceType resourceType) {
        doc = resourceType.getDoc();
        pathSegment = new PathSegment(resourceType);
        interfaceName = GeneratorUtil.makeClassName(resourceType.getId());
        methods = new ArrayList<MethodNode>();
        generatedInterface = null;
    }
    
    /**
     * Convenience function for generating a suitable Java class name for this WADL
     * resource
     * @return a suitable name
     */
    public String getClassName() {
        return interfaceName;
    }
    
    /**
     * Get the methods for this resource
     * @return a list of methods
     */
    public List<MethodNode> getMethods() {
        return methods;
    }
    
    public List<Param> getQueryParams() {
        return pathSegment.getQueryParameters();
    }
        
    public List<Param> getHeaderParams() {
        return pathSegment.getHeaderParameters();
    }
        
    public List<Param> getMatrixParams() {
        return pathSegment.getMatrixParameters();
    }
        
    /**
     * List of child documentation elements
     * @return documentation list, one item per language
     */
    public List<Doc> getDoc() {
        return doc;
    }

    public void setGeneratedInterface(JDefinedClass iface) {
        generatedInterface = iface;
    }
    
    public JDefinedClass getGeneratedInterface() {
        return generatedInterface;
    }
}

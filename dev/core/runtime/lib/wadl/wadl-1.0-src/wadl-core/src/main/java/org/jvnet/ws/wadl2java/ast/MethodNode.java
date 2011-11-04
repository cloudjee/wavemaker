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
 * MethodNode.java
 *
 * Created on August 16, 2006, 12:59 PM
 */

package org.jvnet.ws.wadl2java.ast;

import org.jvnet.ws.wadl.Doc;
import org.jvnet.ws.wadl.Method;
import org.jvnet.ws.wadl.Param;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a WADL method
 * @author mh124079
 */
public class MethodNode {
    
    private ResourceNode parentResource;
    private ResourceTypeNode parentResourceType;
    private String name;
    private List<Param> queryParams;
    private List<Param> headerParams;
    private List<RepresentationNode> supportedInputs;
    private List<RepresentationNode> supportedOutputs;
    private List<FaultNode> faults;
    private Method method;
    
    /**
     * Creates a new instance of MethodNode and attach it to a resource
     * @param m the unmarshalled JAXB-generated method object
     * @param r the resource to attach the method to
     */
    public MethodNode(Method m, ResourceNode r) {
        method = m;
        name = m.getName();
        parentResource = r;
        parentResourceType = null;
        queryParams = new ArrayList<Param>();
        queryParams.addAll(parentResource.getQueryParams());
        headerParams = new ArrayList<Param>();
        headerParams.addAll(parentResource.getHeaderParams());
        supportedInputs = new ArrayList<RepresentationNode>();
        supportedOutputs = new ArrayList<RepresentationNode>();
        faults = new ArrayList<FaultNode>();
        r.getMethods().add(this);
    }
    
    /**
     * Creates a new instance of MethodNode and attach it to a resource type
     * @param m the unmarshalled JAXB-generated method object
     * @param r the resource to attach the method to
     */
    public MethodNode(Method m, ResourceTypeNode r) {
        method = m;
        name = m.getName();
        parentResource = null;
        parentResourceType = r;
        queryParams = new ArrayList<Param>();
        queryParams.addAll(r.getQueryParams());
        headerParams = new ArrayList<Param>();
        headerParams.addAll(r.getHeaderParams());
        supportedInputs = new ArrayList<RepresentationNode>();
        supportedOutputs = new ArrayList<RepresentationNode>();
        faults = new ArrayList<FaultNode>();
        r.getMethods().add(this);
    }
    
    /**
     * Get the method name
     * @return the method name
     */
    public String getName() {
        return name;
    }
    
    /**
     * Get all the query parameters
     * @return list of query parameters
     */
    public List<Param> getQueryParameters() {
        return queryParams;
    }
    
    /**
     * Get all the header parameters
     * @return list of header parameters
     */
    public List<Param> getHeaderParameters() {
        return headerParams;
    }
    
    /**
     * Get the parameters marked as required
     * @return list of required parameters
     */
    public List<Param> getRequiredParameters() {
        ArrayList<Param> required = new ArrayList<Param>();
        for (Param p: getQueryParameters()) {
            if (p.isRequired())
                required.add(p);
        }
        for (Param p: getHeaderParameters()) {
            if (p.isRequired())
                required.add(p);
        }
        return required;
    }
    
    /**
     * Get the parameters marked as optional
     * @return list of optional parameters
     */
    public List<Param> getOptionalParameters() {
        ArrayList<Param> optional = new ArrayList<Param>();
        for (Param p: getQueryParameters()) {
            if (!p.isRequired())
                optional.add(p);
        }
        for (Param p: getHeaderParameters()) {
            if (!p.isRequired())
                optional.add(p);
        }
        return optional;
    }
    
    /**
     * Checks if there are any optional parameters
     * @return true if there are optional parameters, false if not
     */
    public boolean hasOptionalParameters() {
        return getOptionalParameters().size() > 0;
    }
    
    /**
     * Get a list of the supported input types, these correspond to the body of a PUT,
     * or POST request
     * @return a list of representations that can be accepted by the method
     */
    public List<RepresentationNode> getSupportedInputs() {
        return supportedInputs;
    }

    /**
     * Get a list of the output representations that the method supports, these
     * correspond to the body of a GET, POST or PUT response.
     * @return list of supported outputs
     */
    public List<RepresentationNode> getSupportedOutputs() {
        return supportedOutputs;
    }
    
    /**
     * Get a list of the faults for this method
     * @return list of faults
     */
    public List<FaultNode> getFaults() {
        return faults;
    }
    
    /**
     * List of child documentation elements
     * @return documentation list, one item per language
     */
    public List<Doc> getDoc() {
        return method.getDoc();
    }

}

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
 * URIUtil.java
 *
 * Created on June 1, 2006, 3:12 PM
 */

package org.jvnet.ws.wadl.util;

import org.jvnet.ws.wadl2java.ast.PathSegment;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Utilities for working with URIs
 * @author mh124079
 */
public class URIUtil {
    
    /**
     * Builds a URI as a string from a set of components. Embedded parameters within
     * the path segments are replaced with their values taken from paramValues. Matrix
     * URI parameters are added to the end of the corresponding path segment. E.g.
     * 
     * <pre>  pathSegments = {"{p1}/xyzzy/{p2}", "{p3}"}
     *   matrixParams = {{"p4"}, {}}
     *   paramValues = {"p1"=>"v1", "p2"=>"v2", "p3"=>"v3", "p4"=>"v4"}</pre>
     * 
     * would result in the following URI
     * 
     * <pre>  v1/xyzzy/v2;p4=v4/v3</pre>
     * @return The URI resulting from merging the URI components.
     * @param pathSegments a list of path segments
     * @param matrixParams a list of sets of matrix parameter names
     * @param paramValues a map of parameter name to value, values can be of any class, the object's 
     * toString method is used to render a stringified value
     */
    public static String buildURI(List<String> pathSegments, List<List<String>> matrixParams, Map<String, Object> paramValues) {
        ArrayList<String> merged = new ArrayList<String>();
        for (int i=0; i< pathSegments.size(); i++) {
            List<String> associatedMatrixParams = matrixParams==null ? null : matrixParams.get(i);
            PathSegment segment = new PathSegment(pathSegments.get(i), associatedMatrixParams);
            merged.add(segment.evaluate(paramValues));
        }
        return concatenate(merged);
    }
    
    /**
     * Join a list of URI fragments into a URI using '/' as a separator.
     * @param components the list of URI fragments
     * @return the resulting URI
     */
    public static String concatenate(List<String> components) {
        StringBuffer buf = new StringBuffer();
        
        for (int i=0; i<components.size(); i++) {
            if (i>0 && buf.charAt(buf.length()-1)!='/' && components.get(i).charAt(0)!='/')
                buf.append('/');
            buf.append(components.get(i));
        }
        
        return buf.toString();
    }
    
    /**
     * Add a query string to a URI
     * @param uri the URI
     * @param queryString the query string
     * @throws java.net.URISyntaxException if the resulting URI is malformed
     * @return the resulting URI
     */
    public static String appendQueryString(URI uri, String queryString) throws URISyntaxException {
        URI newURI = new URI(uri.getScheme(), uri.getUserInfo(), uri.getHost(),
                uri.getPort(), uri.getPath(), queryString, uri.getFragment());
        return newURI.toString();
    }
    
    /**
     * Add a query string to a URI
     * 
     * @return the resulting URI
     * @param uri the URI
     * @param queryString the query string
     */
    public static String appendQueryString(String uri, String queryString) {
        if (queryString==null || queryString.length()==0)
            return uri;
        else if (uri.endsWith("?"))
            return uri+queryString;
        else
            return uri+"?"+queryString;
    }
    /**
     * Builds a URI query string from a map of keys and values.
     * @param queryParams a map of keys and their values. A value may be a <code>List</code> for repeating values.
     * @return the resulting query string
     */
    public static String buildQueryString(Map<String, Object> queryParams) {
        StringBuffer buf = new StringBuffer();
        boolean firstParam = true;
        try {
            for (Map.Entry<String, Object> entry: queryParams.entrySet()) {
                if (entry.getValue() == null)
                    continue;
                if (entry.getValue() instanceof List<?>) {
                    List<?> values = (List<?>)entry.getValue();
                    for (Object value: values) {
                        if (!firstParam) {
                            buf.append('&');
                        }
                        buf.append(entry.getKey());
                        buf.append('=');
                        buf.append(java.net.URLEncoder.encode(value.toString(), "utf-8"));
                        firstParam = false;
                    }
                }
                else {
                    if (!firstParam) {
                        buf.append('&');
                    }
                    buf.append(entry.getKey());
                    buf.append('=');
                    buf.append(java.net.URLEncoder.encode(entry.getValue().toString(), "utf-8"));
                    firstParam = false;
                }
            } 
        } catch (UnsupportedEncodingException ex) {
            ex.printStackTrace();
        } 
        return buf.toString();
    }
}

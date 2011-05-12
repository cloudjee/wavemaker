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
 * UriBuilder.java
 *
 * Created on February 7, 2007, 10:55 AM
 */


package org.jvnet.ws.wadl.util;

import org.jvnet.ws.wadl2java.ast.PathSegment;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Utility class for building a URI from a list or path segments, matrix
 * parameters and query parameters
 */
public class UriBuilder extends ArrayList<UriSegment> {
    
    /** Creates a new instance of UriBuilder */
    public UriBuilder() {
    }
    
    /**
     * Add a path segment.
     * @param path a URI path segment
     * @return a list to which the names of any matrix parameters for the
     * path segment should be added.
     */
    public List<String> addPathSegment(String path) {
        UriSegment segment = new UriSegment(path);
        add(segment);
        return segment;
    }
    
    /**
     * Build a request URI
     * @param uriParams a map of template and matrix parameter names to values.
     * Values may be of any class, the object's
     * toString method is used to produce a stringified value when embedded in the
     * resource's URI.
     * @param queryParams a map of query parameter names to values.
     * Values may be of any class, the object's
     * toString method is used to produce a stringified value when embedded in the
     * resource's URI.
     * @return the URI as a String
     */
    public String buildUri(Map<String, Object> uriParams, Map<String, Object> queryParams) {
        ArrayList<String> merged = new ArrayList<String>();
        for (UriSegment segment: this) {
            PathSegment path = new PathSegment(segment.getPathSegment(), segment);
            merged.add(path.evaluate(uriParams));
        }
        String queryString = URIUtil.buildQueryString(queryParams); 
        String url = URIUtil.appendQueryString(URIUtil.concatenate(merged), queryString);
        return url;
    }

}

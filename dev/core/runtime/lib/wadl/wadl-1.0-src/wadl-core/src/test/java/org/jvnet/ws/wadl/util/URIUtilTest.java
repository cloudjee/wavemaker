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
 * URIUtilTest.java
 * JUnit based test
 *
 * Created on August 8, 2006, 3:16 PM
 */

package org.jvnet.ws.wadl.util;

import junit.framework.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author mh124079
 */
public class URIUtilTest extends TestCase {
    
    public URIUtilTest(String testName) {
        super(testName);
    }

    protected void setUp() throws Exception {
    }

    protected void tearDown() throws Exception {
    }

    /**
     * Test of buildURI method, of class org.jvnet.ws.wadl.util.URIUtil.
     */
    public void testBuildURI() {
        System.out.println("buildURI");
        
        List<String> pathSegments = new ArrayList<String>();
        pathSegments.add("http://example.com/");
        pathSegments.add("{param1}");
        List<List<String>> matrixParams = null;
        Map<String, Object> paramValues = new HashMap<String, Object>();
        paramValues.put("param1", "value1");
        
        String expResult = "http://example.com/value1";
        String result = URIUtil.buildURI(pathSegments, matrixParams, paramValues);
        assertEquals(expResult, result);
        List<String> matrixParamsForSegment2 = new ArrayList<String>();
        matrixParamsForSegment2.add("sorted");
        paramValues.put("sorted", Boolean.TRUE);
        matrixParams = new ArrayList<List<String>>();
        matrixParams.add(new ArrayList<String>());
        matrixParams.add(matrixParamsForSegment2);
        result = URIUtil.buildURI(pathSegments, matrixParams, paramValues);
        expResult = "http://example.com/value1;sorted";
        assertEquals(expResult, result);
    }

    /**
     * Test of concatenate method, of class org.jvnet.ws.wadl.util.URIUtil.
     */
    public void testConcatenate() {
        System.out.println("concatenate");
        
        List<String> components = new ArrayList<String>();
        components.add("fred/");
        components.add("bob");
        components.add("/alice");
        
        String expResult = "fred/bob/alice";
        String result = URIUtil.concatenate(components);
        assertEquals(expResult, result);
    }

    /**
     * Test of buildQueryString method, of class org.jvnet.ws.wadl.util.URIUtil.
     */
    public void testBuildQueryString() {
        System.out.println("buildQueryString");
        
        Map<String, Object> queryParams = new HashMap<String, Object>();
        queryParams.put("p1", "v1");
        queryParams.put("p2", true);
        queryParams.put("p3", "v3");
        List<String> v4 = new ArrayList<String>();
        v4.add("v4a");
        v4.add("v4b");
        v4.add("v4c");
        queryParams.put("p4", v4);
        queryParams.put("p5", "a b");
        
        String result = URIUtil.buildQueryString(queryParams);
        assertTrue(result.split("&").length == 7);
        assertTrue(result.contains("p1=v1"));
        assertTrue(result.contains("p2=true"));
        assertTrue(result.contains("p3=v3"));
        assertTrue(result.contains("p4=v4a"));
        assertTrue(result.contains("p4=v4b"));
        assertTrue(result.contains("p4=v4c"));
        assertTrue(result.contains("p5=a+b"));
    }
    
}

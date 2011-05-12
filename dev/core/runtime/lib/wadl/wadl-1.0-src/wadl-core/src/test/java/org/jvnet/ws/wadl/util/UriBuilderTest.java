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
 * UriBuilderTest.java
 * JUnit based test
 *
 * Created on February 8, 2007, 11:24 AM
 */

package org.jvnet.ws.wadl.util;

import junit.framework.*;
import org.jvnet.ws.wadl2java.ast.PathSegment;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Test UriBuilder
 */
public class UriBuilderTest extends TestCase {
    
    public UriBuilderTest(String testName) {
        super(testName);
    }

    protected void setUp() throws Exception {
    }

    protected void tearDown() throws Exception {
    }

    /**
     * Test of buildUri method, of class org.jvnet.ws.wadl.util.UriBuilder.
     */
    public void testBuildUri() {
        System.out.println("buildUri");
        
        UriBuilder instance = new UriBuilder();
        List<String> matrixParamList = instance.addPathSegment("http://127.0.0.1/");
        matrixParamList = instance.addPathSegment("{t1}");
        matrixParamList.add("t1m1");
        matrixParamList.add("t1m2");
        matrixParamList = instance.addPathSegment("{t2}");
        matrixParamList.add("t2m1");
        matrixParamList.add("t2m2");
        
        Map<String, Object> uriParams = new HashMap<String, Object>();
        Map<String, Object> queryParams = new HashMap<String, Object>();
        uriParams.put("t1","a");
        uriParams.put("t2","b");
        String expResult = "http://127.0.0.1/a/b";
        String result = instance.buildUri(uriParams, queryParams);
        assertEquals(expResult, result);
        
        uriParams.put("t1m1","t1m1value");
        expResult = "http://127.0.0.1/a;t1m1=t1m1value/b";
        result = instance.buildUri(uriParams, queryParams);
        assertEquals(expResult, result);

        uriParams.put("t1m2",10);
        expResult = "http://127.0.0.1/a;t1m1=t1m1value;t1m2=10/b";
        result = instance.buildUri(uriParams, queryParams);
        assertEquals(expResult, result);

        uriParams.put("t2m2",true);
        expResult = "http://127.0.0.1/a;t1m1=t1m1value;t1m2=10/b;t2m2";
        result = instance.buildUri(uriParams, queryParams);
        assertEquals(expResult, result);

        uriParams.put("t2m1","t2m1value");
        expResult = "http://127.0.0.1/a;t1m1=t1m1value;t1m2=10/b;t2m1=t2m1value;t2m2";
        result = instance.buildUri(uriParams, queryParams);
        assertEquals(expResult, result);

        uriParams.put("t1m1",null);
        uriParams.put("t1m2",null);
        uriParams.put("t2m1",null);
        expResult = "http://127.0.0.1/a/b;t2m2";
        result = instance.buildUri(uriParams, queryParams);
        assertEquals(expResult, result);

        queryParams.put("q1","v1");
        queryParams.put("q2", true);
        expResult = "http://127.0.0.1/a/b;t2m2?";
        result = instance.buildUri(uriParams, queryParams);
        assertTrue(result.startsWith(expResult));
        assertTrue(result.contains("q1=v1"));
        assertTrue(result.contains("q2=true"));
    }
    
}

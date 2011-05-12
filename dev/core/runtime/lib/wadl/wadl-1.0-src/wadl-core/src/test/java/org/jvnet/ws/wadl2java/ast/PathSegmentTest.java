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
 * PathSegmentTest.java
 * JUnit based test
 *
 * Created on August 7, 2006, 2:32 PM
 */

package org.jvnet.ws.wadl2java.ast;

import junit.framework.*;
import org.jvnet.ws.wadl.Param;
import org.jvnet.ws.wadl.ParamStyle;
import org.jvnet.ws.wadl.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

/**
 *
 * @author mh124079
 */
public class PathSegmentTest extends TestCase {
    
    public PathSegmentTest(String testName) {
        super(testName);
    }

    protected void setUp() throws Exception {
    }

    protected void tearDown() throws Exception {
    }

    /**
     * Test of getTemplateParameters method, of class org.jvnet.ws.wadl2java.PathSegment.
     */
    public void testGetTemplateParameters() {
        System.out.println("getTemplateParameters");
        
        Resource r = new Resource();
        r.setPath("fred/{param1}/bob/{param2}");
        Param p = new Param();
        p.setName("param1");
        p.setRequired(true);
        r.getParam().add(p);
        
        PathSegment instance = new PathSegment(r);
        List<Param> result = instance.getTemplateParameters();
        
        assertEquals(result.get(0).getName(), "param1");
        assertTrue(result.get(0).isRequired());
        assertEquals(result.get(1).getName(), "param2");
        assertFalse(result.get(1).isRequired());
    }
    
    public void testEvaluate() {
        System.out.println("evaluate");
        Resource r = new Resource();
        r.setPath("fred/{param1}/bob/{param2}");
        Param p = new Param();
        p.setName("param1");
        p.setRequired(true);
        r.getParam().add(p);
        p = new Param();
        p.setName("param3");
        p.setStyle(ParamStyle.MATRIX);
        r.getParam().add(p);
        p = new Param();
        p.setName("param4");
        p.setStyle(ParamStyle.MATRIX);
        r.getParam().add(p);
        p = new Param();
        p.setName("param5");
        p.setStyle(ParamStyle.MATRIX);
        r.getParam().add(p);
        
        PathSegment instance = new PathSegment(r);
        HashMap<String, Object> params = new HashMap<String, Object>();
        params.put("param1", "value1");
        params.put("param2", "value2");
        params.put("param3", "value3");
        params.put("param4", true);
        params.put("param5", false);
        String result = instance.evaluate(params);
        
        assertEquals(result, "fred/value1/bob/value2;param3=value3;param4");
        
        PathSegment instance2 = new PathSegment("fred/{xyzzy}/bob/");
        result = instance2.evaluate(null);
        assertEquals(result, "fred//bob/");
    }
    
}

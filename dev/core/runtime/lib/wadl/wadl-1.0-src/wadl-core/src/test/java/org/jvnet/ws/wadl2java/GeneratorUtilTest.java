/*
 * GeneratorUtilTest.java
 * JUnit based test
 *
 * Created on February 16, 2007, 10:02 AM
 */

package org.jvnet.ws.wadl2java;

import junit.framework.*;
import com.sun.codemodel.ClassType;
import com.sun.codemodel.JClass;
import com.sun.codemodel.JClassAlreadyExistsException;
import com.sun.codemodel.JCodeModel;
import com.sun.codemodel.JDefinedClass;
import com.sun.codemodel.JEnumConstant;
import com.sun.codemodel.JExpr;
import com.sun.codemodel.JFieldVar;
import com.sun.codemodel.JMethod;
import com.sun.codemodel.JMod;
import com.sun.codemodel.JVar;
import org.jvnet.ws.wadl.Option;
import org.jvnet.ws.wadl.Param;
import org.jvnet.ws.wadl2java.ast.ResourceNode;
import java.util.Arrays;
import java.util.HashSet;
import javax.xml.namespace.QName;

/**
 * @author mh124079
 */
public class GeneratorUtilTest extends TestCase {
    
    public GeneratorUtilTest(String testName) {
        super(testName);
    }

    protected void setUp() throws Exception {
    }

    protected void tearDown() throws Exception {
    }

    /**
     * Test of makeConstantName method, of class org.jvnet.ws.wadl2java.GeneratorUtil.
     */
    public void testMakeConstantName() {
        System.out.println("makeConstantName");
        
        assertEquals("FOO", GeneratorUtil.makeConstantName("foo"));
        assertEquals("FOO", GeneratorUtil.makeConstantName("FOO"));
        assertEquals("FOO", GeneratorUtil.makeConstantName("Foo"));
        assertEquals("FOO_BAR", GeneratorUtil.makeConstantName("foo bar"));
        assertEquals("CLASS", GeneratorUtil.makeConstantName("class"));
    }

    /**
     * Test of makeClassName method, of class org.jvnet.ws.wadl2java.GeneratorUtil.
     */
    public void testMakeClassName() {
        System.out.println("makeClassName");
        
        assertEquals("Foo", GeneratorUtil.makeClassName("foo"));
        assertEquals("FOO", GeneratorUtil.makeClassName("FOO"));
        assertEquals("Foo", GeneratorUtil.makeClassName("Foo"));
        assertEquals("FooBar", GeneratorUtil.makeClassName("foo bar"));
        assertEquals("Class", GeneratorUtil.makeClassName("class"));
    }        

    /**
     * Test of makeParamName method, of class org.jvnet.ws.wadl2java.GeneratorUtil.
     */
    public void testMakeParamName() {
        System.out.println("makeParamName");
        
        assertEquals("foo", GeneratorUtil.makeParamName("foo"));
        assertEquals("foo", GeneratorUtil.makeParamName("FOO"));
        assertEquals("foo", GeneratorUtil.makeParamName("Foo"));
        assertEquals("fooBar", GeneratorUtil.makeParamName("foo bar"));
        assertEquals("_class", GeneratorUtil.makeParamName("class"));
    }

}

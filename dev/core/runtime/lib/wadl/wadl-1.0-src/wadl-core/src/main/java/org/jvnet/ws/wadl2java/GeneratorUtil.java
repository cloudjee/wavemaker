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
 * GeneratorUtil.java
 *
 * Created on June 1, 2006, 5:42 PM
 */

package org.jvnet.ws.wadl2java;

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
 * Utility functions for code generators
 * @author mh124079
 */
public class GeneratorUtil {
    
    private static HashSet<String> keywords = new HashSet<String>(
        Arrays.asList("abstract", "assert", "boolean", 
        "break", "byte", "case", "catch", "char", "class", "const", "continue",
        "default", "do", "double", "else", "enum", "extends", "false", "final",
        "finally", "float", "for", "goto", "if", "implements", "import",
        "instanceof", "int", "interface", "long", "native", "new", "null", 
        "package", "private", "protected", "public", "return", "short", 
        "static", "strictfp", "super", "switch", "synchronized", "this", 
        "throw", "throws", "transient", "true", "try", "void", "volatile", 
        "while"));

    
    /**
     * Make a Java constant name for the supplied WADL parameter. Capitalizes all
     * chars and replaces illegal chars with '_'.
     * @param input the WADL parameter
     * @return a constant name
     */
    public static String makeConstantName(String input) {
        if (input==null || input.length()==0)
            input = "CONSTANT";
        char firstChar = input.charAt(0);
        if (firstChar>='0' && firstChar<='9') {
            input = "V_"+input;
        }
        input = input.replaceAll("\\W","_");
        input = input.toUpperCase();
        return input;
    }
    
    /**
     * Utility function for generating a suitable Java class name from an arbitrary
     * string. Replaces any characters not allowed in an class name with '_'.
     * @param input the string
     * @return a string suitable for use as a Java class name
     */
    public static String makeClassName(String input) {
        if (input==null || input.length()==0)
            return("Index");
        StringBuffer buf = new StringBuffer();
        for(String segment: input.split("[^a-zA-Z0-9]")) {
            if (segment.length()<1)
                continue;
            buf.append(segment.substring(0,1).toUpperCase());
            buf.append(segment.substring(1));
        }
        return buf.toString();
    }
    
    public static String makeParamName(String input) {
        if (input==null || input.length()==0)
            return("param");
        StringBuffer buf = new StringBuffer();
        boolean firstSegment = true;
        for(String segment: input.split("[^a-zA-Z0-9]")) {
            if (segment.length()<1)
                continue;
            if (firstSegment) {
                buf.append(segment.toLowerCase());
                firstSegment = false;
            } else {
                buf.append(segment.substring(0,1).toUpperCase());
                buf.append(segment.substring(1));
            }
        }
        String paramName = buf.toString();
        if (keywords.contains(paramName))
            return "_"+paramName;
        else
            return paramName;
    }
    
    /**
     * Maps WADL param types to their respective Java type. For params with
     * child option elements a Java enum is generated, otherwise an existing
     * Java class is used.
     * @param param the WADL parameter
     * @param model the JAXB codeModel instance to use if code generation is required
     * @param parentClass the class in which any generated enums will be placed
     * @param javaDoc a JavaDocUtil instance that will be used for generating
     * JavaDoc comments on any generated enum
     * @return the class of the corresponding Java type
     */
    public static JClass getJavaType(Param param, JCodeModel model, 
            JDefinedClass parentClass, JavaDocUtil javaDoc) {
        if (param.getOption().size() > 0) {
            JDefinedClass $enum;
            try {
                $enum = parentClass._package()._enum(makeClassName(param.getName()));
                javaDoc.generateEnumDoc(param, $enum);
                for (Option o: param.getOption()) {
                    JEnumConstant c = $enum.enumConstant(makeConstantName(o.getValue()));
                    c.arg(JExpr.lit(o.getValue()));
                    javaDoc.generateEnumConstantDoc(o, c);
                }
                JFieldVar $stringVal = $enum.field(JMod.PRIVATE, String.class, "stringVal");
                JMethod $ctor = $enum.constructor(JMod.PRIVATE);
                JVar $val = $ctor.param(String.class, "v");
                $ctor.body().assign($stringVal, $val);
                JMethod $toString = $enum.method(JMod.PUBLIC, String.class, "toString");
                $toString.body()._return($stringVal);
            } catch (JClassAlreadyExistsException ex) {
                $enum = ex.getExistingClass();
            }
            return $enum;
        } else {
            // map param type to existing Java class
            Class type = String.class;
            QName xmlType = param.getType();
            if (xmlType!=null && xmlType.getNamespaceURI().equals("http://www.w3.org/2001/XMLSchema")) {
                String localPart = xmlType.getLocalPart();
                if (localPart.equals("boolean"))
                    type = Boolean.class;
                else if (localPart.equals("integer"))
                    type = Integer.class;
                else if (localPart.equals("nonPositiveInteger"))
                    type = Integer.class;
                else if (localPart.equals("long"))
                    type = Long.class;
                else if (localPart.equals("nonNegativeInteger"))
                    type = Integer.class;
                else if (localPart.equals("negativeInteger"))
                    type = Integer.class;
                else if (localPart.equals("int"))
                    type = Integer.class;
                else if (localPart.equals("unsignedLong"))
                    type = Long.class;
                else if (localPart.equals("positiveInteger"))
                    type = Integer.class;
                else if (localPart.equals("unsignedInt"))
                    type = Integer.class;
                else if (localPart.equals("unsignedShort"))
                    type = Integer.class;
                else if (localPart.equals("unsignedByte"))
                    type = Byte.class;
                else if (localPart.equals("int"))
                    type = Integer.class;
                else if (localPart.equals("short"))
                    type = Integer.class;
                else if (localPart.equals("byte"))
                    type = Byte.class;
                else if (localPart.equals("float"))
                    type = Float.class;
                else if (localPart.equals("double"))
                    type = Double.class;
                else if (localPart.equals("decimal"))
                    type = Double.class;
                else if (localPart.equals("QName"))
                    type = QName.class;
            }
            return (JClass)model._ref(type);
        }
    }
}

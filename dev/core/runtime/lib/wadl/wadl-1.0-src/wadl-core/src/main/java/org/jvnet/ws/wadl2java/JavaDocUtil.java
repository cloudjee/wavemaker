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
 * JavaDocUtil.java
 *
 * Created on August 10, 2006, 3:12 PM
 *
 */

package org.jvnet.ws.wadl2java;

import com.sun.codemodel.JCommentPart;
import com.sun.codemodel.JDefinedClass;
import com.sun.codemodel.JDocComment;
import com.sun.codemodel.JEnumConstant;
import com.sun.codemodel.JMethod;
import org.jvnet.ws.wadl.Doc;
import org.jvnet.ws.wadl.Option;
import org.jvnet.ws.wadl.Param;
import org.jvnet.ws.wadl2java.ast.MethodNode;
import org.jvnet.ws.wadl2java.ast.RepresentationNode;
import org.jvnet.ws.wadl2java.ast.ResourceNode;
import org.jvnet.ws.wadl2java.ast.ResourceTypeNode;
import java.io.IOException;
import org.w3c.dom.Element;
import com.sun.org.apache.xml.internal.serialize.OutputFormat;
import com.sun.org.apache.xml.internal.serialize.XMLSerializer;
import org.jvnet.ws.wadl.Application;
import java.io.StringWriter;
import org.w3c.dom.Attr;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;

/**
 * Utility class containing methods for generating JavaDoc from XML documentation
 * embedded in WADL files.
 * @author mh124079
 */
public class JavaDocUtil {
    
    /**
     * Create a new JavaDocUtil instance
     */
    public JavaDocUtil() {
    }
    
    /**
     * Copy attributes and content of one element to another. Namespace decls
     * are stripped rendering all elements and attributes in the default
     * namespace.
     * @param source the element to copy from
     * @param sink the element to copy to
     */
    protected void copyElementContent(Element source, Element sink) {
        // copy attributes
        NamedNodeMap sourceAttributes = source.getAttributes();
        for (int i=0;i<sourceAttributes.getLength();i++) {
            Attr a = (Attr)sourceAttributes.item(i);
            if (a.getName().startsWith("xmlns"))
                continue; // remove ns decls
            if (a.getLocalName() == null)
                sink.setAttribute(a.getName(), a.getValue());
            else
                sink.setAttribute(a.getLocalName(), a.getValue());
        }

        // recursively copy child nodes
        NodeList children = source.getChildNodes();
        for (int i=0;i<children.getLength();i++) {
            Node child = children.item(i);
            Node newNode = null;
            switch (child.getNodeType()) {
                case Node.ELEMENT_NODE:
                    Element childElem = (Element)child;
                    if (childElem.getLocalName() != null) {
                        newNode = source.getOwnerDocument().createElement(
                                childElem.getLocalName());
                    } else {
                        newNode = source.getOwnerDocument().createElement(
                                child.getNodeName());
                    }
                    copyElementContent(childElem, (Element)newNode);
                    break;
                case Node.TEXT_NODE:
                    newNode = source.getOwnerDocument().createTextNode(
                            child.getNodeValue());
                    break;
                default:
                    break;
            }
            sink.appendChild(newNode);
        }
    }
    
    /**
     * Create tagged Javadoc from an XML element. XML namespace declarations,
     * comments and processing instructions are stripped.
     * @param e the XML element
     * @return the extracted tagged javadoc
     */
    protected String createTaggedJavaDoc(Element e) {
        Element normalizedDoc;
        if (e.getLocalName() != null)
            normalizedDoc = e.getOwnerDocument().createElement(e.getLocalName());
        else
            normalizedDoc = e.getOwnerDocument().createElement(e.getTagName());
        copyElementContent(e, normalizedDoc);
        
        StringWriter sw = new StringWriter();
        OutputFormat of = new OutputFormat("html", null, false);
        of.setOmitXMLDeclaration(true);
        XMLSerializer xs = new XMLSerializer(sw, of);
        try {
            xs.serialize(normalizedDoc);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return sw.toString();
    }
    
    /**
     * Append text extracted from a WADL doc element to the JavaDoc code model
     * @param d the WADL doc element
     * @param jdoc the code model element to which the content shoudl be appended
     */
    protected void appendTextContent(Doc d, JCommentPart jdoc) {
        if (d.getTitle() != null) {
            jdoc.append(d.getTitle());
            if (!d.getTitle().endsWith("."))
                jdoc.append(".");
        }
        for (Object o: d.getContent()) {
            if (o instanceof String)
                jdoc.append(o);
            else if (o instanceof Element) {
                Element e = (Element)o;
                jdoc.append(createTaggedJavaDoc(e));
            }
        }        
    }
    
    /**
     * Extract documentation from a WADL resource and add it to a corresponding 
     * generated class.
     * @param r the WADL resource
     * @param c the corresponding class
     */
    public void generateClassDoc(ResourceNode r, JDefinedClass c) {
        if (r.getDoc().size() < 1)
            return;
        Doc d = r.getDoc().get(0);
        JDocComment jdoc = c.javadoc();
        appendTextContent(d, jdoc);
    }
    
    /**
     * Extract documentation from a WADL resource type and add it to a corresponding 
     * generated interface.
     * @param n the WADL resource type
     * @param iface the corresponding interface
     */
    void generateClassDoc(ResourceTypeNode n, JDefinedClass iface) {
        if (n.getDoc().size() < 1)
            return;
        Doc d = n.getDoc().get(0);
        JDocComment jdoc = iface.javadoc();
        appendTextContent(d, jdoc);
    }

    /**
     * Extract documentation from a WADL method and add it to the corresponding
     * generated Java method
     * @param m the WADL method
     * @param jm the corresponding Java method
     */
    public void generateMethodDoc(MethodNode m, JMethod jm) {
        if (m.getDoc().size() < 1)
            return;
        Doc d = m.getDoc().get(0);
        JDocComment jdoc = jm.javadoc();
        appendTextContent(d, jdoc);
    }
    
    /**
     * Extract documentation from a WADL param with enumerated values and add it to the corresponding
     * Java enum
     * @param p the WADL param
     * @param e the corresponding enum
     */
    public void generateEnumDoc(Param p, JDefinedClass e) {
        if (p.getDoc().size() < 1)
            return;
        Doc d = p.getDoc().get(0);
        JDocComment jdoc = e.javadoc();
        appendTextContent(d, jdoc);
    }

    /**
     * Extract documentation from a WADL param and add it to the corresponding
     * Java method
     * @param p the WADL param
     * @param jm the corresponding method
     */
    public void generateParamDoc(Param p, JMethod jm) {
        if (p.getDoc().size() < 1)
            return;
        Doc d = p.getDoc().get(0);
        JDocComment jdoc = jm.javadoc();
        JCommentPart jp = jdoc.addParam(GeneratorUtil.makeParamName(p.getName()));
        appendTextContent(d, jp);
    }

    /**
     * Extract documentation from a WADL representation and add it to the 
     * corresponding Java method parameter.
     * @param r the WADL representation
     * @param jm the corresponding Java method
     */
    public void generateParamDoc(RepresentationNode r, JMethod jm) {
        if (r.getDoc().size() < 1)
            return;
        Doc d = r.getDoc().get(0);
        JDocComment jdoc = jm.javadoc();
        JCommentPart jp = jdoc.addParam("input");
        appendTextContent(d, jp);
    }

    /**
     * Extract documentation from a WADL param and add it to the 
     * corresponding Java method return.
     * @param p the parameter to extract documentation from
     * @param jm the corresponding Java method
     */
    public void generateReturnDoc(Param p, JMethod jm) {
        if (p.getDoc().size() < 1)
            return;
        Doc d = p.getDoc().get(0);
        JDocComment jdoc = jm.javadoc();
        JCommentPart jp = jdoc.addReturn();
        appendTextContent(d, jp);
    }

    /**
     * Extract documentation from a WADL representation and add it to the 
     * corresponding Java method return.
     * @param r the WADL representation
     * @param jm the corresponding Java method
     */
    public void generateReturnDoc(RepresentationNode r, JMethod jm) {
        if (r.getDoc().size() < 1)
            return;
        Doc d = r.getDoc().get(0);
        JDocComment jdoc = jm.javadoc();
        JCommentPart jp = jdoc.addReturn();
        appendTextContent(d, jp);
    }

    /**
     * Extract documentation from a WADL option and add it to the 
     * corresponding Java enum constant.
     * @param o the WADL option
     * @param c the corresponding Java enum constant
     */
    void generateEnumConstantDoc(Option o, JEnumConstant c) {
        if (o.getDoc().size() < 1)
            return;
        Doc d = o.getDoc().get(0);
        JDocComment jdoc = c.javadoc();
        appendTextContent(d, jdoc);
    }

}

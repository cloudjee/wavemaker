/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.common.util;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;

import org.apache.commons.lang.StringEscapeUtils;

/**
 * API for writing XML.
 * 
 * @author Simon Toens
 */
public class XMLWriter {

    private final static String sep = "\n";

    private final static int DEFAULT_INDENT = 2;

    private final static int DEFAULT_MAX_ATTRS_ON_SAME_LINE = 2;

    private int startIndent = 0;

    private final String encoding = "utf-8";

    private String currentShortNS = null;

    private boolean wroteFirstElement = false;

    private boolean hasElements = false;

    private boolean incompleteOpenTag = false;

    private boolean hasAttributes = false;

    private final SortedMap<String, String> namespaces = new TreeMap<String, String>();

    // decides if we write closing element on same line as opening element
    // or on new line. this applies for both </foo> and .../>
    private boolean closeOnNewLine = false;

    private final Stack elementStack = new Stack();

    private final PrintWriter pw;

    // configurable at construction time
    private final int indent;

    private final int maxAttrsOnSameLine;

    // configurable with setter method
    // <foo>a</foo>
    // vs.
    // <foo>
    // a
    // </foo>
    private boolean textOnSameLineAsParentElement = true;

    public XMLWriter(PrintWriter pw) {
        this(pw, DEFAULT_INDENT);
    }

    public XMLWriter(PrintWriter pw, int indent) {
        this(pw, indent, DEFAULT_MAX_ATTRS_ON_SAME_LINE);
    }

    public XMLWriter(PrintWriter pw, int indent, int maxAttrsOnSameLine) {
        this.indent = indent;
        this.maxAttrsOnSameLine = maxAttrsOnSameLine;
        this.pw = pw;
    }

    /**
     * Calls flush on underlying PrintWriter.
     */
    public void flush() {
        this.pw.flush();
    }

    /**
     * Writes DOCTYPE, publicID, privateID. Can only be called before adding any elements.
     * 
     * @param publicID
     * @param privateID
     */
    public void addDoctype(String doctypeName, String publicID, String systemID) {
        if (this.hasElements) {
            throw new MalformedXMLRuntimeException("Cannot init document after elements have been added");
        }

        StringBuilder dtdString = new StringBuilder();

        dtdString.append("<!DOCTYPE ").append(doctypeName);
        if (publicID != null) {
            dtdString.append(" PUBLIC \"").append(publicID).append("\"");
        }

        if (systemID != null) {
            if (publicID == null) {
                dtdString.append(" SYSTEM");
            }
        }
        dtdString.append(" \"").append(systemID).append("\"");

        dtdString.append(">").append(sep);

        writeGeneric(dtdString.toString());
    }

    /**
     * Add version. Can only be called before adding any elements.
     */
    public void addVersion() {
        addVersion(false);
    }

    public void addVersion(boolean standalone) {
        if (this.hasElements) {
            throw new MalformedXMLRuntimeException("Cannot write version after elements have been added");
        }

        this.pw.print("<?xml version=\"1.0\" encoding=\"" + this.encoding + "\"");
        if (standalone) {
            this.pw.print(" standalone=\"yes\"");
        }
        this.pw.print("?>");
        this.pw.print(sep);
    }

    public void setCurrentShortNS(String s) {
        if (!this.namespaces.containsKey(s)) {
            throw new MalformedXMLRuntimeException("Short NS \"" + s + "\" has not been declared.  Known short NS: " + this.namespaces.keySet());
        }
        this.currentShortNS = s;
    }

    public void unsetCurrentShortNS() {
        this.currentShortNS = null;
    }

    /**
     * The current element will be closed on a new line, and attributes added will each be on a new line.
     */
    public void forceCloseOnNewLine() {
        this.closeOnNewLine = true;
    }

    public boolean willCloseOnNewLine() {
        return this.closeOnNewLine;
    }

    public void setStartIndent(int startIndent) {
        this.startIndent = startIndent;
    }

    /**
     * Switches the behavior for addElementWithTextChild. <foo>a</foo> vs. <foo><br>
     * a<br>
     * </foo>
     */
    public void setTextOnSameLineAsParentElement(boolean b) {
        this.textOnSameLineAsParentElement = b;
    }

    public void addNamespace(String shortNS, String longNS) {
        this.namespaces.put(shortNS, longNS);
    }

    public void addComment(String comment) {
        StringBuilder sb = new StringBuilder();

        if (this.hasElements) {
            finishIncompleteTag();
            sb.append(sep);
        }

        sb.append(getIndent()).append("<!-- ").append(comment).append(" -->");

        if (!this.hasElements) {
            sb.append(sep);
        }
        writeGeneric(sb.toString());
    }

    /**
     * Adds attribute (name and value) to current XML element.
     */
    public void addAttribute(String name, String value) {
        if (!this.incompleteOpenTag) {
            throw new MalformedXMLRuntimeException("Illegal call to addAttribute");
        }

        this.hasAttributes = true;
        if (this.closeOnNewLine) {
            this.pw.print(sep);
            this.pw.print(getIndent());
        } else {
            this.pw.print(" ");
        }

        this.pw.print(name);
        this.pw.print("=\"");
        this.pw.print(value);
        this.pw.print("\"");
    }

    /**
     * Adds attributes to current XML element, represented as Map. Uses the keys as atttribute names and corresponding
     * elements as attribute values. Calls String.valueOf(...) on keys and values.
     */
    public void addAttribute(Map attributes) {
        String[] attributesArray = new String[attributes.size() * 2];
        int index = 0;
        for (Iterator iter = attributes.entrySet().iterator(); iter.hasNext();) {
            Map.Entry entry = (Map.Entry) iter.next();
            attributesArray[index] = (String) entry.getKey();
            attributesArray[index + 1] = (String) entry.getValue();
            index += 2;
        }
        addAttribute(attributesArray);
    }

    /**
     * Adds attributes to current XML element. Attribute names and values are passed in as String Array, using the
     * following format: {n1, v1, n2, v2, n3, v3, ...}
     */
    public void addAttribute(String... attributes) {
        // if no attributes yet for this element, we can decided
        // on the formatting (all attributes on same line or not)
        if (!this.hasAttributes && attributes.length / 2 > this.maxAttrsOnSameLine) {
            this.closeOnNewLine = true;
        }

        for (int i = 0; i < attributes.length; i += 2) {
            String key = attributes[i];
            String value = attributes[i + 1];
            addAttribute(key, value);
        }
    }

    /**
     * Adds nested closed elements.
     */
    public void addNestedElements(String... elementNames) {
        for (int i = 0; i < elementNames.length; i++) {
            addElement(elementNames[i]);
        }
    }

    /**
     * Adds many closed elements.
     */
    public void addClosedElements(String... elementNames) {
        for (int i = 0; i < elementNames.length; i++) {
            addClosedElement(elementNames[i]);
        }
    }

    /**
     * Adds a single closed element.
     */
    public void addClosedElement(String elementName) {
        addElement(elementName);
        closeElement();
    }

    /**
     * Adds a closed element with attributes
     */
    public void addClosedElement(String elementName, String... attributes) {
        addElement(elementName, attributes);
        closeElement();
    }

    /**
     * Writes a new XML element to PrintWriter. If another XML element has been written and not closed, writes this
     * element as a child.
     */
    public void addElement(String elementName) {
        this.hasElements = true;
        finishIncompleteTag();

        boolean addNamespaces = !this.wroteFirstElement;

        if (this.wroteFirstElement) {
            this.pw.print(sep);
        } else {
            this.wroteFirstElement = true;
        }

        this.pw.print(getIndent());
        this.pw.print("<");

        if (this.currentShortNS != null) {
            elementName = qualify(elementName, this.currentShortNS);
        }

        this.pw.print(elementName);

        this.elementStack.push(elementName);
        this.incompleteOpenTag = true;
        this.hasAttributes = false;
        this.closeOnNewLine = false;

        if (addNamespaces && !this.namespaces.isEmpty()) {
            // prepend short NS with "xmlns:", then add as attributes
            String[] ns = new String[this.namespaces.size() * 2];
            int i = 0;
            for (Map.Entry<String, String> e : this.namespaces.entrySet()) {
                ns[i] = qualify(e.getKey(), "xmlns");
                ns[i + 1] = e.getValue();
                i += 2;
            }
            // for short->long ns mappings, put each attr on a new line
            this.closeOnNewLine = true;
            addAttribute(ns);
        }
    }

    /**
     * Convenience method for passing parent and child text element. The result is<br>
     * &ltelementName&gttextChild&lt/elementName&gt<br>
     * if setTextOnSameLineAsParentElement is set to true on this instance of XMLWriter.<br>
     * 
     * Otherwise the result is:<br>
     * &ltelementName&gt<br>
     * textChild<br>
     * &lt/elementName&gt
     */
    public void addElement(String elementName, String textChild) {
        addElement(elementName);
        addText(textChild, !this.textOnSameLineAsParentElement);
        closeElement(!this.textOnSameLineAsParentElement);
    }

    /**
     * Writes a new XML element to PrintWriter. If another XML element has been written and not closed, writes this
     * element as a child. Also adds passed attributes.
     */
    public void addElement(String elementName, String... attributes) {
        addElement(elementName);
        addAttribute(attributes);
    }

    /**
     * Writes a new, closed, XML element to PrintWriter. If another XML element has been written and not closed, writes
     * this element as a child. Adds passed attributes and character data.
     */
    public void addClosedTextElement(String elementName, String text, String... attributes) {
        addElement(elementName);
        addAttribute(attributes);
        addText(text, false);
        closeElement(false);
    }

    /**
     * Writes a new XML element to PrintWriter. If another XML element has been written and not closed, writes this
     * element as a child. Also adds passed attributes.
     */
    public void addElement(String elementName, Map<String, String> attributes) {
        addElement(elementName);
        addAttribute(attributes);
    }

    /**
     * Closes the last XML element that has been written.
     */
    public void closeElement() {
        closeElement(true);
    }

    public void closeElement(boolean elementOnNewLine) {
        if (this.elementStack.isEmpty()) {
            throw new MalformedXMLRuntimeException("Illegal call to closeElement");
        }

        String element = this.elementStack.pop();

        if (this.incompleteOpenTag) {
            if (this.closeOnNewLine) {
                this.pw.print(sep);
                this.pw.print(getIndent());
            }
            this.pw.print("/>");
            this.incompleteOpenTag = false;
        } else {
            if (elementOnNewLine) {
                this.pw.print(sep);
                this.pw.print(getIndent());
            }
            this.pw.print("</");
            this.pw.print(element);
            this.pw.print(">");
        }

        this.hasAttributes = false;
    }

    /**
     * Writes Text as child element to the current element.
     */
    public void addText(String in) {
        addText(in, true);
    }

    public void addText(String in, boolean onNewLine) {
        if (in.trim().length() == 0) {
            return;
        }

        finishIncompleteTag();
        if (onNewLine) {
            this.pw.print(sep);
            this.pw.print(getIndent());
        }
        this.pw.print(StringEscapeUtils.escapeXml(in.trim()));
    }

    public void addCDATA(String in) {
        if (in.trim().length() == 0) {
            return;
        }
        finishIncompleteTag();
        StringBuilder sb = new StringBuilder();
        sb.append(sep).append(getIndent()).append("<![CDATA[");

        String data = in.trim();

        // indentation
        for (String token : data.split(sep)) {
            sb.append(sep).append(getIndent()).append(getDefaultIndent()).append(token.trim());
        }

        sb.append(sep).append(getIndent()).append("]]>");
        writeGeneric(sb.toString());
    }

    /**
     * Closes all XML elements that have been added, and not yet closed, and flushes the underlying PrintWriter.
     */
    public void finish() {
        closeAll();
        this.pw.flush();
    }

    /**
     * @return The current indentation
     */
    public String getIndent() {
        return getIndent(getStackSize());
    }

    public String getLineSep() {
        return sep;
    }

    private void closeAll() {
        while (!this.elementStack.isEmpty()) {
            closeElement();
        }
    }

    private void finishIncompleteTag() {
        if (this.incompleteOpenTag) {
            this.pw.print(">");
            this.incompleteOpenTag = false;
        }
    }

    private void writeGeneric(String in) {
        this.pw.print(in);
    }

    private String getIndent(int numUnits) {
        StringBuilder indentString = new StringBuilder();
        int max = this.startIndent + numUnits * this.indent;
        for (int i = 0; i < max; i++) {
            indentString.append(" ");
        }
        return indentString.toString();
    }

    private String getDefaultIndent() {
        return getIndent(1);
    }

    private int getStackSize() {
        return this.elementStack.size();
    }

    private String qualify(String name, String ns) {
        return ns + ":" + name;
    }

    private class MalformedXMLRuntimeException extends RuntimeException {

        private static final long serialVersionUID = 1L;

        private MalformedXMLRuntimeException(String message) {
            super(message);
        }
    }

    private class Stack extends ArrayList<String> {

        private static final long serialVersionUID = 1L;

        public void push(String s) {
            super.add(0, s);
        }

        public String pop() {
            return super.remove(0);
        }
    }
}

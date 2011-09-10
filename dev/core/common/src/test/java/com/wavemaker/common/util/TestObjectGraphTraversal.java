/*
 *  Copyright (C) 2007-2009 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.common.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.wavemaker.common.util.ObjectGraphTraversal;
import com.wavemaker.common.util.ObjectGraphTraversal.Context;
import com.wavemaker.infra.WMTestCase;

/**
 * @author Simon Toens
 * @version $Rev:22672 $ - $Date:2008-05-30 14:37:26 -0700 (Fri, 30 May 2008) $
 * 
 */
public class TestObjectGraphTraversal extends WMTestCase implements
        ObjectGraphTraversal.ObjectVisitor,
        ObjectGraphTraversal.PropertyFactory {

    private static final String ROOT_CTX_VALUE = "root-ctx";

    private ObjectGraphTraversal tr;

    private List<Node> expectedNodes;

    private List<Node> expectedParentNodes;;

    private List<String> expectedProperties;

    private Map<Node, String> ctxValues;

    private Map<Node, String> expectedCtxValues;

    private List<String> propertyNames;
    
    class Node {
        String name;
        Node next;

        List<Node> moreNodes = new ArrayList<Node>();
        
        Map<String, Node> evenMoreNodes = new HashMap<String, Node>();

        Node(String name) {
            this.name = name;
        }

        public Node getNext() {
            return next;
        }

        public List<Node> getChildren() {
            return moreNodes;
        }
        
        public Map<String, Node> getChildrenMap() {
            return evenMoreNodes;
        }

        public String toString() {
            return name;
        }

    }

    public void setUp() {
        
        expectedNodes = new ArrayList<Node>();
        expectedProperties = new ArrayList<String>();
        expectedParentNodes = new ArrayList<Node>();

        propertyNames = new ArrayList<String>();

        expectedCtxValues = new HashMap<Node, String>();
        ctxValues = new HashMap<Node, String>();
    }

    public void testSimple() {
        
        tr = new ObjectGraphTraversal(this, this);
        tr.setBeanProperties(false);        

        propertyNames.add("getNext");

        Node n1 = new Node("root");
        Node n2 = new Node("child1");
        Node n3 = new Node("child2");

        ctxValues.put(n1, ROOT_CTX_VALUE);
        ctxValues.put(n2, "node 2!");
        ctxValues.put(n3, "node 3!");

        n2.next = n3;
        n1.next = n2;
        
        expectedNodes.add(0, n3);
        expectedParentNodes.add(0, n2);
        expectedProperties.add(0, "[getNext, getNext]");
        expectedCtxValues.put(n3, null);

        expectedNodes.add(0, n2);
        expectedParentNodes.add(0, n1);
        expectedProperties.add(0, "[getNext]");
        expectedCtxValues.put(n2, null);

        tr.traverse(n1, ROOT_CTX_VALUE);
    }
    
    public void testSimpleRecursion1() {
        
        tr = new ObjectGraphTraversal(this);
        tr.setBeanProperties(false);        

        propertyNames.add("getNext");

        Node n1 = new Node("root");
        Node n2 = new Node("child1");
        Node n3 = new Node("child2");

        ctxValues.put(n1, ROOT_CTX_VALUE);
        ctxValues.put(n2, "node 2!");
        ctxValues.put(n3, "node 3!");

        n3.next = n1;
        n2.next = n3;
        n1.next = n2;
        
        expectedNodes.add(0, n3);
        expectedParentNodes.add(0, n2);
        expectedProperties.add(0, "[getNext, getNext]");
        expectedCtxValues.put(n3, null);

        expectedNodes.add(0, n2);
        expectedParentNodes.add(0, n1);
        expectedProperties.add(0, "[getNext]");
        expectedCtxValues.put(n2, null);

        tr.traverse(n1, ROOT_CTX_VALUE);
    }
    
    public void testSimpleRecursion2() {
        
        tr = new ObjectGraphTraversal(this);
        tr.setBeanProperties(false);        

        propertyNames.add("getNext");

        Node n1 = new Node("root");

        ctxValues.put(n1, ROOT_CTX_VALUE);

        n1.next = n1;
        
        expectedNodes.add(0, n1);
        expectedProperties.add(0, "[getNext]");
        expectedCtxValues.put(n1, null);

        tr.traverse(n1, ROOT_CTX_VALUE);
    }    
    

    public void testCollectionAsChildren() {
        
        tr = new ObjectGraphTraversal(this, this);
        tr.setBeanProperties(false);        

        propertyNames.add("getChildren");

        Node n1 = new Node("root");
        Node n2 = new Node("child1");

        // these are all children of n2
        Node n3 = new Node("child1-1");
        Node n4 = new Node("child1-2");
        Node n5 = new Node("child1-3");

        n2.moreNodes.add(n3);
        n2.moreNodes.add(n4);
        n2.moreNodes.add(n5);
        
        ctxValues.put(n1, ROOT_CTX_VALUE);
        ctxValues.put(n2, "n2");
        ctxValues.put(n3, "n3");
        ctxValues.put(n4, "n4");
        ctxValues.put(n4, "n5");        

        expectedNodes.add(0, n5);
        expectedParentNodes.add(0, n2);
        expectedProperties.add(0, "[getChildren]");
        expectedCtxValues.put(n5, null);        
        
        expectedNodes.add(0, n4);
        expectedParentNodes.add(0, n2);
        expectedProperties.add(0, "[getChildren]");
        expectedCtxValues.put(n5, null);        
        
        expectedNodes.add(0, n3);
        expectedParentNodes.add(0, n2);        
        expectedProperties.add(0, "[getChildren]");
        expectedCtxValues.put(n5, null);        
        
        expectedNodes.add(0, n2);
        expectedParentNodes.add(0, n1);        
        expectedProperties.add(0, "[getChildren]");
        expectedCtxValues.put(n5, null);        

        tr.traverse(n1, ROOT_CTX_VALUE);
    }
    
    public void testMapAsChildren() {
        
        tr = new ObjectGraphTraversal(this, this);
        tr.setBeanProperties(false);        

        propertyNames.add("getChildrenMap");

        Node n1 = new Node("root");
        Node n2 = new Node("child1");

        // these are all children of n2
        Node n3 = new Node("child1-1");
        Node n4 = new Node("child1-2");
        Node n5 = new Node("child1-3");

        n2.evenMoreNodes.put("n3", n3);
        n2.evenMoreNodes.put("n4", n4);
        n2.evenMoreNodes.put("n5", n5);        
        
        ctxValues.put(n1, ROOT_CTX_VALUE);
        ctxValues.put(n2, "n2");
        ctxValues.put(n3, "n3");
        ctxValues.put(n4, "n4");
        ctxValues.put(n4, "n5");        

        expectedNodes.add(0, n5);
        expectedParentNodes.add(0, n2);
        expectedProperties.add(0, "[getChildrenMap]");
        expectedCtxValues.put(n5, null);        
        
        expectedNodes.add(0, n4);
        expectedParentNodes.add(0, n2);
        expectedProperties.add(0, "[getChildrenMap]");
        expectedCtxValues.put(n5, null);        
        
        expectedNodes.add(0, n3);
        expectedParentNodes.add(0, n2);        
        expectedProperties.add(0, "[getChildrenMap]");
        expectedCtxValues.put(n5, null);        
        
        expectedNodes.add(0, n2);
        expectedParentNodes.add(0, n1);        
        expectedProperties.add(0, "[getChildrenMap]");
        expectedCtxValues.put(n5, null);        

        tr.traverse(n1, ROOT_CTX_VALUE);
    }    
    
    public void cycle(Object o, Context ctx) {
        
    }

    public void visit(Object o, ObjectGraphTraversal.Context ctx) {
        Node n = (Node) o;
        Node expectedNode = expectedNodes.remove(0);

        if (n != expectedNode) {
            throw new AssertionError("Unexpected node - expected "
                    + expectedNode + " but got " + n);
        }

        String expectedProps = expectedProperties.remove(0).toString();
        if (!ctx.getProperties().toString().equals(expectedProps)) {
            throw new AssertionError("Unexpected property chain for node " + n
                    + ": expected " + expectedProps + " but got "
                    + ctx.getProperties().toString());
        }

        Node expectedParentNode = expectedParentNodes.remove(0);
        if (ctx.getParents().get(0) != expectedParentNode) {
            throw new AssertionError("Unexpected parent for node " + n
                    + ": expected " + expectedParentNode + " but got "
                    + ctx.getParents().get(0));
        }

        // check this ctx value
        String expectedCtxValue = String.valueOf(expectedCtxValues.get(n));
        if (!String.valueOf(ctx.getValues().get(0)).equals(expectedCtxValue)) {
            throw new AssertionError("For node " + n
                    + " expected parent ctx value to be " + expectedCtxValue
                    + ", instead got " + ctx.getValues().get(0));
        }

        // check parent ctx value
        String parentCtxValue = ctxValues.get(expectedParentNode);
        if (!ctx.getValues().get(1).equals(parentCtxValue)) {
            throw new AssertionError("For node " + n
                    + " expected parent ctx value to be " + parentCtxValue
                    + ", instead got " + ctx.getValues().get(1));
        }

        // check root ctx value
        int i = ctx.getValues().size() - 1;
        if (!ctx.getValues().get(i).equals(ROOT_CTX_VALUE)) {
            throw new AssertionError("Expected root ctxt value to 'root-ctx' "
                    + "instead got " + ctx.getValues().get(i));
        }

        ctx.getValues().add(0, ctxValues.get(n));
    }

    public List<String> getProperties(Object o, Context ctx) {
        return propertyNames;
    }

}

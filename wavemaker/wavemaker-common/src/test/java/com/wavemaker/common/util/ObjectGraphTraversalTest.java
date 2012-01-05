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

import com.wavemaker.common.util.ObjectGraphTraversal.Context;
import com.wavemaker.infra.WMTestCase;

/**
 * @author Simon Toens
 */
public class ObjectGraphTraversalTest extends WMTestCase implements ObjectGraphTraversal.ObjectVisitor, ObjectGraphTraversal.PropertyFactory {

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
            return this.next;
        }

        public List<Node> getChildren() {
            return this.moreNodes;
        }

        public Map<String, Node> getChildrenMap() {
            return this.evenMoreNodes;
        }

        @Override
        public String toString() {
            return this.name;
        }

    }

    @Override
    public void setUp() {

        this.expectedNodes = new ArrayList<Node>();
        this.expectedProperties = new ArrayList<String>();
        this.expectedParentNodes = new ArrayList<Node>();

        this.propertyNames = new ArrayList<String>();

        this.expectedCtxValues = new HashMap<Node, String>();
        this.ctxValues = new HashMap<Node, String>();
    }

    public void testSimple() {

        this.tr = new ObjectGraphTraversal(this, this);
        this.tr.setBeanProperties(false);

        this.propertyNames.add("getNext");

        Node n1 = new Node("root");
        Node n2 = new Node("child1");
        Node n3 = new Node("child2");

        this.ctxValues.put(n1, ROOT_CTX_VALUE);
        this.ctxValues.put(n2, "node 2!");
        this.ctxValues.put(n3, "node 3!");

        n2.next = n3;
        n1.next = n2;

        this.expectedNodes.add(0, n3);
        this.expectedParentNodes.add(0, n2);
        this.expectedProperties.add(0, "[getNext, getNext]");
        this.expectedCtxValues.put(n3, null);

        this.expectedNodes.add(0, n2);
        this.expectedParentNodes.add(0, n1);
        this.expectedProperties.add(0, "[getNext]");
        this.expectedCtxValues.put(n2, null);

        this.tr.traverse(n1, ROOT_CTX_VALUE);
    }

    public void testSimpleRecursion1() {

        this.tr = new ObjectGraphTraversal(this);
        this.tr.setBeanProperties(false);

        this.propertyNames.add("getNext");

        Node n1 = new Node("root");
        Node n2 = new Node("child1");
        Node n3 = new Node("child2");

        this.ctxValues.put(n1, ROOT_CTX_VALUE);
        this.ctxValues.put(n2, "node 2!");
        this.ctxValues.put(n3, "node 3!");

        n3.next = n1;
        n2.next = n3;
        n1.next = n2;

        this.expectedNodes.add(0, n3);
        this.expectedParentNodes.add(0, n2);
        this.expectedProperties.add(0, "[getNext, getNext]");
        this.expectedCtxValues.put(n3, null);

        this.expectedNodes.add(0, n2);
        this.expectedParentNodes.add(0, n1);
        this.expectedProperties.add(0, "[getNext]");
        this.expectedCtxValues.put(n2, null);

        this.tr.traverse(n1, ROOT_CTX_VALUE);
    }

    public void testSimpleRecursion2() {

        this.tr = new ObjectGraphTraversal(this);
        this.tr.setBeanProperties(false);

        this.propertyNames.add("getNext");

        Node n1 = new Node("root");

        this.ctxValues.put(n1, ROOT_CTX_VALUE);

        n1.next = n1;

        this.expectedNodes.add(0, n1);
        this.expectedProperties.add(0, "[getNext]");
        this.expectedCtxValues.put(n1, null);

        this.tr.traverse(n1, ROOT_CTX_VALUE);
    }

    public void testCollectionAsChildren() {

        this.tr = new ObjectGraphTraversal(this, this);
        this.tr.setBeanProperties(false);

        this.propertyNames.add("getChildren");

        Node n1 = new Node("root");
        Node n2 = new Node("child1");

        // these are all children of n2
        Node n3 = new Node("child1-1");
        Node n4 = new Node("child1-2");
        Node n5 = new Node("child1-3");

        n2.moreNodes.add(n3);
        n2.moreNodes.add(n4);
        n2.moreNodes.add(n5);

        this.ctxValues.put(n1, ROOT_CTX_VALUE);
        this.ctxValues.put(n2, "n2");
        this.ctxValues.put(n3, "n3");
        this.ctxValues.put(n4, "n4");
        this.ctxValues.put(n4, "n5");

        this.expectedNodes.add(0, n5);
        this.expectedParentNodes.add(0, n2);
        this.expectedProperties.add(0, "[getChildren]");
        this.expectedCtxValues.put(n5, null);

        this.expectedNodes.add(0, n4);
        this.expectedParentNodes.add(0, n2);
        this.expectedProperties.add(0, "[getChildren]");
        this.expectedCtxValues.put(n5, null);

        this.expectedNodes.add(0, n3);
        this.expectedParentNodes.add(0, n2);
        this.expectedProperties.add(0, "[getChildren]");
        this.expectedCtxValues.put(n5, null);

        this.expectedNodes.add(0, n2);
        this.expectedParentNodes.add(0, n1);
        this.expectedProperties.add(0, "[getChildren]");
        this.expectedCtxValues.put(n5, null);

        this.tr.traverse(n1, ROOT_CTX_VALUE);
    }

    public void testMapAsChildren() {

        this.tr = new ObjectGraphTraversal(this, this);
        this.tr.setBeanProperties(false);

        this.propertyNames.add("getChildrenMap");

        Node n1 = new Node("root");
        Node n2 = new Node("child1");

        // these are all children of n2
        Node n3 = new Node("child1-1");
        Node n4 = new Node("child1-2");
        Node n5 = new Node("child1-3");

        n2.evenMoreNodes.put("n3", n3);
        n2.evenMoreNodes.put("n4", n4);
        n2.evenMoreNodes.put("n5", n5);

        this.ctxValues.put(n1, ROOT_CTX_VALUE);
        this.ctxValues.put(n2, "n2");
        this.ctxValues.put(n3, "n3");
        this.ctxValues.put(n4, "n4");
        this.ctxValues.put(n4, "n5");

        this.expectedNodes.add(0, n5);
        this.expectedParentNodes.add(0, n2);
        this.expectedProperties.add(0, "[getChildrenMap]");
        this.expectedCtxValues.put(n5, null);

        this.expectedNodes.add(0, n4);
        this.expectedParentNodes.add(0, n2);
        this.expectedProperties.add(0, "[getChildrenMap]");
        this.expectedCtxValues.put(n5, null);

        this.expectedNodes.add(0, n3);
        this.expectedParentNodes.add(0, n2);
        this.expectedProperties.add(0, "[getChildrenMap]");
        this.expectedCtxValues.put(n5, null);

        this.expectedNodes.add(0, n2);
        this.expectedParentNodes.add(0, n1);
        this.expectedProperties.add(0, "[getChildrenMap]");
        this.expectedCtxValues.put(n5, null);

        this.tr.traverse(n1, ROOT_CTX_VALUE);
    }

    @Override
    public void cycle(Object o, Context ctx) {

    }

    @Override
    public void visit(Object o, ObjectGraphTraversal.Context ctx) {
        Node n = (Node) o;
        Node expectedNode = this.expectedNodes.remove(0);

        if (n != expectedNode) {
            throw new AssertionError("Unexpected node - expected " + expectedNode + " but got " + n);
        }

        String expectedProps = this.expectedProperties.remove(0).toString();
        if (!ctx.getProperties().toString().equals(expectedProps)) {
            throw new AssertionError("Unexpected property chain for node " + n + ": expected " + expectedProps + " but got "
                + ctx.getProperties().toString());
        }

        Node expectedParentNode = this.expectedParentNodes.remove(0);
        if (ctx.getParents().get(0) != expectedParentNode) {
            throw new AssertionError("Unexpected parent for node " + n + ": expected " + expectedParentNode + " but got " + ctx.getParents().get(0));
        }

        // check this ctx value
        String expectedCtxValue = String.valueOf(this.expectedCtxValues.get(n));
        if (!String.valueOf(ctx.getValues().get(0)).equals(expectedCtxValue)) {
            throw new AssertionError("For node " + n + " expected parent ctx value to be " + expectedCtxValue + ", instead got "
                + ctx.getValues().get(0));
        }

        // check parent ctx value
        String parentCtxValue = this.ctxValues.get(expectedParentNode);
        if (!ctx.getValues().get(1).equals(parentCtxValue)) {
            throw new AssertionError("For node " + n + " expected parent ctx value to be " + parentCtxValue + ", instead got "
                + ctx.getValues().get(1));
        }

        // check root ctx value
        int i = ctx.getValues().size() - 1;
        if (!ctx.getValues().get(i).equals(ROOT_CTX_VALUE)) {
            throw new AssertionError("Expected root ctxt value to 'root-ctx' " + "instead got " + ctx.getValues().get(i));
        }

        ctx.getValues().add(0, this.ctxValues.get(n));
    }

    @Override
    public List<String> getProperties(Object o, Context ctx) {
        return this.propertyNames;
    }

}

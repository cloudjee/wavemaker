/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

/**
 * Utility for traversing an arbitrary Object graph.
 * 
 * Implement PropertyFactory to provide the names of the getters to call on each node in the graph.
 * 
 * Implement ObjectVisitor to get information about each node visited.
 * 
 * For nodes that are instanceof Collection, all child nodes are visited. For nodes instance of Map, all values are
 * visited. Keys are ignored.
 * 
 * Keeps track of previously visited nodes to break out of circular references.
 * 
 * setBeanProperties(true) for all properties to be treated as "bean" properties (default).
 * 
 * Note that "visit" is not called for the root node - the first callback is PropertyFactory.getProperties.
 * 
 * See javadoc for inner Context class.
 * 
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class ObjectGraphTraversal {

    public interface ObjectVisitor {

        /**
         * Called for each node that has not yet been visited. Traversing continues after this call, and
         * PropertyFactry.getProperties will be called for this instance.
         */
        void visit(Object o, Context ctx);

        /**
         * Called for a node that has already been visited. Does not continue traversing, since this node has been
         * visited previously. PropertyFactory.getProperties will not be called. Note that a pointer back to the root
         * node is considered a cycle, although visit is not called for the root node.
         */
        void cycle(Object o, Context ctx);
    }

    public interface PropertyFactory {

        Collection<String> getProperties(Object o, Context ctx);
    }

    /**
     * The following Context information is available for each node:
     * 
     * The parent instances of the current node (stack). The direct parent is at position 0.
     * 
     * The properties (getters) chain traversed to get to this node (stack). The property name used to access this node
     * is at position 0. For example if the current node is a Country instance and the root Object is a Person instance:
     * (["country", "city", "address", "person"]). Use getPropertyPath to get a string representation.
     * 
     * Arbitrary context information that can be used to associate state with a visited Node (stack). Child nodes
     * visited have access to the state of all of their parent nodes. A new null value is pushed for each visited node -
     * therefore a node should use ctx.getValues().set(0, <value>) to override the default null value.
     */
    public class Context {

        // parent nodes
        private final List<Object> parents = new ArrayList<Object>();

        // properties traversed to get to current node
        private final List<String> properties = new ArrayList<String>();

        // arbitrary storage for clients
        private final List<Object> valueStack = new ArrayList<Object>();

        public List<?> getParents() {
            return this.parents;
        }

        public List<String> getProperties() {
            return this.properties;
        }

        public List<Object> getValues() {
            return this.valueStack;
        }

        public String getPropertyPath() {
            List<String> l = new ArrayList<String>(getProperties());
            Collections.reverse(l);
            return ObjectUtils.toString(l, ".");
        }

    }

    private static final ObjectVisitor NOOP_VISITOR = new ObjectVisitor() {

        public void visit(Object o, Context ctx) {
        }

        public void cycle(Object o, Context ctx) {
        }
    };

    private final PropertyFactory propertyFactory;

    private final ObjectVisitor objectVisitor;

    private final ObjectAccess objectAccess;

    private boolean propertiesAreBeanProperties = true;

    public ObjectGraphTraversal(PropertyFactory propertyFactory) {
        this(propertyFactory, NOOP_VISITOR);
    }

    public ObjectGraphTraversal(PropertyFactory propertyFactory, ObjectAccess objectAccess) {
        this(propertyFactory, NOOP_VISITOR, objectAccess);
    }

    public ObjectGraphTraversal(PropertyFactory propertyFactory, ObjectVisitor objectVisitor) {
        this(propertyFactory, objectVisitor, ObjectAccess.getInstance());
    }

    public ObjectGraphTraversal(PropertyFactory propertyFactory, ObjectVisitor objectVisitor, ObjectAccess objectAccess) {
        this.propertyFactory = propertyFactory;
        this.objectVisitor = objectVisitor;
        this.objectAccess = objectAccess;
    }

    public void setBeanProperties(boolean b) {
        this.propertiesAreBeanProperties = b;
    }

    public void traverse(Object root) {
        traverse(root, null);
    }

    public void traverse(Object root, Object rootContextValue) {
        Context ctx = new Context();
        ctx.valueStack.add(rootContextValue);
        Collection<Object> alreadyVisited = new HashSet<Object>();
        alreadyVisited.add(root);
        traverseInternal(root, ctx, alreadyVisited);
    }

    @SuppressWarnings("unchecked")
    private void traverseInternal(Object o, Context ctx, Collection<Object> alreadyVisited) {

        Collection<String> properties = this.propertyFactory.getProperties(o, ctx);

        for (String property : properties) {

            String methodName = property;

            Object propval = null;

            if (this.propertiesAreBeanProperties) {
                propval = this.objectAccess.getProperty(o, methodName);
            } else {
                propval = this.objectAccess.invoke(o, methodName);
            }

            if (propval == null) {
                continue;
            }

            ctx.valueStack.add(0, null);
            ctx.parents.add(0, o);
            ctx.properties.add(0, property);

            try {
                if (propval instanceof Map || propval instanceof Collection) {
                    Collection propsvals = null;
                    if (propval instanceof Map) {
                        propsvals = ((Map) propval).values();
                    } else {
                        propsvals = (Collection) propval;
                    }
                    for (Object val : propsvals) {
                        visitAndRecurse(val, ctx, alreadyVisited);
                    }
                } else {
                    visitAndRecurse(propval, ctx, alreadyVisited);
                }
            } finally {
                ctx.valueStack.remove(0);
                ctx.parents.remove(0);
                ctx.properties.remove(0);
            }
        }
    }

    private void visitAndRecurse(Object o, Context ctx, Collection<Object> alreadyVisited) {

        // REVIEW - if o happens to be in a Map/Collection, we don't
        // pass the Map/Collection into visit or cycle or make clients
        // otherwise aware of the fact that we're visiting stuff in
        // a Map or Collection.

        if (!TypeConversionUtils.isPrimitiveOrWrapper(o.getClass())) {
            if (alreadyVisited.contains(o)) {
                this.objectVisitor.cycle(o, ctx);
                return;
            }
            alreadyVisited.add(o);
        }

        this.objectVisitor.visit(o, ctx);
        traverseInternal(o, ctx, alreadyVisited);
    }

}

/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
package com.wavemaker.tools.service.codegen;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.sun.codemodel.CodeWriter;
import com.sun.codemodel.JBlock;
import com.sun.codemodel.JClassAlreadyExistsException;
import com.sun.codemodel.JCodeModel;
import com.sun.codemodel.JConditional;
import com.sun.codemodel.JDefinedClass;
import com.sun.codemodel.JExpr;
import com.sun.codemodel.JExpression;
import com.sun.codemodel.JFieldRef;
import com.sun.codemodel.JFieldVar;
import com.sun.codemodel.JMethod;
import com.sun.codemodel.JMod;
import com.sun.codemodel.JPackage;
import com.sun.codemodel.JType;
import com.sun.codemodel.JVar;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.common.util.ClassUtils;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.common.util.TypeConversionUtils;
import com.wavemaker.tools.common.ConfigurationException;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class BeanGenerator {

    private static final String EQUALS_METHOD = "equals";

    private static final String HASHCODE_METHOD = "hashCode";

    private static final String VALUEOF_METHOD = "valueOf";
    
    private static final String CLOB_TYPE = "java.sql.Clob";
    
    private static final String BLOB_TYPE = "java.sql.Blob";

    public class PropertyDescriptor {

        private final String name;

        private String type;

        private boolean isPrimitiveType;

        private boolean isCollection = false;

        private Class<?> collectionType = Collection.class;

        private Class<?> concreteCollectionType = HashSet.class;

        public PropertyDescriptor(String name, String type) {
            this.name = name;
            this.type = type;

            initIsPrimitive();

            initIsCollection();
        }

        public String getName() {
            return name;
        }

        public String getType() {
            return type;
        }

        public boolean isCollection() {
            return isCollection;
        }

        public void setCollection() {
            this.isCollection = true;
        }

        public Class<?> getConcreteCollectionType() {
            return concreteCollectionType;
        }

        public void setConcreteCollectionType(Class<?> concreteCollectionType) {
            this.concreteCollectionType = concreteCollectionType;
        }

        public Class<?> getCollectionType() {
            return collectionType;
        }

        public void setCollectionType(Class<?> collectionType) {
            this.collectionType = collectionType;
            this.isCollection = true;
        }

        public boolean isPrimitive() {
            return !isCollection && isPrimitiveType;
        }

        private void initIsPrimitive() {
            try {
                Class<?> c = ClassLoaderUtils.loadClass(type, false);
                isPrimitiveType = c.isPrimitive();
            } catch (RuntimeException ex) {
                isPrimitiveType = false;
            }
        }

        private void initIsCollection() {
            Tuple.Two<String, String> t = 
                GenerationUtils.splitGenericType(type);
            if (t == null) {
                return;
            }
            // assume that if type is genericized, we have a Collection
            collectionType = ClassLoaderUtils.loadClass(t.v1, false);
            concreteCollectionType = collectionType;
            type = t.v2;
            isCollection = true;
        }
    }

    private final int CONSTANT_MODIFIERS 
        = JMod.PUBLIC | JMod.STATIC | JMod.FINAL;

    private final JCodeModel codeModel = new JCodeModel();

    private final JDefinedClass cls;

    private final Map<JVar, Object> constants = 
        new LinkedHashMap<JVar, Object>();

    private List<PropertyDescriptor> properties = 
        new ArrayList<PropertyDescriptor>();

    private boolean addSimpleTypesOnlyCtor = false;

    private boolean addEqualsHashCode = false;

    private boolean initCollections = false;
    
    private boolean addCollectionsLast = true;

    public BeanGenerator(String className) {
        try {
            cls = codeModel._class(className);
        } catch (JClassAlreadyExistsException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    /**
     * Returns the fully qualified name of the class being generated.
     */
    public String getFullyQualifiedClassName() {
        return cls.fullName();
    }

    /**
     * Returns the class name (without package) of the class being generated.
     */
    public String getClassName() {
        return cls.name();
    }

    public JDefinedClass getModelClass() {
        return cls;
    }

    public void addClassJavadoc(String comment) {
        cls.javadoc().add(comment);
    }

    public void addSimpleTypesOnlyCtor() {
        addSimpleTypesOnlyCtor = true;
    }

    public void initCollections() {
        initCollections = true;
    }

    public void addStringConstant(String name, String value) {
        JVar v = cls.field(CONSTANT_MODIFIERS, String.class, name, JExpr
                .lit(value));
        constants.put(v, value);
    }

    public void implSerializable() {
        cls._implements(Serializable.class);
    }

    public PropertyDescriptor addProperty(String name, Class<?> type) {
        return addProperty(name, type.getName());
    }

    public PropertyDescriptor addProperty(String name, String type) {
        PropertyDescriptor pd = new PropertyDescriptor(name, type);
        properties.add(pd);
        return pd;
    }

    public void addEqualsHashCode() {
        addEqualsHashCode = true;
    }

    public void generate(OutputStream os) throws IOException {
        
        if (addCollectionsLast) {
            List<PropertyDescriptor> collections = 
                new ArrayList<PropertyDescriptor>();
            List<PropertyDescriptor> l = 
                new ArrayList<PropertyDescriptor>(properties.size());
            for (PropertyDescriptor pd : properties) {
                if (pd.isCollection()) {
                    collections.add(pd);
                } else {
                    l.add(pd);
                }
            }
            l.addAll(collections);
            properties = l;
        }

        List<JVar> members = new ArrayList<JVar>();

        for (PropertyDescriptor property : properties) {
            String name = property.getName();
            JType primitiveType = codeModel.ref(property.getType());
            JType type = primitiveType;
            if (property.isCollection()) {
                type = getGenericCollection(primitiveType, property
                        .getCollectionType());
            }

            JExpression rhs = null;
            if (initCollections && property.isCollection()) {
                JType concreteType = getGenericCollection(primitiveType,
                        property.getConcreteCollectionType());
                rhs = JExpr._new(concreteType);
            }
            JFieldVar jfv = cls.field(JMod.PRIVATE, type, name, rhs);
            members.add(jfv);
        }

        //The following lines of code are commented out because
        /*addDefaultConstructor();
        if (addSimpleTypesOnlyCtor && !onlyHasSimpleTypes()) {
            addConstructor(members, true);
        }
        addConstructor(members, false);*/

        if (addEqualsHashCode) {
            addEquals();
            addHashCode();
        }

        for (JVar v : members) {
            addAccessors(v);
        }

        CodeWriter codeWriter = new OutputStreamCodeWriter(os);
        codeModel.build(codeWriter, codeWriter);
    }

    public void generateAux(OutputStream os) throws IOException {
        
        if (addCollectionsLast) {
            List<PropertyDescriptor> collections = 
                new ArrayList<PropertyDescriptor>();
            List<PropertyDescriptor> l = 
                new ArrayList<PropertyDescriptor>(properties.size());
            for (PropertyDescriptor pd : properties) {
                if (pd.isCollection()) {
                    collections.add(pd);
                } else {
                    l.add(pd);
                }
            }
            l.addAll(collections);
            properties = l;
        }

        List<JVar> members = new ArrayList<JVar>();
        List<JVar> membersAux = new ArrayList<JVar>();

        for (PropertyDescriptor property : properties) {
            String name = property.getName();
            JType primitiveType = codeModel.ref(property.getType());
            JType type = primitiveType;
            if (property.isCollection()) {
                type = getGenericCollection(primitiveType, property
                        .getCollectionType());
            }

            JExpression rhs = null;
            if (initCollections && property.isCollection()) {
                JType concreteType = getGenericCollection(primitiveType,
                        property.getConcreteCollectionType());
                rhs = JExpr._new(concreteType);
            }
            JFieldVar jfv = cls.field(JMod.PRIVATE, type, name, rhs);
            members.add(jfv);
            
            // MAV-2167 Add serialized data members for blob and clob
            if (property.getType().equals(BLOB_TYPE)) {
            	JType primitiveAuxType = codeModel.ref("byte[]");
            	String auxName = name + "Aux";
            	JFieldVar jfvAux = cls.field(JMod.PRIVATE, primitiveAuxType, auxName, rhs);
            	membersAux.add(jfvAux);
            }
            else if (property.getType().equals(CLOB_TYPE)) {
            	JType primitiveAuxType = codeModel.ref("java.lang.String");
            	String auxName = name + "Aux";
            	JFieldVar jfvAux = cls.field(JMod.PRIVATE, primitiveAuxType, auxName, rhs);
            	membersAux.add(jfvAux);
            }
        }

        // MAV-2167 - now add the auxiliary members to the class
        for (JVar v : membersAux)
        {
        	members.add(v);
        }
        
        addDefaultConstructor();
        if (addSimpleTypesOnlyCtor && !onlyHasSimpleTypes()) {
            addConstructor(members, true);
        }
        addConstructor(members, false);

        if (addEqualsHashCode) {
            addEquals();
            addHashCode();
        }

        // MAV 2167 To add the assignment statements for the auxiliary variables of lob types
        for (JVar v : members) {
            addAccessorsAux(v, membersAux);
        }

        CodeWriter codeWriter = new OutputStreamCodeWriter(os);
        codeModel.build(codeWriter, codeWriter);
    }

    private JType getGenericCollection(JType primitiveType,
            Class<?> collectionType) {
        try {
            return GenerationUtils.getGenericCollectionType(codeModel,
                    collectionType.getName(), primitiveType);
        } catch (ClassNotFoundException ex) {
            throw new ConfigurationException(ex);
        }
    }

    private void addDefaultConstructor() {
        if (isConstantsClass()) {
            JMethod ctor = cls.constructor(JMod.PRIVATE);
            JBlock body = ctor.body();
            body._throw(JExpr._new(codeModel
                                   .ref(UnsupportedOperationException.class)));
        } else {
            cls.constructor(JMod.PUBLIC);
        }
    }

    private boolean onlyHasSimpleTypes() {
        for (PropertyDescriptor pd : properties) {
            if (!isSimpleType(pd)) {
                return false;
            }
        }
        return true;
    }

    private boolean isSimpleType(PropertyDescriptor pd) {
        try {
            Class<?> c = ClassLoaderUtils.loadClass(pd.getType(), false);
            return TypeConversionUtils.isPrimitiveOrWrapper(c);
        } catch (RuntimeException ex) {
            return false;
        }
    }

    private void addConstructor(List<JVar> members,
                                boolean onlyIncludeSimpleTypes)
    {
        List<PropertyDescriptor> props = properties;
        List<JVar> memberVars = members;
        if (onlyIncludeSimpleTypes) {
            props = new ArrayList<PropertyDescriptor>(properties.size());
            memberVars = new ArrayList<JVar>(properties.size());
            for (int i = 0; i < properties.size(); i++) {
                PropertyDescriptor pd = properties.get(i);
                if (!isSimpleType(pd)) {
                    continue;
                }
                props.add(pd);
                memberVars.add(members.get(i));
            }
        }

        if (props.isEmpty()) {
            return;
        }

        addConstructor(memberVars, props);
    }

    private void addConstructor(List<JVar> memberVars,
            List<PropertyDescriptor> props) {

        JMethod ctor = cls.constructor(JMod.PUBLIC);
        List<JVar> args = new ArrayList<JVar>(props.size());

        for (int i = 0; i < props.size(); i++) {
            PropertyDescriptor pd = props.get(i);
            JType type = memberVars.get(i).type();
            args.add(addParam(ctor, pd.getName(), type));
        }

        for (int i = 0; i < props.size(); i++) {
            JBlock block = ctor.body();
            JFieldRef ref = JExpr._this().ref(props.get(i).getName());
            assignToMember(block, ref, args.get(i));
        }
    }

    private void assignToMember(JBlock block, JVar lhs, JVar rhs) {
        assignToMember(block, JExpr._this().ref(lhs), rhs);
    }

    private void assignToMember(JBlock block, JFieldRef lhs, JVar rhs) {
        block.assign(lhs, rhs);
    }

    private JVar addParam(JMethod method, JVar property) {
        return addParam(method, property.name(), property.type());
    }

    private JVar addParam(JMethod method, String name, JType type) {
        return method.param(type, name);
    }

    private void addAccessors(JVar property) {
        String name = property.name();
        JType type = property.type();

        cls.method(JMod.PUBLIC, type, ClassUtils.getPropertyGetterName(name))
                .body()._return(property);
        JMethod setter = cls.method(JMod.PUBLIC, codeModel.VOID, ClassUtils
                .getPropertySetterName(name));
        JVar param = addParam(setter, property);
        assignToMember(setter.body(), property, param);
    }

    private void addAccessorsAux(JVar property, List<JVar> auxMembers) {
        String name = property.name();
        JType type = property.type();

        cls.method(JMod.PUBLIC, type, ClassUtils.getPropertyGetterName(name))
                .body()._return(property);
        JMethod setter = cls.method(JMod.PUBLIC, codeModel.VOID, ClassUtils
                .getPropertySetterName(name));
        JVar param = addParam(setter, property);
        assignToMember(setter.body(), property, param);
        
        // MAV-2167 Need to add the extra statements for caching the lob data types
        augmentSettersAux(setter, property, auxMembers);
    }
    
    private void augmentSettersAux(JMethod setter, JVar property, List<JVar> auxMembers) {
        String name = property.name();
        JType type = property.type();
        JBlock setterBlock = setter.body();
        boolean addExceptions = false;
        
        if (type.fullName().equals(CLOB_TYPE))
        {	
        	// retrieve the matching aux member
        	for (JVar v : auxMembers)
        	{
        		String vName = v.name();
        		if (vName.substring(0, name.length()).equals(name))
        		{
        			// For the case where the parameter contains non-null value
        			setterBlock.directStatement("if (" + name + " != null) {"); 
        			setterBlock.directStatement("    java.io.Reader r = " + name + ".getCharacterStream();");
        			setterBlock.directStatement("    char[] arr = " + "new char[((int) " + name + ".length() + 1)];");
        			setterBlock.directStatement("    r.read(arr);");
        			setterBlock.directStatement("    this." + vName + " = " + "new java.lang.String(arr);");
        			setterBlock.directStatement("}");
        			
        			// For the case where the value in parameter is null
        			setterBlock.directStatement("else {");
        			setterBlock.directStatement("    this." + vName + " = null;");   
        			setterBlock.directStatement("}");
        		}
        	}
        	
            // Also account for the exceptions
            addExceptions = true;
        }	
        
        if (type.fullName().equals(BLOB_TYPE))
        {	            	
            // retrieve the matching aux member
            for (JVar v : auxMembers)
            {
            	String vName = v.name();
            	if (vName.substring(0, name.length()).equals(name))
            	{
            		// For the case where the parameter contains non-null value
            		setterBlock.directStatement("if (" + name + " != null) {"); 
        			setterBlock.directStatement("    java.io.InputStream r = " + name + ".getBinaryStream();");
        			setterBlock.directStatement("    byte[] arr = " + "new byte[((int) " + name + ".length() + 1)];");
        			setterBlock.directStatement("    r.read(arr);");
        			setterBlock.directStatement("    this." + vName + " = arr;");
        			setterBlock.directStatement("}");
        			
        			// For the case where the value in parameter is null
        			setterBlock.directStatement("else {");
        			setterBlock.directStatement("    this." + vName + " = null;");
        			setterBlock.directStatement("}");
            	}
            }
            
            // Also account for the exceptions
            addExceptions = true;
        }
        
        if (addExceptions == true) {
            setter._throws(java.io.IOException.class);
            setter._throws(java.sql.SQLException.class);
        }
    }
        
    private boolean isConstantsClass() {
        return properties.isEmpty() && !constants.isEmpty();
    }

    private void addEquals() {
        JMethod m = cls.method(JMod.PUBLIC, boolean.class, EQUALS_METHOD);
        JVar param = m.param(Object.class, "o");
        JBlock body = m.body();
        body._if(param.eq(JExpr._this()))._then()._return(JExpr.TRUE);
        body._if(param._instanceof(cls).not())._then()._return(JExpr.FALSE);
        JVar other = body.decl(cls, "other", JExpr.cast(cls, param));
        for (PropertyDescriptor pd : properties) {
            JExpression _thisProp = JExpr._this().ref(pd.getName());
            JExpression otherProp = other.ref(pd.getName());
            if (pd.isPrimitive()) {
                body._if(_thisProp.ne(otherProp))._then()._return(JExpr.FALSE);
            } else {
                JConditional cond = body._if(_thisProp.eq(JExpr._null()));
                cond._then()._if(otherProp.ne(JExpr._null()))._then()._return(
                        JExpr.FALSE);
                cond._else()._if(
                        _thisProp.invoke(EQUALS_METHOD).arg(otherProp).not())
                        ._then()._return(JExpr.FALSE);
            }
        }
        body.block()._return(JExpr.TRUE);
    }

    private void addHashCode() {
        JMethod m = cls.method(JMod.PUBLIC, int.class, HASHCODE_METHOD);
        JBlock body = m.body();
        JVar rtn = body.decl(codeModel.ref("int"), "rtn", JExpr.lit(17));
        for (PropertyDescriptor pd : properties) {
            JExpression _thisProp = JExpr._this().ref(pd.getName());
            body.assign(rtn, rtn.mul(JExpr.lit(37)));
            if (pd.isPrimitive()) {
                body.assign(rtn, rtn.plus(codeModel.ref(String.class)
                        .staticInvoke(VALUEOF_METHOD).arg(_thisProp).invoke(
                                HASHCODE_METHOD)));
            } else {
                body._if(_thisProp.ne(JExpr._null()))._then().assign(rtn,
                        rtn.plus(_thisProp.invoke(HASHCODE_METHOD)));
            }
        }
        body._return(rtn);
    }

    private class OutputStreamCodeWriter extends CodeWriter {

        private final OutputStream os;

        public OutputStreamCodeWriter(OutputStream os) {
            this.os = new PrintStream(os);
        }

        @Override
        public OutputStream openBinary(JPackage pkg, String fileName) {
            return os;
        }

        @Override
        public void close() throws IOException {
            os.close();
        }
    }
}

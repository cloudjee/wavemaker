/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.data.salesforce;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.sun.codemodel.JBlock;
import com.sun.codemodel.JClass;
import com.sun.codemodel.JConditional;
import com.sun.codemodel.JDefinedClass;
import com.sun.codemodel.JDocComment;
import com.sun.codemodel.JExpr;
import com.sun.codemodel.JExpression;
import com.sun.codemodel.JFieldRef;
import com.sun.codemodel.JInvocation;
import com.sun.codemodel.JMethod;
import com.sun.codemodel.JMod;
import com.sun.codemodel.JType;
import com.sun.codemodel.JVar;
import com.wavemaker.common.CommonConstants;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.data.DataServiceOperation;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.tools.data.DataServiceGenerator;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.tools.util.DesignTimeUtils;
import com.wavemaker.tools.ws.salesforce.SalesforceHelper;

/**
 * DataService class generation.
 * 
 * @author Seung Lee
 */
public class DataServiceGenerator_SF extends DataServiceGenerator {

    private final DesignServiceManager dsm;

    public DataServiceGenerator_SF(GenerationConfiguration configuration) {

        super(configuration, "com.sforce.SalesforceQueries");

        this.useNDCLogging = false;

        ProjectManager projMgr = (ProjectManager) RuntimeAccess.getInstance().getSession().getAttribute(DataServiceConstants.CURRENT_PROJECT_MANAGER);
        this.dsm = DesignTimeUtils.getDSMForProjectRoot(projMgr.getCurrentProject().getProjectRoot());
    }

    /**
     * Generates service stubs.
     * 
     * @throws GenerationException
     */
    @SuppressWarnings("deprecation")
    @Override
    public void generate() throws GenerationException {

        preGeneration();

        JDefinedClass serviceCls = generateClass();

        preGenerateClassBody(serviceCls);

        generateClassJavadoc(serviceCls.javadoc());

        if (hasDefaultConstructor()) {
            JMethod defaultConst = generateDefaultConstructor(serviceCls);
            JBlock defaultConstBody = defaultConst.body();
            generateDefaultConstructorBody(defaultConstBody);
        }

        List<String> operationNames = this.serviceDefinition.getOperationNames();

        if (this.logger.isDebugEnabled()) {
            this.logger.debug("Generating service class with operations: " + operationNames);
        }

        for (int i = 0; i < operationNames.size(); i++) {
            String operationName = operationNames.get(i);
            if (isSalesForceMethod(operationName)) {
                continue;
            }
            List<ElementType> inputTypes = this.serviceDefinition.getInputTypes(operationName);
            generateOperationMethod(serviceCls, operationName, inputTypes, null);

            // add overloaded versions for this method
            int j = 0;
            List<List<ElementType>> overloadedVersions = getOverloadedVersions(operationName);
            for (List<ElementType> overloadedInputTypes : overloadedVersions) {
                generateOperationMethod(serviceCls, operationName, overloadedInputTypes, j++);
            }

        }

        generateOthers(serviceCls);

        postGenerateClassBody(serviceCls);

        try {
            this.configuration.getOutputDirectory().getFile().mkdirs();
            this.codeModel.build(this.configuration.getOutputDirectory().getFile(), this.configuration.getOutputDirectory().getFile(), null);
        } catch (IOException e) {
            throw new GenerationException("Unable to write service stub", e);
        }

        postGeneration();
    }

    public void generateOthers(JDefinedClass serviceCls) {
        serviceCls.direct("public Object runNamedQuery(String dataModelName, String queryName, Class cls, Object ... values) {");
        serviceCls.direct("return null;}");
    }

    @Override
    public void setGenerateMain(boolean generateMain) {
        this.generateMain = generateMain;
    }

    @Override
    protected boolean hasDefaultConstructor() {
        return false;
    }

    @Override
    public String getClassName() {
        return this.serviceClass;
    }

    @Override
    protected void preGenerateClassBody(JDefinedClass cls) {

        // I don't think Kohsuke would like this
        cls.annotate(SuppressWarnings.class).param("value", "unchecked");
    }

    @Override
    protected List<List<ElementType>> getOverloadedVersions(String operationName) {

        DataServiceOperation op = this.ds.getOperation(operationName);

        List<List<ElementType>> rtn = new ArrayList<List<ElementType>>();

        for (DataServiceOperation overop : op.getOverloadedOperations()) {

            List<ElementType> inputs = new ArrayList<ElementType>();
            rtn.add(inputs);

            for (int i = 0; i < overop.getInputNames().size(); i++) {
                ElementType et = new ElementType(overop.getInputTypes().get(i));
                inputs.add(et);
                et.setName(overop.getInputNames().get(i));
            }
        }

        return rtn;
    }

    @Override
    protected void generateOperationMethodBody(JMethod method, JBlock body, String operationName, Map<String, JType> inputJTypeMap,
        ElementType outputType, JType outputJType, Integer overloadCount) {

        DataServiceOperation op = this.ds.getOperation(operationName);

        if (overloadCount != null) {
            op = op.getOverloadedOperations().get(overloadCount);
        }

        if (this.firstCountOperation == null && op.getName().endsWith(DataServiceConstants.COUNT_OP_SUFFIX)) {
            this.firstCountOperation = op;
        }

        addOperation(op, inputJTypeMap, outputType, outputJType, body);
    }

    @Override
    protected void postGenerateClassBody(JDefinedClass cls) {

        writeConstantsClass();

        if (this.generateMain) {

            JMethod main = cls.method(JMod.PUBLIC | JMod.STATIC | JMod.FINAL, this.codeModel.VOID, "main");
            main.param(String[].class, "args");

            JType t = this.codeModel.ref(getClassName());
            JBlock b = main.body();

            if (this.firstCountOperation == null) {
                JFieldRef sysout = this.codeModel.ref(System.class).staticRef("out");
                b.add(sysout.invoke("print").arg(JExpr.lit("Don't know what to do")));
                return;
            }

            JVar springConfig = b.decl(this.codeModel.ref(String.class), "cfg", JExpr.lit(this.serviceId + DataServiceConstants.SPRING_CFG_EXT));

            JVar beanName = b.decl(this.codeModel.ref(String.class), "beanName", JExpr.lit(this.serviceId));

            JVar v = b.decl(t, "s",
                JExpr.cast(t, this.codeModel.ref(SpringUtils.class).staticInvoke(GET_BEAN_METHOD_NAME).arg(springConfig).arg(beanName)));

            String name = this.firstCountOperation.getName();

            JInvocation i = v.invoke(name);

            JFieldRef sysout = this.codeModel.ref(System.class).staticRef("out");
            b.add(sysout.invoke("print").arg(JExpr.lit(name + ": ")));
            b.add(sysout.invoke("println").arg(i));
        }
    }

    private boolean isSalesForceMethod(String operationName) throws GenerationException {
        boolean rtn = false;
        if (this.serviceId.equals(CommonConstants.SALESFORCE_SERVICE)) {
            rtn = SalesforceHelper.isSalesForceMethod(this.dsm, operationName);
        }

        return rtn;
    }

    /**
     * The <code>ServiceGenerator</code> implementation should override this method to customize the class level
     * javadoc.
     * 
     * @param jdoc
     */
    @Override
    protected void generateClassJavadoc(JDocComment jdoc) {
        addJavadoc(jdoc);
    }

    private void addOperation(DataServiceOperation op, Map<String, JType> inputJTypeMap, ElementType outputType, JType outputJType, JBlock body) {

        JExpression thisObj = JExpr._this();
        JInvocation exp = thisObj.invoke("runNamedQuery");

        exp.arg(CommonConstants.SALESFORCE_SERVICE);

        if (op.isQuery()) {
            String queryName = op.getQueryName();
            String constantName = queryName + QUERY_NAME_CONSTANT_SUFFIX;
            this.constantsClass.addStringConstant(constantName, queryName);
            exp.arg(JExpr.direct(this.constantsClass.getClassName() + "." + constantName));

            String returnClassName = outputType.getJavaType() + ".class";
            exp.arg(JExpr.direct(returnClassName));
        }

        // add arguments that are passed into method
        for (Map.Entry<String, JType> e : inputJTypeMap.entrySet()) {
            exp.arg(JExpr.ref(e.getKey()));
        }

        // add literal arguments that are always passed to runtime
        // task
        for (ElementType el : op.getTaskInputs()) {
            if (el.getJavaType().equals(String.class.getName())) {
                exp.arg(JExpr.lit(el.getName()));
            } else if (el.getJavaType().equals(Class.class.getName())) {
                JClass jc = this.codeModel.ref(el.getName());
                exp.arg(jc.dotclass());
            } else if (el.getJavaType().equals(Boolean.class.getName())) {
                exp.arg(JExpr.lit(Boolean.parseBoolean(el.getName())));
            } else {
                throw new AssertionError("Unknown input type " + el.getJavaType());
            }
        }

        if (op.getCode() != null) {
            body.directStatement(op.getCode());
        }

        if (op.isQuery() && op.getReturnsSingleResult()) {
            JType jt = null;
            try {
                jt = getGenericListType(outputJType.fullName());
            } catch (ClassNotFoundException ex) {
                throw new AssertionError(ex);
            }
            JVar rtn = body.decl(jt, "rtn", JExpr.cast(jt, exp));
            JConditional ifstmt = body._if(rtn.invoke(IS_EMPTY_METHOD_NAME));
            ifstmt._then()._return(JExpr._null());
            ifstmt._else()._return(rtn.invoke(GET_METHOD_NAME).arg(JExpr.lit(0)));
        } else {
            if (outputJType == this.codeModel.VOID) {
                body.add(exp);
            } else {
                body._return(JExpr.cast(outputJType, exp));
            }
        }
    }

    @Override
    protected void addJavadoc(JDocComment jdoc) {
        jdoc.add(" This class holds all named queries for SalesForce.\n" + StringUtils.getFormattedDate());
    }
}

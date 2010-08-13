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
package com.wavemaker.tools.data;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.log4j.NDC;

import com.sun.codemodel.JBlock;
import com.sun.codemodel.JClass;
import com.sun.codemodel.JConditional;
import com.sun.codemodel.JDefinedClass;
import com.sun.codemodel.JExpr;
import com.sun.codemodel.JFieldRef;
import com.sun.codemodel.JInvocation;
import com.sun.codemodel.JMethod;
import com.sun.codemodel.JMod;
import com.sun.codemodel.JTryBlock;
import com.sun.codemodel.JType;
import com.sun.codemodel.JVar;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.json.type.TypeDefinition;
import com.wavemaker.runtime.data.DataServiceInternal;
import com.wavemaker.runtime.data.DataServiceManager;
import com.wavemaker.runtime.data.DataServiceManagerAccess;
import com.wavemaker.runtime.data.DataServiceOperation;
import com.wavemaker.runtime.data.DefaultTaskManager;
import com.wavemaker.runtime.data.TaskManager;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.service.ElementType;
import com.wavemaker.runtime.service.LiveDataService;
import com.wavemaker.runtime.service.PagingOptions;
import com.wavemaker.runtime.service.PropertyOptions;
import com.wavemaker.runtime.service.TypedServiceReturn;
import com.wavemaker.tools.data.util.DataServiceUtils;
import com.wavemaker.tools.service.codegen.BeanGenerator;
import com.wavemaker.tools.service.codegen.GenerationConfiguration;
import com.wavemaker.tools.service.codegen.ServiceGenerator;

/**
 * DataService class generation.
 * 
 * @author Simon Toens
 */
public class DataServiceGenerator extends ServiceGenerator {

    private static final String CREATE_CRUD_OP = "insert";

    private static final String READ_CRUD_OP = "read";

    private static final String UPDATE_CRUD_OP = "update";

    private static final String DELETE_CRUD_OP = "delete";

    private static final String QUERY_NAME_CONSTANT_SUFFIX = "QueryName";

    private static final String BEGIN_OP = "begin";

    private static final String COMMIT_OP = "commit";

    private static final String ROLLBACK_OP = "rollback";

    private static final String DATA_SERVICE_VAR_NAME = "dsMgr";

    private static final String TASK_MANAGER_VAR_NAME = "taskMgr";

    private static final String INVOKE_METHOD_NAME = "invoke";

    private static final String GET_BEAN_METHOD_NAME = "getBean";

    private static final String IS_EMPTY_METHOD_NAME = "isEmpty";

    private static final String GET_METHOD_NAME = "get";

    private final DataServiceInternal ds;

    private final String serviceClass;

    private final String serviceId;

    private final BeanGenerator constantsClass;

    private JVar dataServiceVar = null;

    private JVar taskMgrVar = null;

    private boolean generateMain = false;

    private DataServiceOperation firstCountOperation = null;

    public DataServiceGenerator(GenerationConfiguration configuration) {
        this(configuration, configuration.getServiceDefinition()
                .getServiceClass());
    }

    public DataServiceGenerator(GenerationConfiguration configuration,
            String serviceClass) {

        super(configuration);

        this.serviceClass = serviceClass;

        this.ds = (DataServiceInternal) DataServiceUtils.unwrap(configuration
                .getServiceDefinition());

        this.serviceId = configuration.getServiceDefinition().getServiceId();

        this.constantsClass = new BeanGenerator(DataServiceUtils
                .getConstantsClassName(serviceClass));

        useNDCLogging = false;
    }

    public void setGenerateMain(boolean generateMain) {
        this.generateMain = generateMain;
    }

    @Override
    protected boolean hasDefaultConstructor() {
        return false;
    }

    @Override
    public String getClassName() {
        return serviceClass;
    }

    @Override
    protected void preGenerateClassBody(JDefinedClass cls) {

        // I don't think Kohsuke would like this
        cls.annotate(SuppressWarnings.class).param("value", "unchecked");

        cls._implements(DataServiceManagerAccess.class);

        dataServiceVar = cls.field(JMod.PRIVATE, DataServiceManager.class,
                DATA_SERVICE_VAR_NAME);

        taskMgrVar = cls.field(JMod.PRIVATE, TaskManager.class,
                TASK_MANAGER_VAR_NAME);
    }

    @Override
    protected List<List<ElementType>> getOverloadedVersions(String operationName) {

        DataServiceOperation op = ds.getOperation(operationName);

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
    protected void generateOperationMethodBody(JMethod method, JBlock body,
            String operationName, Map<String, JType> inputJTypeMap,
            JType outputJType, Integer overloadCount) {

        DataServiceOperation op = ds.getOperation(operationName);

        if (overloadCount != null) {
            op = op.getOverloadedOperations().get(overloadCount);
        }

        if (firstCountOperation == null
                && op.getName().endsWith(DataServiceConstants.COUNT_OP_SUFFIX)) {
            firstCountOperation = op;
        }

        addOperation(op, inputJTypeMap, outputJType, body);
    }

    @Override
    protected void postGenerateClassBody(JDefinedClass cls) {

        cls._implements(LiveDataService.class);
        implementCRUDInterface(cls);

        // add convenience methods for begin/commit/rollback
        delegate(cls, BEGIN_OP);
        delegate(cls, COMMIT_OP);
        delegate(cls, ROLLBACK_OP);

        addGetterAndSetter(cls, DataServiceManager.class,
                DATA_SERVICE_VAR_NAME, dataServiceVar);

        addGetterAndSetter(cls, TaskManager.class, TASK_MANAGER_VAR_NAME,
                taskMgrVar);

        writeConstantsClass();

        if (generateMain) {

            JMethod main = cls.method(JMod.PUBLIC | JMod.STATIC | JMod.FINAL,
                    codeModel.VOID, "main");
            main.param(String[].class, "args");

            JType t = codeModel.ref(getClassName());
            JBlock b = main.body();

            if (firstCountOperation == null) {
                JFieldRef sysout = codeModel.ref(System.class).staticRef("out");
                b.add(sysout.invoke("print").arg(
                        JExpr.lit("Don't know what to do")));
                return;
            }

            JVar springConfig = b.decl(codeModel.ref(String.class), "cfg",
                    JExpr.lit(serviceId + DataServiceConstants.SPRING_CFG_EXT));

            JVar beanName = b.decl(codeModel.ref(String.class), "beanName",
                    JExpr.lit(serviceId));

            JVar v = b.decl(t, "s", JExpr.cast(t, codeModel.ref(
                    SpringUtils.class).staticInvoke(GET_BEAN_METHOD_NAME).arg(
                    springConfig).arg(beanName)));

            String name = firstCountOperation.getName();

            JInvocation i = v.invoke(name);

            JFieldRef sysout = codeModel.ref(System.class).staticRef("out");
            b.add(sysout.invoke("print").arg(JExpr.lit(name + ": ")));
            b.add(sysout.invoke("println").arg(i));
        }
    }

    private void implementCRUDInterface(JDefinedClass cls) {
        addCreate(cls);
        addRead(cls);
        addUpdate(cls);
        addDelete(cls);
    }

    private void addCreate(JDefinedClass cls) {
        JMethod method = cls.method(JMod.PUBLIC, Object.class, CREATE_CRUD_OP);
        JVar p1 = method.param(Object.class, "o");
        JInvocation exp = dataServiceVar.invoke(INVOKE_METHOD_NAME);
        exp.arg(taskMgrVar.invoke(DefaultTaskManager.GET_INSERT_TASK)).arg(p1);
        method.body()._return(exp);
    }

    private void addRead(JDefinedClass cls) {
        JMethod method = cls.method(JMod.PUBLIC,
                TypedServiceReturn.class, READ_CRUD_OP);
        JVar rootTypeParam = method.param(TypeDefinition.class, "rootType");
        JVar instanceParam = method.param(Object.class, "o");
        JVar propertyOptionsParam = method.param(PropertyOptions.class,
                "propertyOptions");
        JVar pagingOptionsParam = method.param(PagingOptions.class,
                "pagingOptions");
        JInvocation exp = dataServiceVar.invoke(INVOKE_METHOD_NAME);
        exp.arg(taskMgrVar.invoke(DefaultTaskManager.GET_READ_TASK)).arg(
                rootTypeParam).arg(instanceParam).arg(propertyOptionsParam)
                .arg(pagingOptionsParam);
        method.body()._return(
                JExpr.cast(codeModel.ref(TypedServiceReturn.class), exp));
    }
    
    private void addUpdate(JDefinedClass cls) {
        JMethod method = cls.method(JMod.PUBLIC, Object.class, UPDATE_CRUD_OP);
        JVar p1 = method.param(Object.class, "o");
        JInvocation exp = dataServiceVar.invoke(INVOKE_METHOD_NAME);
        exp.arg(taskMgrVar.invoke(DefaultTaskManager.GET_UPDATE_TASK)).arg(p1);
        method.body()._return(exp);
    }
    
    private void addDelete(JDefinedClass cls) {
        JMethod method = cls.method(JMod.PUBLIC, void.class, DELETE_CRUD_OP);
        JVar p1 = method.param(Object.class, "o");
        JInvocation exp = dataServiceVar.invoke(INVOKE_METHOD_NAME);
        exp.arg(taskMgrVar.invoke(DefaultTaskManager.GET_DELETE_TASK)).arg(p1);
        method.body().add(exp);
    }
    
    private void addOperation(DataServiceOperation op,
            Map<String, JType> inputJTypeMap, JType outputJType, JBlock body) {

        JInvocation exp = dataServiceVar.invoke(INVOKE_METHOD_NAME);

        exp.arg(taskMgrVar.invoke(op.getTaskGetter()));

        if (op.isQuery()) {
            String queryName = op.getQueryName();
            String constantName = queryName + QUERY_NAME_CONSTANT_SUFFIX;
            constantsClass.addStringConstant(constantName, queryName);
            exp.arg(JExpr.direct(constantsClass.getClassName() + "."
                    + constantName));
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
                JClass jc = codeModel.ref(el.getName());
                exp.arg(jc.dotclass());
            } else if (el.getJavaType().equals(Boolean.class.getName())) {
                exp.arg(JExpr.lit(Boolean.parseBoolean(el.getName())));
            } else {
                throw new AssertionError("Unknown input type "
                        + el.getJavaType());
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
            ifstmt._else()._return(
                    rtn.invoke(GET_METHOD_NAME).arg(JExpr.lit(0)));
        } else {
            if (outputJType == codeModel.VOID) {
                body.add(exp);
            } else {
                body._return(JExpr.cast(outputJType, exp));
            }
        }
    }

    private void addGetterAndSetter(JDefinedClass cls, Class<?> c,
            String paramName, JVar var) {

        Tuple.Two<String, String> t = StringUtils.splitPackageAndClass(c);

        cls.method(JMod.PUBLIC, c, "get" + t.v2).body()._return(var);

        JMethod m = cls.method(JMod.PUBLIC, codeModel.VOID, "set" + t.v2);
        JVar p = m.param(c, paramName);
        m.body().assign(JExpr._this().ref(var), p);
    }

    private void delegate(JDefinedClass cls, String name) {
        delegate(cls, name, new Class[] {}, new String[] {}, null);
    }

    private void delegate(JDefinedClass cls, String name, Class<?>[] params,
            String[] paramNames, Class<?> rtn) {

        JMethod m = null;
        if (rtn == null) {
            m = cls.method(JMod.PUBLIC, codeModel.VOID, name);
        } else {
            m = cls.method(JMod.PUBLIC, rtn, name);
        }

        for (int i = 0; i < params.length; i++) {
            m.param(params[i], paramNames[i]);
        }

        JBlock body = m.body();

        JTryBlock tryBlock = null;

        if (useNDCLogging) {
            tryBlock = body._try();
            body = tryBlock.body();
            body.staticInvoke(codeModel.ref(NDC.class), NDC_PUSH).arg(
                    getClassName() + "." + name);
        }

        JInvocation invocation = dataServiceVar.invoke(name);

        for (String s : paramNames) {
            invocation.arg(JExpr.ref(s));
        }

        if (rtn == null) {
            body.add(invocation);
        } else {
            body._return(invocation);
        }

        if (useNDCLogging) {
            tryBlock._finally().block().staticInvoke(codeModel.ref(NDC.class),
                    NDC_POP);
        }
    }

    private void writeConstantsClass() {
        constantsClass.addClassJavadoc(" Query names for service \""
                + serviceDefinition.getServiceId() + "\"\n"
                + StringUtils.getFormattedDate());
        String relPath = StringUtils.classNameToSrcFilePath(constantsClass
                .getFullyQualifiedClassName());
        File f = new File(configuration.getOutputDirectory(), relPath);
        f.getParentFile().mkdirs();
        BufferedOutputStream bos = null;
        try {
            bos = new BufferedOutputStream(new FileOutputStream(f));
            constantsClass.generate(bos);
            bos.close();
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        } finally {
            try {
                bos.close();
            } catch (Exception ignore) {
            }
        }
    }
}

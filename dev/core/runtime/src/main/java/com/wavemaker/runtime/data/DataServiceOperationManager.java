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

package com.wavemaker.runtime.data;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.runtime.data.util.DataServiceUtils;
import com.wavemaker.runtime.service.ElementType;

/**
 * @author Simon Toens
 */
public class DataServiceOperationManager {

    private static final String INSERT_OP = "insert%s";

    private static final String DELETE_OP = "delete%s";

    private static final String UPDATE_OP = "update%s";

    private static final String LIST_OP = "get%sList";

    private static final String COUNT_OP = "get%s" + DataServiceConstants.COUNT_OP_SUFFIX;

    private static final String SEARCH_QBE_ARG = "searchInstance";

    private static final String SEARCH_OPTIONS_ARG = "searchOptions";

    private final Map<String, DataServiceOperation> queries = new HashMap<String, DataServiceOperation>();

    private final Map<String, DataServiceOperation> operations = new HashMap<String, DataServiceOperation>();

    // list of queries that are also operations
    private final Collection<String> queryOperations = new HashSet<String>();

    private final DataOperationFactory factory;

    public DataServiceOperationManager(DataOperationFactory factory, boolean useIndividualCRUDOperations) {

        this.factory = factory;
        initQueries();
        if (useIndividualCRUDOperations) {
            initAPIOperations();
        }
        initQueryOperations();
    }

    public Map<String, DataServiceOperation> getOperations() {
        return this.operations;
    }

    public DataServiceOperation getOperation(String name) {
        DataServiceOperation rtn = this.operations.get(name);
        if (rtn == null) {
            // NamedQueryTask uses the query name
            rtn = this.queries.get(name);
        }
        return rtn;
    }

    public Collection<String> getOperationNames() {
        return this.operations.keySet();
    }

    private void initQueries() {

        for (String s : this.factory.getQueryNames()) {

            addQueryOperation(s);
        }
    }

    private void addQueryOperation(String queryName) {

        String operationName = DataServiceUtils.queryToOperationName(queryName);

        DataServiceOperation op = new DataServiceOperation(operationName, queryName, DefaultTaskManager.GET_QUERY_TASK);

        if (DataServiceLoggers.metaDataLogger.isDebugEnabled()) {
            DataServiceLoggers.metaDataLogger.debug("Processing query " + queryName);
        }

        op.setReturnsSingleResult(this.factory.queryReturnsSingleResult(operationName, queryName));

        for (Tuple.Three<String, String, Boolean> input : this.factory.getQueryInputs(queryName)) {
            op.addInput(input.v1, input.v2, input.v3);
        }

        op.setOutputTypes(this.factory.getQueryReturnTypes(operationName, queryName));
        op.setOutputNames(this.factory.getQueryReturnNames(operationName, queryName));

        op.setRequiresResultWrapper(this.factory.requiresResultWrapper(operationName, queryName));

        this.queries.put(queryName, op);
    }

    // go through queries, and add any query to the operations that has not
    // already been included as a CRUD operation (see initCRUDOperations).
    private void initQueryOperations() {

        for (DataServiceOperation op : this.queries.values()) {

            if (!this.queryOperations.contains(op.getName())) {
                addOperation(op);
            }
        }
    }

    private void initAPIOperations() {

        for (String fullyQualifiedClassName : this.factory.getEntityClassNames()) {

            String name = StringUtils.fromLastOccurrence(fullyQualifiedClassName, ".");

            // create
            addCreateOp(name, fullyQualifiedClassName);

            // read (select)
            for (DataServiceOperation op : getQueryForType(fullyQualifiedClassName)) {
                addOperation(op);
            }

            // for both list and search (QBE)
            addSearchOperation(name, fullyQualifiedClassName);

            addCountOperation(name, fullyQualifiedClassName);

            addUpdateOp(name, fullyQualifiedClassName);

            // delete
            addGenericOp(name, fullyQualifiedClassName, DELETE_OP, DefaultTaskManager.GET_DELETE_TASK);
        }
    }

    private void addCreateOp(String name, String fullyQualifiedClassName) {
        DataServiceOperation op = addGenericOp(name, fullyQualifiedClassName, INSERT_OP, DefaultTaskManager.GET_INSERT_TASK);
        op.setOutputType(fullyQualifiedClassName);
        op.setReturnsSingleResult(Boolean.TRUE);
    }

    private void addUpdateOp(String name, String fullyQualifiedClassName) {

        String opName = String.format(UPDATE_OP, name);

        DataServiceOperation op = new DataServiceOperation(opName, DefaultTaskManager.GET_UPDATE_TASK);
        String argName = StringUtils.lowerCaseFirstLetter(name);
        op.addInput(argName, fullyQualifiedClassName);
        addOperation(op);
    }

    private DataServiceOperation addGenericOp(String name, String fullyQualifiedClassName, String crudOp, String taskGetter) {
        String opName = String.format(crudOp, name);

        DataServiceOperation op = new DataServiceOperation(opName, taskGetter);
        op.addInput(StringUtils.lowerCaseFirstLetter(name), fullyQualifiedClassName);

        addOperation(op);

        return op;
    }

    private void addSearchOperation(String name, String fullyQualifiedClassName) {
        String opName = String.format(LIST_OP, name);

        DataServiceOperation op = new DataServiceOperation(opName, DefaultTaskManager.GET_SEARCH_TASK);

        op.setOutputType(fullyQualifiedClassName);
        op.setReturnsSingleResult(Boolean.FALSE);

        op.addInput(SEARCH_QBE_ARG, fullyQualifiedClassName);
        op.addInput(SEARCH_OPTIONS_ARG, QueryOptions.class);

        addNullToInstanceCode(op, SEARCH_QBE_ARG, fullyQualifiedClassName);

        addOperation(op);

        // with search instance only
        DataServiceOperation op1 = op.addOverloadedOperation();
        op1.addInput(SEARCH_QBE_ARG, fullyQualifiedClassName);
        addNullToInstanceCode(op1, SEARCH_QBE_ARG, fullyQualifiedClassName);

        // no args operation
        op.addOverloadedOperation().addTaskInput(new ElementType(fullyQualifiedClassName, Class.class.getName()));
    }

    private void addNullToInstanceCode(DataServiceOperation op, String argName, String className) {

        String eol = SystemUtils.getLineBreak();

        // maybe this should move into DataServiceGenerator
        op.setCode("if (" + argName + " == null) {" + eol + "            " + argName + " = new " + className + "();" + eol + "        }");
    }

    private void addCountOperation(String name, String fullyQualifiedClassName) {

        String opName = String.format(COUNT_OP, name);

        DataServiceOperation op = new DataServiceOperation(opName, DefaultTaskManager.GET_COUNT_TASK);

        op.setReturnsSingleResult(true);

        op.setOutputType(Integer.class);

        op.addInput(SEARCH_QBE_ARG, fullyQualifiedClassName);
        op.addInput(SEARCH_OPTIONS_ARG, QueryOptions.class);

        addNullToInstanceCode(op, SEARCH_QBE_ARG, fullyQualifiedClassName);

        addOperation(op);

        // with search instance only
        DataServiceOperation op1 = op.addOverloadedOperation();
        op1.addInput(SEARCH_QBE_ARG, fullyQualifiedClassName);
        addNullToInstanceCode(op1, SEARCH_QBE_ARG, fullyQualifiedClassName);

        // no args operation
        op.addOverloadedOperation().addTaskInput(new ElementType(fullyQualifiedClassName, Class.class.getName()));
    }

    private void addOperation(DataServiceOperation op) {

        if (this.operations.containsKey(op.getName())) {
            throw new DataServiceRuntimeException(MessageResource.DUPLICATE_OPERATION, op.getName());
        }

        this.operations.put(op.getName(), op);

        if (op.isQuery()) {
            this.queryOperations.add(op.getName());
        }
    }

    private List<DataServiceOperation> getQueryForType(String type) {

        List<DataServiceOperation> rtn = new ArrayList<DataServiceOperation>();

        for (DataServiceOperation op : this.queries.values()) {
            if (type.equals(op.getOutputType())) {
                rtn.add(op);
            }
        }

        return rtn;
    }
}
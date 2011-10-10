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

package com.wavemaker.runtime.data;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.wavemaker.runtime.service.ElementType;

public class DataServiceOperation {

    private String name = null;

    private String queryName = null;

    // queries can return more than one type
    private List<String> outputTypes = new ArrayList<String>();

    private List<String> outputNames = new ArrayList<String>();

    private final List<String> inputTypes = new ArrayList<String>();

    private final List<String> inputNames = new ArrayList<String>();

    private final List<Boolean> inputIsList = new ArrayList<Boolean>();

    private String taskGetter = null;

    private boolean returnsSingleResult = false;

    private boolean requiresResultWrapper = false;

    private final List<DataServiceOperation> overloadedOperations = new ArrayList<DataServiceOperation>();

    // don't use ElementType to store type/value
    // it is meant to store type/name
    private final List<ElementType> literalTaskInputs = new ArrayList<ElementType>();

    private String code = null;

    public DataServiceOperation() {
    }

    public DataServiceOperation(String name, String taskGetter) {
        this(name, null, taskGetter);
    }

    public DataServiceOperation(String name, String queryName, String taskGetter) {
        this.name = name;
        this.queryName = queryName;
        this.taskGetter = taskGetter;
    }

    public DataServiceOperation addOverloadedOperation() {
        return addOverloadedOperation(Collections.<String> emptyList(), Collections.<String> emptyList());
    }

    public DataServiceOperation addOverloadedOperation(List<String> inputTypes, List<String> inputNames) {
        DataServiceOperation op = new DataServiceOperation(getName(), getQueryName(), getTaskGetter());
        this.overloadedOperations.add(op);
        for (int i = 0; i < inputTypes.size(); i++) {
            op.addInput(inputTypes.get(i), inputNames.get(0));
        }
        op.setOutputType(getOutputType());
        op.setReturnsSingleResult(getReturnsSingleResult());
        return op;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCode() {
        return this.code;
    }

    public void setReturnsSingleResult(Boolean b) {
        this.returnsSingleResult = b;
    }

    public boolean getReturnsSingleResult() {
        return this.returnsSingleResult;
    }

    public boolean isQuery() {
        return this.queryName != null;
    }

    public String getQueryName() {
        return this.queryName;
    }

    public void setQueryName(String queryName) {
        this.queryName = queryName;
    }

    public DataServiceOperation addInput(String inputName, Class<?> inputType) {
        return addInput(inputName, inputType.getName());
    }

    public DataServiceOperation addInput(String inputName, Class<?> inputType, Boolean isList) {
        return addInput(inputName, inputType.getName(), isList);
    }

    public DataServiceOperation addInput(String inputName, String inputType) {
        return addInput(inputName, inputType, Boolean.FALSE);
    }

    public DataServiceOperation addInput(String inputName, String inputType, Boolean isList) {
        this.inputNames.add(inputName);
        this.inputTypes.add(inputType);
        this.inputIsList.add(isList);
        return this;
    }

    public void setOutputType(String outputType) {
        this.outputTypes.clear();
        this.outputTypes.add(outputType);
    }

    public void setOutputType(Class<?> outputType) {
        setOutputType(outputType.getName());
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getInputTypes() {
        return this.inputTypes;
    }

    public List<String> getInputNames() {
        return this.inputNames;
    }

    public List<Boolean> getInputIsList() {
        return this.inputIsList;
    }

    public String getOutputType() {
        if (this.outputTypes.isEmpty()) {
            return null;
        }
        return this.outputTypes.get(0);
    }

    public List<String> getOutputTypes() {
        return this.outputTypes;
    }

    public List<String> getOutputNames() {
        return this.outputNames;
    }

    public void setOutputNames(List<String> outputNames) {
        this.outputNames = outputNames;
    }

    public void setOutputTypes(List<String> outputTypes) {
        this.outputTypes = outputTypes;
    }

    public String getTaskGetter() {
        return this.taskGetter;
    }

    public List<ElementType> getTaskInputs() {
        return this.literalTaskInputs;
    }

    public void addTaskInput(ElementType taskInput) {
        this.literalTaskInputs.add(taskInput);
    }

    public List<DataServiceOperation> getOverloadedOperations() {
        return this.overloadedOperations;
    }

    public void setRequiresResultWrapper(boolean requiresResultWrapper) {
        this.requiresResultWrapper = requiresResultWrapper;
    }

    public boolean requiresResultWrapper() {
        return this.requiresResultWrapper;
    }

}

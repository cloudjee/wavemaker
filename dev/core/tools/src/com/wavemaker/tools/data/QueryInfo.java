/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
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

import com.wavemaker.runtime.data.DataServiceOperation;
import com.wavemaker.runtime.data.Input;

/**
 * Partially written on a flight to Las Vegas.
 *
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class QueryInfo {

    private DataServiceOperation op = new DataServiceOperation();

    private String query = null;
    
    private String comment = null;

    private boolean isHQL = false;
    
    private boolean isGenerated = false;
    
    
    public QueryInfo() {}
    
    public QueryInfo(String name, String query) {
        this(name, query, true, false);
    }

    public QueryInfo(String name, String query, boolean isHQL, boolean isGenerated) {

        this.isHQL = isHQL;

        setName(name);

        setQuery(query);
        
        this.isGenerated = isGenerated;
    }

    public String getName() {
	return op.getQueryName();
    }
    
    public void setName(String name) {
        op.setQueryName(name);
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
        if (this.query != null) {
            this.query = this.query.trim();
        }
    }
    
    public boolean getIsHQL() {
        return isHQL;
    }

    public void setIsHQL(boolean isHQL) {
        this.isHQL = isHQL;
    }

    public void setReturnsSingleResult(boolean b) {
	op.setReturnsSingleResult(b);
    }
    
    public boolean getReturnsSingleResult() {
	return op.getReturnsSingleResult();
    }

    public void addInput(String inputName, String inputType, Boolean isList) {
	op.addInput(inputName, inputType, isList);
    }

    public void setOutputType(String outputType) {
	op.setOutputType(outputType);
    }

    public String getOutputType() {
	return op.getOutputType();
    }

    public Input[] getInputs() {
        Input[] rtn = new Input[op.getInputNames().size()];
        for (int i = 0; i < op.getInputNames().size(); i++) {
            rtn[i] = new Input(op.getInputNames().get(i),
                               op.getInputTypes().get(i),
			       op.getInputIsList().get(i));
        }
        return rtn;
    }

    public void setInputs(Input[] inputs) {
        for (int i = 0; i < inputs.length; i++ ) {
            addInput(inputs[i].getParamName(), inputs[i].getParamType(),
		     inputs[i].getList());
        }
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
    
    public String getComment() {
        return comment;
    }
    
    public boolean getIsGenerated() {
        return isGenerated;
    }
    
    public void setIsGenerated(boolean isGenerated) {
        this.isGenerated = isGenerated;
    }
}

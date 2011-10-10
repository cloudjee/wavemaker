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

package com.wavemaker.runtime.service.response;

/**
 * Wrapper that CRUD operations can return to provide meta-data about their result to the client.
 * 
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class LiveDataServiceResponse implements PagingResponse, SuccessResponse {

    private Object result;

    private long dataSetSize;

    public LiveDataServiceResponse() {
        setDataSetSize(PAGING_NOT_USED);
    }

    public LiveDataServiceResponse(Object result) {
        this();
        setResult(result);
    }

    public LiveDataServiceResponse(Object result, int dataSetSize) {
        this(result);
        setDataSetSize(dataSetSize);
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.response.SuccessResponse#getResult()
     */
    public Object getResult() {
        return this.result;
    }

    /**
     * @see #getResult()
     */
    public void setResult(Object result) {
        this.result = result;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.wavemaker.runtime.service.response.PagingResponse#getDataSetSize()
     */
    public long getDataSetSize() {
        return this.dataSetSize;
    }

    /**
     * @see #getDataSetSize()
     */
    public void setDataSetSize(long dataSetSize) {
        this.dataSetSize = dataSetSize;
    }
}
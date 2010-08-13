/*
 *  Copyright (C) 2007-2010 WaveMaker Software, Inc.
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
package com.wavemaker.runtime.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class PagingOptions {

    private Long maxResults = null;

    private Long firstResult = Long.valueOf("0");

    private List<OrderBy> orderbys = new ArrayList<OrderBy>();

    public PagingOptions() {
    }

    public PagingOptions(PagingOptions po) {
        this(po.getMaxResults(), po.getFirstResult());
        orderbys = po.getOrderByList();
    }

    public PagingOptions(Long limit) {
        setMaxResults(limit);
    }

    public PagingOptions(Long limit, Long offset) {
        this(limit);
        setFirstResult(offset);
    }

    public void setFirstResult(Long offset) {
        this.firstResult = offset;
    }

    public void setMaxResults(Long limit) {
        this.maxResults = limit;
    }

    public Long getMaxResults() {
        return maxResults;
    }

    public Long getFirstResult() {
        return firstResult;
    }

    public void addAscOrder(String propertyPath) {
        OrderBy o = new OrderBy();
        o.setAsc(propertyPath);
        orderbys.add(o);
    }

    public void addDescOrder(String propertyPath) {
        OrderBy o = new OrderBy();
        o.setDesc(propertyPath);
        orderbys.add(o);
    }

    /**
     * Format: asc:p1, asc:p1.p2, desc:p1.p2.p3
     */
    public void setOrderBy(List<String> orderByStrings) {
        if (orderByStrings == null) {
            throw new IllegalArgumentException("orderbys cannot be null");
        }
        for (String s : orderByStrings) {
            orderbys.add(OrderBy.newInstance(s));
        }
    }

    public List<String> getOrderBy() {
        List<String> rtn = new ArrayList<String>(orderbys.size());
        for (OrderBy o : orderbys) {
            rtn.add(o.toString());
        }
        return Collections.unmodifiableList(rtn);
    }

    public List<OrderBy> getOrderByList() {
        return orderbys;
    }

    public void nextPage() {
        if (maxResults != null) {
            firstResult += maxResults;
        }
    }
}

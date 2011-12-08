/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.runtime.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * PropertyOptions specifies how to load properties of an object.
 * 
 * @author Matt Small
 */
public class PropertyOptions {

    /**
     * The properties to load, in beanutil's format; i.e., foo.bar.
     */
    private List<String> properties = new ArrayList<String>();

    /**
     * Filters to apply: property path -> expr.
     */
    private final List<Filter> filters = new ArrayList<Filter>();

    private String matchMode = "start";

    private boolean ignoreCase;

    public List<String> getProperties() {
        return this.properties;
    }

    public void setProperties(List<String> properties) {
        this.properties = properties;
    }

    public List<Filter> getFilterList() {
        return this.filters;
    }

    public List<String> getFilters() {
        List<String> rtn = new ArrayList<String>(this.filters.size());
        for (Filter f : this.filters) {
            rtn.add(f.toString());
        }
        return Collections.unmodifiableList(rtn);
    }

    public void setFilters(List<String> filterStrings) {
        for (String s : filterStrings) {
            this.filters.add(Filter.newInstance(s));
        }
    }

    public String getMatchMode() {
        return this.matchMode;
    }

    public void setMatchMode(String matchMode) {
        this.matchMode = matchMode;
    }

    public void setIgnoreCase(boolean ignoreCase) {
        this.ignoreCase = ignoreCase;
    }

    public boolean isIgnoreCase() {
        return this.ignoreCase;
    }
}
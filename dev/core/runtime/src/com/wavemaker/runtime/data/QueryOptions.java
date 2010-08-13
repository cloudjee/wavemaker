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
package com.wavemaker.runtime.data;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.criterion.MatchMode;

import com.wavemaker.runtime.data.util.DataServiceUtils;
import com.wavemaker.runtime.service.PagingOptions;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class QueryOptions extends PagingOptions {

    private MatchMode matchMode = MatchMode.START;

    private boolean ignoreCase = true;

    private boolean excludeNone = true;

    private boolean excludeZeros = true;
    
    private List<String> sqlRestrictions = new ArrayList<String>();
    
    public QueryOptions() {
    }

    public QueryOptions(long limit) {
        super(limit);
    }

    public QueryOptions(long limit, long offset) {
        super(limit, offset);
    }

    public QueryOptions(PagingOptions po) {
        super(po);
    }

    public QueryOptions(MatchMode matchMode) {
        this.matchMode = matchMode;
    }

    public MatchMode getTypedMatchMode() {
        return matchMode;
    }

    // convenience method
    public void matchMode(MatchMode matchMode) {
        this.matchMode = matchMode;
    }

    /**
     * anywhere, exact, start, end
     * default is: start
     */
    public void setMatchMode(String matchMode) {
        this.matchMode = DataServiceUtils.parseMatchMode(matchMode);
    }
    
    public void addSqlRestriction(String  s) {
        sqlRestrictions.add(s);
    }
    
    public void setSqlRestrictions(List<String> sqlRestrictions) {
        this.sqlRestrictions = sqlRestrictions;
    }

    public List<String> getSqlRestrictions() {
        return sqlRestrictions;
    }

    public void setIgnoreCase(boolean ignoreCase) {
        this.ignoreCase = ignoreCase;
    }

    public boolean getIgnoreCase() {
        return ignoreCase;
    }

    public void setExcludeZeros(boolean excludeZeros) {
        this.excludeZeros = excludeZeros;
    }

    public boolean getExcludeZeros() {
        return excludeZeros;
    }

    public boolean getExcludeNone() {
        return excludeNone;
    }

    public void setExcludeNone(boolean excludeNone) {
        this.excludeNone = excludeNone;
    }
}

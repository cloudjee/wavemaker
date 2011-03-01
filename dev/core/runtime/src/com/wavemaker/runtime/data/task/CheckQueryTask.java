/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
package com.wavemaker.runtime.data.task;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.type.Type;

import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.runtime.data.DataServiceQueryException;
import com.wavemaker.runtime.data.Task;
import com.wavemaker.runtime.data.DataServiceMetaData;
import com.wavemaker.runtime.data.util.DataServiceUtils;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class CheckQueryTask extends QueryTask implements Task {

    @Override
    public Object run(Session session, String dbName, Object... input) {

        Map<String, BindParameter> bindParams = handleBindParameters(input);

        Query query = createQuery(session, input);

        // MAV-1224
        checkQueryReturnAliases(query);

        // MAV-1873
        checkBindParameters(bindParams);

        return null;
    }

    @Override
    public String getName() {
        return "Built-in Check Query Task";
    }

    private void checkBindParameters(Map<String, BindParameter> bindParams) {

        Collection<String> illegalIdentifiers = new ArrayList<String>();

        for (String name : bindParams.keySet()) {
            if (!StringUtils.isValidJavaIdentifier(name)) {
                illegalIdentifiers.add(name);
            }
        }
        if (!illegalIdentifiers.isEmpty()) {
            throw new DataServiceQueryException(
                    "Bind parameter names must be legal java identifiers: "
                            + ObjectUtils.toString(illegalIdentifiers));
        }
    }
    
    private void checkQueryReturnAliases(Query query) {

        if (query.getReturnAliases() == null) {
            return;
        }

        Collection<String> upperCaseAliases = new ArrayList<String>();
        Collection<String> illegalIdentifiers = new ArrayList<String>();

        Type[] types = query.getReturnTypes();

        List<String> names = DataServiceUtils
            .getColumnNames(types.length, 
                            Arrays.asList(query.getReturnAliases()));

        for (String name : names) {
            if (Character.isUpperCase(name.charAt(0))) {
                upperCaseAliases.add(name);
            }
            if (!StringUtils.isValidJavaIdentifier(name)) {
                illegalIdentifiers.add(name);
            }
        }
        if (!upperCaseAliases.isEmpty()) {
            throw new DataServiceQueryException(
                    "Query return aliases cannot start with upper-case letters: "
                            + ObjectUtils.toString(upperCaseAliases));
        }
        if (!illegalIdentifiers.isEmpty()) {
            throw new DataServiceQueryException(
                    "Query return aliases must be legal java identifiers: "
                            + ObjectUtils.toString(illegalIdentifiers));
        }
    }
}

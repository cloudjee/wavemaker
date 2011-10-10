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

package com.wavemaker.tools.data;

import java.io.IOException;
import java.util.List;

import org.apache.commons.io.output.ByteArrayOutputStream;

import com.wavemaker.common.util.StringUtils;
import com.wavemaker.runtime.data.DataServiceOperation;
import com.wavemaker.runtime.data.util.DataServiceUtils;
import com.wavemaker.tools.service.codegen.BeanGenerator;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class OperationWrapperGenerator {

    private BeanInfo beanInfo = null;

    private static final String CLOB_TYPE = "java.sql.Clob";

    private static final String BLOB_TYPE = "java.sql.Blob";

    public String generate(String className, DataServiceOperation operation) {

        this.beanInfo = new BeanInfo(className);

        BeanGenerator generator = new BeanGenerator(className);

        generator.addClassJavadoc("Generated for query \"" + operation.getQueryName() + "\" on " + StringUtils.getFormattedDate());

        List<String> outputTypes = operation.getOutputTypes();
        List<String> outputNames = DataServiceUtils.getColumnNames(outputTypes.size(), operation.getOutputNames());

        int i = 0;
        boolean addSerializableMember = false;
        for (String type : operation.getOutputTypes()) {
            String name = outputNames.get(i);
            generator.addProperty(name, type);
            this.beanInfo.addProperty(name, type);
            i++;

            if (type.equals(CLOB_TYPE) || type.equals(BLOB_TYPE)) {
                addSerializableMember = true;
            }
        }

        ByteArrayOutputStream os = new ByteArrayOutputStream();

        try {
            if (addSerializableMember == false) {
                generator.generate(os);
            } else {
                generator.generateAux(os);
            }
        } catch (IOException ex) {
            throw new AssertionError(ex);
        }
        return os.toString();
    }

    public BeanInfo getBeanInfo() {
        return this.beanInfo;
    }
}

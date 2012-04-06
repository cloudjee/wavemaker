/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

import org.hibernate.cfg.Configuration;

import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.XMLUtils;
import com.wavemaker.runtime.data.DataServiceDefinition;

/**
 * @author Simon Toens
 */
public abstract class GenerationContext {

    public static final String CONTEXT_NAME = "agcontext";

    protected final DataServiceDefinition def;

    private final String serviceName;

    private final boolean useIndividualCRUDOperations;

    public GenerationContext(String serviceName, Configuration cfg, boolean useIndividualCRUDOperations) {

        this.def = new DataServiceDefinition(serviceName, cfg, true, useIndividualCRUDOperations);

        this.serviceName = XMLUtils.escape(serviceName);

        this.useIndividualCRUDOperations = useIndividualCRUDOperations;
    }

    public DataServiceDefinition getDataServiceDefinition() {
        return this.def;
    }

    public String getDate() {
        return XMLUtils.escape(StringUtils.getFormattedDate());
    }

    public String getServiceName() {
        return this.serviceName;
    }

    public void dispose() {
        this.def.dispose();
    }

    public String getPropref() {
        return "${";
    }

    public String getUseIndividualCRUDOperations() {
        return String.valueOf(this.useIndividualCRUDOperations);
    }
}

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
package com.wavemaker.tools.data;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import org.hibernate.mapping.Property;
import org.hibernate.tool.hbm2x.GenericExporter;
import org.hibernate.tool.hbm2x.TemplateProducer;

import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.XMLUtils;
import com.wavemaker.runtime.data.DataServiceMetaData;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.data.util.DataServiceUtils;

public class QueryExporter extends GenericExporter {

    private static final String TEMPLATE = "/com/wavemaker/tools/data/Queries.ftl";

    private final String serviceName;

    public QueryExporter(String serviceName) {

        setTemplateName(TEMPLATE);

        this.serviceName = serviceName;
    }

    public void doStart() {

        Map<String, Context> additionalContext = new HashMap<String, Context>(1);

        Context ctx = new Context(serviceName);

        additionalContext.put(GenerationContext.CONTEXT_NAME, ctx);

        try {

            Class<?> entity = ctx.getEntity();

            String s = StringUtils.packageToSrcFilePath(entity.getName())
                    + DataServiceConstants.QUERY_EXT;

            TemplateProducer producer = new TemplateProducer(
                    getTemplateHelper(), getArtifactCollector());

            File path = new File(getOutputDirectory(), s);

            producer.produce(additionalContext, getTemplateName(), path,
                    getTemplateName());

        } finally {
            ctx.dispose();
        }
    }

    public String getName() {
        return "query exporter";
    }

    public class Context extends GenerationContext {

        private final Class<?> entity;

        Context(String serviceName) {

            super(serviceName, getConfiguration(), false);

            this.entity = DataServiceUtils.getTypesForGeneratedQueries(def.getMetaData())
                    .iterator().next();
        }

        public String getEntityName() {
            return XMLUtils.escape(entity.getSimpleName());
        }

        public String getEntityType() {
            return XMLUtils.escape(entity.getName());
        }

        public Class<?> getEntity() {
            return entity;
        }

        public String getIdType() {
            DataServiceMetaData m = getDataServiceDefinition().getMetaData();
            String id = m.getIdPropertyName(entity);
            Property p = m.getProperty(entity.getName(), id);
            return XMLUtils.escape(p.getType().getReturnedClass().getName());
        }
    }
}

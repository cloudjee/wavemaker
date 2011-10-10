/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.project;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;

import com.mongodb.Mongo;

/**
 * Mongo Config
 * 
 * @author Ed Callahan
 * 
 */
@Configuration
public class TestMongoConfig extends AbstractMongoConfiguration {

    private static String dbName = "localhost";

    @Override
    public @Bean
    Mongo mongo() throws Exception {
        return new Mongo(dbName);
    }

    @Override
    public @Bean
    MongoTemplate mongoTemplate() throws Exception {
        return new MongoTemplate(mongo(), "testDB");
    }

    public @Bean
    SimpleMongoDbFactory mongoFactory() throws Exception {
        return new SimpleMongoDbFactory(mongo(), "testGridFSDB");
    }

    @Override
    public String getDatabaseName() {
        return dbName;
    }

}

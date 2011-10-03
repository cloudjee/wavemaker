package com.wavemaker.common.io;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.*;
import org.springframework.data.mongodb.config.*;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import com.mongodb.Mongo;

public class TestMongoConfig extends AbstractMongoConfiguration {

private static String dbName = "localhost";
	
	@Override
	public @Bean Mongo mongo() throws Exception {
		return new Mongo(dbName);
	}
 
	@Override
	public @Bean MongoTemplate mongoTemplate() throws Exception {
		return new MongoTemplate(mongo(),"testDB");
	}
	
	public @Bean SimpleMongoDbFactory mongoFactory() throws Exception{
		return new SimpleMongoDbFactory(mongo(),"testGridFSDB");
	}

	@Override
	public String getDatabaseName() {
		return dbName;
	}
	
}

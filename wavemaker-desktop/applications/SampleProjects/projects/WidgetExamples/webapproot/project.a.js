wm.JsonRpcService.smdCache['runtimeService.smd'] = {
	"methods": [{
		"name": "delete",
		"operationType": null,
		"parameters": [{
			"name": "serviceName",
			"type": "java.lang.String"
		}, {
			"name": "typeName",
			"type": "java.lang.String"
		}, {
			"name": "objectToDelete",
			"type": "java.lang.Object"
		}],
		"returnType": null
	}, {
		"name": "echo",
		"operationType": null,
		"parameters": [{
			"name": "contents",
			"type": "java.lang.String"
		}, {
			"name": "contentType",
			"type": "java.lang.String"
		}, {
			"name": "fileName",
			"type": "java.lang.String"
		}],
		"returnType": "com.wavemaker.runtime.server.DownloadResponse"
	}, {
		"name": "getInternalRuntime",
		"operationType": null,
		"parameters": null,
		"returnType": "com.wavemaker.runtime.server.InternalRuntime"
	}, {
		"name": "getLocalHostIP",
		"operationType": null,
		"parameters": null,
		"returnType": "java.lang.String"
	}, {
		"name": "getProperty",
		"operationType": null,
		"parameters": [{
			"name": "instance",
			"type": "java.lang.Object"
		}, {
			"name": "type",
			"type": "java.lang.String"
		}, {
			"name": "propertyName",
			"type": "java.lang.String"
		}],
		"returnType": "java.lang.Object"
	}, {
		"name": "getRuntimeAccess",
		"operationType": null,
		"parameters": null,
		"returnType": "com.wavemaker.runtime.RuntimeAccess"
	}, {
		"name": "getServiceEventNotifier",
		"operationType": null,
		"parameters": null,
		"returnType": "com.wavemaker.runtime.service.events.ServiceEventNotifier"
	}, {
		"name": "getServiceManager",
		"operationType": null,
		"parameters": null,
		"returnType": "com.wavemaker.runtime.service.ServiceManager"
	}, {
		"name": "getServiceWire",
		"operationType": null,
		"parameters": [{
			"name": "serviceName",
			"type": "java.lang.String"
		}, {
			"name": "typeName",
			"type": "java.lang.String"
		}],
		"returnType": "com.wavemaker.runtime.service.ServiceWire"
	}, {
		"name": "getSessionId",
		"operationType": null,
		"parameters": null,
		"returnType": "java.lang.String"
	}, {
		"name": "getTypeManager",
		"operationType": null,
		"parameters": null,
		"returnType": "com.wavemaker.runtime.service.TypeManager"
	}, {
		"name": "insert",
		"operationType": null,
		"parameters": [{
			"name": "serviceName",
			"type": "java.lang.String"
		}, {
			"name": "typeName",
			"type": "java.lang.String"
		}, {
			"name": "objectToInsert",
			"type": "java.lang.Object"
		}],
		"returnType": "com.wavemaker.runtime.service.TypedServiceReturn"
	}, {
		"name": "read",
		"operationType": null,
		"parameters": [{
			"name": "serviceName",
			"type": "java.lang.String"
		}, {
			"name": "typeName",
			"type": "java.lang.String"
		}, {
			"name": "instance",
			"type": "java.lang.Object"
		}, {
			"name": "propertyOptions",
			"type": "com.wavemaker.runtime.service.PropertyOptions"
		}, {
			"name": "pagingOptions",
			"type": "com.wavemaker.runtime.service.PagingOptions"
		}],
		"returnType": "com.wavemaker.runtime.service.TypedServiceReturn"
	}, {
		"name": "setInternalRuntime",
		"operationType": null,
		"parameters": [{
			"name": "internalRuntime",
			"type": "com.wavemaker.runtime.server.InternalRuntime"
		}],
		"returnType": null
	}, {
		"name": "setRuntimeAccess",
		"operationType": null,
		"parameters": [{
			"name": "runtimeAccess",
			"type": "com.wavemaker.runtime.RuntimeAccess"
		}],
		"returnType": null
	}, {
		"name": "setServiceEventNotifier",
		"operationType": null,
		"parameters": [{
			"name": "serviceEventNotifier",
			"type": "com.wavemaker.runtime.service.events.ServiceEventNotifier"
		}],
		"returnType": null
	}, {
		"name": "setServiceManager",
		"operationType": null,
		"parameters": [{
			"name": "serviceManager",
			"type": "com.wavemaker.runtime.service.ServiceManager"
		}],
		"returnType": null
	}, {
		"name": "setTypeManager",
		"operationType": null,
		"parameters": [{
			"name": "typeManager",
			"type": "com.wavemaker.runtime.service.TypeManager"
		}],
		"returnType": null
	}, {
		"name": "shiftDeserializedProperties",
		"operationType": null,
		"parameters": [{
			"name": "index",
			"type": "int"
		}],
		"returnType": null
	}, {
		"name": "update",
		"operationType": null,
		"parameters": [{
			"name": "serviceName",
			"type": "java.lang.String"
		}, {
			"name": "typeName",
			"type": "java.lang.String"
		}, {
			"name": "objectToUpdate",
			"type": "java.lang.Object"
		}],
		"returnType": "com.wavemaker.runtime.service.TypedServiceReturn"
	}],
	"serviceType": "JSON-RPC",
	"serviceURL": "runtimeService.json"
};
wm.JsonRpcService.smdCache['wavemakerService.smd'] = {
	"methods": [{
		"name": "echo",
		"operationType": null,
		"parameters": [{
			"name": "contents",
			"type": "java.lang.String"
		}, {
			"name": "contentType",
			"type": "java.lang.String"
		}, {
			"name": "fileName",
			"type": "java.lang.String"
		}],
		"returnType": "com.wavemaker.runtime.server.DownloadResponse"
	}, {
		"name": "getInternalRuntime",
		"operationType": null,
		"parameters": null,
		"returnType": "com.wavemaker.runtime.server.InternalRuntime"
	}, {
		"name": "getLocalHostIP",
		"operationType": null,
		"parameters": null,
		"returnType": "java.lang.String"
	}, {
		"name": "getRuntimeAccess",
		"operationType": null,
		"parameters": null,
		"returnType": "com.wavemaker.runtime.RuntimeAccess"
	}, {
		"name": "getServerTimeOffset",
		"operationType": null,
		"parameters": null,
		"returnType": "int"
	}, {
		"name": "getServiceEventNotifier",
		"operationType": null,
		"parameters": null,
		"returnType": "com.wavemaker.runtime.service.events.ServiceEventNotifier"
	}, {
		"name": "getServiceManager",
		"operationType": null,
		"parameters": null,
		"returnType": "com.wavemaker.runtime.service.ServiceManager"
	}, {
		"name": "getServiceWire",
		"operationType": null,
		"parameters": [{
			"name": "serviceName",
			"type": "java.lang.String"
		}, {
			"name": "typeName",
			"type": "java.lang.String"
		}],
		"returnType": "com.wavemaker.runtime.service.ServiceWire"
	}, {
		"name": "getSessionId",
		"operationType": null,
		"parameters": null,
		"returnType": "java.lang.String"
	}, {
		"name": "getTypeManager",
		"operationType": null,
		"parameters": null,
		"returnType": "com.wavemaker.runtime.service.TypeManager"
	}, {
		"name": "remoteRESTCall",
		"operationType": null,
		"parameters": [{
			"name": "remoteURL",
			"type": "java.lang.String"
		}, {
			"name": "params",
			"type": "java.lang.String"
		}, {
			"name": "method",
			"type": "java.lang.String"
		}],
		"returnType": "java.lang.String"
	}, {
		"name": "setInternalRuntime",
		"operationType": null,
		"parameters": [{
			"name": "internalRuntime",
			"type": "com.wavemaker.runtime.server.InternalRuntime"
		}],
		"returnType": null
	}, {
		"name": "setRuntimeAccess",
		"operationType": null,
		"parameters": [{
			"name": "runtimeAccess",
			"type": "com.wavemaker.runtime.RuntimeAccess"
		}],
		"returnType": null
	}, {
		"name": "setServiceEventNotifier",
		"operationType": null,
		"parameters": [{
			"name": "serviceEventNotifier",
			"type": "com.wavemaker.runtime.service.events.ServiceEventNotifier"
		}],
		"returnType": null
	}, {
		"name": "setServiceManager",
		"operationType": null,
		"parameters": [{
			"name": "serviceManager",
			"type": "com.wavemaker.runtime.service.ServiceManager"
		}],
		"returnType": null
	}, {
		"name": "setTypeManager",
		"operationType": null,
		"parameters": [{
			"name": "typeManager",
			"type": "com.wavemaker.runtime.service.TypeManager"
		}],
		"returnType": null
	}],
	"serviceType": "JSON-RPC",
	"serviceURL": "waveMakerService.json"
};
wm.types = {
	"types": {
		"boolean": {
			"internal": true,
			"primitiveType": "Boolean"
		},
		"byte": {
			"internal": true,
			"primitiveType": "Number"
		},
		"char": {
			"internal": true,
			"primitiveType": "String"
		},
		"com.sampledatadb.data.Actor": {
			"fields": {
				"actorId": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				},
				"filmActors": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": false,
					"type": "com.sampledatadb.data.FilmActor"
				},
				"firstName": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"lastName": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "sampledataDB"
		},
		"com.sampledatadb.data.Address": {
			"fields": {
				"address": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"address2": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"addressId": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				},
				"city": {
					"exclude": [],
					"fieldOrder": 6,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "com.sampledatadb.data.City"
				},
				"customers": {
					"exclude": [],
					"fieldOrder": 7,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": false,
					"type": "com.sampledatadb.data.Customer"
				},
				"district": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"phone": {
					"exclude": [],
					"fieldOrder": 5,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"postalCode": {
					"exclude": [],
					"fieldOrder": 4,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"stores": {
					"exclude": [],
					"fieldOrder": 8,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": false,
					"type": "com.sampledatadb.data.Store"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "sampledataDB"
		},
		"com.sampledatadb.data.City": {
			"fields": {
				"addresses": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": false,
					"type": "com.sampledatadb.data.Address"
				},
				"city": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"cityId": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				},
				"country": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.sampledatadb.data.Country"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "sampledataDB"
		},
		"com.sampledatadb.data.Country": {
			"fields": {
				"cities": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": false,
					"type": "com.sampledatadb.data.City"
				},
				"country": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"countryId": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "sampledataDB"
		},
		"com.sampledatadb.data.Customer": {
			"fields": {
				"active": {
					"exclude": [],
					"fieldOrder": 4,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.Integer"
				},
				"address": {
					"exclude": [],
					"fieldOrder": 6,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "com.sampledatadb.data.Address"
				},
				"createDate": {
					"exclude": [],
					"fieldOrder": 5,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.util.Date"
				},
				"customerId": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				},
				"email": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"firstName": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"lastName": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"store": {
					"exclude": [],
					"fieldOrder": 7,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "com.sampledatadb.data.Store"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "sampledataDB"
		},
		"com.sampledatadb.data.Department": {
			"fields": {
				"budget": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.Integer"
				},
				"deptcode": {
					"exclude": [],
					"fieldOrder": 7,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"deptid": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				},
				"employees": {
					"exclude": [],
					"fieldOrder": 10,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": false,
					"type": "com.sampledatadb.data.Employee"
				},
				"location": {
					"exclude": [],
					"fieldOrder": 8,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"name": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"q1": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.Integer"
				},
				"q2": {
					"exclude": [],
					"fieldOrder": 4,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.Integer"
				},
				"q3": {
					"exclude": [],
					"fieldOrder": 5,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.Integer"
				},
				"q4": {
					"exclude": [],
					"fieldOrder": 6,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.Integer"
				},
				"tenantid": {
					"exclude": [],
					"fieldOrder": 9,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.Integer"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "sampledataDB"
		},
		"com.sampledatadb.data.Employee": {
			"fields": {
				"birthdate": {
					"exclude": [],
					"fieldOrder": 7,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.util.Date"
				},
				"city": {
					"exclude": [],
					"fieldOrder": 4,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"department": {
					"exclude": [],
					"fieldOrder": 12,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "com.sampledatadb.data.Department"
				},
				"eid": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				},
				"employee": {
					"exclude": [],
					"fieldOrder": 11,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "com.sampledatadb.data.Employee"
				},
				"employees": {
					"exclude": [],
					"fieldOrder": 14,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": false,
					"type": "com.sampledatadb.data.Employee"
				},
				"firstname": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"lastname": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"picurl": {
					"exclude": [],
					"fieldOrder": 8,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"state": {
					"exclude": [],
					"fieldOrder": 5,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"street": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"tenantid": {
					"exclude": [],
					"fieldOrder": 10,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.Integer"
				},
				"twitterid": {
					"exclude": [],
					"fieldOrder": 9,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"vacations": {
					"exclude": [],
					"fieldOrder": 13,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": false,
					"type": "com.sampledatadb.data.Vacation"
				},
				"zip": {
					"exclude": [],
					"fieldOrder": 6,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "sampledataDB"
		},
		"com.sampledatadb.data.Film": {
			"fields": {
				"description": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"filmActors": {
					"exclude": [],
					"fieldOrder": 10,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": false,
					"type": "com.sampledatadb.data.FilmActor"
				},
				"filmId": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				},
				"inventories": {
					"exclude": [],
					"fieldOrder": 11,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": false,
					"type": "com.sampledatadb.data.Inventory"
				},
				"length": {
					"exclude": [],
					"fieldOrder": 6,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.Integer"
				},
				"rating": {
					"exclude": [],
					"fieldOrder": 8,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"releaseYear": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"rentalDuration": {
					"exclude": [],
					"fieldOrder": 4,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				},
				"rentalRate": {
					"exclude": [],
					"fieldOrder": 5,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigDecimal"
				},
				"replacementCost": {
					"exclude": [],
					"fieldOrder": 7,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigDecimal"
				},
				"specialFeatures": {
					"exclude": [],
					"fieldOrder": 9,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"title": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "sampledataDB"
		},
		"com.sampledatadb.data.FilmActor": {
			"fields": {
				"actor": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.sampledatadb.data.Actor"
				},
				"film": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.sampledatadb.data.Film"
				},
				"id": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": ["delete", "read", "update", "insert"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "com.sampledatadb.data.FilmActorId"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "sampledataDB"
		},
		"com.sampledatadb.data.FilmActorId": {
			"fields": {
				"actorId": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": ["delete", "read", "update", "insert"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				},
				"filmId": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": ["delete", "read", "update", "insert"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "sampledataDB"
		},
		"com.sampledatadb.data.Inventory": {
			"fields": {
				"film": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.sampledatadb.data.Film"
				},
				"inventoryId": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				},
				"store": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.sampledatadb.data.Store"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "sampledataDB"
		},
		"com.sampledatadb.data.Store": {
			"fields": {
				"address": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.sampledatadb.data.Address"
				},
				"customers": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": false,
					"type": "com.sampledatadb.data.Customer"
				},
				"inventories": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": false,
					"type": "com.sampledatadb.data.Inventory"
				},
				"storeId": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "sampledataDB"
		},
		"com.sampledatadb.data.User": {
			"fields": {
				"password": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"role": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"tenantid": {
					"exclude": [],
					"fieldOrder": 4,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.Integer"
				},
				"userid": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				},
				"username": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "sampledataDB"
		},
		"com.sampledatadb.data.Vacation": {
			"fields": {
				"employee": {
					"exclude": [],
					"fieldOrder": 4,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.sampledatadb.data.Employee"
				},
				"enddate": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.util.Date"
				},
				"id": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				},
				"startdate": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.util.Date"
				},
				"tenantid": {
					"exclude": [],
					"fieldOrder": 3,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.Integer"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "sampledataDB"
		},
		"com.wavemaker.runtime.service.PagingOptions": {
			"fields": {
				"firstResult": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Long"
				},
				"maxResults": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Long"
				},
				"orderBy": {
					"exclude": [],
					"fieldOrder": 2,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": true,
			"liveService": false,
			"service": "runtimeService"
		},
		"com.wavemaker.runtime.service.PropertyOptions": {
			"fields": {
				"filters": {
					"exclude": [],
					"fieldOrder": 1,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.wavemaker.runtime.service.Filter"
				},
				"properties": {
					"exclude": [],
					"fieldOrder": 0,
					"fieldSubType": null,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": true,
			"liveService": false,
			"service": "runtimeService"
		},
		"double": {
			"internal": true,
			"primitiveType": "Number"
		},
		"float": {
			"internal": true,
			"primitiveType": "Number"
		},
		"int": {
			"internal": true,
			"primitiveType": "Number"
		},
		"java.lang.Boolean": {
			"internal": false,
			"primitiveType": "Boolean"
		},
		"java.lang.Byte": {
			"internal": false,
			"primitiveType": "Number"
		},
		"java.lang.Character": {
			"internal": false,
			"primitiveType": "String"
		},
		"java.lang.Double": {
			"internal": false,
			"primitiveType": "Number"
		},
		"java.lang.Float": {
			"internal": false,
			"primitiveType": "Number"
		},
		"java.lang.Integer": {
			"internal": false,
			"primitiveType": "Number"
		},
		"java.lang.Long": {
			"internal": false,
			"primitiveType": "Number"
		},
		"java.lang.Short": {
			"internal": false,
			"primitiveType": "Number"
		},
		"java.lang.String": {
			"internal": false,
			"primitiveType": "String"
		},
		"java.lang.StringBuffer": {
			"internal": false,
			"primitiveType": "String"
		},
		"java.math.BigDecimal": {
			"internal": false,
			"primitiveType": "Number"
		},
		"java.math.BigInteger": {
			"internal": false,
			"primitiveType": "Number"
		},
		"java.sql.Date": {
			"internal": false,
			"primitiveType": "Date"
		},
		"java.sql.Time": {
			"internal": false,
			"primitiveType": "Date"
		},
		"java.sql.Timestamp": {
			"internal": false,
			"primitiveType": "Date"
		},
		"java.util.Date": {
			"internal": false,
			"primitiveType": "Date"
		},
		"long": {
			"internal": true,
			"primitiveType": "Number"
		},
		"short": {
			"internal": true,
			"primitiveType": "Number"
		}
	}
};
wm.Application.themeData['wm_coolblue'] = {"wm.ToggleButton":{"border":"1","borderColor":"#333333"},"wm.ToggleButtonPanel":{"border":"1","borderColor":"#333333"},"wm.Button":{"border":"1","borderColor":"#333333","height":"32px"},"wm.Layout":{"border":"0","borderColor":"#333333"},"wm.Bevel":{"bevelSize":"10","border":"1","borderColor":"#333333"},"wm.Splitter":{"bevelSize":"4","border":"1","borderColor":"#333333"},"wm.AccordionDecorator":{"captionBorder":"1","captionBorderColor":"#333333"},"wm.AccordionLayers":{"border":"0","borderColor":"#333333","captionBorder":"2","layerBorder":"1","captionHeight":"30"},"wm.FancyPanel":{"margin":"2","border":"0","borderColor":"#999999","innerBorder":"2","labelHeight":"24"},"wm.TabLayers":{"layersType":"Tabs","margin":"0,2,0,2","clientBorder":"1","border":"0","clientBorderColor":"#999999","headerHeight":"30px","borderColor":"#999999","mobileHeaderHeight":"38px"},"wm.WizardLayers":{"margin":"0,2,0,2","border":"0","clientBorder":"1","clientBorderColor":"#333333"},"wm.Layer":{},"wm.Dialog":{"border":"1","borderColor":"#333333","titlebarBorder":"0,0,1,0","titlebarBorderColor":"#333333","containerClass":"MainContent","titlebarHeight":"22"},"wm.GenericDialog":{"border":"1","borderColor":"#333333","titlebarBorder":"0,0,1,0","titlebarBorderColor":"#333333","footerBorder":"1,0,0,0","footerBorderColor":"#333333","containerClass":"MainContent"},"wm.RichTextDialog":{"border":"1","borderColor":"#333333","titlebarBorder":"0,0,1,0","titlebarBorderColor":"#333333","footerBorder":"1,0,0,0","footerBorderColor":"#333333","containerClass":"MainContent"},"wm.PageDialog":{"border":"1","borderColor":"#333333","titlebarBorder":"0,0,1,0","titlebarBorderColor":"#333333","footerBorder":"1,0,0,0","footerBorderColor":"#333333","noBevel":true,"containerClass":"MainContent"},"wm.DesignableDialog":{"border":"1","borderColor":"#333333","titlebarBorder":"0,0,1,0","titlebarBorderColor":"#333333","footerBorder":"1,0,0,0","footerBorderColor":"#333333","containerClass":"MainContent"},"wm.DojoMenu":{"padding":"0","border":"0","borderColor":"#333333"},"wm.List":{"margin":"0,2,0,2","border":"2","borderColor":"#333333"},"wm.dijit.ProgressBar":{"border":"0","borderColor":"#333333"},"wm.RichText":{"border":"0","borderColor":"#333333"},"wm.RoundedButton":{"border":"0","borderColor":"#333333"},"wm.DataGrid":{"border":"2","borderColor":"#333333"},"wm.Label":{},"wm.Picture":{},"wm.Spacer":{},"wm.Layers":{"border":"0"},"wm.PageContainer":{},"wm.Panel":{"borderColor":"#333333","border":"0"},"wm.CheckBoxEditor":{},"wm.CurrencyEditor":{},"wm.Text":{"border":"0"},"wm.SelectMenu":{"border":"0"},"wm.dijit.Calendar":{},"wm.DojoGrid":{"border":"1","borderColor":"#999999"},"wm.Control":{"borderColor":"#333333"},"wm.BusyButton":{"border":"1","borderColor":"#333333"},"wm.Checkbox":{"border":"0"},"wm.ColorPicker":{"border":"0"},"wm.Currency":{"border":"0"},"wm.Date":{"border":"0"},"wm.Number":{"border":"0"},"wm.RadioButton":{"border":"0"},"wm.Slider":{"border":"0"},"wm.LargeTextArea":{"border":"0"},"wm.Time":{"border":"0"},"wm.WidgetsJsDialog":{"containerClass":"MainContent","border":"1","borderColor":"#333333"},"wm.FileUploadDialog":{"containerClass":"MainContent","border":"1","borderColor":"#333333"},"wm.ColorPickerDialog":{"border":"1","borderColor":"#333333"},"wm.MainContentPanel":{"border":"1","borderColor":"#ffffff"},"wm.HeaderContentPanel":{"border":"1","borderColor":"#888888"},"wm.EmphasizedContentPanel":{"border":"0","borderColor":"#333333"},"wm.WidgetList":{},"wm.PopupMenuButton":{}};
dojo.declare("WidgetExamples", wm.Application, {
	"dialogAnimationTime": 350, 
	"disableDirtyEditorTracking": false, 
	"eventDelay": 0, 
	"i18n": false, 
	"isSecurityEnabled": false, 
	"main": "Main", 
	"manageHistory": true, 
	"manageURL": true, 
	"name": "", 
	"phoneGapLoginPage": "Login", 
	"phoneMain": "", 
	"projectSubVersion": 2, 
	"projectVersion": "3", 
	"saveCounter": 251, 
	"showIOSPhoneGapBackButton": false, 
	"studioVersion": "6.5.0.M4", 
	"tabletMain": "", 
	"theme": "wm_coolblue", 
	"toastPosition": "br", 
	"touchToClickDelay": 500, 
	"touchToRightClickDelay": 1500,
	"widgets": {
		silkIconList: ["wm.ImageList", {"colCount":39,"height":16,"iconCount":90,"url":"lib/images/silkIcons/silk.png","width":16}, {}], 
		departmentLiveView1: ["wm.LiveView", {"dataType":"com.sampledatadb.data.Department","service":"sampledataDB","view":[{"caption":"Deptid","sortable":true,"dataIndex":"deptid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"subType":null},{"caption":"Name","sortable":true,"dataIndex":"name","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"subType":null},{"caption":"Budget","sortable":true,"dataIndex":"budget","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"subType":null},{"caption":"Q1","sortable":true,"dataIndex":"q1","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"subType":null},{"caption":"Q2","sortable":true,"dataIndex":"q2","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"subType":null},{"caption":"Q3","sortable":true,"dataIndex":"q3","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"subType":null},{"caption":"Q4","sortable":true,"dataIndex":"q4","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":6,"subType":null},{"caption":"Deptcode","sortable":true,"dataIndex":"deptcode","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":7,"subType":null},{"caption":"Location","sortable":true,"dataIndex":"location","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":8,"subType":null},{"caption":"Tenantid","sortable":true,"dataIndex":"tenantid","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":9,"subType":null}]}, {}], 
		deptLiveView: ["wm.LiveView", {"dataType":"com.sampledatadb.data.Department","related":["employees"],"service":"sampledataDB","view":[{"caption":"Deptid","sortable":true,"dataIndex":"deptid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":2000,"subType":null,"widthUnits":"px"},{"caption":"Name","sortable":true,"dataIndex":"name","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2001,"subType":null,"widthUnits":"px"},{"caption":"Budget","sortable":true,"dataIndex":"budget","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2002,"subType":null,"widthUnits":"px"},{"caption":"Q1","sortable":true,"dataIndex":"q1","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2003,"subType":null,"widthUnits":"px"},{"caption":"Q2","sortable":true,"dataIndex":"q2","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2004,"subType":null,"widthUnits":"px"},{"caption":"Q3","sortable":true,"dataIndex":"q3","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2005,"subType":null,"widthUnits":"px"},{"caption":"Q4","sortable":true,"dataIndex":"q4","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2006,"subType":null,"widthUnits":"px"},{"caption":"Deptcode","sortable":true,"dataIndex":"deptcode","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2007,"subType":null,"widthUnits":"px"},{"caption":"Location","sortable":true,"dataIndex":"location","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2008,"subType":null,"widthUnits":"px"},{"caption":"Tenantid","sortable":true,"dataIndex":"tenantid","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":2009,"subType":null,"widthUnits":"px"},{"caption":"Firstname","sortable":true,"dataIndex":"employees.firstname","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3001},{"caption":"Lastname","sortable":true,"dataIndex":"employees.lastname","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3002}]}, {}], 
		empLiveView: ["wm.LiveView", {"dataType":"com.sampledatadb.data.Employee","related":["employee","department","vacations","employees"],"service":"sampledataDB","view":[{"caption":"Eid","sortable":true,"dataIndex":"eid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":6000,"subType":null,"widthUnits":"px"},{"caption":"Firstname","sortable":true,"dataIndex":"firstname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":6001,"subType":null,"widthUnits":"px"},{"caption":"Lastname","sortable":true,"dataIndex":"lastname","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":6002,"subType":null,"widthUnits":"px"},{"caption":"Street","sortable":true,"dataIndex":"street","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":6003,"subType":null,"widthUnits":"px"},{"caption":"City","sortable":true,"dataIndex":"city","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":6004,"subType":null,"widthUnits":"px"},{"caption":"State","sortable":true,"dataIndex":"state","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":6005,"subType":null,"widthUnits":"px"},{"caption":"Zip","sortable":true,"dataIndex":"zip","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":6006,"subType":null,"widthUnits":"px"},{"caption":"Birthdate","sortable":true,"dataIndex":"birthdate","type":"java.util.Date","displayType":"Date","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":6007,"subType":null,"widthUnits":"px"},{"caption":"Picurl","sortable":true,"dataIndex":"picurl","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":6008,"subType":null,"widthUnits":"px"},{"caption":"Twitterid","sortable":true,"dataIndex":"twitterid","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":6009,"subType":null,"widthUnits":"px"},{"caption":"Tenantid","sortable":true,"dataIndex":"tenantid","type":"java.lang.Integer","displayType":"Number","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":6010,"subType":null,"widthUnits":"px"},{"caption":"Firstname","sortable":true,"dataIndex":"employee.firstname","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":7001},{"caption":"Lastname","sortable":true,"dataIndex":"employee.lastname","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":7002},{"caption":"Name","sortable":true,"dataIndex":"department.name","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":8001},{"caption":"Startdate","sortable":true,"dataIndex":"vacations.startdate","type":"java.util.Date","displayType":"Date","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":9001},{"caption":"Enddate","sortable":true,"dataIndex":"vacations.enddate","type":"java.util.Date","displayType":"Date","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":9002},{"caption":"Firstname","sortable":true,"dataIndex":"employees.firstname","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":10001},{"caption":"Lastname","sortable":true,"dataIndex":"employees.lastname","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":10002},{"caption":"Picurl","sortable":true,"dataIndex":"employees.picurl","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":10008}]}, {}], 
		deptLiveVar: ["wm.LiveVariable", {"autoUpdate":false,"liveSource":"com.sampledatadb.data.Department","type":"com.sampledatadb.data.Department"}, {}], 
		empLiveVar: ["wm.LiveVariable", {"autoUpdate":false,"liveSource":"com.sampledatadb.data.Employee","type":"com.sampledatadb.data.Employee"}, {}], 
		layerNameVar: ["wm.Variable", {"type":"StringData"}, {}]
	},
	_end: 0
});

WidgetExamples.extend({


  _end: 0
});
WidgetExamples.prototype._css = '';

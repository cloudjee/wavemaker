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
wm.JsonRpcService.smdCache['waveMakerService.smd'] = {
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
		"name": "getLocalHostIP",
		"operationType": null,
		"parameters": null,
		"returnType": "java.lang.String"
	}, {
		"name": "getServerTimeOffset",
		"operationType": null,
		"parameters": null,
		"returnType": "int"
	}, {
		"name": "getSessionId",
		"operationType": null,
		"parameters": null,
		"returnType": "java.lang.String"
	}, {
		"name": "hostToDomain",
		"operationType": null,
		"parameters": [{
			"name": "host",
			"type": "java.lang.String"
		}],
		"returnType": "java.lang.String"
	}, {
		"name": "proxyCheck",
		"operationType": null,
		"parameters": [{
			"name": "remoteURL",
			"type": "java.lang.String"
		}],
		"returnType": null
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
		"com.data.Comment": {
			"fields": {
				"cid": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				},
				"createdate": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.util.Date"
				},
				"description": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"flag": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				},
				"rel2Issue": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.data.Issue"
				},
				"rel2User": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.data.User"
				},
				"tid": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "issuecloudv2"
		},
		"com.data.Issue": {
			"fields": {
				"closedate": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.util.Date"
				},
				"comments": {
					"exclude": [],
					"fieldOrder": 17,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": false,
					"type": "com.data.Comment"
				},
				"createdate": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.util.Date"
				},
				"description": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"flag": {
					"exclude": [],
					"fieldOrder": 10,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				},
				"iid": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				},
				"issuetype": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"name": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"path": {
					"exclude": [],
					"fieldOrder": 11,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"priority": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"rel2Project": {
					"exclude": [],
					"fieldOrder": 12,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.data.Project"
				},
				"rel2UserAssigned": {
					"exclude": [],
					"fieldOrder": 16,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "com.data.User"
				},
				"rel2UserReported": {
					"exclude": [],
					"fieldOrder": 15,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "com.data.User"
				},
				"rel2VersionFixed": {
					"exclude": [],
					"fieldOrder": 14,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "com.data.Version"
				},
				"rel2VersionReported": {
					"exclude": [],
					"fieldOrder": 13,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "com.data.Version"
				},
				"status": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"summary": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"tid": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "issuecloudv2"
		},
		"com.data.Project": {
			"fields": {
				"description": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"flag": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				},
				"issues": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": false,
					"type": "com.data.Issue"
				},
				"name": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"pid": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				},
				"prefix": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"tid": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				},
				"url": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"versions": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": false,
					"type": "com.data.Version"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "issuecloudv2"
		},
		"com.data.Role": {
			"fields": {
				"rid": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				},
				"role": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "issuecloudv2"
		},
		"com.data.Status": {
			"fields": {
				"name": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"sid": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "issuecloudv2"
		},
		"com.data.Tenant": {
			"fields": {
				"accountnumber": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				},
				"address": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"billcode": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.Integer"
				},
				"companyname": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"createdate": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.util.Date"
				},
				"flag": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				},
				"phone": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"tid": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "issuecloudv2"
		},
		"com.data.User": {
			"fields": {
				"comments": {
					"exclude": [],
					"fieldOrder": 10,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": false,
					"type": "com.data.Comment"
				},
				"createdate": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.util.Date"
				},
				"email": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"firstname": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"flag": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				},
				"issues": {
					"exclude": [],
					"fieldOrder": 11,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": false,
					"type": "com.data.Issue"
				},
				"lastname": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"password": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"role": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"tid": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				},
				"uid": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				},
				"username": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "issuecloudv2"
		},
		"com.data.Version": {
			"fields": {
				"description": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.lang.String"
				},
				"flag": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				},
				"issues": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": false,
					"type": "com.data.Issue"
				},
				"name": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"rel2Project": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.data.Project"
				},
				"releasedate": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": false,
					"type": "java.util.Date"
				},
				"status": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"tid": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				},
				"vid": {
					"exclude": ["insert"],
					"fieldOrder": 0,
					"include": ["delete", "read", "update"],
					"isList": false,
					"noChange": ["delete", "read", "update"],
					"required": true,
					"type": "java.lang.Integer"
				}
			},
			"internal": false,
			"liveService": true,
			"service": "issuecloudv2"
		},
		"com.data.output.GetCommentContentRtnType": {
			"fields": {
				"comment": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"date": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.util.Date"
				},
				"reporter": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "issuecloudv2"
		},
		"com.data.output.GetCommentEmailsRtnType": {
			"fields": {
				"email": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "issuecloudv2"
		},
		"com.data.output.GetIssueByCriticalRtnType": {
			"fields": {
				"issueId": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				},
				"name": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"summary": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "issuecloudv2"
		},
		"com.data.output.GetIssueByPriorityRtnType": {
			"fields": {
				"number": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Long"
				},
				"priority": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "issuecloudv2"
		},
		"com.data.output.GetIssueByTypeRtnType": {
			"fields": {
				"number": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Long"
				},
				"type": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "issuecloudv2"
		},
		"com.data.output.GetIssueContentRtnType": {
			"fields": {
				"assignee": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"description": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"fixedversion": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"key": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"project": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"reportedversion": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"reporter": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"status": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"summary": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"type": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "issuecloudv2"
		},
		"com.data.output.GetIssueEmailsRtnType": {
			"fields": {
				"assignee": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"reporter": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "issuecloudv2"
		},
		"com.data.output.GetMAxIssuesByProjectRtnType": {
			"fields": {
				"max": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Long"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "issuecloudv2"
		},
		"com.data.output.GetProjectPrefixRtnType": {
			"fields": {
				"pfx": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "issuecloudv2"
		},
		"com.data.output.GetTenantByUserRtnType": {
			"fields": {
				"tenant": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "issuecloudv2"
		},
		"com.data.output.GetUserByIdRtnType": {
			"fields": {
				"email": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"firstname": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"lastname": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "issuecloudv2"
		},
		"com.data.output.GetVersionByProjectRtnType": {
			"fields": {
				"name": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "issuecloudv2"
		},
		"com.wavemaker.runtime.server.DownloadResponse": {
			"fields": {
				"contentType": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"contents": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.io.InputStream"
				},
				"fileName": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "jsFiles"
		},
		"com.wavemaker.runtime.service.PagingOptions": {
			"fields": {
				"firstResult": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Long"
				},
				"maxResults": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Long"
				},
				"orderBy": {
					"exclude": [],
					"fieldOrder": 2,
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
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.wavemaker.runtime.service.Filter"
				},
				"properties": {
					"exclude": [],
					"fieldOrder": 0,
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
		"org.springframework.web.multipart.MultipartFile": {
			"fields": {
				"bytes": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "byte"
				},
				"contentType": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"empty": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "boolean"
				},
				"inputStream": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.io.InputStream"
				},
				"name": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"originalFilename": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"size": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "long"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "jsFiles"
		},
		"short": {
			"internal": true,
			"primitiveType": "Number"
		}
	}
};
wm.Application.themeData['wm_notheme'] = {"wm.Control":{"borderColor":"#FBFBFB"},"wm.ToggleButton":{"border":"1","borderColor":"#ABB8CF"},"wm.ToggleButtonPanel":{"border":"1","borderColor":"#ABB8CF"},"wm.Button":{"border":"1","borderColor":"#ABB8CF","height":"32px"},"wm.RoundedButton":{"border":"0","borderColor":"#ABB8CF"},"wm.Layout":{"border":"0"},"wm.Bevel":{"bevelSize":4,"border":"0"},"wm.Splitter":{"bevelSize":"4","border":"0"},"wm.AccordionDecorator":{"captionBorder":"0,0,1,0","captionBorderColor":"#FBFBFB"},"wm.AccordionLayers":{"border":"0"},"wm.FancyPanel":{"margin":"2","innerBorder":"2","border":"0","labelHeight":"30"},"wm.TabLayers":{"layersType":"Tabs","margin":"0,2,0,2","border":"0","borderColor":"","clientBorder":"0","clientBorderColor":"#FBFBFB"},"wm.WizardLayers":{"margin":"0,2,0,2","border":"0","clientBorder":"0","clientBorderColor":"#FBFBFB"},"wm.Layer":{},"wm.Dialog":{"border":"0","titlebarBorder":"1","titlebarBorderColor":"#FBFBFB","footerBorder":"1","footerBorderColor":"#FBFBFB","titlebarHeight":"23"},"wm.GenericDialog":{"border":"1","titlebarBorder":"1","titlebarBorderColor":"#FBFBFB","footerBorder":"1","footerBorderColor":"#FBFBFB"},"wm.RichTextDialog":{"border":"1","titlebarBorder":"1","titlebarBorderColor":"#FBFBFB","footerBorder":"1","footerBorderColor":"#FBFBFB"},"wm.PageDialog":{"border":"1","titlebarBorder":"1","titlebarBorderColor":"#FBFBFB","footerBorder":"1","footerBorderColor":"#FBFBFB","noBevel":true},"wm.DesignableDialog":{"border":"1","titlebarBorder":"1","titlebarBorderColor":"#FBFBFB","footerBorder":"1","footerBorderColor":"#FBFBFB","noBevel":true},"wm.DojoMenu":{"padding":"0","border":"0","borderColor":"#000000"},"wm.List":{"margin":"0","border":"0"},"wm.dijit.ProgressBar":{"border":"0"},"wm.RichText":{"border":"0","borderColor":"#B3B3B3"},"wm.DataGrid":{"border":"0"},"wm.Label":{},"wm.Picture":{},"wm.Spacer":{},"wm.Layers":{"border":"0"},"wm.PageContainer":{},"wm.Panel":{},"wm.CheckBoxEditor":{},"wm.CurrencyEditor":{},"wm.Text":{"border":undefined},"wm.SelectMenu":{},"wm.dijit.Calendar":{"border":"0"},"wm.DojoGrid":{"border":"0"}};
dojo.declare("IssueCloud61", wm.Application, {
	"dialogAnimationTime": 350, 
	"disableDirtyEditorTracking": false, 
	"eventDelay": 0, 
	"i18n": false, 
	"isLoginPageEnabled": true, 
	"isSecurityEnabled": true, 
	"main": "Main", 
	"manageHistory": true, 
	"manageURL": false, 
	"name": "", 
	"phoneGapLoginPage": "Login", 
	"phoneMain": "", 
	"projectSubVersion": 5, 
	"projectVersion": 1, 
	"studioVersion": "6.5.2.Release", 
	"tabletMain": "", 
	"theme": "wm_notheme", 
	"toastPosition": "br", 
	"touchToClickDelay": 500, 
	"touchToRightClickDelay": 1500,
	"widgets": {
		commentView: ["wm.LiveView", {"dataType":"com.data.Comment","related":["rel2Issue","rel2User"],"service":"issuecloudv2","view":[{"caption":"Iid","sortable":true,"dataIndex":"rel2Issue.iid","type":"java.lang.Integer","displayType":"Number","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":0},{"caption":"Uid","sortable":true,"dataIndex":"rel2User.uid","type":"java.lang.Integer","displayType":"Number","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":0},{"caption":"Cid","sortable":true,"dataIndex":"cid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"widthUnits":"px"},{"caption":"Tid","sortable":true,"dataIndex":"tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"widthUnits":"px"},{"caption":"Firstname","sortable":true,"dataIndex":"rel2User.firstname","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":2},{"caption":"Createdate","sortable":true,"dataIndex":"createdate","type":"java.util.Date","displayType":"Date","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"widthUnits":"px"},{"caption":"Lastname","sortable":true,"dataIndex":"rel2User.lastname","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3},{"caption":"Description","sortable":true,"dataIndex":"description","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"widthUnits":"px"},{"caption":"Flag","sortable":true,"dataIndex":"flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"widthUnits":"px"},{"caption":"Summary","sortable":true,"dataIndex":"rel2Issue.summary","type":"java.lang.String","displayType":"Text","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":6}]}, {}], 
		viewSearchProject: ["wm.LiveView", {"dataType":"com.data.Project","related":["versions"],"service":"issuecloudv2","view":[{"caption":"Pid","sortable":true,"dataIndex":"pid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":true,"includeLists":true,"includeForms":true,"order":0,"widthUnits":"px"},{"caption":"Vid","sortable":true,"dataIndex":"versions.vid","type":"java.lang.Integer","displayType":"Number","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":0},{"caption":"Tid","sortable":true,"dataIndex":"tid","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":1,"widthUnits":"px"},{"caption":"Tid","sortable":true,"dataIndex":"versions.tid","type":"java.lang.Integer","displayType":"Number","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":1},{"caption":"Name","sortable":true,"dataIndex":"name","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":2,"widthUnits":"px"},{"caption":"Name","sortable":true,"dataIndex":"versions.name","type":"java.lang.String","displayType":"Text","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":2},{"caption":"Description","sortable":true,"dataIndex":"description","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":3,"widthUnits":"px"},{"caption":"Description","sortable":true,"dataIndex":"versions.description","type":"java.lang.String","displayType":"Text","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":3},{"caption":"Url","sortable":true,"dataIndex":"url","type":"java.lang.String","displayType":"Text","required":false,"readonly":false,"includeLists":true,"includeForms":true,"order":4,"widthUnits":"px"},{"caption":"Releasedate","sortable":true,"dataIndex":"versions.releasedate","type":"java.util.Date","displayType":"Date","required":false,"widthUnits":"px","includeLists":true,"includeForms":true,"order":4},{"caption":"Prefix","sortable":true,"dataIndex":"prefix","type":"java.lang.String","displayType":"Text","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":5,"widthUnits":"px"},{"caption":"Status","sortable":true,"dataIndex":"versions.status","type":"java.lang.String","displayType":"Text","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":5},{"caption":"Flag","sortable":true,"dataIndex":"flag","type":"java.lang.Integer","displayType":"Number","required":true,"readonly":false,"includeLists":true,"includeForms":true,"order":6,"widthUnits":"px"},{"caption":"Flag","sortable":true,"dataIndex":"versions.flag","type":"java.lang.Integer","displayType":"Number","required":true,"widthUnits":"px","includeLists":true,"includeForms":true,"order":6}]}, {}], 
		svGetID: ["wm.ServiceVariable", {"operation":"getUserId","service":"securityService","startUpdate":true}, {"onSuccess":"liveReporter"}, {
			input: ["wm.ServiceInput", {"type":"getUserIdInputs"}, {}]
		}], 
		vCommentId: ["wm.Variable", {"type":"NumberData"}, {}], 
		vIssueId: ["wm.Variable", {"type":"NumberData"}, {}], 
		vPriority: ["wm.Variable", {"isList":true,"json":"[{\n\"name\":\"Minor\"\n},{\n\"name\":\"Major\"\n},{\n\"name\":\"Critical\"\n},{\n\"name\":\"Blocker\"\n}]","type":"EntryData"}, {}], 
		vStatus: ["wm.Variable", {"isList":true,"json":"[{\n\"name\":\"Open\"\n},{\n\"name\":\"In Progress\"\n},{\n\"name\":\"Closed\"\n}]","type":"EntryData"}, {}], 
		vType: ["wm.Variable", {"isList":true,"json":"[{\n\"name\":\"Bug\"\n},{\n\"name\":\"Improvement\"\n},{\n\"name\":\"New feature\"\n}]","type":"EntryData"}, {}]
	},
	_end: 0
});

IssueCloud61.extend({

	_end: 0});
IssueCloud61.prototype._css = '@import "/wavemaker/lib/wm/base/widget/themes/wm_notheme/theme.css";\
button.wmbutton:hover {\
background: rgb(80,80,80) none !important;\
}\
';
wm.addFrameworkFix("wm.PageLoader", null, function() {
wm.PageLoader.extend({
testForSecurityErrrors: function(path) {
    if (app.isSecurityEnabled) {
        try {
            var result = dojo._getText(path);
            if (result.match(/^\<\!DOCTYPE/) && result.match(/new\s*wm\.Application\(/)) {
                this.isSecurityError = true;
                throw "SecurityError";
            }
        } catch(e) {}
    }
}})});
wm.addFrameworkFix("wm.SelectMenu", ["build.Gzipped.wm_editors"], function() {
    wm.dijit.form.ComboBox.extend({
        createDropDown: function() {
        this.dropDown = new wm.Dialog({owner: this.owner,
                           corner: wm.device == "phone" ? "cc" : "cc",
                           fixPositionNode: wm.device == "tablet" ? this.focusNode : undefined,
                           width: wm.device == "phone" ? "100%" : "350px",
                           height: wm.device == "phone" ? "100%" : "600px",
                           border: "1",
                           borderColor: "#666",
                           useContainerWidget: true,
                           padding: "0",
                           margin: "10",
                           title: "",//this.owner.caption,  need this back if we reduce the margin
                           destroyRecursive: function() {if (!this.isDestroyed) this.destroy();} // this === this.dropDown
                          });
        this.dropDown.dialogScrim.connect(this.dropDown.dialogScrim.domNode, wm.isFakeMobile ? "onclick" : "ontouchstart", this.dropDown, "hide");
        var c = this.dropDown.containerWidget;
        c.setPadding("0");
        c.setMargin("0");

        this.listSet = wm.ListSet({owner: this.dropDown,
                    parent: c,
                       _noFilter: this.noFilter,
                    selectionMode: "radio",
                    captionAlign: "left",
                    captionPosition: "top",
                    caption: "",//this.owner.caption,
                    //captionSize: "20px",
                    border: "0",
                    editorBorder: false,
                    padding: "0",
                    width: "100%",
                    height: "100%",
                       onchange: dojo.hitch(this, function(inDisplayValue, inDataValue, inSetByCode) {
                        if (this._cupdating || inSetByCode) return;
                        if (this._cupdating || inSetByCode) return;
                        var data = this.owner.allowNone && this.listSet.grid.getSelectedIndex() == 0 ? null : this.listSet.grid.selectedItem.getData();
                        var value = data ? this.owner._getDisplayData(data) : null;

                        if (data || this.listSet.grid.getSelectedIndex() == 0) {
                            this.set("value", value);
                            if (data) {
                                data.name = this.listSet.grid.getCell(this.listSet.grid.getSelectedIndex(),"name");
                            }
                            this.set("item", data);
                            this.displayedValue = value;
                            this.owner.changed();

                            this.closeDropDown();
                            this.dropDown.hide();

                        }
                    })
                       });
        this.listSet.grid.setSelectionMode("radio");
        this.closeButton = new wm.ToolButton({owner: this.owner,
                              name: "closeButton",
                              border: "1",
                              borderColor: "#222",
                              _classes: {domNode: ["SelectCloseButton"]},
                              width: "30px",
                              height: "100%",
                              margin: "4",
                              padding: "0 4 0 4",
                              parent: this.dropDown.titleBar,
                              caption: "X",
                              onclick: dojo.hitch(this, function() {
                              this.closeDropDown();
                              this.dropDown.hide();
                              })});
    }
})
});
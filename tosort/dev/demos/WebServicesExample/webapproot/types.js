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
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Accessories": {
			"fields": {
				"accessories": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Accessories.Accessory"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Accessories.Accessory": {
			"fields": {
				"ASIN": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"title": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.AddressType": {
			"fields": {
				"address1": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"address2": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"address3": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"city": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"country": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
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
				"postalCode": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"state": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Arguments": {
			"fields": {
				"arguments": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Arguments.Argument"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Arguments.Argument": {
			"fields": {
				"name": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.BrowseNode": {
			"fields": {
				"ancestors": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.BrowseNode.Ancestors"
				},
				"browseNodeId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"children": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.BrowseNode.Children"
				},
				"name": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.BrowseNode.Ancestors": {
			"fields": {
				"browseNodes": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.BrowseNode"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.BrowseNode.Children": {
			"fields": {
				"browseNodes": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.BrowseNode"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.BrowseNodeLookup": {
			"fields": {
				"XMLEscaping": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"associateTag": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"requests": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.BrowseNodeLookupRequestType"
				},
				"shared": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.BrowseNodeLookupRequestType"
				},
				"subscriptionId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"validate": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.BrowseNodeLookupRequestType": {
			"fields": {
				"browseNodeIds": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.BrowseNodeLookupResponse": {
			"fields": {
				"browseNodes": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.BrowseNodes"
				},
				"operationRequest": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.BrowseNodes": {
			"fields": {
				"browseNodes": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.BrowseNode"
				},
				"request": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Request"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Cart": {
			"fields": {
				"HMAC": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"URLEncodedHMAC": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"cartId": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"cartItems": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartItems"
				},
				"purchaseURL": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"request": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Request"
				},
				"savedForLaterItems": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SavedForLaterItems"
				},
				"similarProducts": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SimilarProducts"
				},
				"subTotal": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartAdd": {
			"fields": {
				"XMLEscaping": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"associateTag": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"requests": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartAddRequestType"
				},
				"shared": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartAddRequestType"
				},
				"subscriptionId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"validate": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartAddRequestType": {
			"fields": {
				"HMAC": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"cartId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"items": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartAddRequestType.Items"
				},
				"mergeCart": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartAddRequestType.Items": {
			"fields": {
				"items": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartAddRequestType.Items.Item"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartAddRequestType.Items.Item": {
			"fields": {
				"ASIN": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"associateTag": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"listItemId": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"offerListingId": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"quantity": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartAddResponse": {
			"fields": {
				"carts": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Cart"
				},
				"operationRequest": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartClear": {
			"fields": {
				"XMLEscaping": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"associateTag": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"requests": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartClearRequestType"
				},
				"shared": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartClearRequestType"
				},
				"subscriptionId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"validate": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartClearRequestType": {
			"fields": {
				"HMAC": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"cartId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"mergeCart": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartClearResponse": {
			"fields": {
				"carts": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Cart"
				},
				"operationRequest": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartCreate": {
			"fields": {
				"XMLEscaping": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"associateTag": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"requests": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartCreateRequestType"
				},
				"shared": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartCreateRequestType"
				},
				"subscriptionId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"validate": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartCreateRequestType": {
			"fields": {
				"items": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartCreateRequestType.Items"
				},
				"mergeCart": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartCreateRequestType.Items": {
			"fields": {
				"items": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartCreateRequestType.Items.Item"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartCreateRequestType.Items.Item": {
			"fields": {
				"ASIN": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"associateTag": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"listItemId": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"offerListingId": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"quantity": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartCreateResponse": {
			"fields": {
				"carts": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Cart"
				},
				"operationRequest": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartGet": {
			"fields": {
				"XMLEscaping": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"associateTag": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"requests": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartGetRequestType"
				},
				"shared": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartGetRequestType"
				},
				"subscriptionId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"validate": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartGetRequestType": {
			"fields": {
				"HMAC": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"cartId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"mergeCart": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartGetResponse": {
			"fields": {
				"carts": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Cart"
				},
				"operationRequest": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartItemType": {
			"fields": {
				"ASIN": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"cartItemId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"exchangeId": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"itemTotal": {
					"exclude": [],
					"fieldOrder": 12,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				},
				"listOwner": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"listType": {
					"exclude": [],
					"fieldOrder": 10,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"merchantId": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"price": {
					"exclude": [],
					"fieldOrder": 11,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				},
				"productGroup": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"quantity": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"sellerId": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"sellerNickname": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"title": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartItems": {
			"fields": {
				"cartItems": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartItemType"
				},
				"subTotal": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartModify": {
			"fields": {
				"XMLEscaping": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"associateTag": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"requests": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartModifyRequestType"
				},
				"shared": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartModifyRequestType"
				},
				"subscriptionId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"validate": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartModifyRequestType": {
			"fields": {
				"HMAC": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"cartId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"items": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartModifyRequestType.Items"
				},
				"mergeCart": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartModifyRequestType.Items": {
			"fields": {
				"items": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartModifyRequestType.Items.Item"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartModifyRequestType.Items.Item": {
			"fields": {
				"action": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"cartItemId": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"quantity": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartModifyResponse": {
			"fields": {
				"carts": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Cart"
				},
				"operationRequest": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Customer": {
			"fields": {
				"birthday": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"customerId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"customerReviews": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CustomerReviews"
				},
				"location": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Customer.Location"
				},
				"nickname": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"wishListId": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Customer.Location": {
			"fields": {
				"city": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"country": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"state": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CustomerContentLookup": {
			"fields": {
				"XMLEscaping": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"associateTag": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"requests": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CustomerContentLookupRequestType"
				},
				"shared": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CustomerContentLookupRequestType"
				},
				"subscriptionId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"validate": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CustomerContentLookupRequestType": {
			"fields": {
				"customerId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"reviewPage": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CustomerContentLookupResponse": {
			"fields": {
				"customers": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Customers"
				},
				"operationRequest": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CustomerContentSearch": {
			"fields": {
				"XMLEscaping": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"associateTag": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"requests": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CustomerContentSearchRequestType"
				},
				"shared": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CustomerContentSearchRequestType"
				},
				"subscriptionId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"validate": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CustomerContentSearchRequestType": {
			"fields": {
				"customerPage": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"email": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
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
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CustomerContentSearchResponse": {
			"fields": {
				"customers": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Customers"
				},
				"operationRequest": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CustomerReviews": {
			"fields": {
				"averageRating": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigDecimal"
				},
				"reviews": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Review"
				},
				"totalReviewPages": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalReviews": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Customers": {
			"fields": {
				"customers": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Customer"
				},
				"request": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Request"
				},
				"totalPages": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalResults": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType": {
			"fields": {
				"units": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigDecimal"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.EditorialReview": {
			"fields": {
				"content": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"source": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.EditorialReviews": {
			"fields": {
				"editorialReviews": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.EditorialReview"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Errors": {
			"fields": {
				"errors": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Errors.Error"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Errors.Error": {
			"fields": {
				"code": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"message": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.HTTPHeaders": {
			"fields": {
				"headers": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.HTTPHeaders.Header"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.HTTPHeaders.Header": {
			"fields": {
				"name": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Help": {
			"fields": {
				"associateTag": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"requests": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.HelpRequestType"
				},
				"shared": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.HelpRequestType"
				},
				"subscriptionId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"validate": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.HelpRequestType": {
			"fields": {
				"about": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"helpType": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.HelpResponse": {
			"fields": {
				"informations": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Information"
				},
				"operationRequest": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ImageSet": {
			"fields": {
				"category": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"largeImage": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ImageType"
				},
				"mediumImage": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ImageType"
				},
				"smallImage": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ImageType"
				},
				"swatchImage": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ImageType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ImageType": {
			"fields": {
				"URL": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"height": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"isVerified": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"width": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Information": {
			"fields": {
				"operationInformations": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationInformation"
				},
				"request": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Request"
				},
				"responseGroupInformations": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ResponseGroupInformation"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Item": {
			"fields": {
				"ASIN": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"accessories": {
					"exclude": [],
					"fieldOrder": 16,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Accessories"
				},
				"browseNodes": {
					"exclude": [],
					"fieldOrder": 18,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.BrowseNodes"
				},
				"customerReviews": {
					"exclude": [],
					"fieldOrder": 13,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CustomerReviews"
				},
				"detailPageURL": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"editorialReviews": {
					"exclude": [],
					"fieldOrder": 14,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.EditorialReviews"
				},
				"errors": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Errors"
				},
				"imageSets": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Item.ImageSets"
				},
				"itemAttributes": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemAttributes"
				},
				"largeImage": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ImageType"
				},
				"listmaniaLists": {
					"exclude": [],
					"fieldOrder": 19,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListmaniaLists"
				},
				"mediumImage": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ImageType"
				},
				"offerSummary": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OfferSummary"
				},
				"offers": {
					"exclude": [],
					"fieldOrder": 10,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Offers"
				},
				"promotionalTag": {
					"exclude": [],
					"fieldOrder": 21,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PromotionalTag"
				},
				"salesRank": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"searchInside": {
					"exclude": [],
					"fieldOrder": 20,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SearchInside"
				},
				"similarProducts": {
					"exclude": [],
					"fieldOrder": 15,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SimilarProducts"
				},
				"smallImage": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ImageType"
				},
				"tracks": {
					"exclude": [],
					"fieldOrder": 17,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Tracks"
				},
				"variationSummary": {
					"exclude": [],
					"fieldOrder": 11,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.VariationSummary"
				},
				"variations": {
					"exclude": [],
					"fieldOrder": 12,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Variations"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Item.ImageSets": {
			"fields": {
				"imageSets": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ImageSet"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemAttributes": {
			"fields": {
				"CDRWDescription": {
					"exclude": [],
					"fieldOrder": 25,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"CPUManufacturer": {
					"exclude": [],
					"fieldOrder": 36,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"CPUSpeed": {
					"exclude": [],
					"fieldOrder": 37,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"CPUType": {
					"exclude": [],
					"fieldOrder": 38,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"DVDLayers": {
					"exclude": [],
					"fieldOrder": 50,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"DVDRWDescription": {
					"exclude": [],
					"fieldOrder": 51,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"DVDSides": {
					"exclude": [],
					"fieldOrder": 52,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"EAN": {
					"exclude": [],
					"fieldOrder": 53,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"ESRBAgeRating": {
					"exclude": [],
					"fieldOrder": 55,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"ISBN": {
					"exclude": [],
					"fieldOrder": 87,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"ISOEquivalent": {
					"exclude": [],
					"fieldOrder": 91,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.NonNegativeIntegerWithUnitsType"
				},
				"UPC": {
					"exclude": [],
					"fieldOrder": 214,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"actors": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"address": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.AddressType"
				},
				"amazonMaximumAge": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"amazonMinimumAge": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"apertureModes": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"artists": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"aspectRatio": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"audienceRating": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"audioFormats": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"authors": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"backFinding": {
					"exclude": [],
					"fieldOrder": 10,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"bandMaterialType": {
					"exclude": [],
					"fieldOrder": 11,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"batteries": {
					"exclude": [],
					"fieldOrder": 13,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.NonNegativeIntegerWithUnitsType"
				},
				"batteriesIncluded": {
					"exclude": [],
					"fieldOrder": 12,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"batteryDescription": {
					"exclude": [],
					"fieldOrder": 14,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"batteryType": {
					"exclude": [],
					"fieldOrder": 15,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"bezelMaterialType": {
					"exclude": [],
					"fieldOrder": 16,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"binding": {
					"exclude": [],
					"fieldOrder": 17,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"brand": {
					"exclude": [],
					"fieldOrder": 18,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"calendarType": {
					"exclude": [],
					"fieldOrder": 19,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"cameraManualFeatures": {
					"exclude": [],
					"fieldOrder": 20,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"caseDiameter": {
					"exclude": [],
					"fieldOrder": 21,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"caseMaterialType": {
					"exclude": [],
					"fieldOrder": 22,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"caseThickness": {
					"exclude": [],
					"fieldOrder": 23,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"caseType": {
					"exclude": [],
					"fieldOrder": 24,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"chainType": {
					"exclude": [],
					"fieldOrder": 26,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"claspType": {
					"exclude": [],
					"fieldOrder": 27,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"clothingSize": {
					"exclude": [],
					"fieldOrder": 28,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"color": {
					"exclude": [],
					"fieldOrder": 29,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"compatibility": {
					"exclude": [],
					"fieldOrder": 30,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"computerHardwareType": {
					"exclude": [],
					"fieldOrder": 31,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"computerPlatform": {
					"exclude": [],
					"fieldOrder": 32,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"connectivity": {
					"exclude": [],
					"fieldOrder": 33,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"continuousShootingSpeed": {
					"exclude": [],
					"fieldOrder": 34,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"country": {
					"exclude": [],
					"fieldOrder": 35,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"creators": {
					"exclude": [],
					"fieldOrder": 39,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemAttributes.Creator"
				},
				"cuisine": {
					"exclude": [],
					"fieldOrder": 40,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"delayBetweenShots": {
					"exclude": [],
					"fieldOrder": 41,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"department": {
					"exclude": [],
					"fieldOrder": 42,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"deweyDecimalNumber": {
					"exclude": [],
					"fieldOrder": 43,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"dialColor": {
					"exclude": [],
					"fieldOrder": 44,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"dialWindowMaterialType": {
					"exclude": [],
					"fieldOrder": 45,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"digitalZoom": {
					"exclude": [],
					"fieldOrder": 46,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"directors": {
					"exclude": [],
					"fieldOrder": 47,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"displaySize": {
					"exclude": [],
					"fieldOrder": 48,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"drumSetPieceQuantity": {
					"exclude": [],
					"fieldOrder": 49,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"edition": {
					"exclude": [],
					"fieldOrder": 54,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"externalDisplaySupportDescription": {
					"exclude": [],
					"fieldOrder": 56,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"fabricType": {
					"exclude": [],
					"fieldOrder": 57,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"faxNumber": {
					"exclude": [],
					"fieldOrder": 58,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"features": {
					"exclude": [],
					"fieldOrder": 59,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"firstIssueLeadTime": {
					"exclude": [],
					"fieldOrder": 60,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.StringWithUnitsType"
				},
				"floppyDiskDriveDescription": {
					"exclude": [],
					"fieldOrder": 61,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"formats": {
					"exclude": [],
					"fieldOrder": 62,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"gemType": {
					"exclude": [],
					"fieldOrder": 63,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"graphicsCardInterface": {
					"exclude": [],
					"fieldOrder": 64,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"graphicsDescription": {
					"exclude": [],
					"fieldOrder": 65,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"graphicsMemorySize": {
					"exclude": [],
					"fieldOrder": 66,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"guitarAttribute": {
					"exclude": [],
					"fieldOrder": 67,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"guitarBridgeSystem": {
					"exclude": [],
					"fieldOrder": 68,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"guitarPickThickness": {
					"exclude": [],
					"fieldOrder": 69,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"guitarPickupConfiguration": {
					"exclude": [],
					"fieldOrder": 70,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"hardDiskCount": {
					"exclude": [],
					"fieldOrder": 71,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"hardDiskSize": {
					"exclude": [],
					"fieldOrder": 72,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.NonNegativeIntegerWithUnitsType"
				},
				"hasAutoFocus": {
					"exclude": [],
					"fieldOrder": 73,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Boolean"
				},
				"hasBurstMode": {
					"exclude": [],
					"fieldOrder": 74,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Boolean"
				},
				"hasInCameraEditing": {
					"exclude": [],
					"fieldOrder": 75,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Boolean"
				},
				"hasRedEyeReduction": {
					"exclude": [],
					"fieldOrder": 76,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Boolean"
				},
				"hasSelfTimer": {
					"exclude": [],
					"fieldOrder": 77,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Boolean"
				},
				"hasTripodMount": {
					"exclude": [],
					"fieldOrder": 78,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Boolean"
				},
				"hasVideoOut": {
					"exclude": [],
					"fieldOrder": 79,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Boolean"
				},
				"hasViewfinder": {
					"exclude": [],
					"fieldOrder": 80,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Boolean"
				},
				"hoursOfOperation": {
					"exclude": [],
					"fieldOrder": 81,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"includedSoftware": {
					"exclude": [],
					"fieldOrder": 82,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"includesMp3Player": {
					"exclude": [],
					"fieldOrder": 83,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Boolean"
				},
				"ingredients": {
					"exclude": [],
					"fieldOrder": 84,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"instrumentKey": {
					"exclude": [],
					"fieldOrder": 85,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"isAutographed": {
					"exclude": [],
					"fieldOrder": 86,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Boolean"
				},
				"isFragile": {
					"exclude": [],
					"fieldOrder": 88,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Boolean"
				},
				"isLabCreated": {
					"exclude": [],
					"fieldOrder": 89,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Boolean"
				},
				"isMemorabilia": {
					"exclude": [],
					"fieldOrder": 90,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Boolean"
				},
				"issuesPerYear": {
					"exclude": [],
					"fieldOrder": 92,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"itemDimensions": {
					"exclude": [],
					"fieldOrder": 93,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemAttributes.ItemDimensions"
				},
				"keyboardDescription": {
					"exclude": [],
					"fieldOrder": 94,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"label": {
					"exclude": [],
					"fieldOrder": 95,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"languages": {
					"exclude": [],
					"fieldOrder": 96,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemAttributes.Languages"
				},
				"legalDisclaimer": {
					"exclude": [],
					"fieldOrder": 97,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"lineVoltage": {
					"exclude": [],
					"fieldOrder": 98,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"listPrice": {
					"exclude": [],
					"fieldOrder": 99,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				},
				"macroFocusRange": {
					"exclude": [],
					"fieldOrder": 100,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"magazineType": {
					"exclude": [],
					"fieldOrder": 101,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"malletHardness": {
					"exclude": [],
					"fieldOrder": 102,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"manufacturer": {
					"exclude": [],
					"fieldOrder": 103,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"manufacturerLaborWarrantyDescription": {
					"exclude": [],
					"fieldOrder": 104,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"manufacturerMaximumAge": {
					"exclude": [],
					"fieldOrder": 105,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"manufacturerMinimumAge": {
					"exclude": [],
					"fieldOrder": 106,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"manufacturerPartsWarrantyDescription": {
					"exclude": [],
					"fieldOrder": 107,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"materialType": {
					"exclude": [],
					"fieldOrder": 108,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"maximumAperture": {
					"exclude": [],
					"fieldOrder": 109,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"maximumColorDepth": {
					"exclude": [],
					"fieldOrder": 110,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"maximumFocalLength": {
					"exclude": [],
					"fieldOrder": 111,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.NonNegativeIntegerWithUnitsType"
				},
				"maximumHighResolutionImages": {
					"exclude": [],
					"fieldOrder": 112,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.NonNegativeIntegerWithUnitsType"
				},
				"maximumHorizontalResolution": {
					"exclude": [],
					"fieldOrder": 113,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.NonNegativeIntegerWithUnitsType"
				},
				"maximumLowResolutionImages": {
					"exclude": [],
					"fieldOrder": 114,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"maximumResolution": {
					"exclude": [],
					"fieldOrder": 115,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"maximumShutterSpeed": {
					"exclude": [],
					"fieldOrder": 116,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"maximumVerticalResolution": {
					"exclude": [],
					"fieldOrder": 117,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.NonNegativeIntegerWithUnitsType"
				},
				"maximumWeightRecommendation": {
					"exclude": [],
					"fieldOrder": 118,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"memorySlotsAvailable": {
					"exclude": [],
					"fieldOrder": 119,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"metalStamp": {
					"exclude": [],
					"fieldOrder": 120,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"metalType": {
					"exclude": [],
					"fieldOrder": 121,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"miniMovieDescription": {
					"exclude": [],
					"fieldOrder": 122,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"minimumFocalLength": {
					"exclude": [],
					"fieldOrder": 123,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.NonNegativeIntegerWithUnitsType"
				},
				"minimumShutterSpeed": {
					"exclude": [],
					"fieldOrder": 124,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"model": {
					"exclude": [],
					"fieldOrder": 125,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"modelYear": {
					"exclude": [],
					"fieldOrder": 126,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"modemDescription": {
					"exclude": [],
					"fieldOrder": 127,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"monitorSize": {
					"exclude": [],
					"fieldOrder": 128,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"monitorViewableDiagonalSize": {
					"exclude": [],
					"fieldOrder": 129,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"mouseDescription": {
					"exclude": [],
					"fieldOrder": 130,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"musicalStyle": {
					"exclude": [],
					"fieldOrder": 131,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"nativeResolution": {
					"exclude": [],
					"fieldOrder": 132,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"neighborhood": {
					"exclude": [],
					"fieldOrder": 133,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"networkInterfaceDescription": {
					"exclude": [],
					"fieldOrder": 134,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"notebookDisplayTechnology": {
					"exclude": [],
					"fieldOrder": 135,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"notebookPointingDeviceDescription": {
					"exclude": [],
					"fieldOrder": 136,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"numberOfDiscs": {
					"exclude": [],
					"fieldOrder": 137,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"numberOfIssues": {
					"exclude": [],
					"fieldOrder": 138,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"numberOfItems": {
					"exclude": [],
					"fieldOrder": 139,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"numberOfKeys": {
					"exclude": [],
					"fieldOrder": 140,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"numberOfPages": {
					"exclude": [],
					"fieldOrder": 141,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"numberOfPearls": {
					"exclude": [],
					"fieldOrder": 142,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"numberOfRapidFireShots": {
					"exclude": [],
					"fieldOrder": 143,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"numberOfStones": {
					"exclude": [],
					"fieldOrder": 144,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"numberOfStrings": {
					"exclude": [],
					"fieldOrder": 145,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"numberOfTracks": {
					"exclude": [],
					"fieldOrder": 146,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"opticalZoom": {
					"exclude": [],
					"fieldOrder": 147,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"outputWattage": {
					"exclude": [],
					"fieldOrder": 148,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"packageDimensions": {
					"exclude": [],
					"fieldOrder": 149,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemAttributes.PackageDimensions"
				},
				"pearlLustre": {
					"exclude": [],
					"fieldOrder": 150,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"pearlMinimumColor": {
					"exclude": [],
					"fieldOrder": 151,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"pearlShape": {
					"exclude": [],
					"fieldOrder": 152,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"pearlStringingMethod": {
					"exclude": [],
					"fieldOrder": 153,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"pearlSurfaceBlemishes": {
					"exclude": [],
					"fieldOrder": 154,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"pearlType": {
					"exclude": [],
					"fieldOrder": 155,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"pearlUniformity": {
					"exclude": [],
					"fieldOrder": 156,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"phoneNumber": {
					"exclude": [],
					"fieldOrder": 157,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"photoFlashTypes": {
					"exclude": [],
					"fieldOrder": 158,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"pictureFormats": {
					"exclude": [],
					"fieldOrder": 159,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"platforms": {
					"exclude": [],
					"fieldOrder": 160,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"priceRating": {
					"exclude": [],
					"fieldOrder": 161,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"processorCount": {
					"exclude": [],
					"fieldOrder": 162,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"productGroup": {
					"exclude": [],
					"fieldOrder": 163,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"promotionalTag": {
					"exclude": [],
					"fieldOrder": 164,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"publicationDate": {
					"exclude": [],
					"fieldOrder": 165,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"publisher": {
					"exclude": [],
					"fieldOrder": 166,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"readingLevel": {
					"exclude": [],
					"fieldOrder": 167,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"recorderTrackCount": {
					"exclude": [],
					"fieldOrder": 168,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"regionCode": {
					"exclude": [],
					"fieldOrder": 169,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"regionOfOrigin": {
					"exclude": [],
					"fieldOrder": 170,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"releaseDate": {
					"exclude": [],
					"fieldOrder": 171,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"removableMemory": {
					"exclude": [],
					"fieldOrder": 172,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"resolutionModes": {
					"exclude": [],
					"fieldOrder": 173,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"ringSize": {
					"exclude": [],
					"fieldOrder": 174,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"runningTime": {
					"exclude": [],
					"fieldOrder": 175,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.NonNegativeIntegerWithUnitsType"
				},
				"secondaryCacheSize": {
					"exclude": [],
					"fieldOrder": 176,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.NonNegativeIntegerWithUnitsType"
				},
				"settingType": {
					"exclude": [],
					"fieldOrder": 177,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"size": {
					"exclude": [],
					"fieldOrder": 178,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"sizePerPearl": {
					"exclude": [],
					"fieldOrder": 179,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"skillLevel": {
					"exclude": [],
					"fieldOrder": 180,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"soundCardDescription": {
					"exclude": [],
					"fieldOrder": 181,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"speakerCount": {
					"exclude": [],
					"fieldOrder": 182,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"speakerDescription": {
					"exclude": [],
					"fieldOrder": 183,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"specialFeatures": {
					"exclude": [],
					"fieldOrder": 184,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"stoneClarity": {
					"exclude": [],
					"fieldOrder": 185,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"stoneColor": {
					"exclude": [],
					"fieldOrder": 186,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"stoneCut": {
					"exclude": [],
					"fieldOrder": 187,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"stoneShape": {
					"exclude": [],
					"fieldOrder": 188,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"stoneWeight": {
					"exclude": [],
					"fieldOrder": 189,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"studio": {
					"exclude": [],
					"fieldOrder": 190,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"subscriptionLength": {
					"exclude": [],
					"fieldOrder": 191,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.NonNegativeIntegerWithUnitsType"
				},
				"supportedImageTypes": {
					"exclude": [],
					"fieldOrder": 192,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"systemBusSpeed": {
					"exclude": [],
					"fieldOrder": 193,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"systemMemorySize": {
					"exclude": [],
					"fieldOrder": 195,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.NonNegativeIntegerWithUnitsType"
				},
				"systemMemorySizeMax": {
					"exclude": [],
					"fieldOrder": 194,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.NonNegativeIntegerWithUnitsType"
				},
				"systemMemoryType": {
					"exclude": [],
					"fieldOrder": 196,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"theatricalReleaseDate": {
					"exclude": [],
					"fieldOrder": 197,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"title": {
					"exclude": [],
					"fieldOrder": 198,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"totalDiamondWeight": {
					"exclude": [],
					"fieldOrder": 199,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"totalExternalBaysFree": {
					"exclude": [],
					"fieldOrder": 200,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalFirewirePorts": {
					"exclude": [],
					"fieldOrder": 201,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalGemWeight": {
					"exclude": [],
					"fieldOrder": 202,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"totalInternalBaysFree": {
					"exclude": [],
					"fieldOrder": 203,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalMetalWeight": {
					"exclude": [],
					"fieldOrder": 204,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"totalNTSCPALPorts": {
					"exclude": [],
					"fieldOrder": 205,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalPCCardSlots": {
					"exclude": [],
					"fieldOrder": 207,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalPCISlotsFree": {
					"exclude": [],
					"fieldOrder": 208,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalParallelPorts": {
					"exclude": [],
					"fieldOrder": 206,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalSVideoOutPorts": {
					"exclude": [],
					"fieldOrder": 210,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalSerialPorts": {
					"exclude": [],
					"fieldOrder": 209,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalUSB2Ports": {
					"exclude": [],
					"fieldOrder": 211,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalUSBPorts": {
					"exclude": [],
					"fieldOrder": 212,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalVGAOutPorts": {
					"exclude": [],
					"fieldOrder": 213,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"variationDenomination": {
					"exclude": [],
					"fieldOrder": 215,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"variationDescription": {
					"exclude": [],
					"fieldOrder": 216,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"warranty": {
					"exclude": [],
					"fieldOrder": 217,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"watchMovementType": {
					"exclude": [],
					"fieldOrder": 218,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"waterResistanceDepth": {
					"exclude": [],
					"fieldOrder": 219,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"wirelessMicrophoneFrequency": {
					"exclude": [],
					"fieldOrder": 220,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemAttributes.Creator": {
			"fields": {
				"role": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemAttributes.ItemDimensions": {
			"fields": {
				"height": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"length": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"weight": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"width": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemAttributes.Languages": {
			"fields": {
				"languages": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemAttributes.Languages.Language"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemAttributes.Languages.Language": {
			"fields": {
				"audioFormat": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
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
				"type": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemAttributes.PackageDimensions": {
			"fields": {
				"height": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"length": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"weight": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				},
				"width": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.DecimalWithUnitsType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemLookup": {
			"fields": {
				"XMLEscaping": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"associateTag": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"requests": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemLookupRequestType"
				},
				"shared": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemLookupRequestType"
				},
				"subscriptionId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"validate": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemLookupRequestType": {
			"fields": {
				"ISPUPostalCode": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"condition": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"deliveryMethod": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"futureLaunchDate": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"idType": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"itemIds": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"merchantId": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"offerPage": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"reviewPage": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"searchIndex": {
					"exclude": [],
					"fieldOrder": 10,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"searchInsideKeywords": {
					"exclude": [],
					"fieldOrder": 11,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"variationPage": {
					"exclude": [],
					"fieldOrder": 12,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemLookupResponse": {
			"fields": {
				"items": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Items"
				},
				"operationRequest": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemSearch": {
			"fields": {
				"XMLEscaping": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"associateTag": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"requests": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemSearchRequestType"
				},
				"shared": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemSearchRequestType"
				},
				"subscriptionId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"validate": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemSearchRequestType": {
			"fields": {
				"ISPUPostalCode": {
					"exclude": [],
					"fieldOrder": 15,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"actor": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"artist": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"audienceRatings": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"author": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"brand": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"browseNode": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"city": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"composer": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"condition": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"conductor": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"count": {
					"exclude": [],
					"fieldOrder": 10,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"cuisine": {
					"exclude": [],
					"fieldOrder": 11,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"deliveryMethod": {
					"exclude": [],
					"fieldOrder": 12,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"director": {
					"exclude": [],
					"fieldOrder": 13,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"futureLaunchDate": {
					"exclude": [],
					"fieldOrder": 14,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"itemPage": {
					"exclude": [],
					"fieldOrder": 16,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"keywords": {
					"exclude": [],
					"fieldOrder": 17,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"manufacturer": {
					"exclude": [],
					"fieldOrder": 18,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"maximumPrice": {
					"exclude": [],
					"fieldOrder": 19,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"merchantId": {
					"exclude": [],
					"fieldOrder": 20,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"minimumPrice": {
					"exclude": [],
					"fieldOrder": 21,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"musicLabel": {
					"exclude": [],
					"fieldOrder": 22,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"neighborhood": {
					"exclude": [],
					"fieldOrder": 23,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"orchestra": {
					"exclude": [],
					"fieldOrder": 24,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"postalCode": {
					"exclude": [],
					"fieldOrder": 25,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"power": {
					"exclude": [],
					"fieldOrder": 26,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"publisher": {
					"exclude": [],
					"fieldOrder": 27,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 28,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"searchIndex": {
					"exclude": [],
					"fieldOrder": 29,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"sort": {
					"exclude": [],
					"fieldOrder": 30,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"state": {
					"exclude": [],
					"fieldOrder": 31,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"textStream": {
					"exclude": [],
					"fieldOrder": 32,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"title": {
					"exclude": [],
					"fieldOrder": 33,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemSearchResponse": {
			"fields": {
				"items": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Items"
				},
				"operationRequest": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Items": {
			"fields": {
				"items": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Item"
				},
				"request": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Request"
				},
				"searchResultsMap": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SearchResultsMap"
				},
				"totalPages": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalResults": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.List": {
			"fields": {
				"additionalName": {
					"exclude": [],
					"fieldOrder": 11,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"averageRating": {
					"exclude": [],
					"fieldOrder": 14,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigDecimal"
				},
				"comment": {
					"exclude": [],
					"fieldOrder": 12,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"customerName": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"dateCreated": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"image": {
					"exclude": [],
					"fieldOrder": 13,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ImageType"
				},
				"listId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"listItems": {
					"exclude": [],
					"fieldOrder": 17,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListItem"
				},
				"listName": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"listType": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"listURL": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"occasionDate": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"partnerName": {
					"exclude": [],
					"fieldOrder": 10,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"registryNumber": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"totalItems": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalPages": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalTimesRead": {
					"exclude": [],
					"fieldOrder": 16,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalVotes": {
					"exclude": [],
					"fieldOrder": 15,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListItem": {
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
				"dateAdded": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"item": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Item"
				},
				"listItemId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"quantityDesired": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"quantityReceived": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListLookup": {
			"fields": {
				"XMLEscaping": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"associateTag": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"requests": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListLookupRequestType"
				},
				"shared": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListLookupRequestType"
				},
				"subscriptionId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"validate": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListLookupRequestType": {
			"fields": {
				"ISPUPostalCode": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"condition": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"deliveryMethod": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"listId": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"listType": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"merchantId": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"productGroup": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"productPage": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"sort": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListLookupResponse": {
			"fields": {
				"lists": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Lists"
				},
				"operationRequest": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListSearch": {
			"fields": {
				"XMLEscaping": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"associateTag": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"requests": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListSearchRequestType"
				},
				"shared": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListSearchRequestType"
				},
				"subscriptionId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"validate": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListSearchRequestType": {
			"fields": {
				"city": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"email": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"firstName": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"lastName": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"listPage": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"listType": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"name": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"state": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListSearchResponse": {
			"fields": {
				"lists": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Lists"
				},
				"operationRequest": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListmaniaLists": {
			"fields": {
				"listmaniaLists": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListmaniaLists.ListmaniaList"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListmaniaLists.ListmaniaList": {
			"fields": {
				"listId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"listName": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Lists": {
			"fields": {
				"lists": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.List"
				},
				"request": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Request"
				},
				"totalPages": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalResults": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Merchant": {
			"fields": {
				"glancePage": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"merchantId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"name": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.MultiOperation": {
			"fields": {
				"browseNodeLookup": {
					"exclude": [],
					"fieldOrder": 17,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.BrowseNodeLookup"
				},
				"cartAdd": {
					"exclude": [],
					"fieldOrder": 10,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartAdd"
				},
				"cartClear": {
					"exclude": [],
					"fieldOrder": 13,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartClear"
				},
				"cartCreate": {
					"exclude": [],
					"fieldOrder": 11,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartCreate"
				},
				"cartGet": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartGet"
				},
				"cartModify": {
					"exclude": [],
					"fieldOrder": 12,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartModify"
				},
				"customerContentLookup": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CustomerContentLookup"
				},
				"customerContentSearch": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CustomerContentSearch"
				},
				"help": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Help"
				},
				"itemLookup": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemLookup"
				},
				"itemSearch": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemSearch"
				},
				"listLookup": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListLookup"
				},
				"listSearch": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListSearch"
				},
				"sellerListingLookup": {
					"exclude": [],
					"fieldOrder": 16,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListingLookup"
				},
				"sellerListingSearch": {
					"exclude": [],
					"fieldOrder": 15,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListingSearch"
				},
				"sellerLookup": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerLookup"
				},
				"similarityLookup": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SimilarityLookup"
				},
				"transactionLookup": {
					"exclude": [],
					"fieldOrder": 14,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.TransactionLookup"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.MultiOperationResponse": {
			"fields": {
				"browseNodeLookupResponse": {
					"exclude": [],
					"fieldOrder": 18,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.BrowseNodeLookupResponse"
				},
				"cartAddResponse": {
					"exclude": [],
					"fieldOrder": 11,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartAddResponse"
				},
				"cartClearResponse": {
					"exclude": [],
					"fieldOrder": 14,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartClearResponse"
				},
				"cartCreateResponse": {
					"exclude": [],
					"fieldOrder": 12,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartCreateResponse"
				},
				"cartGetResponse": {
					"exclude": [],
					"fieldOrder": 10,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartGetResponse"
				},
				"cartModifyResponse": {
					"exclude": [],
					"fieldOrder": 13,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartModifyResponse"
				},
				"customerContentLookupResponse": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CustomerContentLookupResponse"
				},
				"customerContentSearchResponse": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CustomerContentSearchResponse"
				},
				"helpResponse": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.HelpResponse"
				},
				"itemLookupResponse": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemLookupResponse"
				},
				"itemSearchResponse": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemSearchResponse"
				},
				"listLookupResponse": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListLookupResponse"
				},
				"listSearchResponse": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListSearchResponse"
				},
				"operationRequest": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest"
				},
				"sellerListingLookupResponse": {
					"exclude": [],
					"fieldOrder": 17,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListingLookupResponse"
				},
				"sellerListingSearchResponse": {
					"exclude": [],
					"fieldOrder": 16,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListingSearchResponse"
				},
				"sellerLookupResponse": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerLookupResponse"
				},
				"similarityLookupResponse": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SimilarityLookupResponse"
				},
				"transactionLookupResponse": {
					"exclude": [],
					"fieldOrder": 15,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.TransactionLookupResponse"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.NonNegativeIntegerWithUnitsType": {
			"fields": {
				"units": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Offer": {
			"fields": {
				"largeImage": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ImageType"
				},
				"mediumImage": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ImageType"
				},
				"merchant": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Merchant"
				},
				"offerAttributes": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OfferAttributes"
				},
				"offerListings": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OfferListing"
				},
				"seller": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Seller"
				},
				"smallImage": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ImageType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OfferAttributes": {
			"fields": {
				"condition": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"conditionNote": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"subCondition": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OfferListing": {
			"fields": {
				"ISPUStoreAddress": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.AddressType"
				},
				"ISPUStoreHours": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"availability": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"exchangeId": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"isEligibleForSuperSaverShipping": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Boolean"
				},
				"offerListingId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"price": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				},
				"salePrice": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OfferSummary": {
			"fields": {
				"lowestCollectiblePrice": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				},
				"lowestNewPrice": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				},
				"lowestRefurbishedPrice": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				},
				"lowestUsedPrice": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				},
				"totalCollectible": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"totalNew": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"totalRefurbished": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"totalUsed": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Offers": {
			"fields": {
				"offers": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Offer"
				},
				"totalOfferPages": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalOffers": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationInformation": {
			"fields": {
				"availableParameters": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationInformation.AvailableParameters"
				},
				"availableResponseGroups": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationInformation.AvailableResponseGroups"
				},
				"defaultResponseGroups": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationInformation.DefaultResponseGroups"
				},
				"description": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
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
				"requiredParameters": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationInformation.RequiredParameters"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationInformation.AvailableParameters": {
			"fields": {
				"parameters": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationInformation.AvailableResponseGroups": {
			"fields": {
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationInformation.DefaultResponseGroups": {
			"fields": {
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationInformation.RequiredParameters": {
			"fields": {
				"parameters": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest": {
			"fields": {
				"HTTPHeaders": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.HTTPHeaders"
				},
				"arguments": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Arguments"
				},
				"errors": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Errors"
				},
				"requestId": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"requestProcessingTime": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Float"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType": {
			"fields": {
				"amount": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"currencyCode": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"formattedPrice": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PromotionalTag": {
			"fields": {
				"promotionalTag": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Request": {
			"fields": {
				"browseNodeLookupRequest": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.BrowseNodeLookupRequestType"
				},
				"cartAddRequest": {
					"exclude": [],
					"fieldOrder": 11,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartAddRequestType"
				},
				"cartClearRequest": {
					"exclude": [],
					"fieldOrder": 14,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartClearRequestType"
				},
				"cartCreateRequest": {
					"exclude": [],
					"fieldOrder": 12,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartCreateRequestType"
				},
				"cartGetRequest": {
					"exclude": [],
					"fieldOrder": 10,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartGetRequestType"
				},
				"cartModifyRequest": {
					"exclude": [],
					"fieldOrder": 13,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartModifyRequestType"
				},
				"customerContentLookupRequest": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CustomerContentLookupRequestType"
				},
				"customerContentSearchRequest": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CustomerContentSearchRequestType"
				},
				"errors": {
					"exclude": [],
					"fieldOrder": 19,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Errors"
				},
				"helpRequest": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.HelpRequestType"
				},
				"isValid": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"itemLookupRequest": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemLookupRequestType"
				},
				"itemSearchRequest": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ItemSearchRequestType"
				},
				"listLookupRequest": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListLookupRequestType"
				},
				"listSearchRequest": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ListSearchRequestType"
				},
				"sellerListingLookupRequest": {
					"exclude": [],
					"fieldOrder": 17,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListingLookupRequestType"
				},
				"sellerListingSearchRequest": {
					"exclude": [],
					"fieldOrder": 16,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListingSearchRequestType"
				},
				"sellerLookupRequest": {
					"exclude": [],
					"fieldOrder": 18,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerLookupRequestType"
				},
				"similarityLookupRequest": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SimilarityLookupRequestType"
				},
				"transactionLookupRequest": {
					"exclude": [],
					"fieldOrder": 15,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.TransactionLookupRequestType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ResponseGroupInformation": {
			"fields": {
				"creationDate": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"elements": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ResponseGroupInformation.Elements"
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
				"validOperations": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ResponseGroupInformation.ValidOperations"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ResponseGroupInformation.Elements": {
			"fields": {
				"elements": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.ResponseGroupInformation.ValidOperations": {
			"fields": {
				"operations": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Review": {
			"fields": {
				"ASIN": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"content": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"customerId": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"date": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"helpfulVotes": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"rating": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
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
				"totalVotes": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SavedForLaterItems": {
			"fields": {
				"savedForLaterItems": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.CartItemType"
				},
				"subTotal": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SearchInside": {
			"fields": {
				"excerpt": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SearchInside.Excerpt"
				},
				"totalExcerpts": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SearchInside.Excerpt": {
			"fields": {
				"checksum": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"pageNumber": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"pageType": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"sequenceNumber": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"text": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SearchResultsMap": {
			"fields": {
				"searchIndices": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SearchResultsMap.SearchIndex"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SearchResultsMap.SearchIndex": {
			"fields": {
				"ASINS": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"indexName": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"pages": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"relevanceRank": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"results": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Seller": {
			"fields": {
				"about": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"averageFeedbackRating": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigDecimal"
				},
				"glancePage": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"location": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Seller.Location"
				},
				"moreAbout": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"nickname": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"sellerFeedback": {
					"exclude": [],
					"fieldOrder": 10,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerFeedback"
				},
				"sellerId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"sellerName": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"totalFeedback": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalFeedbackPages": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Seller.Location": {
			"fields": {
				"city": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"country": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"state": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerFeedback": {
			"fields": {
				"feedbacks": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerFeedback.Feedback"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerFeedback.Feedback": {
			"fields": {
				"comment": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"date": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"ratedBy": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"rating": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListing": {
			"fields": {
				"ASIN": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"availability": {
					"exclude": [],
					"fieldOrder": 13,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"condition": {
					"exclude": [],
					"fieldOrder": 10,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"conditionNote": {
					"exclude": [],
					"fieldOrder": 12,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"endDate": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"exchangeId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"featuredCategory": {
					"exclude": [],
					"fieldOrder": 14,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"listingId": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"price": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				},
				"quantity": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"quantityAllocated": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"seller": {
					"exclude": [],
					"fieldOrder": 15,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Seller"
				},
				"startDate": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"status": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"subCondition": {
					"exclude": [],
					"fieldOrder": 11,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"title": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListingLookup": {
			"fields": {
				"XMLEscaping": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"associateTag": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"requests": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListingLookupRequestType"
				},
				"shared": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListingLookupRequestType"
				},
				"subscriptionId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"validate": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListingLookupRequestType": {
			"fields": {
				"id": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"idType": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListingLookupResponse": {
			"fields": {
				"operationRequest": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest"
				},
				"sellerListings": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListings"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListingSearch": {
			"fields": {
				"XMLEscaping": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"associateTag": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"requests": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListingSearchRequestType"
				},
				"shared": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListingSearchRequestType"
				},
				"subscriptionId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"validate": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListingSearchRequestType": {
			"fields": {
				"browseNode": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"country": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"keywords": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"listingPage": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"offerStatus": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"postalCode": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"searchIndex": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"sellerId": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"shipOption": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"sort": {
					"exclude": [],
					"fieldOrder": 10,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"title": {
					"exclude": [],
					"fieldOrder": 11,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListingSearchResponse": {
			"fields": {
				"operationRequest": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest"
				},
				"sellerListings": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListings"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListings": {
			"fields": {
				"request": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Request"
				},
				"sellerListings": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerListing"
				},
				"totalPages": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalResults": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerLookup": {
			"fields": {
				"XMLEscaping": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"associateTag": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"requests": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerLookupRequestType"
				},
				"shared": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerLookupRequestType"
				},
				"subscriptionId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"validate": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerLookupRequestType": {
			"fields": {
				"feedbackPage": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"sellerIds": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SellerLookupResponse": {
			"fields": {
				"operationRequest": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest"
				},
				"sellers": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Sellers"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Sellers": {
			"fields": {
				"request": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Request"
				},
				"sellers": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Seller"
				},
				"totalPages": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalResults": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SimilarProducts": {
			"fields": {
				"similarProducts": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SimilarProducts.SimilarProduct"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SimilarProducts.SimilarProduct": {
			"fields": {
				"ASIN": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"title": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SimilarityLookup": {
			"fields": {
				"XMLEscaping": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"associateTag": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"requests": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SimilarityLookupRequestType"
				},
				"shared": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SimilarityLookupRequestType"
				},
				"subscriptionId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"validate": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SimilarityLookupRequestType": {
			"fields": {
				"ISPUPostalCode": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"condition": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"deliveryMethod": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"itemIds": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"merchantId": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"similarityType": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.SimilarityLookupResponse": {
			"fields": {
				"items": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Items"
				},
				"operationRequest": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.StringWithUnitsType": {
			"fields": {
				"units": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Tracks": {
			"fields": {
				"discs": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Tracks.Disc"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Tracks.Disc": {
			"fields": {
				"number": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"tracks": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Tracks.Disc.Track"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Tracks.Disc.Track": {
			"fields": {
				"number": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"value": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Transaction": {
			"fields": {
				"condition": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"orderingCustomerId": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"payingCustomerId": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"sellerId": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"sellerName": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"shipments": {
					"exclude": [],
					"fieldOrder": 10,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Transaction.Shipments"
				},
				"totals": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Transaction.Totals"
				},
				"transactionDate": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"transactionDateEpoch": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"transactionId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"transactionItems": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Transaction.TransactionItems"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Transaction.Shipments": {
			"fields": {
				"shipments": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Transaction.Shipments.Shipment"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Transaction.Shipments.Shipment": {
			"fields": {
				"condition": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"deliveryMethod": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"packages": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Transaction.Shipments.Shipment.Packages"
				},
				"shipmentItems": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Transaction.Shipments.Shipment.ShipmentItems"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Transaction.Shipments.Shipment.Packages": {
			"fields": {
				"packages": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Transaction.Shipments.Shipment.Packages.Package"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Transaction.Shipments.Shipment.Packages.Package": {
			"fields": {
				"carrierName": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"trackingNumber": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Transaction.Shipments.Shipment.ShipmentItems": {
			"fields": {
				"transactionItemIds": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Transaction.Totals": {
			"fields": {
				"promotion": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				},
				"shippingCharge": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				},
				"subtotal": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				},
				"tax": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				},
				"total": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Transaction.TransactionItems": {
			"fields": {
				"transactionItems": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.TransactionItem"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.TransactionItem": {
			"fields": {
				"ASIN": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"childTransactionItems": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.TransactionItem.ChildTransactionItems"
				},
				"quantity": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"totalPrice": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				},
				"transactionItemId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"unitPrice": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.TransactionItem.ChildTransactionItems": {
			"fields": {
				"transactionItems": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.TransactionItem"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.TransactionLookup": {
			"fields": {
				"XMLEscaping": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"associateTag": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"requests": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.TransactionLookupRequestType"
				},
				"shared": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.TransactionLookupRequestType"
				},
				"subscriptionId": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"validate": {
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
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.TransactionLookupRequestType": {
			"fields": {
				"responseGroups": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"transactionIds": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.TransactionLookupResponse": {
			"fields": {
				"operationRequest": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.OperationRequest"
				},
				"transactions": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Transactions"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Transactions": {
			"fields": {
				"request": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Request"
				},
				"totalPages": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalResults": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"transactions": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Transaction"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.VariationSummary": {
			"fields": {
				"highestPrice": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				},
				"highestSalePrice": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				},
				"lowestPrice": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				},
				"lowestSalePrice": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.PriceType"
				},
				"singleMerchantId": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Variations": {
			"fields": {
				"items": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.amazon.webservices.awsecommerceservice._2005_10_05.amazonrestservice.Item"
				},
				"totalVariationPages": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"totalVariations": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "AmazonRESTService"
		},
		"com.flickr.api.services.rest.flickrphotoinfo.CountryTypeType": {
			"fields": {
				"placeId": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"woeid": {
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
			"service": "FlickrPhotoInfo"
		},
		"com.flickr.api.services.rest.flickrphotoinfo.DatesTypeType": {
			"fields": {
				"lastupdate": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"posted": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"taken": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"takengranularity": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
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
			"service": "FlickrPhotoInfo"
		},
		"com.flickr.api.services.rest.flickrphotoinfo.EditabilityTypeType": {
			"fields": {
				"canaddmeta": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"cancomment": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
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
			"service": "FlickrPhotoInfo"
		},
		"com.flickr.api.services.rest.flickrphotoinfo.GeopermsTypeType": {
			"fields": {
				"iscontact": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"isfamily": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"isfriend": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"ispublic": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
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
			"service": "FlickrPhotoInfo"
		},
		"com.flickr.api.services.rest.flickrphotoinfo.LocalityTypeType": {
			"fields": {
				"placeId": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"woeid": {
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
			"service": "FlickrPhotoInfo"
		},
		"com.flickr.api.services.rest.flickrphotoinfo.LocationTypeType": {
			"fields": {
				"accuracy": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"country": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.flickr.api.services.rest.flickrphotoinfo.CountryTypeType"
				},
				"latitude": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"locality": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.flickr.api.services.rest.flickrphotoinfo.LocalityTypeType"
				},
				"longitude": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"placeId": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"region": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.flickr.api.services.rest.flickrphotoinfo.RegionTypeType"
				},
				"woeid": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "FlickrPhotoInfo"
		},
		"com.flickr.api.services.rest.flickrphotoinfo.OwnerTypeType": {
			"fields": {
				"location": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"nsid": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"realname": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"username": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
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
			"service": "FlickrPhotoInfo"
		},
		"com.flickr.api.services.rest.flickrphotoinfo.PhotoTypeType": {
			"fields": {
				"comments": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"dates": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.flickr.api.services.rest.flickrphotoinfo.DatesTypeType"
				},
				"dateuploaded": {
					"exclude": [],
					"fieldOrder": 17,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"description": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"editability": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.flickr.api.services.rest.flickrphotoinfo.EditabilityTypeType"
				},
				"farm": {
					"exclude": [],
					"fieldOrder": 16,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"geoperms": {
					"exclude": [],
					"fieldOrder": 11,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.flickr.api.services.rest.flickrphotoinfo.GeopermsTypeType"
				},
				"id": {
					"exclude": [],
					"fieldOrder": 13,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"isfavorite": {
					"exclude": [],
					"fieldOrder": 18,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"license": {
					"exclude": [],
					"fieldOrder": 19,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"location": {
					"exclude": [],
					"fieldOrder": 10,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.flickr.api.services.rest.flickrphotoinfo.LocationTypeType"
				},
				"media": {
					"exclude": [],
					"fieldOrder": 23,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"notes": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"originalformat": {
					"exclude": [],
					"fieldOrder": 22,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"originalsecret": {
					"exclude": [],
					"fieldOrder": 21,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"owner": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.flickr.api.services.rest.flickrphotoinfo.OwnerTypeType"
				},
				"rotation": {
					"exclude": [],
					"fieldOrder": 20,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"secret": {
					"exclude": [],
					"fieldOrder": 14,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"server": {
					"exclude": [],
					"fieldOrder": 15,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"tags": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.flickr.api.services.rest.flickrphotoinfo.TagsTypeType"
				},
				"title": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"urls": {
					"exclude": [],
					"fieldOrder": 12,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.flickr.api.services.rest.flickrphotoinfo.UrlsTypeType"
				},
				"usage": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.flickr.api.services.rest.flickrphotoinfo.UsageTypeType"
				},
				"visibility": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.flickr.api.services.rest.flickrphotoinfo.VisibilityTypeType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "FlickrPhotoInfo"
		},
		"com.flickr.api.services.rest.flickrphotoinfo.RegionTypeType": {
			"fields": {
				"placeId": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"woeid": {
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
			"service": "FlickrPhotoInfo"
		},
		"com.flickr.api.services.rest.flickrphotoinfo.Rsp": {
			"fields": {
				"photo": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.flickr.api.services.rest.flickrphotoinfo.PhotoTypeType"
				},
				"stat": {
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
			"service": "FlickrPhotoInfo"
		},
		"com.flickr.api.services.rest.flickrphotoinfo.TagTypeType": {
			"fields": {
				"author": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"id": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"machineTag": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"raw": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
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
			"service": "FlickrPhotoInfo"
		},
		"com.flickr.api.services.rest.flickrphotoinfo.TagsTypeType": {
			"fields": {
				"tags": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.flickr.api.services.rest.flickrphotoinfo.TagTypeType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "FlickrPhotoInfo"
		},
		"com.flickr.api.services.rest.flickrphotoinfo.UrlTypeType": {
			"fields": {
				"type": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
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
			"service": "FlickrPhotoInfo"
		},
		"com.flickr.api.services.rest.flickrphotoinfo.UrlsTypeType": {
			"fields": {
				"url": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.flickr.api.services.rest.flickrphotoinfo.UrlTypeType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "FlickrPhotoInfo"
		},
		"com.flickr.api.services.rest.flickrphotoinfo.UsageTypeType": {
			"fields": {
				"canblog": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"candownload": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"canprint": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
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
			"service": "FlickrPhotoInfo"
		},
		"com.flickr.api.services.rest.flickrphotoinfo.VisibilityTypeType": {
			"fields": {
				"isfamily": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"isfriend": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"ispublic": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
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
			"service": "FlickrPhotoInfo"
		},
		"com.flickr.api.services.rest.flickrphotosearch.PhotoTypeType": {
			"fields": {
				"farm": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"id": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"isfamily": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"isfriend": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"ispublic": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"owner": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"secret": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"server": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"title": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
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
			"service": "FlickrPhotoSearch"
		},
		"com.flickr.api.services.rest.flickrphotosearch.PhotosTypeType": {
			"fields": {
				"page": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"pages": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"perpage": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"photos": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.flickr.api.services.rest.flickrphotosearch.PhotoTypeType"
				},
				"total": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "FlickrPhotoSearch"
		},
		"com.flickr.api.services.rest.flickrphotosearch.Rsp": {
			"fields": {
				"photos": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.flickr.api.services.rest.flickrphotosearch.PhotosTypeType"
				},
				"stat": {
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
			"service": "FlickrPhotoSearch"
		},
		"com.strikeiron.basicrealtimequotes.ArrayOfRealQuoteType": {
			"fields": {
				"realQuotes": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.strikeiron.basicrealtimequotes.RealQuoteType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "BasicRealTimeQuotes"
		},
		"com.strikeiron.basicrealtimequotes.GetOneQuote": {
			"fields": {
				"tickerSymbol": {
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
			"service": "BasicRealTimeQuotes"
		},
		"com.strikeiron.basicrealtimequotes.GetOneQuoteResponse": {
			"fields": {
				"getOneQuoteResult": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.strikeiron.basicrealtimequotes.RealQuoteType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "BasicRealTimeQuotes"
		},
		"com.strikeiron.basicrealtimequotes.GetQuotes": {
			"fields": {
				"tickerSymbolList": {
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
			"service": "BasicRealTimeQuotes"
		},
		"com.strikeiron.basicrealtimequotes.GetQuotesResponse": {
			"fields": {
				"getQuotesResult": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.strikeiron.basicrealtimequotes.ArrayOfRealQuoteType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "BasicRealTimeQuotes"
		},
		"com.strikeiron.basicrealtimequotes.GetRemainingHits": {
			"fields": {
			},
			"internal": false,
			"liveService": false,
			"service": "BasicRealTimeQuotes"
		},
		"com.strikeiron.basicrealtimequotes.GetRemainingHitsResponse": {
			"fields": {
			},
			"internal": false,
			"liveService": false,
			"service": "BasicRealTimeQuotes"
		},
		"com.strikeiron.basicrealtimequotes.LicenseInfo": {
			"fields": {
				"registeredUser": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.strikeiron.basicrealtimequotes.RegisteredUserType"
				},
				"unregisteredUser": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.strikeiron.basicrealtimequotes.UnregisteredUserType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "BasicRealTimeQuotes"
		},
		"com.strikeiron.basicrealtimequotes.RealQuoteType": {
			"fields": {
				"CIK": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"CUSIP": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"ECNVolume": {
					"exclude": [],
					"fieldOrder": 19,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				},
				"ask": {
					"exclude": [],
					"fieldOrder": 14,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Double"
				},
				"askQuantity": {
					"exclude": [],
					"fieldOrder": 17,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				},
				"bid": {
					"exclude": [],
					"fieldOrder": 13,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Double"
				},
				"bidQuantity": {
					"exclude": [],
					"fieldOrder": 16,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				},
				"changeFromOpen": {
					"exclude": [],
					"fieldOrder": 11,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Double"
				},
				"changeFromPrevious": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Double"
				},
				"date": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"highest": {
					"exclude": [],
					"fieldOrder": 20,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Double"
				},
				"last": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Double"
				},
				"lowest": {
					"exclude": [],
					"fieldOrder": 21,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Double"
				},
				"name": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"open": {
					"exclude": [],
					"fieldOrder": 10,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Double"
				},
				"percentChangeFromOpen": {
					"exclude": [],
					"fieldOrder": 12,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Double"
				},
				"percentChangeFromPrevious": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Double"
				},
				"quantity": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				},
				"rank": {
					"exclude": [],
					"fieldOrder": 22,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"spread": {
					"exclude": [],
					"fieldOrder": 15,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Double"
				},
				"symbol": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"time": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"volume": {
					"exclude": [],
					"fieldOrder": 18,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "BasicRealTimeQuotes"
		},
		"com.strikeiron.basicrealtimequotes.RegisteredUserType": {
			"fields": {
				"password": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"userID": {
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
			"service": "BasicRealTimeQuotes"
		},
		"com.strikeiron.basicrealtimequotes.ResponseInfo": {
			"fields": {
				"response": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"responseCode": {
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
			"service": "BasicRealTimeQuotes"
		},
		"com.strikeiron.basicrealtimequotes.SubscriptionInfo": {
			"fields": {
				"amount": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigDecimal"
				},
				"licenseAction": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"licenseActionCode": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				},
				"licenseStatus": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"licenseStatusCode": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				},
				"remainingHits": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Integer"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "BasicRealTimeQuotes"
		},
		"com.strikeiron.basicrealtimequotes.UnregisteredUserType": {
			"fields": {
				"emailAddress": {
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
			"service": "BasicRealTimeQuotes"
		},
		"com.sun.syndication.feed.synd.SyndContent": {
			"fields": {
				"mode": {
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
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"value": {
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
			"service": "FeedService"
		},
		"com.sun.syndication.feed.synd.SyndImage": {
			"fields": {
				"description": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"link": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"title": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"url": {
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
			"service": "FeedService"
		},
		"com.sun.syndication.feed.synd.SyndLink": {
			"fields": {
				"href": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"hreflang": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"length": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "long"
				},
				"rel": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"title": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"type": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "FeedService"
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
		"com.wavemaker.runtime.ws.Entry": {
			"fields": {
				"author": {
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
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.sun.syndication.feed.synd.SyndContent"
				},
				"description": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.sun.syndication.feed.synd.SyndContent"
				},
				"link": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"links": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.sun.syndication.feed.synd.SyndLink"
				},
				"publishedDate": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.util.Date"
				},
				"title": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"titleEx": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.sun.syndication.feed.synd.SyndContent"
				},
				"updatedDate": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.util.Date"
				},
				"uri": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "FeedService"
		},
		"com.wavemaker.runtime.ws.Feed": {
			"fields": {
				"author": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"copyright": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"description": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"descriptionEx": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.sun.syndication.feed.synd.SyndContent"
				},
				"encoding": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"entries": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.wavemaker.runtime.ws.Entry"
				},
				"feedType": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"image": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.sun.syndication.feed.synd.SyndImage"
				},
				"language": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"link": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"links": {
					"exclude": [],
					"fieldOrder": 10,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.sun.syndication.feed.synd.SyndLink"
				},
				"publishedDate": {
					"exclude": [],
					"fieldOrder": 11,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.util.Date"
				},
				"title": {
					"exclude": [],
					"fieldOrder": 12,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"titleEx": {
					"exclude": [],
					"fieldOrder": 13,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "com.sun.syndication.feed.synd.SyndContent"
				},
				"uri": {
					"exclude": [],
					"fieldOrder": 14,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "FeedService"
		},
		"com.yahooapis.local.trafficdata.yahootraffic.ResultSet": {
			"fields": {
				"lastUpdateDate": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"results": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "com.yahooapis.local.trafficdata.yahootraffic.ResultTypeType"
				},
				"warning": {
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
			"service": "YahooTraffic"
		},
		"com.yahooapis.local.trafficdata.yahootraffic.ResultTypeType": {
			"fields": {
				"description": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"direction": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"endDate": {
					"exclude": [],
					"fieldOrder": 8,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"imageUrl": {
					"exclude": [],
					"fieldOrder": 9,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"latitude": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigDecimal"
				},
				"longitude": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigDecimal"
				},
				"reportDate": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"severity": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.math.BigInteger"
				},
				"title": {
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
					"fieldOrder": 10,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"updateDate": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "YahooTraffic"
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
		"net.webservicex.weatherforecast.ArrayOfWeatherDataType": {
			"fields": {
				"weatherDatas": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": true,
					"noChange": [],
					"required": true,
					"type": "net.webservicex.weatherforecast.WeatherDataType"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "WeatherForecast"
		},
		"net.webservicex.weatherforecast.GetWeatherByPlaceName": {
			"fields": {
				"placeName": {
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
			"service": "WeatherForecast"
		},
		"net.webservicex.weatherforecast.GetWeatherByPlaceNameResponse": {
			"fields": {
				"getWeatherByPlaceNameResult": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "net.webservicex.weatherforecast.WeatherForecasts"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "WeatherForecast"
		},
		"net.webservicex.weatherforecast.GetWeatherByZipCode": {
			"fields": {
				"zipCode": {
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
			"service": "WeatherForecast"
		},
		"net.webservicex.weatherforecast.GetWeatherByZipCodeResponse": {
			"fields": {
				"getWeatherByZipCodeResult": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "net.webservicex.weatherforecast.WeatherForecasts"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "WeatherForecast"
		},
		"net.webservicex.weatherforecast.WeatherDataType": {
			"fields": {
				"day": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"maxTemperatureC": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"maxTemperatureF": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"minTemperatureC": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"minTemperatureF": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"weatherImage": {
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
			"service": "WeatherForecast"
		},
		"net.webservicex.weatherforecast.WeatherForecasts": {
			"fields": {
				"allocationFactor": {
					"exclude": [],
					"fieldOrder": 2,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Float"
				},
				"details": {
					"exclude": [],
					"fieldOrder": 7,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "net.webservicex.weatherforecast.ArrayOfWeatherDataType"
				},
				"fipsCode": {
					"exclude": [],
					"fieldOrder": 3,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"latitude": {
					"exclude": [],
					"fieldOrder": 0,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Float"
				},
				"longitude": {
					"exclude": [],
					"fieldOrder": 1,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.Float"
				},
				"placeName": {
					"exclude": [],
					"fieldOrder": 4,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"stateCode": {
					"exclude": [],
					"fieldOrder": 5,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				},
				"status": {
					"exclude": [],
					"fieldOrder": 6,
					"include": [],
					"isList": false,
					"noChange": [],
					"required": true,
					"type": "java.lang.String"
				}
			},
			"internal": false,
			"liveService": false,
			"service": "WeatherForecast"
		},
		"short": {
			"internal": true,
			"primitiveType": "Number"
		}
	}
};
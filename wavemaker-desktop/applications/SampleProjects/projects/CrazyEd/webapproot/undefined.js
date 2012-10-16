dojo.declare("CrazyEd", wm.Application, {
	"disableDirtyEditorTracking": false, 
	"eventDelay": 0, 
	"i18n": false, 
	"isSecurityEnabled": false, 
	"main": "Main", 
	"manageHistory": true, 
	"manageURL": false, 
	"name": "", 
	"phoneGapLoginPage": "Login", 
	"phoneMain": "", 
	"projectSubVersion": "Alpha1", 
	"projectVersion": 1, 
	"studioVersion": "6.5.0.RELEASE", 
	"tabletMain": "", 
	"theme": "wm_coolblue", 
	"toastPosition": "br", 
	"touchToClickDelay": 500, 
	"touchToRightClickDelay": 1500,
	"widgets": {
		silkIconList: ["wm.ImageList", {"colCount":39,"height":16,"iconCount":90,"url":"lib/images/silkIcons/silk.png","width":16}, {}], 
		"Shopping-SearchResponse": ["wm.TypeDefinition", {}, {}, {
			kind: ["wm.TypeDefinitionField", {"fieldName":"kind"}, {}],
			etag: ["wm.TypeDefinitionField", {"fieldName":"etag"}, {}],
			id: ["wm.TypeDefinitionField", {"fieldName":"id"}, {}],
			selfLink: ["wm.TypeDefinitionField", {"fieldName":"selfLink"}, {}],
			nextLink: ["wm.TypeDefinitionField", {"fieldName":"nextLink"}, {}],
			totalItems: ["wm.TypeDefinitionField", {"fieldName":"totalItems","fieldType":"Number"}, {}],
			startIndex: ["wm.TypeDefinitionField", {"fieldName":"startIndex","fieldType":"Number"}, {}],
			itemsPerPage: ["wm.TypeDefinitionField", {"fieldName":"itemsPerPage","fieldType":"Number"}, {}],
			currentItemCount: ["wm.TypeDefinitionField", {"fieldName":"currentItemCount","fieldType":"Number"}, {}],
			requestId: ["wm.TypeDefinitionField", {"fieldName":"requestId"}, {}],
			items: ["wm.TypeDefinitionField", {"fieldName":"items","fieldType":"Shopping-SearchResponse_items","isList":true}, {}]
		}], 
		"Shopping-SearchResponse_items": ["wm.TypeDefinition", {}, {}, {
			kind: ["wm.TypeDefinitionField", {"fieldName":"kind"}, {}],
			id: ["wm.TypeDefinitionField", {"fieldName":"id"}, {}],
			selfLink: ["wm.TypeDefinitionField", {"fieldName":"selfLink"}, {}],
			product: ["wm.TypeDefinitionField", {"fieldName":"product","fieldType":"Shopping-SearchResponse_items_product"}, {}]
		}], 
		"Shopping-SearchResponse_items_product": ["wm.TypeDefinition", {}, {}, {
			googleId: ["wm.TypeDefinitionField", {"fieldName":"googleId"}, {}],
			author: ["wm.TypeDefinitionField", {"fieldName":"author","fieldType":"Shopping-SearchResponse_items_product_author"}, {}],
			creationTime: ["wm.TypeDefinitionField", {"fieldName":"creationTime"}, {}],
			modificationTime: ["wm.TypeDefinitionField", {"fieldName":"modificationTime"}, {}],
			country: ["wm.TypeDefinitionField", {"fieldName":"country"}, {}],
			language: ["wm.TypeDefinitionField", {"fieldName":"language"}, {}],
			title: ["wm.TypeDefinitionField", {"fieldName":"title"}, {}],
			description: ["wm.TypeDefinitionField", {"fieldName":"description"}, {}],
			link: ["wm.TypeDefinitionField", {"fieldName":"link"}, {}],
			brand: ["wm.TypeDefinitionField", {"fieldName":"brand"}, {}],
			condition: ["wm.TypeDefinitionField", {"fieldName":"condition"}, {}],
			mpns: ["wm.TypeDefinitionField", {"fieldName":"mpns","fieldType":"StringData","isList":true}, {}],
			inventories: ["wm.TypeDefinitionField", {"fieldName":"inventories","fieldType":"Shopping-SearchResponse_items_product_inventories","isList":true}, {}],
			images: ["wm.TypeDefinitionField", {"fieldName":"images","fieldType":"Shopping-SearchResponse_items_product_images","isList":true}, {}]
		}], 
		"Shopping-SearchResponse_items_product_author": ["wm.TypeDefinition", {}, {}, {
			name: ["wm.TypeDefinitionField", {"fieldName":"name"}, {}],
			accountId: ["wm.TypeDefinitionField", {"fieldName":"accountId"}, {}]
		}], 
		"Shopping-SearchResponse_items_product_images": ["wm.TypeDefinition", {}, {}, {
			link: ["wm.TypeDefinitionField", {"fieldName":"link"}, {}],
			status: ["wm.TypeDefinitionField", {"fieldName":"status"}, {}]
		}], 
		"Shopping-SearchResponse_items_product_inventories": ["wm.TypeDefinition", {}, {}, {
			channel: ["wm.TypeDefinitionField", {"fieldName":"channel"}, {}],
			availability: ["wm.TypeDefinitionField", {"fieldName":"availability"}, {}],
			price: ["wm.TypeDefinitionField", {"fieldName":"price","fieldType":"Number"}, {}],
			shipping: ["wm.TypeDefinitionField", {"fieldName":"shipping","fieldType":"Number"}, {}],
			currency: ["wm.TypeDefinitionField", {"fieldName":"currency"}, {}]
		}], 
		"Shopping-Search": ["wm.XhrDefinition", {"headers":{},"parameters":{"key":{"transmitType":"queryString","type":"String","bindable":true},"alt":{"transmitType":"queryString","type":"String","bindable":true},"country":{"transmitType":"queryString","type":"String","bindable":true},"availability":{"transmitType":"queryString","type":"String","bindable":true},"rankBy":{"transmitType":"queryString","type":"String","bindable":true},"q":{"transmitType":"queryString","type":"String","bindable":true}},"returnType":"Shopping-SearchResponse","url":"https://www.googleapis.com/shopping/search/v1/public/products","useProxy":false}, {}], 
		varAPIKey: ["wm.Variable", {"type":"StringData"}, {}]
	},
	_end: 0
});

CrazyEd.extend({

	_end: 0
});
dojo.provide('wm.base.lib.currencyMappings');

wm.currencyMap = {
	'ar': '',
	'ca': '',
	'cs': '',
	'da': '',
	'de-de': '',
	'el': '',
	'en-gb': '',
	'en-us': 'USD',
	'es-es': '',
	'fi-fi': '',
	'fr-fr': '',
	'he-il': '',
	'hu': '',
	'it-it': '',
	'ja-jp': '',
	'ko-kr': '',
	'nl-nl': '',
	'nb': '',
	'pl': '',
	'pt-br': '',
	'pt-pt': '',
	'ru': '',
	'sk': '',
	'sl': '',
	'sv': '',
	'th': '',
	'tr': '',
	'zh-tw': '',
	'zh-cn': ''
}

wm.getLocaleCurrency = function(){
	var code = wm.currencyMap[dojo.locale];
	if (!code || code == '')
		return 'USD'; // default to USD
	return code;
}
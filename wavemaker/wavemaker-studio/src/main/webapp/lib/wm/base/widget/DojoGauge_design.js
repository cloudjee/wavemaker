dojo.provide("wm.base.widget.DojoGauge_design");
dojo.require("wm.base.widget.DojoGauge");
dojo.require("wm.base.Control_design");

wm.Object.extendSchema(wm.DojoGauge, {

    /* Ignored group */
    gaugeNode: {ignore: 1},
    gauge: {ignore: 1},
    valueIndicator1: {ignore: 1},

    /* Editor group; visual subgroup */
    lowRangeColor:  {group: "widgetName", subgroup: "graphics", order: 1, editor: "wm.ColorPicker"},
    midRangeColor:  {group: "widgetName", subgroup: "graphics", order: 4, editor: "wm.ColorPicker"},
    highRangeColor: {group: "widgetName", subgroup: "graphics", order: 6, editor: "wm.ColorPicker"},
    arrowColor1:    {group: "widgetName", subgroup: "graphics", order: 10, editor: "wm.ColorPicker"},
    arrowColor2:    {group: "widgetName", subgroup: "graphics", order: 11, editor: "wm.ColorPicker"},
    arrowColor3:    {group: "widgetName", subgroup: "graphics", order: 12, editor: "wm.ColorPicker"},
    useOverlayImage:{group: "widgetName", subgroup: "graphics", order: 20},

    /* Editor group; value subgroup */
    currentValue1: {group: "widgetName", subgroup: "data", order: 1, requiredGroup:1, bindTarget: 1},
    currentValue2: {group: "widgetName", subgroup: "data", order: 5, bindTarget: 1},
    currentValue3: {group: "widgetName", subgroup: "data", order: 8, bindTarget: 1},
    lowRangeMin:   {group: "widgetName", subgroup: "data", order: 52},
    lowRangeMax:   {group: "widgetName", subgroup: "data", order: 53},
    midRangeMax:   {group: "widgetName", subgroup: "data", order: 55},
    highRangeMax:  {group: "widgetName", subgroup: "data", order: 57},

    /* Editor group; behavior subgroup */
    useSecondIndicator: {group: "widgetName", subgroup: "data", order: 1},
    useThirdIndicator: {group: "widgetName", subgroup: "data", order: 6}

});
wm.DojoGauge.extend({
    listProperties: function() {
	var props = dojo.clone(this.inherited(arguments));
	props.useThirdIndicator.ignoretmp = props.currentValue2.ignoretmp = props.arrowColor2.ignoretmp = !this.useSecondIndicator;
	props.currentValue3.ignoretmp = props.arrowColor3.ignoretmp = !this.useThirdIndicator;
	return props;
    }
});
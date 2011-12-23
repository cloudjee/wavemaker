dojo.provide("wm.base.widget.DojoGauge_design");
dojo.require("wm.base.widget.DojoGauge");
dojo.require("wm.base.Control_design");

wm.Object.extendSchema(wm.DojoGauge, {

    /* Ignored group */
    gaugeNode: {ignore: 1},
    gauge: {ignore: 1},
    valueIndicator1: {ignore: 1},

    /* Editor group; visual subgroup */
    lowRangeColor:  {group: "editor", subgroup: "display", order: 1, editor: "wm.ColorPicker"},
    midRangeColor:  {group: "editor", subgroup: "display", order: 4, editor: "wm.ColorPicker"},
    highRangeColor: {group: "editor", subgroup: "display", order: 6, editor: "wm.ColorPicker"},
    arrowColor1:    {group: "editor", subgroup: "display", order: 10, editor: "wm.ColorPicker"},
    arrowColor2:    {group: "editor", subgroup: "display", order: 11, editor: "wm.ColorPicker"},
    arrowColor3:    {group: "editor", subgroup: "display", order: 12, editor: "wm.ColorPicker"},
    useOverlayImage:{group: "editor", subgroup: "display", order: 20},

    /* Editor group; value subgroup */
    currentValue1: {group: "editor", subgroup: "value", order: 1, requiredGroup:1, bindTarget: 1},
    currentValue2: {group: "editor", subgroup: "value", order: 5, bindTarget: 1},
    currentValue3: {group: "editor", subgroup: "value", order: 8, bindTarget: 1},
    lowRangeMin:   {group: "editor", subgroup: "value", order: 52},
    lowRangeMax:   {group: "editor", subgroup: "value", order: 53},
    midRangeMax:   {group: "editor", subgroup: "value", order: 55},
    highRangeMax:  {group: "editor", subgroup: "value", order: 57},

    /* Editor group; behavior subgroup */
    useSecondIndicator: {group: "editor", subgroup: "behavior", order: 4},
    useThirdIndicator: {group: "editor", subgroup: "behavior", order: 5}

});
wm.DojoGauge.extend({
    listProperties: function() {
	var props = dojo.clone(this.inherited(arguments));
	props.useThirdIndicator.ignoretmp = props.currentValue2.ignoretmp = props.arrowColor2.ignoretmp = !this.useSecondIndicator;
	props.currentValue3.ignoretmp = props.arrowColor3.ignoretmp = !this.useThirdIndicator;
	return props;
    }
});
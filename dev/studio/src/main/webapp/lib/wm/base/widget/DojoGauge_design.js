dojo.provide("wm.base.widget.DojoGauge_design");
dojo.require("wm.base.widget.DojoGauge");
dojo.require("wm.base.Control_design");

wm.Object.extendSchema(wm.DojoGauge, {
    gaugeNode: {ignore: 1},
    gauge: {ignore: 1},
    valueIndicator1: {ignore: 1},
    lowRangeColor: {group: "gauge", order: 1, editor: "wm.ColorPicker"},
    lowRangeMin:   {group: "gauge", order: 2},
    lowRangeMax:   {group: "gauge", order: 3},
    midRangeColor: {group: "gauge", order: 4, editor: "wm.ColorPicker"},
    midRangeMax: {group: "gauge", order: 5},
    highRangeColor: {group: "gauge", order: 6, editor: "wm.ColorPicker"},
    highRangeMax: {group: "gauge", order: 7},
    useOverlayImage: {group: "gauge", order: 20},

    currentValue1: {group: "indicator", order: 1, bindTarget: 1},
    arrowColor1: {group: "indicator", order: 2, editor: "wm.ColorPicker"},
    useSecondIndicator: {group: "indicator", order: 4},
    currentValue2: {group: "indicator", order: 5, bindTarget: 1},
    arrowColor2: {group: "indicator", order: 6, editor: "wm.ColorPicker"},
    useThirdIndicator: {group: "indicator", order: 7},
    currentValue3: {group: "indicator", order: 8, bindTarget: 1},
    arrowColor3: {group: "indicator", order: 9, editor: "wm.ColorPicker"}
});
wm.DojoGauge.extend({
    listProperties: function() {
	var props = dojo.clone(this.inherited(arguments));
	props.useThirdIndicator.ignoretmp = props.currentValue2.ignoretmp = props.arrowColor2.ignoretmp = !this.useSecondIndicator;
	props.currentValue3.ignoretmp = props.arrowColor3.ignoretmp = !this.useThirdIndicator;
	return props;
    }
});
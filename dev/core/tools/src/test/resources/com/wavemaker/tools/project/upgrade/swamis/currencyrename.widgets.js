Main.widgets = {
    asdf: ["wm.Variable", {type: "NumberData"}, {}],
    layoutBox1: ["wm.Layout", {box: "v", height: "1flex"}, {}, {
        editor1: ["wm.Editor", {display: "Currency", height: "20px"}, {}, {
            editor: ["wm._CurrencyEditor", {}, {}]
        }],
        label1: ["wm.Label", {caption: "label1", display: "Currency", height: "4
            format: ["wm.MoneyFormatter", {}, {}]
        }]
    }]
}

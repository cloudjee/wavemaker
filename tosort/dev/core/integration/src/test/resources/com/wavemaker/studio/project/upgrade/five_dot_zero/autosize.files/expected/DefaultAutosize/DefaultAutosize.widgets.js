Main.widgets = {
	liveVariable1: ["wm.LiveVariable", {
		liveSource: "com.sakila.data.Film",
		autoUpdate: false,
		operation: "insertData"
	}, {
	}],
	layoutBox1: ["wm.Layout", {
		box: "v",
		height: "1flex"
	}, {
	}, {
		liveForm1: ["wm.LiveForm", {
			readonly: true,
			height: "228px"
		}, {
			onSuccess: "liveVariable1"
		}, {
			editPanel1: ["wm.EditPanel", {
				liveForm: "liveForm1",
				deleteButton: "deleteButton1",
				updateButton: "updateButton1",
				savePanel: "savePanel1",
				operationPanel: "operationPanel1",
				height: "30px"
			}, {
			}, {
				savePanel1: ["wm.Panel", {
					showing: false,
					box: "h",
					boxPosition: "bottomRight",
					lock: true,
					height: "30px"
				}, {
				}, {
					saveButton1: ["wm.Button", {
						caption: "Save",
						width: "70px",
						height: "30px"
					}, {
						onclick: "editPanel1.saveData"
					}, {
						binding: ["wm.Binding", {
						}, {
						}, {
							wire: ["wm.Wire", {
								targetProperty: "disabled",
								source: "liveForm1.invalid"
							}, {
							}]
						}]
					}],
					spacer1: ["wm.Spacer", {
						width: "6px"
					}, {
					}],
					cancelButton1: ["wm.Button", {
						caption: "Cancel",
						width: "70px",
						height: "30px"
					}, {
						onclick: "editPanel1.cancelEdit"
					}]
				}],
				operationPanel1: ["wm.Panel", {
					box: "h",
					boxPosition: "bottomRight",
					lock: true,
					height: "30px"
				}, {
				}, {
					label2: ["wm.Label", {
						height: "48px",
						caption: "label2",
						width: "70px"
					}, {
					}, {
						format: ["wm.DataFormatter", {
						}, {
						}]
					}],
					newButton1: ["wm.Button", {
						caption: "New",
						width: "43px",
						height: "30px"
					}, {
						onclick: "editPanel1.beginDataInsert"
					}],
					spacer2: ["wm.Spacer", {
						width: "6px"
					}, {
					}],
					updateButton1: ["wm.Button", {
						caption: "Update",
						disabled: true,
						width: "54px",
						height: "30px"
					}, {
						onclick: "editPanel1.beginDataUpdate"
					}],
					spacer3: ["wm.Spacer", {
						width: "6px"
					}, {
					}],
					deleteButton1: ["wm.Button", {
						caption: "Delete",
						disabled: true,
						width: "50px",
						height: "30px"
					}, {
						onclick: "editPanel1.deleteData"
					}]
				}]
			}]
		}]
	}]
}

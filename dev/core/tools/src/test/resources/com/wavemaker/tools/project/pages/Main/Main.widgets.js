Main.widgets = {
	getProjectListCall: ["turbo.ServiceCall", {service: "proman", operation: "getProjectList", autoUpdate: true}, {}, {
		input: ["turbo.Variable", {type: "getProjectListInputs"}, {}, {}],
		queue: ["turbo.ServiceQueue", {}, {}, {}]
	}],
	layoutBox1: ["turbo.Layout", {box: "v", size: 1, sizeUnits: "flex"}, {}, {
		panel1: ["turbo.Panel", {box: "h", size: 26, height: "26px"}, {}, {
			label1: ["turbo.Label", {caption: "Dashboard TBD", width: "96px"}, {}, {
				format: ["turbo.DataFormatter", {}, {}, {}]
			}]
		}],
		panel2: ["turbo.Panel", {box: "v", size: 186, height: "186px"}, {}, {
			label2: ["turbo.Label", {caption: "Overview of Ongoing Projects (click a project for details)", size: 18, height: "18px"}, {}, {
				format: ["turbo.DataFormatter", {}, {}, {}]
			}],
			dataGrid1: ["turbo.DataGrid", {emptySelection: true}, {onCellClick: "dataGrid1CellClick"}, {
				binding: ["turbo.Binding", {}, {}, {
					wire: ["turbo.Wire", {targetProperty: "dataSet", source: "getProjectListCall"}, {}, {}],
					wire1: ["turbo.Wire", {targetId: "app.selectedProject", targetProperty: "stringValue", source: "dataGrid1.selectedItem.pname"}, {}, {}]
				}],
				startDate: ["turbo.DataGridColumn", {field: "startdate", index: 4, formatter: "turbo.formatDate", caption: "Start Date", display: "Date", columnWidth: "118px"}, {}, {
					format: ["turbo.DateFormatter", {}, {}, {}]
				}],
				budget: ["turbo.DataGridColumn", {field: "budget", index: 6, caption: "budget", display: "Money"}, {}, {
					format: ["turbo.MoneyFormatter", {}, {}, {}]
				}],
				percentComplete: ["turbo.DataGridColumn", {field: "percentComplete", index: 3, caption: "Percent Complete", columnWidth: "121px"}, {}, {
					format: ["turbo.DataFormatter", {}, {}, {}]
				}],
				plannedEndDate: ["turbo.DataGridColumn", {field: "plannedenddate", index: 5, formatter: "turbo.formatDate", caption: "Planned End Date", display: "Date"}, {}, {
					format: ["turbo.DateFormatter", {}, {}, {}]
				}],
				variance: ["turbo.DataGridColumn", {field: "variance", index: 8, caption: "variance", display: "Money"}, {}, {
					format: ["turbo.MoneyFormatter", {}, {}, {}]
				}],
				estimateAtComplete: ["turbo.DataGridColumn", {field: "budgetEstimate", index: 7, caption: "estimateAtComplete", display: "Money"}, {}, {
					format: ["turbo.MoneyFormatter", {}, {}, {}]
				}],
				manager: ["turbo.DataGridColumn", {field: "employee.firstname", index: 1, caption: "Manager"}, {}, {
					format: ["turbo.DataFormatter", {}, {}, {}]
				}],
				status: ["turbo.DataGridColumn", {field: "status", index: 2, caption: "Status"}, {}, {
					format: ["turbo.DataFormatter", {}, {}, {}]
				}],
				projectName: ["turbo.DataGridColumn", {field: "pname", caption: "Project Name", columnWidth: "94px"}, {}, {
					format: ["turbo.DataFormatter", {}, {}, {}]
				}]
			}]
		}]
	}]
}
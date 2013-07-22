/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
AdminPage.widgets = {
	svarGetKey: ["wm.ServiceVariable", {"operation":"createKey","service":"SpinUpService"}, {}, {
		input: ["wm.ServiceInput", {"type":"createKeyInputs"}, {}]
	}],
	svarUpdate: ["wm.ServiceVariable", {"operation":"checkForUpdate","service":"SpinUpService"}, {}, {
		input: ["wm.ServiceInput", {"type":"checkForUpdateInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"KeyEditor.dataValue","targetProperty":"key"}, {}]
			}]
		}]
	}],
	layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		panel1: ["wm.Panel", {"height":"40px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			keyGenButton: ["wm.Button", {"caption":"GenKey","margin":"4"}, {"onclick":"svarGetKey"}],
			updateButton: ["wm.Button", {"caption":"Update","margin":"4"}, {"onclick":"svarUpdate"}]
		}],
		KeyEditor: ["wm.Number", {"caption":"Key","captionSize":"50px","dataValue":0,"displayValue":"","emptyValue":"zero","maximum":NaN}, {}]
	}]
}
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
Button_Busy.widgets = {
	filmLiveVar: ["wm.LiveVariable", {"autoUpdate":false,"liveSource":"com.sampledatadb.data.Film","startUpdate":false}, {"onSuccess":"filmLiveVarSuccess","onBeforeUpdate":"filmLiveVarBeforeUpdate"}],
	layoutBox1: ["wm.Layout", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
		panel7: ["wm.Panel", {"height":"571px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel22: ["wm.Panel", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				label23: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_14px","DemoHeader"]},"border":"0","caption":"Busy Button","padding":"4","width":"120px"}, {}, {
					format: ["wm.DataFormatter", {}, {}]
				}]
			}],
			panel27: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				panel29: ["wm.Panel", {"height":"100%","horizontalAlign":"left","padding":"0,0,0,10","verticalAlign":"top","width":"450px"}, {}, {
					label27: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Try It!","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					label30: ["wm.Label", {"border":"0","caption":"<b>Directions:</b> push button to start Java operation with 2 second delay","height":"34px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel30: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
						busyButton1: ["wm.BusyButton", {"caption":"Start Operation!","defaultIconUrl":"lib/wm/base/widget/themes/default/images/blank.gif","hint":"Click this button to call a service - spinner ","iconMargin":"2px 0 0 -5px","margin":"4","width":"144px"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"filmLiveVar","targetProperty":"clickVariable"}, {}]
							}]
						}]
					}],
					label28: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_16px","wm_BackgroundColor_LightGray"]},"border":"0","caption":"Result","height":"32px","padding":"4","width":"100%"}, {}, {
						format: ["wm.DataFormatter", {}, {}]
					}],
					panel16: ["wm.Panel", {"height":"60px","horizontalAlign":"left","padding":"0,0,0,20","verticalAlign":"middle","width":"100%"}, {}, {
						label15: ["wm.Label", {"autoSizeWidth":true,"border":"0","caption":"Operation response is","padding":"4","width":"135px"}, {}, {
							format: ["wm.DataFormatter", {}, {}]
						}],
						labelBusy: ["wm.Label", {"border":"0","padding":"4","width":"100%"}, {}, {
							format: ["wm.DataFormatter", {}, {}],
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"app.waitSvcVar.dataValue","targetProperty":"caption"}, {}]
							}]
						}]
					}]
				}],
				panel28: ["wm.MainContentPanel", {"height":"100%","horizontalAlign":"left","margin":"0,0,0,10","verticalAlign":"top","width":"280px"}, {}, {
					fancyPanel4: ["wm.FancyPanel", {"labelHeight":"36","title":"Description"}, {}, {
						panel6: ["wm.EmphasizedContentPanel", {"border":"1","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							html4: ["wm.Html", {"border":"0","height":"100%","html":"<p>The busy button shows a spinner to indicate that a service called by clicking the button is still working. When the service completes, the spinner goes away.</p>\n<p>This example shows using a busy button to fire off a database query and was built using drag and drop development and no code!</p>\n<h3>Documentation</h3>\n<ul>\n<li><a href=\"http://dev.wavemaker.com/wiki/bin/wmjsref_6.4/BusyButton\">Busy Button Widget</a></li>\n</ul>\n<h3>Related Examples</h3>\n<ul>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=button&amp;layer=button\">Button</a></li>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=button&amp;layer=toggle\">Toggle Button</a></li>\n<li><a href=\"http://widgetexamples.cloudfoundry.com/?page=button&amp;layer=popup\">Popup Button</a></li>\n</ul>","margin":"5","width":"100%"}, {}]
						}]
					}]
				}]
			}]
		}]
	}]
}
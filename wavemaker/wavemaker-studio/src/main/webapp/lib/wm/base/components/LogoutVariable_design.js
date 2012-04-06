/*
 *  Copyright (C) 2012 VMware, Inc. All rights reserved.
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
dojo.provide("wm.base.components.LogoutVariable_design");
dojo.require("wm.base.components.LogoutVariable");
wm.Object.extendSchema(wm.LogoutVariable, {
    clearDataOnLogout: {group: "widgetName", subgroup: "behavior"},
    downloadFile: {ignore: 1},
	logoutNavCall: {ignore: 1},
	operation: { ignore:1},
        clearInput: { ignore: 1},
	onSetData: {ignore: 1},
	service: {ignore: 1},
        autoUpdate: {ignore: 1},
        startUpdate: {ignore: 1},
        updateNow: {ignore: 1},
        queue: {ignore: 1},
        maxResults: {ignore: 1},
        designMaxResults: {ignore: 1}
  });


wm.LogoutVariable.description = "Data from a service.";

/**#@+ @design */
wm.LogoutVariable.extend({
	/** @lends wm.LogoutVariable.prototype */
  });
/**#@- @design */

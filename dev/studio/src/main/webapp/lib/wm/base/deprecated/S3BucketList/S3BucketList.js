/*
 * Copyright (C) 2010-2011 VMWare, Inc. All rights reserved.
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
 

dojo.declare("S3BucketList", wm.Page, {
        i18n: true,
  start: function() {
  },
  copyWarButtonClick: function(inSender, inEvent) {
  },
  cancelButtonClick: function(inSender, inEvent) {
    this.owner.owner.dismiss();
  },
  dismissThis: function() {
    this.owner.owner.dismiss();   
  },
  deleteButtonClick: function(inSender, inEvent) {
    
  },
  deleteWarButtonClick: function(inSender, inEvent) {
    
  },
  newButtonClick: function(inSender, inEvent) {
    
  },
  _end: 0
});
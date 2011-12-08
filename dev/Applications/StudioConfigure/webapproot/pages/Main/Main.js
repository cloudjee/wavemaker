/*
 *  Copyright (C) 2010-2011 VMWare, Inc. All rights reserved.
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
 


dojo.declare("Main", wm.Page, {
	"i18n": true,
    start: function() {

    },
    downloadAndInstallServiceVarSuccess: function(inSender, inDeprecated) {
      try {
          app.toastSuccess("Installation successful");
          window.setTimeout(function() {window.location = window.pathname = "/wavemaker/";},1600);
          
      } catch(e) {
          console.error('ERROR IN downloadAndInstallServiceVarSuccess: ' + e); 
      } 
  },
  downloadAndInstallServiceVarError: function(inSender, inError) {
      try {
        if (inError.message.match(/timed out/i)) {
            this.bypassFirewallLabel.hide();
            this.label2.show();
            this.fileUploadLayer.activate();
        } else if (inError.message.match(/permissions/i) || inError.message.match(/access is denied/i)) {
            this.permissionsLayer.activate();
        }
      } catch(e) {
          console.error('ERROR IN downloadAndInstallServiceVarError: ' + e); 
      } 
  },
    
  manualLabelClick: function(inSender, inEvent) {
      try {
        this.bypassFirewallLabel.show();
        this.label2.hide();
        this.fileUploadLayer.activate();
          
      } catch(e) {
          console.error('ERROR IN manualLabelClick: ' + e); 
      } 
  },
  autoLabelClick: function(inSender, inEvent) {
      try {
          this.manualLabelClick(inSender, inEvent);
          
      } catch(e) {
          console.error('ERROR IN manualLabel1Click: ' + e); 
      } 
  },
  dojoFileUpload1Success: function(inSender, fileList) {
      try {
          this.downloadAndInstallServiceVarSuccess(inSender);
          
      } catch(e) {
          console.error('ERROR IN dojoFileUpload1Success: ' + e); 
      } 
  },
  downloadZipButtonClick: function(inSender) {
      try {
              var iframe = dojo.byId("downloadFrame");
		      if (iframe) iframe.parentNode.removeChild(iframe);
		      iframe = document.createElement("iframe");
		      dojo.attr(iframe, {id: "downloadFrame",
					 name: "downloadFrame",
                     src: "https://github.com/wavemaker/WaveMaker-LGPL-Resources-6-4/blob/master/repo.zip?raw=true"}); 
		      dojo.style(iframe, {top: "1px",
					  left: "1px",
					  width: "1px",
					  height: "1px",
					  visibility: "hidden"}); 
		      dojo.body().appendChild(iframe);
          
      } catch(e) {
          console.error('ERROR IN downloadZipButtonClick: ' + e); 
      } 
  },
 
   dojoFileUpload1Error: function(inSender, inErrorMsg) {
      try {
          this.downloadAndInstallServiceVarError(inSender,{message:inErrorMsg});
          
      } catch(e) {
          console.error('ERROR IN dojoFileUpload1Error: ' + e); 
      }
   },
  _end: 0
});
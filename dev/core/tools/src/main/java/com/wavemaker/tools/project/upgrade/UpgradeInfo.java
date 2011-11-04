/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.project.upgrade;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;

/**
 * A type describing the return of a series of upgrades. Messages will always be displayed to the user; verbose will
 * only be displayed if the user selects a "More Info" option. Therefore, info which requires user action should be
 * placed into messages; informational info should go into verbose.
 * 
 * @author Matt Small
 */
public class UpgradeInfo {

    public void addMessage(String message) {

        String versionStr = "" + this.version;
        if (!this.messages.containsKey(versionStr)) {
            this.messages.put(versionStr, new ArrayList<String>());
        }
        this.messages.get(versionStr).add(message);
    }

    public void addVerbose(String message) {

        String versionStr = "" + this.version;
        if (!this.verbose.containsKey(versionStr)) {
            this.verbose.put(versionStr, new ArrayList<String>());
        }
        this.verbose.get(versionStr).add(message);
    }

    // bean properties
    private Map<String, List<String>> messages = new HashMap<String, List<String>>();

    private Map<String, List<String>> verbose = new HashMap<String, List<String>>();

    private Resource backupExportFile;

    private double version = -1;

    public Resource getBackupExportFile() {
        return this.backupExportFile;
    }

    public void setBackupExportFile(Resource backupExportFile) {
        this.backupExportFile = backupExportFile;
    }

    public double getVersion() {
        return this.version;
    }

    public void setVersion(double version) {
        this.version = version;
    }

    public Map<String, List<String>> getMessages() {
        return this.messages;
    }

    public void setMessages(Map<String, List<String>> messages) {
        this.messages = messages;
    }

    public Map<String, List<String>> getVerbose() {
        return this.verbose;
    }

    public void setVerbose(Map<String, List<String>> verbose) {
        this.verbose = verbose;
    }
}
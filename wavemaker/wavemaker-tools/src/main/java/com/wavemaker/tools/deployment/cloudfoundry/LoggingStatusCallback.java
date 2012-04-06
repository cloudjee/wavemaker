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

package com.wavemaker.tools.deployment.cloudfoundry;

import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.cloudfoundry.client.lib.UploadStatusCallback;

public class LoggingStatusCallback implements UploadStatusCallback {

    private static final Log log = LogFactory.getLog(LoggingStatusCallback.class);

    private final Timer timer;

    public LoggingStatusCallback(Timer timer) {
        this.timer = timer;
    }

    @Override
    public void onCheckResources() {
        log.info("Preparing to upload to CloudFoundry - comparing resources...");
    }

    @Override
    public void onMatchedFileNames(Set<String> fileNames) {
        log.info(fileNames.size() + " files already cached...");
    }

    @Override
    public void onProcessMatchedResources(int length) {
        log.info("Uploading " + length + " bytes...");
        this.timer.start();
    }

    public static final class Timer {

        private long startTime;

        public void start() {
            this.startTime = System.currentTimeMillis();
        }

        public long stop() {
            return System.currentTimeMillis() - this.startTime;
        }
    }

}

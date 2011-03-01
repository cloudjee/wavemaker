/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.tools.common;

import com.wavemaker.common.LoggingInitializer;
import com.wavemaker.common.util.SpringUtils;

/**
 * Entry point for bootstrapping the system. Knows about other Bootstrap classes
 * in the system.
 * 
 * @author Simon Toens
 */
public class Bootstrap {

    private static boolean hasRun = false;

    public synchronized static void main(String[] args) {

        if (hasRun) {
            return;
        }

        LoggingInitializer.initProdLogging();

        SpringUtils.initSpringConfig();

        com.wavemaker.tools.data.Bootstrap.main(args);
        com.wavemaker.tools.ws.Bootstrap.main(args);

        hasRun = true;
    }

    private Bootstrap() {}

}

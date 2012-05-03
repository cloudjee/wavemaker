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

package com.wavemaker.tools.cloudfoundry.spinup;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * {@link ApplicationNamingStrategy} that generates application URLs based on the logged in used combined with random
 * characters. The application name is fixed.
 * 
 * @author Phillip Webb
 */
public abstract class UsernameWithRandomApplicationNamingStrategy extends AbstractRandomApplicationNamingStrategy {

    private static final Pattern USERNAME_PATTERN = Pattern.compile("([^@]*)@.*");

    @Override
    protected String getNameRoot(ApplicationNamingStrategyContext context) {
        String name = context.getUsername();
        Matcher matcher = USERNAME_PATTERN.matcher(name);
        if (matcher.matches()) {
            name = matcher.group(1);
        }
        return name;
    }
}

/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.service.definitions;

import java.io.Serializable;
import java.util.Comparator;

/**
 * @author Matt Small
 */
public class ServiceComparator implements Comparator<Service>, Serializable {

    private static final long serialVersionUID = 1L;

    @Override
    public int compare(Service o1, Service o2) {

        return o1.getId().compareTo(o2.getId());
    }
}
/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
package com.activegrid.runtime.data;

import org.hibernate.Session;

/**
 * Command Object.
 * 
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 * @deprecated This is now deprecated; see
 *             {@link com.wavemaker.runtime.data.Task}. This will be removed in
 *             a future release.
 */
@Deprecated
public interface Task {
    
    Object run(Session session, Object... input);
    
    String getName();

    Task getNestedTask();
    
}

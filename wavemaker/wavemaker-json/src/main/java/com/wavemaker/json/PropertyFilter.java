/*
 *  Copyright (C) 2009-2011 VMware, Inc. All rights reserved.
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

/*
 * Copyright 2002-2007 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.wavemaker.json;

/**
 * Provides a method to filter out properties.
 * 
 * Based on <tt>net.sf.json.util.PropertyFilter</tt> by Andres Almiray, (c) 2002-2007 and licensed under ASL 2.0.
 * 
 * @author Andres Almiray
 * @author Matt Small
 */
public interface PropertyFilter {

    /**
     * Interface method; returns true iff the property with the specified name should be filtered out.
     * 
     * @param object The Java object being serialized or de-serialized.
     * @param name The name of the property to check for.
     * @param value The value of the property.
     * @return True iff the property should be filtered out; false if it should be included.
     */
    public boolean filter(Object object, String name, Object value);
}
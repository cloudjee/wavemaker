/*
 *  Copyright (C) 2007-2010 WaveMaker Software, Inc.
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
package com.wavemaker.runtime.data;

import java.util.Collection;
import java.util.List;

import com.wavemaker.common.util.Tuple;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 *
 */
public interface DataOperationFactory {
    
    Collection<String> getQueryNames();
    
    List<String> getQueryReturnTypes(String operationName, String queryName);
    List<String> getQueryReturnNames(String operationName, String queryName);           
            
    boolean queryReturnsSingleResult(String operationName, String queryName);
    boolean requiresResultWrapper(String operationName, String queryName);
    Collection<Tuple.Three<String, String, Boolean>> 
	getQueryInputs(String queryName);
    
    Collection<String> getEntityClassNames();

}

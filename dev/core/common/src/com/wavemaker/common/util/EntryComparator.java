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

package com.wavemaker.common.util;

import java.util.Comparator;
import java.util.Map.Entry;

/**
 * Compares Map.Entry objects, using their keys.  The keys will be converted
 * to Strings (using toString()), and the Strings will be compared, and that
 * result returned.
 * 
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class EntryComparator implements Comparator<Entry<?, ?>> {

    /* (non-Javadoc)
     * @see java.util.Comparator#compare(java.lang.Object, java.lang.Object)
     */
    public int compare(Entry<?, ?> o1, Entry<?, ?> o2) {
        
        String s1 = o1.getKey().toString();
        String s2 = o2.getKey().toString();
        
        return s1.compareTo(s2);
    }
}
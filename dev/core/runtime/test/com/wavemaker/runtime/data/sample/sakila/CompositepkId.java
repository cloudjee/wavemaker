/*
 *  Copyright (C) 2009 WaveMaker Software, Inc.
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
package com.wavemaker.runtime.data.sample.sakila;
// Generated Jan 9, 2008 4:21:59 PM by Hibernate Tools 3.2.0.CR1


@SuppressWarnings({"serial"})
public class CompositepkId implements java.io.Serializable {

    private String id;
    private String id2;

    public String getId() {
        return this.id;
    }

    public String getId2() {
        return this.id2;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public void setId2(String id2) {
	this.id2 = id2;
    }

    public boolean equals(Object other) {
	if (!(other instanceof CompositepkId)) {
	    return false;
	}
        return hashCode() == other.hashCode();
    }

    public int hashCode() {
         int result = 17;
         
         result = 37 * result + ( getId() == null ? 0 : this.getId().hashCode() );
         result = 37 * result + ( getId2() == null ? 0 : this.getId2().hashCode() );
         return result;
    }
}



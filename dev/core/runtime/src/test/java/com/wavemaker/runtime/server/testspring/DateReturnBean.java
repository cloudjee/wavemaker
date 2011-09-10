/*
 *  Copyright (C) 2007-2009 WaveMaker Software, Inc.
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
package com.wavemaker.runtime.server.testspring;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class DateReturnBean {
    
    long now;
    
    public DateReturnBean() {
        now = System.currentTimeMillis();
    }
    
    public java.util.Date getUtilDate() {
        return new java.util.Date(now);
    }
    
    public java.sql.Date getSqlDate() {
        return new java.sql.Date(now);
    }
    
    public long getNow() {
        return now;
    }
    
    public java.sql.Date getSqlDateFromParam(java.sql.Date date) {
        return new java.sql.Date(date.getTime()+1);
    }
    
    public java.util.Date getUtilDateFromParam(java.util.Date date) {
        return new java.util.Date(date.getTime()+1);
    }
    
    public java.sql.Time getSqlTimeFromParam(java.sql.Time time) {
        return new java.sql.Time(time.getTime()+1);
    }
    
    public java.sql.Timestamp getSqlTimestampFromParam(java.sql.Timestamp time) {
        return new java.sql.Timestamp(time.getTime()+1);
    }
    
    public WrappedDate getWrappedDate(WrappedDate wd) {
        return wd;
    }
    
    public static class WrappedDate {
        private java.util.Date fooDate;
        private java.sql.Date sqlDate;
        private java.sql.Time sqlTime;
        private java.sql.Timestamp sqlTimestamp;
        
        public java.sql.Date getSqlDate() {
            return sqlDate;
        }
        public void setSqlDate(java.sql.Date sqlDate) {
            this.sqlDate = sqlDate;
        }
        public java.sql.Time getSqlTime() {
            return sqlTime;
        }
        public void setSqlTime(java.sql.Time sqlTime) {
            this.sqlTime = sqlTime;
        }
        public java.sql.Timestamp getSqlTimestamp() {
            return sqlTimestamp;
        }
        public void setSqlTimestamp(java.sql.Timestamp sqlTimestamp) {
            this.sqlTimestamp = sqlTimestamp;
        }
        public java.util.Date getFooDate() {
            return fooDate;
        }
        public void setFooDate(java.util.Date fooDate) {
            this.fooDate = fooDate;
        }
    }
}
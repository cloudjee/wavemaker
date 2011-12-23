/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.tools.data;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * @author Simon Toens
 */
public class RelatedInfo implements Cloneable {

    public enum Cardinality {

        OneToZeroOrOne, OneToOne, OneToMany;

        @Override
        public String toString() {
            if (this == OneToZeroOrOne) {
                return "to-zero-or-one";
            } else if (this == OneToOne) {
                return "to-one";
            } else {
                return "to-many";
            }
        }
    }

    public enum CascadeOption {

        None("none"), SaveUpdate("save-update"), Persist("persist"), Merge("merge"), Delete("delete"), Remove("remove"), Lock("lock"), Replicate("replicate"), Evict("evict"), Refresh("refresh"), All("all"), DeleteOrphan("delete-orphan");

        private String toString;

        private CascadeOption(String toString) {
            this.toString = toString;
        }

        @Override
        public String toString() {
            return this.toString;
        }

        public static CascadeOption fromString(String s) {
            if (None.toString().equalsIgnoreCase(s)) {
                return None;
            } else if (SaveUpdate.toString().equalsIgnoreCase(s)) {
                return SaveUpdate;
            } else if (Persist.toString().equalsIgnoreCase(s)) {
                return Persist;
            } else if (Merge.toString().equalsIgnoreCase(s)) {
                return Merge;
            } else if (Delete.toString().equalsIgnoreCase(s)) {
                return Delete;
            } else if (Remove.toString().equalsIgnoreCase(s)) {
                return Remove;
            } else if (Lock.toString().equalsIgnoreCase(s)) {
                return Lock;
            } else if (Replicate.toString().equalsIgnoreCase(s)) {
                return Replicate;
            } else if (Evict.toString().equalsIgnoreCase(s)) {
                return Evict;
            } else if (Refresh.toString().equalsIgnoreCase(s)) {
                return Refresh;
            } else if (All.toString().equalsIgnoreCase(s)) {
                return All;
            } else if (DeleteOrphan.toString().equalsIgnoreCase(s)) {
                return DeleteOrphan;
            } else {
                throw new AssertionError("Unknown cascade option: " + s);
            }
        }
    };

    // relationship name
    private String name = null;

    // the table name of the owning entity
    private String tableName = null;

    private String fullyQualifiedType = null;

    private String relatedType = null;

    private List<ColumnInfo> foreignKeyColumns = new ArrayList<ColumnInfo>();

    private List<String> foreignKeyColumnNames = new ArrayList<String>();

    private Cardinality cardinality = null;

    private List<CascadeOption> cascadeOptions = new ArrayList<CascadeOption>();

    public RelatedInfo() {
    }

    public RelatedInfo(String name, String relatedType, String tableName, Cardinality cardinality) {

        this.name = name;
        this.tableName = tableName;
        this.relatedType = relatedType;
        this.cardinality = cardinality;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTableName() {
        return this.tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getRelatedType() {
        return this.relatedType;
    }

    public void setRelatedType(String relatedType) {
        this.relatedType = relatedType;
    }

    public void setFullyQualifiedType(String fullyQualifiedType) {
        this.fullyQualifiedType = fullyQualifiedType;
    }

    public String getFullyQualifiedType() {
        return this.fullyQualifiedType;
    }

    public String getCardinality() {
        return this.cardinality.toString();
    }

    public Cardinality cardinality() {
        return this.cardinality;
    }

    public void setCardinality(String cardinality) {
        if (cardinality.equals(Cardinality.OneToMany.toString())) {
            this.cardinality = Cardinality.OneToMany;
        } else if (cardinality.equals(Cardinality.OneToOne.toString())) {
            this.cardinality = Cardinality.OneToOne;
        } else if (cardinality.equals(Cardinality.OneToZeroOrOne.toString())) {
            this.cardinality = Cardinality.OneToZeroOrOne;
        } else {
            throw new AssertionError("Unknown cardinality: " + cardinality);
        }
    }

    public void setCascadeOptions(CascadeOption cascadeOption) {
        this.cascadeOptions = new ArrayList<CascadeOption>(1);
        this.cascadeOptions.add(cascadeOption);
    }

    public CascadeOption getCascadeOptions() {
        if (this.cascadeOptions.isEmpty()) {
            return CascadeOption.None;
        }
        return this.cascadeOptions.get(0);
    }

    public ColumnInfo[] foreignKeyColumns() {
        return this.foreignKeyColumns.toArray(new ColumnInfo[this.foreignKeyColumns.size()]);
    }

    public void setColumnNames(String[] names) {
        this.foreignKeyColumnNames = Arrays.asList(names);
    }

    public void foreignKeyColumns(ColumnInfo[] foreignKeyColumns) {
        this.foreignKeyColumns = Arrays.asList(foreignKeyColumns);
        this.foreignKeyColumnNames = new ArrayList<String>(foreignKeyColumns.length);
        for (ColumnInfo i : foreignKeyColumns) {
            this.foreignKeyColumnNames.add(i.getName());
        }
    }

    public String[] getColumnNames() {
        return this.foreignKeyColumnNames.toArray(new String[this.foreignKeyColumnNames.size()]);
    }

    @Override
    public String toString() {
        return this.name + " fq: " + this.fullyQualifiedType + " related type: " + this.relatedType;
    }

    @Override
    public Object clone() {
        try {
            RelatedInfo rtn = (RelatedInfo) super.clone();
            rtn.foreignKeyColumns = new ArrayList<ColumnInfo>(this.foreignKeyColumns.size());
            for (ColumnInfo ci : this.foreignKeyColumns) {
                rtn.foreignKeyColumns.add((ColumnInfo) ci.clone());
            }
            return rtn;
        } catch (CloneNotSupportedException ex) {
            throw new AssertionError(ex);
        }
    }
}

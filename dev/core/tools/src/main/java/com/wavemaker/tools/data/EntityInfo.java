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
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.wavemaker.common.MessageResource;
import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.OneToManyMap;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.Tuple;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.common.ConfigurationException;

/**
 * @author Simon Toens
 */
public class EntityInfo implements Cloneable {

    private static final String DEFAULT_ID_NAME = "Id";

    private String packageName = null;

    private String entity = null;

    private String table = null;

    private String catalog = null;

    private String schema = null;

    private boolean dynamicInsert = false;

    private boolean dynamicUpdate = false;

    private boolean refreshEntity = false;

    private PropertyInfo id = null;

    private final Map<String, PropertyInfo> properties = new LinkedHashMap<String, PropertyInfo>();

    private final Map<String, PropertyInfo> relatedProperties = new LinkedHashMap<String, PropertyInfo>();

    private Map<String, ColumnInfo> columns = new LinkedHashMap<String, ColumnInfo>();

    public EntityInfo() {
    }

    public EntityInfo(String packageName, String entity, String table, String schema, String catalog) {
        this.entity = entity;
        this.table = table;
        this.schema = schema;
        this.catalog = catalog;
        this.packageName = packageName;
    }

    public String getPackageName() {
        return this.packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getEntityName() {
        return this.entity;
    }

    public void setEntityName(String entity) {
        this.entity = entity;
    }

    public String getTableName() {
        return this.table;
    }

    public void setTableName(String table) {
        this.table = table;
    }

    public String getCatalogName() {
        return this.catalog;
    }

    public String getSchemaName() {
        return this.schema;
    }

    public void setSchemaName(String schema) {
        this.schema = schema;
    }

    public void setCatalogName(String catalog) {
        this.catalog = catalog;
    }

    public PropertyInfo getId() {
        return this.id;
    }

    public void setId(PropertyInfo id) {
        this.id = id;
    }

    public boolean isDynamicInsert() {
        return this.dynamicInsert;
    }

    public void setDynamicInsert(boolean dynamicInsert) {
        this.dynamicInsert = dynamicInsert;
    }

    public boolean isDynamicUpdate() {
        return this.dynamicUpdate;
    }

    public void setDynamicUpdate(boolean dynamicUpdate) {
        this.dynamicUpdate = dynamicUpdate;
    }

    public boolean isRefreshEntity() {
        return this.refreshEntity;
    }

    public void setRefreshEntity(boolean refreshEntity) {
        this.refreshEntity = refreshEntity;
    }

    public PropertyInfo getProperty(String property) {
        return this.properties.get(property);
    }

    public Collection<String> getPropertyNames() {
        return this.properties.keySet();
    }

    public Collection<PropertyInfo> getProperties() {
        return this.properties.values();
    }

    public Map<String, PropertyInfo> getPropertiesMap() {
        return this.properties;
    }

    public void setProperties(List<PropertyInfo> properties) {
        for (PropertyInfo p : properties) {
            this.properties.put(p.getName(), p);
        }
    }

    public void addProperty(PropertyInfo property) {
        this.properties.put(property.getName(), property);
    }

    public void removeProperty(PropertyInfo property) {
        this.relatedProperties.remove(property.getName());
        this.properties.remove(property.getName());
    }

    public void initFkColumnTypes(DataModelConfiguration cfg) {
        for (PropertyInfo p : this.properties.values()) {
            if (p.getIsRelated() && !p.getIsInverse()) {
                int i = 0;
                for (ColumnInfo ci : p.allColumns()) {
                    ci.setSqlType(getReferencedPkType(p, cfg, i));
                    ci.persistType(false);
                    i++;
                }
            }
        }
    }

    public Collection<PropertyInfo> getRelatedProperties() {
        return this.relatedProperties.values();
    }

    public void setRelatedProperties(List<PropertyInfo> relatedProperties) {
        for (PropertyInfo p : relatedProperties) {
            this.relatedProperties.put(p.getName(), p);
        }
    }

    // adds to both related and properties
    public void addRelatedProperty(PropertyInfo property) {
        addProperty(property);
        this.relatedProperties.put(property.getName(), property);
    }

    public Collection<ColumnInfo> getColumns() {
        return this.columns.values();
    }

    public ColumnInfo getColumn(String name) {
        return this.columns.get(name);
    }

    public void setColumns(Map<String, ColumnInfo> columns) {
        this.columns = columns;
    }

    public Map<String, ColumnInfo> getColumnsMap() {
        return this.columns;
    }

    public void addColumn(ColumnInfo column) {
        this.columns.put(column.getName(), column);
    }

    public void removeColumn(ColumnInfo column) {
        this.columns.remove(column.getName());
    }

    public Collection<EntityInfo> updateRelated(List<PropertyInfo> rels, DataModelConfiguration mgr) {

        // check referenced types exist
        for (PropertyInfo p : rels) {
            mgr.getEntity(p.getType());
        }

        Collection<EntityInfo> rtn = new HashSet<EntityInfo>();

        OneToManyMap<EntityInfo, PropertyInfo> removedProperties = removeAllOwnedRelated(mgr, rels);

        rtn.addAll(removedProperties.keySet());

        for (PropertyInfo rel : rels) {

            if (rel.getIsInverse()) {

                // FIXME - This is crazy complicated logic. Does this work for
                // composite?

                boolean found = false;

                for (PropertyInfo currentRelated : new HashSet<PropertyInfo>(this.relatedProperties.values())) {
                    if (currentRelated.getIsInverse()) {
                        if (matches(rel, currentRelated)) {
                            removeProperty(currentRelated);
                            currentRelated.setName(rel.getName());
                            currentRelated.setCascadeOptions(rel.getCascadeOptions());
                            addRelatedProperty(currentRelated);
                            found = true;
                            break;
                        }
                    }
                }

                if (!found) {
                    // we get here when renaming an Entity
                    addRelatedProperty(rel);
                }

                continue;
            }

            movePropertyToRelated(rel);

            // need to add the to-many side of the relationship
            PropertyInfo toMany = PropertyInfo.newToManyProperty(this, rel);

            EntityInfo relatedEntity = mgr.getEntity(rel.getType());

            String toManyName = null;
            // if this relationship already existed, re-use its "to-many" name
            // also re-use its cascade options settings
            if (removedProperties.containsKey(relatedEntity)) {
                for (PropertyInfo p : removedProperties.get(relatedEntity)) {
                    if (p.getColumn().getName().equals(rel.getColumn().getName())) {
                        toManyName = p.getName();
                        toMany.setCascadeOptions(p.getCascadeOptions());
                    }
                }
            }

            if (toManyName == null) {
                toManyName = relatedEntity.getUniquePropertyName(toMany.getType() + "s").toLowerCase();
                if (toManyName.endsWith("ys")) {
                    toManyName = toManyName.substring(0, toManyName.length() - 2) + "ies";
                }
            }

            toMany.setName(toManyName);

            relatedEntity.addRelatedProperty(toMany);

            List<ColumnInfo> allColumns = rel.allColumns();
            if (allColumns.size() == 1) {
                ColumnInfo ci = allColumns.iterator().next();
                toMany.setColumn((ColumnInfo) ci.clone());
            } else {
                for (ColumnInfo ci : allColumns) {
                    ColumnInfo clone = (ColumnInfo) ci.clone();
                    PropertyInfo p = PropertyInfo.newProperty();
                    p.fromColumn(clone);
                    toMany.addCompositeProperty(p);
                }
            }

            rtn.add(relatedEntity);
        }

        return rtn;
    }

    public String getUniquePropertyName(String name) {
        return StringUtils.getUniqueName(name, this.properties.keySet());
    }

    public void updateColumnGenerator(List<ColumnInfo> columns) {

        for (ColumnInfo ci : columns) {
            ColumnInfo org = getColumn(ci.getName());
            org.setGenerator(ci.getGenerator());
            org.setGeneratorParam(ci.getGeneratorParam());
        }
    }

    public void updateColumns(List<ColumnInfo> columns, List<PropertyInfo> properties, DataModelConfiguration config) {

        ensureIdColumnExists(columns);

        String compIdType = null;
        if (getId() != null && getId().hasCompositeProperties()) {
            compIdType = getId().getType();
        }

        removeSimpleProperties();

        // unit tests ref passed in list
        columns = new ArrayList<ColumnInfo>(columns);

        // find pk columns
        List<ColumnInfo> primaryKeyColumns = new ArrayList<ColumnInfo>();
        for (ColumnInfo ci : new ArrayList<ColumnInfo>(columns)) {
            if (ci.getIsPk()) {
                primaryKeyColumns.add(ci);
                columns.remove(ci);
            }
        }

        addIdColumns(primaryKeyColumns, properties, compIdType, config);

        for (ColumnInfo ci : columns) {
            if (ci.getIsFk()) {
                // skip - can't add/delete a relationship this way
            } else {
                PropertyInfo p = getPropertyForColumn(ci, properties);
                namesToJavaIdentifiers(p);
                addProperty(p);
                addColumn(ci);
            }
        }
    }

    public void update(EntityInfo o) {
        this.entity = o.entity;
        this.packageName = o.packageName;
        this.table = o.table;
        this.schema = o.schema;
        this.catalog = o.catalog;
        this.dynamicInsert = o.dynamicInsert;
        this.dynamicUpdate = o.dynamicUpdate;
        this.refreshEntity = o.refreshEntity;
    }

    public boolean isEqualTo(EntityInfo o) {
        if (o == null) {
            return false;
        }
        boolean rtn = String.valueOf(this.entity).equals(String.valueOf(o.entity));
        rtn &= String.valueOf(this.packageName).equals(String.valueOf(o.packageName));
        rtn &= String.valueOf(this.table).equals(String.valueOf(o.table));
        rtn &= String.valueOf(this.schema).equals(String.valueOf(o.schema));
        rtn &= String.valueOf(this.catalog).equals(String.valueOf(o.catalog));
        rtn &= String.valueOf(this.entity).equals(String.valueOf(o.entity));
        rtn &= this.dynamicInsert == o.dynamicInsert;
        rtn &= this.dynamicUpdate == o.dynamicUpdate;
        rtn &= this.refreshEntity == o.refreshEntity;

        return rtn;
    }

    @Override
    public Object clone() {
        try {
            return super.clone();
        } catch (CloneNotSupportedException ex) {
            throw new AssertionError(ex);
        }
    }

    @Override
    public String toString() {
        return "entity: " + this.entity + ", package: " + this.packageName + ", table: " + this.table + ", catalog: " + this.catalog;
    }

    private void ensureIdColumnExists(Collection<ColumnInfo> columns) {
        // make sure we have at least one pk column
        boolean foundId = false;
        for (ColumnInfo ci : columns) {
            if (ci.getIsPk()) {
                foundId = true;
                break;
            }
        }
        if (!foundId) {
            // We (Hibernate) require a pk column
            throw new ConfigurationException(MessageResource.NO_PRIMARY_KEY);
        }
    }

    private boolean matches(PropertyInfo p1, PropertyInfo p2) {
        return p1.getType().equals(p2.getType()) && p1.getColumn().getName().equals(p2.getColumn().getName());
    }

    private String getReferencedPkType(PropertyInfo p, DataModelConfiguration cfg, int fkColIndex) {

        EntityInfo other = cfg.getEntity(p.getType());
        PropertyInfo id = other.getId();

        if (id.hasCompositeProperties()) {
            int i = 0;
            for (PropertyInfo cp : id.getCompositeProperties()) {
                if (i == fkColIndex) {
                    return cp.getFullyQualifiedType();
                }
                i++;
            }
        }

        return other.getId().getFullyQualifiedType();
    }

    // input: property that is currently a related property
    private void moveRelatedToProperty(PropertyInfo property, DataModelConfiguration cfg) {

        removeProperty(property);

        // if the col already exists, only remove the property
        List<PropertyInfo> l = getPropertiesMatchingColumnNames(property);
        if (!l.isEmpty()) {
            return;
        }

        property.setName(property.getColumn().getName());
        property.setIsRelated(false);
        property.setIsInverse(false);
        property.getColumn().setIsFk(false);
        addProperty(property);

        property.types(getReferencedPkType(property, cfg, -1));
        property.getColumn().persistType(false);
    }

    // input: related property that has not been added yet
    // there exists a property with same column name
    private void movePropertyToRelated(PropertyInfo related) {
        List<PropertyInfo> propsToMove = getPropertiesMatchingColumnNames(related);
        for (PropertyInfo p : propsToMove) {
            removeProperty(p);
            removeColumn(p.getColumn());
        }

        addRelatedProperty(related);

        for (ColumnInfo ci : related.allColumns()) {
            addColumn(ci);
            ci.setIsFk(true);
        }
    }

    private void removeSimpleProperties() {
        for (PropertyInfo p : new HashSet<PropertyInfo>(this.properties.values())) {
            if (p.getIsRelated()) {
                continue;
            }
            removeProperty(p);
            for (ColumnInfo ci : p.allColumns()) {
                removeColumn(ci);
            }
        }
    }

    private OneToManyMap<EntityInfo, PropertyInfo> removeAllOwnedRelated(DataModelConfiguration mgr, List<PropertyInfo> rels) {

        OneToManyMap<EntityInfo, PropertyInfo> rtn = new OneToManyMap<EntityInfo, PropertyInfo>();

        for (PropertyInfo p : new HashSet<PropertyInfo>(this.relatedProperties.values())) {
            if (p.getIsInverse() && existsInRels(p, rels)) {
                continue;
            }
            EntityInfo other = mgr.getEntity(p.getType());
            for (PropertyInfo op : new HashSet<PropertyInfo>(other.getRelatedProperties())) {

                if (op.getType().equals(this.entity) && op.getColumn().getName().equals(p.getColumn().getName())) {
                    other.removeProperty(op);
                    rtn.put(other, op);
                }
            }
            moveRelatedToProperty(p, mgr);
        }

        return rtn;

    }

    private boolean existsInRels(PropertyInfo propInfo, List<PropertyInfo> rels) {
        boolean rtn = false;
        for (PropertyInfo p : rels) {
            if (propInfo.getType().equals(p.getType()) && propInfo.getColumn().getName().equals(p.getColumn().getName())) {
                rtn = true;
                break;
            }
        }

        return rtn;
    }

    private String getPropertyNameForColumn(ColumnInfo column, List<PropertyInfo> properties) {

        // do we have a different property name?
        for (PropertyInfo p : properties) {
            for (PropertyInfo p2 : p.allProperties()) {
                ColumnInfo ci = p2.getColumn();
                if (ci == null) {
                    continue;
                }
                if (ci.getName().equals(column.getName())) {
                    return p2.getName();
                }
            }
        }

        return null;
    }

    private PropertyInfo getPropertyForColumn(ColumnInfo column, List<PropertyInfo> properties) {

        PropertyInfo rtn = PropertyInfo.newProperty();
        rtn.fromColumn(column);

        String propertyName = getPropertyNameForColumn(column, properties);

        if (propertyName != null) {
            rtn.setName(propertyName);
        }

        return rtn;
    }

    // type name, is new composite key?
    private Tuple.Two<String, Boolean> getCompositeIdType(List<PropertyInfo> properties) {

        String typeName = null;
        Boolean isNewKey = Boolean.FALSE;

        for (PropertyInfo p : properties) {
            if (p.getIsId() && p.hasCompositeProperties()) {
                typeName = p.getFullyQualifiedType();
                break;
            }
        }

        if (typeName == null) {
            isNewKey = Boolean.TRUE;
            // create a new composite key type
            typeName = StringUtils.fq(getPackageName(), getEntityName()) + DEFAULT_ID_NAME;
        }

        return Tuple.tuple(typeName, isNewKey);

    }

    private void addIdColumns(List<ColumnInfo> primaryKeyColumns, List<PropertyInfo> properties, String prevCompIdType, DataModelConfiguration config) {

        PropertyInfo id = null;

        if (primaryKeyColumns.size() > 1) {
            Tuple.Two<String, Boolean> t = getCompositeIdType(properties);
            String compositeIdType = t.v1;
            Boolean isNewType = t.v2;
            id = PropertyInfo.newCompositeIdProperty(Collections.<String, String> emptyMap());
            id.types(compositeIdType);
            for (ColumnInfo ci : primaryKeyColumns) {
                ci.setGenerator(null); // no generator for composite keys
                PropertyInfo p = getPropertyForColumn(ci, properties);
                id.addCompositeProperty(p);
                addColumn(ci);

                String name = DEFAULT_ID_NAME.toLowerCase();
                if (isNewType) {
                    config.addValueType(new TypeInfo(compositeIdType));
                } else {
                    for (PropertyInfo prop : properties) {
                        if (prop.getIsId()) {
                            name = prop.getName();
                            break;
                        }
                    }
                }
                id.setName(name);

            }
        } else if (primaryKeyColumns.size() == 1) {
            ColumnInfo ci = primaryKeyColumns.iterator().next();
            id = PropertyInfo.newIdProperty();
            id.fromColumn(ci);
            addColumn(ci);

            id.setName(getPropertyNameForColumn(ci, properties));

            if (id.getName() == null) {
                id.setName(ci.getName()); // default for tests
            }

            if (prevCompIdType != null) {
                config.deleteValueType(prevCompIdType);
            }

            // if generator is unset, default to assigned
            if (ObjectUtils.isNullOrEmpty(ci.getGenerator())) {
                ci.setGenerator(DataServiceConstants.GENERATOR_ASSIGNED);
            }
        }

        if (id != null) {
            this.id = id;
            namesToJavaIdentifiers(id);
            addProperty(id);
        }

    }

    private void namesToJavaIdentifiers(PropertyInfo property) {
        for (PropertyInfo p : property.allProperties()) {
            p.setName(StringUtils.toJavaIdentifier(p.getName()));
        }
    }

    private List<PropertyInfo> getPropertiesMatchingColumnNames(PropertyInfo property) {

        Collection<String> colNamesToFind = property.allColumnNames();

        List<PropertyInfo> rtn = new ArrayList<PropertyInfo>();

        for (PropertyInfo p : this.properties.values()) {
            if (p.hasCompositeProperties()) {
                continue;
            }
            if (colNamesToFind.contains(p.getColumn().getName())) {
                rtn.add(p);
                if (rtn.size() == colNamesToFind.size()) {
                    return rtn;
                }
            }
        }
        return rtn;
    }

}

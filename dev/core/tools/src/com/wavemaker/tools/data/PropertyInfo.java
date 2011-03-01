/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
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
package com.wavemaker.tools.data;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.data.RelatedInfo.CascadeOption;
import com.wavemaker.tools.data.parser.HbmConstants;

/**
 * Wrapper around Property. If a Property is not a simple java type (related
 * object, component), compositeProperties has the "backing" PropertyInfos.
 * 
 * Also has ColumnInfo instance if backed by a db column.
 * 
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class PropertyInfo {

    public static final String PK_META = "pk";

    private String name = null;

    private String type = null;

    private String fullyQualifiedType = null;

    private boolean isId = false;

    private boolean isRelated = false;

    private boolean isInverse = false;

    private RelatedInfo.Cardinality cardinality = null;

    private List<RelatedInfo.CascadeOption> cascadeOptions = 
	new ArrayList<RelatedInfo.CascadeOption>();

    private List<PropertyInfo> compositeProperties = 
	new ArrayList<PropertyInfo>();

    private ColumnInfo columnInfo = null;

    public static PropertyInfo newToManyProperty(EntityInfo parentEntity,
            PropertyInfo toOneProperty) {
        PropertyInfo rtn = newToManyProperty();
        rtn.types(parentEntity.getPackageName() + "."
                + parentEntity.getEntityName());
        return rtn;
    }

    public static PropertyInfo fromKind(String kind,
            Map<String, String> attributes) {

        PropertyInfo rtn = null;

        if (kind.equals(HbmConstants.COMP_ID_EL)) {
            rtn = newCompositeIdProperty(attributes);
        } else if (kind.equals(HbmConstants.COMPONENT_EL)) {
            rtn = newComponentProperty(attributes);
        } else if (kind.equals(HbmConstants.ID_EL)
                || kind.equals(HbmConstants.KEY_PROP_EL)) {
            rtn = newIdProperty();
        } else if (kind.equals(HbmConstants.TO_ONE_EL)) {
            rtn = newToOneProperty(attributes);
        } else if (kind.equals(HbmConstants.PROP_EL)) {
            rtn = newProperty();
        } else if (kind.equals(HbmConstants.SET_EL)) {
            rtn = newToManyProperty();
        } else {
            throw new AssertionError("Unknown property kind: " + kind);
        }

        rtn.setName(attributes.get(HbmConstants.NAME_ATTR));
        String type = attributes.get(HbmConstants.TYPE_ATTR);
        if (type != null) {
            rtn.types(type);
        }

        return rtn;
    }

    public static PropertyInfo newIdProperty() {
        return newIdProperty(null);
    }

    public static PropertyInfo newIdProperty(String name) {
        PropertyInfo rtn = new PropertyInfo();
        rtn.setName(name);
        rtn.setIsId(true);
        return rtn;
    }

    public static PropertyInfo newCompositeProperty() {
        PropertyInfo rtn = new PropertyInfo();
        rtn.setCompositeProperties(new ArrayList<PropertyInfo>());
        return rtn;
    }

    public static PropertyInfo newComponentProperty(
            Map<String, String> attributes) {
        PropertyInfo rtn = newCompositeProperty();
        rtn.types(attributes.get(HbmConstants.COMPONENT_TYPE_ATTR));
        return rtn;
    }

    public static PropertyInfo newCompositeIdProperty(
            Map<String, String> attributes) {
        PropertyInfo rtn = newCompositeProperty();
        rtn.setIsId(true);
        rtn.types(attributes.get(HbmConstants.COMP_ID_TYPE_ATTR));
        return rtn;
    }

    public static PropertyInfo newProperty() {
        return newProperty(null);
    }

    public static PropertyInfo newProperty(String name) {
        PropertyInfo rtn = new PropertyInfo();
        rtn.setName(name);
        return rtn;
    }

    public static PropertyInfo newToManyProperty() {
        return newToManyProperty(Collections.<String, String> emptyMap());
    }

    public static PropertyInfo newToManyProperty(Map<String, String> attributes) {
        PropertyInfo rtn = newCompositeProperty();
        rtn.setIsRelated(true);
        rtn.setIsInverse(true);
        rtn.cardinality(RelatedInfo.Cardinality.OneToMany);

        rtn.addCascadeOptions(attributes);

        return rtn;
    }

    public static PropertyInfo newToOneProperty(Map<String, String> attributes) {
        PropertyInfo rtn = newCompositeProperty();
        rtn.setIsRelated(true);
        rtn.setIsInverse(false);
        rtn.types(attributes.get(HbmConstants.TO_ONE_TYPE_ATTR));
        rtn.cardinality(RelatedInfo.Cardinality.OneToOne);

        rtn.addCascadeOptions(attributes);

        return rtn;
    }

    public void types(String type) {
        if (type == null) {
            setFullyQualifiedType(null);
            setType(null);
        } else {
            setFullyQualifiedType(DataTypeMapper.getFQHibernateType(type));
            setType(DataTypeMapper.getHibernateType(DataTypeMapper
                    .getHibernateType(type)));
        }
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public String getFullyQualifiedType() {
        return fullyQualifiedType;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public void setIsId(boolean isId) {
        this.isId = isId;
    }

    public boolean getIsId() {
        return isId;
    }

    public void setIsRelated(boolean isRelated) {
        this.isRelated = isRelated;
    }

    public boolean getIsRelated() {
        return isRelated;
    }

    public void setIsInverse(boolean isInverse) {
        this.isInverse = isInverse;
    }

    public boolean getIsInverse() {
        return isInverse;
    }

    public void setCompositeProperties(List<PropertyInfo> compositeProperties) {
        this.compositeProperties = compositeProperties;
    }

    public List<PropertyInfo> getCompositeProperties() {
        return compositeProperties;
    }

    public void addCompositeProperty(PropertyInfo property) {
        compositeProperties.add(property);
    }

    public void setColumn(ColumnInfo columnInfo) {
        this.columnInfo = columnInfo;
    }

    public ColumnInfo getColumn() {
        return columnInfo;
    }

    public void setCardinality(String cardinality) {
        throw new AssertionError("Not implemented");
    }

    public void cardinality(RelatedInfo.Cardinality cardinality) {
        this.cardinality = cardinality;
    }

    public RelatedInfo.Cardinality getCardinality() {
        return cardinality;
    }

    public boolean hasCompositeProperties() {
        return compositeProperties.size() > 0;
    }

    public PropertyInfo getCompositeProperty(String name) {
        // REVIEW 13-Sep-07 stoens@activegrid.com -- should be a lookup
        if (compositeProperties == null) {
            throw new AssertionError("No composite properties");
        }
        for (PropertyInfo p : compositeProperties) {
            if (p.getName().equals(name)) {
                return p;
            }
        }
        return null;
    }

    public List<PropertyInfo> allProperties() {
        if (!hasCompositeProperties()) {
            List<PropertyInfo> rtn = new ArrayList<PropertyInfo>(1);
            rtn.add(this);
            return rtn;
        }

        List<PropertyInfo> rtn = new ArrayList<PropertyInfo>();
        addPropertiesRecursive(rtn, this);
        return rtn;

    }

    public List<ColumnInfo> allColumns() {
        if (!hasCompositeProperties()) {
            List<ColumnInfo> rtn = new ArrayList<ColumnInfo>(1);
            rtn.add(getColumn());
            return rtn;
        }
        List<ColumnInfo> rtn = new ArrayList<ColumnInfo>();
        addColumnsRecursive(rtn, this);
        return rtn;
    }

    public List<String> allColumnNames() {
        if (!hasCompositeProperties()) {
            List<String> rtn = new ArrayList<String>(1);
            rtn.add(columnInfo.getName());
            return rtn;
        }
        List<ColumnInfo> cols = new ArrayList<ColumnInfo>();
        addColumnsRecursive(cols, this);
        List<String> rtn = new ArrayList<String>(cols.size());
        for (ColumnInfo ci : cols) {
            rtn.add(ci.getName());
        }
        return rtn;
    }

    public RelatedInfo toRelated(String tableName) {
        List<ColumnInfo> columns = allColumns();

        RelatedInfo.Cardinality c = RelatedInfo.Cardinality.OneToZeroOrOne;

        if (getIsInverse()) {
            c = RelatedInfo.Cardinality.OneToMany;
        } else {
            if (columns.get(0).getNotNull()) {
                c = RelatedInfo.Cardinality.OneToOne;
            }
        }

        RelatedInfo rtn = new RelatedInfo(name, type, tableName, c);
        rtn.setFullyQualifiedType(fullyQualifiedType);
        rtn.foreignKeyColumns(columns
                .toArray((ColumnInfo[]) new ColumnInfo[columns.size()]));

        if (!getCascadeOptions().isEmpty()) {
            rtn.setCascadeOptions(getCascadeOptions().get(0));
        }

        return rtn;
    }

    public void setCascadeOptions(List<CascadeOption> cascadeOptions) {
        this.cascadeOptions = cascadeOptions;
    }

    public List<CascadeOption> getCascadeOptions() {
        return cascadeOptions;
    }

    private void typeFromColumn(ColumnInfo column) {
        if (ObjectUtils.isNullOrEmpty(column.getSqlType())) {
            throw new AssertionError("Type must be set");
        }
        this.type = DataTypeMapper.getHibernateType(column.getSqlType());
        this.fullyQualifiedType = DataTypeMapper.getFQHibernateType(column
                .getSqlType());

        column.persistType(false);
    }

    public void fromColumn(ColumnInfo column) {
        this.name = column.getName();
        typeFromColumn(column);

        this.isId = column.getIsPk();
        this.columnInfo = column;
    }

    public void fromRelated(RelatedInfo rel, EntityInfo owningEntity,
            DataModelConfiguration cfg) {
        this.name = rel.getName();
        this.type = rel.getRelatedType();
        this.fullyQualifiedType = rel.getFullyQualifiedType();
        this.isId = false; // FIXME - may be true if this fk is also a pk
        this.isRelated = true;
        this.cardinality = rel.cardinality();

        this.cascadeOptions = new ArrayList<CascadeOption>(0);
        this.cascadeOptions.add(rel.getCascadeOptions());

        if (rel.cardinality() == RelatedInfo.Cardinality.OneToMany) {
            this.isInverse = true;
            owningEntity = cfg.getEntity(rel.getRelatedType());
        }

        List<ColumnInfo> foreignKeyCols = new ArrayList<ColumnInfo>();

        for (String s : rel.getColumnNames()) {
            ColumnInfo ci = owningEntity.getColumn(s);
            if (ci == null) {
                throw new ConfigurationException(
                        "Unable to find foreign key column "
                                + owningEntity.getTableName() + "." + s);
            }
            ColumnInfo clone = (ColumnInfo) ci.clone();
            clone.setIsFk(true);
            clone.setIsPk(false);
            if (this.isInverse) {
                clone.setSqlType(null);
            }
            foreignKeyCols.add(clone);
        }

        if (foreignKeyCols.size() == 1) {
            this.columnInfo = foreignKeyCols.iterator().next();
        } else {
            for (ColumnInfo ci : foreignKeyCols) {
                PropertyInfo p = PropertyInfo.newProperty();
                p.fromColumn(ci);
                addCompositeProperty(p);
            }
        }
    }

    public boolean isEqualTo(PropertyInfo o) {
        if (o == null) {
            return false;
        }
        boolean rtn = String.valueOf(cardinality).equals(
                String.valueOf(o.cardinality));
        rtn &= String.valueOf(fullyQualifiedType).equals(
                String.valueOf(o.fullyQualifiedType));
        rtn &= String.valueOf(isId).equals(String.valueOf(o.isId));
        rtn &= String.valueOf(isInverse).equals(String.valueOf(o.isInverse));
        rtn &= String.valueOf(isRelated).equals(String.valueOf(o.isRelated));
        rtn &= String.valueOf(name).equals(String.valueOf(o.name));
        rtn &= String.valueOf(type).equals(String.valueOf(o.type));

        if (columnInfo == null && o.columnInfo != null) {
            return false;
        } else if (columnInfo != null && o.columnInfo == null) {
            return false;
        } else if (columnInfo == null && o.columnInfo == null) {

        } else {
            rtn &= columnInfo.isEqualTo(o.columnInfo);
        }

        if (compositeProperties.size() != o.compositeProperties.size()) {
            return false;
        } else {
            int i = 0;
            for (PropertyInfo p : compositeProperties) {
                rtn &= p.isEqualTo(o.compositeProperties.get(i++));
                if (!rtn) {
                    return false;
                }
            }
        }

        return rtn;
    }

    public String javaType() {
        Class<?> rtn = DataTypeMapper.getJavaType(fullyQualifiedType);
        if (rtn == null) {
            return fullyQualifiedType;
        }

        return rtn.getName();

    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();

        propertyToString(sb, this, "");

        for (PropertyInfo p : compositeProperties) {
            sb.append("\n");
            propertyToString(sb, p, "  ");
        }

        return sb.toString();
    }

    private void propertyToString(StringBuilder sb, PropertyInfo property,
            String indent) {
        sb.append(indent);
        if (property.getIsId()) {
            sb.append("*");
        } else if (property.getIsRelated()) {
            if (property.getIsInverse()) {
                sb.append("<");
            } else {
                sb.append(">");
            }
        }

        sb.append(property.getName()).append(" ").append(property.getType());

        if (property.getColumn() != null) {
            sb.append(" -> ").append(property.getColumn());
        }
    }

    private void addPropertiesRecursive(List<PropertyInfo> props, PropertyInfo p) {
        props.add(p);
        for (PropertyInfo p2 : p.getCompositeProperties()) {
            addPropertiesRecursive(props, p2);
        }
    }

    private void addColumnsRecursive(List<ColumnInfo> col, PropertyInfo p) {
        if (p.getColumn() != null) {
            col.add(p.getColumn());
        }
        for (PropertyInfo p2 : p.getCompositeProperties()) {
            addColumnsRecursive(col, p2);
        }
    }

    private void addCascadeOptions(Map<String, String> attributes) {

        if (!attributes.containsKey(HbmConstants.CASCADE_ATTR)) {
            return;
        }

        String co = attributes.get(HbmConstants.CASCADE_ATTR);

        if (ObjectUtils.isNullOrEmpty(co)) {
            return;
        }
        
        List<String> t = StringUtils.split(co);
        List<RelatedInfo.CascadeOption> cascadeOptions = new ArrayList<RelatedInfo.CascadeOption>(
                t.size());
        for (String s : t) {
            cascadeOptions.add(RelatedInfo.CascadeOption.fromString(s));
        }
        setCascadeOptions(cascadeOptions);
    }
    
    private void setFullyQualifiedType(String fullyQualifiedType) {
        this.fullyQualifiedType = fullyQualifiedType;
    }
}

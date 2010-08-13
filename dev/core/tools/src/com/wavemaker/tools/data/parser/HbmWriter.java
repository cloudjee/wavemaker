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
package com.wavemaker.tools.data.parser;

import java.io.File;
import java.io.PrintWriter;
import java.util.Collection;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Map;

import com.wavemaker.common.util.ObjectUtils;
import com.wavemaker.common.util.StringUtils;
import com.wavemaker.tools.data.ColumnInfo;
import com.wavemaker.tools.data.EntityInfo;
import com.wavemaker.tools.data.PropertyInfo;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class HbmWriter extends BaseHbmWriter {

    private EntityInfo entity = null;

    public HbmWriter(PrintWriter pw) {
        super(pw);
    }

    public HbmWriter(File f) {
        super(f);
    }

    public void setEntity(EntityInfo entity) {
        this.entity = entity;
    }

    @Override
    public void writeCustom() {

        if (entity == null) {
            throw new IllegalArgumentException("entity must be set");
        }

        String className = StringUtils.fq(entity.getPackageName(), entity
                .getEntityName());

        xmlWriter.addElement(HbmConstants.CLASS_EL, HbmConstants.NAME_ATTR,
                className, HbmConstants.TABLE_ATTR, entity.getTableName());

        String catalog = entity.getCatalogName();
        if (!ObjectUtils.isNullOrEmpty(catalog)) {
            xmlWriter.addAttribute(HbmConstants.CATALOG_ATTR, catalog);
        }

        String schema = entity.getSchemaName();
        if (!ObjectUtils.isNullOrEmpty(schema)) {
            xmlWriter.addAttribute(HbmConstants.SCHEMA_ATTR, schema);
        }

        xmlWriter.addAttribute(HbmConstants.DYNAMIC_INSERT, String
                .valueOf(entity.isDynamicInsert()));
        
        xmlWriter.addAttribute(HbmConstants.DYNAMIC_UPDATE, String
                .valueOf(entity.isDynamicUpdate()));

        Collection<PropertyInfo> writtenProperties = 
            new HashSet<PropertyInfo>();

        // a column mapped more than once will be mapped with
        // insert="false" update="false"
        Collection<String> mappedColumns = new HashSet<String>();

        PropertyInfo id = entity.getId();

        if (id != null) {
            writeProperty(id, writtenProperties, mappedColumns);
        }

        for (PropertyInfo property : entity.getProperties()) {

            // write related last
            if (property.getIsRelated()) {
                continue;
            }

            writeProperty(property, writtenProperties, mappedColumns);
        }

        for (PropertyInfo property : entity.getRelatedProperties()) {
            writeProperty(property, writtenProperties, mappedColumns);
        }
    }

    private void writeProperty(PropertyInfo property,
            Collection<PropertyInfo> writtenProperties,
            Collection<String> mappedColumns) {
        writeProperty(property, writtenProperties, mappedColumns, false);
    }

    private void writeProperty(PropertyInfo property,
            Collection<PropertyInfo> writtenProperties,
            Collection<String> mappedColumns, boolean isComposite) {

        if (writtenProperties.contains(property)) {
            return;
        }

        writtenProperties.add(property);

        if (property.getIsId()) {
            writeIdProperty(property, writtenProperties, mappedColumns,
                    isComposite);
        } else if (property.getIsRelated()) {
            if (property.getIsInverse()) {
                writeToManyProperty(property, writtenProperties, mappedColumns);
            } else {
                writeToOneProperty(property, writtenProperties, mappedColumns);
            }
        } else if (property.hasCompositeProperties()) {
            writeComponent(property, writtenProperties, mappedColumns);
        } else {
            writeSimpleProperty(property, writtenProperties, mappedColumns);
        }
    }

    private void writeIdProperty(PropertyInfo property,
            Collection<PropertyInfo> writtenProperties,
            Collection<String> mappedColumns, boolean isComposite) {

        if (property.getCompositeProperties().isEmpty()) {

            Map<String, String> propertyAttrs = getPropertyAttributes(property);

            if (isComposite) {

                xmlWriter.addElement(HbmConstants.KEY_PROP_EL, propertyAttrs);

            } else {

                xmlWriter.addElement(HbmConstants.ID_EL, propertyAttrs);

            }

            ColumnInfo column = property.getColumn();

            writeColumn(column, mappedColumns);

            String generator = column.getGenerator();

            if (!ObjectUtils.isNullOrEmpty(generator)) {
                xmlWriter.addElement(HbmConstants.GEN_EL,
                        HbmConstants.GEN_TYPE_ATTR, generator);

                if (generator.equals(HbmConstants.SEQUENCE_GENERATOR)) {
                    if (!ObjectUtils.isNullOrEmpty(column.getGeneratorParam())) {
                        xmlWriter.addClosedTextElement(
                                HbmConstants.GEN_PARAM_EL, column
                                        .getGeneratorParam(),
                                HbmConstants.NAME_ATTR,
                                HbmConstants.SEQUENCE_NAME_PARAM);
                    }
                }

                xmlWriter.closeElement();
            }

            xmlWriter.closeElement();

        } else {

            Map<String, String> propertyAttrs = getPropertyAttributes(property,
                    HbmConstants.COMP_ID_TYPE_ATTR);

            xmlWriter.addElement(HbmConstants.COMP_ID_EL, propertyAttrs);

            for (PropertyInfo p : property.getCompositeProperties()) {
                writeProperty(p, writtenProperties, null, true);
            }
            xmlWriter.closeElement();
        }
    }

    private void writeColumn(ColumnInfo column, Collection<String> mappedColumns) {
        Map<String, String> attrs = getColumnAttributes(column);
        if (mappedColumns != null) {
            mappedColumns.add(attrs.get(HbmConstants.NAME_ATTR));
        }
        xmlWriter.addElement(HbmConstants.COL_EL, attrs);
        xmlWriter.closeElement();
    }

    private void writeToManyProperty(PropertyInfo property,
            Collection<PropertyInfo> writtenProperties,
            Collection<String> mappedColumns) {

        xmlWriter.addElement(HbmConstants.SET_EL, HbmConstants.NAME_ATTR,
                property.getName(), HbmConstants.INVERSE_ATTR, "true");

        xmlWriter.addElement(HbmConstants.KEY_EL);
        for (ColumnInfo ci : property.allColumns()) {
            writeColumn(ci, mappedColumns);
        }
        xmlWriter.closeElement();

        xmlWriter.addClosedElement(HbmConstants.TO_MANY_EL,
                HbmConstants.TO_MANY_TYPE_ATTR, property
                        .getFullyQualifiedType());

        xmlWriter.closeElement();
    }

    private void writeToOneProperty(PropertyInfo property,
            Collection<PropertyInfo> writtenProperties,
            Collection<String> mappedColumns) {

        Map<String, String> propertyAttrs = getPropertyAttributes(property,
                HbmConstants.TO_ONE_TYPE_ATTR);

        // need to set "read only" if the foreign key col
        // is also the primary key col
        boolean isReadOnly = false;
        PropertyInfo id = entity.getId();
        if (id != null) {
            Collection<String> allIdColumnNames = new HashSet<String>(id
                    .allColumnNames());
            boolean fkColIsPkCol = false;
            for (ColumnInfo ci : property.allColumns()) {
                if (allIdColumnNames.contains(ci.getName())) {
                    fkColIsPkCol = true;
                    break;
                }
            }
            if (fkColIsPkCol) {
                isReadOnly = true;
            }
        }

        if (isReadOnly) {
            insertUpdateFalse(propertyAttrs);
            propertyAttrs.put(HbmConstants.FETCH_ATTR, "select");
        }

        if (!ObjectUtils.isNullOrEmpty(property.getCascadeOptions())) {
            propertyAttrs.put(HbmConstants.CASCADE_ATTR, ObjectUtils
                    .toString(property.getCascadeOptions()));
        }

        xmlWriter.addElement(HbmConstants.TO_ONE_EL, propertyAttrs);

        for (ColumnInfo ci : property.allColumns()) {
            writeColumn(ci, mappedColumns);
        }

        xmlWriter.closeElement();
    }

    private void insertUpdateFalse(Map<String, String> attrs) {
        attrs.put(HbmConstants.UPDATE_ATTR, "false");
        attrs.put(HbmConstants.INSERT_ATTR, "false");
    }

    private void writeComponent(PropertyInfo property,
            Collection<PropertyInfo> writtenProperties,
            Collection<String> mappedColumns) {

        Map<String, String> propertyAttrs = getPropertyAttributes(property,
                HbmConstants.COMPONENT_TYPE_ATTR);

        xmlWriter.addElement(HbmConstants.COMPONENT_EL, propertyAttrs);

        for (PropertyInfo p : property.getCompositeProperties()) {
            writeProperty(p, writtenProperties, mappedColumns, true);
        }

        xmlWriter.closeElement();
    }

    private void writeSimpleProperty(PropertyInfo property,
            Collection<PropertyInfo> writtenProperties,
            Collection<String> mappedColumns) {

        Map<String, String> propertyAttrs = getPropertyAttributes(property);

        if (mappedColumns.contains(property.getColumn().getName())) {
            insertUpdateFalse(propertyAttrs);
        }

        xmlWriter.addElement(HbmConstants.PROP_EL, propertyAttrs);

        writeColumn(property.getColumn(), mappedColumns);

        xmlWriter.closeElement();
    }

    private Map<String, String> getPropertyAttributes(PropertyInfo property) {
        return getPropertyAttributes(property, HbmConstants.TYPE_ATTR);
    }

    private Map<String, String> getPropertyAttributes(PropertyInfo property,
            String typeAttr) {
        Map<String, String> attrs = new LinkedHashMap<String, String>();
        attrs.put(HbmConstants.NAME_ATTR, property.getName());
        if (!ObjectUtils.isNullOrEmpty(property.getFullyQualifiedType())) {
            attrs.put(typeAttr, property.getFullyQualifiedType());
        }
        return attrs;
    }

    private Map<String, String> getColumnAttributes(ColumnInfo column) {
        Map<String, String> attrs = new LinkedHashMap<String, String>();
        attrs.put(HbmConstants.NAME_ATTR, column.getName());

        if (column.shouldPersistType()
                && !ObjectUtils.isNullOrEmpty(column.getSqlType())) {
            attrs.put(HbmConstants.COL_TYPE_ATTR, column.getSqlType());
        }

        if (!isNullOrZero(column.getLength())) {
            // don't write 0 length out until we figure out why a null
            // length becomes 0 on the client
            attrs.put(HbmConstants.LENGTH_ATTR, String.valueOf(column
                    .getLength()));
        }

        if (!isNullOrZero(column.getPrecision())) {
            // don't write 0 precision out until we figure out why a null
            // precision beomes 0 on the client
            attrs.put(HbmConstants.PRECISION_ATTR, String.valueOf(column
                    .getPrecision()));
        }

        if (!column.getIsPk() && column.getNotNull()) {
            attrs.put(HbmConstants.NOT_NULL_ATTR, String.valueOf(column
                    .getNotNull()));
        }

        return attrs;
    }

    private boolean isNullOrZero(Integer i) {
        if (i == null) {
            return true;
        }
        if (i.equals(Integer.valueOf(0))) {
            return true;
        }
        return false;
    }
}

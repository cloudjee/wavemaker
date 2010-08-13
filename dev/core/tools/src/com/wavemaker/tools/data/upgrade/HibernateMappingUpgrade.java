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
package com.wavemaker.tools.data.upgrade;

import java.util.List;

import com.wavemaker.tools.data.DataModelConfiguration;
import com.wavemaker.tools.data.EntityInfo;
import com.wavemaker.tools.data.PropertyInfo;
import com.wavemaker.tools.data.RelatedInfo;
import com.wavemaker.tools.service.definitions.Service;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 *
 */
public class HibernateMappingUpgrade extends BaseDataUpgradeTask {
    
    @Override
    protected void upgrade(Service service) {
        
        DataModelConfiguration cfg = getDataModelConfiguration(service);
        
        try {
            for (EntityInfo entity : cfg.getEntities()) {
                boolean modified = addSaveUpdate(entity);
                if (modified) {
                    cfg.touchEntity(entity);
                }
            }
        } finally {
            cfg.dispose();
        }
        
        cfg.saveEntities();
    }
    
    @Override
    protected String getUpgradeMsg() {
        return "Upgraded Hibernate mapping files";
    }
    
    private boolean addSaveUpdate(EntityInfo entity) {
        
        boolean modified = false;
        
        for (PropertyInfo property : entity.getProperties()) {
            if (!property.getIsRelated() || property.getIsInverse()) {
                continue;
            }
            
            List<RelatedInfo.CascadeOption> cascadeOptions = property.getCascadeOptions();
            boolean found = false;
            for (RelatedInfo.CascadeOption co : cascadeOptions) {
                if (co == RelatedInfo.CascadeOption.SaveUpdate) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                cascadeOptions.add(RelatedInfo.CascadeOption.SaveUpdate);
                modified = true;
            }
        }
        
        return modified;
    }
}

/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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

import com.wavemaker.common.util.StringUtils;
import com.wavemaker.runtime.data.DataServiceEventListener;
import com.wavemaker.runtime.data.QueryOptions;
import com.wavemaker.tools.data.DataModelConfiguration;
import com.wavemaker.tools.data.PropertyInfo;
import com.wavemaker.tools.data.util.DataServiceUtils;
import com.wavemaker.tools.project.upgrade.UpgradeTask;
import com.wavemaker.tools.service.definitions.DataObject;
import com.wavemaker.tools.service.definitions.EventNotifier;
import com.wavemaker.tools.service.definitions.Operation;
import com.wavemaker.tools.service.definitions.Service;
import com.wavemaker.tools.service.definitions.Operation.Parameter;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 * 
 */
public class DataServiceDefinitionUpgrade extends BaseDataUpgradeTask implements
        UpgradeTask {

    private static final String OLD_QUERY_OPTIONS = 
	"com.activegrid.runtime.data.QueryOptions";

    private static final String OLD_EVENT_NOTIFIER = 
	"com.activegrid.runtime.data.DataServiceEventListener";

    @Override
    protected void upgrade(Service service) {

        boolean changed = upgradeQueryOptions(service);
        changed = upgradeEventNotifier(service) || changed;
        changed = setCRUDService(service) || changed;
        changed = addCRUDDataToTypes(service) || changed;

        if (changed) {
            getDesignServiceManager().saveServiceDefinition(service.getId());
        }
    }

    @Override
    protected String getUpgradeMsg() {
        return "Upgraded data service definitions";
    }

    private boolean addCRUDDataToTypes(Service service) {

        DataModelConfiguration cfg = getDataModelConfiguration(service);

        try {
            for (DataObject o : service.getDataobjects().getDataobject()) {
                String name = 
		    StringUtils.splitPackageAndClass(o.getJavaType()).v2;

		if (cfg.isEntityType(name)) {

                    o.setSupportsQuickData(Boolean.TRUE);

		    for (DataObject.Element el : o.getElement()) {

			PropertyInfo property = 
			    cfg.getProperty(name, el.getName());

			setupDataConstraints(el, property);

		    }
                }
            }
            return true;
        } finally {
            cfg.dispose();
        }
    }

    private boolean setCRUDService(Service service) {

        boolean changed = false;

        if (service.getCRUDService() != Boolean.TRUE) {
            service.setCRUDService(Boolean.TRUE);
            changed = true;
        }

        return changed;
    }

    private boolean upgradeQueryOptions(Service service) {

        boolean changed = false;

        for (Operation op : service.getOperation()) {
            for (Parameter p : op.getParameter()) {
                if (p.getTypeRef().equals(OLD_QUERY_OPTIONS)) {
                    p.setTypeRef(QueryOptions.class.getName());
                    changed = true;
                }
            }
        }

        return changed;
    }

    private boolean upgradeEventNotifier(Service service) {

        boolean changed = false;

        for (EventNotifier ev : service.getEventnotifier()) {
            if (ev.getName().equals(OLD_EVENT_NOTIFIER)) {
                ev.setName(DataServiceEventListener.class.getName());
                changed = true;
            }
        }

        return changed;
    }

    private void setupDataConstraints(DataObject.Element el, 
				      PropertyInfo p) {

	el.setAllowNull(DataServiceUtils.isAllowNull(p));
	el.getRequire().addAll(DataServiceUtils.getRequiredOperations(p));
	el.getNoChange().addAll(DataServiceUtils.getNoChangeOperations(p));
	el.getExclude().addAll(DataServiceUtils.getExcludedOperations(p));
    }
}

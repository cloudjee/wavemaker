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
package com.wavemaker.tools.util;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;
import java.util.Properties;

import javax.xml.bind.JAXBException;
import com.wavemaker.runtime.RuntimeAccess;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.project.DeploymentManager;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.StudioConfiguration;
import com.wavemaker.tools.service.DesignServiceManager;
import com.wavemaker.tools.service.DesignServiceType;


/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 */
public class DesignTimeUtils {

    private DesignTimeUtils() {}

    private static String getDefaultProjectHome() {
	   String home;
	   if (isRuntime()) {
	       home = (String) RuntimeAccess.getInstance().getSession().getAttribute(StudioConfiguration.PROJECTHOME_PROP_KEY);
	   } else {
	       home = System.getProperty(StudioConfiguration.PROJECTHOME_PROP_KEY);
	   }
	   //System.out.println("GET HOME IS " + home);
	   return home;
    }

    private static void setDefaultProjectHome(String home) {
	   if (isRuntime()) {
	       RuntimeAccess.getInstance().getSession().setAttribute(StudioConfiguration.PROJECTHOME_PROP_KEY, home);
	   } else {
	       System.setProperty(StudioConfiguration.PROJECTHOME_PROP_KEY,home);
	   }
	   //System.out.println("SET HOME IS " + home);
    }

    private static void deleteDefaultProjectHomeProp() {
	   if (isRuntime()) {
	       RuntimeAccess.getInstance().getSession().removeAttribute(StudioConfiguration.PROJECTHOME_PROP_KEY);
	   } else {
	    Properties props = System.getProperties();
	    props.remove(StudioConfiguration.PROJECTHOME_PROP_KEY);
	    System.setProperties(props);
	   }
	   //System.out.println("DELETE HOME");
    }

    private static boolean isRuntime() {

	try {
	    if (RuntimeAccess.getInstance() != null && RuntimeAccess.getInstance().getRequest() != null)
		return true;
	} catch(Exception e) {}
	return false;
    }

    /**
     * Return a DesignServiceManager instance; this sets up an internal
     * ProjectManager, and creates a Project based on the projectRoot parameter.
     * This may not be very fast, so should be avoided when possible.
     * 
     * @param projectRoot
     * @return DesignServiceManager instance
     */
    public static DesignServiceManager getDSMForProjectRoot(File projectRoot) { //yyy
        return getDSMForProjectRoot(projectRoot, false);
    }

    public static DesignServiceManager getDSMForProjectRoot(File projectRoot, boolean skip) {
        try {
            String oldProp = getDefaultProjectHome();
            
            try {
                // override configuration
		setDefaultProjectHome(projectRoot.getParentFile().getAbsolutePath());
				   
                DesignServiceManager dsm = new DesignServiceManager();
                
                // get out our DesignServiceType configuration
                ClassPathXmlApplicationContext ac = new ClassPathXmlApplicationContext(
                        new String[]{"springapp.xml", "designservicetypes.xml",
                                "servicetypes.xml"});
                Map<?, ?> dsts = ac.getBeansOfType(DesignServiceType.class);

                dsm.setDesignServiceTypes(new ArrayList<DesignServiceType>());
                for (Object o: dsts.values()) {
                    dsm.getDesignServiceTypes().add((DesignServiceType) o);
                }

                StudioConfiguration sc = new StudioConfiguration();
                sc.setTestWaveMakerHome(projectRoot.getParentFile());
                
                ProjectManager pm = new ProjectManager();
                pm.setStudioConfiguration(sc);
                pm.openProject(projectRoot.getName(), true, skip); //yyy
                dsm.setProjectManager(pm);
                
                DeploymentManager dep = new DeploymentManager();
                dep.setProjectManager(pm);
                dep.setStudioConfiguration(sc);
                dsm.setDeploymentManager(dep);
                
                return dsm;
            } finally {
                if (null!=oldProp) {
		    setDefaultProjectHome(oldProp);
                } else {
		    deleteDefaultProjectHomeProp();
                }
            }
        } catch (JAXBException ex) {
            throw new ConfigurationException(ex);
        } catch (IOException ex) {
            throw new ConfigurationException(ex);
        }
    }

}
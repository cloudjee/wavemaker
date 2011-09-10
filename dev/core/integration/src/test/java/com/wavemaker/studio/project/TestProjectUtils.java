/*
 * @copyright (c) 2008 ActiveGrid, Inc.
 * @license   ASL 2.0  http://apache.org/licenses/LICENSE-2.0
 */
package com.wavemaker.studio.project;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.service.RuntimeService;
import com.wavemaker.studio.infra.StudioTestCase;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.project.ProjectUtils;

/**
 * @author small
 * @version $Rev$ - $Date$
 *
 */
public class TestProjectUtils extends StudioTestCase {

    @Test public void testGetClassLoaderForProject() throws Exception {
        
        makeProject("testGetClassLoaderForProject", false);
        ProjectManager pm = (ProjectManager) getBean("projectManager");
        

        invokeService_toObject("javaService", "newClass",
                new Object[] { "NewService", "foo.bar.Baz"});
        
        ClassLoader cl = ProjectUtils.getClassLoaderForProject(pm.getCurrentProject());
        
        assertNotNull(cl.loadClass("foo.bar.Baz"));
        
        assertNotNull(cl.loadClass(RuntimeService.class.getName()));
        
        try {
            cl.loadClass(ProjectManager.class.getName());
        } catch (WMRuntimeException e) {
            assertNotNull(e.getCause());
            assertTrue(e.getCause() instanceof ClassNotFoundException);
            assertEquals(ProjectManager.class.getName(), e.getCause().getMessage());
        }
    }
}
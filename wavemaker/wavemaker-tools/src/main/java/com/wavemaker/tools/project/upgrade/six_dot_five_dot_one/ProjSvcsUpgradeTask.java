package com.wavemaker.tools.project.upgrade.six_dot_five_dot_one;

import java.util.Iterator;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.FilterOn;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resources;
import com.wavemaker.tools.io.exception.ResourceException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * @author Edward Callahan
 */

public class ProjSvcsUpgradeTask implements UpgradeTask {

	private String relativePath;

	private static final String IMPORT_STR =  "\t<import resource=\"classpath:";

	private static final String CLOSE_STR = "\" />\n";

	private static final String BEAN_CLOSE_STR = "</beans>";

	private static final String WM_SVC_STR = "\t<import resource=\"classpath:waveMakerService.spring.xml\" />\n";

	private static final String RT_SVC_STR = "\t<import resource=\"classpath:runtimeService.spring.xml\" />\n";

	private static final String TO_HDR_STR = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n<beans xsi:schemaLocation=\"http://schema.cloudfoundry.org/spring http://schema.cloudfoundry.org/spring/cloudfoundry-spring-0.8.xsd http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd\" xmlns=\"http://www.springframework.org/schema/beans\" xmlns:cloud=\"http://schema.cloudfoundry.org/spring\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n";

	private static StringBuilder newFileStrB;


	@Override
	public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
		if (this.relativePath == null) {
			throw new WMRuntimeException("No file provided");
		}
		try {
			newFileStrB = new StringBuilder(TO_HDR_STR);
			File projSvcsFile = project.getRootFolder().getFile(this.relativePath);
			Folder classesFolder = projSvcsFile.getParent().getFolder("classes/");
			Resources<File> xmlFiles = classesFolder.find().include(FilterOn.names().ending(".spring.xml")).files();
			Iterator<File> it = xmlFiles.iterator();
			while(it.hasNext()){
				File f = (File)it.next();
				newFileStrB = newFileStrB.append(IMPORT_STR).append(f.getName()).append(CLOSE_STR);
			} //Older projects may not contain wavemaker and runtime in classes at time of upgrade
			if(newFileStrB.indexOf(WM_SVC_STR) < 0){
				newFileStrB = newFileStrB.append(WM_SVC_STR);
			}
			if(newFileStrB.indexOf(RT_SVC_STR) < 0){
				newFileStrB = newFileStrB.append(RT_SVC_STR);
			}
			newFileStrB = newFileStrB.append(BEAN_CLOSE_STR);
			String content = projSvcsFile.getContent().asString();
			content = newFileStrB.toString();
			projSvcsFile.getContent().write(content);
			upgradeInfo.addMessage("\nService imports added to project-services.xml for 6.5.1 completed successfully.");
		} catch (ResourceException e) {
			e.printStackTrace();
			upgradeInfo.addMessage("\n*** Terminated with error while adding import to project-services.xml for 6.5.1 imports. "
					+ "Please check the wm.log messages.***");
		}
	}


	/**
	 * The relative path (relative to the project root) for the file to upgrade.
	 */
	public void setFile(String file) {
		this.relativePath = file;
	}

}

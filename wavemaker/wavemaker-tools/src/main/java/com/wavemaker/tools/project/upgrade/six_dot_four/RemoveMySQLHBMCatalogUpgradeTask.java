/**
 *  Removes catalog from MySQL Service HBM Files
 *  
 */

package com.wavemaker.tools.project.upgrade.six_dot_four;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.io.DirectoryWalker;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.filefilter.FileFilterUtils;
import org.apache.commons.io.filefilter.IOFileFilter;
import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * @author Ed Callahan
 * 
 */
public class RemoveMySQLHBMCatalogUpgradeTask implements UpgradeTask {

    private static String mySQLStr = "mysql";

    private static String catalogStr = "catalog=\".*\"";

    private static String replaceStr = "";

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        // Don't bother if we do not have services
        try {
            if (project.fileExists("services/")) {
                Resource servicesDir = project.getProjectRoot().createRelative("services/");
                ArrayList<String> mySQLServices = new ArrayList<String>();
                try {
                    // Find MySQL Services
                    IOFileFilter propFilter = FileFilterUtils.andFileFilter(FileFilterUtils.fileFileFilter(),
                        FileFilterUtils.suffixFileFilter("properties"));
                    List<File> propFiles = new UpgradeFileFinder(propFilter).findFiles(servicesDir.getFile());
                    Iterator<File> propIt = propFiles.iterator();
                    while (propIt.hasNext()) {
                        File propFile = propIt.next();
                        String propContent = FileUtils.readFileToString(propFile);
                        if (propContent.contains(mySQLStr)) {
                            String propFileName = propFile.getName();
                            int index = propFileName.lastIndexOf(".");
                            if (index > 0 && index <= propFileName.length()) {
                                mySQLServices.add(propFileName.substring(0, index));
                            }
                        }
                    }
                    // Find HBM files in MySQLServices
                    Iterator<String> servIt = mySQLServices.iterator();
                    while (servIt.hasNext()) {
                        IOFileFilter hbmFilter = FileFilterUtils.andFileFilter(FileFilterUtils.fileFileFilter(),
                            FileFilterUtils.suffixFileFilter("hbm.xml"));
                        String path = servIt.next();
                        Resource mySQLServiceDir = servicesDir.createRelative(path.endsWith("/") ? path : path + "/");
                        List<File> hbmFiles = new UpgradeFileFinder(hbmFilter).findFiles(mySQLServiceDir.getFile());
                        Iterator<File> hbmIt = hbmFiles.iterator();
                        while (hbmIt.hasNext()) {
                            File hbmFile = hbmIt.next();
                            String hbmContent = FileUtils.readFileToString(hbmFile);
                            hbmContent.replaceFirst(catalogStr, replaceStr);
                            FileUtils.writeStringToFile(hbmFile, hbmContent);
                            System.out.println("Project upgrade: Catalog removed from " + hbmFile.getAbsolutePath());
                        }
                    }
                    if (!mySQLServices.isEmpty()) {
                        upgradeInfo.addMessage("\nMySQL Catalog upgrade task completed. See wm.log for details");
                    } else {
                        System.out.println("Project Upgrade: No MySQL Services found");
                    }
                } catch (IOException ioe) {
                    upgradeInfo.addMessage("\nError removing Catalog from MySQL Services. Check wm.log for details.");
                    ioe.printStackTrace();
                }
            } else {
                System.out.println("Project Upgrade: No Services found");
            }
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    private class UpgradeFileFinder extends DirectoryWalker {

        public UpgradeFileFinder(IOFileFilter filter) {
            super(null, filter, -1);
        }

        public List<File> findFiles(File startDir) throws IOException {
            List<File> results = new ArrayList<File>();
            walk(startDir, results);
            return results;
        }

        @SuppressWarnings({ "unchecked", "rawtypes" })
        @Override
        protected void handleFile(File file, int depth, Collection results) throws IOException {
            results.add(file);
        }

    }

}

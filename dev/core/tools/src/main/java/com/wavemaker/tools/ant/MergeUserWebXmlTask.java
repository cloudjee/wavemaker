/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.ant;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.apache.tools.ant.Task;

import com.wavemaker.runtime.server.ServerConstants;
import com.wavemaker.tools.project.ProjectConstants;

/**
 * 
 * @author Seung Lee
 */
public class MergeUserWebXmlTask extends Task {

    public static final String TASK_NAME = "mergeUserWebXmlTask";

    private String workdir;

    private String servletStr = "<servlet>";
    private String blockStart = "<!-- start of user xml contents -->";
    private String blockEnd = "<!-- end of user xml contents -->";
    private String root1 = "<web-app";
    private String root2 = ">";
    private String root3 = "</web-app>";

    @Override
    public void execute() {
        if (null == workdir) {
            throw new IllegalArgumentException("private String workDir; is not set");
        }

        File userwebxml = new File(workdir, ProjectConstants.USER_WEB_XML);
        File webxml = new File(workdir, ProjectConstants.WEB_XML);

        try {
            int indx1, indx2, indx3;
            String content = FileUtils.readFileToString(webxml, ServerConstants.DEFAULT_ENCODING);
            String customcontent = FileUtils.readFileToString(userwebxml, ServerConstants.DEFAULT_ENCODING) +
                    "\r\n";

            indx1 = customcontent.indexOf(root1);
            if (indx1 < 0) throw new RuntimeException("ERROR: Corrupted web.xml");

            indx2 = customcontent.indexOf(root2, indx1 + root1.length());
            if (indx2 < 0 || indx2 >= customcontent.length() - root3.length() - 1)
                throw new RuntimeException("ERROR: Corrupted web.xml");

            indx3 = customcontent.indexOf(root3, indx2);
            if (indx3 < 0) throw new RuntimeException("ERROR: Corrupted web.xml");

            customcontent = customcontent.substring(indx2+root2.length(), indx3);

            indx1 = content.indexOf(blockStart);
            String targetStr;
            if (indx1 > 0) {
                indx2 = content.indexOf(blockEnd, indx1);
                if (indx2 < 0) throw new RuntimeException("ERROR: Corrupted web.xml");
                targetStr = content.substring(indx1, indx2+blockEnd.length());
                customcontent = blockStart + "\r\n" + customcontent + "\r\n" + blockEnd;
            } else {
                indx1 = content.indexOf(servletStr);
                if (indx1 < 0) throw new RuntimeException("ERROR: Corrupted web.xml");
                targetStr = servletStr;
                customcontent = "\r\n" + blockStart + "\r\n" + customcontent + "\r\n" + blockEnd +
                                "\r\n\r\n" + "\t" + servletStr;
            }
            content = content.replace(targetStr, customcontent);
            FileUtils.writeStringToFile(webxml, content, ServerConstants.DEFAULT_ENCODING);

        } catch (IOException ioe) {
            throw new RuntimeException(ioe);
        }
    }

    public void setWorkdir(String val) {
        this.workdir = val;
    }
}
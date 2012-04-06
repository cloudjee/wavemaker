/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

    private final String servletStr = "<servlet>";

    private final String blockStart = "<!-- start of user xml contents -->";

    private final String blockEnd = "<!-- end of user xml contents -->";

    private final String root1 = "<web-app";

    private final String root2 = ">";

    private final String root3 = "</web-app>";

    @Override
    public void execute() {
        if (this.workdir == null) {
            throw new IllegalArgumentException("private String workDir; is not set");
        }

        File userwebxml = new File(this.workdir, ProjectConstants.USER_WEB_XML);
        File webxml = new File(this.workdir, ProjectConstants.WEB_XML);

        try {
            int indx1, indx2, indx3;
            String content = FileUtils.readFileToString(webxml, ServerConstants.DEFAULT_ENCODING);
            String customcontent = FileUtils.readFileToString(userwebxml, ServerConstants.DEFAULT_ENCODING) + "\r\n";

            indx1 = customcontent.indexOf(this.root1);
            if (indx1 < 0) {
                throw new RuntimeException("ERROR: Corrupted web.xml");
            }

            indx2 = customcontent.indexOf(this.root2, indx1 + this.root1.length());
            if (indx2 < 0 || indx2 >= customcontent.length() - this.root3.length() - 1) {
                throw new RuntimeException("ERROR: Corrupted web.xml");
            }

            indx3 = customcontent.indexOf(this.root3, indx2);
            if (indx3 < 0) {
                throw new RuntimeException("ERROR: Corrupted web.xml");
            }

            customcontent = customcontent.substring(indx2 + this.root2.length(), indx3);

            indx1 = content.indexOf(this.blockStart);
            String targetStr;
            if (indx1 > 0) {
                indx2 = content.indexOf(this.blockEnd, indx1);
                if (indx2 < 0) {
                    throw new RuntimeException("ERROR: Corrupted web.xml");
                }
                targetStr = content.substring(indx1, indx2 + this.blockEnd.length());
                customcontent = this.blockStart + "\r\n" + customcontent + "\r\n" + this.blockEnd;
            } else {
                indx1 = content.indexOf(this.servletStr);
                if (indx1 < 0) {
                    throw new RuntimeException("ERROR: Corrupted web.xml");
                }
                targetStr = this.servletStr;
                customcontent = "\r\n" + this.blockStart + "\r\n" + customcontent + "\r\n" + this.blockEnd + "\r\n\r\n" + "\t" + this.servletStr;
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
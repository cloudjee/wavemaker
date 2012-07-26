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

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.project.ProjectConstants;

public class MergeUserWebXmlTask {

    private static final String START_MARKER = "<!-- start of user xml contents -->";

    private static final String END_MARKER = "<!-- end of user xml contents -->";

    private static final String SERVLET_TAG = "<servlet>";

    private static final Pattern USER_WEB_XML_CONTENT_PATTERN = Pattern.compile("<web-app[^>]*?>(.*?)<\\/web-app>", Pattern.MULTILINE
        | Pattern.CASE_INSENSITIVE | Pattern.DOTALL);

    private static final Pattern MARKED_CONTENT_PATTERN = Pattern.compile("\\Q" + START_MARKER + "\\E(.*?)\\Q" + END_MARKER + "\\E",
        Pattern.MULTILINE | Pattern.CASE_INSENSITIVE | Pattern.DOTALL);

    private Folder workFolder;

    public String execute() {
        File userWebXml = this.workFolder.getFile(ProjectConstants.USER_WEB_XML);
        File webXml = this.workFolder.getFile(ProjectConstants.WEB_XML);

        return mergeWebXml(webXml.getContent().asString(), userWebXml.getContent().asString());
    }

    /**
     * Merge web.xml content with user specified content.
     * 
     * @param webXmlContent the source web.xml content. This should be valid XML starting with a
     *        <tt>&lt;web-app&gt;</tt> element. If the content contains existing user specified content (between
     *        {@link #START_MARKER} and {@link #END_MARKER}) it will be replaced, otherwise user content will be
     *        inserted above the <tt>&lt;servlet&gt;</tt> tag.
     * @param userWebXmlContent user specific web.xml content. This should be valid XML with user defined content
     *        specific inside a <tt>&lt;web-app&gt;</tt> element.
     * @return the merged XML content.
     */
    public String mergeWebXml(CharSequence webXmlContent, CharSequence userWebXmlContent) {
        Matcher userWebXmlMatcher = USER_WEB_XML_CONTENT_PATTERN.matcher(userWebXmlContent);
        if (!userWebXmlMatcher.find()) {
            throw new IllegalStateException("Corrupted user-web.xml");
        }
        String userContent = userWebXmlMatcher.group(1);

        Matcher webXmlMatcher = MARKED_CONTENT_PATTERN.matcher(webXmlContent);
        if (!webXmlMatcher.find()) {
            String webXmlWithEmptyPlaceholder = webXmlContent.toString().replace(SERVLET_TAG, START_MARKER + END_MARKER + "\n\n    " + SERVLET_TAG);
            webXmlMatcher = MARKED_CONTENT_PATTERN.matcher(webXmlWithEmptyPlaceholder);
            if (!webXmlMatcher.find()) {
                throw new IllegalStateException("Corrupted web.xml");
            }
        }
        StringBuffer rtn = new StringBuffer();
        webXmlMatcher.appendReplacement(rtn, START_MARKER + "\n" + userContent + "\n    " + END_MARKER);
        webXmlMatcher.appendTail(rtn);
        return rtn.toString();
    }

    public void setWorkFolder(Folder workFolder) {
        this.workFolder = workFolder;
    }

}
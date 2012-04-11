/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this Resource except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.tools.project.upgrade.swamis;

import java.io.IOException;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.project.PagesManager;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * Handle upgrades related to the Swami's-era refactorings in the client-side code.
 * 
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class ClientSideRefactorUpgrade implements UpgradeTask {

    public static final String BACKUP_EXT = "bak";

    private PagesManager pagesManager;

    protected final Pattern expressionPattern = Pattern.compile("(expression:\\s*\")(.*?)(\")");

    public final Pattern panePagePattern = Pattern.compile("((?:operation|type):\\s*\")gotoPanePage(.*?\")", Pattern.DOTALL);

    public final String panePageReplaceStr = "$1gotoPageContainerPage$2";

    public final Pattern panePattern = Pattern.compile("(\\[\"wm.NavigationCall\".*?targetProperty:\\s\")pane(\".*?}])", Pattern.DOTALL);

    public final String paneReplaceStr = "$1pageContainer$2";

    public final Pattern serviceInputVariablePattern = Pattern.compile("(\\[\"wm.ServiceVariable\"[^\\]]*?\\[\")wm.Variable(\")", Pattern.DOTALL);

    public final String serviceInputVariableReplaceStr = "$1wm.ServiceInputVariable$2";

    @Override
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {

        try {
            String projectJS = project.getProjectName() + ".js";
            File fProjectJS = project.getWebAppRootFolder().getFile(projectJS);
            Set<String> pages = getPagesManager().listPages();

            // 1. rename /project/index.html to index.bak
            Folder webapp = project.getWebAppRootFolder();
            File indexhtml = webapp.getFile(ProjectConstants.INDEX_HTML);
            if (indexhtml.exists()) {
                indexhtml.rename(ProjectConstants.INDEX_HTML + "." + BACKUP_EXT);
            }

            // 5. in applicationN.js delete turbo.types json
            if (fProjectJS.exists()) {
                String fProjectJSContents = fProjectJS.getContent().asString();
                fProjectJSContents = trimOutTypes(fProjectJSContents);
                fProjectJS.getContent().write(fProjectJSContents);
            }

            // 2. we need to change all instances of turbo to wm
            for (String page : pages) {
                Folder pageFolder = getPagesManager().getPageFolder(project, page);
                File widgetsJS = pageFolder.getFile(page + "." + PagesManager.PAGE_WIDGETS);
                if (widgetsJS.exists()) {
                    String contents = widgetsJS.getContent().asString();
                    contents = contents.replace("turbo.", "wm.");
                    widgetsJS.getContent().write(contents);
                }

                File pageJS = pageFolder.getFile(page + "." + PagesManager.PAGE_JS);
                if (pageJS.exists()) {
                    String contents = pageJS.getContent().asString();
                    contents = contents.replace("turbo.Part", "wm.Page");
                    pageJS.getContent().write(contents);
                }
            }

            if (fProjectJS.exists()) {
                String contents = fProjectJS.getContent().asString();
                contents = contents.replace("turbo.", "wm.");
                fProjectJS.getContent().write(contents);
            }

            // 3. widget name changes
            for (String page : pages) {
                Folder pageFolder = getPagesManager().getPageFolder(project, page);
                File widgetsJS = pageFolder.getFile(page + "." + PagesManager.PAGE_WIDGETS);
                if (widgetsJS.exists()) {
                    String contents = widgetsJS.getContent().asString();
                    contents = contents.replace("wm.ServiceCall", "wm.ServiceVariable");
                    contents = contents.replace("wm.Pane\"", "wm.PageContainer\"");
                    widgetsJS.getContent().write(contents);
                }
            }

            if (fProjectJS.exists()) {
                String contents = fProjectJS.getContent().asString();
                contents = contents.replace("wm.ServiceCall", "wm.ServiceVariable");
                contents = contents.replace("wm.Pane\"", "wm.PageContainer\"");
                fProjectJS.getContent().write(contents);
            }

            // 4. (hard) rename bindings associated with NavigationCall's
            for (String page : pages) {
                Folder pageFolder = getPagesManager().getPageFolder(project, page);
                File widgetsJS = pageFolder.getFile(page + "." + PagesManager.PAGE_WIDGETS);
                if (widgetsJS.exists()) {
                    String contents = widgetsJS.getContent().asString();
                    // * gotoPanePage -> gotoPageContainerPage
                    contents = this.panePagePattern.matcher(contents).replaceAll(this.panePageReplaceStr);
                    // * wm.Wire's with "pane" -> "pageContainer
                    contents = this.panePattern.matcher(contents).replaceAll(this.paneReplaceStr);
                    widgetsJS.getContent().write(contents);
                }
            }

            // 7. Expression syntax has changed to Javascript
            for (String page : pages) {
                Folder pageFolder = getPagesManager().getPageFolder(project, page);
                File widgetsJS = pageFolder.getFile(page + "." + PagesManager.PAGE_WIDGETS);
                if (widgetsJS.exists()) {
                    String contents = widgetsJS.getContent().asString();
                    Matcher matcher = this.expressionPattern.matcher(contents);
                    StringBuffer sb = new StringBuffer();
                    while (matcher.find()) {
                        String expression = matcher.group(2);
                        expression = Matcher.quoteReplacement(upgradeExpression(expression));
                        matcher.appendReplacement(sb, "$1" + expression + "$3");
                    }
                    matcher.appendTail(sb);
                    widgetsJS.getContent().write(sb.toString());
                }
            }

            // 8. "wm.Variable" class names within ServiceVariables (called
            // ServiceCall in 3.2.x) need to be changed from "wm.Variable" to
            // "wm.ServiceInputVariable"
            for (String page : pages) {
                Folder pageDir = getPagesManager().getPageFolder(project, page);
                File widgetsJS = pageDir.getFile(page + "." + PagesManager.PAGE_WIDGETS);
                if (widgetsJS.exists()) {
                    String contents = widgetsJS.getContent().asString();
                    // * gotoPanePage -> gotoPageContainerPage
                    contents = this.serviceInputVariablePattern.matcher(contents).replaceAll(this.serviceInputVariableReplaceStr);
                    widgetsJS.getContent().write(contents);
                }
            }

            upgradeInfo.addMessage("widgets now use wm namespace (instead of turbo namespace)");
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    public static String trimOutTypes(String contents) {

        int startloc;
        int endloc;

        // first, turbo.types
        startloc = contents.indexOf("turbo.types");
        if (-1 != startloc) {
            endloc = findEndLocation(contents, contents.indexOf('{', startloc) + 1, '{', '}', ';');
            contents = contents.substring(0, startloc) + contents.substring(endloc);
        }

        // and primitive.types
        startloc = contents.indexOf("turbo.primitives");
        if (-1 != startloc) {
            endloc = findEndLocation(contents, contents.indexOf('{', startloc) + 1, '{', '}', ';');
            contents = contents.substring(0, startloc) + contents.substring(endloc);
        }

        contents = contents.trim();

        return contents;
    }

    public static String upgradeExpression(String expression) {

        if (expression.startsWith("%%")) {
            expression = expression.substring(2);
            expression = "Number(" + expression + ")";
        } else if (expression.startsWith("^^")) {
            expression = expression.substring(2);
            expression = "Boolean(" + expression + ")";
        } else {
            expression = "\\\"" + expression + "\\\"";
        }

        return expression;
    }

    /**
     * Pass in the first char after the first A, and this will return the matching A to that (or, if the character after
     * the B is a C, that location.
     */
    private static int findEndLocation(String str, int start, char A, char B, char C) {

        int level = 1;

        while (start < str.length()) {
            if (str.charAt(start) == A) {
                level++;
            } else if (str.charAt(start) == B) {
                level--;
            }
            start++;
            if (0 == level) {
                break;
            }
        }

        if (start < str.length() && C == str.charAt(start)) {
            start++;
        }

        return start;
    }

    public PagesManager getPagesManager() {
        return this.pagesManager;
    }

    public void setPagesManager(PagesManager pagesManager) {
        this.pagesManager = pagesManager;
    }
}
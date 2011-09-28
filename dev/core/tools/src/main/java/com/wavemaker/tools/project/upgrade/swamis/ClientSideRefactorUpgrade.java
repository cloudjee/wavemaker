/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.project.PagesManager;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ProjectConstants;
import com.wavemaker.tools.project.upgrade.UpgradeInfo;
import com.wavemaker.tools.project.upgrade.UpgradeTask;

/**
 * Handle upgrades related to the Swami's-era refactorings in the client-side
 * code.
 * 
 * @author small
 * @author Jeremy Grelle
 *
 */
public class ClientSideRefactorUpgrade implements UpgradeTask {
    
    public static final String BACKUP_EXT = "bak";

    public final Pattern panePagePattern = Pattern.compile("((?:operation|type):\\s*\")gotoPanePage(.*?\")", Pattern.DOTALL);
    public final String panePageReplaceStr = "$1gotoPageContainerPage$2";
    public final Pattern panePattern = Pattern.compile("(\\[\"wm.NavigationCall\".*?targetProperty:\\s\")pane(\".*?}])", Pattern.DOTALL);
    public final String paneReplaceStr = "$1pageContainer$2";
    public final Pattern serviceInputVariablePattern = Pattern.compile("(\\[\"wm.ServiceVariable\"[^\\]]*?\\[\")wm.Variable(\")", Pattern.DOTALL);
    public final String serviceInputVariableReplaceStr = "$1wm.ServiceInputVariable$2";
    protected final Pattern expressionPattern = Pattern.compile("(expression:\\s*\")(.*?)(\")");

    
    /* (non-Javadoc)
     * @see com.wavemaker.tools.project.upgrade.UpgradeTask#doUpgrade(com.wavemaker.tools.project.Project, com.wavemaker.tools.project.upgrade.UpgradeInfo)
     */
    public void doUpgrade(Project project, UpgradeInfo upgradeInfo) {
        
        try {
            String projectJS = project.getProjectName() + ".js";
            Resource fProjectJS = project.getWebAppRoot().createRelative(projectJS);
            Set<String> pages = getPagesManager().listPages();
            
            
            // 1. rename /project/index.html to index.bak
            Resource webapp = project.getWebAppRoot();
            Resource indexhtml = webapp.createRelative(ProjectConstants.INDEX_HTML);
            if (indexhtml.exists()) {
                Resource bakIndexhtml = webapp.createRelative(ProjectConstants.INDEX_HTML + "." + BACKUP_EXT);
                project.writeFile(bakIndexhtml, project.readFile(indexhtml));
                project.deleteFile(indexhtml);
                upgradeInfo.addMessage("(generated) index.html renamed to index.html.bak");
            }
            
            
            // 5. in applicationN.js delete turbo.types json
            if (fProjectJS.exists()) {
                String fProjectJSContents = project.readFile(fProjectJS);
                fProjectJSContents = trimOutTypes(fProjectJSContents);
                project.writeFile(fProjectJS, fProjectJSContents);
            }
            
            
            // 2. we need to change all instances of turbo to wm
            for (String page : pages) {
                Resource pageDir = getPagesManager().getPageDir(
                        project.getProjectName(), page);
                
                Resource widgetsJS = pageDir.createRelative(page + "." +
                        PagesManager.PAGE_WIDGETS);
                if (widgetsJS.exists()) {
                    String contents = project.readFile(widgetsJS);
                    contents = contents.replace("turbo.", "wm.");
                    project.writeFile(widgetsJS, contents);
                }
                
                Resource pageJS = pageDir.createRelative(page + "." +
                        PagesManager.PAGE_JS);
                if (pageJS.exists()) {
                    String contents = project.readFile(pageJS);
                    contents = contents.replace("turbo.Part", "wm.Page");
                    project.writeFile(pageJS, contents);
                }
            }
            
            if (fProjectJS.exists()) {
                String contents = project.readFile(fProjectJS);
                contents = contents.replace("turbo.", "wm.");
                project.writeFile(fProjectJS, contents);
            }
            
            
            // 3. widget name changes
            for (String page : pages) {
                Resource pageDir = getPagesManager().getPageDir(
                        project.getProjectName(), page);
                
                Resource widgetsJS = pageDir.createRelative(page + "." +
                        PagesManager.PAGE_WIDGETS);
                if (widgetsJS.exists()) {
                    String contents = project.readFile(widgetsJS);
                    contents = contents.replace("wm.ServiceCall",
                            "wm.ServiceVariable");
                    contents = contents.replace("wm.Pane\"",
                            "wm.PageContainer\"");
                    project.writeFile(widgetsJS, contents);
                }
            }
            
            if (fProjectJS.exists()) {
                String contents = project.readFile(fProjectJS);
                contents = contents.replace("wm.ServiceCall",
                        "wm.ServiceVariable");
                contents = contents.replace("wm.Pane\"",
                        "wm.PageContainer\"");
                project.writeFile(fProjectJS, contents);
            }
            
            
            // 4. (hard) rename bindings associated with NavigationCall's
            for (String page:pages) {
                Resource pageDir = getPagesManager().getPageDir(
                        project.getProjectName(), page);

                Resource widgetsJS = pageDir.createRelative(page + "."
                        + PagesManager.PAGE_WIDGETS);
                if (widgetsJS.exists()) {
                    String contents = project.readFile(widgetsJS);

                    // * gotoPanePage -> gotoPageContainerPage
                    contents = panePagePattern.matcher(contents).replaceAll(panePageReplaceStr);

                    // * wm.Wire's with "pane" -> "pageContainer
                    contents = panePattern.matcher(contents).replaceAll(paneReplaceStr);

                    project.writeFile(widgetsJS, contents);
                }
            }
            
            
            // 7. Expression syntax has changed to Javascript
            for (String page:pages) {
                Resource pageDir = getPagesManager().getPageDir(
                        project.getProjectName(), page);

                Resource widgetsJS = pageDir.createRelative(page + "."
                        + PagesManager.PAGE_WIDGETS);
                if (widgetsJS.exists()) {
                    String contents = project.readFile(widgetsJS);

                    Matcher matcher = expressionPattern.matcher(contents);
                    StringBuffer sb = new StringBuffer();
                    while (matcher.find()) {
                        String expression = matcher.group(2);
                        expression = Matcher
                                .quoteReplacement(upgradeExpression(expression));
                        matcher.appendReplacement(sb, "$1"+expression+"$3");
                    }
                    matcher.appendTail(sb);

                    project.writeFile(widgetsJS, sb.toString());
                }
            }
            
            
            // 8. "wm.Variable" class names within ServiceVariables (called
            // ServiceCall in 3.2.x) need to be changed from "wm.Variable" to
            // "wm.ServiceInputVariable"
            for (String page:pages) {
                Resource pageDir = getPagesManager().getPageDir(
                        project.getProjectName(), page);

                Resource widgetsJS = pageDir.createRelative(page + "."
                        + PagesManager.PAGE_WIDGETS);
                if (widgetsJS.exists()) {
                    String contents = project.readFile(widgetsJS);

                    // * gotoPanePage -> gotoPageContainerPage
                    contents = serviceInputVariablePattern.matcher(contents).replaceAll(serviceInputVariableReplaceStr);

                    project.writeFile(widgetsJS, contents);
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
            endloc = findEndLocation(contents,
                    contents.indexOf('{', startloc) + 1, '{', '}', ';');
            contents = contents.substring(0, startloc)
                    + contents.substring(endloc);
        }
        
        // and primitive.types
        startloc = contents.indexOf("turbo.primitives");
        if (-1 != startloc) {
            endloc = findEndLocation(contents,
                    contents.indexOf('{', startloc) + 1, '{', '}', ';');
            contents = contents.substring(0, startloc)
                    + contents.substring(endloc);
        }
        
        contents = contents.trim();
                
        return contents;
    }
    
    public static String upgradeExpression(String expression) {
        
        if (expression.startsWith("%%")) {
            expression = expression.substring(2);
            expression = "Number("+expression+")";
        } else if (expression.startsWith("^^")) {
            expression = expression.substring(2);
            expression = "Boolean("+expression+")";
        } else {
            expression = "\\\"" + expression + "\\\"";
        }
        
        return expression;
    }
    
    /**
     * Pass in the first char after the first A, and this will return the
     * matching A to that (or, if the character after the B is a C, that
     * location.
     */
    private static int findEndLocation(String str, int start, char A, char B,
            char C) {

        int level = 1;
        
        while(start<str.length()) {
            if (str.charAt(start) == A) {
                level ++;
            } else if (str.charAt(start) == B) {
                level --;
            }
            
            start ++;
            
            if (0==level) {
                break;
            }
        }
        
        if (start<str.length() && C == str.charAt(start)) {
            start ++;
        }
        
        return start;
    }
    
    // bean properties
    private PagesManager pagesManager;

    public PagesManager getPagesManager() {
        return pagesManager;
    }

    public void setPagesManager(PagesManager pagesManager) {
        this.pagesManager = pagesManager;
    }
}
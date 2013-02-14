
package com.data.output;



/**
 * Generated for query "getIssueContent" on 06/09/2010 16:20:40
 * 
 */
public class GetIssueContentRtnType {

    private String summary;
    private String key;
    private String project;
    private String type;
    private String reportedversion;
    private String fixedversion;
    private String reporter;
    private String assignee;
    private String description;
    private String status;

    public GetIssueContentRtnType() {
    }

    public GetIssueContentRtnType(String summary, String key, String project, String type, String reportedversion, String fixedversion, String reporter, String assignee, String description, String status) {
        this.summary = summary;
        this.key = key;
        this.project = project;
        this.type = type;
        this.reportedversion = reportedversion;
        this.fixedversion = fixedversion;
        this.reporter = reporter;
        this.assignee = assignee;
        this.description = description;
        this.status = status;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getProject() {
        return project;
    }

    public void setProject(String project) {
        this.project = project;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getReportedversion() {
        return reportedversion;
    }

    public void setReportedversion(String reportedversion) {
        this.reportedversion = reportedversion;
    }

    public String getFixedversion() {
        return fixedversion;
    }

    public void setFixedversion(String fixedversion) {
        this.fixedversion = fixedversion;
    }

    public String getReporter() {
        return reporter;
    }

    public void setReporter(String reporter) {
        this.reporter = reporter;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}

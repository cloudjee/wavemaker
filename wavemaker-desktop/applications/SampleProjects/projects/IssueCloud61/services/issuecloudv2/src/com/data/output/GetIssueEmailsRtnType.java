
package com.data.output;



/**
 * Generated for query "getIssueEmails" on 06/09/2010 16:20:40
 * 
 */
public class GetIssueEmailsRtnType {

    private String reporter;
    private String assignee;

    public GetIssueEmailsRtnType() {
    }

    public GetIssueEmailsRtnType(String reporter, String assignee) {
        this.reporter = reporter;
        this.assignee = assignee;
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

}

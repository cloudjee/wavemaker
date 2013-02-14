
package com.data.output;



/**
 * Generated for query "getIssueByCritical" on 06/09/2010 16:20:40
 * 
 */
public class GetIssueByCriticalRtnType {

    private String name;
    private String summary;
    private Integer issueId;

    public GetIssueByCriticalRtnType() {
    }

    public GetIssueByCriticalRtnType(String name, String summary, Integer issueId) {
        this.name = name;
        this.summary = summary;
        this.issueId = issueId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Integer getIssueId() {
        return issueId;
    }

    public void setIssueId(Integer issueId) {
        this.issueId = issueId;
    }

}

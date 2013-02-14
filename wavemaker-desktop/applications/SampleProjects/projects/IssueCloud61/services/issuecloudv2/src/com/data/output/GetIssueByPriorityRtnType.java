
package com.data.output;



/**
 * Generated for query "getIssueByPriority" on 06/09/2010 16:20:40
 * 
 */
public class GetIssueByPriorityRtnType {

    private String priority;
    private Long number;

    public GetIssueByPriorityRtnType() {
    }

    public GetIssueByPriorityRtnType(String priority, Long number) {
        this.priority = priority;
        this.number = number;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public Long getNumber() {
        return number;
    }

    public void setNumber(Long number) {
        this.number = number;
    }

}

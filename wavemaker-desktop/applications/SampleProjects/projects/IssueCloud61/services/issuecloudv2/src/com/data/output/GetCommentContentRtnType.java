
package com.data.output;

import java.util.Date;


/**
 * Generated for query "getCommentContent" on 06/09/2010 16:20:40
 * 
 */
public class GetCommentContentRtnType {

    private String reporter;
    private Date date;
    private String comment;

    public GetCommentContentRtnType() {
    }

    public GetCommentContentRtnType(String reporter, Date date, String comment) {
        this.reporter = reporter;
        this.date = date;
        this.comment = comment;
    }

    public String getReporter() {
        return reporter;
    }

    public void setReporter(String reporter) {
        this.reporter = reporter;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

}

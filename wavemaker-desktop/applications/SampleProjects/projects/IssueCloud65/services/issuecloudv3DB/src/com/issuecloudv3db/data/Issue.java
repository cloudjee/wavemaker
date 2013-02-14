
package com.issuecloudv3db.data;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;


/**
 *  issuecloudv3DB.Issue
 *  03/28/2012 16:03:06
 * 
 */
public class Issue {

    private Integer iid;
    private Project project;
    private com.issuecloudv3db.data.Version versionByReportedVid;
    private com.issuecloudv3db.data.Version versionByFixedVid;
    private com.issuecloudv3db.data.User userByAssignUid;
    private com.issuecloudv3db.data.User userByReportedUid;
    private Integer tid;
    private String name;
    private Date createdate;
    private Date closedate;
    private String description;
    private String summary;
    private String issuetype;
    private String priority;
    private String path;
    private String status;
    private Integer flag;
    private Set<com.issuecloudv3db.data.Comment> comments = new HashSet<com.issuecloudv3db.data.Comment>();

    public Integer getIid() {
        return iid;
    }

    public void setIid(Integer iid) {
        this.iid = iid;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public com.issuecloudv3db.data.Version getVersionByReportedVid() {
        return versionByReportedVid;
    }

    public void setVersionByReportedVid(com.issuecloudv3db.data.Version versionByReportedVid) {
        this.versionByReportedVid = versionByReportedVid;
    }

    public com.issuecloudv3db.data.Version getVersionByFixedVid() {
        return versionByFixedVid;
    }

    public void setVersionByFixedVid(com.issuecloudv3db.data.Version versionByFixedVid) {
        this.versionByFixedVid = versionByFixedVid;
    }

    public com.issuecloudv3db.data.User getUserByAssignUid() {
        return userByAssignUid;
    }

    public void setUserByAssignUid(com.issuecloudv3db.data.User userByAssignUid) {
        this.userByAssignUid = userByAssignUid;
    }

    public com.issuecloudv3db.data.User getUserByReportedUid() {
        return userByReportedUid;
    }

    public void setUserByReportedUid(com.issuecloudv3db.data.User userByReportedUid) {
        this.userByReportedUid = userByReportedUid;
    }

    public Integer getTid() {
        return tid;
    }

    public void setTid(Integer tid) {
        this.tid = tid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getCreatedate() {
        return createdate;
    }

    public void setCreatedate(Date createdate) {
        this.createdate = createdate;
    }

    public Date getClosedate() {
        return closedate;
    }

    public void setClosedate(Date closedate) {
        this.closedate = closedate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getIssuetype() {
        return issuetype;
    }

    public void setIssuetype(String issuetype) {
        this.issuetype = issuetype;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public Set<com.issuecloudv3db.data.Comment> getComments() {
        return comments;
    }

    public void setComments(Set<com.issuecloudv3db.data.Comment> comments) {
        this.comments = comments;
    }

}

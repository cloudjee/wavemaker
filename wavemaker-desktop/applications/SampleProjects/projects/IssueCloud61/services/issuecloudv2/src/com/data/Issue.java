
package com.data;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;


/**
 *  issuecloudv2.Issue
 *  06/09/2010 16:20:37
 * 
 */
public class Issue {

    private Integer iid;
    private Integer tid;
    private String name;
    private Date createdate;
    private Date closedate;
    private String description;
    private String summary;
    private String issuetype;
    private String priority;
    private String status;
    private Integer flag;
    private String path;
    private Project rel2Project;
    private com.data.Version rel2VersionReported;
    private com.data.Version rel2VersionFixed;
    private com.data.User rel2UserReported;
    private com.data.User rel2UserAssigned;
    private Set<com.data.Comment> comments = new HashSet<com.data.Comment>();

    public Issue() {
    }

    public Issue(Integer iid, Integer tid, String name, Date createdate, Date closedate, String description, String summary, String issuetype, String priority, String status, Integer flag, String path) {
        this.iid = iid;
        this.tid = tid;
        this.name = name;
        this.createdate = createdate;
        this.closedate = closedate;
        this.description = description;
        this.summary = summary;
        this.issuetype = issuetype;
        this.priority = priority;
        this.status = status;
        this.flag = flag;
        this.path = path;
    }

    public Issue(Integer iid, Integer tid, String name, Date createdate, Date closedate, String description, String summary, String issuetype, String priority, String status, Integer flag, String path, Project rel2Project, com.data.Version rel2VersionReported, com.data.Version rel2VersionFixed, com.data.User rel2UserReported, com.data.User rel2UserAssigned, Set<com.data.Comment> comments) {
        this.iid = iid;
        this.tid = tid;
        this.name = name;
        this.createdate = createdate;
        this.closedate = closedate;
        this.description = description;
        this.summary = summary;
        this.issuetype = issuetype;
        this.priority = priority;
        this.status = status;
        this.flag = flag;
        this.path = path;
        this.rel2Project = rel2Project;
        this.rel2VersionReported = rel2VersionReported;
        this.rel2VersionFixed = rel2VersionFixed;
        this.rel2UserReported = rel2UserReported;
        this.rel2UserAssigned = rel2UserAssigned;
        this.comments = comments;
    }

    public Integer getIid() {
        return iid;
    }

    public void setIid(Integer iid) {
        this.iid = iid;
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

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Project getRel2Project() {
        return rel2Project;
    }

    public void setRel2Project(Project rel2Project) {
        this.rel2Project = rel2Project;
    }

    public com.data.Version getRel2VersionReported() {
        return rel2VersionReported;
    }

    public void setRel2VersionReported(com.data.Version rel2VersionReported) {
        this.rel2VersionReported = rel2VersionReported;
    }

    public com.data.Version getRel2VersionFixed() {
        return rel2VersionFixed;
    }

    public void setRel2VersionFixed(com.data.Version rel2VersionFixed) {
        this.rel2VersionFixed = rel2VersionFixed;
    }

    public com.data.User getRel2UserReported() {
        return rel2UserReported;
    }

    public void setRel2UserReported(com.data.User rel2UserReported) {
        this.rel2UserReported = rel2UserReported;
    }

    public com.data.User getRel2UserAssigned() {
        return rel2UserAssigned;
    }

    public void setRel2UserAssigned(com.data.User rel2UserAssigned) {
        this.rel2UserAssigned = rel2UserAssigned;
    }

    public Set<com.data.Comment> getComments() {
        return comments;
    }

    public void setComments(Set<com.data.Comment> comments) {
        this.comments = comments;
    }

}

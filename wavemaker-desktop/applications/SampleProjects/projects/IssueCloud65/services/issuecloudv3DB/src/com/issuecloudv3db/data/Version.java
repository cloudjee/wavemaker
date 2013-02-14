
package com.issuecloudv3db.data;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;


/**
 *  issuecloudv3DB.Version
 *  03/28/2012 16:03:06
 * 
 */
public class Version {

    private Integer vid;
    private Project project;
    private Integer tid;
    private String name;
    private String description;
    private Date releasedate;
    private String status;
    private Integer flag;
    private Set<com.issuecloudv3db.data.Issue> issuesForFixedVid = new HashSet<com.issuecloudv3db.data.Issue>();
    private Set<com.issuecloudv3db.data.Issue> issuesForReportedVid = new HashSet<com.issuecloudv3db.data.Issue>();

    public Integer getVid() {
        return vid;
    }

    public void setVid(Integer vid) {
        this.vid = vid;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getReleasedate() {
        return releasedate;
    }

    public void setReleasedate(Date releasedate) {
        this.releasedate = releasedate;
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

    public Set<com.issuecloudv3db.data.Issue> getIssuesForFixedVid() {
        return issuesForFixedVid;
    }

    public void setIssuesForFixedVid(Set<com.issuecloudv3db.data.Issue> issuesForFixedVid) {
        this.issuesForFixedVid = issuesForFixedVid;
    }

    public Set<com.issuecloudv3db.data.Issue> getIssuesForReportedVid() {
        return issuesForReportedVid;
    }

    public void setIssuesForReportedVid(Set<com.issuecloudv3db.data.Issue> issuesForReportedVid) {
        this.issuesForReportedVid = issuesForReportedVid;
    }

}

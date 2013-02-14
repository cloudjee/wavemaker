
package com.data;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;


/**
 *  issuecloudv2.Version
 *  06/09/2010 16:20:37
 * 
 */
public class Version {

    private Integer vid;
    private Integer tid;
    private String name;
    private String description;
    private Date releasedate;
    private String status;
    private Integer flag;
    private Project rel2Project;
    private Set<com.data.Issue> issues = new HashSet<com.data.Issue>();

    public Version() {
    }

    public Version(Integer vid, Integer tid, String name, String description, Date releasedate, String status, Integer flag) {
        this.vid = vid;
        this.tid = tid;
        this.name = name;
        this.description = description;
        this.releasedate = releasedate;
        this.status = status;
        this.flag = flag;
    }

    public Version(Integer vid, Integer tid, String name, String description, Date releasedate, String status, Integer flag, Project rel2Project, Set<com.data.Issue> issues) {
        this.vid = vid;
        this.tid = tid;
        this.name = name;
        this.description = description;
        this.releasedate = releasedate;
        this.status = status;
        this.flag = flag;
        this.rel2Project = rel2Project;
        this.issues = issues;
    }

    public Integer getVid() {
        return vid;
    }

    public void setVid(Integer vid) {
        this.vid = vid;
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

    public Project getRel2Project() {
        return rel2Project;
    }

    public void setRel2Project(Project rel2Project) {
        this.rel2Project = rel2Project;
    }

    public Set<com.data.Issue> getIssues() {
        return issues;
    }

    public void setIssues(Set<com.data.Issue> issues) {
        this.issues = issues;
    }

}

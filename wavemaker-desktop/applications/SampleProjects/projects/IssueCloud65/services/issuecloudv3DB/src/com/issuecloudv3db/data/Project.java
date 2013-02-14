
package com.issuecloudv3db.data;

import java.util.HashSet;
import java.util.Set;


/**
 *  issuecloudv3DB.Project
 *  03/28/2012 16:03:06
 * 
 */
public class Project {

    private Integer pid;
    private Integer tid;
    private String name;
    private String description;
    private String url;
    private String prefix;
    private Integer flag;
    private Set<com.issuecloudv3db.data.Version> versions = new HashSet<com.issuecloudv3db.data.Version>();
    private Set<com.issuecloudv3db.data.Issue> issues = new HashSet<com.issuecloudv3db.data.Issue>();

    public Integer getPid() {
        return pid;
    }

    public void setPid(Integer pid) {
        this.pid = pid;
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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public Set<com.issuecloudv3db.data.Version> getVersions() {
        return versions;
    }

    public void setVersions(Set<com.issuecloudv3db.data.Version> versions) {
        this.versions = versions;
    }

    public Set<com.issuecloudv3db.data.Issue> getIssues() {
        return issues;
    }

    public void setIssues(Set<com.issuecloudv3db.data.Issue> issues) {
        this.issues = issues;
    }

}


package com.data;

import java.util.HashSet;
import java.util.Set;


/**
 *  issuecloudv2.Project
 *  06/09/2010 16:20:37
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
    private Set<com.data.Version> versions = new HashSet<com.data.Version>();
    private Set<com.data.Issue> issues = new HashSet<com.data.Issue>();

    public Project() {
    }

    public Project(Integer pid, Integer tid, String name, String description, String url, String prefix, Integer flag) {
        this.pid = pid;
        this.tid = tid;
        this.name = name;
        this.description = description;
        this.url = url;
        this.prefix = prefix;
        this.flag = flag;
    }

    public Project(Integer pid, Integer tid, String name, String description, String url, String prefix, Integer flag, Set<com.data.Version> versions, Set<com.data.Issue> issues) {
        this.pid = pid;
        this.tid = tid;
        this.name = name;
        this.description = description;
        this.url = url;
        this.prefix = prefix;
        this.flag = flag;
        this.versions = versions;
        this.issues = issues;
    }

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

    public Set<com.data.Version> getVersions() {
        return versions;
    }

    public void setVersions(Set<com.data.Version> versions) {
        this.versions = versions;
    }

    public Set<com.data.Issue> getIssues() {
        return issues;
    }

    public void setIssues(Set<com.data.Issue> issues) {
        this.issues = issues;
    }

}

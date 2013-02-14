
package com.data;

import java.util.Date;


/**
 *  issuecloudv2.Comment
 *  06/09/2010 15:07:54
 * 
 */
public class Comment {

    private Integer cid;
    private Integer tid;
    private Date createdate;
    private String description;
    private Integer flag;
    private Issue rel2Issue;
    private User rel2User;

    public Comment() {
    }

    public Comment(Integer cid, Integer tid, Date createdate, String description, Integer flag) {
        this.cid = cid;
        this.tid = tid;
        this.createdate = createdate;
        this.description = description;
        this.flag = flag;
    }

    public Comment(Integer cid, Integer tid, Date createdate, String description, Integer flag, Issue rel2Issue, User rel2User) {
        this.cid = cid;
        this.tid = tid;
        this.createdate = createdate;
        this.description = description;
        this.flag = flag;
        this.rel2Issue = rel2Issue;
        this.rel2User = rel2User;
    }

    public Integer getCid() {
        return cid;
    }

    public void setCid(Integer cid) {
        this.cid = cid;
    }

    public Integer getTid() {
        return tid;
    }

    public void setTid(Integer tid) {
        this.tid = tid;
    }

    public Date getCreatedate() {
        return createdate;
    }

    public void setCreatedate(Date createdate) {
        this.createdate = createdate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public Issue getRel2Issue() {
        return rel2Issue;
    }

    public void setRel2Issue(Issue rel2Issue) {
        this.rel2Issue = rel2Issue;
    }

    public User getRel2User() {
        return rel2User;
    }

    public void setRel2User(User rel2User) {
        this.rel2User = rel2User;
    }

}

/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.runtime.ws;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import com.sun.syndication.feed.synd.SyndContent;
import com.sun.syndication.feed.synd.SyndEntry;
import com.sun.syndication.feed.synd.SyndLink;

/**
 * This represents the feed entry.
 * 
 * @author Frankie Fu
 */
public class Entry {

    private final SyndEntry syndEntry;

    public Entry(SyndEntry syndEntry) {
        this.syndEntry = syndEntry;
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndEntry#getAuthor()
     */
    public String getAuthor() {
        return this.syndEntry.getAuthor();
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndEntry#getContents()
     */
    @SuppressWarnings("unchecked")
    public SyndContent[] getContents() {
        List<SyndContent> list = this.syndEntry.getContents();
        if (list != null) {
            return list.toArray(new SyndContent[list.size()]);
        } else {
            return null;
        }
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndEntry#getDescription()
     */
    public SyndContent getDescription() {
        SyndContent description = this.syndEntry.getDescription();
        if (description != null) {
            description.setValue(FeedUtils.stripBadTags(description.getValue()));
        }
        return description;
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndEntry#getLink()
     */
    public String getLink() {
        return this.syndEntry.getLink();
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndEntry#getLinks()
     */
    @SuppressWarnings("unchecked")
    public SyndLink[] getLinks() {
        List<SyndLink> list = this.syndEntry.getLinks();
        if (list != null) {
            return list.toArray(new SyndLink[list.size()]);
        } else {
            return null;
        }
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndEntry#getPublishedDate()
     */
    public Date getPublishedDate() {
        return this.syndEntry.getPublishedDate();
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndEntry#getTitle()
     */
    public String getTitle() {
        return this.syndEntry.getTitle();
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndEntry#getTitleEx()
     */
    public SyndContent getTitleEx() {
        return this.syndEntry.getTitleEx();
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndEntry#getUpdatedDate()
     */
    public Date getUpdatedDate() {
        return this.syndEntry.getUpdatedDate();
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndEntry#getUri()
     */
    public String getUri() {
        return this.syndEntry.getUri();
    }

    /**
     * @param author
     * @see com.sun.syndication.feed.synd.SyndEntry#setAuthor(java.lang.String)
     */
    public void setAuthor(String author) {
        this.syndEntry.setAuthor(author);
    }

    /**
     * @param contents
     * @see com.sun.syndication.feed.synd.SyndEntry#setContents(java.util.List)
     */
    public void setContents(SyndContent[] contents) {
        this.syndEntry.setContents(Arrays.asList(contents));
    }

    /**
     * @param description
     * @see com.sun.syndication.feed.synd.SyndEntry#setDescription(com.sun.syndication.feed.synd.SyndContent)
     */
    public void setDescription(SyndContent description) {
        this.syndEntry.setDescription(description);
    }

    /**
     * @param link
     * @see com.sun.syndication.feed.synd.SyndEntry#setLink(java.lang.String)
     */
    public void setLink(String link) {
        this.syndEntry.setLink(link);
    }

    /**
     * @param links
     * @see com.sun.syndication.feed.synd.SyndEntry#setLinks(java.util.List)
     */
    public void setLinks(SyndLink[] links) {
        this.syndEntry.setLinks(Arrays.asList(links));
    }

    /**
     * @param publishedDate
     * @see com.sun.syndication.feed.synd.SyndEntry#setPublishedDate(java.util.Date)
     */
    public void setPublishedDate(Date publishedDate) {
        this.syndEntry.setPublishedDate(publishedDate);
    }

    /**
     * @param title
     * @see com.sun.syndication.feed.synd.SyndEntry#setTitle(java.lang.String)
     */
    public void setTitle(String title) {
        this.syndEntry.setTitle(title);
    }

    /**
     * @param title
     * @see com.sun.syndication.feed.synd.SyndEntry#setTitleEx(com.sun.syndication.feed.synd.SyndContent)
     */
    public void setTitleEx(SyndContent title) {
        this.syndEntry.setTitleEx(title);
    }

    /**
     * @param updatedDate
     * @see com.sun.syndication.feed.synd.SyndEntry#setUpdatedDate(java.util.Date)
     */
    public void setUpdatedDate(Date updatedDate) {
        this.syndEntry.setUpdatedDate(updatedDate);
    }

    /**
     * @param uri
     * @see com.sun.syndication.feed.synd.SyndEntry#setUri(java.lang.String)
     */
    public void setUri(String uri) {
        this.syndEntry.setUri(uri);
    }

    public SyndEntry toSyndEntry() {
        return this.syndEntry;
    }
}

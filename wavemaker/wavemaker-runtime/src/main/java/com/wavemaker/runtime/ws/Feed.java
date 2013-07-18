/*
 *  Copyright (C) 2007-2013 VMware, Inc. All rights reserved.
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

import java.util.Date;

/**
 * The class represents a Feed object for all types of feeds.
 * 
 * @see com.wavemaker.runtime.ws.SyndFeedService#getFeed(String)
 * 
 * @author Frankie Fu
 */
public class Feed {

    private String author;
    private String copyright;
    private String description;
    private String encoding;
    private Entry[] entries;
    private String feedType;
    private String language;
    private String link;
    private Date publishedDate;
    private String title;
    private String uri;

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getAuthor()
     */
    public String getAuthor() {
        return this.author;
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getCopyright()
     */
    public String getCopyright() {
        return this.copyright;
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getDescription()
     */
    public String getDescription() {
        return this.description;
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getEncoding()
     */
    public String getEncoding() {
        return this.encoding;
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getEntries()
     */
    @SuppressWarnings("unchecked")
    public Entry[] getEntries() {
        return this.entries;
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getFeedType()
     */
    public String getFeedType() {
        return this.feedType;
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getLanguage()
     */
    public String getLanguage() {
        return this.language;
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getLink()
     */
    public String getLink() {
        return this.link;
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getPublishedDate()
     */
    public Date getPublishedDate() {
        return this.publishedDate;
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getTitle()
     */
    public String getTitle() {
        return this.title;
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getUri()
     */
    public String getUri() {
        return this.uri;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public void setCopyright(String copyright) {
        this.copyright = copyright;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setEncoding(String encoding) {
        this.encoding = encoding;
    }

    public void setEntries(Entry[] entries) {
        this.entries = entries;
    }

    public void setFeedType(String feedType) {
        this.feedType = feedType;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public void setPublishedDate(Date publishedDate) {
        this.publishedDate = publishedDate;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }
}

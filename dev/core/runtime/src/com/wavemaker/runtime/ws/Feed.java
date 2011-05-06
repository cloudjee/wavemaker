/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import com.sun.syndication.feed.synd.SyndContent;
import com.sun.syndication.feed.synd.SyndEntry;
import com.sun.syndication.feed.synd.SyndFeed;
import com.sun.syndication.feed.synd.SyndImage;
import com.sun.syndication.feed.synd.SyndLink;
import com.wavemaker.runtime.ws.Entry;

/**
 * The class represents a Feed object for all types of feeds.
 * 
 * @see com.wavemaker.runtime.ws.SyndFeedService#getFeed(String)
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 *
 */
public class Feed {

    private SyndFeed syndFeed;
    
    public Feed(SyndFeed syndFeed) {
        this.syndFeed = syndFeed;
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getAuthor()
     */
    public String getAuthor() {
        return syndFeed.getAuthor();
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getCopyright()
     */
    public String getCopyright() {
        return syndFeed.getCopyright();
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getDescription()
     */
    public String getDescription() {
        return syndFeed.getDescription();
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getDescriptionEx()
     */
    public SyndContent getDescriptionEx() {
        return syndFeed.getDescriptionEx();
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getEncoding()
     */
    public String getEncoding() {
        return syndFeed.getEncoding();
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getEntries()
     */
    @SuppressWarnings("unchecked")
    public Entry[] getEntries() {
        List<SyndEntry> list = syndFeed.getEntries();
        List<Entry> nlist = new ArrayList();
        for (SyndEntry syndEntry : list) {
            Entry entry = new Entry(syndEntry);
            nlist.add(entry);
        }
        return nlist.toArray(new Entry[nlist.size()]);
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getFeedType()
     */
    public String getFeedType() {
        return syndFeed.getFeedType();
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getImage()
     */
    public SyndImage getImage() {
        return syndFeed.getImage();
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getLanguage()
     */
    public String getLanguage() {
        return syndFeed.getLanguage();
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getLink()
     */
    public String getLink() {
        return syndFeed.getLink();
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getLinks()
     */
    @SuppressWarnings("unchecked")
    public SyndLink[] getLinks() {
        List<SyndLink> list = syndFeed.getLinks();
        if (list != null) {
            return list.toArray(new SyndLink[list.size()]);
        } else {
            return null;
        }
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getPublishedDate()
     */
    public Date getPublishedDate() {
        return syndFeed.getPublishedDate();
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getTitle()
     */
    public String getTitle() {
        return syndFeed.getTitle();
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getTitleEx()
     */
    public SyndContent getTitleEx() {
        return syndFeed.getTitleEx();
    }

    /**
     * @return
     * @see com.sun.syndication.feed.synd.SyndFeed#getUri()
     */
    public String getUri() {
        return syndFeed.getUri();
    }

    /**
     * @param author
     * @see com.sun.syndication.feed.synd.SyndFeed#setAuthor(java.lang.String)
     */
    public void setAuthor(String author) {
        syndFeed.setAuthor(author);
    }

    /**
     * @param copyright
     * @see com.sun.syndication.feed.synd.SyndFeed#setCopyright(java.lang.String)
     */
    public void setCopyright(String copyright) {
        syndFeed.setCopyright(copyright);
    }

    /**
     * @param description
     * @see com.sun.syndication.feed.synd.SyndFeed#setDescription(java.lang.String)
     */
    public void setDescription(String description) {
        syndFeed.setDescription(description);
    }

    /**
     * @param description
     * @see com.sun.syndication.feed.synd.SyndFeed#setDescriptionEx(com.sun.syndication.feed.synd.SyndContent)
     */
    public void setDescriptionEx(SyndContent description) {
        syndFeed.setDescriptionEx(description);
    }

    /**
     * @param encoding
     * @see com.sun.syndication.feed.synd.SyndFeed#setEncoding(java.lang.String)
     */
    public void setEncoding(String encoding) {
        syndFeed.setEncoding(encoding);
    }

    /**
     * @param entries
     * @see com.sun.syndication.feed.synd.SyndFeed#setEntries(java.util.List)
     */
    public void setEntries(Entry[] entries) {
        SyndEntry[] syndEntries = new SyndEntry[entries.length];
        int i = 0;
        for (Entry entry : entries) {
            syndEntries[i] = entry.toSyndEntry();
        }
        syndFeed.setEntries(Arrays.asList(syndEntries));
    }

    /**
     * @param feedType
     * @see com.sun.syndication.feed.synd.SyndFeed#setFeedType(java.lang.String)
     */
    public void setFeedType(String feedType) {
        syndFeed.setFeedType(feedType);
    }

    /**
     * @param image
     * @see com.sun.syndication.feed.synd.SyndFeed#setImage(com.sun.syndication.feed.synd.SyndImage)
     */
    public void setImage(SyndImage image) {
        syndFeed.setImage(image);
    }

    /**
     * @param language
     * @see com.sun.syndication.feed.synd.SyndFeed#setLanguage(java.lang.String)
     */
    public void setLanguage(String language) {
        syndFeed.setLanguage(language);
    }

    /**
     * @param link
     * @see com.sun.syndication.feed.synd.SyndFeed#setLink(java.lang.String)
     */
    public void setLink(String link) {
        syndFeed.setLink(link);
    }

    /**
     * @param links
     * @see com.sun.syndication.feed.synd.SyndFeed#setLinks(java.util.List)
     */
    public void setLinks(SyndLink[] links) {
        syndFeed.setLinks(Arrays.asList(links));
    }

    /**
     * @param publishedDate
     * @see com.sun.syndication.feed.synd.SyndFeed#setPublishedDate(java.util.Date)
     */
    public void setPublishedDate(Date publishedDate) {
        syndFeed.setPublishedDate(publishedDate);
    }

    /**
     * @param title
     * @see com.sun.syndication.feed.synd.SyndFeed#setTitle(java.lang.String)
     */
    public void setTitle(String title) {
        syndFeed.setTitle(title);
    }

    /**
     * @param title
     * @see com.sun.syndication.feed.synd.SyndFeed#setTitleEx(com.sun.syndication.feed.synd.SyndContent)
     */
    public void setTitleEx(SyndContent title) {
        syndFeed.setTitleEx(title);
    }

    /**
     * @param uri
     * @see com.sun.syndication.feed.synd.SyndFeed#setUri(java.lang.String)
     */
    public void setUri(String uri) {
        syndFeed.setUri(uri);
    }
}

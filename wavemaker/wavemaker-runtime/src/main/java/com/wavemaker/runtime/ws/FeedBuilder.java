package com.wavemaker.runtime.ws;

import com.sun.syndication.feed.synd.SyndEntry;
import com.sun.syndication.feed.synd.SyndFeed;
import twitter4j.ResponseList;
import twitter4j.Status;

import java.util.ArrayList;
import java.util.List;

/**
 * Builder class used for building {@link Feed} object from {@link SyndFeed} object and {@link ResponseList} Object
 * @author Uday Shankar
 */
public class FeedBuilder {

    public static Feed getFeed(SyndFeed syndFeed) {
        Feed feed = new Feed();
        feed.setAuthor(syndFeed.getAuthor());
        feed.setCopyright(syndFeed.getCopyright());
        feed.setDescription(syndFeed.getDescription());
        feed.setEncoding(syndFeed.getEncoding());


        List<Entry> entryList = new ArrayList<Entry>();
        List<SyndEntry> syndEntryList = syndFeed.getEntries();
        if(syndEntryList != null) {
            for (SyndEntry syndEntry : syndEntryList) {
                entryList.add(EntryBuilder.getEntry(syndEntry));
            }
        }
        feed.setEntries(entryList.toArray(new Entry[entryList.size()]));

        feed.setFeedType(syndFeed.getFeedType());
        feed.setLanguage(syndFeed.getLanguage());
        feed.setLink(syndFeed.getLink());
        feed.setPublishedDate(syndFeed.getPublishedDate());
        feed.setTitle(syndFeed.getTitle());
        feed.setUri(syndFeed.getUri());
        return feed;
    }

    public static Feed getFeed(String screenId, ResponseList<Status> statusList) {
        Feed feed = new Feed();
        feed.setAuthor(screenId);
        feed.setTitle(screenId + "'s - Twitter Search");
        feed.setDescription("User time line of " + screenId);
        List<Entry> entryList = new ArrayList<Entry>(statusList.size());
        for (Status status : statusList) {
            entryList.add(EntryBuilder.getEntry(status));
        }
        feed.setEntries(entryList.toArray(new Entry[entryList.size()]));
        return feed;
    }
}

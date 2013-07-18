package com.wavemaker.runtime.ws;

import com.sun.syndication.feed.synd.SyndContent;
import com.sun.syndication.feed.synd.SyndEntry;
import twitter4j.Status;

/**
 * Builder class used for building {@link Entry} object from {@link SyndEntry} object and {@link Status} Object
 * @author Uday Shankar
 */
public class EntryBuilder {

    public static Entry getEntry(SyndEntry syndEntry) {
        Entry entry = new Entry();
        entry.setAuthor(syndEntry.getAuthor());
        SyndContent description = syndEntry.getDescription();
        entry.setDescription((description!=null)?description.getValue() : null);
        entry.setLink(syndEntry.getLink());
        entry.setPublishedDate(syndEntry.getPublishedDate());
        entry.setTitle(syndEntry.getTitle());
        entry.setUpdatedDate(syndEntry.getUpdatedDate());
        entry.setUri(syndEntry.getUri());
        return entry;
    }

    public static Entry getEntry(Status status) {
        Entry entry = new Entry();
        entry.setAuthor(status.getUser().getName());
        entry.setLink(status.getSource());
        entry.setPublishedDate(status.getCreatedAt());
        entry.setTitle(status.getText());
        entry.setUpdatedDate(status.getCreatedAt());
        return entry;
    }
}

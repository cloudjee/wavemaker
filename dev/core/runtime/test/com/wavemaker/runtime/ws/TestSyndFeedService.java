/*
 *  Copyright (C) 2007-2009 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.runtime.ws;

import com.wavemaker.common.util.ClassLoaderUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.json.JSONMarshaller;

/**
 * @author ffu
 * @version $Rev:22673 $ - $Date:2008-05-30 14:45:46 -0700 (Fri, 30 May 2008) $
 * 
 */
public class TestSyndFeedService extends WMTestCase {

    /**
     * URL: http://www.wavemaker.com/rss/wavemaker.xml
     * Type: RSS 0.91
     */
    private static final String ActiveGridInTheNewsFeed = "com/wavemaker/runtime/ws/ActiveGridInTheNews.xml";

    /**
     * URL: http://newsrss.bbc.co.uk/rss/newsonline_world_edition/front_page/rss.xml
     * Type: RSS 2.0
     */
    private static final String BBCNewsWorldEditionFeed = "com/wavemaker/runtime/ws/BBCNewsWorldEdition.xml";

    /**
     * URL: http://news.google.com/news?ned=us&topic=h&output=atom
     * Type: Atom 0.3
     */
    private static final String GoogleNewsTopStoriesFeed = "com/wavemaker/runtime/ws/GoogleNewsTopStories.xml";

    /**
     * URL: http://jpn.icicom.up.pt/xml/noticias.xml
     * Type: Atom 1.0
     */
    private static final String JornalismoPortoNetFeed = "com/wavemaker/runtime/ws/JornalismoPortoNet.xml";
    
    /**
     * URL: http://syndication.boston.com/news?mode=rss_10
     * Type: RSS/RDF 1.0
     */
    private static final String BostonNewsFeed = "com/wavemaker/runtime/ws/BostonNews.xml";
    
    /**
     * URL: http://feeds.feedburner.jp/japantimes
     * Type: RSS 2.0
     */
    private static final String JapanTimesAllStoriesFeed = "com/wavemaker/runtime/ws/JapanTimesAllStories.xml";

    /**
     * URL: http://sports.espn.go.com/espn/rss/news
     * Type: RSS 2.0
     */
    private static final String ESPNNewsFeed = "com/wavemaker/runtime/ws/ESPNNews.xml";

    /**
     * URL: http://digg.com/rss/index.xml
     * Type: RSS 2.0
     */
    private static final String DiggFeed = "com/wavemaker/runtime/ws/Digg.xml";


    private static Feed getFeed(String resource) {
        SyndFeedService feedService = new SyndFeedService();
        Feed feed = feedService.getFeed(ClassLoaderUtils.getResource(resource));
        assertNotNull(feed);
        return feed;
    }
    
    private static void checkJSONTransformation(Feed feed) throws Exception {
        String json = JSONMarshaller.marshal(feed);
        assertNotNull(json);
    }

    public void testActiveGridInTheNews() throws Exception {
        Feed feed = getFeed(ActiveGridInTheNewsFeed);
        assertEquals("rss_0.91U", feed.getFeedType());
        checkJSONTransformation(feed);
    }

    public void testBBCNewsWorldEdition() throws Exception {
        Feed feed = getFeed(BBCNewsWorldEditionFeed);
        assertEquals("rss_2.0", feed.getFeedType());
        checkJSONTransformation(feed);
    }

    public void testGoogleNewsTopStories() throws Exception {
        Feed feed = getFeed(GoogleNewsTopStoriesFeed);
        assertEquals("atom_0.3", feed.getFeedType());
        checkJSONTransformation(feed);
    }

    public void testJornalismoPortoNet() throws Exception {
        Feed feed = getFeed(JornalismoPortoNetFeed);
        assertEquals("atom_1.0", feed.getFeedType());
        checkJSONTransformation(feed);
    }

    public void testBostonNews() throws Exception {
        Feed feed = getFeed(BostonNewsFeed);
        assertEquals("rss_1.0", feed.getFeedType());
        checkJSONTransformation(feed);
    }
    
    public void testJapanTimesAllStories() throws Exception {
        Feed feed = getFeed(JapanTimesAllStoriesFeed);
        assertEquals("rss_2.0", feed.getFeedType());
        checkJSONTransformation(feed);
    }
    
    public void testESPNNews() throws Exception {
        Feed feed = getFeed(ESPNNewsFeed);
        assertEquals("rss_2.0", feed.getFeedType());
        checkJSONTransformation(feed);
    }
    
    public void testDigg() throws Exception {
        Feed feed = getFeed(DiggFeed);
        assertEquals("rss_2.0", feed.getFeedType());
        checkJSONTransformation(feed);
    }
}

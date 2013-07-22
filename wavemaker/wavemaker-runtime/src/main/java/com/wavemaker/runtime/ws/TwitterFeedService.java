/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.service.annotations.ExposeToClient;
import com.wavemaker.runtime.service.annotations.HideFromClient;
import org.apache.log4j.Logger;
import twitter4j.*;
import twitter4j.conf.ConfigurationBuilder;

/**
 * This service is used to fetch tweets from user time line as feeds
 * 
 * @author Uday Shankar
 */
@HideFromClient
public class TwitterFeedService {

    private String OAuthConsumerKey;
    private String OAuthConsumerSecret;
    private String OAuthAccessToken;
    private String OAuthAccessTokenSecret;

    static final Logger logger = Logger.getLogger(TwitterFeedService.class);

    /**
     * Reads from the InputStream of the specified URL and builds the feed object from the returned XML.
     * 
     * @param screenId users screen Id
     * @return A feed object.
     */
    @ExposeToClient
    public Feed getFeed(String screenId) {
        try {
            Twitter twitter = getTwitter();
            User user = twitter.showUser(screenId);
            if(user == null) {
                logger.debug("No user present with the screen name [" + screenId + "]");
                throw new WMRuntimeException("No user present with the screen name [" + screenId + "]");
            }
            if(user.isProtected()) {
                logger.debug("Tweets for the user with the screen name [" + screenId + "] are protected");
                throw new WMRuntimeException("Tweets for the user with the screen name [" + screenId + "] are protected");
            }
            ResponseList<Status> tweetStatus = twitter.getUserTimeline(screenId);
            return FeedBuilder.getFeed(screenId,tweetStatus);
        } catch (TwitterException e) {
            logger.warn("Cannot get the twitter feed for the user [" + screenId + "]" ,e);
            throw new WMRuntimeException(e);
        }
    }

    private Twitter getTwitter() {
        ConfigurationBuilder cb = new ConfigurationBuilder();
        cb.setDebugEnabled(true)
        .setOAuthConsumerKey(OAuthConsumerKey)
        .setOAuthConsumerSecret(OAuthConsumerSecret)
        .setOAuthAccessToken(OAuthAccessToken)
        .setOAuthAccessTokenSecret(OAuthAccessTokenSecret);

        return new TwitterFactory(cb.build()).getInstance();
    }

    public String getOAuthConsumerKey() {
        return OAuthConsumerKey;
    }

    public void setOAuthConsumerKey(String OAuthConsumerKey) {
        this.OAuthConsumerKey = OAuthConsumerKey;
    }

    public String getOAuthConsumerSecret() {
        return OAuthConsumerSecret;
    }

    public void setOAuthConsumerSecret(String OAuthConsumerSecret) {
        this.OAuthConsumerSecret = OAuthConsumerSecret;
    }

    public String getOAuthAccessToken() {
        return OAuthAccessToken;
    }

    public void setOAuthAccessToken(String OAuthAccessToken) {
        this.OAuthAccessToken = OAuthAccessToken;
    }

    public String getOAuthAccessTokenSecret() {
        return OAuthAccessTokenSecret;
    }

    public void setOAuthAccessTokenSecret(String OAuthAccessTokenSecret) {
        this.OAuthAccessTokenSecret = OAuthAccessTokenSecret;
    }
}

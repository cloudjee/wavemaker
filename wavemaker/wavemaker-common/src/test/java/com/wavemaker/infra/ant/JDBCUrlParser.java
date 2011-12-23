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

package com.wavemaker.infra.ant;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Task;

import com.wavemaker.common.util.StringUtils;

/**
 * Dumb task that parses a jdbc url. Only parses out the host at this point, since that's what I need.
 * 
 * @author Simon Toens
 */
public class JDBCUrlParser extends Task {

    private String url = null;

    private String hostProperty = null;

    private String portProperty = null;

    public void setJdbcUrl(String url) {
        this.url = url;
    }

    public void setHostProperty(String hostProperty) {
        this.hostProperty = hostProperty;
    }

    public void setPortProperty(String portProperty) {
        this.portProperty = portProperty;
    }

    @Override
    public void execute() {

        if (this.url == null) {
            throw new BuildException("jdbcurl must be set");
        }

        if (this.hostProperty == null && this.portProperty == null) {
            throw new BuildException("Either hostproperty or portproperty must be set");
        }

        // take the bit following "://"
        String hostport = StringUtils.fromFirstOccurrence(this.url, "://");
        if (hostport.equals(this.url)) {
            throw new BuildException("Can't parse " + this.url);
        }

        // up to the next ':'
        String host = StringUtils.fromFirstOccurrence(hostport, ":", -1);
        if (host.equals(hostport)) {
            throw new BuildException("Can't parse " + this.url);
        }

        String port = StringUtils.fromFirstOccurrence(hostport, ":");
        port = StringUtils.fromFirstOccurrence(port, "/", -1);

        if (this.hostProperty != null) {
            getProject().setProperty(this.hostProperty, host);
        }

        if (this.portProperty != null) {
            getProject().setProperty(this.portProperty, port);
        }
    }

}

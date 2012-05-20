/*
 *  Copyright (C) 2008-2012 VMware, Inc. All rights reserved.
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

/**
 * @author ffu
 * @version $Rev: 33719 $ - $Date: 2011-10-18 11:33:27 -0700 (Tue, 18 Oct 2011) $
 * 
 */
public class RESTInputParam {

    public enum InputType {
        STRING, INTEGER, OTHER
    };

    public enum InputLocation {
        URL, HEADER, OTHER
    };

    private String name;

    private String type;

    private String location;

    public RESTInputParam() {
    }

    public RESTInputParam(String name, String type) {
        this(name, type, "other");
    }

    public RESTInputParam(String name, String type, String location) {
        this.name = name;
        this.type = type;
        this.location = location;
    }

    public RESTInputParam(String name, InputType type) {
        this(name, type, InputLocation.OTHER);
    }

    public RESTInputParam(String name, InputType type, InputLocation location) {
        this.name = name;
        if (type == InputType.STRING) {
            this.type = "string";
        } else if (type == InputType.INTEGER) {
            this.type = "int";
        }
        if (location == InputLocation.URL) {
            this.location = "url";
        } else if (location == InputLocation.HEADER) {
            this.location = "header";
        } else {
            this.location = "other";
        }
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLocation() {
        return this.location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public InputType toType() {
        InputType inputType = InputType.OTHER;
        if ("string".equals(this.type)) {
            inputType = InputType.STRING;
        } else if ("int".equals(this.type)) {
            inputType = InputType.INTEGER;
        }
        return inputType;
    }

    public InputLocation toLocation() {
        InputLocation inputLocation = InputLocation.OTHER;
        if ("url".equals(this.location)) {
            inputLocation = InputLocation.URL;
        } else if ("header".equals(this.location)) {
            inputLocation = InputLocation.HEADER;
        }
        return inputLocation;
    }
}

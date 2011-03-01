/*
 *  Copyright (C) 2007-2011 WaveMaker Software, Inc.
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
package com.wavemaker.runtime.client;

import java.util.List;
import java.util.ArrayList;

public class TreeNode {

    private boolean closed = true;
    
    private String content = null;
    
    private String image = null;

    private List<String> data = new ArrayList<String>();
    
    private List<TreeNode> children = new ArrayList<TreeNode>();


    public TreeNode() {}

    public TreeNode(String content) { this.content = content; }

    public TreeNode(String content, String data) { 
        this.content = content;
        this.data.add(data);
    }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public List<TreeNode> getChildren() { return children; }
    public void setChildren(List<TreeNode> children) { 
        this.children = children; 
    }
    public void addChild(TreeNode child) { children.add(child); }

    public boolean getClosed() { return closed; }
    public void setClosed(boolean closed) { this.closed = closed; }

    public void addData(List<String> data) { 
        this.data.addAll(data);
    }
    public void addData(String... s) { 
        for (int i = 0; i < s.length; i++) {
            data.add(s[i]);
        }
    }
    public List<String> getData() { 
        if (data.isEmpty()) {
            return null;
        }
        return data; 
    }
    
    public String getImage() {
        return image;
    }
    
    public void setImage(String image) {
        this.image = image;
    }
}

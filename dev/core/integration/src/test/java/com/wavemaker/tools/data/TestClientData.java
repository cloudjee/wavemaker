/*
 *  Copyright (C) 2008-2009 WaveMaker Software, Inc.
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
/**
 * 
 */

package com.wavemaker.tools.data;

import java.io.File;
import java.io.IOException;
import java.io.PrintStream;
import java.util.List;

import com.wavemaker.common.util.IOUtils;
import com.wavemaker.infra.WMTestCase;
import com.wavemaker.runtime.client.TreeNode;
import com.wavemaker.runtime.data.util.DataServiceConstants;
import com.wavemaker.tools.data.util.DataServiceTestUtils;

/**
 * Written at SFO, waiting for a flight to Toronto.
 * 
 * @author Simon
 * 
 */
public class TestClientData extends WMTestCase {

    private File f = null;

    private DataModelConfiguration cfg = null;

    @Override
    public void setUp() throws IOException {
        this.f = DataServiceTestUtils.setupSakilaConfiguration();
        this.cfg = new DataModelConfiguration(this.f);
    }

    @Override
    public void tearDown() throws IOException {
        try {
            this.cfg.dispose();
        } finally {
            IOUtils.deleteRecursive(this.f.getParentFile());
        }
    }

    public void testDataTree() throws IOException {

        TreeNode types = new TreeNode("Types");

        this.cfg.addDataObjectTree(types);

        TreeNode actor = getEntityNode(types, "Actor");
        // printTree(actor, 0, System.out);

        assertTrue(actor != null);
        assertEquals(DataServiceConstants.ENTITY_NODE, actor.getData().get(0));
        assertEquals("Actor", actor.getData().get(1));
        assertEquals("com.wavemaker.runtime.data.sample.sakila.Actor", actor.getData().get(2));
        List<TreeNode> props = actor.getChildren();
        assertEquals(DataServiceConstants.COLUMN_NODE, props.get(0).getData().get(0));
        assertEquals("actorId", props.get(0).getData().get(1));
        assertEquals("short", props.get(0).getData().get(2));
        assertEquals("actor_id", props.get(0).getData().get(3));

        assertEquals(DataServiceConstants.RELATIONSHIP_NODE, props.get(4).getData().get(0));
        assertEquals("filmActors", props.get(4).getData().get(1));
        assertEquals("com.wavemaker.runtime.data.sample.sakila.FilmActor", props.get(4).getData().get(2));
    }

    private TreeNode getEntityNode(TreeNode root, String entityName) {
        for (TreeNode n : root.getChildren()) {
            if (n.getData().get(0).equals(DataServiceConstants.ENTITY_NODE)) {
                if (n.getData().get(1).equals(entityName)) {
                    return n;
                }
            }
        }
        return null;
    }

    @SuppressWarnings("unused")
    private void printTree(TreeNode n, int indentation, PrintStream ps) {
        String s = getIndentation(indentation);
        ps.print(s);
        ps.println("content: " + n.getContent());
        ps.print(s);
        ps.println("data: " + n.getData());
        ps.print(s);
        ps.println("#children: " + n.getChildren().size());
        if (n.getChildren().isEmpty()) {
            ps.println();
        } else {
            for (TreeNode child : n.getChildren()) {
                printTree(child, indentation + 4, ps);
            }
        }
    }

    private String getIndentation(int indentation) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < indentation; i++) {
            sb.append(" ");
        }
        return sb.toString();
    }

}

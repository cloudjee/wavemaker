
package com.wavemaker.tools.io.filesystem;

/**
 * Resource Types.
 * 
 * @author Phillip Webb
 */
public enum ResourceType {

    /**
     * A file.
     */
    FILE("file"),

    /**
     * A Folder.
     */
    FOLDER("folder"),

    /**
     * A resource that does not exist.
     */
    DOES_NOT_EXIST("missing");

    private String name;

    private ResourceType(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return this.name;
    }
}

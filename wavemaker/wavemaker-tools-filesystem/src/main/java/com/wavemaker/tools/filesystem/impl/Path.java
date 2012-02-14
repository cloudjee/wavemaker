
package com.wavemaker.tools.filesystem.impl;

import org.springframework.util.Assert;
import org.springframework.util.ObjectUtils;

public final class Path {

    private final Path parent;

    private final String name;

    public Path() {
        this(null, "");
    }

    private Path(Path parent, String name) {
        Assert.notNull(name, "Name must not be null");
        this.parent = parent;
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    @Override
    public String toString() {
        if (this.parent != null) {
            return this.parent + "/" + this.name;
        }
        return this.name;
    }

    public Path get(String path) {
        Assert.hasLength(path, "Path must not be empty");
        Path rtn = this;
        if (path.startsWith("/")) {
            rtn = new Path();
            path = path.substring(1);
        }
        while (path.indexOf("/") != -1) {
            rtn = rtn.newPath(path.substring(0, path.indexOf("/")));
            path = path.substring(path.indexOf("/") + 1);
        }
        return rtn.newPath(path);
    }

    private Path newPath(String pathSection) {
        if ("".equals(pathSection)) {
            return this;
        }
        if ("..".equals(pathSection)) {
            Assert.state(this.parent != null);
            return this.parent;
        }
        return new Path(this, pathSection);
    }

    public Path getParent() {
        return this.parent;
    }

    @Override
    public int hashCode() {
        return toString().hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (obj == this) {
            return true;
        }
        if (obj instanceof Path) {
            Path other = (Path) obj;
            return ObjectUtils.nullSafeEquals(getParent(), other.getParent()) && this.name.equals(other.name);
        }
        return false;
    }
}

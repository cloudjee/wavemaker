
package com.wavemaker.tools.io.filesystem;

import org.springframework.util.Assert;

import com.wavemaker.tools.io.ResourcePath;
import com.wavemaker.tools.io.ResourceStringFormat;

/**
 * A {@link ResourcePath} that is jailed to a specific location.
 * 
 * @author Phillip Webb
 */
public final class JailedResourcePath {

    private final ResourcePath jailPath;

    private final ResourcePath path;

    /**
     * Create a new {@link JailedResourcePath} instance.
     * 
     * @param jailPath the jail path
     * @param path the path
     */
    public JailedResourcePath(ResourcePath jailPath, ResourcePath path) {
        Assert.notNull(jailPath, "JailPath must not be null");
        Assert.notNull(path, "Path must not be null");
        this.path = path;
        this.jailPath = jailPath;
    }

    /**
     * Create a new {@link JailedResourcePath} with a root jail and root path.
     */
    public JailedResourcePath() {
        this.jailPath = new ResourcePath();
        this.path = new ResourcePath();
    }

    /**
     * Returns the jail path.
     * 
     * @return the jail
     */
    public ResourcePath getJailPath() {
        return this.jailPath;
    }

    /**
     * Returns the path.
     * 
     * @return the path
     */
    public ResourcePath getPath() {
        return this.path;
    }

    /**
     * Returns the parent {@link JailedResourcePath} of this instance or <tt>null</tt> if there is no parent.
     * 
     * @return the parent.
     */
    public JailedResourcePath getParent() {
        ResourcePath parent = this.path.getParent();
        if (parent == null) {
            return null;
        }
        return new JailedResourcePath(this.jailPath, parent);
    }

    /**
     * Get a new path relative to this one.
     * 
     * @param path the path
     * @return a new {@link JailedResourcePath}
     */
    public JailedResourcePath get(String path) {
        return new JailedResourcePath(this.jailPath, this.path.get(path));
    }

    /**
     * Returns the complete unjailed path
     * 
     * @return the unjailed path
     */
    public ResourcePath getUnjailedPath() {
        return this.jailPath.append(this.path);
    }

    /**
     * Unjail the specified resource path
     * 
     * @return the unjailed version
     */
    public JailedResourcePath unjail() {
        return new JailedResourcePath(new ResourcePath(), getUnjailedPath());
    }

    /**
     * Return the {@link #getPath() path} string.
     */
    @Override
    public String toString() {
        return getPath().toString();
    }

    @Override
    public int hashCode() {
        return this.jailPath.hashCode() + 31 * this.path.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        JailedResourcePath other = (JailedResourcePath) obj;
        return this.jailPath.equals(other.jailPath) && this.path.equals(other.path);
    }

    public String toString(ResourceStringFormat format) {
        format = format == null ? ResourceStringFormat.FULL : format;
        switch (format) {
            case FULL:
                return getPath().toString();
            case UNJAILED:
                return getUnjailedPath().toString();
        }
        throw new UnsupportedOperationException("Unable to display path with the format " + format);
    }
}


package com.wavemaker.tools.io.store;

import org.springframework.core.GenericTypeResolver;
import org.springframework.util.Assert;
import org.springframework.util.ObjectUtils;

import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.JailedResourcePath;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.ResourceOperation;
import com.wavemaker.tools.io.ResourceStringFormat;
import com.wavemaker.tools.io.exception.ResourceDoesNotExistException;
import com.wavemaker.tools.io.exception.ResourceExistsException;

/**
 * Base for {@link StoredFile} and {@link StoredFolder}.
 * 
 * @see StoredFile
 * @see StoredFolder
 * 
 * @author Phillip Webb
 */
public abstract class StoredResource implements Resource {

    protected abstract ResourceStore getStore();

    protected final JailedResourcePath getPath() {
        return getStore().getPath();
    }

    protected final void ensureExists() {
        if (!exists()) {
            throw new ResourceDoesNotExistException(this);
        }
    }

    protected final void createParentIfMissing() {
        if (getParent() != null) {
            getParent(true).createIfMissing();
        }
    }

    @Override
    public Folder getParent() {
        return getParent(false);
    }

    private Folder getParent(boolean unjailed) {
        JailedResourcePath path = getPath();
        JailedResourcePath parentPath = (unjailed ? path.unjail() : path).getParent();
        if (parentPath == null) {
            return null;
        }
        return getStore().getFolder(parentPath);
    }

    @Override
    public boolean exists() {
        return getStore().exists();
    }

    @Override
    public Resource rename(String name) throws ResourceExistsException {
        Assert.hasLength(name, "Name must not be empty");
        Assert.isTrue(!name.contains("/"), "Name must not contain path elements");
        ensureExists();
        Assert.state(getPath().getPath().getParent() != null, "Root folders cannot be renamed");
        if (getParent().getParent().hasExisting(name)) {
            throw new ResourceExistsException("Unable to rename " + toString() + " to " + name + " due to an existing resource");
        }
        return getStore().rename(name);
    }

    @Override
    @SuppressWarnings("unchecked")
    public <R extends Resource, O extends ResourceOperation<R>> O performOperation(O operation) {
        Class<?> typeArgument = GenericTypeResolver.resolveTypeArgument(operation.getClass(), ResourceOperation.class);
        Assert.isInstanceOf(typeArgument, this);
        operation.perform((R) this);
        return operation;
    }

    @Override
    public String getName() {
        return getPath().getPath().getName();
    }

    @Override
    public String toString() {
        return toString(ResourceStringFormat.FULL);
    }

    @Override
    public String toString(ResourceStringFormat format) {
        return getPath().toString(format);
    }

    @Override
    public int hashCode() {
        return toString().hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        StoredResource other = (StoredResource) obj;
        return ObjectUtils.nullSafeEquals(getPath(), other.getPath());
    }
}


package com.wavemaker.tools.io.compiler;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.tools.FileObject;
import javax.tools.ForwardingJavaFileManager;
import javax.tools.JavaFileManager;
import javax.tools.JavaFileObject;
import javax.tools.JavaFileObject.Kind;

import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.io.ResourceURL;

/**
 * A {@link ForwardingJavaFileManager} that manages files contained in {@link com.wavemaker.tools.io.Folder}s.
 * 
 * @author Phillip Webb
 */
public class ResourceFolderJavaFileManager extends ForwardingJavaFileManager<JavaFileManager> {

    private static final Set<Kind> CLASS_OR_SOURCE_KIND = EnumSet.of(Kind.CLASS, Kind.SOURCE);

    private final Map<String, Iterable<Folder>> locations = new HashMap<String, Iterable<Folder>>();

    public ResourceFolderJavaFileManager(JavaFileManager fileManager) {
        super(fileManager);
    }

    @Override
    public ClassLoader getClassLoader(Location location) {
        try {
            Iterable<Folder> folders = getLocation(location);
            if (folders == null) {
                return null;
            }
            List<URL> urls = ResourceURL.getForResources(folders);
            ClassLoader parent = super.getClassLoader(location);
            return new URLClassLoader(urls.toArray(new URL[urls.size()]), parent);
        } catch (MalformedURLException e) {
            throw new IllegalStateException(e);
        }
    }

    @Override
    public Iterable<JavaFileObject> list(Location location, String packageName, Set<Kind> kinds, boolean recurse) throws IOException {
        List<JavaFileObject> javaFileObjects = new ArrayList<JavaFileObject>();
        Iterable<Folder> folders = getLocation(location);
        if (folders != null) {
            String packagePath = asPath(packageName);
            for (Folder folder : folders) {
                collectJavaFileObjects(javaFileObjects, folder, packagePath, kinds, recurse);
            }
        }
        addAll(javaFileObjects, super.list(location, packageName, kinds, recurse));
        return javaFileObjects;
    }

    private void collectJavaFileObjects(List<JavaFileObject> list, Folder root, String packagePath, Set<Kind> kinds, boolean recurse) {
        Folder folder = root.getFolder(packagePath);
        if (!folder.exists() || folder.toString().endsWith(packagePath)) {
            return;
        }
        for (Resource child : folder.list()) {
            if (child instanceof Folder) {
                Folder childFolder = (Folder) child;
                if (recurse) {
                    collectJavaFileObjects(list, root, packagePath + "/" + childFolder.getName(), kinds, recurse);
                }
            } else {
                File childFile = (File) child;
                Kind kind = getKind(childFile);
                if (kinds.contains(kind)) {
                    list.add(new ResourceJavaFileObject(childFile, kind));
                }
            }
        }
    }

    private Kind getKind(File file) {
        String extension = StringUtils.getFilenameExtension(file.getName());
        extension = extension == null ? "" : "." + extension;
        for (Kind kind : Kind.values()) {
            if (kind.extension.equals(extension)) {
                return kind;
            }
        }
        return Kind.OTHER;
    }

    @Override
    public String inferBinaryName(Location location, JavaFileObject file) {
        String name = getNameWithoutExtension(file.getName());
        ResourceJavaFileObject javaFileObject = getJavaFile(location, name, file.getKind(), true);
        if (javaFileObject != null) {
            String binaryName = javaFileObject.getFile().toString();
            while (binaryName.startsWith("/")) {
                binaryName = binaryName.substring(1);
            }
            binaryName = getNameWithoutExtension(binaryName);
            binaryName = binaryName.replace("/", ".");
            return binaryName;
        }
        return super.inferBinaryName(location, file);
    }

    @Override
    public boolean isSameFile(FileObject a, FileObject b) {
        if (a instanceof ResourceFileObject && b instanceof ResourceFileObject) {
            return a.equals(b);
        }
        return super.isSameFile(a, b);
    }

    @Override
    public boolean hasLocation(Location location) {
        if (getLocation(location) != null) {
            return true;
        }
        return super.hasLocation(location);
    }

    @Override
    public JavaFileObject getJavaFileForInput(Location location, String className, Kind kind) throws IOException {
        JavaFileObject javaFileObject = getJavaFile(location, className, kind, true);
        if (javaFileObject == null) {
            javaFileObject = super.getJavaFileForInput(location, className, kind);
        }
        return javaFileObject;
    }

    @Override
    public JavaFileObject getJavaFileForOutput(Location location, String className, Kind kind, FileObject sibling) throws IOException {
        JavaFileObject javaFileObject = getJavaFile(location, className, kind, false);
        if (javaFileObject == null) {
            javaFileObject = super.getJavaFileForOutput(location, className, kind, sibling);
        }
        Assert.notNull(javaFileObject, "Unable to get JavaFileObject for output");
        return javaFileObject;
    }

    private ResourceJavaFileObject getJavaFile(Location location, String className, Kind kind, boolean mustExist) {
        if (CLASS_OR_SOURCE_KIND.contains(kind)) {
            Iterable<Folder> folders = getLocation(location);
            if (folders != null) {
                String path = asPath(className) + kind.extension;
                for (Folder folder : folders) {
                    File file = folder.getFile(path);
                    if (file.exists() || !mustExist) {
                        return new ResourceJavaFileObject(file, kind);
                    }
                }
            }
        }
        return null;
    }

    @Override
    public FileObject getFileForInput(Location location, String packageName, String relativeName) throws IOException {
        FileObject fileObject = getFile(location, packageName, relativeName);
        if (fileObject == null) {
            fileObject = super.getFileForInput(location, packageName, relativeName);
        }
        return fileObject;
    }

    @Override
    public FileObject getFileForOutput(Location location, String packageName, String relativeName, FileObject sibling) throws IOException {
        FileObject fileObject = getFile(location, packageName, relativeName);
        if (fileObject == null) {
            fileObject = super.getFileForOutput(location, packageName, relativeName, sibling);
        }
        Assert.notNull(fileObject, "Unable to get FileObject for output");
        return fileObject;
    }

    private ResourceFileObject getFile(Location location, String packageName, String relativeName) throws IOException {
        Iterable<Folder> folders = getLocation(location);
        if (folders != null) {
            String filename = asPath(packageName) + "/" + relativeName.replace("\\", "/");
            for (Folder folder : folders) {
                File file = folder.getFile(filename);
                if (file.exists()) {
                    return new ResourceFileObject(file);
                }
            }
        }
        return null;
    }

    public Iterable<Folder> getLocation(Location location) {
        return this.locations.get(location.getName());
    }

    public void setLocation(Location location, Iterable<Folder> folders) {
        if (location.isOutputLocation()) {
            Iterator<Folder> iterator = folders.iterator();
            if (iterator.hasNext()) {
                iterator.next();
                boolean onlyHasOnlyOnePath = !iterator.hasNext();
                Assert.isTrue(onlyHasOnlyOnePath, "Output location '" + location + "' can only have one path");
            }
        }
        this.locations.put(location.getName(), folders);
    }

    private String getNameWithoutExtension(String name) {
        String extension = StringUtils.getFilenameExtension(name);
        if (name == null || extension == null) {
            return name;
        }
        return name.substring(0, name.length() - extension.length() - 1);
    }

    private String asPath(String name) {
        StringBuffer classNamePath = new StringBuffer(name.length());
        for (char c : name.toCharArray()) {
            if (c == '\\' || c == '.') {
                c = '/';
            }
            classNamePath.append(c);
        }
        return classNamePath.toString();
    }

    private <T> void addAll(List<T> list, Iterable<T> iterable) {
        for (T item : iterable) {
            list.add(item);
        }
    }
}

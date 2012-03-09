
package com.wavemaker.tools.compiler.io;

import java.io.IOException;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.tools.FileObject;
import javax.tools.JavaFileManager;
import javax.tools.JavaFileObject;
import javax.tools.JavaFileObject.Kind;

import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;

/**
 * A {@link JavaFileManager} backed by {@link Resource} {@link Folder}s.
 * 
 * @author Phillip Webb
 */
public class ResourceFolderJavaFileManager implements JavaFileManager {

    private static final Set<Kind> CLASS_OR_SOURCE_KIND = EnumSet.of(Kind.CLASS, Kind.SOURCE);

    private final Map<String, Iterable<Folder>> locations = new HashMap<String, Iterable<Folder>>();

    @Override
    public ClassLoader getClassLoader(Location location) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Iterable<JavaFileObject> list(Location location, String packageName, Set<Kind> kinds, boolean recurse) throws IOException {
        Iterable<Folder> folders = getRequiredLocation(location);
        String packagePath = asPath(packageName);
        List<JavaFileObject> list = new ArrayList<JavaFileObject>();
        for (Folder folder : folders) {
            addTolist(list, folder, packagePath, kinds, recurse);
        }
        return list;
    }

    private void addTolist(List<JavaFileObject> list, Folder folder, String packagePath, Set<Kind> kinds, boolean recurse) {
        if (!folder.exists() || folder.toString().endsWith(packagePath)) {
            return;
        }
        for (Resource child : folder.list()) {
            if (child instanceof Folder) {
                Folder childFolder = (Folder) child;
                if (recurse) {
                    addTolist(list, childFolder, packagePath, kinds, recurse);
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
        String name = getFilenameWithoutExtension(file.getName());
        try {
            JavaFileObject javaFileObject = getJavaFileForInput(location, name, file.getKind());
            if (javaFileObject != null) {
                return asPath(name);
            }
        } catch (IOException e) {
        }
        return null;
    }

    @Override
    public boolean isSameFile(FileObject a, FileObject b) {
        Assert.isInstanceOf(ResourceFileObject.class, a);
        Assert.isInstanceOf(ResourceFileObject.class, b);
        return a.equals(b);
    }

    @Override
    public int isSupportedOption(String option) {
        return -1;
    }

    @Override
    public boolean handleOption(String current, Iterator<String> remaining) {
        return false;
    }

    @Override
    public boolean hasLocation(Location location) {
        return getLocation(location) != null;
    }

    @Override
    public JavaFileObject getJavaFileForInput(Location location, String className, Kind kind) throws IOException {
        return getJavaFile(location, className, kind);
    }

    @Override
    public JavaFileObject getJavaFileForOutput(Location location, String className, Kind kind, FileObject sibling) throws IOException {
        JavaFileObject javaFileObject = getJavaFile(location, className, kind);
        Assert.notNull(javaFileObject, "Location '" + location + "' is empty");
        return javaFileObject;
    }

    private JavaFileObject getJavaFile(Location location, String className, Kind kind) {
        Assert.isTrue(CLASS_OR_SOURCE_KIND.contains(kind), "Invalid kind " + kind);
        Iterable<Folder> folders = getRequiredLocation(location);
        String path = asPath(className) + kind.extension;
        for (Folder folder : folders) {
            File file = folder.getFile(path);
            if (file.exists()) {
                return new ResourceJavaFileObject(file, kind);
            }
        }
        return null;
    }

    @Override
    public FileObject getFileForInput(Location location, String packageName, String relativeName) throws IOException {
        return getFile(location, packageName, relativeName);
    }

    @Override
    public FileObject getFileForOutput(Location location, String packageName, String relativeName, FileObject sibling) throws IOException {
        FileObject fileObject = getFile(location, packageName, relativeName);
        Assert.notNull(fileObject, "Location '" + location + "' is empty");
        return fileObject;
    }

    private FileObject getFile(Location location, String packageName, String relativeName) throws IOException {
        Iterable<Folder> folders = getRequiredLocation(location);
        String filename = asPath(packageName) + "/" + relativeName.replace("\\", "/");
        for (Folder folder : folders) {
            File file = folder.getFile(filename);
            if (file.exists()) {
                return new ResourceFileObject(file);
            }
        }
        return null;
    }

    @Override
    public void flush() throws IOException {
    }

    @Override
    public void close() throws IOException {
    }

    private Iterable<Folder> getRequiredLocation(Location location) {
        Iterable<Folder> folders = getLocation(location);
        Assert.notNull(folders, "Unknown location '" + location + "'");
        return folders;
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

    private String getFilenameWithoutExtension(String name) {
        String extension = StringUtils.getFilenameExtension(name);
        if (name == null || extension == null) {
            return name;
        }
        return name.substring(0, name.length() - extension.length());
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

}

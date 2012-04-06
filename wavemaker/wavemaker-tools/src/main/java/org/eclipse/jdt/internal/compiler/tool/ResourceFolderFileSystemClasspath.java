/*
 *  Copyright (C) 2007-2012 VMware, Inc. All rights reserved.
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

package org.eclipse.jdt.internal.compiler.tool;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.eclipse.jdt.core.compiler.CharOperation;
import org.eclipse.jdt.internal.compiler.batch.FileSystem;
import org.eclipse.jdt.internal.compiler.batch.FileSystem.ClasspathSectionProblemReporter;
import org.eclipse.jdt.internal.compiler.classfmt.ClassFileReader;
import org.eclipse.jdt.internal.compiler.classfmt.ClassFormatException;
import org.eclipse.jdt.internal.compiler.env.NameEnvironmentAnswer;
import org.springframework.util.StringUtils;

import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.ResourceFiltering;
import com.wavemaker.tools.io.ResourceFiltering.ResourceAttributeFilter;
import com.wavemaker.tools.io.Resources;
import com.wavemaker.tools.io.compiler.ResourceJavaFileManager;

/**
 * Adapter class that exposes {@link wavemaker.tools.io.Folder}s from a {@link ResourceJavaFileManager} as eclipse
 * {@link FileSystem.Classpath}s.
 * 
 * @author Phillip Webb
 */
public class ResourceFolderFileSystemClasspath implements FileSystem.Classpath {

    private static final ResourceAttributeFilter<File> CLASS_OR_JAVA_FILES = ResourceFiltering.fileNames().ending(".class", ".java");

    private static final char FILE_SEPARATOR = java.io.File.separatorChar;

    private final Folder folder;

    private char[] normalizedPath;

    private String path;

    private Map<String, Boolean> isPackageCache;

    public ResourceFolderFileSystemClasspath(Folder folder) {
        this.folder = folder;
        this.path = this.folder.toString();
        this.path = this.path.substring(0, this.path.length() - 1);
    }

    @Override
    public void initialize() throws IOException {
    }

    @Override
    public void reset() {
        this.isPackageCache = null;
    }

    @Override
    public char[][][] findTypeNames(String qualifiedPackageName) {
        if (!isPackage(qualifiedPackageName) || !this.folder.exists()) {
            return null;
        }
        Resources<File> list = this.folder.list(CLASS_OR_JAVA_FILES);
        List<char[][]> foundTypeNames = new ArrayList<char[][]>();
        for (File file : list) {
            char[][] packageName = CharOperation.splitOn(java.io.File.separatorChar, qualifiedPackageName.toCharArray());
            String filename = file.getName();
            int indexOfLastDot = filename.indexOf('.');
            foundTypeNames.add(CharOperation.arrayConcat(packageName, filename.substring(0, indexOfLastDot).toCharArray()));
        }
        return foundTypeNames.toArray(new char[foundTypeNames.size()][][]);
    }

    @Override
    public NameEnvironmentAnswer findClass(char[] typeName, String qualifiedPackageName, String qualifiedBinaryFileName) {
        return findClass(typeName, qualifiedPackageName, qualifiedBinaryFileName, false);
    }

    @Override
    public NameEnvironmentAnswer findClass(char[] typeName, String qualifiedPackageName, String qualifiedBinaryFileName, boolean asBinaryOnly) {
        if (!isPackage(qualifiedPackageName)) {
            return null;
        }
        String filename = new String(typeName);
        File file = this.folder.getFile(normalizePath(qualifiedBinaryFileName));
        if (file.exists()) {
            InputStream inputStream = file.getContent().asInputStream();
            try {
                ClassFileReader reader = ClassFileReader.read(file.getContent().asInputStream(), qualifiedBinaryFileName);
                String typeSearched = normalizePath(qualifiedPackageName) + "/" + filename;
                if (!CharOperation.equals(reader.getName(), typeSearched.toCharArray())) {
                    reader = null;
                }
                if (reader != null) {
                    return new NameEnvironmentAnswer(reader, null);
                }
            } catch (ClassFormatException e) {
            } catch (IOException e) {
            } finally {
                try {
                    inputStream.close();
                } catch (IOException e) {
                }
            }
        }
        return null;
    }

    @Override
    public boolean isPackage(String qualifiedPackageName) {
        if (this.isPackageCache == null) {
            this.isPackageCache = new HashMap<String, Boolean>();
        }
        Boolean isPackage = this.isPackageCache.get(qualifiedPackageName);
        if (isPackage == null) {
            String packagePath = normalizePath(qualifiedPackageName);
            isPackage = StringUtils.hasLength(packagePath) && this.folder.hasExisting(packagePath);
            this.isPackageCache.put(qualifiedPackageName, isPackage);
        }
        return isPackage;
    }

    private String normalizePath(String qualifiedPackageName) {
        return qualifiedPackageName.replace(FILE_SEPARATOR, '/');
    }

    @Override
    @SuppressWarnings("rawtypes")
    public List fetchLinkedJars(ClasspathSectionProblemReporter problemReporter) {
        return null;
    }

    @Override
    public char[] normalizedPath() {
        if (this.normalizedPath == null) {
            this.normalizedPath = this.path.toCharArray();
        }
        return this.normalizedPath;
    }

    @Override
    public String getPath() {
        return this.path;
    }

    @Override
    public String toString() {
        return "ClasspathDirectory from ResourceFolder " + this.path;
    }
}

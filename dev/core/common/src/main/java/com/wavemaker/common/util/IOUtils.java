/*
 *  Copyright (C) 2007-2011 VMware, Inc. All rights reserved.
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

package com.wavemaker.common.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

import org.apache.commons.io.FileUtils;

import com.wavemaker.common.MessageResource;

/**
 * @author Simon Toens
 * @author Matt Small
 * @author Jeremy Grelle
 */
public class IOUtils {

    private static final int DEFAULT_BUFFER_SIZE = 1024;

    private IOUtils() {
    }

    /**
     * List of our default exclusion directory names. This is used both by
     */
    public static final List<String> DEFAULT_EXCLUSION = Collections.unmodifiableList(Arrays.asList(new String[] { ".svn" }));

    /**
     * Read an entire File into a String.
     * 
     * @param f The file to read from.
     * @return The contents of f as a String.
     * @throws IOException
     */
    public static String read(File f) throws IOException {
        StringBuilder fileSB = new StringBuilder();
        char[] buf = new char[DEFAULT_BUFFER_SIZE];

        BufferedReader br = null;

        try {

            br = new BufferedReader(new FileReader(f));

            while (br.ready()) {
                int readlen = br.read(buf);
                fileSB.append(buf, 0, readlen);
            }
            return fileSB.toString();

        } finally {

            try {
                br.close();
            } catch (Exception ignore) {
            }
        }
    }

    /**
     * Read the bottom of a File into a String. This probably isn't the proper way to do this in java but my goals here
     * were limited to NOT flooding memory with the entire file, but just to grab the last N lines and never have more
     * than the last N lines in memory
     */
    public static String tail(File f, int lines) throws IOException {
        java.util.ArrayList<String> lineList = new java.util.ArrayList<String>(lines);

        BufferedReader br = null;

        try {

            br = new BufferedReader(new FileReader(f));

            while (br.ready()) {
                String s = br.readLine();
                if (s == null) {
                    break;
                } else {
                    lineList.add(s);
                }
                if (lineList.size() > lines) {
                    lineList.remove(0);
                }
            }
            StringBuilder fileSB = new StringBuilder();
            for (int i = 0; i < lineList.size(); i++) {
                fileSB.append(lineList.get(i) + "\n");
            }
            return fileSB.toString();

        } finally {

            try {
                br.close();
            } catch (Exception ignore) {
            }
        }
    }

    public static void write(File f, String s) throws IOException {
        f.getParentFile().mkdirs();
        BufferedWriter br = null;
        try {
            br = new BufferedWriter(new FileWriter(f));
            br.write(s);
        } finally {
            try {
                br.close();
            } catch (Exception ignore) {
            }
        }
    }

    public static boolean compare(InputStream i1, InputStream i2) throws IOException {
        int b1 = 0;

        while ((b1 = i1.read()) != -1) {

            int b2 = i2.read();

            if (b2 == -1) {
                return false;
            }

            if (b1 != b2) {
                return false;
            }

        }

        if (i2.read() == -1) {
            return true;
        }

        return false;

    }

    // Returns the number of folders there are in the current folder; ignores
    // any folder with a "private" name (i.e. name starts with _ or .)
    public static int countFoldersInDir(File f) {
        int count = 0;
        try {
            File[] listing = f.listFiles();
            for (int i = 0; i < listing.length; i++) {
                if (listing[i].isDirectory() && !listing[i].getName().startsWith(".") && !listing[i].getName().startsWith("_")) {
                    count++;
                }
            }

        } catch (Exception e) {
        }
        return count;
    }

    /**
     * Read content of InputStream is into OutputStream os.
     * 
     * @param is InputStream to read from.
     * @param os OutputStream to write to.
     * @throws IOException
     */
    public static void copy(InputStream is, OutputStream os) throws IOException {

        org.apache.commons.io.IOUtils.copy(is, os);
    }

    /**
     * Copy from: file to file, directory to directory, file to directory. Defaults to exclude nothing, so all files and
     * directories are copied.
     * 
     * @param source File object representing a file or directory to copy from.
     * @param destination File object representing the target; can only represent a file if the source is a file.
     * @throws IOException
     */
    public static void copy(File source, File destination) throws IOException {

        copy(source, destination, new ArrayList<String>());
    }

    /**
     * Copy from: file to file, directory to directory, file to directory.
     * 
     * @param source File object representing a file or directory to copy from.
     * @param destination File object representing the target; can only represent a file if the source is a file.
     * @param excludes A list of exclusion filenames.
     * @throws IOException
     */
    public static void copy(File source, File destination, List<String> excludes) throws IOException {

        if (!source.exists()) {
            throw new IOException("Can't copy from non-existent file: " + source.getAbsolutePath());
        } else if (excludes.contains(source.getName())) {
            return;
        }

        if (source.isDirectory()) {
            if (!destination.exists()) {
                FileUtils.forceMkdir(destination);
            }
            if (!destination.isDirectory()) {
                throw new IOException("Can't copy directory (" + source.getAbsolutePath() + ") to non-directory: " + destination.getAbsolutePath());
            }

            File files[] = source.listFiles();
            for (int i = 0; i < files.length; i++) {
                copy(files[i], new File(destination, files[i].getName()), excludes);
            }
        } else if (source.isFile()) {
            if (destination.isDirectory()) {
                destination = new File(destination, source.getName());
            }

            InputStream in = new FileInputStream(source);
            OutputStream out = new FileOutputStream(destination);

            copy(in, out);

            in.close();
            out.close();

        } else {
            throw new IOException("Don't know how to copy " + source.getAbsolutePath() + "; it's neither a directory nor a file");
        }
    }

    /**
     * Create a temporary directory, which will be deleted when the VM exits.
     * 
     * @return The newly create temp directory
     * @throws IOException
     */
    public static File createTempDirectory() throws IOException {
        return createTempDirectory("fileUtils_createTempDirectory", null);
    }

    /**
     * Create a temporary directory, which will be deleted when the VM exits.
     * 
     * @param prefix String used for directory name
     * @param suffix String used for directory name extension
     * @return The newly create temp directory
     * @throws IOException
     */
    public static File createTempDirectory(String prefix, String suffix) throws IOException {
        // prefix has to be at least 3 chars long
        StringBuilder prefixSB = new StringBuilder(prefix);
        while (prefixSB.length() < 3) {
            prefixSB.append("a");
        }
        prefix = prefixSB.toString();

        // we're seeing a bug on Windows where createTempFile() will fail; as
        // a workaround, we're trying a few times.
        File dir = null;
        IOException exception = null;
        for (int i = 0; i < 10; i++) {
            try {
                dir = File.createTempFile(prefix, suffix);
                break;
            } catch (IOException e) {
                exception = e;
            }
        }
        if (dir == null) {
            throw exception;
        }

        if (!dir.delete()) {
            throw new IOException("Couldn't delete: " + dir);
        } else if (!dir.mkdir()) {
            throw new IOException("Couldn't mkdir: " + dir);
        }

        deleteFileOnShutdown(dir);

        return dir;
    }

    /**
     * Delete a directory or file; if a directory, delete its children recursively.
     * 
     * @param dir
     * @throws IOException
     */
    public static void deleteRecursive(File dir) throws IOException {

        FileUtils.forceDelete(dir);
    }

    /**
     * Create intermediate directories so that the File represented by newFile can be created.
     * 
     * @param newDir The directory that will be created; this method will ensure that the intermediate directories
     *        exist, and that this File is within the topLevel file.
     * @param topLevel This file should represent the top-level directory that files will not be created outside of.
     */
    public static void makeDirectories(File newDir, File topLevel) throws FileAccessException {

        if (newDir.exists()) {
            return;
        }

        if (!topLevel.exists()) {
            throw new FileAccessException(MessageResource.UTIL_FILEUTILS_PATHDNE, topLevel);
        } else if (!topLevel.isDirectory()) {
            throw new FileAccessException(MessageResource.UTIL_FILEUTILS_PATHNOTDIR, topLevel);
        }

        File absNewFile = newDir.getAbsoluteFile();
        IOUtils.makeDirectoriesRecurse(absNewFile, topLevel);
    }

    /**
     * Get all files (excluding directories) under dir.
     */
    public static Collection<File> getFiles(File indir) {
        if (!indir.isDirectory()) {
            throw new IllegalArgumentException("Expected directory as input");
        }
        Collection<File> rtn = new HashSet<File>();

        List<File> dirs = new ArrayList<File>();
        dirs.add(indir);

        while (!dirs.isEmpty()) {

            File dir = dirs.remove(0);

            String[] files = dir.list();
            for (String s : files) {
                File f = new File(dir, s);
                if (f.isDirectory()) {
                    dirs.add(f);
                } else {
                    rtn.add(f);
                }
            }
        }

        return rtn;
    }

    private static void makeDirectoriesRecurse(File dir, File topLevel) throws FileAccessException {

        // if we're at the topLevel end recursion
        if (dir.equals(topLevel)) {
            return;
        }

        // if we're at the filesystem root, error
        for (File root : File.listRoots()) {
            if (dir.equals(root)) {
                throw new FileAccessException(MessageResource.UTIL_FILEUTILS_REACHEDROOT, root, topLevel);
            }
        }

        // make & check parent directories
        makeDirectoriesRecurse(dir.getParentFile(), topLevel);

        // make this directory
        if (!dir.exists()) {
            dir.mkdir();
        }
    }

    /**
     * Touch a file (see touch(1)). If the file doesn't exist, create it as an empty file. If it does exist, update its
     * modification time.
     * 
     * @param f The File.
     * @throws IOException
     */
    public static void touch(File f) throws IOException {

        if (!f.exists()) {
            FileWriter fw = new FileWriter(f);
            fw.close();
        } else {
            f.setLastModified(System.currentTimeMillis());
        }
    }

    public static long getMostRecentModificationTime(File f) {
        return getMostRecentModificationTime(f, ".svn");
    }

    public static long getMostRecentModificationTime(File f, String... excludes) {
        if (!f.exists()) {
            throw new IllegalArgumentException("File doesn't exist: " + f);
        }

        if (f.isFile()) {
            return f.lastModified();
        } else {
            long rtn = -1;
            for (String s : f.list()) {
                for (String exclude : excludes) {
                    if (s.equals(exclude)) {
                        continue;
                    }
                }
                File f2 = new File(f, s);
                long l = getMostRecentModificationTime(f2);
                if (l > rtn) {
                    rtn = l;
                }
            }
            return rtn;
        }
    }

    /**
     * Register a File (which can be a directory or a file) for deletion on shutdown.
     * 
     * @param file The file to be deleted.
     */
    public static void deleteFileOnShutdown(File file) {

        DeleteFileThread dft = new DeleteFileThread(file);
        Runtime.getRuntime().addShutdownHook(dft);
    }

    private static class DeleteFileThread extends Thread {

        private final File toBeDeleted;

        public DeleteFileThread(File toBeDeleted) {
            this.toBeDeleted = toBeDeleted;
        }

        @Override
        public void run() {
            try {
                FileUtils.forceDelete(this.toBeDeleted);
            } catch (IOException e) {
                // ignore; we're on our way out anyways
            }
        }
    }

    /**
     * Return true iff we should exclude file, based on DEFAULT_EXCLUSION. The filename of file must be an exact match,
     * so this is more suitable for use with directories.
     */
    public static boolean excludeByExactMatch(File file) {

        return DEFAULT_EXCLUSION.contains(file.getName());
    }
}
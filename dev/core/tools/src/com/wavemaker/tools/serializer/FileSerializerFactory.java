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
package com.wavemaker.tools.serializer;

import java.io.File;
import java.util.List;
import java.util.Map;

import com.wavemaker.common.Resource;
import com.wavemaker.common.util.SpringUtils;
import com.wavemaker.tools.service.FileService;

/**
 * A utility class which provides factory methods for obtaining
 * <code>FileSerializer</code> instances. Convenience methods similar
 * to those defined in the <code>FileSerializer</code> class are also
 * provided. This class uses Spring for instantiation and to populate its
 * serializer map.
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class FileSerializerFactory {

    private static FileSerializerFactory instance;

    private Map<String, List<FileSerializer>> serializerMap;

    private FileSerializerFactory() {
        FileSerializerFactory.instance = this;
    }

    public static FileSerializerFactory getInstance() {
        if (instance == null) {
            SpringUtils.throwSpringNotInitializedError(
                    FileSerializerFactory.class);
        }
        return instance;
    }

    /**
     * Returns a <code>FileSerializer</code> for the given file
     * extension. If more than one <code>FileSerializer</code> is
     * available for the file extension, the first one will be returned.
     * 
     * @param fileExt
     *            The file extension.
     * @return A <code>FileSerializer</code> which corresponds to the
     *         given file extension.
     */
    public FileSerializer getSerializer(String fileExt) {
        List<FileSerializer> serializers = getSerializers(fileExt);
        if (serializers != null && !serializers.isEmpty()) {
            return serializers.get(0);
        }
        return null;
    }

    /**
     * Returns a list of all <code>FileSerializer</code>s for the
     * given file extension.
     * 
     * @param fileExt
     *            The file extension.
     * @return A list of all <code>FileSerializer</code>s.
     */
    public List<FileSerializer> getSerializers(String fileExt) {
        return serializerMap.get(fileExt);
    }

    /**
     * Reads a file and returns an object representing contents of the file.
     * Using the file extension of the given file, it will look for a registered
     * serializer and use the serializer to perform the task. If more than one
     * serializer registered for the file extension, the logic will try each
     * serializer until an object is successfully obtained.
     * 
     * @param file
     *            The file.
     * @return An object representing contents of the file.
     * @throws FileSerializerException
     */
    public Object readObject(FileService fileService, File file)
            throws FileSerializerException {
        List<FileSerializer> serializers = getSerializers(file);
        FileSerializerException serializerException = null;
        for (FileSerializer serializer : serializers) {
            Object ret = null;
            try {
                ret = serializer.readObject(fileService, file);
            } catch (FileSerializerException e) {
                serializerException = e;
            }
            if (ret != null) {
                return ret;
            }
        }
        if (serializerException != null) {
            throw serializerException;
        } else {
            return null;
        }
    }

    /**
     * Writes the object to a file. Using the file extension of the given file,
     * it will look for a registered serializer and use the serializer to
     * perform the task. If more than one serializer registered for the file
     * extension, the logic will try each serializer until an object is
     * successfully written to a file.
     * 
     * @param object
     *            The object to be serialized and written to a file.
     * @param file
     *            The file.
     * @throws FileSerializerException
     */
    public void writeObject(FileService fileService, Object object, File file)
            throws FileSerializerException {
        List<FileSerializer> serializers = getSerializers(file);
        FileSerializerException serializerException = null;
        for (FileSerializer serializer : serializers) {
            try {
                serializer.writeObject(fileService, object, file);
            } catch (FileSerializerException e) {
                serializerException = e;
            }
        }
        if (serializerException != null) {
            throw serializerException;
        }
    }

    private List<FileSerializer> getSerializers(File file)
            throws FileSerializerException {
        String fileExt = getFileExtension(file);
        List<FileSerializer> serializers = serializerMap.get(fileExt);
        if (serializers == null || serializers.isEmpty()) {
            throw new FileSerializerException(
                    Resource.STUDIO_PROJECT_UNKNOWN_TYPE + file.getName());
        }
        return serializers;
    }

    private String getFileExtension(File file) {
        String fileName = file.getName();
        int dotPos = fileName.lastIndexOf(".");
        String fileExt = fileName.substring(dotPos + 1);
        return fileExt;
    }

    public Map<String, List<FileSerializer>> getSerializerMap() {
        return serializerMap;
    }

    public void setSerializerMap(
            Map<String, List<FileSerializer>> serializerMap) {
        this.serializerMap = serializerMap;
    }
}

/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
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
package com.wavemaker.tools.cloudmgr;

import java.io.File;
import java.util.Collection;

/**
 * @author slee
 *
 */
public interface CloudStorageMgr {

    /**
     * Gets the list of all available cloud file containers.
     *
     * @param authObj  the authetication credential info, such as access key, user id, password etc...
     * @return Collection  the collection of file containers owned by the user.
     */
    Collection<CloudContainer> getContainerList(CloudAuth authObj);

    /**
     * Gets the container object for the container name passed.
     *
     * @param containerName  the container name
     * @param authObj  the authetication credential info, such as access key, user id, password etc...
     * @return CloudContainer  the cloud container object.
     */
    CloudContainer getContainer(String containerName, CloudAuth authObj);

    /**
     * Gets the list of files for the container name passed.
     *
     * @param containerName  the container name
     * @param authObj  the authetication credential info, such as access key, user id, password etc...
     * @return Collection  the collection of cloud files
     */
    Collection<CloudFile> getCloudFiles(String containerName, CloudAuth authObj);

    /**
     * Creates a file container.
     *
     * @param containerName  the file container name
     * @param location  the name of the location (eg. EU or US)
     * @param authObj  the authetication credential info, such as access key, user id, password etc...
     * @return Collection  the collection of file containers owned by the user.
     */
    Collection<CloudContainer> createContainer(String containerName,
                          String location,
                          CloudAuth authObj);

    /**
     * Removes a file container.
     *
     * @param containerName  the file container name to be deleted
     * @param authObj  the authetication credential info, such as access key, user id, password etc...
     * @return Collection  the collection of file containers owned by the user.
     */
    Collection<CloudContainer> deleteContainer(String containerName,
                          CloudAuth authObj);

    /**
     * Copies a file to the cloud storage.
     *
     * @param containerName  the file container name
     * @param file  the file opject of the WAR file
     * @param authObj  the authetication credential info
     * @return Collection  the collection of file objects for a specific container
     */
    Collection<CloudFile> copyFileToCloudStorage(String containerName,
                           File file,
                           CloudAuth authObj);

    /**
     * Deletes a file in the cloud storage.
     *
     * @param containerName  the file container name
     * @param fileName  the WAR file name to be deleted
     * @param authObj  the authetication credential info
     * @return Collection  the collection of file objects for a specific container
     */
    Collection<CloudFile> deleteFileInCloudStorage(String containerName,
                             String fileName,
                             CloudAuth authObj);
}

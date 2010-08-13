/*
 *  Copyright (C) 2008-2010 WaveMaker Software, Inc.
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
package com.wavemaker.tools.cloudmgr.rackspace;

import java.util.Collection;
import java.util.List;
import java.util.ArrayList;
import java.io.File;

import com.wavemaker.tools.cloudmgr.*;
import com.wavemaker.tools.cloudmgr.rackspace.cloudfiles.*;
import com.wavemaker.common.WMRuntimeException;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.io.FilenameUtils;

/**
 * This class is to manage opSource cloud server instances.
 *
 * @author slee
 */
public class RackSpaceStorageMgr implements CloudStorageMgr {

    private boolean logged_in = false;
    private FilesClient client = null;
    private String username = null;
    private String password = null;

    public Collection<CloudContainer> getContainerList(CloudAuth auth) {
        List<FilesContainer> filescontainers = null;
        Collection<CloudContainer> rtn = null;
        try {
            String un = auth.getUsername();
            String pw = auth.getPassword();

            if (!loggedIn(auth)) {
                client = new FilesClient(un, pw);
                logged_in = client.login();
                username = un;
                password = pw;
            }

            if (logged_in)
                filescontainers = client.listContainers();
            else
                throw new WMRuntimeException("Failed to login to Cloud Files!");

            if (filescontainers != null) {
                rtn = new ArrayList<CloudContainer>();
                for (FilesContainer filescontainer: filescontainers) {
                    CloudContainer container = new CloudContainer();
                    container.setContainerName(filescontainer.getName());
                    List<FilesObject> flist = filescontainer.getObjects();

                    if (flist != null && flist.size() > 0) {
                        Collection<CloudFile> fl = new ArrayList<CloudFile>();
                        for (FilesObject fobj: flist) {
                            CloudFile cfile = new CloudFile();
                            cfile.setContainerName(filescontainer.getName());
                            cfile.setFileName(fobj.getName());
                            cfile.setSize(fobj.getSize());
                            cfile.setSizeString(fobj.getSizeString());
                            cfile.setLastModified(fobj.getLastModified());
                            fl.add(cfile);
                        }
                        container.setFiles(fl);
                    }
                    rtn.add(container);
                }
            }
        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }

        return rtn;
    }

    public CloudContainer getContainer(String containerName, CloudAuth auth) {
        Collection<CloudContainer> cl = this.getContainerList(auth);
        CloudContainer rtn = null;
        if (cl != null && cl.size() > 0) {
            for (CloudContainer c: cl) {
                if (containerName.equals(c.getContainerName())) {
                    rtn = c;
                    break;
                }
            }
        }

        return rtn;
    }

    public Collection<CloudContainer> createContainer(String containerName,
                          String location,
                          CloudAuth auth) {
        if (!StringUtils.isNotBlank(containerName) || containerName.indexOf('/') != -1)
		{
			throw new WMRuntimeException("You must provide a valid value for the Container name !");
		}

		String un = auth.getUsername();
        String pw = auth.getPassword();

        try {
            if (!loggedIn(auth)) {
                client = new FilesClient(un, pw);
                logged_in = client.login();
                username = un;
                password = pw;
            }

            if (logged_in)
                client.createContainer(containerName);
            else {
                throw new WMRuntimeException("Failed to login to Cloud Files!");
            }
        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }

        return getContainerList(auth);
    }

    public Collection<CloudContainer> deleteContainer(String containerName,
                          CloudAuth auth) {
        boolean recurse = true;

        if (!StringUtils.isNotBlank(containerName))
		{
			throw new WMRuntimeException("You must provide a valid value for the Container name !");
		}

		String un = auth.getUsername();
        String pw = auth.getPassword();

        try{
            if (!loggedIn(auth)) {
                client = new FilesClient(un, pw);
                logged_in = client.login();
                username = un;
                password = pw;
            }

            if (logged_in)
            {
                if (recurse) {
                    List<FilesObject> objects = client.listObjects(containerName);
                    for (FilesObject obj : objects) {
                        client.deleteObject(containerName, obj.getName());
                    }
                }

                if (!client.deleteContainer(containerName)) {
                    throw new WMRuntimeException("Failed to delete container!");					
                }
            }
            else
                throw new WMRuntimeException("Failed to login to Cloud Files!");
        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }

        return getContainerList(auth);
    }

    public Collection<CloudFile> getCloudFiles(String containerName, CloudAuth auth) {
        CloudContainer container = this.getContainer(containerName, auth);
        return container.getFiles();
    }

    public Collection<CloudFile> copyFileToCloudStorage(String containerName,
                               File file,
                               CloudAuth auth) {
        this.storeObject(containerName, file, auth);
        return this.getContainer(containerName, auth).getFiles();
    }

    public Collection<CloudFile> deleteFileInCloudStorage(String containerName,
                               String warFileName,
                               CloudAuth auth) {
        this.deleteObject(containerName, warFileName, auth);

        return this.getContainer(containerName, auth).getFiles();
    }

    private void storeObject(String containerName,
                               File file, CloudAuth auth) {
        String fileNamePath = file.getAbsolutePath();
        String fileExt = FilenameUtils.getExtension(fileNamePath);
        String mimeType = Constants.getMimetype(fileExt);

        String un = auth.getUsername();
        String pw = auth.getPassword();

        try {
            if (!loggedIn(auth)) {
                client = new FilesClient(un, pw);
                logged_in = client.login();
                username = un;
                password = pw;
            }

            if (logged_in)
            {
                if (client.containerExists(containerName))
                    client.storeObject(containerName, file, mimeType);
                else
                {
                    throw new WMRuntimeException("The container does not exist.  Create it first before placing objects into it.");
                }
            } else
                throw new WMRuntimeException("Failed to login to Cloud Files!");
        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }
    }

    private void deleteObject(String containerName,
                                   String warFileName, CloudAuth auth) {
        String un = auth.getUsername();
        String pw = auth.getPassword();

        try {
            if (!loggedIn(auth)) {
                client = new FilesClient(un, pw);
                logged_in = client.login();
                username = un;
                password = pw;
            }

            if (logged_in)
            {
                if (client.containerExists(containerName))
                    client.deleteObject(containerName, warFileName);
                else
                {
                    throw new WMRuntimeException("The container does not exist.  Create it first before placing objects into it.");
                }
            } else
                throw new WMRuntimeException("Failed to login to Cloud Servers!");
        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }
    }

    private boolean loggedIn(CloudAuth auth) {
        String un = auth.getUsername();
        String pw = auth.getPassword();
        if (logged_in && username != null && password != null && username.equals(un) && password.equals(pw))
            return true;
        else
            return false;
    }
}

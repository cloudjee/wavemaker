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
package com.wavemaker.tools.cloudmgr.amazon;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;
import java.net.MalformedURLException;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.cloudmgr.CloudStorageMgr;
import com.wavemaker.tools.cloudmgr.CloudContainer;
import com.wavemaker.tools.cloudmgr.CloudAuth;
import com.wavemaker.tools.cloudmgr.CloudFile;
import com.amazon.s3.*;

/**
 * @author slee
 *
 */
public class AmazonS3StorageMgr implements CloudStorageMgr {

    private AWSAuthConnection conn = null;
    private final String S3_ERROR_CONNETION_FAILURE = "Server refused to connect you, Error code = ";
    private final String S3_ERROR_BUCKET_NOT_EMPTY = "Bucket may not be empty";
    private boolean isSecured = true;

    public Collection<CloudContainer> getContainerList(CloudAuth auth) {
        String awsAccessKeyId = auth.getAccessKeyId();
        String awsSecretAccessKey = auth.getSeceretAccessKey();
        String serviceURL = auth.getEC2ServiceURL();
        return getContainerList(awsAccessKeyId, awsSecretAccessKey, serviceURL);
    }

    private Collection<CloudContainer> getContainerList(String awsAccessKeyId, String  awsSecretAccessKey,
                                                        String serviceURL) {

        //if (conn == null)
        //{
            CallingFormat fmt = CallingFormat.getSubdomainCallingFormat();
            if (serviceURL.contains("Walrus")) isSecured = false;
            conn = new AWSAuthConnection(awsAccessKeyId, awsSecretAccessKey, isSecured, serviceURL, fmt);
        //}
        return getContainerList(conn);
    }

    private Collection<CloudContainer> getContainerList(AWSAuthConnection conn) {
        
        Collection<CloudContainer> containers = null;

        try {
            ListAllMyBucketsResponse bucketList = getS3BucketInfo(conn);

            List<Bucket> buckets = bucketList.entries;

            if (buckets != null && buckets.size() > 0) {
                containers = new ArrayList<CloudContainer>();
                for (Bucket bucket : buckets) {
                    String containerName = bucket.name;
                    String sDate = bucket.creationDate.toString();
                    Collection<CloudFile> clist = null;
                    if (!containerName.contains(".")) {
                        ListBucketResponse bobj = conn.listBucket(containerName, null, null, null, null);
                        List<ListEntry> entries = bobj.entries;
                        clist = convertToCloudFiles(containerName, entries);
                    }
                    CloudContainer container = new CloudContainer(containerName, sDate, clist);
                    containers.add(container);
                }
            }
        }
        catch (MalformedURLException mex) {
            throw new WMRuntimeException(mex.getMessage());
        }
        catch (IOException ex) {
            throw new WMRuntimeException(ex.getMessage());
        }

        return containers;
    }

    public CloudContainer getContainer(String containerName, CloudAuth auth) {
        CloudContainer targetContainer = null;
        Collection<CloudContainer> containers = this.getContainerList(auth);
        for (CloudContainer container : containers) {
            if (container.getContainerName().equals(containerName)) {
                targetContainer = container;
                break;
            }
        }

        if (targetContainer == null)
            throw new WMRuntimeException("Error: Container not found");

        return targetContainer;
    }

    public Collection<CloudFile> getCloudFiles(String containerName, CloudAuth auth) {
        return this.getContainer(containerName, auth).getFiles();
    }

    private Collection<CloudFile> convertToCloudFiles(String containerName, List<ListEntry> entries) {
        Collection<CloudFile> rtn = new ArrayList<CloudFile>();
        for (ListEntry obj: entries) {
            String sSize = ((Long)obj.size).toString();
            CloudFile cf = new CloudFile(containerName, obj.key, sSize, obj.owner.displayName,
                    obj.lastModified.toString());
            rtn.add(cf);
        }

        return rtn;
    }

    private ListAllMyBucketsResponse getS3BucketInfo(AWSAuthConnection conn)
    {
        ListAllMyBucketsResponse listAllMyBucketsResponse = null;
        try {
            listAllMyBucketsResponse = conn.listAllMyBuckets(null);
            int code = listAllMyBucketsResponse.connection.getResponseCode();
            if (code > 400) throw new AssertionError(S3_ERROR_CONNETION_FAILURE + code);
        }
        catch (MalformedURLException mex) {
            throw new WMRuntimeException(mex.getMessage());
        }
        catch (IOException ex) {
            throw new WMRuntimeException(ex.getMessage());
        }

        return listAllMyBucketsResponse;
    }

    public Collection<CloudContainer> createContainer(String containerName,
                          String location,
                          CloudAuth auth) {
        String awsAccessKeyId = auth.getAccessKeyId();
        String awsSecretAccessKey = auth.getAccessKeyId();
        String serviceURL = auth.getEC2ServiceURL();

        return createS3Bucket(containerName, location, awsAccessKeyId, awsSecretAccessKey, serviceURL);

    }
    
    private Collection<CloudContainer> createS3Bucket(String bucket,
                          String location,
                          String awsAccessKeyId,
                          String awsSecretAccessKey,
                          String serviceURL)
    {
        String locName;
        if (location.equals("EU"))
            locName = "EU";
        else
            locName = null;
        
        try {
            if (conn == null)
            {
                CallingFormat fmt = CallingFormat.getSubdomainCallingFormat();
                //conn = new AWSAuthConnection(awsAccessKeyId, awsSecretAccessKey, true, Utils.DEFAULT_HOST, fmt);
                if (serviceURL.contains("Walrus")) isSecured = false;
                conn = new AWSAuthConnection(awsAccessKeyId, awsSecretAccessKey, isSecured, serviceURL, fmt);
            }
            if (conn.checkBucketExists(bucket)) throw new AssertionError("Bucket already exists");
            
            Response response = conn.createBucket(bucket, locName, null);
            int code = response.connection.getResponseCode();

            if (code > 400) throw new AssertionError(S3_ERROR_CONNETION_FAILURE + code);
        } catch (Exception ex) {
            throw new AssertionError(ex.getMessage());
        }

        return getContainerList(awsAccessKeyId, awsSecretAccessKey, serviceURL);
    }

    public Collection<CloudContainer> deleteContainer(String containerName,
                          CloudAuth auth) {
        String awsAccessKeyId = auth.getAccessKeyId();
        String awsSecretAccessKey = auth.getAccessKeyId();
        String serviceURL = auth.getEC2ServiceURL();

        return deleteS3Bucket(containerName, awsAccessKeyId, awsSecretAccessKey, serviceURL);
    }

    private Collection<CloudContainer> deleteS3Bucket(String bucket,
                                 String awsAccessKeyId,
                                 String awsSecretAccessKey,
                                 String serviceURL)
    {
        try {
            if (conn == null)
            {
                CallingFormat fmt = CallingFormat.getSubdomainCallingFormat();
                if (serviceURL.contains("Walrus")) isSecured = false;
                conn = new AWSAuthConnection(awsAccessKeyId, awsSecretAccessKey, isSecured, serviceURL, fmt);
            }
            Response response = conn.deleteBucket(bucket, null);
            int code = response.connection.getResponseCode();
            if (code == 409)
                throw new AssertionError(S3_ERROR_BUCKET_NOT_EMPTY);
            else if (code > 400)
                throw new AssertionError(S3_ERROR_CONNETION_FAILURE + code);
            
        } catch (Exception ex) {
            throw new AssertionError(ex.getMessage());
        }

        return getContainerList(awsAccessKeyId, awsSecretAccessKey, serviceURL);
    }

    public Collection<CloudFile> copyFileToCloudStorage(String containerName,
                           File warFile,
                           CloudAuth auth) {
        String fName = warFile.getName();
        String awsAccessKeyId = auth.getAccessKeyId();
        String awsSecretAccessKey = auth.getAccessKeyId();
        String serviceURL = auth.getEC2ServiceURL();
        try {
            if (conn == null)
            {
                CallingFormat fmt = CallingFormat.getSubdomainCallingFormat();
                if (serviceURL.contains("Walrus")) isSecured = false;
                conn = new AWSAuthConnection(awsAccessKeyId, awsSecretAccessKey, isSecured, serviceURL, fmt);
            }

            int len = (int)warFile.length();
            FileInputStream fis = new FileInputStream(warFile);

            byte[] b = new byte[len];            
            Response response;
            while(fis.read(b) != -1) {
                response = conn.put(containerName, fName, new S3Object(b, null), null);
                int code = response.connection.getResponseCode();
                if (code > 400) throw new AssertionError(S3_ERROR_CONNETION_FAILURE + code);
            }
        } catch (Exception ex) {
            throw new AssertionError(ex.getMessage());
        }

        return this.getContainer(containerName, auth).getFiles();
    }

    public Collection<CloudFile> deleteFileInCloudStorage(String containerName,
                             String fileName,
                             CloudAuth auth) {
        String awsAccessKeyId = auth.getAccessKeyId();
        String awsSecretAccessKey = auth.getAccessKeyId();
        String serviceURL = auth.getEC2ServiceURL();
        try {
            if (conn == null)
            {
                CallingFormat fmt = CallingFormat.getSubdomainCallingFormat();
                if (serviceURL.contains("Walrus")) isSecured = false;
                conn = new AWSAuthConnection(awsAccessKeyId, awsSecretAccessKey, isSecured, serviceURL, fmt);
            }
            Response response = conn.delete(containerName, fileName, null);
            int code = response.connection.getResponseCode();
            if (code > 400) throw new AssertionError(S3_ERROR_CONNETION_FAILURE + code);
        } catch (Exception ex) {
            throw new AssertionError(ex.getMessage());
        }

        return this.getContainer(containerName, auth).getFiles();
    }

}

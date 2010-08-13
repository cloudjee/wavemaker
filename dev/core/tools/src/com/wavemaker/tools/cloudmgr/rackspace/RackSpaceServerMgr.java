/*
 * See COPYING for license information.
 */ 

package com.wavemaker.tools.cloudmgr.rackspace;

/**
 * This class is to manage RackSpace cloud server instances.
 *
 * @author slee
 */

import org.apache.commons.lang.StringUtils;
import java.util.Collection;
import java.util.List;
import java.util.ArrayList;

import com.wavemaker.tools.cloudmgr.*;
import com.wavemaker.tools.cloudmgr.rackspace.cloudservers.ServersClient;
import com.wavemaker.tools.cloudmgr.rackspace.cloudservers.ServersServerInfo;
import com.wavemaker.common.WMRuntimeException;

public class RackSpaceServerMgr implements CloudServerMgr {

    private boolean logged_in = false;
    private ServersClient client = null;
    private String username = null;
    private String password = null;

    public Collection<CloudServer> createServer(String serverName,
                                                String desc,
                                                String image,
                                                String flavorId,
                                                String network,
                                                String adminPass,
                                                String keyPair,
                                                String vmType,
                                                List<String> securityGroup,
                                                CloudAuth auth) {
        if (!StringUtils.isNotBlank(serverName) || serverName.indexOf('/') != -1)
		{
			System.err.println ("You must provide a valid value for the Server name !");
			System.exit (-1);
		}

		String un = auth.getUsername();
        String pw = auth.getPassword();

        //ServersClient client = null;
        try {
            if (!loggedIn(auth)) {
                client = new ServersClient(un, pw);
                logged_in = client.login();
                username = un;
                password = pw;
            }

            if (logged_in)
                client.createServer(serverName, image, flavorId);
            else
                throw new WMRuntimeException("Failed to login to Cloud Servers!");
        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }

        return this.getServerList(null, auth);
    }

    public Collection<CloudServer> deleteServer(String serverId, CloudAuth auth) {

		String un = auth.getUsername();
        String pw = auth.getPassword();

        //ServersClient client = null;

        try {
            if (!loggedIn(auth)) {
                client = new ServersClient(un, pw);
                logged_in = client.login();
                username = un;
                password = pw;
            }

            if (logged_in)
                client.deleteServer(serverId);
            else
                throw new WMRuntimeException("Failed to login to Cloud Servers!");
        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }

        return this.getServerList(null, auth);
    }

    public Collection<CloudServer> getServerList(String image, CloudAuth auth) {
        String un = auth.getUsername();
        String pw = auth.getPassword();

        //ServersClient client = null;

        List<ServersServerInfo> serverList;
        Collection<CloudServer> rtn = null;
        try {
            if (!loggedIn(auth)) {
                client = new ServersClient(un, pw);
                logged_in = client.login();
                username = un;
                password = pw;
            }

            if (logged_in)
                serverList = client.listServerDetails();
            else
                throw new WMRuntimeException("Failed to login to Cloud Servers!");
        
            if (serverList != null && serverList.size() > 0) {
                rtn = new ArrayList<CloudServer>();
                for (ServersServerInfo info : serverList) {
                    if (image != null && !image.equals(info.getImageId())) continue;
                    CloudServer cloudServer = new CloudServer(info.getName(),
                                                            null,
                                                            info.getId(),
                                                            info.getImageId(),
                                                            info.getFlavorId(),
                                                            null,
                                                            null,
                                                            info.getPublicIpAddress(),
                                                            info.getPrivateIpAddress(),
                                                            info.getCreated());
                    rtn.add(cloudServer);
                }
            }
        } catch (Exception ex) {
                    throw new WMRuntimeException(ex);
        }

        return rtn;
    }

    public Collection<CloudImage> getImageList(CloudAuth auth) {
        String un = auth.getUsername();
        String pw = auth.getPassword();

        //ServersClient client = null;

        Collection<CloudImage> rtn;
        try {
            if (!loggedIn(auth)) {
                client = new ServersClient(un, pw);
                logged_in = client.login();
                username = un;
                password = pw;
            }

            if (logged_in)
                rtn = client.listImages();
            else
                throw new WMRuntimeException("Failed to login to Cloud Servers!");

        } catch (Exception ex) {
                    throw new WMRuntimeException(ex);
        }

        return rtn;
    }

    public Collection<CloudFlavor> getFlavorList(CloudAuth auth) {
        String un = auth.getUsername();
        String pw = auth.getPassword();

        //ServersClient client = null;
        
        Collection<CloudFlavor> rtn;
        try {
            if (!loggedIn(auth)) {
                client = new ServersClient(un, pw);
                logged_in = client.login();
                username = un;
                password = pw;
            }

            if (logged_in)
                rtn = client.listFlavors();
            else
                throw new WMRuntimeException("Failed to login to Cloud Servers!");

        } catch (Exception ex) {
            throw new WMRuntimeException(ex);
        }

        return rtn;
    }

    private boolean loggedIn(CloudAuth auth) {
        String un = auth.getUsername();
        String pw = auth.getPassword();
        if (logged_in && username != null && password != null && username.equals(un) && password.equals(pw))
            return true;
        else
            return false;
    }

    public Collection<CloudNetwork> getNetworkList(CloudAuth authObj) {return null;}

    public Collection<CloudSecurityGroup> getSecurityGroupList(CloudAuth authObj) {return null;}

    public Collection<CloudKeyPair> getKeyPairList(CloudAuth authObj) {return null;}
}

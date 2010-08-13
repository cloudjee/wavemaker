/*
 * See COPYING for license information.
 */ 

package com.wavemaker.tools.cloudmgr.rackspace.cloudservers;

/**
 * Contains basic information about the container
 * 
 * @author lvaughn
 *
 */
public class ServersServerInfo
{
    private String id;
    private String name;
    private String imageId;
    private String flavorId;
    private String status;
    private String hostId;
    private String publicIpAddress;
    private String privateIpAddress;
    private String created;

    /**
     * @param id    The server Id
     * @param name  The server name
     * @param imageId    The image Id
     * @param flavorId  The flavor name
     * @param status    The server status
     * @param hostId    The host Id.
     * @param publicIpAddress  The public IP address
     * @param privateIpAddress  The private IP address
     * @param created  the time stamp the server was created
     */
    ServersServerInfo(String id, String name, String imageId, String flavorId, String status,
                      String hostId, String publicIpAddress, String privateIpAddress, String created)
    {
    	this.id = id;
        this.name = name;
        this.imageId = imageId;
        this.flavorId = flavorId;
        this.status = status;
        this.hostId = hostId;        
        this.publicIpAddress = publicIpAddress;
        this.privateIpAddress = privateIpAddress;
        this.created = created;
    }

    public String getId() {
		return id;
	}

	public void setId(String val) {
		this.id = val;
	}

    public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

    public String getImageId()
    {
        return imageId;
    }

    public void setImageId(String val)
    {
        imageId = val;
    }

    public String getFlavorId()
    {
        return flavorId;
    }

     public void setFlavorId(String val)
    {
        flavorId = val;
    }

    public String getStatus()
    {
        return status;
    }

     public void setStatusId(String val)
    {
        status = val;
    }

    public String getHostId()
    {
        return hostId;
    }

     public void setHostId(String val)
    {
        hostId = val;
    }

    public String getPublicIpAddress()
    {
        return publicIpAddress;
    }

     public void setPublicIpAddress(String val)
    {
        publicIpAddress = val;
    }

    public String getPrivateIpAddress()
    {
        return privateIpAddress;
    }

     public void setPrivateIpAddress(String val)
    {
        privateIpAddress = val;
    }

    public String getCreated()
    {
        return created;
    }

     public void setCreated(String val)
    {
        created = val;
    }

}

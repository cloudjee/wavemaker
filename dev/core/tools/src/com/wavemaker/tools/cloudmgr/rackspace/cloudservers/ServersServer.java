/*
 * See COPYING for license information.
 */ 

package com.wavemaker.tools.cloudmgr.rackspace.cloudservers;

import org.apache.commons.httpclient.HttpException;
import org.apache.log4j.Logger;

import java.io.IOException;

public class ServersServer
{
    private String id;
    private ServersClient client = null;
    private static Logger logger = Logger.getLogger(ServersServer.class);

    /**
     * Create a new server (Note, this does not actually create a container on the server)
     *  
     * @param id    The id of the container
     * @param client  The client we are currently using
     */
    public ServersServer(String id, ServersClient client)
    {
        this.id = id;
        this.client = client;
    }

    public String getId()
    {
        return this.id;
    }

    public void setId(String val)
    {
        this.id = val;
    }

    /**
     * Get useful information on this container
     * 
     * @return The container info
     * @throws HttpException There was a problem communicating with the server
     * @throws IOException There was a problem communicating with the server
     * @throws ServersException
     */
    public ServersServerInfo getInfo() throws HttpException, IOException, ServersException
    {
        if (client != null)
        {
            return client.getServerInfo(this.id);
        }
        else
        {
            logger.fatal("This server does not have a valid client !");
        }
        return null;
    }

    /**
     * Returns the instance of the client we're using
     * 
     * @return The FilesClient
     */
    public ServersClient getClient()
    {
        return this.client;                
    }

    /**
     * Creates the container represented by this instance on the server
     *
     * @return Either FilesConstants.CONTAINER_CREATED or FilesConstants.CONTAINER_EXISTED or -1 if the client has not been set 
     * @throws HttpException
     * @throws IOException
     * @throws ServersAuthorizationException
     * @throws ServersException
     */
    /*public void createServer () throws HttpException, IOException, ServersAuthorizationException, ServersException
    {
        if (client != null)
        {
        	client.createServer(this.name, this.imageId, this.flavorId);
        }
        else
            logger.fatal("This Container has no FilesClient defined !");

    }*/
}

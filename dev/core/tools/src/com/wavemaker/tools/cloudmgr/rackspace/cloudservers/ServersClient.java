/*
 * See COPYING for license information.
 */ 

package com.wavemaker.tools.cloudmgr.rackspace.cloudservers;

import org.apache.log4j.Logger;
import org.apache.commons.httpclient.*;
import org.apache.commons.httpclient.methods.*;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.NamedNodeMap;
import org.xml.sax.SAXException;

import com.wavemaker.tools.cloudmgr.rackspace.Constants;
import com.wavemaker.tools.cloudmgr.rackspace.CommonUtil;
import com.wavemaker.tools.cloudmgr.rackspace.Response;
import com.wavemaker.tools.cloudmgr.CloudImage;
import com.wavemaker.tools.cloudmgr.CloudFlavor;

import java.util.List;
import java.util.ArrayList;
import java.util.Collection;
import java.io.*;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

/**
 * 
 * A client for Cloud Servers.  Here follows a basic example of logging in, creating a server ,
 * retrieving the server, and then deleting the server.
 * 
 * <pre>
 * 
 *  //  Create the client object for username "jdoe", password "johnsdogsname". 
 * 	FilesClient myClient = FilesClient("jdoe", "johnsdogsname");
 * 
 *  // Log in (<code>login()</code> will return false if the login was unsuccessful.
 *  assert(myClient.login());
 * 
 *  // Make sure there are no servers in the account
 *  assert(myClient.listServers.length() == 0);
 *  
 *  // Create the server
 *  assert(myClient.createServer("myServer"));
 *  
 *  // Now we should have one
 *  assert(myClient.listServers.length() == 1);
 *  
 *  // Upload the file "alpaca.jpg"
 *  assert(myClient.storeObject("myServer", new File("alapca.jpg"), "image/jpeg"));
 *  
 *  // Download "alpaca.jpg"
 *  FilesObject obj = myClient.getObject("myServer", "alpaca.jpg");
 *  byte data[] = obj.getObject();
 *  
 *  // Clean up after ourselves.
 *  // Note:  Order here is important, you can't delete non-empty servers.
 *  assert(myClient.deleteObject("myServer", "alpaca.jpg"));
 *  assert(myClient.deleteServer("myServer");
 * </pre>
 *
 * @author SLee
 */
public class ServersClient
{
    public static final String VERSION = "v1";

    private String username = null;
    private String password = null;
    private String account = null;
    private String authenticationURL;
    private int connectionTimeOut;
    private String serverMgmntURL = null;
    private String authToken = null;
    private boolean isLoggedin = false;

    private HttpClient client = new HttpClient(new MultiThreadedHttpConnectionManager());

    private static Logger logger = Logger.getLogger(ServersClient.class);

    /**
     * @param username  The username to log in to 
     * @param password  The password
     * @param account   The Cloud Files account to use
     * @param connectionTimeOut  The connection timeout, in ms.
     */
    public ServersClient(String username, String password, String account, int connectionTimeOut)
    {
        this.username = username;
        this.password = password;
        this.account = account;
        if (account != null && account.length() > 0) {
        	this.authenticationURL = CommonUtil.getProperty("auth_url")+VERSION+"/"+account+CommonUtil.getProperty("auth_url_post");
        }
        else {
        	this.authenticationURL = CommonUtil.getProperty("auth_url");
        }
        this.connectionTimeOut = connectionTimeOut;

        client.getParams().setParameter("http.socket.timeout", this.connectionTimeOut );
        setUserAgent(Constants.USER_AGENT);

        if (logger.isDebugEnabled()) { 
        	logger.debug("UserName: "+ this.username);
            logger.debug("AuthenticationURL: "+ this.authenticationURL);
            logger.debug("ConnectionTimeOut: "+ this.connectionTimeOut);
        }
        //logger.debug("LGV:" + client.getHttpConnectionManager()); 
    }

    /**
     * This method uses the default connection time out of CONNECTON_TIMEOUT.  If <code>account</code>
     * is null, "Mosso Style" authentication is assumed, otherwise standard Cloud Files authentication is used.
     * 
     * @param username
     * @param password
     * @param account
     */
    public ServersClient(String username, String password, String account)
    {
        this (username, password, account, CommonUtil.getIntProperty("connection_timeout"));
    }

    /**
     * Mosso-style authentication (No accounts).
     * 
     * @param username     Your CloudFiles username
     * @param apiAccessKey Your CloudFiles API Access Key
     */
    public ServersClient(String username, String apiAccessKey)
    {
        this (username, apiAccessKey, null, CommonUtil.getIntProperty("connection_timeout"));
    	//lConnectionManagerogger.warn("LGV");
        //logger.debug("LGV:" + client.getHttpConnectionManager()); 
    }

    /**
     * This method uses the default connection time out of CONNECTON_TIMEOUT and username, password, 
     * and account from Util
     * 
     */
    public ServersClient()
    {
        this (CommonUtil.getProperty("username"),
        	  CommonUtil.getProperty("password"),
        	  CommonUtil.getProperty("account"),
        	  CommonUtil.getIntProperty("connection_timeout"));
    }

    /**
     * Returns the Account associated with the URL
     * 
     * @return The account name
     */
    public String getAccount()
    {
        return account;
    }

    /**
     * Set the Account value and reassemble the Authentication URL.
     *
     * @param account
     */
    public void setAccount(String account)
    {
        this.account = account;
        if (account != null && account.length() > 0) {
        	this.authenticationURL = CommonUtil.getProperty("auth_url")+VERSION+"/"+account+CommonUtil.getProperty("auth_url_post");
        }
        else {
        	this.authenticationURL = CommonUtil.getProperty("auth_url");
        }
    }

    /**
     * Log in to CloudFiles.  This method performs the authentication and sets up the client's internal state.
     * 
     * @return true if the login was successful, false otherwise.
     * 
     * @throws IOException   There was an IO error doing network communication
     * @throws HttpException There was an error with the http protocol
     */
    public boolean login() throws IOException, HttpException
    {
        GetMethod method = new GetMethod(authenticationURL);
        method.getParams().setSoTimeout(connectionTimeOut);

        method.setRequestHeader(CommonUtil.getProperty("auth_user_header", Constants.X_STORAGE_USER_DEFAULT),
        		username);
        method.setRequestHeader(CommonUtil.getProperty("auth_pass_header", Constants.X_STORAGE_PASS_DEFAULT),
        		password);

        logger.debug ("Logging in user: "+username+" using URL: "+authenticationURL);
        client.executeMethod(method);

        Response response = new Response(method);

        if (response.loginSuccess())
        {
            isLoggedin   = true;
            serverMgmntURL = response.getServerManagementURL(); //xxx
            //storageURL   = response.getStorageURL();
            //cdnManagementURL = response.getCDNManagementURL();
            authToken = response.getAuthToken();
            //logger.debug("storageURL: " + storageURL);
            logger.debug("authToken: " + authToken);
            //logger.debug("cdnManagementURL:" + cdnManagementURL);
            logger.debug("ConnectionManager:" + client.getHttpConnectionManager());
        }
        method.releaseConnection();

        return this.isLoggedin;
    }

    /**
     * Creates a server
     *
     * @param serverName The name of the server to be created
     * @param imageId The Id of the image to be used to create the server
     * @param flavorId The Id of the flavor to be used to create the server
     * @throws IOException   There was an IO error doing network communication
     * @throws HttpException There was an error with the http protocol
     * @throws ServersAuthorizationException The client was not property logged in
     * @throws ServersInvalidNameException The server name was invalid
     */
    public void createServer(String serverName, String imageId, String flavorId)
            throws IOException, HttpException, ServersAuthorizationException, ServersException
    {
        int status = -1;
        
        if (this.isLoggedin())
    	{
    		if (isValidServerName(serverName))
    		{
    			PostMethod method = new PostMethod(serverMgmntURL+"/servers");
    			method.getParams().setSoTimeout(connectionTimeOut);
    			method.setRequestHeader(Constants.X_AUTH_TOKEN, authToken);
                String reqBody = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>" +
                        "<server xmlns=\"http://docs.rackspacecloud.com/servers/api/v1.0\"" +
                        " name=\"" + serverName + "\" imageId=\"" + imageId + "\" flavorId=\"" + flavorId + "\">" +
                        "</server>";

                ByteArrayInputStream byteStream = new ByteArrayInputStream(reqBody.getBytes("UTF-8"));
                method.setRequestHeader("Content-type", "text/xml; charset=utf-8");

                method.setRequestEntity(new InputStreamRequestEntity(byteStream));

                try {
    				status = client.executeMethod(method);

    				Response response = new Response(method);
    				
    	       		if (response.getStatusCode() == HttpStatus.SC_UNAUTHORIZED) {
    	       			method.releaseConnection();
    	    			if(login()) {
    	    	   			method = new PostMethod(serverMgmntURL+"/servers");
    	        			method.getParams().setSoTimeout(connectionTimeOut);
    	        			method.setRequestHeader(Constants.X_AUTH_TOKEN, authToken);
                            method.setRequestEntity(new InputStreamRequestEntity(byteStream)); //xxx
                            status = client.executeMethod(method);
    	    				response = new Response(method);
    	    			}
    	    			else {
    	    				throw new ServersAuthorizationException("Re-login failed", response.getResponseHeaders(), response.getStatusLine());
    	    			}
    	    		}

	    			if (response.getStatusCode() == HttpStatus.SC_CREATED)
	    			{
	    				return;
	    			}
	    			else if (response.getStatusCode() != HttpStatus.SC_ACCEPTED)
	    			{	
	    			//	throw new ServersServerExistsException(serverName, response.getResponseHeaders(), response.getStatusLine());
	    			//}
	    			//else {
	    				throw new ServersException("Unexpected Response", response.getResponseHeaders(), response.getStatusLine());
	    			}
    			}
    			finally {
    				method.releaseConnection();
    			}
    		}
    		else
    		{
    			throw new ServersInvalidNameException(serverName);
    		}
    	}
    	else {
       		throw new ServersAuthorizationException("You must be logged in", null, null);
    	}
    }

    /**
     * Deletes a server
     * 
     * @param serverId  the id of server to be deleted
     * @throws IOException   There was an IO error doing network communication
     * @throws HttpException There was an error with the http protocol
     * @throws com.wavemaker.tools.cloudmgr.rackspace.cloudservers.ServersAuthorizationException The user is not Logged in
     * @throws com.wavemaker.tools.cloudmgr.rackspace.cloudservers.ServersInvalidNameException   The server name is invalid
     * @throws com.wavemaker.tools.cloudmgr.rackspace.cloudservers.ServersNotFoundException      The server doesn't exist
     */
    public boolean deleteServer(String serverId) throws IOException, HttpException, ServersAuthorizationException, ServersInvalidNameException, ServersNotFoundException
    {
    	if (this.isLoggedin())
    	{
            DeleteMethod method = new DeleteMethod(serverMgmntURL+"/servers/" + CommonUtil.sanitizeForURI(serverId));
            try {
                method.getParams().setSoTimeout(connectionTimeOut);
                method.setRequestHeader(Constants.X_AUTH_TOKEN, authToken);
                client.executeMethod(method);
                Response response = new Response(method);

                if (response.getStatusCode() == HttpStatus.SC_UNAUTHORIZED) {
                    method.releaseConnection();
                    if(login()) {
                        method = new DeleteMethod(serverMgmntURL+"/servers/" + serverId);
                        method.getParams().setSoTimeout(connectionTimeOut);
                        method.setRequestHeader(Constants.X_AUTH_TOKEN, authToken);
                        client.executeMethod(method);
                        response = new Response(method);
                    }
                    else {
                        throw new ServersAuthorizationException("Re-login failed", response.getResponseHeaders(), response.getStatusLine());
                    }
                }

                if (response.getStatusCode() == HttpStatus.SC_NO_CONTENT ||
                        response.getStatusCode() == HttpStatus.SC_ACCEPTED)
                {
                    logger.debug ("Server Deleted : "+ serverId);
                    return true;
                }
                else if (response.getStatusCode() == HttpStatus.SC_NOT_FOUND)
                {
                    logger.debug ("Server does not exist !");
                    throw new ServersNotFoundException("Server does not exist", response.getResponseHeaders(), response.getStatusLine());
                } else if (response.getStatusCode() == HttpStatus.SC_CONFLICT) {
                    String msg = "Server status does not allow deleting.  Please try again a few moments later.";
                    logger.debug (msg);
                    throw new ServersNotFoundException(msg, response.getResponseHeaders(), response.getStatusLine()); 
                }
            }
            finally {
                method.releaseConnection();
            }
    	}
		else
		{
       		throw new ServersAuthorizationException("You must be logged in", null, null);
		}
    	return false;
    }

    /**
     * List the servers available in an account.
     *
     * @return A List of ServersServer with all of the serers in the account.
     *         if there are no servers in the account, the list will be zero length.
     * @throws IOException   There was an IO error doing network communication
     * @throws HttpException There was an error with the http protocol
     * @throws ServersException There was another error in the request to the server.
     */
    public List<ServersServerInfo> listServerDetails() throws IOException, HttpException, ServersException
    {
        String serverId = null;
        String serverName = null;
        String publicIpAddr = null;
        String privateIpAddr = null;
        String imageId = null;
        String flavorId = null;
        String status = null;
        String hostId = null;

        List<ServersServerInfo> rtn = null;

        if (!this.isLoggedin()) {
       		throw new ServersAuthorizationException("You must be logged in", null, null);
    	}
    	GetMethod method = null;
    	try {
    		method = new GetMethod(serverMgmntURL + "/servers/detail.xml");
    		method.getParams().setSoTimeout(connectionTimeOut);
    		method.setRequestHeader(Constants.X_AUTH_TOKEN, authToken);

 			client.executeMethod(method);
    		Response response = new Response(method);

       		if (response.getStatusCode() == HttpStatus.SC_UNAUTHORIZED) {
    			method.releaseConnection();
    			if(login()) {
    				method = new GetMethod(serverMgmntURL);
    	    		method.getParams().setSoTimeout(connectionTimeOut);
    	    		method.setRequestHeader(Constants.X_AUTH_TOKEN, authToken);
    	       		
    				client.executeMethod(method);
    				response = new Response(method);
    			}
    			else {
    				throw new ServersAuthorizationException("Re-login failed", response.getResponseHeaders(), response.getStatusLine());
    			}
    		}

    		if (response.getStatusCode() == HttpStatus.SC_OK ||
                response.getStatusCode() == HttpStatus.SC_NON_AUTHORITATIVE_INFORMATION) {
    			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                DocumentBuilder builder = factory.newDocumentBuilder();
                Document document = builder.parse(response.getResponseBodyAsStream());

                NodeList nodes = document.getChildNodes();
                Node serversNode = nodes.item(0);
                if (! "servers".equals(serversNode.getNodeName())) {
                    logger.error("Got unexpected type of XML");
                    return null;
                }

                nodes = serversNode.getChildNodes();

                rtn = new ArrayList<ServersServerInfo>();

                for (int i=0; i<nodes.getLength(); i++) {
                    Node serverNode = nodes.item(i);
                    if (! "server".equals(serverNode.getNodeName())) {
                        logger.error("Got unexpected type of XML");
                        return null;
                    }
                    NamedNodeMap serverMap = serverNode.getAttributes();

                    if (serverMap.getNamedItem("id") != null) serverId = serverMap.getNamedItem("id").getNodeValue();
                    if (serverMap.getNamedItem("name") != null) serverName = serverMap.getNamedItem("name").getNodeValue();
                    if (serverMap.getNamedItem("imageId") != null) imageId = serverMap.getNamedItem("imageId").getNodeValue();
                    if (serverMap.getNamedItem("flavorId") != null) flavorId = serverMap.getNamedItem("flavorId").getNodeValue();
                    if (serverMap.getNamedItem("status") != null) status = serverMap.getNamedItem("status").getNodeValue();
                    if (serverMap.getNamedItem("hostId") != null) hostId = serverMap.getNamedItem("hostId").getNodeValue();

                    NodeList nodeList = serverNode.getChildNodes();
                    Node addrNode = nodeList.item(1); //item(0) is metadata
                    nodeList = addrNode.getChildNodes();
                    Node publicNode = nodeList.item(0);
                    Node privateNode = nodeList.item(1);

                    nodeList = publicNode.getChildNodes();
                    Node publicIpNode = nodeList.item(0);
                    NamedNodeMap publicIpNodeMap = publicIpNode.getAttributes();
                    publicIpAddr = publicIpNodeMap.getNamedItem("addr").getNodeValue();

                    nodeList = privateNode.getChildNodes();
                    Node privateIpNode = nodeList.item(0);
                    NamedNodeMap privateIpNodeMap = privateIpNode.getAttributes();
                    privateIpAddr = privateIpNodeMap.getNamedItem("addr").getNodeValue();

                    ServersServerInfo sinfo = new ServersServerInfo(serverId, serverName, imageId, flavorId, status,
                                                hostId, publicIpAddr, privateIpAddr, null);

                    rtn.add(sinfo);
                }
    		}
    		else if (response.getStatusCode() == HttpStatus.SC_NOT_FOUND)
    		{
    			throw new ServersNotFoundException("Account was not found", response.getResponseHeaders(), response.getStatusLine());
    		}
    		else {
    			throw new ServersException("Unexpected resposne from server", response.getResponseHeaders(), response.getStatusLine());
    		}
    	}
        catch (SAXException ex) {
                // probably a problem parsing the XML
                throw new ServersException("Problem parsing XML", ex);
        }
        catch (ParserConfigurationException ex) {
            // probably a problem parsing the XML
            throw new ServersException("Problem parsing XML", ex);
        }
        catch (Exception ex) {
    		//throw new ServersException("Unexpected error, probably parsing Server XML", ex);
            ex.printStackTrace();
            throw new ServersException(ex.toString(), ex);
        }

        finally {
    		if (method != null) method.releaseConnection();
    	}

        return rtn;
    }

    /**
     * List the server images available in an account.
     *
     * @return A List of CloudImage with all of the images in the account.
     *         if there are no images in the account, the list will be zero length.
     * @throws IOException   There was an IO error doing network communication
     * @throws HttpException There was an error with the http protocol
     * @throws ServersException There was another error in the request to the server.
     */
    public Collection<CloudImage> listImages() throws IOException, HttpException, ServersException
    {
        String id = null;
        String name = null;
        String description = null;
        String cpuCount = null;
        String memory = null;
        String osStorage = null;
        String extraStorage = null;
        String OS = null;
        String created = null;

        List<CloudImage> rtn = null;

        if (!this.isLoggedin()) {
       		throw new ServersAuthorizationException("You must be logged in", null, null);
    	}
    	GetMethod method = null;
    	try {
    		method = new GetMethod(serverMgmntURL + "/images/detail.xml");
    		method.getParams().setSoTimeout(connectionTimeOut);
    		method.setRequestHeader(Constants.X_AUTH_TOKEN, authToken);

 			client.executeMethod(method);
    		Response response = new Response(method);

       		if (response.getStatusCode() == HttpStatus.SC_UNAUTHORIZED) {
    			method.releaseConnection();
    			if(login()) {
    				method = new GetMethod(serverMgmntURL);
    	    		method.getParams().setSoTimeout(connectionTimeOut);
    	    		method.setRequestHeader(Constants.X_AUTH_TOKEN, authToken);

    				client.executeMethod(method);
    				response = new Response(method);
    			}
    			else {
    				throw new ServersAuthorizationException("Re-login failed", response.getResponseHeaders(), response.getStatusLine());
    			}
    		}

    		if (response.getStatusCode() == HttpStatus.SC_OK ||
                response.getStatusCode() == HttpStatus.SC_NON_AUTHORITATIVE_INFORMATION) {
    			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                DocumentBuilder builder = factory.newDocumentBuilder();
                Document document = builder.parse(response.getResponseBodyAsStream());

                NodeList nodes = document.getChildNodes();
                Node serversNode = nodes.item(0);
                if (! "images".equals(serversNode.getNodeName())) {
                    logger.error("Got unexpected type of XML");
                    return null;
                }

                nodes = serversNode.getChildNodes();

                rtn = new ArrayList<CloudImage>();

                for (int i=0; i<nodes.getLength(); i++) {
                    Node imageNode = nodes.item(i);
                    if (! "image".equals(imageNode.getNodeName())) {
                        logger.error("Got unexpected type of XML");
                        return null;
                    }
                    NamedNodeMap imageMap = imageNode.getAttributes();

                    if (imageMap.getNamedItem("id") != null) id = imageMap.getNamedItem("id").getNodeValue();
                    if (imageMap.getNamedItem("name") != null) name = imageMap.getNamedItem("name").getNodeValue();
                    if (imageMap.getNamedItem("created") != null) created = imageMap.getNamedItem("created").getNodeValue();

                    CloudImage image = new CloudImage(id, name, description, cpuCount, osStorage, memory,
                                                extraStorage, OS, created);

                    rtn.add(image);
                }
    		}
    		else if (response.getStatusCode() == HttpStatus.SC_NOT_FOUND)
    		{
    			throw new ServersNotFoundException("Account was not found", response.getResponseHeaders(), response.getStatusLine());
    		}
    		else {
    			throw new ServersException("Unexpected resposne from server", response.getResponseHeaders(), response.getStatusLine());
    		}
    	}
        catch (SAXException ex) {
                // probably a problem parsing the XML
                throw new ServersException("Problem parsing XML", ex);
        }
        catch (ParserConfigurationException ex) {
            // probably a problem parsing the XML
            throw new ServersException("Problem parsing XML", ex);
        }
        catch (Exception ex) {
    		//throw new ServersException("Unexpected error, probably parsing Server XML", ex);
            ex.printStackTrace();
            throw new ServersException(ex.toString(), ex);
        }

        finally {
    		if (method != null) method.releaseConnection();
    	}

        return rtn;
    }

    /**
     * List the server flavors available in an account.
     *
     * @return A List of CloudFlavor with all of the flavors in the account.
     *         if there are no flavors in the account, the list will be zero length.
     * @throws IOException   There was an IO error doing network communication
     * @throws HttpException There was an error with the http protocol
     * @throws ServersException There was another error in the request to the server.
     */
    public Collection<CloudFlavor> listFlavors() throws IOException, HttpException, ServersException
    {
        String id = null;
        String name = null;
        String description = null;
        String memory = null;
        String osStorage = null;
        String extraStorage = null;

        List<CloudFlavor> rtn = null;

        if (!this.isLoggedin()) {
       		throw new ServersAuthorizationException("You must be logged in", null, null);
    	}
    	GetMethod method = null;
    	try {
    		method = new GetMethod(serverMgmntURL + "/flavors/detail.xml");
    		method.getParams().setSoTimeout(connectionTimeOut);
    		method.setRequestHeader(Constants.X_AUTH_TOKEN, authToken);

 			client.executeMethod(method);
    		Response response = new Response(method);

       		if (response.getStatusCode() == HttpStatus.SC_UNAUTHORIZED) {
    			method.releaseConnection();
    			if(login()) {
    				method = new GetMethod(serverMgmntURL);
    	    		method.getParams().setSoTimeout(connectionTimeOut);
    	    		method.setRequestHeader(Constants.X_AUTH_TOKEN, authToken);

    				client.executeMethod(method);
    				response = new Response(method);
    			}
    			else {
    				throw new ServersAuthorizationException("Re-login failed", response.getResponseHeaders(), response.getStatusLine());
    			}
    		}

    		if (response.getStatusCode() == HttpStatus.SC_OK ||
                response.getStatusCode() == HttpStatus.SC_NON_AUTHORITATIVE_INFORMATION) {
    			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                DocumentBuilder builder = factory.newDocumentBuilder();
                Document document = builder.parse(response.getResponseBodyAsStream());

                NodeList nodes = document.getChildNodes();
                Node flavorsNode = nodes.item(0);
                if (! "flavors".equals(flavorsNode.getNodeName())) {
                    logger.error("Got unexpected type of XML");
                    return null;
                }

                nodes = flavorsNode.getChildNodes();

                rtn = new ArrayList<CloudFlavor>();

                for (int i=0; i<nodes.getLength(); i++) {
                    Node flavorNode = nodes.item(i);
                    if (! "flavor".equals(flavorNode.getNodeName())) {
                        logger.error("Got unexpected type of XML");
                        return null;
                    }
                    NamedNodeMap flavorMap = flavorNode.getAttributes();

                    if (flavorMap.getNamedItem("id") != null) id = flavorMap.getNamedItem("id").getNodeValue();
                    if (flavorMap.getNamedItem("name") != null)name = flavorMap.getNamedItem("name").getNodeValue();
                    if (flavorMap.getNamedItem("ram") != null)memory = flavorMap.getNamedItem("ram").getNodeValue();
                    if (flavorMap.getNamedItem("disk") != null)osStorage = flavorMap.getNamedItem("disk").getNodeValue();
                    extraStorage = null;

                    CloudFlavor flavor = new CloudFlavor(id, name, description, osStorage, memory, extraStorage);

                    rtn.add(flavor);
                }
    		}
    		else if (response.getStatusCode() == HttpStatus.SC_NOT_FOUND)
    		{
    			throw new ServersNotFoundException("Account was not found", response.getResponseHeaders(), response.getStatusLine());
    		}
    		else {
    			throw new ServersException("Unexpected resposne from server", response.getResponseHeaders(), response.getStatusLine());
    		}
    	}
        catch (SAXException ex) {
                // probably a problem parsing the XML
                throw new ServersException("Problem parsing XML", ex);
        }
        catch (ParserConfigurationException ex) {
            // probably a problem parsing the XML
            throw new ServersException("Problem parsing XML", ex);
        }
        catch (Exception ex) {
    		//throw new ServersException("Unexpected error, probably parsing Server XML", ex);
            ex.printStackTrace();
            throw new ServersException(ex.toString(), ex);
        }

        finally {
    		if (method != null) method.releaseConnection();
    	}

        return rtn;
    }

    /**
     * Get basic information on a server.
     *
     * @param serverId The server id to get information for
     * @return ServerInfo object of the server is present or null if its not present
     * @throws IOException  There was a socket level exception while talking to Cloudservers
     * @throws HttpException There was an protocol level exception while talking to Cloudservers
     * @throws ServersNotFoundException The server was not found
     */
    public ServersServerInfo getServerInfo (String serverId) throws IOException, HttpException, ServersException
    {
        String serverName = null;
        String publicIpAddr = null;
        String privateIpAddr = null;
        String imageId = null;
        String flavorId = null;
        String status = null;
        String hostId = null;

        ServersServerInfo rtn = null;

        if (this.isLoggedin())
    	{
            HeadMethod method = null;
            try {
                method = new HeadMethod(serverMgmntURL+"/"+CommonUtil.sanitizeForURI(serverId) + ".xml");
                method.getParams().setSoTimeout(connectionTimeOut);
                method.setRequestHeader(Constants.X_AUTH_TOKEN, authToken);
                client.executeMethod(method);

                Response response = new Response(method);

                if (response.getStatusCode() == HttpStatus.SC_OK) {
                    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                    DocumentBuilder builder = factory.newDocumentBuilder();
                    Document document = builder.parse(response.getResponseBodyAsStream());

                    NodeList nodes = document.getChildNodes();
                    Node serverNode = nodes.item(0);
                    if (! "server".equals(serverNode.getNodeName())) {
                        logger.error("Got unexpected type of XML");
                        return null;
                    }
                    NamedNodeMap serverMap = serverNode.getAttributes();

                    if (serverMap.getNamedItem("name") != null) serverName = serverMap.getNamedItem("name").getNodeValue();
                    if (serverMap.getNamedItem("imageId") != null) imageId = serverMap.getNamedItem("imageId").getNodeValue();
                    if (serverMap.getNamedItem("flavorId") != null) flavorId = serverMap.getNamedItem("flavorId").getNodeValue();
                    if (serverMap.getNamedItem("status") != null) status = serverMap.getNamedItem("status").getNodeValue();
                    if (serverMap.getNamedItem("hostId") != null) hostId = serverMap.getNamedItem("hostId").getNodeValue();

                    NodeList nodeList = serverNode.getChildNodes();
                    Node addrNode = nodeList.item(1); //item(0) is metadata
                    nodeList = addrNode.getChildNodes();
                    Node publicNode = nodeList.item(0);
                    Node privateNode = nodeList.item(1);

                    nodeList = publicNode.getChildNodes();
                    Node publicIpNode = nodeList.item(0);
                    NamedNodeMap publicIpNodeMap = publicIpNode.getAttributes();
                    publicIpAddr = publicIpNodeMap.getNamedItem("addr").getNodeValue();

                    nodeList = privateNode.getChildNodes();
                    Node privateIpNode = nodeList.item(0);
                    NamedNodeMap privateIpNodeMap = privateIpNode.getAttributes();
                    privateIpAddr = privateIpNodeMap.getNamedItem("addr").getNodeValue();

                    rtn = new ServersServerInfo(serverId, serverName, imageId, flavorId, status,
                                                hostId, publicIpAddr, privateIpAddr, null);
                }
                else if (response.getStatusCode() == HttpStatus.SC_UNAUTHORIZED) {
                    logger.warn("Unauthorized access");
                    throw new ServersAuthorizationException("User not Authorized!",response.getResponseHeaders(), response.getStatusLine());
                }
                else {
                    throw new ServersException("Unexpected server response",response.getResponseHeaders(), response.getStatusLine());
                }
            }
            catch (SAXException ex) {
                // probably a problem parsing the XML
                throw new ServersException("Problem parsing XML", ex);
            }
            catch (ParserConfigurationException ex) {
                // probably a problem parsing the XML
                throw new ServersException("Problem parsing XML", ex);
            }

            finally {
                if (method != null) method.releaseConnection();
            }
    	}
    	else
       		throw new ServersAuthorizationException("You must be logged in", null, null);

        return rtn;
    }

    /**
     * @return The server management URL on the other end of the ReST api
     */
    public String getServerManagementURL() //xxx
    {
    	return serverMgmntURL;
    }


    /**
     * @return Get's our storage token.
     */
    //public String getStorageToken()
    //{
    //	return authToken;
    //}

    /**
     * Has this instance of the client authenticated itself?  Note, this does not mean that a call 
     * right now will work, if the auth token has timed out, you will need to re-auth.
     * 
     * @return True if we logged in, false otherwise.
     */
    public boolean isLoggedin()
    {
    	return isLoggedin;
    }

    /**
     * The username we are logged in with.
     * 
     * @return The username
     */
    public String getUserName()
    {
    	return username;
    }

    /**
     * The URL we will use for Authentication
     * 
     * @return The URL (represented as a string)
     */
    //public String getAuthenticationURL()
    //{
    //	return authenticationURL;
    //}
	
	public void setUserAgent(String userAgent) {
		client.getParams().setParameter(HttpMethodParams.USER_AGENT, userAgent);
	}
	
	private boolean isValidServerName(String name) {
		if (name == null) return false;
		int length = name.length();
		if (length == 0 || length > Constants.SERVER_NAME_LENGTH) return false;
		if (name.indexOf('/') != -1) return false;
		//if (name.indexOf('?') != -1) return false;
		return true;
	}
}

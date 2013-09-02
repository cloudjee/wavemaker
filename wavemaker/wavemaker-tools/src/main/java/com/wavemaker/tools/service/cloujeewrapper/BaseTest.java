package com.wavemaker.tools.service.cloujeewrapper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.util.List;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;


import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.util.Assert;

import com.wavemaker.tools.service.cloujeewrapper.ConfigProperties;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.WebResource.Builder;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.api.client.filter.LoggingFilter;
import com.sun.jersey.api.representation.Form;
import org.apache.http.HttpResponse;

/**
 * @author <a href="mailto:pankaj.n@imaginea.com">pankaj</a>
 *
 */
public class BaseTest {

	private static final String EMPTY_BODY = "emptyBody";
	public NewCookie authCookie = null;
	public NewCookie jsessionId = null;
	private boolean isLoggingEnabled;

	protected URI getURIFromString(String uri) {
        return UriBuilder.fromUri(uri).build();
    }

    public void authenticate()
	{		
		Client client = getClient();
        client.addFilter(new LoggingFilter(System.out));
        //to get the auth_cookie we should disable the redirect follow
        client.setFollowRedirects(false);

		WebResource service = client.resource(getURIFromString(ConfigProperties.AUTH_LOGIN_URI));
		Form formData = new Form();
		formData.add("j_username", ConfigProperties.USER_NAME);
		formData.add("j_password", ConfigProperties.PASSWORD);
		formData.add("regButton", "Sign In");
        
        ClientResponse response = service.header("Host", ConfigProperties.HOST_NAME)
                .type(MediaType.APPLICATION_FORM_URLENCODED_TYPE).accept(MediaType.APPLICATION_JSON_TYPE)
                .post(ClientResponse.class, formData);
        //Assert.(response.getClientResponseStatus().getStatusCode(), 302); // Found

                
        setAuthCookie(response);
		client.setFollowRedirects(true);
	}

    public void setAuthCookie(ClientResponse response) {
        //Set-Cookie header contains the auth_cookie value
		List<String> cookies = response.getHeaders().get("Set-Cookie");
		if (cookies != null) {
			authCookie = NewCookie.valueOf(cookies.get(0));
			jsessionId = NewCookie.valueOf(cookies.get(1));
		}
	}

    public Client getClient() {
		ClientConfig config = new DefaultClientConfig();
		Client client = Client.create(config);
		if(isLoggingEnabled) {
			client.addFilter(new LoggingFilter(System.out));
		}
		return client;
	}

    public WebResource getResource(String url, String serviceName) {
		return getClient().resource(url).path(serviceName);
	}

    public WebResource getResource(String url, String serviceName,
			MultivaluedMap<String, String> queryParams, String... pathParams)
	{
		WebResource resource = getResource(url, serviceName);
		if (pathParams.length == 1) {
			resource = resource.path(pathParams[0]);
		} else {
			for (String param : pathParams) {
				resource = resource.path(param);
			}
		}

		if (queryParams != null) {
			resource = resource.queryParams(queryParams);
		}
		return resource;
	}

    public Builder buildRequest(String url, String serviceName, MediaType contentType, MediaType acceptType)
	{
		return getResource(url, serviceName)
		.header("Host", ConfigProperties.HOST_NAME)
		.type(contentType)
		.accept(acceptType)
		.cookie(authCookie);
	}

    public Builder buildRequest(String url, String serviceName,
			MediaType contentType, MediaType acceptType, String... pathParams)
	{
		return getResource(url, serviceName, null, pathParams)
		.header("Host", ConfigProperties.HOST_NAME)
		.type(contentType)
		.accept(acceptType)
		.cookie(authCookie);
	}

    public Builder buildRequest(String url, String serviceName,
			MediaType contentType, MediaType acceptType,
			MultivaluedMap<String, String> queryParams, String... pathParams)
	{
		return getResource(url, serviceName, queryParams, pathParams)
		.header("Host", ConfigProperties.HOST_NAME)
		.type(contentType)
		.accept(acceptType)
		.cookie(authCookie);
	}

    public void validateEmptyResponse(String respStr) {
		System.out.println("Validating empty response.....");
		JsonNode node = getJsonNode(respStr);
		JsonNode bodyNode = node.findValue("body");
		if (bodyNode != null) {
			JsonNode value = node.findValue("body").path("type");
			//Assert.assertEquals(value.getTextValue(), EMPTY_BODY);
		} else {
			//Assert.fail("Request failed with response " + respStr);
		}
	}

    public JsonNode getJsonNode(String response) {
		JsonNode node = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			node = mapper.readTree(response);
		} catch (JsonProcessingException jpe) {
			jpe.printStackTrace();
		} catch (IOException ioe) {
			ioe.printStackTrace();
		}

		return node;
	}

    public void setLoggingEnabled(boolean isLoggingEnabled) {
		this.isLoggingEnabled = isLoggingEnabled;
	}

    public NewCookie getAuthCookie()
	{
		return authCookie;
	}

    public NewCookie getjsessionId()
	{
		return jsessionId;
	}

    public String createGroup(String grpName)
	{
		Builder request = buildRequest(ConfigProperties.GROUP_URI,
				"creategroup", MediaType.APPLICATION_JSON_TYPE,
				MediaType.APPLICATION_JSON_TYPE, grpName );
		ClientResponse response = request.post(ClientResponse.class);
	//	Assert.assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
		//System.out.println("---------------Group Created with name "+ grpName +"---------------");
		return response.getEntity(String.class);
	}
	
	
	protected String readResponse(HttpResponse response) throws IllegalStateException, IOException{
		BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
		String responseOutput = "";
		String line = "";
		while ((line = rd.readLine()) != null) {
			responseOutput = responseOutput + line;
		} 
		rd.close();
		return responseOutput;
	}
	
}

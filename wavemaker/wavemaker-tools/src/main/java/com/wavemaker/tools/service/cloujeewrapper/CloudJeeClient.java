package com.wavemaker.tools.service.cloujeewrapper;


import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Method;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.filter.LoggingFilter;
import com.sun.jersey.api.representation.Form;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSONArray;
import com.wavemaker.json.JSONObject;
import com.wavemaker.json.JSONUnmarshaller;
import org.apache.commons.lang.WordUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.DefaultHttpClient;

public class CloudJeeClient extends BaseTest {


	private String auth;
    private final String ERROR_TOKEN = "X-WM-Login-ErrorMessage";

	public CloudJeeClient() {
        trustManager();
	}
    public CloudJeeClient(String auth){
        trustManager();
        this.auth = auth;
    }

    private void trustManager(){
        // Create a trust manager that does not validate certificate chains
        TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
            public X509Certificate[] getAcceptedIssuers() {
                return null;
            }

            public void checkClientTrusted(X509Certificate[] certs,
                                           String authType) {
            }

            public void checkServerTrusted(X509Certificate[] certs,
                                           String authType) {
            }
        } };

        // Install the all-trusting trust manager
        try {
            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, trustAllCerts, new SecureRandom());
            HttpsURLConnection
                    .setDefaultSSLSocketFactory(sc.getSocketFactory());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

	static {
		HttpsURLConnection
				.setDefaultHostnameVerifier(new javax.net.ssl.HostnameVerifier() {
					public boolean verify(String hostname,
							javax.net.ssl.SSLSession sslSession) {
						if (hostname.equals(ConfigProperties.HOST_NAME)) {
							return true;
						}
						return false;
					}
				});
	}
    public String  authenticate(String username, String password){
        Client client = getClient();
        client.addFilter(new LoggingFilter(System.out));
        //to get the auth_cookie we should disable the redirect follow
        client.setFollowRedirects(false);

        WebResource service = client.resource(getURIFromString(ConfigProperties.AUTH_LOGIN_URI));
        Form formData = new Form();
        formData.add("j_username", username);
        formData.add("j_password", password);
        formData.add("regButton", "Sign In");

        ClientResponse response = service.header("Host", ConfigProperties.HOST_NAME)
                .type(MediaType.APPLICATION_FORM_URLENCODED_TYPE).accept(MediaType.APPLICATION_JSON_TYPE)
                .post(ClientResponse.class, formData);
        //Assert.(response.getClientResponseStatus().getStatusCode(), 302); // Found
        if(response.getClientResponseStatus().getStatusCode() != 302){
            if((response.getClientResponseStatus().getStatusCode() == 401) && response.getHeaders().get(ERROR_TOKEN) != null)
            {
                throw new WMRuntimeException(response.getHeaders().get(ERROR_TOKEN).toString());
            }
            throw new WMRuntimeException("Invalid Credentials");
        }
        setAuthCookie(response);
        client.setFollowRedirects(true);
        List<String> cookies = response.getHeaders().get("Set-Cookie");

        if (cookies != null) {
            authCookie = NewCookie.valueOf(cookies.get(0));
            jsessionId = NewCookie.valueOf(cookies.get(1));
        }
        return getAuthCookie().getName() + "="
                + getAuthCookie().getValue() + "; " + getjsessionId().getName()
                + "=" + getjsessionId().getValue();

    }

	public String deploy(File file, String appName) throws Exception {

		DefaultHttpClient httpclient = CreateHttpClient
				.createHttpClientConnection();
		HttpPost httppost = new HttpPost(ConfigProperties.DEPLOY + appName);
		httppost.setHeader("Cookie", auth);

		FileBody uploadFilePart = new FileBody(file);
		MultipartEntity reqEntity = new MultipartEntity();
		reqEntity.addPart("file", uploadFilePart);
		httppost.setEntity(reqEntity);

		HttpResponse response = httpclient.execute(httppost);
		System.out.println("ResponseCode: "
				+ response.getStatusLine().getStatusCode());

        if((response.getStatusLine().getStatusCode() == 401) && response.getFirstHeader(ERROR_TOKEN).getValue() != null)
        {
            throw new WMRuntimeException(response.getFirstHeader(ERROR_TOKEN).getValue());
        }
        JSONObject jsonReq = (JSONObject) JSONUnmarshaller.unmarshal(readResponse(response));
        return getContent(jsonReq, "url");

	}
	
	public String start(String appName) throws Exception {

		DefaultHttpClient httpclient = CreateHttpClient
				.createHttpClientConnection();
		HttpPost httpget = new HttpPost(ConfigProperties.START + appName);
		httpget.setHeader("Cookie", auth);
		HttpResponse response = httpclient.execute(httpget);
		System.out.println("ResponseCode: "
				+ response.getStatusLine().getStatusCode());
        if((response.getStatusLine().getStatusCode() == 401) && response.getFirstHeader(ERROR_TOKEN).getValue() != null)
        {
            throw new WMRuntimeException(response.getFirstHeader(ERROR_TOKEN).getValue());
        }
		return readResponse(response);

	}

	public String stop(String appName) throws Exception {

		DefaultHttpClient httpclient = CreateHttpClient
				.createHttpClientConnection();
		HttpPost httpget = new HttpPost(ConfigProperties.STOP + appName);
		httpget.setHeader("Cookie", auth);
		HttpResponse response = httpclient.execute(httpget);
		System.out.println("ResponseCode: "
				+ response.getStatusLine().getStatusCode());
        if((response.getStatusLine().getStatusCode() == 401) && response.getFirstHeader(ERROR_TOKEN).getValue() != null)
        {
            throw new WMRuntimeException(response.getFirstHeader(ERROR_TOKEN).getValue());
        }
		
		return readResponse(response);

	}

    public List<CloudJeeApplication> list() throws Exception {
		DefaultHttpClient httpclient = CreateHttpClient
				.createHttpClientConnection();
		HttpGet httpget = new HttpGet(ConfigProperties.LIST);
		httpget.setHeader("Cookie", auth);
		HttpResponse response = httpclient.execute(httpget);
		System.out.println("ResponseCode: "
				+ response.getStatusLine().getStatusCode());
        if((response.getStatusLine().getStatusCode() == 401) && response.getFirstHeader(ERROR_TOKEN).getValue() != null)
        {
            throw new WMRuntimeException(response.getFirstHeader(ERROR_TOKEN).getValue());
        }
        String resultJson  = readResponse(response);
        JSONObject jsonReq = (JSONObject) JSONUnmarshaller.unmarshal(resultJson);
		return parseResponse(jsonReq);
	}

    public String accountInfo() throws Exception {
        DefaultHttpClient httpclient = CreateHttpClient
                .createHttpClientConnection();
        HttpGet httpget = new HttpGet(ConfigProperties.ACCOUNTINFO);
        httpget.setHeader("Cookie", auth);
        HttpResponse response = httpclient.execute(httpget);
        System.out.println("ResponseCode: "
                + response.getStatusLine().getStatusCode());
        if((response.getStatusLine().getStatusCode() == 401) && response.getFirstHeader(ERROR_TOKEN).getValue() != null)
        {
            throw new WMRuntimeException(response.getFirstHeader(ERROR_TOKEN).getValue());
        }
        String resultJson  = readResponse(response);
        JSONObject jsonReq = (JSONObject) JSONUnmarshaller.unmarshal(resultJson);
        return  getContent(jsonReq, "tenantDomainName") + "." + ConfigProperties.ACCOUNTTARGETSUFFIX;
    }

    public String undeploy(String appName) throws Exception{
		DefaultHttpClient httpclient = CreateHttpClient
				.createHttpClientConnection();
		HttpPost httpget = new HttpPost(ConfigProperties.UNDEPLOY + appName);
		httpget.setHeader("Cookie", auth);
		HttpResponse response = httpclient.execute(httpget);
		System.out.println("ResponseCode: "
				+ response.getStatusLine().getStatusCode());
        if((response.getStatusLine().getStatusCode() == 401) && response.getFirstHeader(ERROR_TOKEN).getValue() != null)
        {
            throw new WMRuntimeException(response.getFirstHeader(ERROR_TOKEN).getValue());
        }
		return readResponse(response);

    }

    public String signUp(String email) throws Exception {
        Client client = getClient();
        client.addFilter(new LoggingFilter(System.out));

        client.setFollowRedirects(false);

        WebResource service = client.resource(getURIFromString(ConfigProperties.SIGNUP));
        Form formData = new Form();
        formData.add("emailId", email);


        ClientResponse response = service.header("Host", ConfigProperties.HOST_NAME)
                .type(MediaType.APPLICATION_FORM_URLENCODED_TYPE).accept(MediaType.APPLICATION_JSON_TYPE)
                .post(ClientResponse.class, formData);
        //Assert.(response.getClientResponseStatus().getStatusCode(), 302); // Found
        /*if(response.getClientResponseStatus().getStatusCode() != 302){
            throw new WMRuntimeException("Invalid Credentials");
        }*/
        if((response.getClientResponseStatus().getStatusCode() == 401) && response.getHeaders().get(ERROR_TOKEN) != null)
        {
            throw new WMRuntimeException(response.getHeaders().get(ERROR_TOKEN).toString());
        }

        BufferedReader bf = new BufferedReader(new InputStreamReader(response.getEntityInputStream()));
        String responseVal = "", res="";

        try {
            while(( res = bf.readLine()) !=null){
                responseVal = responseVal + res;
            }


        } catch (IOException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }

        client.setFollowRedirects(true);
        JSONObject jsonReq = (JSONObject) JSONUnmarshaller.unmarshal(responseVal);
        return getContent(jsonReq, "$");

    }
    public String loginTarget() {
        return ConfigProperties.LOGINTARGET;
    }


    private List<CloudJeeApplication> parseResponse(JSONObject jsonObj){
        List<CloudJeeApplication> apps = new ArrayList<CloudJeeApplication>();
        try {

            JSONObject block = (JSONObject) jsonObj.get("success");
            JSONObject body = null;
            if (block != null && (body = (JSONObject) block.get("body")) != null) {
                JSONArray objects = new JSONArray();

                if(((JSONArray) body.get("objects")) != null){
                    objects = (JSONArray) body.get("objects");
                }

                Class cls = null;
                cls = Class.forName("com.wavemaker.tools.service.cloujeewrapper.CloudJeeApplication");

                for (Object obj : objects) {
                    CloudJeeApplication app = (CloudJeeApplication) cls.newInstance();
                    HashMap<String, Object> map = (HashMap<String, Object>) obj;
                    for (String key : map.keySet()) {
                        Object value = map.get(key);
                        if(value instanceof Boolean){
                            Method method = cls.getDeclaredMethod("set" + WordUtils.capitalize(key), Boolean.class);
                            method.invoke(app, value);
                        }
                        else{
                            Method method = cls.getDeclaredMethod("set" + WordUtils.capitalize(key), String.class);
                            method.invoke(app, value);
                        }

                    }
                    apps.add(app);
                }

            }

            return apps;
        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }
    }

    private String getContent(JSONObject jsonObj, String keyName) {
        String content="";
        try {
            JSONObject block = (JSONObject) jsonObj.get("success");
            JSONObject body = null;
            if (block != null && (body = (JSONObject) block.get("body")) != null) {
                content = (String) body.get(keyName);
            } else if((block=(JSONObject) jsonObj.get("exceptionObject")) != null){
                content =  (String) block.get("cause");
            }else if((block=(JSONObject) jsonObj.get("errors")) != null){
                JSONArray errors =  (JSONArray) block.get("error");
                for(int i=0; i < errors.size(); i++){
                    JSONObject errObj = (JSONObject)errors.get(i);
                    String msg = null;
                    if((msg = (String)errObj.get("message")) != null){
                        content = content+"\n" + msg;
                    }
                }
            }

        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }
        return content;
    }


    public void logout() throws Exception {
        DefaultHttpClient httpclient = CreateHttpClient
                .createHttpClientConnection();
        HttpGet httpget = new HttpGet(ConfigProperties.AUTH_LOGOUT_URI);
        httpget.setHeader("Cookie", auth);
        HttpResponse response = httpclient.execute(httpget);
        System.out.println("ResponseCode: "
                + response.getStatusLine().getStatusCode());
    }
}

package com.wavemaker.tools.service.cloujeewrapper;

import java.io.File;
import java.io.IOException;
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

	public CloudJeeClient() {
        trustManager();
	/*	if (authCookie == null) {
			authenticate();
		}
		this.auth = getAuthCookie().getName() + "="
				+ getAuthCookie().getValue() + "; " + getjsessionId().getName()
				+ "=" + getjsessionId().getValue();*/
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

        JSONObject jsonReq = (JSONObject) JSONUnmarshaller.unmarshal(readResponse(response));
        return getUrl(jsonReq);

	}
	
	public String start(String appName) throws Exception {

		DefaultHttpClient httpclient = CreateHttpClient
				.createHttpClientConnection();
		HttpPost httpget = new HttpPost(ConfigProperties.START + appName);
		httpget.setHeader("Cookie", auth);
		HttpResponse response = httpclient.execute(httpget);
		System.out.println("ResponseCode: "
				+ response.getStatusLine().getStatusCode());
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
        String resultJson  = readResponse(response);
        JSONObject jsonReq = (JSONObject) JSONUnmarshaller.unmarshal(resultJson);
        return (String)jsonReq.get("appDomainName");
    }

    public String undeploy(String appName) throws Exception{
		DefaultHttpClient httpclient = CreateHttpClient
				.createHttpClientConnection();
		HttpPost httpget = new HttpPost(ConfigProperties.UNDEPLOY + appName);
		httpget.setHeader("Cookie", auth);
		HttpResponse response = httpclient.execute(httpget);
		System.out.println("ResponseCode: "
				+ response.getStatusLine().getStatusCode());
		return readResponse(response);

    }

    private List<CloudJeeApplication> parseResponse(JSONObject jsonObj){
        try {
            List<CloudJeeApplication> apps = new ArrayList<CloudJeeApplication>();
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

    private String getUrl(JSONObject jsonObj) {
        String url="";
        try {
            List<CloudJeeApplication> apps = new ArrayList<CloudJeeApplication>();
            JSONObject block = (JSONObject) jsonObj.get("success");
            JSONObject body = null;
            if (block != null && (body = (JSONObject) block.get("body")) != null) {
                url = (String) body.get("url");
            } else if((block=(JSONObject) jsonObj.get("exceptionObject")) != null){
                 url =  (String) block.get("cause");
            }else if((block=(JSONObject) jsonObj.get("errors")) != null){
                JSONArray errors =  (JSONArray) block.get("error");
                for(int i=0; i < errors.size(); i++){
                    JSONObject errObj = (JSONObject)errors.get(i);
                    String msg = null;
                    if((msg = (String)errObj.get("message")) != null){
                        url = url+"\n" + msg;
                    }
                }
            }

        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }
        return url;
    }


}

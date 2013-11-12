package com.wavemaker.tools.service.wavemakercloud;


import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.api.client.filter.LoggingFilter;
import com.sun.jersey.api.representation.Form;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.json.JSONArray;
import com.wavemaker.json.JSONObject;
import com.wavemaker.json.JSONUnmarshaller;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.WordUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpResponse;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.UriBuilder;
import java.io.*;
import java.lang.reflect.Method;
import java.net.URI;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class CloudJeeClient {


	private String auth;
    private boolean isLoggingEnabled;

    private final String ERROR_TOKEN = "X-WM-Login-ErrorMessage";
    private static final String EMPTY_BODY = "emptyBody";

    private static final Log log = LogFactory.getLog(CloudJeeClient.class);

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
            log.warn("Failed in trust manager", e);
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
                throw new WMRuntimeException(getErrorMsg(response.getHeaders().get(ERROR_TOKEN)));
            }
            throw new WMRuntimeException("Problem connecting to Server (response message: " + response.getClientResponseStatus().getStatusCode() +" " +response.getClientResponseStatus().getReasonPhrase());
        }
        client.setFollowRedirects(true);
        List<String> cookies = response.getHeaders().get("Set-Cookie");

        if (cookies != null && cookies.size() >=2 ) {
            NewCookie authCookie = NewCookie.valueOf(cookies.get(0));
            NewCookie jsessionId = NewCookie.valueOf(cookies.get(1));
            return authCookie.getName() + "="
                    + authCookie.getValue() + "; " + jsessionId.getName()
                    + "=" + jsessionId.getValue();
        }
        log.error("Unexpected no. of cookies received as response:" + cookies);
        throw new WMRuntimeException("Authentication Failed");
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
        if(response.getStatusLine().getStatusCode() != 200){
            handleException(response);
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

        if(response.getStatusLine().getStatusCode() != 200){
            handleException(response);
        }
        String content = readResponse(response);
        JSONObject jsonReq = (JSONObject) JSONUnmarshaller.unmarshal(content);
        handleErrors(jsonReq);
		return content;

	}

	public String stop(String appName) throws Exception {

		DefaultHttpClient httpclient = CreateHttpClient
				.createHttpClientConnection();
		HttpPost httpget = new HttpPost(ConfigProperties.STOP + appName);
		httpget.setHeader("Cookie", auth);
		HttpResponse response = httpclient.execute(httpget);
		System.out.println("ResponseCode: "
				+ response.getStatusLine().getStatusCode());

        if(response.getStatusLine().getStatusCode() != 200){
            handleException(response);
        }

        String content = readResponse(response);
        JSONObject jsonReq = (JSONObject) JSONUnmarshaller.unmarshal(content);
        handleErrors(jsonReq);
        return content;
	}

    public List<CloudJeeApplication> list() throws Exception {
		DefaultHttpClient httpclient = CreateHttpClient
				.createHttpClientConnection();
		HttpGet httpget = new HttpGet(ConfigProperties.LIST);
		httpget.setHeader("Cookie", auth);
		HttpResponse response = httpclient.execute(httpget);
		System.out.println("ResponseCode: "
				+ response.getStatusLine().getStatusCode());

        if(response.getStatusLine().getStatusCode() != 200){
            handleException(response);
        }

        String resultJson  = readResponse(response);
        JSONObject jsonReq = (JSONObject) JSONUnmarshaller.unmarshal(resultJson);
		return parseResponse(jsonReq);
	}

    public List<CloudJeeLog> listLogs(String tenantName) throws Exception {
        DefaultHttpClient httpclient = CreateHttpClient
                .createHttpClientConnection();
        String logservice = ConfigProperties.LOGFILELIST.replaceAll(ConfigProperties.TENANT_NAME, tenantName);
        HttpGet httpget = new HttpGet(logservice);
        httpget.setHeader("Cookie", auth);
        HttpResponse response = httpclient.execute(httpget);
        System.out.println("ResponseCode: "
                + response.getStatusLine().getStatusCode());

        if(response.getStatusLine().getStatusCode() != 200){
            handleException(response);
        }

        String resultJson  = readResponse(response);
        JSONObject jsonReq = (JSONObject) JSONUnmarshaller.unmarshal(resultJson);
        return parseLogsResponse(jsonReq, tenantName);
    }

    public String accountInfo(boolean isLink) throws Exception {
        DefaultHttpClient httpclient = CreateHttpClient
                .createHttpClientConnection();
        HttpGet httpget = new HttpGet(ConfigProperties.ACCOUNTINFO);
        httpget.setHeader("Cookie", auth);
        HttpResponse response = httpclient.execute(httpget);
        System.out.println("ResponseCode: "
                + response.getStatusLine().getStatusCode());

        if(response.getStatusLine().getStatusCode() != 200){
            handleException(response);
        }

        String resultJson  = readResponse(response);
        JSONObject jsonReq = (JSONObject) JSONUnmarshaller.unmarshal(resultJson);
        String tenantName =  getContent(jsonReq, "tenantDomainName");
        if(isLink) {
            return  tenantName + "." + ConfigProperties.ACCOUNTTARGETSUFFIX;
        }
        else{
            return tenantName;
        }
    }

    public String undeploy(String appName) throws Exception{
		DefaultHttpClient httpclient = CreateHttpClient
				.createHttpClientConnection();
		HttpPost httpget = new HttpPost(ConfigProperties.UNDEPLOY + appName);
		httpget.setHeader("Cookie", auth);
		HttpResponse response = httpclient.execute(httpget);
		System.out.println("ResponseCode: "
				+ response.getStatusLine().getStatusCode());

        if(response.getStatusLine().getStatusCode() != 200){
            handleException(response);
        }

        String content = readResponse(response);
        JSONObject jsonReq = (JSONObject) JSONUnmarshaller.unmarshal(content);
        handleErrors(jsonReq);
        return content;

    }
    public InputStream getLogInputStream(String url) throws Exception {
        DefaultHttpClient httpclient = CreateHttpClient
                .createHttpClientConnection();
        HttpGet httpget = new HttpGet(url);
        httpget.setHeader("Cookie", auth);
        HttpResponse response = httpclient.execute(httpget);
        return response.getEntity().getContent();


    }

    public String signUp(String email) throws Exception {



        DefaultHttpClient httpclient = CreateHttpClient
                .createHttpClientConnection();
        HttpPost httppost = new HttpPost(ConfigProperties.SIGNUP);
        httppost.setHeader("Cookie", auth);
        List<BasicNameValuePair> nameValuePairs = new ArrayList<BasicNameValuePair>();
        nameValuePairs.add(new BasicNameValuePair("emailId",email));


        httppost.setEntity(new UrlEncodedFormEntity(nameValuePairs));

        HttpResponse response = httpclient.execute(httppost);
        System.out.println("ResponseCode: "
                + response.getStatusLine().getStatusCode());
        if(response.getStatusLine().getStatusCode() != 200){
            handleException(response);
        }

        JSONObject jsonReq = (JSONObject) JSONUnmarshaller.unmarshal(readResponse(response));
        return getContent(jsonReq, "$");

    }
    public String loginTarget() {
        return ConfigProperties.LOGINTARGET;
    }


    private List<CloudJeeApplication> parseResponse(JSONObject jsonObj){
        if(jsonObj == null) {
            throw new WMRuntimeException("Unable to read response from WaveMaker Cloud");
        }
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
                cls = Class.forName("com.wavemaker.tools.service.wavemakercloud.CloudJeeApplication");

                for (Object obj : objects) {
                    CloudJeeApplication app = (CloudJeeApplication) cls.newInstance();
                    HashMap<String, Object> map = (HashMap<String, Object>) obj;
                    for (String key : map.keySet()) {
                        Object value = map.get(key);
                        Method method = cls.getDeclaredMethod("set" + WordUtils.capitalize(key), value.getClass());
                        method.invoke(app, value);
                    }
                    apps.add(app);
                }

            } else if((block=(JSONObject) jsonObj.get("exceptionObject")) != null){
                throw new WMRuntimeException((String) block.get("cause"));
            }else if((block=(JSONObject) jsonObj.get("errors")) != null){
                throw new WMRuntimeException(getErrorMessage(block));
            }

            return apps;
        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }
    }

    private List<CloudJeeLog> parseLogsResponse(JSONObject jsonObj, String tenantName){
        if(jsonObj == null) {
            throw new WMRuntimeException("Unable to read response from WaveMaker Cloud");
        }
        List<CloudJeeLog> apps = new ArrayList<CloudJeeLog>();
        try {

            JSONObject block = (JSONObject) jsonObj.get("success");
            JSONObject body = null;
            if (block != null && (body = (JSONObject) block.get("body")) != null) {
                JSONArray objects = new JSONArray();

                if(((JSONArray) body.get("objects")) != null){
                    objects = (JSONArray) body.get("objects");
                }

                Class cls = null;
                cls = Class.forName("com.wavemaker.tools.service.wavemakercloud.CloudJeeLog");

                for (Object obj : objects) {
                    CloudJeeLog app = (CloudJeeLog) cls.newInstance();
                    HashMap<String, Object> map = (HashMap<String, Object>) obj;
                    for (String key : map.keySet()) {
                        Object value = map.get(key);
                        Method method = cls.getDeclaredMethod("set" + WordUtils.capitalize(key), value.getClass());
                        if(key.equalsIgnoreCase("fileName")){
                            String logfileUrl = ConfigProperties.LOGFILE.replaceAll(ConfigProperties.TENANT_NAME, tenantName).replaceAll(ConfigProperties.LOG_FILE_NAME, (String) value);
                            app.setUrl(logfileUrl);
                        }
                        method.invoke(app, value);
                    }


                    apps.add(app);
                }
            }else if((block=(JSONObject) jsonObj.get("exceptionObject")) != null){
                throw new WMRuntimeException((String) block.get("cause"));
            }else if((block=(JSONObject) jsonObj.get("errors")) != null){
                throw new WMRuntimeException(getErrorMessage(block));
            }

            return apps;
        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }
    }

   private String getErrorMessage(JSONObject block){
       JSONArray errors =  (JSONArray) block.get("error");
       String content="";
       for(int i=0; i < errors.size(); i++){
           JSONObject errObj = (JSONObject)errors.get(i);
           String msg = null;
           if((msg = (String)errObj.get("message")) != null){
               content = content+"\n" + msg;
           }
       }
            return content;
   }
    private String getContent(JSONObject jsonObj, String keyName) {
        if(jsonObj == null) {
            throw new WMRuntimeException("Unable to read response from WaveMaker Cloud");
        }
        String content="";
        try {
            JSONObject block = (JSONObject) jsonObj.get("success");
            JSONObject body = null;
            if (block != null && (body = (JSONObject) block.get("body")) != null && keyName != null) {
                content = (String) body.get(keyName);
            } else if((block=(JSONObject) jsonObj.get("exceptionObject")) != null){
                content =  (String) block.get("cause");
            }else if((block=(JSONObject) jsonObj.get("errors")) != null){
                 content = content + "\n" + getErrorMessage(block);
            }

        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }
        return content;
    }
    private void handleErrors(JSONObject jsonObj) {
        if(jsonObj == null) {
            throw new WMRuntimeException("Unable to read response from WaveMaker Cloud");
        }
        String content="";
        try {
            JSONObject block = (JSONObject) jsonObj.get("success");
            if((block=(JSONObject) jsonObj.get("exceptionObject")) != null){
                content =  (String) block.get("cause");
            }else if((block=(JSONObject) jsonObj.get("errors")) != null){
                content = content + "\n" + getErrorMessage(block);
            }
           if(!StringUtils.isEmpty(content)){
               throw new WMRuntimeException(content);
           }

        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }

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

    private URI getURIFromString(String uri) {
        return UriBuilder.fromUri(uri).build();
    }


    private Client getClient() {
        ClientConfig config = new DefaultClientConfig();
        Client client = Client.create(config);
        if(isLoggingEnabled) {
            client.addFilter(new LoggingFilter(System.out));
        }
        return client;
    }

    private WebResource getResource(String url, String serviceName) {
        return getClient().resource(url).path(serviceName);
    }

    private WebResource getResource(String url, String serviceName,
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


    private String readResponse(HttpResponse response) throws IllegalStateException, IOException {
        BufferedReader rd = null;
        String responseOutput = "";
        try {
            rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
            String line;
            while ((line = rd.readLine()) != null) {
                responseOutput = responseOutput + line;
            }

        } finally {
            if (rd != null) {
                rd.close();
            }
        }
        return responseOutput;
    }

    private void handleException(HttpResponse response){
        if((response.getStatusLine().getStatusCode() == 401) && response.getFirstHeader(ERROR_TOKEN) != null)
        {
            throw new WMRuntimeException(response.getFirstHeader(ERROR_TOKEN).getValue());
        }
        throw new WMRuntimeException("Problem connecting to Server (response message: " + response.getStatusLine().getStatusCode() +" " +response.getStatusLine().getReasonPhrase() + " )");
    }

    private String getErrorMsg(List<String> errorList){
       String msg = "";
        for(String error : errorList){
            msg = msg + error + " ";
        }

        return msg.trim();

    }
}


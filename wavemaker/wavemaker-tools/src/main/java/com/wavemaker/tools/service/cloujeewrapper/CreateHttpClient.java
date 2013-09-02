package com.wavemaker.tools.service.cloujeewrapper;

import java.security.SecureRandom;
import java.security.cert.CertificateException;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.security.cert.X509Certificate;

import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.impl.client.DefaultHttpClient;

public class CreateHttpClient {
	
	
	public static DefaultHttpClient createHttpClientConnection() throws Exception{
		CreateHttpClient httpclient = new CreateHttpClient();
		return httpclient.httpClientTrustingAllSSLCerts();
	}
	
	private DefaultHttpClient httpClientTrustingAllSSLCerts() throws Exception {
        DefaultHttpClient httpclient = new DefaultHttpClient();

        SSLContext sc = SSLContext.getInstance("TLS");
	    sc.init(null, getTrustingManager(), new SecureRandom());

	    SSLSocketFactory ssf = new SSLSocketFactory(sc);
	    ssf.setHostnameVerifier(SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);
	    
        Scheme sch = new Scheme("https", 443, ssf);
        httpclient.getConnectionManager().getSchemeRegistry().register(sch);
        return httpclient;
    }

    private TrustManager[] getTrustingManager() throws Exception{
    	TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager(){
		    public java.security.cert.X509Certificate[] getAcceptedIssuers(){return null;}
		    public void checkClientTrusted(X509Certificate[] certs, String authType){}
		    public void checkServerTrusted(X509Certificate[] certs, String authType){}
			public void checkClientTrusted(
					java.security.cert.X509Certificate[] chain, String authType)
					throws CertificateException {
				// TODO Auto-generated method stub
				
			}
			public void checkServerTrusted(
					java.security.cert.X509Certificate[] chain, String authType)
					throws CertificateException {
				// TODO Auto-generated method stub
				
			}
		}};
        return trustAllCerts;
    }

}

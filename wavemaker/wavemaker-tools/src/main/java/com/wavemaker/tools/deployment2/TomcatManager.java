
package com.wavemaker.tools.deployment2;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;

import org.apache.commons.codec.binary.Base64;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequest;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.PerformantSimpleClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.http.converter.AbstractHttpMessageConverter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.wavemaker.tools.io.File;

/**
 * Calls a remote Tomcat manager to manipulate deployed application.
 * 
 * @author Phillip Webb
 */
public class TomcatManager {

    private final String host;

    private final int port;

    private final String managerPath;

    private final RestTemplate restTemplate;

    /**
     * Create a new {@link TomcatManager}.
     * 
     * @param host the remote host
     * @param port the remote port
     * @param username the username used to connect
     * @param password the password used to connect
     */
    public TomcatManager(String host, int port, String username, String password) {
        this(host, port, "manager", username, password);
    }

    /**
     * Create a new {@link TomcatManager}.
     * 
     * @param host the remote host
     * @param port the remote port
     * @param managerPath the path of the manager application
     * @param username the username used to connect
     * @param password the password used to connect
     */
    public TomcatManager(String host, int port, String managerPath, String username, String password) {
        Assert.notNull(host, "Host must not be null");
        Assert.notNull(managerPath, "ManagerPath must not be null");
        this.host = host;
        this.port = port;
        this.managerPath = managerPath;
        this.restTemplate = new RestTemplate();
        SimpleClientHttpRequestFactory requestFactory = new PerformantSimpleClientHttpRequestFactory();
        requestFactory.setBufferRequestBody(false);
        this.restTemplate.setRequestFactory(new AuthorizedClientHttpRequestFactory(requestFactory, username, password));
        this.restTemplate.getMessageConverters().add(0, new InputStreamMessageConverter());
    }

    /**
     * Deploy the given file to Tomcat. Any existing deployment at the specified context will be replaced.
     * 
     * @param context the context of the application to deploy
     * @param file the war file to deploy
     * @return the URL of the deployed application
     */
    public String deploy(String context, File file) {
        return deploy(context, file.getContent().asInputStream());
    }

    /**
     * Deploy the given file to Tomcat. Any existing deployment at the specified context will be replaced.
     * 
     * @param context the context of the application to deploy
     * @param inputStream a stream containing the war to deploy
     * @return the URL of the deployed application
     */
    public String deploy(String context, InputStream inputStream) {
        Assert.notNull(inputStream, "InputStream must not be null");
        try {
            this.restTemplate.getForObject(getUrl(context, Command.UNDEPLOY), Void.class);
        } catch (Exception e) {
        }
        this.restTemplate.put(getUrl(context, Command.DEPLOY), inputStream);
        return newUriBuilder().path(context).build().toUriString();
    }

    private String getUrl(String application, Command command) {
        if (!application.startsWith("/")) {
            application = "/" + application;
        }
        UriComponentsBuilder uri = newUriBuilder();
        uri.path(this.managerPath);
        uri.pathSegment(command.toString().toLowerCase());
        uri.queryParam("path", application);
        return uri.build().toUriString();
    }

    private UriComponentsBuilder newUriBuilder() {
        UriComponentsBuilder uri = UriComponentsBuilder.newInstance();
        uri.scheme("http");
        uri.host(this.host).port(this.port);
        return uri;
    }

    private static enum Command {
        DEPLOY, UNDEPLOY
    }

    /**
     * {@link ClientHttpRequestFactory} that adds basic authentication headers.
     */
    private static class AuthorizedClientHttpRequestFactory implements ClientHttpRequestFactory {

        private final ClientHttpRequestFactory delegate;

        private final String authorizationToken;

        public AuthorizedClientHttpRequestFactory(ClientHttpRequestFactory delegate, String username, String password) {
            Assert.notNull(delegate, "Delegate must not be null");
            Assert.notNull(username, "Username must not be null");
            Assert.notNull(password, "Password must not be null");
            this.delegate = delegate;
            String token = username + ":" + password;
            byte[] tokenBytes = new Base64().encode(token.getBytes());
            this.authorizationToken = "Basic " + new String(tokenBytes).trim();
        }

        @Override
        public ClientHttpRequest createRequest(URI uri, HttpMethod httpMethod) throws IOException {
            ClientHttpRequest request = this.delegate.createRequest(uri, httpMethod);
            request.getHeaders().add("Authorization", this.authorizationToken);
            request.getHeaders().add("User-Agent", "Catalina-Ant-Task/1.0");
            return request;
        }
    }

    /**
     * {@link HttpMessageConverter} to deal with input streams.
     */
    private static class InputStreamMessageConverter extends AbstractHttpMessageConverter<InputStream> {

        public InputStreamMessageConverter() {
            super(MediaType.ALL);
        }

        @Override
        protected boolean supports(Class<?> clazz) {
            return InputStream.class.isAssignableFrom(clazz);
        }

        @Override
        protected MediaType getDefaultContentType(InputStream inputMessage) throws IOException {
            return MediaType.APPLICATION_OCTET_STREAM;
        }

        @Override
        protected boolean canRead(MediaType mediaType) {
            return false;
        }

        @Override
        protected InputStream readInternal(Class<? extends InputStream> clazz, HttpInputMessage inputMessage) throws IOException,
            HttpMessageNotReadableException {
            return null;
        }

        @Override
        protected void writeInternal(InputStream inputStream, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
            FileCopyUtils.copy(inputStream, outputMessage.getBody());
            outputMessage.getBody().flush();
        }
    }

}

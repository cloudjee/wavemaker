
package com.wavemaker.tools.deployment.cloudfoundry;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.cloudfoundry.client.lib.InputStreamResourceWithName;
import org.cloudfoundry.client.lib.UploadStatusCallback;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.core.io.Resource;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.wavemaker.tools.project.Project;

public class StudioCloudFoundryClient extends CloudFoundryClient {

    public StudioCloudFoundryClient(String email, String password, String token, URL cloudControllerUrl, ClientHttpRequestFactory requestFactory) {
        super(email, password, token, cloudControllerUrl, requestFactory);
    }

    public StudioCloudFoundryClient(String email, String password, String token, URL cloudControllerUrl) {
        super(email, password, token, cloudControllerUrl);
    }

    public StudioCloudFoundryClient(String email, String password, String cloudControllerUrl) throws MalformedURLException {
        super(email, password, cloudControllerUrl);
    }

    public StudioCloudFoundryClient(String token, String cloudControllerUrl) throws MalformedURLException {
        super(token, cloudControllerUrl);
    }

    public StudioCloudFoundryClient(String cloudControllerUrl) throws MalformedURLException {
        super(cloudControllerUrl);
    }

    @SuppressWarnings("unchecked")
    public void uploadProject(String appName, Project project, UploadStatusCallback callback) throws IOException {
        Map<String, Resource> webAppFiles = project.getWebAppFilesForDeployment();
        List<Map<String, Object>> matchedResources = this.restTemplate.postForObject(getCloudControllerUrl() + "/" + "resources",
            generateResourcePayload(webAppFiles), List.class);

        if (callback != null) {
            callback.onCheckResources();
        }

        Set<String> matchedFileNames = new HashSet<String>();
        for (Map<String, Object> entry : matchedResources) {
            matchedFileNames.add((String) entry.get("fn"));
        }
        if (callback != null) {
            callback.onMatchedFileNames(matchedFileNames);
        }

        long warFileLength;
        byte[] incrementalUpload = processMatchedResources(webAppFiles, matchedFileNames);
        if (callback != null) {
            callback.onProcessMatchedResources(incrementalUpload.length);
        }

        ObjectMapper objectMapper = new ObjectMapper();
        StringWriter writer = new StringWriter();
        objectMapper.writeValue(writer, matchedResources);
        String resources = writer.toString();
        InputStream warFileStream = new ByteArrayInputStream(incrementalUpload);
        warFileLength = incrementalUpload.length;

        this.restTemplate.put(
            getCloudControllerUrl() + "/apps/{appName}/application",
            generatePartialResourcePayload(new InputStreamResourceWithName(warFileStream, warFileLength, project.getProjectName() + ".war"),
                resources), appName);
    }

    private byte[] processMatchedResources(Map<String, Resource> webapp, Set<String> matchedFileNames) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ZipOutputStream zout = new ZipOutputStream(out);
        boolean entryAdded = false;
        for (Entry<String, Resource> webappFile : webapp.entrySet()) {
            if (!matchedFileNames.contains(webappFile.getKey())) {
                zout.putNextEntry(new ZipEntry(webappFile.getKey()));
                InputStream in = webappFile.getValue().getInputStream();
                byte[] buffer = new byte[16 * 1024];
                while (true) {
                    int read = in.read(buffer);
                    if (read == -1) {
                        break;
                    }
                    zout.write(buffer, 0, read);
                }
                in.close();
                zout.closeEntry();
                entryAdded = true;
            }
        }

        if (!entryAdded) {
            // Ensure we've always got something to send
            zout.putNextEntry(new ZipEntry("WEB-INF/"));
        }

        zout.close();
        return out.toByteArray();
    }

    private MultiValueMap<String, ?> generatePartialResourcePayload(Resource application, String resources) {
        MultiValueMap<String, Object> payload = new LinkedMultiValueMap<String, Object>(2);
        payload.add("application", application);
        if (resources != null) {
            payload.add("resources", resources);
        }
        return payload;
    }

    private List<Map<String, Object>> generateResourcePayload(Map<String, Resource> webAppFiles) throws IOException {
        List<Map<String, Object>> payload = new ArrayList<Map<String, Object>>();
        for (Entry<String, Resource> file : webAppFiles.entrySet()) {
            String sha1sum = computeSha1Digest(file.getValue().getInputStream());
            Map<String, Object> entryPayload = new HashMap<String, Object>();
            entryPayload.put("size", file.getValue().contentLength());
            entryPayload.put("sha1", sha1sum);
            entryPayload.put("fn", file.getKey());
            payload.add(entryPayload);
        }

        // Add in the files from studio

        return payload;
    }

    private String computeSha1Digest(InputStream in) throws IOException {
        MessageDigest digest;
        try {
            digest = MessageDigest.getInstance("SHA-1");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }

        byte[] buffer = new byte[16 * 1024];
        while (true) {
            int read = in.read(buffer);
            if (read == -1) {
                break;
            }
            digest.update(buffer, 0, read);
        }
        in.close();
        return bytesToHex(digest.digest());
    }

    private static final String HEX_CHARS = "0123456789ABCDEF";

    private static String bytesToHex(byte[] bytes) {
        if (bytes == null) {
            return null;
        }
        final StringBuilder hex = new StringBuilder(2 * bytes.length);
        for (final byte b : bytes) {
            hex.append(HEX_CHARS.charAt((b & 0xF0) >> 4)).append(HEX_CHARS.charAt(b & 0x0F));
        }
        return hex.toString();
    }

}

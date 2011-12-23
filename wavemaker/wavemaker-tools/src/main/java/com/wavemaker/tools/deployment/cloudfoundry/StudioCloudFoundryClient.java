
package com.wavemaker.tools.deployment.cloudfoundry;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.cloudfoundry.client.lib.InputStreamResourceWithName;
import org.cloudfoundry.client.lib.UploadStatusCallback;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.core.io.Resource;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.wavemaker.json.JSON;
import com.wavemaker.json.JSONMarshaller;
import com.wavemaker.json.JSONState;
import com.wavemaker.json.JSONUnmarshaller;
import com.wavemaker.tools.deployment.cloudfoundry.LoggingStatusCallback.Timer;
import com.wavemaker.tools.project.Project;

public class StudioCloudFoundryClient extends CloudFoundryClient {

    private static final Log log = LogFactory.getLog(StudioCloudFoundryClient.class);

    private final WebAppAssembler webAppAssembler;

    public StudioCloudFoundryClient(String token, String url, WebAppAssembler webAppAssembler) throws MalformedURLException {
        super(token, url);
        this.webAppAssembler = webAppAssembler;
    }

    public StudioCloudFoundryClient(String testUserEmail, String testUserPass, String token, URL url, WebAppAssembler webAppAssembler) {
        super(testUserEmail, testUserPass, token, url);
        this.webAppAssembler = webAppAssembler;
    }

    @SuppressWarnings("unchecked")
    public void uploadProject(String appName, Project project, UploadStatusCallback callback) throws IOException {
        log.info("Assembling web application for deployment.");
        Timer webAppTimer = new Timer();
        webAppTimer.start();
        Map<String, Resource> webAppFiles = this.webAppAssembler.getWebAppFilesForDeployment(project);
        log.info("Web app assembled in " + webAppTimer.stop() + "ms");
        List<Map<String, Object>> resourcePayload = this.webAppAssembler.generateResourcePayload(webAppFiles);
        webAppFiles.putAll(this.webAppAssembler.getSharedStudioFiles());
        resourcePayload.addAll(this.webAppAssembler.getStudioHashes());
        List<Map<String, Object>> matchedResources = getRestTemplate().postForObject(getCloudControllerUrl() + "/" + "resources", resourcePayload,
            List.class);

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

        getRestTemplate().put(
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
                if (log.isDebugEnabled()) {
                    log.debug("Adding file: " + webappFile.getKey() + " to virtual WAR");
                }
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

    private MultiValueMap<String, ?> generatePartialResourcePayload(Resource application, String resources) throws IOException {
        MultiValueMap<String, Object> payload = new LinkedMultiValueMap<String, Object>(2);
        payload.add("application", application);
        if (resources != null) {
            if (log.isDebugEnabled()) {
                log.debug("Sending cached resources: ");
                JSON resourcesJson = JSONUnmarshaller.unmarshal(resources);
                String prettyResources = JSONMarshaller.marshal(resourcesJson, new JSONState(), false, true);
                log.debug(prettyResources);
            }
            payload.add("resources", resources);
        }
        return payload;
    }
}


package com.wavemaker.tools.deployment.cloudfoundry;

import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.deployment.cloudfoundry.LoggingStatusCallback.Timer;
import com.wavemaker.tools.project.Project;
import com.wavemaker.tools.project.ResourceFilter;
import com.wavemaker.tools.project.StudioConfiguration;

public class WebAppAssembler implements InitializingBean {

    private static final Log log = LogFactory.getLog(WebAppAssembler.class);

    private StudioConfiguration studioConfiguration;

    private Map<String, Resource> studioWebAppFiles;

    private Future<List<Map<String, Object>>> studioHashes;

    @Override
    public void afterPropertiesSet() throws Exception {
        this.studioWebAppFiles = new HashMap<String, Resource>();

        final String studioBasePath = this.studioConfiguration.getPath(this.studioConfiguration.getStudioWebAppRoot());

        try {
            collectFiles(this.studioWebAppFiles, studioBasePath, this.studioConfiguration.getStudioWebAppRoot().createRelative("images/"));
            collectFiles(this.studioWebAppFiles, studioBasePath, this.studioConfiguration.getStudioWebAppRoot().createRelative("WEB-INF/lib/"));
            collectFiles(this.studioWebAppFiles, studioBasePath, this.studioConfiguration.getStudioWebAppRoot().createRelative("lib/"),
                new ResourceFilter() {

                    @Override
                    public boolean accept(Resource resource) {
                        String path = WebAppAssembler.this.studioConfiguration.getPath(resource).replace(studioBasePath, "");
                        if (path.startsWith("wm/common/") || path.startsWith("dojo/utils/") || path.startsWith("dojo/") && path.contains("tests/")) {
                            return false;
                        }
                        return true;
                    }
                });
            collectFiles(this.studioWebAppFiles, this.studioConfiguration.getPath(this.studioConfiguration.getCommonDir()),
                this.studioConfiguration.getCommonDir(), null, "lib/wm/common/");

            ExecutorService executor = Executors.newSingleThreadExecutor();
            this.studioHashes = executor.submit(new StudioHashCalculator());
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }
    }

    public Map<String, Resource> getWebAppFilesForDeployment(Project project) {
        Map<String, Resource> projectWebAppFiles = new HashMap<String, Resource>();

        try {

            String projectBasePath = this.studioConfiguration.getPath(project.getWebAppRoot());
            collectFiles(projectWebAppFiles, projectBasePath, project.getWebAppRoot());
            // projectWebAppFiles.add("WEB-INF/web.xml", new ClassPathResource(""));
        } catch (IOException e) {
            throw new WMRuntimeException(e);
        }

        return projectWebAppFiles;
    }

    public Map<String, Resource> getSharedStudioFiles() {
        return this.studioWebAppFiles;
    }

    public List<Map<String, Object>> getStudioHashes() {
        try {
            return this.studioHashes.get();
        } catch (Exception e) {
            throw new WMRuntimeException(e);
        }
    }

    public void setStudioConfiguration(StudioConfiguration studioConfiguration) {
        this.studioConfiguration = studioConfiguration;
    }

    private void collectFiles(Map<String, Resource> files, String basePath, Resource root) throws IOException {
        collectFiles(files, basePath, root, null);
    }

    private void collectFiles(Map<String, Resource> files, String basePath, Resource root, ResourceFilter filter) throws IOException {
        collectFiles(files, basePath, root, filter, "");
    }

    private void collectFiles(Map<String, Resource> files, String basePath, Resource root, ResourceFilter filter, String newPath) throws IOException {
        List<Resource> children;
        if (filter == null) {
            children = this.studioConfiguration.listChildren(root);
        } else {
            children = this.studioConfiguration.listChildren(root, filter);
        }
        for (Resource child : children) {
            if (this.studioConfiguration.isDirectory(child)) {
                collectFiles(files, basePath, child, filter);
            } else {
                files.put(newPath + this.studioConfiguration.getPath(child).replace(basePath, ""), child);
            }
        }
    }

    public List<Map<String, Object>> generateResourcePayload(Map<String, Resource> webAppFiles) throws IOException {
        Timer fingerPrintTimer = new Timer();
        fingerPrintTimer.start();
        List<Map<String, Object>> payload = new ArrayList<Map<String, Object>>();
        for (Entry<String, Resource> file : webAppFiles.entrySet()) {
            String sha1sum = computeSha1Digest(file.getValue().getInputStream());
            Map<String, Object> entryPayload = new HashMap<String, Object>();
            entryPayload.put("size", file.getValue().contentLength());
            entryPayload.put("sha1", sha1sum);
            entryPayload.put("fn", file.getKey());
            payload.add(entryPayload);
        }
        log.info("Web app hashes calculated in " + fingerPrintTimer.stop() + "ms");

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

    private final class StudioHashCalculator implements Callable<List<Map<String, Object>>> {

        @Override
        public List<Map<String, Object>> call() throws Exception {
            return generateResourcePayload(WebAppAssembler.this.studioWebAppFiles);
        }

    }

}

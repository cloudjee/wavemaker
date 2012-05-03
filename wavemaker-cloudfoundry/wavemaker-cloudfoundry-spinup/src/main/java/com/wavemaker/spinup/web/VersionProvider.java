
package com.wavemaker.spinup.web;

import java.io.IOException;
import java.io.InputStream;
import java.util.jar.Manifest;

import javax.servlet.ServletContext;

import org.springframework.stereotype.Component;
import org.springframework.web.context.support.ServletContextResource;

@Component
public class VersionProvider {

    public String getVersion(ServletContext servletContext) throws IOException {
        ServletContextResource manifestResource = new ServletContextResource(servletContext, "/META-INF/MANIFEST.MF");
        InputStream manifestStream = manifestResource.getInputStream();
        try {
            Manifest manifest = new Manifest(manifestStream);
            return manifest.getMainAttributes().getValue("Implementation-Version");
        } finally {
            manifestStream.close();
        }
    }
}


package com.wavemaker.spinup.web;

import java.io.File;
import java.io.IOException;

import javax.servlet.ServletContext;

import org.cloudfoundry.client.lib.archive.ApplicationArchive;
import org.cloudfoundry.client.lib.archive.DirectoryApplicationArchive;
import org.springframework.web.context.ServletContextAware;
import org.springframework.web.context.support.ServletContextResource;

import com.wavemaker.spinup.ApplicationArchiveFactory;

/**
 * {@link ApplicationArchiveFactory} used to deploy self, use for testing only.
 */
// @Component
public class SelfApplicationArchiveFactory implements ApplicationArchiveFactory, ServletContextAware {

    private File root;

    @Override
    public void setServletContext(ServletContext servletContext) {
        try {
            ServletContextResource rootResource = new ServletContextResource(servletContext, "/");
            this.root = rootResource.getFile();
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }

    @Override
    public ApplicationArchive getArchive() throws Exception {
        return new DirectoryApplicationArchive(this.root);
    }

    @Override
    public void closeArchive(ApplicationArchive archive) throws Exception {
    }
}


package org.cloudfoundry.spinup.web;

import java.io.File;
import java.io.IOException;

import javax.servlet.ServletContext;

import org.cloudfoundry.client.lib.archive.ApplicationArchive;
import org.cloudfoundry.client.lib.archive.DirectoryApplicationArchive;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.stereotype.Component;
import org.springframework.web.context.ServletContextAware;
import org.springframework.web.context.support.ServletContextResource;

@Component
public class SelfApplicationArchiveFactory implements FactoryBean<ApplicationArchive>, ServletContextAware {

    private File root;

    @Override
    public ApplicationArchive getObject() throws Exception {
        return new DirectoryApplicationArchive(this.root);
    }

    @Override
    public Class<?> getObjectType() {
        return ApplicationArchive.class;
    }

    @Override
    public boolean isSingleton() {
        return true;
    }

    @Override
    public void setServletContext(ServletContext servletContext) {
        try {
            this.root = new ServletContextResource(servletContext, "/").getFile();
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }
}

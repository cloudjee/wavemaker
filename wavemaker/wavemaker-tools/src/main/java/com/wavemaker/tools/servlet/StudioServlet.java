
package com.wavemaker.tools.servlet;

import org.apache.catalina.Wrapper;
import org.springframework.context.ApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import com.wavemaker.runtime.service.annotations.HideFromClient;

@HideFromClient
public class StudioServlet extends DispatcherServlet {

    // FIXME should be implements ContainerServlet when ant has gone

    private static final long serialVersionUID = 1L;

    private Wrapper wrapper;

    @Override
    protected void onRefresh(ApplicationContext context) {
        super.onRefresh(context);
        // context.publishEvent(new TomcatWrapperRefreshEvent(this.wrapper));
    }

    // @Override
    // public Wrapper getWrapper() {
    // return this.wrapper;
    // }
    //
    // @Override
    // public void setWrapper(Wrapper wrapper) {
    // this.wrapper = wrapper;
    // }

}

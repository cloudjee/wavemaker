
package com.wavemaker.tools.servlet;

import org.apache.catalina.Wrapper;
import org.springframework.context.ApplicationEvent;

public class TomcatWrapperRefreshEvent extends ApplicationEvent {

    private static final long serialVersionUID = 1L;

    public TomcatWrapperRefreshEvent(Wrapper source) {
        super(source);
    }

    @Override
    public Wrapper getSource() {
        return (Wrapper) super.getSource();
    }
}

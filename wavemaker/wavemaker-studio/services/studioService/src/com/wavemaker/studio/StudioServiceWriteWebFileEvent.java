
package com.wavemaker.studio;

import org.springframework.context.ApplicationEvent;

/**
 * {@link ApplicationEvent} published from the {@link StudioService} when the
 * {@link StudioService#writeWebFile(String, String, boolean)} method is called.
 * 
 * @author Phillip Webb
 */
public class StudioServiceWriteWebFileEvent extends ApplicationEvent {

    private static final long serialVersionUID = 1L;

    private final String path;

    private final String data;

    private final boolean clobber;

    public StudioServiceWriteWebFileEvent(StudioService source, String path, String data, boolean clobber) {
        super(source);
        this.path = path;
        this.data = data;
        this.clobber = clobber;
    }

    @Override
    public StudioService getSource() {
        return (StudioService) super.getSource();
    }

    public String getPath() {
        return this.path;
    }

    public String getData() {
        return this.data;
    }

    public boolean canClobber() {
        return this.clobber;
    }
}

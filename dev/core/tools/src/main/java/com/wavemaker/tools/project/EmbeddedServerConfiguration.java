package com.wavemaker.tools.project;

import org.springframework.core.io.Resource;

public interface EmbeddedServerConfiguration extends StudioConfiguration {
	
	public abstract Resource getTomcatHome();
	
	public abstract Resource getProjectLogsFolder();
}

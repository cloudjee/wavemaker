
package com.wavemaker.tools.project;

import org.springframework.core.io.Resource;

public interface EmbeddedServerConfiguration extends StudioConfiguration {

    Resource getTomcatHome();

    Resource getProjectLogsFolder();
}

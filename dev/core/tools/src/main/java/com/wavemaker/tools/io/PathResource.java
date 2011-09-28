package com.wavemaker.tools.io;

import org.springframework.core.io.ContextResource;

public interface PathResource extends ContextResource {
	
	public abstract PathResource getParent();
	
	public abstract void create();
}

package com.wavemaker.tools.compiler;

import java.security.SecureClassLoader;

import org.springframework.core.io.Resource;

public class ResourceClassLoader extends SecureClassLoader {

	private Resource rootPath;
	
	ResourceClassLoader(Resource rootPath) {
		this.rootPath = rootPath;
	}
	
	@Override
	protected Class<?> findClass(String name) throws ClassNotFoundException {
		
		return super.findClass(name);
	}

	
}

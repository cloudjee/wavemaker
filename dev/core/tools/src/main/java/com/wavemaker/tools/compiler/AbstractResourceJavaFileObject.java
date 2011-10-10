package com.wavemaker.tools.compiler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.io.Writer;
import java.net.URI;

import javax.tools.SimpleJavaFileObject;

import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.tools.project.Project;

public abstract class AbstractResourceJavaFileObject extends SimpleJavaFileObject {
	
	protected Project project;
	
	protected Resource resource;
	
	protected AbstractResourceJavaFileObject(Kind kind, Project project, Resource resource) throws IOException {
		super(resource.getURI(), kind);
		this.project = project;
		this.resource = resource;
	}

	/**
	* Returns the source text content of the Java resource.
	*/
	public CharSequence getCharContent(boolean ignoreEncodingErrors) {
	    try {
			return project.readFile(resource);
		} catch (IOException e) {
			throw new WMRuntimeException(e);
		}
	}

	public boolean delete() {
		try {
			return project.deleteFile(resource);
		} catch (IOException e) {
			return false;
		}
	}

	public long getLastModified() {
		try {
			return resource.lastModified();
		} catch (IOException e) {
			throw new WMRuntimeException(e);
		}
	}

	public InputStream openInputStream() throws IOException {
		return resource.getInputStream();
	}

	public OutputStream openOutputStream() throws IOException {
		return project.getOutputStream(resource);
	}

	public Reader openReader(boolean ignoreEncodingErrors) throws IOException {
		return project.getReader(resource);
	}

	public Writer openWriter() throws IOException {
		return project.getWriter(resource);
	}

	public URI toUri() {
		try {
			return resource.getURI();
		} catch (IOException e) {
			throw new WMRuntimeException(e);
		}
	}

}

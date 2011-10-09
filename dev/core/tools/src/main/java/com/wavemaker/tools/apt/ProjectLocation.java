package com.wavemaker.tools.apt;

import javax.tools.JavaFileManager;

public enum ProjectLocation implements JavaFileManager.Location {
	PROJECT_ROOT;
	
	public String getName() {
		return toString();
	}

	public boolean isOutputLocation() {
		return false;
	}

}

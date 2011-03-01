/*
 *  Copyright (C) 2008-2011 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.tools.service;

import java.io.File;

import com.wavemaker.tools.util.AntUtils;

/**
 * @author Simon Toens
 * @version $Rev$ - $Date$
 *
 */
public class DefaultCompileService implements CompileService {
    
    private final File srcdir;
    private final File destdir;
    
    public DefaultCompileService(File srcdir) {
        this(srcdir, srcdir);
    }
    
    
    public DefaultCompileService(File srcdir, File destdir) {
        this.srcdir = srcdir;
        this.destdir = destdir;
    }

    public void compile(boolean clean) {
        AntUtils.javac(srcdir.getAbsolutePath(), destdir);


	if (System.getProperty("os.name").equalsIgnoreCase("linux")) {
	    // workaround linux race condition
	    try {
		Thread.sleep(1000);
	    } catch (InterruptedException ignore) {}
	}
    }

}

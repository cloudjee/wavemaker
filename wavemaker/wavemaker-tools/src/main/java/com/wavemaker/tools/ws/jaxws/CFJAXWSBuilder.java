/*
 *  Copyright (C) 2008-2011 VMware, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.tools.ws.jaxws;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.tools.ant.types.FileSet;

import com.sun.tools.ws.ant.WsImport2;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.filesystem.FileSystemFolder;
import com.wavemaker.tools.io.filesystem.local.LocalFileSystem;
import com.wavemaker.tools.service.codegen.GenerationException;
import com.wavemaker.tools.ws.wsdl.WSDL;

/**
 * Created to pre/post actions for Cloud Foundry
 * 
 * @author Seung Lee
 */
public class CFJAXWSBuilder extends JAXWSBuilder {

    public CFJAXWSBuilder(WSDL wsdl, Folder outputSrcDir, Folder outputClassDir) {
        super(wsdl, outputSrcDir, outputClassDir);
    }

    @Override
    protected void createTempOutputDirs() {
        try {
            this.tempOutputSrcDir = IOUtils.createTempDirectory("outputSrc_directory", null);
            this.tempOutputClassDir = IOUtils.createTempDirectory("outputClass_directory", null);
            this.tempjaxwsDir = IOUtils.createTempDirectory("jaxws_directory", null);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    @Override
    protected void setOutputDir(WsImport2 wsImport) {
        wsImport.setSourcedestdir(this.tempOutputSrcDir);
        wsImport.setDestdir(this.tempOutputClassDir);
    }

    @Override
    protected void setConfigBinding(WsImport2 wsImport, com.wavemaker.tools.io.File jaxwsBindingFile,
        List<com.wavemaker.tools.io.File> jaxbBindingFiles) throws GenerationException {
        File tmpBindingFile = new File(this.tempjaxwsDir, jaxwsBindingFile.getName());
        FileOutputStream fos;
        try {
            fos = new FileOutputStream(tmpBindingFile);
            jaxwsBindingFile.getContent().copyTo(fos);
            fos.close();
        } catch (IOException ex) {
            throw new GenerationException(ex);
        }

        FileSet fs = new FileSet();
        fs.setFile(tmpBindingFile);
        wsImport.addConfiguredBinding(fs);

        // set JAXB bindings
        for (com.wavemaker.tools.io.File jaxbBindingFile : jaxbBindingFiles) {
            tmpBindingFile = new File(this.tempjaxwsDir, jaxbBindingFile.getName());
            try {
                fos = new FileOutputStream(tmpBindingFile);
                jaxwsBindingFile.getContent().copyTo(fos);
                fos.close();
            } catch (IOException ex) {
                throw new GenerationException(ex);
            }
            fs = new FileSet();
            fs.setFile(tmpBindingFile);
            wsImport.addConfiguredBinding(fs);
        }
    }

    @Override
    protected void copyToFinalDest() {
        LocalFileSystem fileSystem = new LocalFileSystem(this.tempOutputSrcDir);
        Folder folder = FileSystemFolder.getRoot(fileSystem);
        folder.copyContentsTo(this.outputSrcDir);

        fileSystem = new LocalFileSystem(this.tempOutputClassDir);
        folder = FileSystemFolder.getRoot(fileSystem);
        folder.copyTo(this.outputClassDir);
    }
}
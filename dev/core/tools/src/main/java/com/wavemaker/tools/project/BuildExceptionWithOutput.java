/*
 *  Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
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

package com.wavemaker.tools.project;

import org.apache.tools.ant.BuildException;

/**
 * Adds a compilerOutput field to ant's BuildException.
 * 
 * @author small
 * @version $Rev$ - $Date$
 */
public class BuildExceptionWithOutput extends BuildException {

    private static final long serialVersionUID = 1L;

    private String compilerOutput;

    /**
     * Constructs a build exception with no descriptive information.
     */
    public BuildExceptionWithOutput() {
        super();
    }

    /**
     * Constructs an exception with the given descriptive message.
     * 
     * @param message
     *                A description of or information about the exception.
     *                Should not be <code>null</code>.
     */
    public BuildExceptionWithOutput(String message) {
        super(message);
    }

    /**
     * Constructs an exception with the given descriptive message.
     * 
     * @param message
     *                A description of or information about the exception.
     *                Should not be <code>null</code>.
     */
    public BuildExceptionWithOutput(String message, String compilerOutput) {
        super(message);
        this.compilerOutput = compilerOutput;
    }

    /**
     * Constructs an exception with the given message and exception as a root
     * cause.
     * 
     * @param message
     *                A description of or information about the exception.
     *                Should not be <code>null</code> unless a cause is
     *                specified.
     * @param cause
     *                The exception that might have caused this one. May be
     *                <code>null</code>.
     */
    public BuildExceptionWithOutput(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * Constructs an exception with the given message and exception as a root
     * cause.
     * 
     * @param message
     *                A description of or information about the exception.
     *                Should not be <code>null</code> unless a cause is
     *                specified.
     * @param cause
     *                The exception that might have caused this one. May be
     *                <code>null</code>.
     */
    public BuildExceptionWithOutput(String message, String compilerOutput,
            Throwable cause) {
        super(message, cause);
        this.compilerOutput = compilerOutput;
    }

    public String getCompilerOutput() {
        return this.compilerOutput;
    }

    public void setCompilerOutput(String compilerOutput) {
        this.compilerOutput = compilerOutput;
    }
}
/**
 * Classes to allow the {@link javax.tools.JavaCompiler} to work with {@link com.wavemaker.tools.io.Resource}s. 
 * NOTE: These classes are not yet being used internally with Wavemaker, this is due to the fact that we must
 * use the Eclipse Compiler so that running on a JRE is possible (CloudFoundry has no JDK) and the Eclipse compiler
 * is not 100% JSR 199 complaint because it expects {@link java.io.File}s. 
 */

package com.wavemaker.tools.io.compiler;


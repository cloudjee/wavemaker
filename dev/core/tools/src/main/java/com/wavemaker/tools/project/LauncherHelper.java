/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import org.apache.commons.io.FileUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import com.wavemaker.common.ResourceManager;
import com.wavemaker.common.util.SpringUtils;

/**
 * Helper methods for the launcher.
 * 
 * @author Matt Small
 */
public class LauncherHelper {

    /**
     * Invoke a method. It's expected that the ClassLoader cl will be the same as the context classloader, or else the
     * Spring init will likely fail (or otherwise be bad).
     */
    public static Object invoke(ClassLoader cl, String fqClass, String methodName, Class<?>[] argTypes, Object[] args, boolean isStatic)
        throws ClassNotFoundException, SecurityException, NoSuchMethodException, InstantiationException, IllegalAccessException,
        IllegalArgumentException, InvocationTargetException {

        if (null == ResourceManager.getInstance()) {
            SpringUtils.initSpringConfig();
        }

        Class<?> klass = cl.loadClass(fqClass);
        Method m = klass.getMethod(methodName, argTypes);

        Object o;
        if (isStatic) {
            o = null;
        } else {
            o = klass.newInstance();
        }

        return m.invoke(o, args);
    }

    public static boolean isStudioUpgrade() throws IOException {

        VersionInfo viRegistered = LocalStudioConfiguration.getRegisteredVersionInfo();
        VersionInfo viCurrent = LocalStudioConfiguration.getCurrentVersionInfo();

        return viRegistered.compareTo(viCurrent) < 0;
    }

    public static boolean isMajorUpgrade() throws IOException {

        if (isStudioUpgrade()) {
            VersionInfo viRegistered = LocalStudioConfiguration.getRegisteredVersionInfo();
            VersionInfo viCurrent = LocalStudioConfiguration.getCurrentVersionInfo();

            if (viRegistered.getMajor() < viCurrent.getMajor()) {
                return true;
            }
        }

        return false;
    }

    public static void doUpgrade(Resource waveMakerHome) throws IOException {

        VersionInfo vi = LocalStudioConfiguration.getCurrentVersionInfo();
        LocalStudioConfiguration.setRegisteredVersionInfo(vi);

        Resource oldWMHome = LocalStudioConfiguration.staticGetWaveMakerHome();
        if (0 != oldWMHome.getFile().compareTo(waveMakerHome.getFile())) {
            FileUtils.copyDirectory(oldWMHome.getFile(), waveMakerHome.getFile());
            LocalStudioConfiguration.setWaveMakerHome(waveMakerHome);
        }
    }

    public static String getCurrentVersionString() throws IOException {
        return LocalStudioConfiguration.getCurrentVersionInfo().toString();
    }

    public static String getNewDefaultWMHome() throws IOException {
        FileSystemResource oldDefault = (FileSystemResource) LocalStudioConfiguration.getDefaultWaveMakerHome();
        return oldDefault.getFile().getAbsolutePath() + " " + getCurrentVersionString();
    }
}
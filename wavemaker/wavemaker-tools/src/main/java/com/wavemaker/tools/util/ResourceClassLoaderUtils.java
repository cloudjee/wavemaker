
package com.wavemaker.tools.util;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.security.AccessController;
import java.security.PrivilegedAction;
import java.util.concurrent.Callable;

import org.springframework.core.io.Resource;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.io.GFSResource;
import com.wavemaker.common.util.ClassLoaderUtils;

/**
 * Class Loader Utils specifically designed to work with {@link Resource}s. Migrated from {@link ClassLoaderUtils} in
 * the common project for dependency reasons.
 */
public class ResourceClassLoaderUtils {

    public static ClassLoader getClassLoaderForResources(Resource... resources) {
        return getClassLoaderForResources(ClassLoaderUtils.getClassLoader(), resources);
    }

    public static ClassLoader getClassLoaderForResources(ClassLoader parent, Resource... resources) {
        if (resources[0] instanceof GFSResource) {
            return getClassLoaderForCFResources(parent, resources);
        }
        try {
            final ClassLoader parentF = parent;
            final URL[] urls = new URL[resources.length];
            for (int i = 0; i < resources.length; i++) {
                urls[i] = resources[i].getURI().toURL();
            }

            URLClassLoader ret = AccessController.doPrivileged(new PrivilegedAction<URLClassLoader>() {

                @Override
                public URLClassLoader run() {
                    return new URLClassLoader(urls, parentF);
                }
            });
            return ret;
        } catch (MalformedURLException ex) {
            throw new AssertionError(ex);
        } catch (IOException ex) {
            throw new WMRuntimeException(ex);
        }
    }

    private static ClassLoader getClassLoaderForCFResources(ClassLoader parent, final Resource[] resources) {
        final ClassLoader parentF = parent;

        CFClassLoader ret = AccessController.doPrivileged(new PrivilegedAction<CFClassLoader>() {

            @Override
            public CFClassLoader run() {
                return new CFClassLoader(resources, parentF);
            }
        });
        return ret;
    }

    public static void runInClassLoaderContext(Runnable runnable, Resource... resources) {
        runInClassLoaderContext(asCallable(runnable), getClassLoaderForResources(resources));
    }

    public static <V> V runInClassLoaderContext(Callable<V> callable, Resource... files) {
        return runInClassLoaderContext(callable, getClassLoaderForResources(files));
    }

    public static void runInClassLoaderContext(Runnable runnable, ClassLoader cl) {
        runInClassLoaderContext(asCallable(runnable), cl);
    }

    public static <V> V runInClassLoaderContext(Callable<V> task, ClassLoader cl) {
        ClassLoader c = Thread.currentThread().getContextClassLoader();
        try {
            Thread.currentThread().setContextClassLoader(cl);
            return task.call();
        } catch (Exception e) {
            if (e instanceof RuntimeException) {
                throw (RuntimeException) e;
            }
            throw new IllegalStateException(e);
        } finally {
            Thread.currentThread().setContextClassLoader(c);
        }
    }

    private static Callable<Object> asCallable(final Runnable runnable) {
        return new Callable<Object>() {

            @Override
            public Object call() throws Exception {
                runnable.run();
                return null;
            }
        };
    }

}

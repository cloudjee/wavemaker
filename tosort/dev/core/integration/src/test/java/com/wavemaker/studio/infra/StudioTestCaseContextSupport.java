
package com.wavemaker.studio.infra;

import org.springframework.core.io.support.ResourcePatternUtils;
import org.springframework.util.ClassUtils;
import org.springframework.util.ResourceUtils;
import org.springframework.util.StringUtils;

import com.wavemaker.runtime.test.SpringTestCaseContextSupport;

public class StudioTestCaseContextSupport extends SpringTestCaseContextSupport {

    private static final String SLASH = "/";

    private static final String WEBAPP_PREFIX = "webapp:";

    @Override
    protected String[] modifyLocations(Class<?> clazz, String... locations) {
        String[] modifiedLocations = new String[locations.length];
        for (int i = 0; i < locations.length; i++) {
            String path = locations[i];
            if (path.startsWith(WEBAPP_PREFIX)) {
                modifiedLocations[i] = path.replaceFirst(WEBAPP_PREFIX, "");
            } else if (path.startsWith(SLASH)) {
                modifiedLocations[i] = ResourceUtils.CLASSPATH_URL_PREFIX + path;
            } else if (!ResourcePatternUtils.isUrl(path)) {
                modifiedLocations[i] = ResourceUtils.CLASSPATH_URL_PREFIX + SLASH
                    + StringUtils.cleanPath(ClassUtils.classPackageAsResourcePath(clazz) + SLASH + path);
            } else {
                modifiedLocations[i] = StringUtils.cleanPath(path);
            }
        }
        return modifiedLocations;
    }

}

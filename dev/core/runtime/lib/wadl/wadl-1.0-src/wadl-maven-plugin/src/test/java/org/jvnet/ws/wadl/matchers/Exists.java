/**
 */
package org.jvnet.ws.wadl.matchers;

import java.io.File;

import org.hamcrest.Description;
import org.hamcrest.TypeSafeMatcher;

public class Exists extends TypeSafeMatcher<File> {

    @Override
    public boolean matchesSafely(File file) {
        return file.exists();
    }

    public void describeTo(Description desc) {
        desc.appendText("not existing");
    }
    
}
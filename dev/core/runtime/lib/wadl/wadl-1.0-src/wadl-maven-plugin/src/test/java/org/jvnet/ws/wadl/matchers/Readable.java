package org.jvnet.ws.wadl.matchers;

import java.io.File;

import org.hamcrest.Description;
import org.hamcrest.TypeSafeMatcher;

public class Readable extends TypeSafeMatcher<File> {

    @Override
    public boolean matchesSafely(File file) {
        return file.canRead();
    }

    public void describeTo(Description desc) {
        desc.appendText("not readable");
    }

}

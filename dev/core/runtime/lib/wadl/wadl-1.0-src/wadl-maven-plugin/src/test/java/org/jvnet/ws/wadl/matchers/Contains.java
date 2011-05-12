package org.jvnet.ws.wadl.matchers;

import org.hamcrest.Description;
import org.hamcrest.TypeSafeMatcher;

import java.io.File;

public class Contains extends TypeSafeMatcher<File> {

    private String nested;

    public Contains(String nested) {
        this.nested = nested;
    }
    
    @Override
    public boolean matchesSafely(File file) {
        File nestedFile = new File(file, nested);
        return nestedFile.exists();
    }

    public void describeTo(Description descr) {
        descr.appendText("does not contain " + nested);
    }

}

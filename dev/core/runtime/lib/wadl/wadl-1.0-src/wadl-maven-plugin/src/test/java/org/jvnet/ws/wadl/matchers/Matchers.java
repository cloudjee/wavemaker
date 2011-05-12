package org.jvnet.ws.wadl.matchers;

import java.io.File;

import org.hamcrest.Matcher;

public class Matchers {

    public static <T> Matcher<File> exists() {
        return new Exists();
    }

    public static <T> Matcher<File> readable() {
        return new Readable();
    }
    
    public static <T> Matcher<File> contains(String nested) {
        return new Contains(nested);
    }

}

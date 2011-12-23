/*
 * @copyright (c) 2008 ActiveGrid, Inc.
 * @license   ASL 2.0  http://apache.org/licenses/LICENSE-2.0
 */

package com.wavemaker.desktop.launcher;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Launches {@link Main} from a separate process; calls java directly, and passes in the values from the environment
 * variables JAVA_OPTS and CATALINA_OPTS.
 * 
 * @author Matt Small
 */
public class ForkMain {

    protected static String getClassPath() throws URISyntaxException {

        StringBuffer classpath = new StringBuffer();

        classpath.append(System.getProperty("java.class.path"));

        return classpath.toString();
    }

    /**
     * 
     * @param args For accepted values, see {@link Main#main(String[])}.
     * @throws InterruptedException
     * @throws URISyntaxException
     * @throws IOException
     */
    public static void main(String[] args) throws InterruptedException, URISyntaxException, IOException {

        if (args.length == 0) {
            System.out.println("usage: {start|stop} [JAVA_OPTS..]");
            System.exit(12);
        }

        List<String> command = new ArrayList<String>();

        File javaExecutable = new File(new File(System.getProperty("java.home"), "bin"), "java");
        command.add(javaExecutable.getAbsolutePath());

        command.add("-cp");
        command.add(getClassPath());

        if (args.length > 1) {
            for (String arg : Arrays.asList(args).subList(1, args.length)) {
                command.add(arg);
            }
        }

        command.add(Main.class.getName());

        // should be start or stop
        command.add(args[0]);

        // for debugging only
        // System.out.println("command: "+command);
        ProcessBuilder pb = new ProcessBuilder(command);
        pb.start();
    }
}
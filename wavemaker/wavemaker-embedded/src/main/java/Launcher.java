import java.awt.Desktop;
import java.io.File;
import java.net.URI;

import org.apache.catalina.Context;
import org.apache.catalina.core.StandardContext;
import org.apache.catalina.core.StandardHost;
import org.apache.catalina.startup.Tomcat;

public class Launcher {

    public void launch() throws Exception {
        File warFile = new File("/Users/pwebb/projects/wavemaker/code/wavemaker/wavemaker-studio/target/wavemaker-studio-6.5.0.M1.war");

        Tomcat tomcat = new Tomcat();
        StandardHost host = (StandardHost) tomcat.getHost();
        host.setUnpackWARs(true);
        tomcat.setPort(8080);
        tomcat.getHost().setAppBase(warFile.getParent());
        Context webapp = tomcat.addWebapp("/wavemaker", warFile.toString());
        ((StandardContext) webapp).setUnpackWAR(true);
        webapp.setPrivileged(true);

        tomcat.start();

        Desktop.getDesktop().browse(URI.create("http://localhost:8080/wavemaker/?debug"));
        tomcat.getServer().await();
    }

    public static void main(String[] args) {
        try {
            System.out.println("Direct Launch");
            new Launcher().launch();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

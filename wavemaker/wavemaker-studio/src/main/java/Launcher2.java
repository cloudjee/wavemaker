import java.awt.Desktop;
import java.net.URI;

import org.apache.catalina.Context;
import org.apache.catalina.core.StandardContext;
import org.apache.catalina.core.StandardHost;
import org.apache.catalina.startup.Tomcat;

public class Launcher2 {

    public static void main(String[] args) throws Exception {
        String tc = "/Users/pwebb/tools/apache-tomcat-7.0.26/";
        Tomcat tomcat = new Tomcat();
        StandardHost host = (StandardHost) tomcat.getHost();
        host.setUnpackWARs(true);
        tomcat.setPort(8080);
        tomcat.getHost().setAppBase("/Users/pwebb/projects/wavemaker/code/wavemaker/wavemaker-studio/target");
        String baseDir = Launcher2.class.getProtectionDomain().getCodeSource().getLocation().getPath();
        System.out.println(baseDir);
        Context webapp = tomcat.addWebapp("/wavemaker", baseDir);
        ((StandardContext) webapp).setUnpackWAR(true);

        // grant {
        // permission java.lang.reflect.ReflectPermission "suppressAccessChecks";
        // permission java.security.AllPermission;
        // };

        webapp.setPrivileged(true);
        tomcat.addUser("manager", "manager");
        tomcat.addRole("manager", "manager");
        tomcat.addRole("manager", "manager-gui");

        Context managerWebApp = tomcat.addWebapp("/manager", tc + "webapps/manager");
        managerWebApp.addSecurityRole("manager");
        managerWebApp.setPrivileged(true);

        tomcat.start();
        Desktop.getDesktop().browse(URI.create("http://localhost:8080/wavemaker/?debug"));
        tomcat.getServer().await();
    }
}

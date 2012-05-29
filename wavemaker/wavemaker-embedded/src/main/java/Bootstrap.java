import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import org.apache.catalina.startup.ClassLoaderFactory;
import org.apache.catalina.startup.ClassLoaderFactory.Repository;
import org.apache.catalina.startup.ClassLoaderFactory.RepositoryType;

public class Bootstrap {

    public void launch() throws Exception {
        List<Repository> repositories = new ArrayList<Repository>();
        repositories.add(new Repository("/Users/pwebb/projects/wavemaker/code/wavemaker/wavemaker-embedded/target/dependency/compile",
            RepositoryType.DIR));
        ClassLoader classLoader = ClassLoaderFactory.createClassLoader(repositories, null);
        Class<?> launcherClass = classLoader.loadClass("Launcher");
        Object launcher = launcherClass.newInstance();
        Method launchMethod = launcher.getClass().getMethod("launch");
        launchMethod.invoke(launcher);
    }

    public static void main(String[] args) {
        try {
            System.out.println("Bootstrap Launch");
            new Bootstrap().launch();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}

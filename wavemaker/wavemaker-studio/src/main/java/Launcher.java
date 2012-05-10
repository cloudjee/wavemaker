import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;

public class Launcher {

    public static void main(String[] args) throws Exception {

        Class<?> loadClass = ClassLoader.getSystemClassLoader().loadClass("Launcher2");
        System.out.println(loadClass);

        ClassLoader classLoader = new URLClassLoader(new URL[] {});
        Thread.currentThread().setContextClassLoader(classLoader);
        Class<?> launcher2 = classLoader.loadClass("Launcher2");
        Method method = launcher2.getMethod("main", String[].class);
        method.invoke(null, new Object[] { args });
    }
}

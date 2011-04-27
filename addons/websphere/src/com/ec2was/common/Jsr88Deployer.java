package com.ec2was.common;

import com.ec2was.common.util.TupleWS;

import javax.enterprise.deploy.shared.factories.DeploymentFactoryManager;
import javax.enterprise.deploy.shared.ModuleType;
import javax.enterprise.deploy.shared.StateType;
import javax.enterprise.deploy.spi.DeploymentManager;
import javax.enterprise.deploy.spi.Target;
import javax.enterprise.deploy.spi.TargetModuleID;
import javax.enterprise.deploy.spi.exceptions.TargetException;
import javax.enterprise.deploy.spi.status.ProgressObject;
import javax.enterprise.deploy.spi.factories.DeploymentFactory;
import java.util.jar.JarFile;
import java.util.jar.Attributes;
import java.util.jar.Manifest;
import java.util.ArrayList;
import java.util.List;
import java.util.Collections;
import java.io.File;

public class Jsr88Deployer {

    private DeploymentManager wsDM;
    private String host;


    public Jsr88Deployer(String host, String port, String userId, String password, String jsr88Home) {

        try {
            // Get the DeploymentFactory implementation class from the MANIFEST.MF file.
            //File jsr88Jar = new File("C:/JSR88/com.ibm.ws.admin.client_7.0.0.jar");
            File jsr88Jar = new File(jsr88Home + "/lib", "com.ibm.ws.admin.client_7.0.0.jar");
            JarFile jarFile = new JarFile(jsr88Jar);
            Manifest manifest = jarFile.getManifest();
            Attributes attributes = manifest.getMainAttributes();
            String key = "J2EE-DeploymentFactory-Implementation-Class";
            String className = attributes.getValue(key);
            
            // Get an instance of the DeploymentFactoryManager
            DeploymentFactoryManager dfm = DeploymentFactoryManager.getInstance();

            // Create an instance of the WebSphere Application Server DeploymentFactory.
            Class deploymentFactory = Class.forName(className);
            DeploymentFactory deploymentFactoryInstance =
               (DeploymentFactory) deploymentFactory.newInstance();

            // Register the DeploymentFactory instance with the DeploymentFactoryManager.
            dfm.registerDeploymentFactory(deploymentFactoryInstance);

            // Provide WebSphere Application Server URI, user ID, and password.
            String uri = "deployer:WebSphere:" + host + ":" + port;
            wsDM = dfm.getDeploymentManager(uri, userId, password);          
        } catch (Exception e)
        {
            e.printStackTrace();
        }

        this.host = host;
    }

    public DeploymentManager getDeployManager()
    {
        return wsDM;
    }

    public StateType deploy(String appName, String earFile)
    {
        StateType stateType = distribute(earFile);
        if (stateType == StateType.COMPLETED) {
            TargetModuleID[] targetModules = getTargetModules(2, appName);
            if (targetModules != null && targetModules.length > 0)
                stateType = start(targetModules);
        }

        return stateType;
    }

    public StateType undeploy(String appName) //throws Exception
    {
        StateType stateType = StateType.COMPLETED;

        // Step 1: stop application:
        TargetModuleID[] targetModules = getTargetModules(1, appName);
        if (targetModules != null && targetModules.length > 0) {
            stateType = stop(targetModules);
        }

        // Step 2: undeploy:
        targetModules = getTargetModules(2, appName);
        if (stateType == StateType.COMPLETED && targetModules != null && targetModules.length > 0) {
            stateType = undeploy(targetModules);
        }

        return stateType;
    }

    public void listDeploymentNames() {
        List<TupleWS.Three> list = getDeploymentNames();
        if (list == null || list.size() == 0) return;

        StringBuilder sb = new StringBuilder("--- start of module list ---");

        for (TupleWS.Three t : list) {

            sb.append(t.v1);
            sb.append("|");
            sb.append(t.v2);
            sb.append("|");
            sb.append(t.v3);
            sb.append("$");
        }
        sb.append("--- end of module list ---");
        System.out.println(sb.toString());
    }

    private StateType distribute(String earFile) {
        StateType stateType;

        Target[] targetList = wsDM.getTargets();
        File earF = new File(earFile);

        ProgressObject progObj = wsDM.distribute(targetList, earF, null);

        stateType = waitForCompletion(progObj);
        if (stateType == StateType.COMPLETED) {
            System.out.println("distribute done ...");
        } else {
            System.out.println("*** distribute failed ***");
            System.out.println(progObj.toString());
        }

        return stateType;
    }

    private StateType start(TargetModuleID[] modules) {
        StateType stateType;

        ProgressObject progObj = wsDM.start(modules);

        stateType = waitForCompletion(progObj);
        if (stateType == StateType.COMPLETED) {
            System.out.println("start done ...");
        } else {
            System.out.println("*** start failed ***");
            System.out.println(progObj.toString());
        }

        return stateType;
    }

    private StateType stop(TargetModuleID[] modules) {
        StateType stateType;

        ProgressObject progObj = wsDM.stop(modules);

        stateType = waitForCompletion(progObj);
        if (stateType == StateType.COMPLETED) {
            System.out.println("stop done ...");
        } else {
            System.out.println("*** stop failed ***");
            System.out.println(progObj.toString());
        }

        return stateType;
    }

    private StateType undeploy(TargetModuleID[] modules) {
        StateType stateType;

        ProgressObject progObj = wsDM.undeploy(modules);

        stateType = waitForCompletion(progObj);
        if (stateType == StateType.COMPLETED) {
            System.out.println("undeploy done ...");
        } else {
            System.out.println("*** undeploy failed ***");
            System.out.println(progObj.toString());
        }

        return stateType;
    }

    private ArrayList<TupleWS.Three> getDeploymentNames() {
        ArrayList<TupleWS.Three> lines;
        try {
            ArrayList<TupleWS.Two<TargetModuleID, String>> moduleList = new ArrayList<TupleWS.Two<TargetModuleID, String>>();
            TargetModuleID[] modules = wsDM.getRunningModules(ModuleType.EAR, wsDM.getTargets());
            if (modules != null && modules.length > 0) {
                for (TargetModuleID m: modules) {
                    moduleList.add(TupleWS.tuple(m, "running"));
                }
            }

            modules = wsDM.getNonRunningModules(ModuleType.EAR, wsDM.getTargets());
            if (modules != null && modules.length > 0) {
                for (TargetModuleID m: modules) {
                    moduleList.add(TupleWS.tuple(m, "stopped"));
                }
            }

            if (moduleList.size() == 0) return null;

            lines = new ArrayList<TupleWS.Three>();
            for (TupleWS.Two<TargetModuleID, String> t : moduleList) {
                String appName = extractAppName(t.v1.getModuleID());
                lines.add(TupleWS.tuple(appName, this.host, t.v2));
            }

            Collections.sort(lines);
        } catch (TargetException te) {
            te.printStackTrace();
            return null;
        }

        return lines;
    }

    /*private ArrayList<DeployInfo> getDeploymentNames() {
            ArrayList<DeployInfo> lines;
        try {
            ArrayList<TupleWS.Two<TargetModuleID, String>> moduleList = new ArrayList<TupleWS.Two<TargetModuleID, String>>();
            TargetModuleID[] modules = wsDM.getRunningModules(ModuleType.EAR, wsDM.getTargets());
            if (modules != null && modules.length > 0) {
                for (TargetModuleID m: modules) {
                    moduleList.add(TupleWS.tuple(m, "running"));
                }
            }

            modules = wsDM.getNonRunningModules(ModuleType.EAR, wsDM.getTargets());
            if (modules != null && modules.length > 0) {
                for (TargetModuleID m: modules) {
                    moduleList.add(TupleWS.tuple(m, "stopped"));
                }
            }

            if (moduleList.size() == 0) return null;

            lines = new ArrayList<DeployInfo>();
            for (TupleWS.Two<TargetModuleID, String> t : moduleList) {
                String appName = extractAppName(t.v1.getModuleID());
                lines.add(new DeployInfo(appName, this.host, t.v2));
            }

            Collections.sort(lines);
        } catch (TargetException te) {
            te.printStackTrace();
            return null;
        }

        return lines;
    }*/


    private String extractAppName(String s) {
        int indx1 = s.indexOf("name=") + 5;
        int indx2 = s.indexOf(",", indx1);

        return s.substring(indx1, indx2);
    }

    private TargetModuleID[] getTargetModules(int opt, String appName) {
        String token = "name=" + appName + ",";
        TargetModuleID[] modules;

        try {
            if (opt == 1)
                modules = wsDM.getRunningModules(ModuleType.EAR, wsDM.getTargets());
            else
                modules = wsDM.getNonRunningModules(ModuleType.EAR, wsDM.getTargets());
        } catch (TargetException te) {
            te.printStackTrace();
            return null;
        }

        ArrayList<TargetModuleID> targetModuleArr = new ArrayList<TargetModuleID>();
        TargetModuleID[] targetModules = null;
        if (modules != null && modules.length > 0)
        {
            for (TargetModuleID module: modules)
            {
                String moduleID = module.getModuleID();
                if (moduleID.contains(token)) targetModuleArr.add(module);
            }

            targetModules = new TargetModuleID[targetModuleArr.size()];
            targetModuleArr.toArray(targetModules);
        }

        return targetModules;
    }

    private StateType waitForCompletion (ProgressObject progObj)
    {
        // wait for the deployment to finish
        try {
            while (progObj.getDeploymentStatus().getState() == StateType.RUNNING)
                Thread.sleep(100);
        } catch (InterruptedException ie) {
            ie.printStackTrace();
            return StateType.FAILED;
        }

        return progObj.getDeploymentStatus().getState();
    }

    class DeployInfo implements Comparable<DeployInfo> {
        String host;
        String appName;
        String status;

        private DeployInfo (String a, String h, String s) {
            appName = a;
            host = h;
            status = s;
        }

        public int compareTo(DeployInfo di) {
            return appName.compareTo(di.appName);
        }
    }
}

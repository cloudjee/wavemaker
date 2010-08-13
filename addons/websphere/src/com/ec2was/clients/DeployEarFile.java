package com.ec2was.clients;

import com.ec2was.common.Jsr88Deployer;
import javax.enterprise.deploy.shared.StateType;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class DeployEarFile {

    public static void main(String... args) {
        //The following prompt is just to suspend the program for a moment for debugging
        /*System.out.println("Enter any key to continue: ");
        BufferedReader in =
            new BufferedReader(new InputStreamReader(System.in));
        String s = "";
        try {
            s = in.readLine();
        } catch (IOException e) {
            e.printStackTrace();
        }*/

        StateType stateType = null;

        try {
            Thread.sleep(8000);
        } catch (Exception e) {
            e.printStackTrace();
        }

        String action   = args[0]; // action (deploy, undeploy, redeploy, list)
        String target   = args[1]; // application name
        String earFile  = args[2]; // ear file name
        String host     = args[3]; // EC2 host name
        String port     = args[4]; // soap port number
        String userId   = args[5]; // WAS user id
        String password = args[6]; // WAS password

        String saction = action.substring(0, 1).toUpperCase() + action.substring(1);
        System.out.println("Starting " + saction + " in a separate process...");

       // start deployment

        Jsr88Deployer deployer = new Jsr88Deployer(host, port, userId, password);

        if (action.equalsIgnoreCase("deploy")) {
            stateType = deployer.deploy(target, earFile);
        } else if (action.equalsIgnoreCase("undeploy")) {
            stateType = deployer.undeploy(target);
        } else if (action.equalsIgnoreCase("redeploy")) {
            stateType = deployer.undeploy(target);
            if (stateType == StateType.COMPLETED)
                stateType = deployer.deploy(target, earFile);
        } else if (action.equalsIgnoreCase("list")) {
            deployer.listDeploymentNames();    
        }

        if (!action.equals("list")) {
            if (stateType == StateType.COMPLETED) {
                System.out.println("\n--- " + saction + " completed successfully ---");
            } else {
                System.out.println("\n*** " + saction + " failed ***");
            }
        }
    }
}

package com;

import com.test.LicenseHandler;

import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Tools {
    public static void main(String[] args) {
        System.out.println("Enter action: ");
        BufferedReader in =
            new BufferedReader(new InputStreamReader(System.in));
        String action = "";
        try {
            action = in.readLine();
        } catch (IOException e) {
            e.printStackTrace();
        }

        if (action.length() == 0) action = "genkey";
        System.out.println("Echo: " + action);

        LicenseHandler lh = new LicenseHandler();

        if (action.equals("provider")) {
            lh.listJCEProviderInfo(null);
        } else if (action.equals("genkey")) {
            lh.genKey(null);
        } else if (action.equals("gencipher")) {
            lh.genCipher(null);
        } else if (action.equals("encrypt")) {
            lh.encrypt(null);
        } else if (action.equals("create")) {
            createLicenseKey(lh);
        } else if (action.equals("install")) {
            lh.installLicense();
        } else if (action.equals("verify")) {
            lh.verifyLicense();
        } else if (action.equals("verifyn")) {
            lh.verifyLicenseNew();
        } else if (action.equals("wizard")) {
            lh.licenseWizard();
        } else if (action.equals("hwinfo")) {
            lh.getHardWareInfo();
        }
    }

    private static void createLicenseKey(LicenseHandler lh) {
        String licensee = "";
        String type = "";
        int period = 0;
        String speriod = "";
        String version = "";
        String macAddr = "";

        //----------- Requester's email address
        System.out.println("Enter requester's email address: ");
        BufferedReader in =
            new BufferedReader(new InputStreamReader(System.in));

        try {
            licensee = in.readLine();
        } catch (IOException e) {
            e.printStackTrace();
        }

        //----------- License type
        System.out.println("Enter type of license (t=Trial, p=Perpetual): ");
        in = new BufferedReader(new InputStreamReader(System.in));

        try {
            type = in.readLine();
        } catch (IOException e) {
            e.printStackTrace();
        }

        if (type.equalsIgnoreCase("t")) {
            type = "Trial";
        } else if (type.equalsIgnoreCase("p")) {
            type = "Perpetual";
        } else {
            type = "Trial";
        }

        //----------- Mac Address where Studio is installed
        System.out.println("Enter Mac address: ");
        in = new BufferedReader(new InputStreamReader(System.in));

        try {
            macAddr = in.readLine();
        } catch (IOException e) {
            e.printStackTrace();
        }

        //----------- Trial period
        if (type.equalsIgnoreCase("Perpetual")) {
            period = 99999;
        } else { //Trial
            System.out.println("Enter trial period (number of days, default=20): ");
            in = new BufferedReader(new InputStreamReader(System.in));

            try {
                speriod = in.readLine();
                if (speriod.length() == 0) speriod = "20";
                period = Integer.parseInt(speriod);
            } catch (IOException e) {
                e.printStackTrace();
                createLicenseKey(lh);
            }
        }

        //----------- Studio version
        if (type.equalsIgnoreCase("Perpetual")) {
            System.out.println("Enter Studio version (eg. 6.1.9GA, 6.2.4Beta, 6.3.0DevBuild): ");
            in = new BufferedReader(new InputStreamReader(System.in));

            try {
                version = in.readLine();
            } catch (IOException e) {
                e.printStackTrace();
                createLicenseKey(lh);
            }
        }

        lh.createLicenseKey(licensee, type, macAddr, period, version);
    }
}

/*
 * Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
 
package com.wavemaker.studio;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

import com.wavemaker.tools.config.ConfigurationStore;

/**
 * @author Frankie Fu
 */
public class RegistrationService {

    private enum RegistrationChoiceType {
        Register, Skip, Later
    }

    private static final String CONFIG_REGISTRATION_CHOICE = "RegistrationChoice";

    private static final String CONFIG_REGISTER_LATER_COUNTER = "RegisterLaterCounter";

    private static final int REGISTER_LATER_SKIP_TIME = 3; // skip 3 times before showing Registration Dialog again

    private static final String CHECK_URL = "http://www.wavemaker.com";

    private static final int CONNECTION_TIMEOUT = 3000; // 3 seconds

    public boolean shouldShowRegistration() {
        return showRegistration() && checkHttpConnection();
    }

    public void setRegistrationChoice(String choice) {
        ConfigurationStore.setPreference(getClass(),
                CONFIG_REGISTRATION_CHOICE, choice);
        if (choice.equals(RegistrationChoiceType.Later.toString())) {
            ConfigurationStore.setPreferenceInt(getClass(),
                    CONFIG_REGISTER_LATER_COUNTER, 0);
        }
    }

    private boolean showRegistration() {
        String choice = ConfigurationStore.getPreference(getClass(),
                CONFIG_REGISTRATION_CHOICE, null);
        if (choice == null || choice.length() == 0) {
            return true;
        } else if (choice.equals(RegistrationChoiceType.Later.toString())) {
            int laterCounter = ConfigurationStore.getPreferenceInt(getClass(),
                    CONFIG_REGISTER_LATER_COUNTER, 0);
            if (laterCounter >= REGISTER_LATER_SKIP_TIME) {
                return true;
            } else {
                ConfigurationStore.setPreferenceInt(getClass(),
                        CONFIG_REGISTER_LATER_COUNTER, ++laterCounter);
            }
        }
        return false;
    }

    private boolean checkHttpConnection() {
        try {
            URL url = new URL(CHECK_URL);
            URLConnection urlConn = url.openConnection();
            if (urlConn instanceof HttpURLConnection) {
                urlConn.setConnectTimeout(CONNECTION_TIMEOUT);
            }
            urlConn.connect();
        } catch (MalformedURLException e) {
            return false;
        } catch (IOException e) {
            return false;
        }
        return true;
    }
}

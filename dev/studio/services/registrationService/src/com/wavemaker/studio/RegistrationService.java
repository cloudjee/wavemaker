/*
 * Copyright (C) 2008-2011 WaveMaker Software, Inc.
 *
 * This file is part of WaveMaker Studio.
 *
 * WaveMaker Studio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License, only.
 *
 * WaveMaker Studio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WaveMaker Studio.  If not, see <http://www.gnu.org/licenses/>.
 */ 
package com.wavemaker.studio;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

import com.wavemaker.tools.config.ConfigurationStore;

/**
 * @author ffu
 * @version $Rev$ - $Date$
 * 
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

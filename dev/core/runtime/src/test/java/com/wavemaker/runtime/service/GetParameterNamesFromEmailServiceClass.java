/*
 *  Copyright (C) 2008-2009 WaveMaker Software, Inc.
 *
 *  This file is part of the WaveMaker Server Runtime.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.wavemaker.runtime.service;

import java.util.Properties;

import org.apache.log4j.Logger;

/**
 * @author small
 * @version $Rev$ - $Date$
 * 
 */
public class GetParameterNamesFromEmailServiceClass {

    private static Logger logger = Logger
            .getLogger(GetParameterNamesFromEmailServiceClass.class);

    public static String sendMail(String Host, String Port, String User,
            String Pass, String To, String Cc, String From, String Subject,
            String Message) {
        // Get Logger and Log Params
        // Output to tomcat stdout log file

        logger.info("com.wavemaker.emailService.sendMail");
        logger.info("Host: " + Host + " Port: " + Port + " User: " + User);
        logger.info("To: " + To + " CC: " + Cc + " From: " + From
                + " Subject: " + Subject);
        logger.info("Message: " + Message);

        try {
            // Put Properties
            Properties p = new Properties();
            p.put("mail.smtp.host", Host);
            p.put("mail.smtp.port", Port);

        } catch (Exception e) {
            e.printStackTrace();

        }

        return Host+" "+Port;
    }
}
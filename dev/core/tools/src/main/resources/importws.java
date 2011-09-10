/*
 *  Copyright (C) 2007-2011 VMWare, Inc. All rights reserved.
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

import java.util.Arrays;

import com.wavemaker.tools.common.ConfigurationException;
import com.wavemaker.tools.ws.ImportWS;

/**
 * Import Web Service command line utility.
 * 
 * <pre>
 * Usage: importws [options] <WSDL URI/Directory>
 * where [options] include:
 * -d &lt;directory>    Specify where to place generated output files. Default is the current directory.
 * -p &lt;pkg>          Specify the target package. This will override the default package name algorithm based on the namespace.
 * </pre>
 * <pre>
 * java importws stockquote.wsdl
 * java importws -d C:\ag\output stockquote.wsdl
 * java importws -d C:\ag\output C:\ag\wsdls
 * </pre>
 * 
 * @author ffu
 * @version $Rev$ - $Date$
 * 
 */
public class importws {

    public static void main(String[] args) {
        if (args == null || args.length == 0) {
            System.out.println("Missing argument(s).");
            ImportWS.usage(importws.class);
            return;
        }
        if (Arrays.binarySearch(args, "--help") > -1
                || Arrays.binarySearch(args, "-h") > -1) {
            ImportWS.usage(importws.class);
            return;
        }

        ImportWS importWS = new ImportWS();
        try {
            importWS.run(args);
        } catch (ConfigurationException e) {
            if (e.getMessage() != null) {
                System.out.println(e.getMessage());
            } else {
                e.printStackTrace();
            }
            ImportWS.usage(importws.class);
        }
    }
}

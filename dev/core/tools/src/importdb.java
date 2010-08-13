/*
 *  Copyright (C) 2007-2010 WaveMaker Software, Inc.
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
import java.util.Arrays;

/**
 * Command line entry point.
 * 
 * @author Simon Toens
 * @version $Rev$ - $Date$
 *
 */
public class importdb {

    public static void main(String[] args) {

        Arrays.sort(args);

        if (Arrays.binarySearch(args, "--help") > -1
                || Arrays.binarySearch(args, "-h") > -1) {
            System.out.println(
                com.wavemaker.tools.data.ImportDB.getHelp(importdb.class));
            return;
        }


        com.wavemaker.tools.data.ImportDB.main(args);
    }
}

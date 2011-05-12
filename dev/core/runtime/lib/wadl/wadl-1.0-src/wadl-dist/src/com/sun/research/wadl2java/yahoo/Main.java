/*
 * The contents of this file are subject to the terms
 * of the Common Development and Distribution License
 * (the "License").  You may not use this file except
 * in compliance with the License.
 * 
 * You can obtain a copy of the license at
 * http://www.opensource.org/licenses/cddl1.php
 * See the License for the specific language governing
 * permissions and limitations under the License.
 */

/*
 * Main.java
 *
 * Created on May 1, 2006, 5:10 PM
 *
 */

package com.sun.research.wadl2java.yahoo;

import com.yahoo.search.Endpoint.NewsSearch;
import com.yahoo.search.Output;
import com.yahoo.search.Sort;
import com.yahoo.search.Type;
import yahoo.yn.Result;
import yahoo.yn.ResultSet;

/**
 * Simple command line example to query the Yahoo News Search service
 * @author mh124079
 */
public class Main {
    
    /**
     * Query the Yahoo News Search service for stories that contain the word Java.
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        try {
            NewsSearch s = new NewsSearch();
            ResultSet resultSet = s.getAsResultSet( 
                    "jaxws_restful_sample", "java sun", Type.ALL, 10, 1, 
                    Sort.DATE, "en", Output.XML, null);
            for (Result result: resultSet.getResultList()) {
                System.out.printf("%s (%s)\n", result.getTitle(),
                        result.getClickUrl());
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}

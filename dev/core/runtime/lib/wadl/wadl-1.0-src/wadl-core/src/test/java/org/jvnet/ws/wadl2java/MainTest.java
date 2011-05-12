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
 * MainTest.java
 * JUnit based test
 *
 * Created on April 27, 2006, 4:59 PM
 */

package org.jvnet.ws.wadl2java;

import junit.framework.*;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import org.jvnet.ws.wadl.*;
import java.io.File;
import java.util.List;

/**
 *
 * @author mh124079
 */
public class MainTest extends TestCase {
    
    public MainTest(String testName) {
        super(testName);
    }

    protected void setUp() throws Exception {
    }

    protected void tearDown() throws Exception {
    }

    public static Test suite() {
        TestSuite suite = new TestSuite(MainTest.class);
        
        return suite;
    }

    /**
     * Test of process method, of class org.jvnet.ws.wadl2java.Main.
     */
/*    public void testProcess() {
        System.out.println("process");
        
        Main instance = new Main(new File("YahooSearch.wadl"));
        instance.process();
    }
*/
    /**
     * Test of main method, of class org.jvnet.ws.wadl2java.Main.
     */
    public void testMain() {
    }
    
}

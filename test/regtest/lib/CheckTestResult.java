import java.io.IOException;
import java.io.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.*;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;
import org.apache.tools.ant.*;
import java.lang.reflect.*;
import junit.framework.*;
import java.lang.System;
public class CheckTestResult extends org.apache.tools.ant.Task{
	Document dom;
	String dirStr;
	public void init() {

			super.init();
		}

	// The setter for the "message" attribute
  	public void setwmDir(String wmDir) {
	    this.dirStr = wmDir;
  	}
	public void execute() throws org.apache.tools.ant.BuildException {
		
		File dir = new File(dirStr); 
		
        String[] children = dir.list();
        if (children.length == 0) {		
            System.out.println("There is no files exist in this directory");
        } 
		else {
            for (int i=0; i<children.length; i++) {
            // Get filename of file or directory
            String filename = children[i];	
            parseXmlFile(dirStr + filename); 
            parseDocument(filename);
            }
          }
     
	}
	
			//parse the xml file and get the dom object
			private void parseXmlFile(String fname){
				//get the factory
				DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();		
				try {			
					//Using factory get an instance of document builder
					DocumentBuilder db = dbf.newDocumentBuilder();			
					//parse using builder to get DOM representation of the XML file
					dom = db.parse(fname);	
				}catch(ParserConfigurationException pce) {
					pce.printStackTrace();
				}catch(SAXException se) {
					se.printStackTrace();
				}catch(IOException ioe) {
					ioe.printStackTrace();
				}
			}
			//get each employee element and create a Employee object
			private void parseDocument(String filename){
				//get the root elememt
				Element docEle = dom.getDocumentElement();	
				//get a nodelist of <summary> elements
				NodeList nl = docEle.getElementsByTagName("summary");
				if(nl != null && nl.getLength() > 0) {
					for(int i = 0 ; i < nl.getLength();i++) {
						//get the  test case Results 
						Element el = (Element)nl.item(i);
						String fatals = el.getAttribute("fatals");
						String tc = el.getAttribute("testcases");
						String warnings = el.getAttribute("warnings");
						String ts = el.getAttribute("tests");              
						String errors = el.getAttribute("errors");               
						String fails = el.getAttribute("fails");
						String passes = el.getAttribute("passes");
						int er=Integer.parseInt(errors);
						int fl=Integer.parseInt(fails);
						int wr=Integer.parseInt(warnings);
						if (er>0 || fl>0 || wr>0)
						{
						 project.setProperty("isTestFailure","true");
						 System.out.println("Test has failures");
						 System.out.println("XML File Name"+" : "+filename);
						 System.out.println("fatals"+"\t"+"Warnings"+"\t"+"Tests"+"\t"+"Errors"+"\t"+"Fails"+"\t"+"Passes\n");
						 System.out.println(fatals+"    \t"+warnings+"       \t"+ts+"     \t"+errors+"    \t"+fails+"   \t"+passes+"\n");
						}
						else{
						 project.setProperty("isTestSuccess","true");
						 System.out.println("Test passed successfully");
						 System.out.println("XML File Name"+" : "+filename);
						 System.out.println("fatals"+"\t"+"Warnings"+"\t"+"Tests"+"\t"+"Errors"+"\t"+"Fails"+"\t"+"Passes\n");
						 System.out.println(fatals+"    \t"+warnings+"       \t"+ts+"     \t"+errors+"    \t"+fails+"    \t"+passes+"\n");
						}				
					 }
				  }
      }	
}

	


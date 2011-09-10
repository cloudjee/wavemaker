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

package com.wavemaker.tools.pws.install;

import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.common.util.IOUtils;


import java.util.*;
import java.util.jar.JarFile;
import java.util.jar.JarEntry;
import java.io.*;

import org.w3c.dom.*;
import org.apache.commons.io.FileUtils;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.dom.DOMSource;

/**
 * Provides methods to install partner package and to set up pws when creating a new project
 * 
 * @author slee
 */
public class PwsInstall {

    private static final String LOGIN_MANAGER = "LoginManager";
    private static final String REST_IMPORTER = "RestImporter";
    private static final String REST_WSDL_GENERATOR = "RestWsdlGenerator";
    private static final String REST_SERVICE_IMPORTER = "RestServiceGenerator";
    private static final String RESPONSE_PROCESSOR = "ResponseProcessor";
    private static final String SERVICE_MODIFIER = "ServiceModifier";

     public static void setupPwsProject(ProjectManager mgr, String partnerName) {
        File destf;
        try {
            File srcf = new File(mgr.getStudioConfiguration().getStudioWebAppRootFile(),
                    "app/templates/pws/" + partnerName);

            destf = mgr.getCurrentProject().getProjectRoot();

            IOUtils.copy(srcf, destf);
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new WMRuntimeException(e);
        }
    }

    public static void insertImport(File xmlFile, String resource) throws Exception {
        String content = getTrimmedXML(xmlFile);

        String fromStr1 = "<!DOCTYPE";
        String toStr1 = "<!--!DOCTYPE";
        content = content.replace(fromStr1, toStr1);

        String fromStr2 = "spring-beans-2.0.dtd\">";
        String toStr2 = "spring-beans-2.0.dtd\"-->";
        content = content.replace(fromStr2, toStr2);

        FileUtils.writeStringToFile(xmlFile, content, "UTF-8");

        InputStream is = new FileInputStream(xmlFile);

        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        dbf.setNamespaceAware(true);
        DocumentBuilder docBuilder = dbf.newDocumentBuilder();
        Document doc = docBuilder.parse (is);

        doc = insertImport(doc, resource);

        Transformer t = TransformerFactory.newInstance().newTransformer();
        t.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "no");
        t.setOutputProperty(OutputKeys.INDENT, "yes");
        t.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
        t.transform(new DOMSource(doc), new StreamResult(xmlFile));

        content = FileUtils.readFileToString(xmlFile, "UTF-8");
        content = content.replace(toStr1, fromStr1);

        content = content.replace(toStr2, fromStr2);

        FileUtils.writeStringToFile(xmlFile, content, "UTF-8");
    }

    public static Document insertImport (Document doc, String resource) {
        List<Node> targetList = new ArrayList<Node>();

        //First, delete old lines if any.

        NodeList list = doc.getElementsByTagName("import");
        Node node = null;
        for (int i=0; i<list.getLength(); i++) {
            node = list.item(i);
            NamedNodeMap attributes = node.getAttributes();
            for (int j = 0; j < attributes.getLength(); j++) {
                Node attr = attributes.item(j);
                if (attr.getNodeName().equals("resource") && attr.getNodeValue().equals(resource)) {
                    targetList.add(node);
                    break;
                }
            }
        }

        NodeList beans_list = doc.getElementsByTagName("beans");
        Node beans_node = beans_list.item(0);

        if (targetList.size() > 0) {
            for (Node target : targetList) {
                beans_node.removeChild(target);
            }
        }

        //Now, add the new line

        NodeList list1 = beans_node.getChildNodes();
        Node bean_node = null;
        for (int i=0; i<list1.getLength(); i++) {
            Node node1 = list1.item(i);
            if (node1.getNodeName().equals("bean")) {
                bean_node = node1;
                break;
            }
        }

        Element elem = doc.createElement("import");
        elem.setAttribute("resource", resource);

        try {
            if (bean_node != null) {
                beans_node.insertBefore(elem, bean_node);
            } else {
                beans_node.appendChild(elem);
            }
        } catch (DOMException ex) {
            ex.printStackTrace();
        }

        return doc;
    }

    public static void insertEntryKey(File xmlFile, File[] runtimeJarFiles, File[] toolsJarFiles, String partnerName) throws Exception {
        String content = getTrimmedXML(xmlFile);

        String fromStr1 = "<!DOCTYPE";
        String toStr1 = "<!--!DOCTYPE";
        content = content.replace(fromStr1, toStr1);

        String fromStr2 = "spring-beans-2.0.dtd\">";
        String toStr2 = "spring-beans-2.0.dtd\"-->";
        content = content.replace(fromStr2, toStr2);

        FileUtils.writeStringToFile(xmlFile, content, "UTF-8");

        InputStream is = new FileInputStream(xmlFile);

        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        dbf.setNamespaceAware(true);
        DocumentBuilder docBuilder = dbf.newDocumentBuilder();
        Document doc = docBuilder.parse (is);

        insertEntryKey(doc, runtimeJarFiles, toolsJarFiles, partnerName);

        Transformer t = TransformerFactory.newInstance().newTransformer();
        t.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "no");
        t.setOutputProperty(OutputKeys.INDENT, "yes");
        t.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
        t.transform(new DOMSource(doc), new StreamResult(xmlFile));

        content = FileUtils.readFileToString(xmlFile, "UTF-8");
        content = content.replace(toStr1, fromStr1);

        content = content.replace(toStr2, fromStr2);

        FileUtils.writeStringToFile(xmlFile, content, "UTF-8");
    }

    private static Document insertEntryKey (Document doc, File[] runtimeJarFiles, File[] toolsJarFiles, String partnerName) throws IOException {

        NodeList beans_list = doc.getElementsByTagName("beans");
        Node beans_node = beans_list.item(0);

        //First delete old entries

        NodeList beansChildren = beans_node.getChildNodes();
        Node bean_node=null, prop_node=null, map_node=null;
        for (int i=0; i<beansChildren.getLength(); i++) {
            if (!beansChildren.item(i).getNodeName().equals("bean")) {
                continue;
            }
            bean_node = beansChildren.item(i);
            NodeList beanChildren = bean_node.getChildNodes();
            for (int j=0; j<beanChildren.getLength(); j++) {
                if (!beanChildren.item(j).getNodeName().equals("property")) {
                    continue;
                }

                prop_node = beanChildren.item(j);
                break;
            }

            if (prop_node == null) {
                continue;
            }

            NodeList propChildren = prop_node.getChildNodes();
            for (int k=0; k<propChildren.getLength(); k++) {
                if (!propChildren.item(k).getNodeName().equals("map")) {
                    continue;
                }

                map_node = propChildren.item(k);
                break;
            }

            if (map_node == null) {
                continue;
            }

            NodeList mapChildren = map_node.getChildNodes();
            List<Node> oldEntryList = new ArrayList<Node>();

            for (int l=0; l<mapChildren.getLength(); l++) {
                if (!mapChildren.item(l).getNodeName().equals("entry")) {
                    continue;
                }
                Node target = mapChildren.item(l);
                NamedNodeMap entry_attributes = target.getAttributes();
                for (int m=0; m < entry_attributes.getLength(); m++) {
                    Node entryAttr = entry_attributes.item(m);
                    if (entryAttr.getNodeName().equals("key") && entryAttr.getNodeValue().equals(partnerName)) {
                        oldEntryList.add(target);
                        break;
                    }
                }
            }

            if (oldEntryList.size() > 0) {
                for (Node oldEntry : oldEntryList) {
                    map_node.removeChild(oldEntry);
                }
            }

            //Now, add new entries

            NamedNodeMap bean_attributes = bean_node.getAttributes();
            for (int m=0; m<bean_attributes.getLength(); m++) {
                Node beanAttr = bean_attributes.item(m);
                if (beanAttr.getNodeName().equals("id") && beanAttr.getNodeValue().equals("pwsLoginManagerBeanFactory")) {
                    if (classExistsInJar(runtimeJarFiles, partnerName, LOGIN_MANAGER) || classExistsInJar(toolsJarFiles, partnerName, LOGIN_MANAGER)) {
                        Element newEntry = doc.createElement("entry");
                        newEntry.setAttribute("key", partnerName);
                        newEntry.setAttribute("value-ref", partnerName + LOGIN_MANAGER);
                        map_node.appendChild(newEntry);
                    }
                    break;
                } else if (beanAttr.getNodeName().equals("id") && beanAttr.getNodeValue().equals("pwsRestImporterBeanFactory")) {
                    if (classExistsInJar(runtimeJarFiles, partnerName, REST_IMPORTER) || classExistsInJar(toolsJarFiles, partnerName, REST_IMPORTER)) {
                        Element newEntry = doc.createElement("entry");
                        newEntry.setAttribute("key", partnerName);
                        newEntry.setAttribute("value-ref", partnerName + REST_IMPORTER);
                        map_node.appendChild(newEntry);
                    }
                    break;
                } else if (beanAttr.getNodeName().equals("id") && beanAttr.getNodeValue().equals("pwsRestWsdlGeneratorBeanFactory")) {
                    if (classExistsInJar(runtimeJarFiles, partnerName, REST_WSDL_GENERATOR) || classExistsInJar(toolsJarFiles, partnerName, REST_WSDL_GENERATOR)) {
                        Element newEntry = doc.createElement("entry");
                        newEntry.setAttribute("key", partnerName);
                        newEntry.setAttribute("value-ref", partnerName + REST_WSDL_GENERATOR);
                        map_node.appendChild(newEntry);
                    }
                    break;
                } else if (beanAttr.getNodeName().equals("id") && beanAttr.getNodeValue().equals("pwsServiceModifierBeanFactory")) {
                    if (classExistsInJar(runtimeJarFiles, partnerName, SERVICE_MODIFIER) || classExistsInJar(toolsJarFiles, partnerName, SERVICE_MODIFIER)) {
                        Element newEntry = doc.createElement("entry");
                        newEntry.setAttribute("key", partnerName);
                        newEntry.setAttribute("value-ref", partnerName + SERVICE_MODIFIER);
                        map_node.appendChild(newEntry);
                    }
                    break;
                } else if (beanAttr.getNodeName().equals("id") && beanAttr.getNodeValue().equals("pwsRestServiceGeneratorBeanFactory")) {
                    if (classExistsInJar(runtimeJarFiles, partnerName, REST_SERVICE_IMPORTER) || classExistsInJar(toolsJarFiles, partnerName, REST_SERVICE_IMPORTER)) {
                        Element newEntry = doc.createElement("entry");
                        newEntry.setAttribute("key", partnerName);
                        newEntry.setAttribute("value-ref", partnerName + REST_SERVICE_IMPORTER);
                        map_node.appendChild(newEntry);
                    }
                    break;
                } else if (beanAttr.getNodeName().equals("id") && beanAttr.getNodeValue().equals("pwsResponseProcessorBeanFactory")) {
                    if (classExistsInJar(runtimeJarFiles, partnerName, RESPONSE_PROCESSOR) || classExistsInJar(toolsJarFiles, partnerName, RESPONSE_PROCESSOR)) {
                        Element newEntry = doc.createElement("entry");
                        newEntry.setAttribute("key", partnerName);
                        newEntry.setAttribute("value-ref", partnerName + RESPONSE_PROCESSOR);
                        map_node.appendChild(newEntry);
                    }
                    break;
                }
            }
        }

        return doc;
    }

    private static boolean classExistsInJar(File[] jarFiles, String partnerName, String type) throws IOException {
        String className = partnerName.substring(0, 1).toUpperCase() + partnerName.substring(1) + type;
        boolean exists = false;
        for (File jarF : jarFiles) {
            JarFile jar = new JarFile(jarF);
            Enumeration<JarEntry> entries = jar.entries();

            while (entries.hasMoreElements()) {
                JarEntry entry = entries.nextElement();
                if (entry.getName().contains(className)) {
                    exists = true;
                    break;
                }
            }
            if (exists) {
                break;
            }
        }

        return exists;
    }

    private static String getTrimmedXML(File xmlFile) throws Exception
    {
        BufferedReader in = new BufferedReader(new FileReader(xmlFile));
        String str;
        StringBuffer sb = new StringBuffer();
        boolean inBracket = false;
        while ((str = in.readLine()) != null) {
            String str1 = str.trim();
            if (str1.length()>0) {
                if(str1.charAt(0) == '<') {
                    inBracket = true;
                }
                //System.out.println("*** str1 = " + str1);
                if(str1.charAt(0) == '<') {
                    inBracket = true;
                    sb.append(str.trim());
                } else {
                    if (inBracket) {
                        sb.append(" ");
                        sb.append(str.trim());
                    } else {
                        sb.append("\n");
                        sb.append(str);
                    }
                }

                if(str1.charAt(str1.length()-1) == '>') {
                    inBracket = false;
                }
            }
        }
        in.close();
        return sb.toString();
    }
}
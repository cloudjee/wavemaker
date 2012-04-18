WaveMaker
=========

**Copyright 2009-2012 the original author or authors**

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

NOTICE
======

The GIT version of this project is currently being restructured.
The project may not be completely stable in all configurations and uses.

The source code for the latest, stable version of this project can be downloaded 
as a tar bundle from: http://dev.wavemaker.com/wiki/bin/wmdoc_6.4/644Download
In the 'Source Code Bundle' section.

INSTRUCTIONS
============

Building
--------
In order to build WaveMaker you will need the following applications:

* Java JDK 6 (http://www.oracle.com/technetwork/java/javase/downloads/index.html).
* Apache Maven 3.x (http://maven.apache.org/)

To build the complete WaveMaker distribution run the maven from the root directory:

<pre>
    mvn clean install
</pre>
  
To build only WaveMaker studio and required libraries:

<pre>
    cd wavemaker
    mvn clean install
</pre>  
  
If git is in the path of the build environment, the last commit SHA1 object name will be recorded in boot.js and the installer's version file.
  
Dojo Build
----------
Use the DojoBuild profile to build the gzip version of the libraries. This will enable you to run without ?debug

<pre>
    mvn -PDojoBuild clean install
</pre>

Installer Builds
----------------
The installer package built will be dependent on your operating system.  The following operating systems are currently supported:

* Mac OSX
* Linux (Centos or Ubuntu)
* Windows

Building the windows installer requires zip file of the jdk to be redistributed be available. This zip file can not be in the public repository and must be provided.
Set BUILD_JDK_ZIP to the folder containing the zip file.
e.g. set BUILD_JDK_ZIP=c:\downloads

Importing into Eclipse/STS
--------------------------
To develop WaveMaker using Eclipse or STS run the following from the root directory:

<pre>
    mvn eclipse:eclipse
</pre>

From Eclipse choose File, Import Existing Projects to load projects into eclipse.

WaveMaker studio can be deployed using Eclipse Webtools to an Apache Tomcat 6 installation. 


Inplace Deployment
------------------
If you are primarily working on the JavaScript aspects of WaveMaker you might want to use inplace deployment. Inplace deployment allows changes to be immediately updated in the deployed application.

To use live deployment follow these steps:
Download and install Apache Tomcat 6 from http://tomcat.apache.org/download-60.cgi

Enable the manager application by editing /conf/tomcat-users.xml and adding the following:
<pre>
    &lt;tomcat-users$gt;
      &lt;role rolename="manager"/$gt;
      &lt;user username="manager" password="manager" roles="manager"/$gt;
    &lt;/tomcat-users$gt;
</pre>

Build and deploy the project using Maven:

<pre>
    cd wavemaker
    mvn clean install
    cd wavemaker-studio
    mvn -PInplace resources:resources war:inplace tomcat:inplace
</pre>

Use the deployed application http://localhost:8080/wavemaker/?debug

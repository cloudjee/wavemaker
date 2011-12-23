						READ ME
						-----------------

The following file explains the directory structure for the automated test scripts and also talks about how to run 
the tests using the regTest.

The automated test runner comes with the complete setup for ant and python (Used to create the html reports). 
The ant scripts run the SquishServer and invoke the SquishRunner and runs the test scripts and creates the 
log files under the log folder.

The regTest folder structure -

	- bin :- Contains the binaries created for execution of the test scripts. 
	
	- etc :- Part of the ant (v1.7.0)  framework 

	- lib :- ant jars and custom ant task related java files created for the test infrastructure

	- scripts :- utility script files used by the test framework (python and shell script files)

	- src  

	  - log - contains the output and log files

	    - HTML - all generated html log files of current testing round

	    - HTML_Archive - all generated html log files of older testing rounds

	    - XML - all generated xml log files of current testing round

	    - XML_Archive - all generated xml log files of older testing rounds

	  - suite_WaveMaker - The Squish related test framework
	    - shared -  Common scripts containing utility functions and shared data for all test cases

	    - tst_openRolodex - Test script for the sample RolodexSimple which is tested inside the WaveMaker studio . 

	    - tst_runRolodex - Test script for deploying and executing the RolodexSimple application directly on tomcat

            - tst_openWebServices - Test script for the sample WebServicesSample which is tested inside the WaveMaker studio . 
 
	    - tst_runWebServices-  Test script for deploying and executing the WebServicesSample application directly on tomcat

NOTE :- The src folder will be rearranged once the scripts for WebLoad are ready.

Executing the tests :-
----------------------

1 Setting the environment
	1.1 Change directory to  the regtest/bin folder :- Corrects the paths in corresponding setup files.
		setup.bat - Windows
		setup_Linux.sh - Linux
		setup_Darwin.sh - MacOS
	The parameters to change are:
	JAVA :- Install path for JDK(e.g. C:\Program Files\WaveMaker\jdk1.5.0_12)
	ANT_HOME :- Path where the regTest is kept(e.g. C:\regtest)
	SQUISH_HOME :- Install path for Squish(e.g. C:\Squish\squish-3.3.1-web-win32)

	1.2 Change directory to regtest/src folder :- Change the path for the outdir to regTest <Installdir>/src/log in corresponding properties file.
		windows.properties - Windows
		Linux.properties - Linux
		Darwin.properties - MacOS
	
	1.3   Source the environment scripts
		Open a command prompt/Unix terminal
		Source the setup.bat|setup.sh files to set the environment 

2 Executing the tests
	 Working directory - regtest/src
	
	2.1 Execution Options

		2.1.1 Windows(Support for  IE,Firefox)       
		- Manual Running:
			- wm-ant [runTests] ( for running all the test scripts)
			Then provide choice 1 or 2 or 3 for  IE,Firefox or ALL respectively.
		- Automatic Execution (without prompt)
			- wm-ie [runTests] (For  running in IE)
			- wm-ff [runTests] (For  running in Firefox)
			- wm-all [runTests] (For  running in both IE and Firefox) 

		2.1.2. MacOS(Support for Safari,Firefox)       
		
			- Manual Running:
				- wm-ant [runTests] ( for running all the test scripts)
				Then provide choice 1 or 2 or 3 for  Firefox,Safari or ALL respectively.
    
			-Automatic  Execution (without prompt)
				- wm-ff [runTests] (For  running in Firefox)
			        - wm-sa [runTests] (For  running in Safari)
				- wm-all [runTests] (For  running in both Safari and  Firefox)

		2.1.3. Linux(Support for Firefox)       
			
			- Manual Running:
				- wm-ant [runTests] ( for running all the test scripts)
				
			- Automatic  Execution (without prompt)
				- wm-ff [runTests] (For  running in Firefox)

	Note: The default target is runTests which will perform the following tests
		openRolodex : Test RolodexSimple  inside WaveMaker Studio by Opening , Testing and generating a WAR file
		runRolodex : Deploys the WAR file and tests the runtime mode of the sample
		openWebServices: Test WebServicesSample inside WaveMaker Studio by Opening , Testing and generating a WAR file
		runWebServices: Deploys the WAR file and tests the runtime mode of the sample
		checkTestResult : Will evaluate all test logs and provide an overall success or failure information

 3 View the result log files of the current execution under the regtest/src/log/HTML folder. The files are stored in the format <DateTime>_<BrowserName>_<TestCaseName>.html 
   
 4 View the result log files of the current execution under the regtest/src/log/XML folder. The files are stored in the format <DateTime>_<BrowserName>_<TestCaseName>.xml 
@echo off
rem ######################################################
rem # WaveMaker Regression Test Setup file
rem # Set JAVA path before running ps-reconfig.sh
rem # This is required to be set inorder to run ant
rem # For example JAVA_HOME=C:\Program Files\Java\jdk1.5.0_08
rem # Also, set ANT_HOME appropriately, for example
rem # ANT_HOME=D:\regtest
rem # Add the Squish installation path at
rem # SQUISH_HOME=
rem ######################################################                  
set JAVA=C:\Program Files\Java\jdk1.5.0_08
set ANT_HOME=D:\regtest_25thApr\regtest
set SQUISH_HOME="D:\Squish\squish-3.3.1-web-win32"

set JAVA_HOME=%JAVA%
set CLASSPATH=%JAVA%\lib\tools.jar;%JAVA%\jre\lib\rt.jar;%JAVA%\jre\lib\i18n.jar;%ANT_HOME%\lib;%CLASSPATH%
set PATH=%JAVA%\bin;%ANT_HOME%\bin;"%SQUISH_HOME%\bin";%PATH%
@echo off
setlocal

REM Detect the client's home directory; must retain current directory
set CUR_DIR=%CD%
set CLIENT_BIN=%~dp0
cd /d "%CLIENT_BIN%"
call onetimeSetup.bat "%CLIENT_BIN%"
cd ..
set CLIENT_HOME=%CD%
cd /d %CUR_DIR%

REM Set Java System properties (needed by the client)
set P_0="-Duser.install.root=%CLIENT_HOME%"
set P_1="-Dwas.install.root=%CLIENT_HOME%"
set P_2="-Djaassoap=off"
set P_3="-Dcom.ibm.ws.management.standalone=true"
set P_4="-Djava.util.logging.manager=com.ibm.ws.bootstrap.WsLogManager"
set P_5="-Djava.util.logging.configureByServer=true"
set P_6="-Dcom.ibm.SOAP.ConfigURL=file:%CLIENT_HOME%\properties\soap.client.props"
set P_7="-Dcom.ibm.CORBA.ConfigURL=file:%CLIENT_HOME%\properties\sas.client.props"
set P_8="-Dcom.ibm.SSL.ConfigURL=file:%CLIENT_HOME%\properties\ssl.client.props"
set P_9="-Dcom.ibm.IPC.ConfigURL=file:%CLIENT_HOME%\properties\ipc.client.props"
set P_A="-Dcom.ibm.ws.scripting.wsadminprops=%CLIENT_HOME%\properties\wsadmin.properties"
set SYSTEM_PROPERTIES=%P_0% %P_1% %P_2% %P_3% %P_4% %P_5% %P_6% %P_7% %P_8% %P_9% %P_A%

REM Set client's classpath
set CP="%CLIENT_HOME%\com.ibm.ws.admin.client_7.0.0.jar;%CLIENT_HOME%\com.ibm.ws.security.crypto.jar"

REM Detect WsAdmin "javaoption" arguments
set JAVA_HOME=c:\JSR88\java

REM Detect WsAdmin "javaoption" arguments
if exist %JAVA_HOME%\bin\java.exe (                                             
   set JAVA_EXE=%JAVA_HOME%\bin\java                                            
) else (                                                                        
   set JAVA_EXE=%JAVA_HOME%\jre\bin\java                                        
)

REM Launch the WebSphere Administration Thin Client
:runcmd
set PERF_JVM_OPTIONS=-Xj9 -Xquickstart
%JAVA_EXE% %PERF_JVM_OPTIONS% %javaoption% %SYSTEM_PROPERTIES% -classpath %CP% com.ibm.ws.scripting.WasxShell %*

REM Clean up
endlocal
exit /b %ERRORLEVEL%


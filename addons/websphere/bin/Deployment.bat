@ECHO OFF

echo ----
echo action   = %1
echo app name = %2
echo ear file = %3
echo host     = %4
echo port     = %5
echo user     = %6
echo passwd   = %7
echo ----

set DEBUG_OPT=-Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005

set path=C:/IBMJava/java/bin;%path%

set C_PATH=.;C:/JSR88/classes;C:/JSR88/properties;C:/JSR88/com.ibm.ws.admin.client_7.0.0.jar;C:/JSR88/com.ibm.ws.security.crypto.jar;

set TRACE=-DtraceSettingsFile=TraceSettings.properties -Djava.util.logging.manager=com.ibm.ws.bootstrap.WsLogManager -Djava.util.logging.configureByServer=true

set SOAPURL=-Dcom.ibm.SOAP.ConfigURL=file:C:/JSR88/properties/soap.client.props
set SSLURL=-Dcom.ibm.SSL.ConfigURL=file:C:/JSR88/properties/ssl.client.props

java -version

java -classpath "%C_PATH%" %SSLURL% %DEBUG_OPT% %TRACE% %SOAPURL% com.ec2was.clients.DeployEarFile %1 %2 %3 %4 %5 %6 %7
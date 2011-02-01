set DEBUG_OPT=-Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5550

set COMMONS=../lib/commons-codec-1.3.jar
set COMMONS_HTTP=../lib/commons-httpclient-3.0.1.jar
set COMMONS_LOG=../lib/commons-logging-1.1.jar
set WMLIB=../lib/wmtools.jar

set TLCLIB=../lib/truelicense.jar;../lib/trueswing.jar;../lib/truexml.jar;../lib/rsa_keygen.jar
set CLASSPATH=.;../classes;%TLCLIB%;%COMMONS%;%COMMONS_HTTP%;%COMMONS_LOG%;%WMLIB%
java %DEBUG_OPT% com.Tools
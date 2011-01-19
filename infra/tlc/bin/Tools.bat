set DEBUG_OPT=-Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5500

set COMMONS=C:\tlc\lib\commons-codec-1.3.jar
set COMMONS_HTTP=C:\tlc\lib\commons-httpclient-3.0.1.jar
set COMMONS_LOG=C:\tlc\lib\commons-logging-1.1.jar
set WMLIB=C:\src\dev\studio\webapproot\WEB-INF\lib\wmtools.jar

set TLCLIB=C:\tlc\lib\truelicense.jar;C:\tlc\lib\trueswing.jar;C:\tlc\lib\truexml.jar;C:\tlc\lib\rsa_keygen.jar
set CLASSPATH=.;C:\tlc\classes;%TLCLIB%;%COMMONS%;%COMMONS_HTTP%;%COMMONS_LOG%;%WMLIB%
java %DEBUG_OPT% com.Tools
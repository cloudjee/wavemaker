#!/bin/sh

# Detect the client's home directory; must retain current directory
CUR_DIR=`pwd`
CLIENT_BIN=`dirname "$0"`
cd "$CLIENT_BIN"
./onetimeSetup.sh "$CLIENT_BIN"
cd ..
CLIENT_HOME=`pwd`
cd "$CUR_DIR"

isJavaOption=false
nonJavaOptionCount=1
for option in "$@" ; do
  if [ "$option" = "-javaoption" ] ; then
     isJavaOption=true
  else
     if [ "$isJavaOption" = "true" ] ; then
        javaOption="$javaOption $option"
        isJavaOption=false
     else
        nonJavaOption[$nonJavaOptionCount]="$option"
        nonJavaOptionCount=$((nonJavaOptionCount+1))
     fi
  fi
done

C_PATH="$CLIENT_HOME/lib/com.ibm.ws.admin.client.jar:$CLIENT_HOME/lib/com.ibm.ws.security.crypto.jar"

#Platform specific args...
PLATFORM=`/bin/uname`
case $PLATFORM in
  AIX | Linux | SunOS | HP-UX)
    CONSOLE_ENCODING=-Dws.output.encoding=console ;;
  OS/390)
    EXTRA_D_ARGS="-Dfile.encoding=ISO8859-1"
    EXTRA_X_ARGS="-Xnoargsconversion" ;;
esac

# Set java options for performance
PLATFORM=`/bin/uname`
case $PLATFORM in
  AIX)
      PERF_JVM_OPTIONS="-Xquickstart" ;;
  Linux)
      PERF_JVM_OPTIONS="-Xj9 -Xquickstart" ;;
  SunOS)
      PERF_JVM_OPTIONS="-XX:MaxPermSize=128m" ;;
  HP-UX)
      PERF_JVM_OPTIONS="-XX:MaxPermSize=128m" ;;
  OS/390)
      PERF_JVM_OPTIONS="" ;;
esac 

CLIENTSAS=-Dcom.ibm.CORBA.ConfigURL=file:"$CLIENT_HOME"/properties/sas.client.props
CLIENTSOAP=-Dcom.ibm.SOAP.ConfigURL=file:"$CLIENT_HOME"/properties/soap.client.props
CLIENTIPC=-Dcom.ibm.IPC.ConfigURL=file:"$CLIENT_HOME"/properties/ipc.client.props
CLIENTSSL=-Dcom.ibm.SSL.ConfigURL=file:"$CLIENT_HOME"/properties/ssl.client.props
WSADMIN_PROPERTIES="$CLIENT_HOME"/properties/wsadmin.properties
WAS_LOGGING="-Djava.util.logging.manager=com.ibm.ws.bootstrap.WsLogManager -Djava.util.logging.configureByServer=true"

java \
  $EXTRA_X_ARGS \
  $CONSOLE_ENCODING \
  $javaOption \
  "$CLIENTSAS" \
  "$CLIENTSSL" \
  "$CLIENTSOAP" \
  "$CLIENTIPC" \
  -Dcom.ibm.ws.scripting.wsadminprops="$WSADMIN_PROPERTIES" \
  -Dwas.install.root="$CLIENT_HOME" \
  -Duser.install.root="$CLIENT_HOME" \
  -Dcom.ibm.ws.management.standalone=true \
  $EXTRA_D_ARGS \
  $PERF_JVM_OPTIONS \
  $WAS_LOGGING \
  -classpath "$C_PATH" \
  com.ibm.ws.scripting.WasxShell "${nonJavaOption[@]}"

exit $?
        
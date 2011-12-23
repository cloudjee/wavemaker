#!/bin/sh
if [ ! -f runonce.tmp ];
then
  BIN_DIR=`pwd`
  cd ..
  ROOT_DIR=`pwd`
  cd bin

  echo Initializing admin client for first-time use...
  sed -i "s|com.ibm.ws.scripting.profiles=[a-zA-Z0-9_ \:\$\/\.\;]*|com.ibm.ws.scripting.profiles=$BIN_DIR/securityProcs\.jacl;$BIN_DIR/LTPA_LDAPSecurityProcs\.jacl|" ../properties/wsadmin.properties
  sed -i "s|com.ibm.ws.scripting.traceFile=[a-zA-Z0-9_ \:\$\/\.\;]*|com.ibm.ws.scripting.traceFile=$BIN_DIR/wsadmin\.traceout|" ../properties/wsadmin.properties
  sed -i "s|com.ibm.ws.scripting.validationOutput=[a-zA-Z0-9_ \:\$\/\.\;]*|com.ibm.ws.scripting.validationOutput=$BIN_DIR/wsadmin\.valout|" ../properties/wsadmin.properties
  sed -i "s|com.ibm.ws.scripting.tempdir=[a-zA-Z0-9_ \:\$\/\.\;]*|#com.ibm.ws.scripting.tempdir=|"  ../properties/wsadmin.properties
  sed -i "s|user.root=[a-zA-Z0-9_ \:\$\/\.\;]*|user.root=$ROOT_DIR|" ../properties/ssl.client.props
  echo done >> runonce.tmp
fi;
        
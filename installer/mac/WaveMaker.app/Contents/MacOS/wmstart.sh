#!/bin/sh   
BASEDIR=`dirname $0`
exec java \
    -Xms256m \
    -Xmx512m \
    -XX:MaxPermSize=256m \
    $WM_JAVA_OPTS \
    -jar $BASEDIR/../../launcher/launcher.jar

#!/bin/sh   
BASEDIR=`dirname $0`
exec java \
    -Xms256m \
    -Xmx512m \
    -XX:MaxPermSize=256m \
    $WM_JAVA_OPTS \
    -Xdock:icon=$BASEDIR/../Resources/wmicon.icns \
    -jar $BASEDIR/../../launcher/launcher.jar

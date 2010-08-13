#!/bin/sh

if [ ! -e StudioRegistration.war ]; then
    echo "need StudioRegistration.war"
    echo "use a 4.0.x stable studio to generate this"
    exit 1
fi

if [ ! -e wavemaker.war ]; then
    # cd ../studio
    # ant dist war
    # cd ../cloud
    # cp ../java/build/wavemaker.war .
    echo "need wavemaker.war"
    exit 1
fi

if [ ! -e health.war ]; then
    cd health
    ant war
    cd ..
    cp health/build/health.war .
fi

jar cvf ROOT.war index.html

rm -f webapps.tar

tar cvf webapps.tar wavemaker.war StudioRegistration.war ROOT.war index.html health.war

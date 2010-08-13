#!/bin/sh
######################################################
# WaveMaker Regression Test Setup file
# Set JAVA path before running ps-reconfig.sh
# This is required to be set inorder to run ant
# For example JAVA_HOME=C:\Program Files\Java\jdk1.5.0_08
# Also, set ANT_HOME appropriately, for example
# ANT_HOME=D:\regtest
# Add the Squish installation path at
# SQUISH_HOME=
######################################################
# Sample Linux settings
#SQUISH_HOME=/home/rgangwar/squish-3.3.0-web-linux32
#JAVA_HOME=/opt/wavemaker-3.2.0.22052/java
#ANT_HOME=/home/rgangwar/regtest
######################################################
# Sample MacOS settings
#SQUISH_HOME=/home/rgangwar/squish-3.3.0-web-linux32
#JAVA_HOME=/opt/wavemaker-3.2.0.22052/java
#ANT_HOME=/home/rgangwar/regtest
######################################################
SQUISH_HOME=/home/rgangwar/squish-3.3.0-web-linux32
JAVA_HOME=/opt/wavemaker-3.2.1.22703/java
ANT_HOME=/home/rgangwar/regtest

CLASSPATH=.:$ANT_HOME/lib:$JAVA_HOME/../Classes/dt.jar:$JAVA_HOME/../Classes/classes.jar:$JAVA_HOME/../Classes/ui.jar:$JAVA_HOME/../Classes/charsets.jar:$CLASSPATH
PATH=$JAVA_HOME/bin:$ANT_HOME/bin:$SQUISH_HOME/bin:$PATH
export ANT_HOME CLASSPATH JAVA_HOME SQUISH_HOME PATH

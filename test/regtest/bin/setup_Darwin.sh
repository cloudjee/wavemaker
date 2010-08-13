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
SQUISH_HOME=/Applications/squish-20080502-web-mac
JAVA_HOME=/System/Library/Frameworks/JavaVM.framework/Versions/CurrentJDK/Home
ANT_HOME=/Users/hcl/regtest

CLASSPATH=.:$ANT_HOME/lib:$JAVA_HOME/../Classes/dt.jar:$JAVA_HOME/../Classes/classes.jar:$JAVA_HOME/../Classes/ui.jar:$JAVA_HOME/../Classes/charsets.jar:$CLASSPATH
PATH=$JAVA_HOME/bin:$ANT_HOME/bin:$SQUISH_HOME/bin:$PATH
export ANT_HOME CLASSPATH JAVA_HOME SQUISH_HOME PATH

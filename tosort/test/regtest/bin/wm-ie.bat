@echo off
setlocal
call setup.bat
set BROWSER=ie

%ANT_HOME%\bin\ant -Dsquish_home=%SQUISH_HOME% -Dregtest_home=%ANT_HOME% -DwmBrowser=%BROWSER% -DpropertiesFile="%ANT_HOME%\src\windows.properties" %*

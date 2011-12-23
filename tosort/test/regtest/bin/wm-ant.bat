@echo off
setlocal
call setup.bat
set default=3
batch-menu "Choose which browser to test:" %default% "Firefox" "IE" "All"
if "%ERRORLEVEL%" == "1" set BROWSER=firefox
if "%ERRORLEVEL%" == "2" set BROWSER=ie
if "%ERRORLEVEL%" == "3" set BROWSER=all

%ANT_HOME%\bin\ant -Dsquish_home=%SQUISH_HOME% -Dregtest_home=%ANT_HOME% -DwmBrowser=%BROWSER% -DpropertiesFile="%ANT_HOME%\src\windows.properties" %*

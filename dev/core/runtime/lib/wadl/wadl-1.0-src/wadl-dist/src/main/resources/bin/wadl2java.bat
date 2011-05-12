@REM ----------------------------------------------------------------------------
@REM The contents of this file are subject to the terms
@REM of the Common Development and Distribution License
@REM (the "License").  You may not use this file except
@REM in compliance with the License.
@REM 
@REM You can obtain a copy of the license at
@REM http://www.opensource.org/licenses/cddl1.php
@REM See the License for the specific language governing
@REM permissions and limitations under the License.

@REM ----------------------------------------------------------------------------
@REM 

@REM ----------------------------------------------------------------------------
@REM Wadl2java Start Up Batch script
@REM
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM WADL_HOME - location of wadl's installed home dir
@REM WADL_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM WADL_BATCH_PAUSE - set to 'on' to wait for a key stroke before ending
@REM WADL_OPTS - parameters passed to the Java VM when running Wadl2java
@REM     e.g. to debug Wadl2java itself, use
@REM set WADL_OPTS=-Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM ----------------------------------------------------------------------------

@REM Begin all REM lines with '@' in case WADL_BATCH_ECHO is 'on'
@echo off
@REM enable echoing my setting WADL_BATCH_ECHO to 'on'
@if "%WADL_BATCH_ECHO%" == "on"  echo %WADL_BATCH_ECHO%

@REM Execute a user defined script before this one
if exist "%HOME%\wadlrc_pre.bat" call "%HOME%\wadlrc_pre.bat"

set ERROR_CODE=0

@REM set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" @setlocal

@REM ==== START VALIDATION ====
if not "%JAVA_HOME%" == "" goto OkJHome

echo.
echo ERROR: JAVA_HOME not found in your environment.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation
echo.
goto error

:OkJHome
if exist "%JAVA_HOME%\bin\java.exe" goto chkMHome

echo.
echo ERROR: JAVA_HOME is set to an invalid directory.
echo JAVA_HOME = %JAVA_HOME%
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation
echo.
goto error

:chkMHome
if not "%WADL_HOME%"=="" goto valMHome

if "%OS%"=="Windows_NT" SET WADL_HOME=%~dp0\..
if not "%WADL_HOME%"=="" goto valMHome

echo.
echo ERROR: WADL_HOME not found in your environment.
echo Please set the WADL_HOME variable in your environment to match the
echo location of the Wadl2java installation
echo.
goto error

:valMHome
if exist "%WADL_HOME%\bin\wadl2java.bat" goto init

echo.
echo ERROR: WADL_HOME is set to an invalid directory.
echo WADL_HOME = %WADL_HOME%
echo Please set the WADL_HOME variable in your environment to match the
echo location of the Wadl installation
echo.
goto error
@REM ==== END VALIDATION ====

:init
@REM Decide how to startup depending on the version of windows

@REM -- Win98ME
if NOT "%OS%"=="Windows_NT" goto Win9xArg

@REM -- 4NT shell
if "%eval[2+2]" == "4" goto 4NTArgs

@REM -- Regular WinNT shell
set WADL_CMD_LINE_ARGS=%*
goto endInit

@REM The 4NT Shell from jp software
:4NTArgs
set WADL_CMD_LINE_ARGS=%$
goto endInit

:Win9xArg
@REM Slurp the command line arguments.  This loop allows for an unlimited number
@REM of agruments (up to the command line limit, anyway).
set WADL_CMD_LINE_ARGS=
:Win9xApp
if %1a==a goto endInit
set WADL_CMD_LINE_ARGS=%WADL_CMD_LINE_ARGS% %1
shift
goto Win9xApp

@REM Reaching here means variables are defined and arguments have been captured
:endInit
SET WADL_JAVA_EXE="%JAVA_HOME%\bin\java.exe"

@REM Start Wadl2java
%WADL_JAVA_EXE% %WADL_OPTS% "-Dwadl.home=%WADL_HOME%" -jar "%WADL_HOME%\lib\wadl-cmdline-${project.version}.jar" %WADL_CMD_LINE_ARGS%
if ERRORLEVEL 1 goto error
goto end

:error
if "%OS%"=="Windows_NT" @endlocal
set ERROR_CODE=1

:end
@REM set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" goto endNT

@REM For old DOS remove the set variables from ENV - we assume they were not set
@REM before we started - at least we don't leave any baggage around
set WADL_JAVA_EXE=
set WADL_CMD_LINE_ARGS=
goto postExec

:endNT
@endlocal

:postExec
if exist "%HOME%\wadlrc_post.bat" call "%HOME%\wadlrc_post.bat"
@REM pause the batch file if WADL_BATCH_PAUSE is set to 'on'
if "%WADL_BATCH_PAUSE%" == "on" pause

if "%WADL_TERMINATE_CMD%" == "on" exit %ERROR_CODE%

exit /B %ERROR_CODE%


@echo off
if exist "runonce.tmp" goto exit

rem Set folder paths, replacing "\" with "/"
set BIN_DIR=%CD:\=/%
cd ..
set ROOT_DIR=%CD:\=/%
cd bin

echo Initializing admin client for first-time use...

rem Process the files
call :dofile ..\properties\wsadmin.properties
call :dofile ..\properties\ssl.client.props

rem Done, indicate we don't have to do this again
echo done >> runonce.tmp
:exit
exit /b

rem function
:dofile
rem Set up a backup file to work with
set tmpfile=%1.bak

if exist %tmpfile% del %tmpfile%

rem Parse each line in the property file
for /F "tokens=1* delims=" %%i in (%1) do (
  call :parse %%i
)

rem Overwrite the original and delete the backup
copy %tmpfile% %1 > nul
del %tmpfile% > nul

goto :eof

rem function
:parse
rem If one of the key lines, replace the text
set tmp_var=%*
set tmp_var=%tmp_var:"=%

if "%tmp_var:~0,37%"=="com.ibm.ws.scripting.validationOutput" (
  echo com.ibm.ws.scripting.validationOutput=%bin_dir%/wsadmin.valout>>%tmpfile%
  goto :eof
)
if "%tmp_var:~0,30%"=="com.ibm.ws.scripting.traceFile" (
  echo com.ibm.ws.scripting.traceFile=%bin_dir%/wsadmin.traceout>>%tmpfile%
  goto :eof
)
if "%tmp_var:~0,29%"=="com.ibm.ws.scripting.profiles" (
  echo com.ibm.ws.scripting.profiles=%bin_dir%/securityProcs.jacl;%bin_dir%/LTPA_LDAPSecurityProcs.jacl>>%tmpfile%
  goto :eof
)
if "%tmp_var:~0,28%"=="com.ibm.ws.scripting.tempdir" (
  echo #com.ibm.ws.scripting.tempdir=>>%tmpfile%
  goto :eof
)
if "%tmp_var:~0,9%"=="user.root" (
  echo user.root=%root_dir%>>%tmpfile%
  goto :eof
)

:next
rem And output the line to the properties file
echo %tmp_var%>>%tmpfile%
set tmp_var=
goto :eof
        
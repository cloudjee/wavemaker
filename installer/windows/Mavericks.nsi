# Build Install Script for WaveMaker
# April 11, 2011 11:18:38 AM
; VERSION should be of the form MAJOR.MINOR.REVISION
; SOURCEDIR should be the built installer root; see common-installer.build
; To compile this script pass /DVERSION=<PRODUCT_VERSION> /DSOURCEDIR=<INSTALLER_ROOT> to the NSIS compiler.

# Base Compiler Options
!define PRODUCT_NAME "WaveMaker"
Name ${PRODUCT_NAME}
SetCompressor /FINAL LZMA
 
# Defines
; WaveMaker
!define REGKEY "SOFTWARE\${PRODUCT_NAME}\${VERSION}"
!define COMPANY "WaveMaker Software, Inc"
!define URL http://www.wavemaker.com
!define DESCRIPTION "${PRODUCT_NAME} Studio and Runtime"
!define COPYRIGHT "WaveMaker Software, Inc, 2011."
/* 
 * The WaveMaker platform consists of two components: 
 * WaveMaker Studio for developing rich internet applications and 
 * WaveMaker Runtime for deploying applications into a standard and secure Java environment.
 *
 */
; Java JDK 1.6.0.24
; Function Returns $R0
!define ERROR_CANCEL "canceled"
!define ERROR_SUCCESS "success"
; Application Paths
!define APP_URL "http://localhost:8095/wavemaker"
!define POSTGRES_PORT "6543"
!define TOMCAT_PORT 8095

# MUI
; MUI Icons
!define MUI_ICON "wavemaker.ico"
!define MUI_UNICON "wavemaker.ico"
 
; MUI Header
!define MUI_HEADERIMAGE
; !define MUI_HEADERIMAGE_RIGHT
!define MUI_HEADERIMAGE_BITMAP "alphaboard_reflection.bmp"
!define MUI_HEADERIMAGE_UNBITMAP "alphaboard_reflection.bmp"

; MUI Wizard
!define MUI_WELCOMEFINISHPAGE_BITMAP "alphaboard_welcome.bmp"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "alphaboard_farewell.bmp"

; MUI Settings
!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_NOAUTOCLOSE
!define MUI_STARTMENUPAGE_REGISTRY_ROOT HKLM
!define MUI_STARTMENUPAGE_REGISTRY_KEY ${REGKEY}
!define MUI_STARTMENUPAGE_REGISTRY_VALUENAME StartMenuGroup
!define MUI_STARTMENUPAGE_DEFAULTFOLDER "${PRODUCT_NAME}\${Version}"
!define MUI_UNFINISHPAGE_NOAUTOCLOSE

# Included files
!include MUI2.nsh
!include LogicLib.nsh
!include NSIS-scripts\RecFind.nsh
!include Sections.nsh
!include TextFunc.nsh
!include WinMessages.nsh
!include WordFunc.nsh


# Declare Macro/Function Includes
!insertmacro VersionCompare
!insertmacro WordReplace

# Reserved Files
ReserveFile "wavemaker.ico"

# Variables
Var StartMenuGroup
Var TomcatDir
Var TomcatPort
Var InstalledTomcat
Var DeployDir
Var ProjectsDialog
    Var ProjectsDirectoryLabel
    Var ProjectsDirectoryInput
    Var ProjectsDirectoryButton
# Macros
; Function Macros
!macro SwitchSlash ResultVar Source Slash
  Push "${Source}"
  Push "${Slash}"
  Call StrSlash
  Pop "${ResultVar}"
!macroend
!define SwitchSlash "!insertmacro SwitchSlash"

# Installer pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "${LICENSEFILE}"
!insertmacro MUI_PAGE_LICENSE "${BUILDSUPPORTDIR}\Oracle_Binary_Code_Licence.txt"
!define MUI_PAGE_CUSTOMFUNCTION_PRE Components_PreFunction
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
#Page custom ProjectsDirectoryPage ProjectsDirectoryPageLeave
!insertmacro MUI_PAGE_STARTMENU Application $StartMenuGroup
!insertmacro MUI_PAGE_INSTFILES
Page custom RunLauncherPageFunction
!define MUI_FINISHPAGE_TEXT "Do you need to clear your browser's cache ? $\r$\n$\r$\nIf this is not your first time running ${PRODUCT_NAME} on this machine, it is strongly suggested that you clear your browser's cache before running ${PRODUCT_NAME} again."
# !define MUI_FINISHPAGE_SHOWREADME "$INSTDIR\${PRODUCT_NAME}.lnk"
# !define MUI_FINISHPAGE_SHOWREADME_TEXT "Run ${PRODUCT_NAME}"
!define MUI_FINISHPAGE_LINK "Download EnterpriseDB's Postgres Plus Advanced Server"
!define MUI_FINISHPAGE_LINK_LOCATION "http://www.enterprisedb.com/products/download.do"
!insertmacro MUI_PAGE_FINISH

# Uninstall Pages
!define MUI_TEXT_COMPONENTS_SUBTITLE "Select the components to uninstall."   # DH: I don't see where this shows in the uninstaller
!define MUI_TEXT_COMPONENTS_TITLE "Select Components to Uninstall"           # DH: I don't see where this shows in the uninstaller
!define MUI_PAGE_CUSTOMFUNCTION_PRE un.Components_PreFunction
!insertmacro MUI_UNPAGE_COMPONENTS
!define MUI_UNCONFIRMPAGE_TEXT_TOP "We value your feedback.  At the completion of the uninstall you will be requested to provide your suggestions.  Please let us know how we can improve WaveMaker." 
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!define MUI_FINISHPAGE_LINK "How can we improve WaveMaker? Click here."
!define MUI_FINISHPAGE_LINK_LOCATION "http://www.wavemaker.com/feedback"
!insertmacro MUI_UNPAGE_FINISH

# Installer languages
!insertmacro MUI_LANGUAGE English

# Installer attributes
InstallDir $PROGRAMFILES\${PRODUCT_NAME}\${VERSION}
SetDatablockOptimize on
SetCompress Auto
CRCCheck on
XPStyle on
Caption "${PRODUCT_NAME}(${VERSION}) Setup"
BrandingText " "; Remove "NSIS Installer" branding.
AllowRootDirInstall false
ShowInstDetails show
/* XXX is this good?
VIProductVersion ${VIVERSION}
VIAddVersionKey ProductName "${PRODUCT_NAME}"
VIAddVersionKey ProductVersion "${VIVERSION}"
VIAddVersionKey CompanyName "${COMPANY}"
VIAddVersionKey CompanyWebsite "${URL}"
VIAddVersionKey FileVersion "${VIVERSION}"
VIAddVersionKey FileDescription "${DESCRIPTION}"
VIAddVersionKey LegalCopyright "${COPYRIGHT}"
*/
LicenseForceSelection checkbox "I accept"
InstallDirRegKey HKLM "${REGKEY}" Path
ShowUninstDetails show
RequestExecutionLevel admin

# Installer sections
SectionGroup Prerequisites core
    Section "Sun JDK 1.6+" java
        SectionIn RO
        Push $R0
        ; Extract Binary Distribution
        DetailPrint "Installing ${__SECTION__}..."
        SetOutpath $INSTDIR
        File /r "${SOURCEDIR}\jdk-1.6.0_24"
        WriteRegStr HKLM "${REGKEY}" JavaHome '$INSTDIR\jdk-1.6.0_24'
        WriteRegStr HKLM "${REGKEY}\Components" "Sun Java Development Kit" 1
        Pop $R0
    SectionEnd

    Section "Launcher" launcher
    /* Bundled launcher
    */
    Push $R0    ; Generic Return Value
    Push $0     ; Path to installed JDK

    ; Extract Tomcat
    DetailPrint "Installing ${__SECTION__}..."
    SetOutpath $INSTDIR
    StrCpy $TomcatDir "$INSTDIR\launcher"
    StrCpy $InstalledTomcat "$INSTDIR\launcher"
    File /r "${SOURCEDIR}\launcher"

    # do we still need this stuff?
    Pop $0
    Pop $R0

    WriteRegStr HKLM "${REGKEY}" ServiceName "${PRODUCT_NAME}Server"
#   WriteRegStr HKLM "${REGKEY}" ServiceConfigKey "SOFTWARE\Apache Software Foundation\Procrun 2.0\${PRODUCT_NAME}Server"
    WriteRegStr HKLM "${REGKEY}" InstalledTomcat $InstalledTomcat
    WriteRegDWORD HKLM "${REGKEY}" TomcatPort $TomcatPort
    WriteRegStr HKLM "${REGKEY}" AppFlags '-XX:MaxPermSize=400m'
    WriteRegStr HKLM "${REGKEY}\Components" "Apache Tomcat" 1
    SectionEnd
SectionGroupEnd

Section WaveMaker main
    SectionIn RO
    SetOutPath "$INSTDIR"
    ; Extract studio files
    SetOverwrite on
    File /r /x .svn /x *doc.jar /x *src.jar /x *sources.jar "${SOURCEDIR}\studio"
    
    ; Write Studio Config
    /*
    Push $0
    DetailPrint "Writing Studio Configuration..."
    DeleteRegKey HKU ".DEFAULT\SOFTWARE\JavaSoft\Prefs\com\activegrid"
    ClearErrors
    DetailPrint "Studio projects directory set to: $DeployDir\Projects"
    ExecWait '"$OUTDIR\jdk-1.6.0_24\bin\javaw.exe" -cp "$OUTDIR\studio\WEB-INF\lib\wmtools.jar" com.wavemaker.tools.project.StudioConfiguration set wavemakerHome "$DeployDir"' $0
    ${If} ${Errors}
        DetailPrint "Error($0) writing Studio configuration."
        ClearErrors
    ${Else}
        DetailPrint "Studio configuration written successfully."
    ${EndIf}
    Pop $0
    */

    ; Extract Studio Config App
    ClearErrors
    File /r /x .svn "${SOURCEDIR}\studioConfig"

    ; Extract Demo Directory
    ;ClearErrors
    ;File /r /x .svn /x *doc.jar /x *src.jar /x *sources.jar "${SOURCEDIR}\Samples"
    
    ; Configure Demos
    /*
    DetailPrint "Configuring Sample Projects Database Properties..."
    SetOutPath "$OUTDIR\Samples"
    Push $R0
    Push $R1
    ${RecFindOpen} "$OUTDIR\" $R0 $R1
    ${RecFindFirst}
        ; Write HSQLDB Connection Properties
        ${If} $R1 == "sakilalight.properties"
            ; Write Connection Properties
            ClearErrors
            Push $0
            Push $3
            Push $4
            ; Parse and Generate Absolute File Path:
            ; Strip everything after services
            DetailPrint "Target Dir: $R0"
            ${WordReplace} $R0 "sakilalight\src" "rolodexdb" "-1" $4
            DetailPrint "Base Services Directory: $4"
            ; Append rolodexdb - Construct path as PATH/rolodexdb
            StrCpy $4 "$OUTDIR$4\rolodex"
            ; Replace all '\' to '/'
            ${SwitchSlash} $3 $4 '\'
            ; Switch the first '/' to a '\'
            ${WordReplace} $3 '/' '\' '+1' $4
            ; Switch the drive prefix to be '<letter>:\'
            StrCpy $3 $4 3
            StrCpy $4 $4 "" 3
            StrCpy $4 "$3\$4"
            DetailPrint "HSQLDB Source: $4"
            DetailPrint "HSQLDB URL: jdbc\:hsqldb\:file\:$4;shutdown\=true"
            ; Write Service Properties
            DetailPrint "Writing: $OUTDIR$R0\$R1..."
            FileOpen $0 "$OUTDIR$R0\$R1" w
            IfErrors propertiesError
            FileWrite $0 "sakilalight.username=sa$\r$\n\
                sakilalight.dialect=org.hibernate.dialect.HSQLDialect$\r$\n\
                sakilalight.connectionUrl=jdbc\:hsqldb\:file\:$4;shutdown\=true;ifexists=true$\r$\n\
                sakilalight.password=$\r$\n\
                sakilalight.driverClassName=org.hsqldb.jdbcDriver$\r$\n"
            FileClose $0
            DetailPrint "$OUTDIR$R0\$R1 written successfully."
            Goto propertiesSuccess
            propertiesError:
                DetailPrint "Unable to write $OUTDIR$R0\$R1"
            propertiesSuccess:
            ClearErrors
            Pop $4
            Pop $3
            Pop $0
        ${EndIf}
    ; Loop
    ${RecFindNext}
    ; Cleanup
    ${RecFindClose}
    Pop $R1
    Pop $R0
    DetailPrint "Finished Configuring Sample Projects."
    */

    WriteRegStr HKLM "SOFTWARE\${PRODUCT_NAME}" LatestVersion ${VERSION}
    WriteRegStr HKLM "${REGKEY}" AppName 'wavemaker'
    WriteRegStr HKLM "${REGKEY}" Version "${VERSION}"
    WriteRegStr HKLM "${REGKEY}" VersionString "${LONGVERSION}"
    WriteRegStr HKLM "${REGKEY}\Components" Main 1
SectionEnd

Section -post SEC0001
    WriteRegStr HKLM "${REGKEY}" Path $INSTDIR
    SetOutPath $INSTDIR
    File /r /x .svn "${SOURCEDIR}\Support"
    File /oname=${PRODUCT_NAME}.ico wavemaker.ico
    File "${BUILDSUPPORTDIR}\LICENSE.txt"
    File "${BUILDSUPPORTDIR}\NOTICE.txt"
    File "${LICENSEFILE}"
    
    ; Create version.txt file
    ClearErrors
    File "${BUILDSUPPORTDIR}\VERSION.txt" 
    IfErrors error
    error:

    ; Create Uninstaller
    WriteUninstaller $INSTDIR\uninstall.exe
    !insertmacro MUI_STARTMENU_WRITE_BEGIN Application
    SetOutPath '$SMPROGRAMS\$StartMenuGroup'
    CreateShortcut "$SMPROGRAMS\$StartMenuGroup\${PRODUCT_NAME}-${Version}.lnk" "$INSTDIR\jdk-1.6.0_24\bin\javaw.exe" '-Xms256m -Xmx512m -XX:MaxPermSize=256m  -jar "$TomcatDir\launcher.jar"' "$INSTDIR\${PRODUCT_NAME}.ico" "" SW_SHOWNORMAL "" "${PRODUCT_NAME}: Web-Fast™ development of CIO-Safe™ applications."
    CreateShortcut "$SMPROGRAMS\$StartMenuGroup\Uninstall ${PRODUCT_NAME}.lnk" $INSTDIR\uninstall.exe
    !insertmacro MUI_STARTMENU_WRITE_END
    WriteRegStr HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}-${VERSION}" DisplayName "${PRODUCT_NAME}-${Version}"
    WriteRegStr HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}-${VERSION}" DisplayVersion "${VERSION}"
    WriteRegStr HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}-${VERSION}" Publisher "${COMPANY}"
    WriteRegStr HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}-${VERSION}" URLInfoAbout "${URL}"
    WriteRegStr HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}-${VERSION}" DisplayIcon $INSTDIR\uninstall.exe
    WriteRegStr HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}-${VERSION}" UninstallString $INSTDIR\uninstall.exe
    WriteRegDWORD HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}-${VERSION}" NoModify 1
    WriteRegDWORD HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}-${VERSION}" NoRepair 1

    ; Dump Log to File
    DumpLog::DumpLog "$INSTDIR\install.log" .R0
    ${If} $R0 == 1
        MessageBox MB_OK|MB_ICONEXCLAMATION "Unable to write installation log."
    ${Else}
        WriteRegStr HKLM "${REGKEY}" InstallLog "$INSTDIR\install.log"
    ${EndIf}

    Delete "$SMPROGRAMS\$StartMenuGroup\C"
SectionEnd

# Macro for selecting uninstaller sections
!macro SELECT_UNSECTION SECTION_NAME UNSECTION_ID
    Push $R0
    ReadRegStr $R0 HKLM "${REGKEY}\Components" "${SECTION_NAME}"
    StrCmp $R0 1 0 next${UNSECTION_ID}
    !insertmacro SelectSection "${UNSECTION_ID}"
    GoTo done${UNSECTION_ID}
next${UNSECTION_ID}:
    !insertmacro UnselectSection "${UNSECTION_ID}"
done${UNSECTION_ID}:
    Pop $R0
!macroend

# Section Descriptions

  ;Language strings
  ; LangString DESC_SecJava ${LANG_ENGLISH} "Install Sun Java Runtime Environment."

  ;Assign language strings to sections
  !insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
    !insertmacro MUI_DESCRIPTION_TEXT ${core} "Install the basic components required to run ${PRODUCT_NAME}."
    !insertmacro MUI_DESCRIPTION_TEXT ${java} "Install the Sun Java Development Kit."
    !insertmacro MUI_DESCRIPTION_TEXT ${tomcat} "Install and Deploy on Apache Tomcat Application Server."
    !insertmacro MUI_DESCRIPTION_TEXT ${main} "Installs the ${PRODUCT_NAME} application files."
  !insertmacro MUI_FUNCTION_DESCRIPTION_END

# Uninstaller sections
Section /o -un.WaveMaker UNSEC0002
/*
    MessageBox MB_YESNO|MB_ICONQUESTION|MB_TOPMOST "Are you sure you wish to remove all ${PRODUCT_NAME} projects from your computer?" /SD IDNO IDNO done
        DetailPrint "Removing ${PRODUCT_NAME} projects:"
        clearDirs:
        ClearErrors
        RmDir /r "$DeployDir"
        IfErrors 0 exit
            MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION|MB_TOPMOST 'Unable to remove "$DeployDir". Would you like to retry the operation?$\r$\nIf cancel is selected, the uninstall will request to reboot on completion and the files will be deleted on system startup.' /SD IDRETRY IDRETRY clearDirs
            RmDir /r /REBOOTOK $DeployDir
        exit:
        IfErrors done 0
            SetRebootFlag FALSE
*/
    done:
    DeleteRegValue HKLM "${REGKEY}" "DeployDir"
    DeleteRegValue HKLM "${REGKEY}\Components" Main
SectionEnd

Section /o "un.Tomcat" UNSEC0000
    ; Uninstall Tomcat Service
    DeleteRegValue HKLM "${REGKEY}\Components" "Apache Tomcat"
SectionEnd

Section /o "un.Sun Java 1.6+" UNSEC0001
    RmDir /r /REBOOTOK "$INSTDIR\jdk-1.6.0_24"
    DeleteRegValue HKLM "${REGKEY}\Components" "Sun Java Development Kit"
SectionEnd

Section -un.post UNSEC0003
    DetailPrint "Completing Uninstall:"
    DeleteRegKey HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}-${VERSION}"
    Push $1
    StrCpy $1 ""
    ReadRegStr $1 HKLM "SOFTWARE\${PRODUCT_NAME}" "LatestVersion"
    ${If} $1 != ""
        ; Previous Installation Detected
        ${VersionCompare} ${VERSION} $1 $0
        ${If} $0 = 0
            DeleteRegValue HKLM "SOFTWARE\${PRODUCT_NAME}" "LatestVersion"
        ${EndIf}
    ${EndIf}
    Delete /REBOOTOK "$INSTDIR\Shutdown ${PRODUCT_NAME}.lnk"
    Delete /REBOOTOK "$SMPROGRAMS\$StartMenuGroup\${PRODUCT_NAME}.lnk"
    Delete /REBOOTOK "$SMPROGRAMS\$StartMenuGroup\Uninstall ${PRODUCT_NAME}.lnk"
    Delete /REBOOTOK $INSTDIR\uninstall.exe
    DeleteRegValue HKLM "${REGKEY}" StartMenuGroup
    DeleteRegValue HKLM "${REGKEY}" Path
    DeleteRegKey /IfEmpty HKLM "${REGKEY}\Components"
    DeleteRegKey /IfEmpty HKLM "${REGKEY}"
    RmDir /REBOOTOK $SMPROGRAMS\$StartMenuGroup
    RmDir /REBOOTOK "$SMPROGRAMS\${PRODUCT_NAME}"
    clearDirs:
    ClearErrors
    RmDir /r "$INSTDIR"
    IfErrors 0 exit
        MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION|MB_TOPMOST 'Unable to remove "$INSTDIR". Would you like to retry the operation?$\r$\nIf cancel is selected, the uninstall will request to reboot on completetion and the files will be deleted on system startup.' /SD IDRETRY IDRETRY clearDirs
        RmDir /r /REBOOTOK "$INSTDIR"
    exit:
    IfErrors done 0
        SetRebootFlag FALSE
    done:
    Push $R0
    StrCpy $R0 $StartMenuGroup 1
    StrCmp $R0 ">" no_smgroup
    no_smgroup:
    Pop $R0
    IfRebootFlag 0 finish
        MessageBox MB_YESNO|MB_ICONQUESTION "The system needs to reboot in order to remove files which are currently locked.$\r$\nDo you wish to reboot the system?" IDNO finish
            Reboot
    finish:
SectionEnd

# Installer functions
Function .onInit
    BringToFront
; Validate installation conditions
    /* Allow only on instance of the installer/uninstaller to be running */
    ; Check if already running
    ; Create a named System mutex or retrieve the existing one
    System::Call 'kernel32::CreateMutexA(i 0, i 0, t "${PRODUCT_NAME}-${VERSION}_setup") i .r1 ?e'
    ; Read return value
    Pop $R0
    ; Verify that the call was successful
    ${If} $R0 <> 0
        ; Warn the user
        MessageBox MB_OK|MB_ICONEXCLAMATION "An instance of the ${PRODUCT_NAME} installer is already running."
        ; Bring the previous instance to front
        StrLen $0 "${PRODUCT_NAME}" ; Find the length of the title
        IntOp $0 $0 + 1 ; Add one for the NUL
        ; Loop over all open windows
        ${Do}
            ; Find the next window
            FindWindow $1 '#32770' '' 0 $1 
            ; Check for error
            ${If} $1 <> 0
                ; Get current window title
                System::Call "user32::GetWindowText(i r1, t .r2, i r0) i."
                ; Compare window title to the product name (the installer window title is the product name)
                ${If} $2 == "${PRODUCT_NAME}"
                    ; If minimized then restore it
                    System::Call "user32::ShowWindow(i r1,i 9) i."
                    ; Bring it to the front         
                    System::Call "user32::SetForegroundWindow(i r1) i."
                    ; Break
                    ${Break}
                ${EndIf}
            ${EndIf}
        ${Loop}
        ; Abort the installation
        Abort
    ${EndIf}

    ; Check for previous installation
    ReadRegStr $0 HKLM ${REGKEY} "Path"
    ${If} $0 != ""
        IfFileExists $0 Valid ""
            MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION|MB_TOPMOST "A previous damaged installation of ${PRODUCT_NAME} has been found. Press OK to clean-up the old installation and proceed." /SD IDOK IDOK Clean
                Abort
        Clean:
            DeleteRegKey HKLM ${REGKEY}
            Goto Begin
    ${EndIf}
    Valid:
        Push $5
        StrCpy $5 ""
        StrCpy $1 ""
        ReadRegStr $1 HKLM "SOFTWARE\${PRODUCT_NAME}" "LatestVersion"
        ClearErrors
        ${If} $1 == ""
            ReadRegStr $1 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" DisplayVersion
            StrCpy $5 "Old"
        ${EndIf}
        ${If} $1 != ""
            Push $4
            StrCpy $4 '1'
            ; Previous Installation Detected
            ${VersionCompare} ${VERSION} $1 $0
            ${If} $0 = 1
                ; Older Version
                StrCpy $3 'A previous version of ${PRODUCT_NAME}($1) has been found. Would you like to uninstall the previous version?$\r$\nClick "Yes" to uninstall the previous version.$\r$\nClick "No" to continue installing ${PRODUCT_NAME} ${VERSION}.'
                MessageBox MB_YESNO|MB_ICONQUESTION|MB_TOPMOST $3 /SD IDYES IDNO "IgnoreUnInstall"
                   ; Read UninstallString
                   ${If} $5 == "Old"
                      ReadRegStr $4 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" UninstallString
                   ${Else}
                      ReadRegStr $4 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}-$1" UninstallString
                   ${EndIf}
                   ; Write Studio Config
                   Push $0
                   DetailPrint "Running uninstaller..."
                   ClearErrors
                   ExecWait '"$4"' $0
                   ${If} ${Errors}
                      DetailPrint "Error($0) uninstalling old installation."
                      ClearErrors
                   ${Else}
                      DetailPrint "Old installation uninstalled successfully."
                   ${EndIf}
                   Pop $0
                IgnoreUnInstall:
                   StrCpy $4 '0'
            ${ElseIf} $0 = 2
                ; Newer Version
                StrCpy $3 "A newer version of ${PRODUCT_NAME}($1) is already installed. Please uninstall the newer version to run this installer."
            ${Else}
                ; Same Version
                StrCpy $3 "This version of ${PRODUCT_NAME}($1) is already installed. Please use the existing installation or uninstall the previous installation before running this installer."
            ${EndIf}
            ${If} $4 == '1'
                MessageBox MB_OK|MB_ICONEXCLAMATION|MB_TOPMOST $3 /SD IDOK IDOK ""
                Pop $4
                Abort
            ${EndIf}
        ; ${EndIf}
    ${EndIf}
    Pop $4

    Begin:
    Pop $5
    IntOp $TomcatPort ${TOMCAT_PORT} + 0
    ; Begin the installer
    InitPluginsDir
FunctionEnd

Function Components_PreFunction
    !insertmacro SelectSection ${java}
    !insertmacro SelectSection ${tomcat}
    abort
FunctionEnd

Function ProjectsDirectoryPage
    Push $0

    ; Set Header Text
    !insertmacro MUI_HEADER_TEXT "Choose Projects Folder" "Select the location to store ${PRODUCT_NAME} projects."
    StrCpy $DeployDir "$DOCUMENTS\${PRODUCT_NAME}\${VERSION}"
    ; Create Dialog
    nsDialogs::Create /NOUNLOAD 1018
    Pop $ProjectsDialog
    ${If} $ProjectsDialog == error
        Abort
    ${EndIf}

    ; Populate Dialog
    ${NSD_CreateLabel} 0 0 100% 48u "${PRODUCT_NAME} will save new projects to the selected folder. To select to a different folder, click Browse and select the directory you wish to use. Click Next to continue."
    Pop $0

    ${NSD_CreateLabel} 0 50% 100% 12u "Select the ${PRODUCT_NAME} projects directory:"
    Pop $ProjectsDirectoryLabel

    ; ${NSD_CreateDirRequest} 0 24 90% 14u "$DOCUMENTS\${PRODUCT_NAME}"
    ${NSD_CreateDirRequest} 0 60% 90% 14u "$DOCUMENTS\${PRODUCT_NAME}\${VERSION}"
    Pop $ProjectsDirectoryInput
    ; GetFunctionAddress $0 DirectoryChanged
    ; nsDialogs::OnChange /NOUNLOAD $ProjectsDirectoryInput $0
    ${NSD_OnChange} $ProjectsDirectoryInput DirectoryChanged
   
    ${NSD_CreateBrowseButton} -160 76% 20% 14u "Browse"
    Pop $ProjectsDirectoryButton
    GetFunctionAddress $0 ProjectsDirectoryPageBrowse
    nsDialogs::OnClick /NOUNLOAD $ProjectsDirectoryButton $0
    Pop $0

    ; Show Dialog
    nsDialogs::Show
    
FunctionEnd

Function ProjectsDirectoryPageBrowse
    Push $0
    nsDialogs::SelectFolderDialog /NOUNLOAD "Select the folder ${PRODUCT_NAME} will store projects in:" $ProjectsDialog
    Pop $0
    ${If} $0 != error
        ${NSD_SetText} $ProjectsDirectoryInput $0
    ${EndIf}
    Pop $0
    
FunctionEnd

Function DirectoryChanged
    Pop $0 # HWND to textfield aka $ProjectsDirectoryInput
    Push $1
    Push $2
    FindWindow $2 "#32770" "" ""    # Find navigation window
    GetDlgItem $1 $2 1              # Get next/install button
    ${NSD_GetText} $ProjectsDirectoryInput $1 # Read current directory text
    ${If} $1 == ""
        EnableWindow $1 0   # Disable Button
    ${Else}
        EnableWindow $1 1   # Enable Button
    ${EndIf}
    Pop $2
    Pop $1
FunctionEnd

Function RunLauncherPageFunction
		MessageBox MB_USERICON|MB_TOPMOST|MB_OK 'Launching configuration tool. The configuration tool will help you install dependencies required to complete installation '
		Exec '"$INSTDIR\jdk-1.6.0_24\bin\javaw.exe" -Xms256m -Xmx512m -XX:MaxPermSize=256m  -jar "$TomcatDir\launcher.jar"'
FunctionEnd


Function ProjectsDirectoryPageLeave
    Push $0
    ${NSD_GetText} $ProjectsDirectoryInput $0
    ${If} $0 == ""
        MessageBox MB_ICONEXCLAMATION|MB_TOPMOST|MB_OK 'A valid projects directory must be selected to continue installing ${PRODUCT_NAME}.'
        Abort 
    ${EndIf}
    IfFileExists $0 directoryExists
        MessageBox MB_ICONQUESTION|MB_TOPMOST|MB_YESNO 'The selected projects directory, "$0", does not exist.$\r$\nWould you like to create it?' /SD IDYES IDYES end 
            Abort
        end:
            ClearErrors
            CreateDirectory $0
            IfErrors 0 createDeployDirEnd
                DetailPrint 'Error: Unable to create projects directory("$0").'
                MessageBox MB_ICONEXCLAMATION|MB_TOPMOST|MB_OK 'Error: Unable to create "$0".$\r$\nA valid projects directory must be selected to continue installing ${PRODUCT_NAME}.'
                Abort                
            createDeployDirEnd:
    directoryExists:
        StrCpy $DeployDir $0
    Pop $0
FunctionEnd

Function .onSelChange
FunctionEnd

# Uninstaller functions
Function un.onInit
    BringToFront
    InitPluginsDir
    /* Allow only on instance of the installer/uninstaller to be running */
    ; Create a named System mutex or retrieve the existing one
    System::Call 'kernel32::CreateMutexA(i 0, i 0, t "${PRODUCT_NAME}_setup") i .r1 ?e'
    ; Read return value
    Pop $R0
    ; Verify that the call was successful
    ${If} $R0 != 0
        ; Abort the installation
        MessageBox MB_OK|MB_ICONEXCLAMATION "An instance of the ${PRODUCT_NAME} installer is already running.$\r$\nPlease close the other instance before attempting to run the uninstaller."
        Abort
    ${EndIf}

    ReadRegStr $INSTDIR HKLM "${REGKEY}" Path
    #ReadRegStr $DeployDir HKLM "${REGKEY}" "DeployDir"

    !insertmacro MUI_STARTMENU_GETFOLDER Application $StartMenuGroup
    !insertmacro SELECT_UNSECTION WaveMaker ${UNSEC0002}
    !insertmacro SELECT_UNSECTION "Apache Tomcat" ${UNSEC0000}
    !insertmacro SELECT_UNSECTION "Sun Java 1.6+" ${UNSEC0001}
FunctionEnd

Function un.onSelChange 
FunctionEnd

Function un.Components_PreFunction
    abort
FunctionEnd

# User Functions

; Push $filenamestring (e.g. 'c:\this\and\that\filename.htm')
; Push "\"
; Call StrSlash
; Pop $R0
; ;Now $R0 contains 'c:/this/and/that/filename.htm'
Function StrSlash
  Exch $R3 ; $R3 = needle ("\" or "/")
  Exch
  Exch $R1 ; $R1 = String to replacement in (haystack)
  Push $R2 ; Replaced haystack
  Push $R4 ; $R4 = not $R3 ("/" or "\")
  Push $R6
  Push $R7 ; Scratch reg
  StrCpy $R2 ""
  StrLen $R6 $R1
  StrCpy $R4 "\"
  StrCmp $R3 "/" loop
  StrCpy $R4 "/"  
loop:
  StrCpy $R7 $R1 1
  StrCpy $R1 $R1 $R6 1
  StrCmp $R7 $R3 found
  StrCpy $R2 "$R2$R7"
  StrCmp $R1 "" done loop
found:
  StrCpy $R2 "$R2$R4"
  StrCmp $R1 "" done loop
done:
  StrCpy $R3 $R2
  Pop $R7
  Pop $R6
  Pop $R4
  Pop $R2
  Pop $R1
  Exch $R3
FunctionEnd

/* AdvReplaceInFile
 * Original Written by Afrow UK
 * Rewrite to Replace on line within text by rainmanx
 * This version works on R4 and R3 of Nullsoft Installer
 * It replaces whatever is in the line throughout the entire text matching it.
 */
Function AdvReplaceInFile
Exch $0 ;file to replace in
Exch
Exch $1 ;number to replace after
Exch
Exch 2
Exch $2 ;replace and onwards
Exch 2
Exch 3
Exch $3 ;replace with
Exch 3
Exch 4
Exch $4 ;to replace
Exch 4
Push $5 ;minus count
Push $6 ;universal
Push $7 ;end string
Push $8 ;left string
Push $9 ;right string
Push $R0 ;file1
Push $R1 ;file2
Push $R2 ;read
Push $R3 ;universal
Push $R4 ;count (onwards)
Push $R5 ;count (after)
Push $R6 ;temp file name
;-------------------------------
GetTempFileName $R6
FileOpen $R1 $0 r ;file to search in
FileOpen $R0 $R6 w ;temp file
StrLen $R3 $4
StrCpy $R4 -1
StrCpy $R5 -1
loop_read:
ClearErrors
FileRead $R1 $R2 ;read line
IfErrors exit
StrCpy $5 0
StrCpy $7 $R2
loop_filter:
IntOp $5 $5 - 1
StrCpy $6 $7 $R3 $5 ;search
StrCmp $6 "" file_write2
StrCmp $6 $4 0 loop_filter
StrCpy $8 $7 $5 ;left part
IntOp $6 $5 + $R3
StrCpy $9 $7 "" $6 ;right part
StrLen $6 $7
StrCpy $7 $8$3$9 ;re-join
StrCmp -$6 $5 0 loop_filter
IntOp $R4 $R4 + 1
StrCmp $2 all file_write1
StrCmp $R4 $2 0 file_write2
IntOp $R4 $R4 - 1
IntOp $R5 $R5 + 1
StrCmp $1 all file_write1
StrCmp $R5 $1 0 file_write1
IntOp $R5 $R5 - 1
Goto file_write2
file_write1:
FileWrite $R0 $7 ;write modified line
Goto loop_read
file_write2:
FileWrite $R0 $7 ;write modified line
Goto loop_read
exit:
FileClose $R0
FileClose $R1
SetDetailsPrint none
Delete $0
Rename $R6 $0
Delete $R6
SetDetailsPrint both

; Cleanup and restore registers
Pop $R6
Pop $R5
Pop $R4
Pop $R3
Pop $R2
Pop $R1
Pop $R0
Pop $9
Pop $8
Pop $7
Pop $6
Pop $5
Pop $4
Pop $3
Pop $2
Pop $1
Pop $0
FunctionEnd


# This program may be used, executed, copied, modified and distributed
# without royalty for the purpose of developing, using, marketing, or distribution

#---------------------------------------------------
# LTPA_LDAPSecurity procs
#---------------------------------------------------
# This script is used to turn on LTPA/LDAP Security 
from time import sleep
import java

#-------------------------------------------------------
# get the line separator and use to do the parsing 
# since the line separator on different platform are different
lineSeparator = java.lang.System.getProperty('line.separator')
#-------------------------------------------------------

#-------------------------------------------------------------------------------
# initialize ldap server required attributes and values
#-------------------------------------------------------------------------------
ldapServer  = ""
ldapServerId = ""
ldapPassword = ""
ldapPort = ""
domainHostname = ""

#-------------------------------------------------------------------------------
# variables to save the return values
#-------------------------------------------------------------------------------
cellName = ""
nodeName = ""
flag = ""
securityId = ""
ltpaId = ""
ldapUserRegistryId = ""
secMbean = ""


#-------------------------------------------------------------------------------
# check if base or nd environment
#-------------------------------------------------------------------------------

def whatEnv():
    global AdminControl, lineSeparator, cellName, nodeName, flag
    nodeName = AdminControl.getNode()
    cellName = AdminControl.getCell()
    command = "AdminControl.completeObjectName('type=Server,node=" + nodeName + ",cell=" + cellName + ",*')"
    serverList = eval(command)
    server = serverList.split(lineSeparator)[0]
    processType = AdminControl.getAttribute(server,'processType')
    # find out what environment
    if processType == "DeploymentManager":
	# nd environment
        flag = 'nd'
    elif (processType == "ManagedProcess" or processType == "NodeAgent"):
	print "This script was not run by connecting to dmgr process\n"
	print "Please rerun the script connecting to dmgr process\n"
	return
    elif (processType == "AdminAgent"):
        flag = 'adminagent'
    else:
        # base environment
        flag = 'base'

#-------------------------------------------------------------------------------
# get Security id
#-------------------------------------------------------------------------------
def getSecId():
    global AdminControl, AdminConfig, securityId, cellName
    try:
	param = "/Cell:" + cellName + "/Security:/"
        securityId = AdminConfig.getid(param)
        if len(securityId) == 0:
            print "Security ConfigId was not found\n"
            return

        print "Got Security ConfigId is " + securityId + "\n"
    except:
        print "AdminConfig.getid(" + param + ") caught an exception\n"


#-------------------------------------------------------------------------------
# get LTPA config id
#-------------------------------------------------------------------------------
def getLTPAId():
    global AdminConfig, lineSeparator, ltpaId
    try:
        ltpaObjects = AdminConfig.list("LTPA")
        if len(ltpaObjects) == 0:
            print "LTPA ConfigId was not found\n"
            return

        ltpaId = ltpaObjects.split(lineSeparator)[0]
        print "Got LTPA ConfigId is " + ltpaId + "\n"
    except:
        print "AdminConfig.list('LTPA') caught an exception\n"
    return


#-------------------------------------------------------------------------------
# get LDAPUserRegistry id
#-------------------------------------------------------------------------------
def getLDAPUserRegistryId():
    global AdminConfig, lineSeparator, ldapUserRegistryId
    try:
        ldapObject = AdminConfig.list("LDAPUserRegistry")
        if len(ldapObject) == 0:
            print "LDAPUserRegistry ConfigId was not found\n"
            return

        ldapUserRegistryId = ldapObject.split(lineSeparator)[0]
        print "Got LDAPUserRegistry ConfigId is " + ldapUserRegistryId + "\n"
    except:
        print "AdminConfig.list('LDAPUserRegistry') caught an exception\n"
    return


#-------------------------------------------------------------------------------
# get the SecurityAdmin mbean
#-------------------------------------------------------------------------------
def getSecurityAdminMbean():
    global AdminControl, lineSeparator, secMbean, flag, cellName, nodeName
    if flag == 'nd':
       try:
          secMbeans = AdminControl.queryNames('WebSphere:type=SecurityAdmin,cell='+cellName+',node='+nodeName+',*')
          if len(secMbeans) == 0:
             print "Security Mbean was not found\n"
             return

          secMbean = secMbeans.split(lineSeparator)[0]
          print "Got Security Mbean is " + secMbean + "\n"
       except:
          print "AdminControl.queryNames('WebSphere:type=SecurityAdmin,cell='+cellName+',node='+nodeName+',*') caught an exception\n"
          return
    else:
       try:
          secMbeans = AdminControl.queryNames('WebSphere:type=SecurityAdmin,*') 
          if len(secMbeans) == 0:
             print "Security Mbean was not found\n"
             return

          secMbean = secMbeans.split(lineSeparator)[0]
          print "Got Security Mbean is " + secMbean + "\n"
       except:
          print "AdminControl.queryNames('WebSphere:type=SecurityAdmin,*') caught an exception\n"
          return
     
#-------------------------------------------------------------------------------
# generate LTPA keys
#-------------------------------------------------------------------------------
def generateLTPAKeys():
    print "generateLTPAKeys has been deprecated in IBM WebSphere v6.1\n"
    return
        

#-------------------------------------------------------------------------------
# exportLTPAKeys to get the key value to set private, public and shared key
#-------------------------------------------------------------------------------
def exportLTPAKey():
    print "exportLTPAKeys has been deprecated in IBM WebSphere v6.1\n"



#-------------------------------------------------------------------------------
# setup attribute values for AuthenticationMechanism using LTPA ConfigId
#-------------------------------------------------------------------------------
def doAuthenticationMechanism():
    global AdminConfig, domainHostname, ltpaId
    attrs1 = [["singleSignon", [["requiresSSL", "false"], ["domainName", domainHostname], ["enabled", "true"]]]]

    if len(ltpaId) > 0:
        try:
            AdminConfig.modify(ltpaId, attrs1)
            try:
                #AdminConfig.save()
                print "Done setting up attributes values for AuthenticationMechanism"
                print "Updated was saved successfully\n"
            except:
                print "AdminConfig.save() caught an exception\n"
        except:
            print "AdminConfig.modify(" + ltpaId + ", " + attrs1 + ") caught an exception\n"
    else:
        print "LTPA configId was not found\n"
    return
            
            

#-------------------------------------------------------------------------------
# setup attribute values for LDAPUserRegistry using LDAPUserRegistry ConfigId
#-------------------------------------------------------------------------------
def doLDAPUserRegistry():
    global AdminConfig, ldapServer, ldapServerId, ldapPassword, ldapPort, domainHostname, ldapUserRegistryId
    attrs2 = [["serverId", ldapServerId], ["serverPassword", ldapPassword], ["realm", ldapServer+":"+ldapPort], ["type", "IBM_DIRECTORY_SERVER"], ["baseDN", "o=ibm,c=us"], ["reuseConnection", "true"], ["useRegistryServerId", "true"], ["hosts", [[["host", ldapServer], ["port", ldapPort]]]]]
    if len(ldapUserRegistryId) > 0:
        try:
            hostIdList = AdminConfig.showAttribute(ldapUserRegistryId, "hosts")
            if len(hostIdList) > 0:
                hostIdLength = len(hostIdList) - 1
                hostIdLists =  hostIdList[1:hostIdLength].split(" ")
                for hostId in hostIdLists:
                    AdminConfig.remove(hostId)
                    print "Removed hostId " + hostId + "\n"
                    AdminConfig.save()
                    print "Save the change\n"
            try:
                AdminConfig.modify(ldapUserRegistryId, attrs2)
                try:
                    AdminConfig.save()
                    print "Done setting up attributes values for LDAP User Registry"
                    print "Updated was saved successfully\n"
                except:
                    print "AdminConfig.save() caught an exception\n"
            except:
                print "AdminConfig.modify(" + ldapUserRegistryId + ", " + attrs2 + ") caught an exception\n"
        except:
            print "AdminConfig.showAttribute(" + ldapUserRegistryId + ", 'hosts') caught an exception\n"
    else:
        print "LDAPUserRegistry ConfigId was not found\n"
    return


#-------------------------------------------------------------------------------
# setup attribute values to enable security using Security ConfigId
#-------------------------------------------------------------------------------
def doGlobalSecurity():
    global AdminConfig, securityId, ltpaId, ldapUserRegistryId
    attrs3 = [["activeAuthMechanism", ltpaId], ["activeUserRegistry", ldapUserRegistryId], ["enabled", "true"], ["enforceJava2Security", "true"]]
    if (len(securityId) > 0) or (len(ltpaId) > 0) or (len(ldapUserRegistryId) > 0):
        try:
            AdminConfig.modify(securityId, attrs3)
            try:
                AdminConfig.save()
                print "Done setting up attributes values for Global Security done"
                print "Updated was saved successfully\n"
            except:
                print "AdminConfig.save() caught an exception\n"
        except:
            print "AdminConfig.modify(" + securityId + ", " + attrs3 + ") caught an exception\n"
    else:
        print "Any of the Security, LTPA or LDAPUserRegistry ConfigId was not found\n"
    return


#-------------------------------------------------------------------------------
# setup attribute values to disable security using Security ConfigId
#-------------------------------------------------------------------------------
def doGlobalSecurityDisable():
    global AdminConfig, securityId
    attrs4 = [["enabled", "false"]]
    if len(securityId) > 0:
        try:
            AdminConfig.modify(securityId, attrs4)
            try:
                AdminConfig.save()
                print "Done setting up attributes values for Global Security"
                print "Updated was saved successfully\n"
            except:
                print "AdminConfig.save() caught an exception\n"
        except:
            print "AdminConfig.modify(" + securityId + ", " + attrs4 + ") caught an exception\n"
    else:
        print "Security configId was not found\n"
    return


#-------------------------------------------------------------------------------
# force to do the sync here and put in wait to give time for sync to finish
#-------------------------------------------------------------------------------
def forceSync():
    global AdminControl 
    try:
        nodeSyncObjects = AdminControl.queryNames("type=NodeSync,*")
        if len(nodeSyncObjects) > 0:
            nodeSyncObjectList = nodeSyncObjects.split("\r\n")
            for nodeSync in nodeSyncObjectList:
                syncResult = "false"
                count = 0
                while syncResult != "true" and count < 5:
                    print "Force NodeSync on " + nodeSync
                    try:
                        syncResult = AdminControl.invoke(nodeSync, "sync", "")
                        print "Sync result on " + nodeSync + " is " + syncResult
                    except:
                        print "AdminControl.invoke(" + nodeSync + ", 'sync', '') caught an exception\n"
                    count = count + 1
                if syncResult != true:
                    print "Unable to sync " + nodeSync
            print "Time out for 1 minute to make sure sync is done"
            sleep(45) 
    except:
        print "AdminControl.queryNames('type=NodeSync,*') caught an exception\n"
    return

           
#-----------------------------------------------------------------------
#
# LTPA_LDAPSecurityon -- this takes the LDAP server, user, password, 
#               port, and domain as argumnets to setup and turn on LTPA 
#               and LDAP security.
#
#-----------------------------------------------------------------------
def LTPA_LDAPSecurityOn(server=None, user=None, password=None, port=None, domain=None):
    global ldapServer, ldapServerId, ldapPassword, ldapPort, domainHostname, flag
  
    if (domain is None):
        print "Syntax: LTPA_LDAPSecurityOn(server, user, password, port, domain)"
        return

    ldapServer = server
    ldapServerId = user
    ldapPassword = password
    ldapPort = port
    domainHostname = domain

    whatEnv()

    if (flag == 'nd' or flag == 'base' or flag == 'adminagent'):
       getSecId()
       getLTPAId()
       getLDAPUserRegistryId()
       getSecurityAdminMbean()
       doAuthenticationMechanism()
       doLDAPUserRegistry()
       doGlobalSecurity()
       forceSync()

       print "\n\nPLEASE READ BELOW:"
       print "Done with LTPA/LDAP security turning on process, now you need to restart all the processes to make it affected.\n" 
       print "Then you can start using the client with SOAP, RMI, JSR160RMI or IPC connector.\n"
       print "If you are using SOAP Connector to connect to the server, you will be prompted to enter the \"userid\" and the \"password\". If you want to by pass the login process, you need to modify soap.client.props file in your <profile_root>/properties directory.\n"
       print "Update as below for SOAP connector:"
       print "com.ibm.SOAP.securityEnabled=true"
       print "com.ibm.SOAP.loginSource=properties"
       print "com.ibm.SOAP.loginUserid=" + ldapServerId
       print "com.ibm.SOAP.loginPassword=" + ldapPassword + "\n\n"
       print "If you are using RMI or JSR160RMI Connector to connect to the server, you will be prompted to enter the \"userid\" and the \"password\". If you want to by pass the login process, you need to modify sas.client.props file in your <profile_root>/properties directory.\n"
       print "Update as below for RMI or JSR160RMI connector:"
       print "com.ibm.CORBA.loginSource=properties"
       print "com.ibm.CORBA.loginUserid=" + ldapServerId
       print "com.ibm.CORBA.loginPassword=" + ldapPassword + "\n\n"
       print "If you are using IPC Connector to connect to the server, you will be prompted to enter the \"userid\" and the \"password\". If you want to by pass the login process, you need to modify ipc.client.props file in your <profile_root>/properties directory.\n"
       print "Update as below for IPC connector:"
       print "com.ibm.IPC.securityEnabled=true"
       print "com.ibm.IPC.loginSource=properties"
       print "com.ibm.IPC.loginUserid=" + ldapServerId
       print "com.ibm.IPC.loginPassword=" + ldapPassword + "\n\n"
       return


#-----------------------------------------------------------------------
#
# LTPA_LDAPSecurityOff -- this disables the LTPA/LDAP security.
#
#-----------------------------------------------------------------------
def LTPA_LDAPSecurityOff():
    global flag
    whatEnv()
    
    if (flag == 'nd' or flag == 'base'):
       getSecId()
       doGlobalSecurityDisable()
       forceSync()

       print "LTPA/LDAP security is off now but you need to restarted all the processes to make it affected.\n"
       return
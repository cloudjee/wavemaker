# This program may be used, executed, copied, modified and distributed
# without royalty for the purpose of developing, using, marketing, or distribution

#---------------------------------------------------
# Security procs
#---------------------------------------------------
#
# checkuserpw - this takes a user and password as 
#               arguments and checks with the MBean server to see 
#               if they are valid. 
# 
#---------------------------------------------------

def checkuserpw(user, pw): 
    global AdminControl

    # find the SecurityAdmin MBean.  If there is more than one,
    # we just take the first.  This probably needs to be fine-tuned
    # for a distributed environment.
    secadms = AdminControl.queryNames("type=SecurityAdmin,*")
    if len(secadms) == 0:
        return 0;

    secadm = secadms.split("\r\n")[0];
    plist = user + " " + pw + " " + "[]";

    # the following command throws an exception and exits the
    # script if the password doesn't match.
    result = AdminControl.invoke(secadm, "checkPassword", plist)
    return result

#---------------------------------------------------
#
# securityon -- this takes a user and password as 
#               arguments and enables security.  
#
#               This proc only deals with LocalOS security
# 
#---------------------------------------------------

def securityon(user=None, password=None):
    global AdminConfig
    global AdminControl
  
    if (password is None):
        print "Syntax: securityon(user, password)"
        return

    # the following assumes we have but one cell
    cells = AdminConfig.list("Cell")
    if len(cells) == 0:
       return

    cell = cells.split("\r\n")[0] 

    secObjects = AdminConfig.list("Security", cell)
    if len(secObjects) == 0:
       return 0

    secObject = secObjects.split("\r\n")[0]

    if checkuserpw(user, password) == 0:
        print "Cannot contact SecurityAdmin to verify password"
        return 0

    # get the REALM 
    secadms = AdminControl.queryNames("type=SecurityAdmin,*")
    if len(secadms) == 0:
        return 0

    secadm = secadms.split("\r\n")[0];
    realm = AdminControl.invoke(secadm, "getRealm", "[[]]")
    attrs = [["serverId", user], ["serverPassword", password], ["useRegistryServerId", "true"], ["realm", realm]]
    
  
    # get a list of the userRegistry contents
    registryList = AdminConfig.showAttribute(secObject, "userRegistries")
    # remove the list syntax
    localUserReg = ""
    if len(registryList) != 0:
        registryLength = len(registryList) - 1
        registries =  registryList[1:registryLength].split(" ")
        for reg in registries:
            if reg.find("LocalOSUserRegistry") != -1:
                AdminConfig.modify(reg, attrs) 
                localUserReg = reg
                break

        if localUserReg == "":
            print "Cannot find local OS user registry."
            return 0
    else:
        return 0

    attrs = [["enabled", "true"], ["activeUserRegistry", localUserReg]]
    AdminConfig.modify(secObject, attrs)
    AdminConfig.save()
   
    print "\n\nPLEASE READ BELOW:"
    print "Done with LOCAL OS security turning on process, now you need to restart the connected server to make it affected." 
    print "Then you can start using the client with SOAP, RMI, JSR160RMI or IPC connector.\n"
    print "If you are using SOAP Connector to connect to the server, you will be prompted to enter the \"userid\" and the \"password\". If you want to by pass the login process, you need to modify soap.client.props file in your <profile_root>/properties directory.\n"
    print "Update as below for SOAP connector:"
    print "com.ibm.SOAP.securityEnabled=true"
    print "com.ibm.SOAP.loginSource=properties"
    print "com.ibm.SOAP.loginUserid=" + user
    print "com.ibm.SOAP.loginPassword=" + password + "\n\n"
    print "If you are using RMI or JSR160RMI Connector to connect to the server, you will be prompted to enter the \"userid\" and the \"password\". If you want to by pass the login process, you need to modify sas.client.props file in your <profile_root>/properties directory.\n"
    print "Update as below for RMI or JSR160RMI connector:"
    print "com.ibm.CORBA.loginSource=properties"
    print "com.ibm.CORBA.loginUserid=" + user
    print "com.ibm.CORBA.loginPassword=" + password + "\n\n"
    print "If you are using IPC Connector to connect to the server, you will be prompted to enter the \"userid\" and the \"password\". If you want to by pass the login process, you need to modify ipc.client.props file in your <profile_root>/properties directory.\n"
    print "Update as below for IPC connector:"
    print "com.ibm.IPC.securityEnabled=true"
    print "com.ibm.IPC.loginSource=properties"
    print "com.ibm.IPC.loginUserid=" + user
    print "com.ibm.IPC.loginPassword=" + password + "\n\n"
    return

#---------------------------------------------------
#
# securityoff --  disables security "enabled" flag
# 
#---------------------------------------------------

def securityoff():
    global AdminConfig

    # the following assumes we have but one cell
    cells = AdminConfig.list("Cell")
    if len(cells) == 0:
       return

    cell = cells.split("\r\n")[0] 

    secObjects = AdminConfig.list("Security", cell)
    if len(secObjects) == 0:
       return 0

    secObject = secObjects.split("\r\n")[0]

    attrs = [["enabled", "false"]]
    AdminConfig.modify(secObject, attrs)
    AdminConfig.save()

    print "LOCAL OS security is off now but you need to restart the connected server to make it affected.\n"
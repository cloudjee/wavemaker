Readme:

1. Customize the following line in Deployment.bat to point to the IBM JDK.  The IBM JDK can be copied from your WebSphere installation.

	set path=C:/IBMJava/java/bin;%path%

2. Make sure that your SOAP port ponits to the correct port number.  The SOAP port is defined in serverindex.xml for your server instance.  The element name is "SOAP_CONNECTOR_ADDRESS".

*** Skip the following steps if your WebSphere is NOT secured ***

3. Copy trust.p12 from your server instance to your websphere client environment (...../websphere/etc).

4. Change the value of the user.root property in ssl.client.props in your websphere client environment (...../websphere/properties).
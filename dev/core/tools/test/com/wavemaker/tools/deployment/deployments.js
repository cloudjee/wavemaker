{
	"projectDeployments": {
		"foo": [{
			"applicationName": "stubby1",
			"archiveType": null,
			"databases": [{
				"connectionUrl": "jdbc:mysql://localhost:3306/foo",
				"dataModelId": "foo",
				"dbName": "foo",
				"jndiName": null,
				"password": "mcfly",
				"serviceName": null,
				"username": "marty"
			}],
			"deploymentId": "foo0",
			"deploymentType": "TOMCAT",
			"host": "localhost",
			"name": "Stubby 1 Tomcat Deployment",
			"password": "manager",
			"port": 8080,
			"target": null,
			"username": "manager"
		}, {
			"applicationName": "stubby1",
			"archiveType": null,
			"databases": [{
				"connectionUrl": null,
				"dataModelId": "foo",
				"dbName": "foo",
				"jndiName": null,
				"password": null,
				"serviceName": "mysql-4b710",
				"username": null
			}],
			"deploymentId": "foo1",
			"deploymentType": "CLOUD_FOUNDRY",
			"host": null,
			"name": "Stubby 1 CloudFoundry Deployment",
			"password": "cfLoginToken",
			"port": 0,
			"target": "api.cloudfoundry.com",
			"username": "joe@vmware.com"
		}, {
			"applicationName": "stubby1",
			"archiveType": "WAR",
			"databases": [],
			"deploymentId": "foo2",
			"deploymentType": "FILE",
			"host": null,
			"name": "Stubby 1 WAR Deployment",
			"password": null,
			"port": 0,
			"target": null,
			"username": null
		}],
		"bar": [{
			"applicationName": "stubby1",
			"archiveType": null,
			"databases": [{
				"connectionUrl": "jdbc:mysql://localhost:3306/foo",
				"dataModelId": "foo",
				"dbName": "foo",
				"jndiName": null,
				"password": "mcfly",
				"serviceName": null,
				"username": "marty"
			}],
			"deploymentId": "bar0",
			"deploymentType": "TOMCAT",
			"host": "localhost",
			"name": "Stubby 1 Tomcat Deployment",
			"password": "manager",
			"port": 8080,
			"target": null,
			"username": "manager"
		}]
	}
}
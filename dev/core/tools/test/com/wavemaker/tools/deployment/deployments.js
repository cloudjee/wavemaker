{
	"projectDeployments": {
		"foo": [{
			"applicationName": "stubby1",
			"archiveType": "WAR",
			"databases": [{
				"connectionUrl": "jdbc:mysql://localhost:3306/foo",
				"dataModelId": "foo",
				"dbName": "foo",
				"jndiName": null,
				"password": "7b6a43524a282e1c67753a21080c6812",
				"serviceName": null,
				"username": "marty"
			}],
			"deploymentId": "foo0",
			"deploymentType": "TOMCAT",
			"host": "localhost",
			"name": "Stubby 1 Tomcat Deployment",
			"password": "7b6a43524a282c146a6b626e425c32205754",
			"port": 8080,
			"target": null,
			"username": "manager"
		}, {
			"applicationName": "stubby1",
			"archiveType": "WAR",
			"databases": [{
				"connectionUrl": null,
				"dataModelId": "foo",
				"dbName": "foo",
				"jndiName": null,
				"password": "7b6a43524a2b381667313a6b124c1a",
				"serviceName": "mysql-4b710",
				"username": null
			}],
			"deploymentId": "foo1",
			"deploymentType": "CLOUD_FOUNDRY",
			"host": null,
			"name": "Stubby 1 CloudFoundry Deployment",
			"password": "7b6a43524a262b36646b6e722b0e2e281436317071523e",
			"port": 0,
			"target": "api.cloudfoundry.com",
			"username": "joe@vmware.com"
		}, {
			"applicationName": "stubby1",
			"archiveType": "EAR",
			"databases": [],
			"deploymentId": "foo2",
			"deploymentType": "FILE",
			"host": null,
			"name": "Stubby 1 WAR Deployment",
			"password": "7b6a43524a2b381667313a6b124c1a",
			"port": 0,
			"target": null,
			"username": null
		}],
		"bar": [{
			"applicationName": "stubby1",
			"archiveType": "WAR",
			"databases": [{
				"connectionUrl": "jdbc:mysql://localhost:3306/foo",
				"dataModelId": "foo",
				"dbName": "foo",
				"jndiName": null,
				"password": "7b6a43524a282e1c67753a21080c6812",
				"serviceName": null,
				"username": "marty"
			}],
			"deploymentId": "bar0",
			"deploymentType": "TOMCAT",
			"host": "localhost",
			"name": "Stubby 1 Tomcat Deployment",
			"password": "7b6a43524a282c146a6b626e425c32205754",
			"port": 8080,
			"target": null,
			"username": "manager"
		}]
	}
}
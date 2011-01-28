Information about project folder structure and files.

lib
 Add custom jar files to this folder. Files added to this folder will be copied to WEB-INF for deployment and on the classpath.

services
 All services should be added via studio. Once added, services can be edit via eclipse or other editors, including adding additional classes. 
 Classes in this folder will be compiled when the project is run or deployed.
 Modifications to imported services can be lost upon re-import.
 
 To see external updates in studio, use the refresh button in the java editor.
 
src
 Custom java classes can be added to this folder using package names. Files added to this folder will be copied to WEB-INF for deployment.
 
  log4j.properties can be edited to change logging settings.

webapproot
  app.css contains application CSS
  config.js contains project settings that can be edited, including dojo settings. Generally for advanced users.
  index.html can be edited directly to customize, such as including meta, script and other tags. 
  types.js is a studio managed file. Types can be added to the project with server (java) types or with wm.TypeDefinition.
  project.documentation.js contains documentation for application owned components.
  project.js (i.e. myproject.js) contains any application owned component definitions and functions. Same as page js and widget.js for application owned components.
  
webapproot/data
 HSQLDB database file folder. All HSQLDB databases must be in this folder.
 By default contains the example HSQLDB files. If your project does not use these sample dbs, you can delete these files. 
 
webapproot/pages
 Each project page creates a folder by the name of the page, i.e Main. 
 All page files in the pages folder are studio managed. 
  
  Page CSS files (i.e. main.css) contains custom css added in source, css or by applying custom styles to components.
  Page Documentation.json (i.e. Main.documentation.json) contains the generated documentation from the Documentation property of components.
  Page HTML files (i.e. main.html) contains any custom markup added in the source, markup editor. Can be edited with the project closed.
  Page JS files (i.e. main.js) can be edited via the file system. Use the refresh button in the source, script panel if you edit this file outside of studio. 
  Page widget files  (i.e. main.widgets.js) should only be edited by experienced users with the project closed in studio. Saving the project in studio may overwrite external changes.

webapproot/services
 Contains service definition files used by studio. These files are not user editable. 
 
webapproot/resources
 Created upon first use of the resources panel in studio. These are the folders uses by the resources panel and resources in binding. 
 
webapproot/WEB-INF
  project-security.xml is a studio manged file. Use security panel in studio to change security settings. Saving the project in studio may overwrite external changes.
  web.xml is a studio managed file. Use user-web.xml. Changes to user-web.xml will be merged into web.xml for deployment.

webapproot/WEB-INF/classes
  This folder is populated by studio. Do not edit or add any files to this folder. Changes will be lost. Use project/src instead.

webapproot/WEB-INF/lib
  This folder is populated by studio. Do not edit or add any files to this folder. Changes will be lost. Use project/lib instead.
Studio's webapp/lib folder
=========================

The main library folder contains the dojo and wavemaker javascript frameworks, as well as css, images, and misceallaneous libraries

Folders
-------
* boot: The key file in this folder is boot.js.  As part of an performance optimization in WM 6.5, this file is now appended by the server to config.js (reduces number of requests to initialize an application).  boot.js contains the code that loads the dojo framework.  boot.js (or config.js with boot.js appended to it) is loaded directly from index.html.
* build: The application framework build files contains minified compressed build files, as well as dictionary files.  This folder is populated by the build-js.xml file.
* dojo: Contains the dojo library.  Note that any file flagged with a VMware copyright has been modified by the WaveMaker team.  When upgrading to the next version of dojo, you need to find all of these modifications, determine if they are still needed, and if so, copy them into the new version of dojo.
* github: Contains libraries downloaded from github.  beautify.js is used primarily by the designer so this could be moved into webapp/app/lib.
* images: Contains some opensource image libraries
* wm: Contains the WaveMaker widgets, components and utilities

Files
-----
manifest.js: When running an application with ?debug in the url, this file is used to determine which libraries to load.  This is used instead of loading the compressed build files.
* runtimeLoader.js: This is loaded from a script tag in index.html. It initializes and loads the wavemaker framework.  It depends on boot.js having loaded the dojo framework.

https://github.com/ajaxorg/ace

1.    git clone git://github.com/ajaxorg/ace.git
2.    cd ace
3.    git submodule update --init --recursive
4.    sudo npm install dryice
5.    Find your dryice install; we need to hack this:
    For me, the file I needed was found at /usr/lib/node/dryice/lib/dryice/index.js
    find any place where the string "define(..." is returned and change it to "defineace(..."
    Find the line that does an input.replace(....define.... and make it replace all calls to define with defineace
6.    Add to Makefile.dryice.js all of the libraries you want built-in. Failure to add required libraries may mean they load ondemand (and fail to load entirely due to conflicts between dojo.require and ace require).  You will need to list the packages in the correct order or they will not see the class is built into the compiled file and will try to load it from the server... from the lib folder despite there not being a build/lib folder.
7. You'll need to find all workers and give them requireace/defineace
calls
8. Find worker_client.js; replace:
    if (window.requireace.packaged) {
        var base = this.$guessBasePath();
        var worker = this.$worker = new Worker(base + packagedJs);
    } 
with
    if (window.requireace.packaged) {
        //var base = this.$guessBasePath();
	var base = "/wavemaker/app/lib/ace/";
        var worker = this.$worker = new Worker(base + packagedJs);
    }

9. Find worker.js and make sure its got defineace and requireace, not
define and require
//6.    Make sure that all calls to define are changed to defineace
//7.    Make sure that all calls to require are changed to requireace unless they refer to the require parameter passed into the define method
8. You need to edit ace/build_support/mini_require.js to use defineace/requireace instead of define/require
9. In both worker.js and mini_require.js, you need to find es5-shim.js and paste it (minus the call to define line and end brace for the define) at the top of the file; else Function.prototype.bind doesn't get called before we need to bind require.  This matters for browsers like safari that don't have a bind defined for their function prototype already
8.    ./Makefile.dryice.js normal
9.   Copy the build/src folder to webapproot/app/lib/ace
10.  Change bottom of ace-uncompressed to have requireace instead of require 
11. Any call in ace-uncompressed to doc.createStyleSheet must add for IE 9:
	try {
            var sheet = doc.createStyleSheet(uri);
	} catch(e) {
	    sheet = doc.createElement('STYLE'); 
	    doc.documentElement.firstChild.appendChild(sheet); 
	} 

12. Find exports.setInnerHtml; test that el.parentNode exists before replacing its child

11. Use some tool such as google closure compiler to take ace-uncompressed and build ace.js (unless you want to hand edit ace.js)

BUILD DEPENDENCY LIST:

		"ace/lib/regexp",
		"ace/lib/es5-shim",
		"pilot/dom",
		"ace/lib/oop",
		"pilot/oop",
		"pilot/event",
		"pilot/event_emitter",
		"pilot/browser_focus",
                "pilot/fixoldbrowsers",

		"pilot/keys",
		"pilot/lang",
		"pilot/useragent",
                "pilot/index",
		"ace/keyboard/textinput",
		"ace/mouse/default_handlers",
		"ace/mouse/mouse_event",
		"ace/mouse/mouse_handler",
		"ace/lib/useragent",
		"ace/lib/keys",
		"ace/lib/event",
		"ace/commands/default_commands",
		"ace/keyboard/keybinding",
		"ace/range",
		"ace/search",
		"ace/lib/event_emitter",
		"ace/commands/command_manager",
		"ace/anchor",
		"ace/document",
		"ace/background_tokenizer",
		"ace/tokenizer",
		"ace/selection",
                "ace/mode/matching_brace_outdent", 
		"ace/worker/worker_client",
		"ace/unicode",
		"ace/mode/behaviour/cstyle",
                "ace/mode/text_highlight_rules",
                "ace/mode/text",
		"ace/mode/javascript_highlight_rules",
                "ace/mode/javascript",
                "ace/mode/java",
                "ace/mode/json",
                "ace/mode/css",
                "ace/mode/html",
                "ace/mode/xml",
		"ace/edit_session/fold_line",
		"ace/edit_session/fold",
		"ace/edit_session/folding",
                "ace/edit_session",
                "ace/editor",   
                "ace/undomanager",
                "ace/theme/clouds",
                "ace/theme/textmate",
                "ace/theme/twilight",
                "ace/theme/cobalt",
		"ace/layer/gutter",
		"ace/layer/marker",
		"ace/layer/text",
		"ace/layer/cursor",
		"ace/scrollbar",
		"ace/renderloop",
                "ace/virtual_renderer",		
                "ace/ace"

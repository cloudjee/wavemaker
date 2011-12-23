
function main(){
    source(findFile("scripts", "util.js"));
    loadUrl(":http://localhost:8094/RolodexSimple/");
    var browser_prefix=getBrowserPrefix();
    test.log(browser_prefix);
    runRolodex(browser_prefix);
    }
function runRolodex(browser_prefix){
    try{
      var td = browser_prefix+"_TD1.tsv";
      var app_selection3 = testData.dataset(td);    
      test.log("read the file");
      
        snooze(2);
        
     
      var ok = waitFor("isPageLoaded()",10000);
        if (ok){  
            for (var r=1; r<app_selection3.length;r++) {
                 var id = testData.field(app_selection3[r], "ID");
                 var name = testData.field(app_selection3[r], "NAME");
	         waitForObject(id);
                 findObject(id);
                 //mouseClick(id);
                 test.log(id);
                 test.log(name);
            }
        
        if(browser_prefix=="IE"){
            
            test.log("IE Verification Points");
            test.vp("VP4");
            waitForObject(":dijit_form_ValidationTextBox_0");
            setFocus(":dijit_form_ValidationTextBox_0");
            setText(":dijit_form_ValidationTextBox_0", "s");
            clickButton(findObject(":main_searchButton"));
            snooze(3);
            test.vp("VP5");          
            waitForObject(":{tagName='TD' innerText='SWANK' }");
            mouseClick(findObject(":{tagName='TD' innerText='SWANK' }"));
            test.vp("VP6");
            test.pass("IE Verification Points");
         }         
         else  if(browser_prefix=="FF"){            
            test.log("FF Verification Points");
            test.vp("VP1");
            waitForObject(":dijit_form_ValidationTextBox_0");
            setFocus(":dijit_form_ValidationTextBox_0");
            setText(":dijit_form_ValidationTextBox_0", "s");
            mouseClick(findObject(":main_searchButton"));
            snooze(3);
            test.vp("VP2");
            waitForObject(":{tagName='TD' innerText='SWANK' }");
            mouseClick(findObject(":{tagName='TD' innerText='SWANK' }"));
            test.vp("VP3");  
            test.pass("FF Verification Points");
            
         } 
         else  if(browser_prefix=="SA"){
            test.log("SA Verification Points");
            //test.vp("VP5");
            //test.vp("VP6");
         }  
        }
        else{
        test.fail("Page loading failed");       
        }
            
        
        
        test.pass("testRunRolodexSimple");
    }catch(error){
        test.fail("runRolodex Failed" + error.message);
}
}

        
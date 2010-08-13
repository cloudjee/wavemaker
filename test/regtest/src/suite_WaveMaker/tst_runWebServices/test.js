function main()
{
    source(findFile("scripts", "util.js"));
    loadUrl(":http://localhost:8094/WebServicesSample/");
    var browser_prefix=getBrowserPrefix();
    
    
    testRunWebServicesSample(browser_prefix);

}
function testRunWebServicesSample(browser_prefix){
    try{
      var td = browser_prefix+"_TD1.tsv";
      var app_selection3 = testData.dataset(td);    
       test.log("read the file");
       
          var ok = waitFor("isPageLoaded()",10000);
          if (ok){
           
              for (var r in app_selection3) {
                 var id = testData.field(app_selection3[r], "ID");
                 var name = testData.field(app_selection3[r], "NAME");
	         waitForObject(id);
                 findObject(id);
                 mouseClick(id);
                 test.log(id);
                 test.log(name);
                 var a=typeName(id);
                 var b=objectName(id);        
      }
           if(browser_prefix=="IE"){
            test.log("IE Verification Points");
            
           }         
           else  if(browser_prefix=="FF"){
            
            test.log("FF Verification Points");
            test.vp("VP1");
            
           } 
           else  if(browser_prefix=="SA"){
            test.log("SA Verification Points");
            
            waitForObject(":main_getFeedPane_getFeedPage_content");
            findObject(":main_getFeedPane_getFeedPage_content");
            waitForObject(":main_getFeedPane_getFeedPage_getFeedButton");
            mouseClick(findObject(":main_getFeedPane_getFeedPage_getFeedButton"));
           test.vp("VP2");
            test.vp("VP3");
             waitForObject(":{tagName='BUTTON' type='submit' innerText='Gmail Reader (Atom)'}");
            clickButton(findObject(":{tagName='BUTTON' type='submit' innerText='Gmail Reader (Atom)'}"));
            snooze(3);
            waitForObject(":main_gmailPane_gmailAtomPage_getGmail");
            clickButton(findObject(":main_gmailPane_gmailAtomPage_getGmail"));
           
            test.log("hello");
           }  
         
         test.pass("testRunWebServicesSample");
         }
         else {
           test.fail("Page loading failed");       
         }
  
    }catch(error){
        test.fail("testRunWebServicesSample Failed" + error.message);
     }
        
  
}

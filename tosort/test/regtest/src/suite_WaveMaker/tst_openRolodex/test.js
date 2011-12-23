/*--------------------------------------------------------------------------
  Name: main
  Parameters: nill
  Description: Loads util.js file from shared and call methods loadURL(), 
               testOpenStudio(),testLoadRolodexSimple(),testRunRolodexSimple()
  -------------------------------------------------------------------------- */

function main()
{        
    source(findFile("scripts", "util.js"));
    loadURL("URL_TD.tsv",0);
    var browser_prefix=getBrowserPrefix();
    testOpenStudio(browser_prefix);
    testLoadRolodexSimple(browser_prefix);
    createWarFile();
    
}
/*--------------------------------------------------------------------------
  Name: testOpenStudio
  Parameters:browser_prefix 
  Description:Open Studio based on testdata file                 
  -------------------------------------------------------------------------- */
function testOpenStudio(browser_prefix)
{
    var td = browser_prefix+"_TD1.tsv";
    openStudio(td);
} 

/*--------------------------------------------------------------------------
  Name: testLoadRolodexSimple
  Parameters:browser_prefix 
  Description:Load RolodexSimple application and verify  with testdata file                 
  -------------------------------------------------------------------------- */        
        
function testLoadRolodexSimple(browser_prefix){
    try{
      var td = browser_prefix+"_TD2.tsv";
      var app_selection2 = testData.dataset(td);    
      test.log("read the file");
      for (var r in app_selection2) {
        var id = testData.field(app_selection2[r], "ID");
        var name = testData.field(app_selection2[r], "NAME");
	waitForObject(id);
        findObject(id);
        mouseClick(id);
        test.log(id);
        test.log(name);        
        var a=typeName(id);
        var b=objectName(id);        
      }
       test.pass("pass testLoadRolodexSimple ");
   }catch(error){
        test.fail("testLoadRolodexSimple Failed" + error.message);
     }
}
 

/* -----------------------------------------------------
  Name: loadURL
  Parameters: TestData file , TestData Index
  Description: Loads the URL based on the testdata file 
               index provided
-------------------------------------------------------- */
function loadURL(testdata,id)
{
    
    var app_selection1 = testData.dataset(testdata,id);
    test.log("Read the testdata file");
    try
    {
        var url = testData.field(app_selection1[id], "URL");
        var name = testData.field(app_selection1[id], "NAME");
        var varObj = testData.field(app_selection1[id],"VP");
        loadUrl(url);
        var ok = waitFor("isPageLoaded()",10000);
        if (ok){
            findObject(varObj);
            test.pass("Loaded");
        }
        else
        {
            test.fail("loadURL Failed : unable to load page");
        }
    }
    catch(error)
    {
        test.fail("loadURL Failed" + error.message);
    }
}

/* -----------------------------------------------------
  Name: openStudio
  Parameters: TestData file 
  Description: Open the Studio based on the testdata file 
               index provided
-------------------------------------------------------- */

function openStudio(testdata)
{
    try{
    
    var app_selection1 = testData.dataset(testdata);  
    snooze(2);
    test.log("Read the testdata file");
    for (var r in app_selection1) {
        var id = testData.field(app_selection1[r], "ID");
        var name = testData.field(app_selection1[r], "NAME");
		waitForObject(id);
        findObject(id);
        mouseClick(id);
        test.log(id);
        test.log(name);           
        test.pass("openStudio");
     }
     }catch(error){
        test.fail("openStudio Failed" + error.message);
     }
    
}
/*------------------------------------------------------
  name:createWarFile
  Description: Create war file for the application   
  ------------------------------------------------------- */
function createWarFile()
{
    if (Browser.id() == "ie"){
        waitForObject(":{tagName='BUTTON' type='button' value='Dashboard'innerText='Dashboard'}");
        clickButton(findObject(":{tagName='BUTTON' type='button' value='Dashboard'innerText='Dashboard'}"));
    }
    if (Browser.id() == "firefox"){
        waitForObject(":{tagName='BUTTON' type='submit' innerText='Dashboard'}");
        clickButton(findObject(":{tagName='BUTTON' type='submit' innerText='Dashboard'}"));
    }
    waitForObject(":studio_dashboardPane_dashboard_projectDeployBtn");
    mouseClick(":studio_dashboardPane_dashboard_projectDeployBtn");
    snooze(40);
    test.pass("Sucessfully Created The War File");

}

/* -----------------------------------------------------
  Name: getBrowserPrefix
  Parameters: nill
  Description: get browser's prefix based on id
  Return:Browser prefix           
-------------------------------------------------------- */

function getBrowserPrefix()
{
  var prefix="";
  var vr = Browser.id();
  if (Browser.id() == "ie")
      prefix="IE";
  else if (Browser.id() == "mo")
      prefix="MO";  
  else if (Browser.id() == "firefox")
      prefix="FF";
  else if (Browser.id() == "safari")
      prefix="SA";    
  else if (Browser.id() == "Konqueror")
      prefix="KO";
  return prefix;
}
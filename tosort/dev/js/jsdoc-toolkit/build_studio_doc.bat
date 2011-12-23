@echo off

set template=wmdoc

REM funko method to get source references to be under wm
REM seems like there should be a "source root" option in jsdoc

cd ../../studio/webapproot/lib/wm
set apphome=../../../../js/jsdoc-toolkit/

set out=../../jsdoc2
REM set source=base/

set source=^
base/lib/util.js base/Object.js ^
base/data/expression.js ^
base/Component.js ^
base/Control.js ^
base/components/Variable.js ^
base/components/Service.js ^
base/components/ServiceQueue.js ^
base/components/ServiceCall.js ^
base/components/ServiceVariable.js ^
base/components/NavigationService.js ^
base/components/NavigationCall.js ^
base/lib/data.js base/components/LiveView.js ^
base/components/LiveVariable.js ^
base/widget/container.js ^
base/widget/Panel.js ^
base/widget/LiveForm.js ^
base/widget/dijit/Dijit.js ^
base/widget/dijit/Grid.js ^
base/widget/DataGrid.js

java -jar %apphome%jsrun.jar %apphome%app/run.js -t=%apphome%templates/%template% -d=%out% -r %source%

pause

/*
 * Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */


{
    ALERT_OLD_IE_BAD: "<p>Las aplicacion en WaveMaker pueder funcionar en Internet Explorer 6 en adelante.</p><p>Pero, WaveMaker Studio require usar Chrome, FireFox or Internet Explorer 8.</p><p>Nota: si usted esta usando WaveMaker studio in Internet Explorer 8, tiene que deshabiliar el modo de compatibilidad.</p>",
    TOOLTIP_SECURITY_ERROR: "Un error de seguridad que se muestran aqu&iacute; no tiene ning&uacute;n efecto sobre el proyecto que est&aacute; dise&ntilde;ando.  Se indica que no somos capaces de mostrar los datos en el dise&ntilde;ador.  Por lo general, se puede solucionar este problema mediante la ejecuci&oacute;n de su aplicaci&oacute;n, para acceder a su aplicacion, y luego, los datos deben aparecer en el dise&ntilde;ador",

    /* Documentation; Help Menu */
    URL_TUTORIALS: "http://dev.wavemaker.com/wiki/bin/wmdoc_${studioVersionNumber}/Tutorials",
    URL_DOCS: "http://dev.wavemaker.com/wiki/bin/wmdoc_${studioVersionNumber}/",
    URL_PROPDOCS: "http://dev.wavemaker.com/wiki/bin/wmjsref_${studioVersionNumber}/",
    URL_FORUMS: "http://dev.wavemaker.com/forums",
    "MENU_ITEM_TUTORIALS" : "Tutoriales",
    "MENU_ITEM_DOCS" : "Documentacion",
    "MENU_ITEM_COMMUNITY" : "Foros",
    "MENU_ITEM_PROPDOCS" : "Documentacion en JavaScript (Cliente)",

    URL_SCREENCAST: "http://www.wavemaker.com/product/screencasts.html",
    URL_DEMO: "http://www.wavemaker.com/product/demos.html",
    URL_COMMUNITY: "http://dev.wavemaker.com/",


    TOAST_RUN_FAILED: "Ejecucion fallida: ${error}",
    ALERT_NEW_WIDGET_NEEDS_CONTAINER: "No esta disponible el contenedor para este nuevo widget.  Todos los contenedores est&aacute;n bloqueados o congelados.",

    /* Shortcuts dialog */
    SHORTCUTS_HEADER: "Atajos m&aacute;s comunes",
    SHORTCUTS_W: "Alternar ancho entre 100% y 100px (no es soportado por chrome en windows)",
    SHORTCUTS_H: "Alternar height between 100% and 100px",
    SHORTCUTS_M: "Alternar entre el modelo y la paleta",
    SHORTCUTS_S: "Guardar el proyecto",
    SHORTCUTS_R: "Ejecutar el proyecto",
    SHORTCUTS_ESC_1: "Si el dialogo esta abierto: Cerrar el dialogo",
    SHORTCUTS_ESC_2: "Si no esta el dialogo: Seleccione el widget padre seleccionado",
    SHORTCUTS_DEL: "Elimine el componente seleccionado (al menos el texto de campo/propiedad el campo es seleccionado para editar en el caso se editara el campo de texto)",
    SHORTCUTS_HEADER_2: "Atajos adicionales",
    SHORTCUTS_O: "Alternar alineacion horizontal de los widgets en el contenedor",
    SHORTCUTS_E: "Alternar alineacion vertical de los widgets en el contenedor",
    SHORTCUTS_B: "Alternar layoutKind entre izquierda-a-derecha y arriba-a-abajo",
    SHORTCUTS_Z: "Deshacer",


    /* Generate documentation */
    GENERATE_DOCUMENTATION_HEADER: "<i>Nota: esta pagina es para revisar documentacion; para editar esta documentacion usted debe ir al componente en el modelo y seleccionar esa documentacion</i>",
    GENERATE_DOCUMENTATION_NODOCS: "Sin documentacion",
    GENERATE_DOCUMENTATION_NONVISUAL_HEADER: "Pagina ${pageName} Componentes no visuales</h2>",
    GENERATE_DOCUMENTATION_VISUAL_HEADER: "Pagina ${pageName} Componentes visuales</h2>",
    "wm.Component.DOCUMENTATION_DIALOG_TITLE": "Documento ${name}",
    "wm.Component.GENERATE_DOCUMENTATION_TOPNOTE": "Documentacion generada",
    "wm.Component.GENERATE_DOCUMENTATION_EVENT_HEADER": "<h4>${eventName}</h4>\n ejecuciones ",
    "wm.Component.GENERATE_DOCUMENTATION_EVENT_TARGET_TYPE": "<b>Tipos:</b>: ${componentType}",
    "wm.Component.GENERATE_DOCUMENTATION_EVENT_TARGET_OPERATION": "<b>Operacion:</b>: ${operation}",
    "wm.Component.GENERATE_DOCUMENTATION_EVENT_FUNCTION": "${functionName} (Funcion)",
    "wm.Component.GENERATE_DOCUMENTATION_NO_EVENT_HANDLER": "Sin escuchadores de eventos",
    "wm.Component.GENERATE_DOCUMENTATION_EVENT_SECTION": "<h4>Escuchadores de eventos</h4><div style='margin-left:15px;'>${eventHtml}</div>",
    "wm.Component.GENERATE_DOCUMENTATION_EVENT_HANDLERS_HEADER": "<h4>Los controladores objeto de evento activan el siguiente componente</h4><ul  style='padding-left:0px;list-style-position: inside;margin-left: 15px;'>\n${eventHtml}</ul>",
    "wm.Component.GENERATE_DOCUMENTATION_BINDING": "<li><b>${property}</b> esta obligado a <i>${source}</i></li>\n",
    "wm.Component.GENERATE_DOCUMENTATION_NO_BINDING": "Sin enlaces",
    "wm.Component.GENERATE_DOCUMENTATION_BINDING_SECTION": "<h4>Este objeto tiene los siguientes enlances</h4><ul  style='padding-left:0px;list-style-position: inside;margin-left: 15px;'>\n${bindingHtml}</ul>",
    "wm.Component.GENERATE_DOCUMENTATION_BOUND_TO": "<li><b>${targetComponent}.${targetProperty}</b> esta obligado a <i>${source}</i></li>\n",
    "wm.Component.GENERATE_DOCUMENTATION_BOUND_TO_SECTION": "<h4>Los siguientes objetos est&aacute;n vinculados a este</h4><ul  style='padding-left:0px;list-style-position: inside;margin-left: 15px;'>\n${bindHtml}</ul>",

    "wm.DojoFlashFileUpload.CAPTION_UPLOAD": "Subir",
    "wm.DojoFlashFileUpload.CAPTION_SELECT": "Seleccionar Archivos...",
	
	JSON_PENDING: "Solicitud pendiente: ${name}",
    CONFIRM_LOGOUT: "Seguro que quiere desconectarse? Los cambios no guardados se perderan.", /* Cloud version only */
    WAIT_OPENING_PAGE: "Abriendo pagina: ${pageName} ",
    "LAYER_NAME_IDE" : "Fuente",
    "ALERT_UNSAVED_LOST" : "Tenga en cuenta que los cambios no publicados se perder&aacute;n.",
    "ALERT_NO_UNSAVED" : "Tenga en cuenta que no hay cambios sin guardar.",

    /* wm.DataModel */
    "wm.DataModel.WAIT_ADDING": "A&ntilde;adiendo ${dataModel}",
    "wm.DataModel.IMPORT_DATABASE_TITLE": "Nuevo Modelo de Datos",
    "wm.DataModel.TOAST_IMPORT_SUCCESS": "Nuevo Modelo de Datos ${dataModel} ha sido importado",
    "wm.DataModel.ENTER_NAME": "Ingrese el nombre del modelo de datos",
    "wm.DataModel.ORACLE_JAR_INSTRUCTIONS": "<p>Para utilizar las bases de datos Oracle, tendr&aacute; que descargar e instalar ojdbc14.jar</p><p>Ir a <a target='_New' href='http://www.oracle.com/technetwork/database/enterprise-edition/jdbc-10201-088211.html'>Oracle</a> y descargar ojdbc14.jar (o lo que sea el n&uacute;mero de versi&oacute;n m&aacute;s reciente es).</p><p>Presione el boton \"Siguiente\" cuando haya terminado.</p>",
    "wm.DataModel.DB2_JAR_INSTRUCTIONS":  "<p>Para utilizar las bases de datos DB2, necesitar&aacute; descargar e instalar db2jcc.jar</p><p>Ir a <a target='_New' href='https://www14.software.ibm.com/webapp/iwm/web/reg/pick.do?source=swg-idsjs11'>IBM</a> y descargar el driver.</p><p>Abrir el archivo zip y buscar db2jcc.jar (puede ignorar el archivo db2jcc4.jar)</p><p>Presione el boton \"Siguiente\" cuando haya terminado.</p>",

    /* wm.JavaService */
    "wm.JavaService.WAIT_INITIALIZING": "Inicializando el Servicio Java ${serviceId}",
    "wm.JavaService.CREATE_SERVICE_TITLE": "Nuevo Servicio Java",
    "wm.JavaService.CREATE_SERVICE_OK": "OK",
    "wm.JavaService.CREATE_SERVICE_CANCEL": "Cancelar",
    "wm.JavaService.WAIT_CREATING_SERVICE": "Creando servicio",
    "wm.JavaService.TOAST_SUCCESS_CREATING_SERVICE": "Servicio java creado ${serviceId}",
    "wm.JavaService.TOAST_ERROR_CREATING_SERVICE": "Fallo crear servicio java ${serviceId}",

    /* wm.WebService */
    "wm.WebService.IMPORT_TITLE": "Importando Servicio Web",
    "wm.WebService.JAR_INSTRUCTIONS": "<p>Para utilizar los servicios web, tendr&aacute;s que descargar e instalar wsdl4j.jar</p><p>Ir a <a target='_New' href='http://sourceforge.net/projects/wsdl4j/'>SourceForge</a> y descargar wsdl4j-bin-1.6.2.</p><p>Abra el archivo zip y buscar wsdl4j.jar dentro de la carpeta lib. Cuando lo encuentres, presione en este dialogo el boton \"Siguiente\" .",

    /* wm.LiveVariable */
    "wm.LiveVariable.ALERT_INVALID_SORT_ORDER": "Cada propiedad usada en la cl&aacute;usula orderBy debe ser de la forma asc|desc : &lt;propertyPath&gt;. \"${order}\" no coincide con este formato. La cl&aacute;usula orderby actual generar&aacute; un error y debe corregirse.",

    /* wm.Page/PageLoader */
    "wm.Page.WIDGETS_MISSING": "Pagina ${pageName} tiene errores",
    "wm.PageLoader.JS_NOT_LOADED": "Pagina ${inName}.js tiene errores",

    /* wm.PageContainer */
    "wm.PageContainer.OPEN_PAGE": "Abrir pagina",
    "wm.PageContainer.NEW_PAGE": "Nueva pagina",
    "wm.PageContainer.NEW_PAGE_OPTION": "-Nueva Pagina",
    "wm.PageContainer.CONFIRM_SAVE_CHANGES": "Con el fin de establecer una nueva p&aacute;gina de su contenedor, que debe guardar el proyecto. Guardar y continuar?",

    /* wm.Property/Composite/Publisher */
    "wm.Property.SELECT_PROPERTY": "Seleccionar propiedad a publicar como <b>${propertyName}</b>",

    /* wm.PopupMenuButton, wm.DojoMenu */
    "wm.PopupMenuButton.MENU_DESIGNER_TITLE":"Editar Menu",
    "wm.DojoMenu.MENU_DESIGNER_TITLE": "Editar Menu",
    "wm.PopupMenu.DEFAULT_STRUCTURE": 
         [{label: "Archivo", children: [{label: "Guardar"},{label: "Cerrar"}]},
	  {label: "Editar",	children: [{label: "Cortar"}, {label: "Copiar"},{label: "Pegar"}]},
          {label: "Ayuda"}],

    /* wm.ContextMenuDialog */
    "wm.ContextMenuDialog.DELETE_LABEL": 'Eliminar', 
    "wm.ContextMenuDialog.SHOW_MORE": 'Mostrar propiedades avanzadas >>',
    "wm.ContextMenuDialog.SHOW_LESS": '<< Ocultar propiedades avanzadas',

    /* wm.Dashboard */
    "wm.Dashboard.CONTEXT_MENU_TITLE": "Configurar Portlets",
    "wm.Dashboard.CONFIG_DIALOG_OPEN_FIELD": "Defecto",
    "wm.Dashboard.CONFIG_DIALOG_TITLE_FIELD": "Titulo",
    "wm.Dashboard.CONFIG_DIALOG_PAGE_FIELD": "Pagina",
    "wm.Dashboard.CONFIG_DIALOG_CLOSE_FIELD": "Cerrable",

    /* wm.ListViewer */
    "wm.ListViewer.NO_DATASET": "Por favor, seleccione un conjunto de datos antes de crear una nueva p&aacute;gina",

     /* wm.DojoGrid */
    "wm.DojoGrid.HELP_TEXT": '* Para reordenar las columnas primer cierre el cuadro de di&aacute;logo y luego arrastre las columnas en la grilla en la posici&oacute;n deseada.<br/>* Puede hacer clic derecho en la grilla para abrir este cuadro de di&aacute;logo.',
    "wm.DojoGrid.CONFIG_ID": "Campo",
    "wm.DojoGrid.CONFIG_TITLE": "Titulo",
    "wm.DojoGrid.CONFIG_WIDTH": "Ancho",
    "wm.DojoGrid.CONFIG_ALIGN": "Alineacion",
    "wm.DojoGrid.CONFIG_FORMAT": "Formato",
    "wm.DojoGrid.CONFIG_TYPE": "Editar tipo de campo",
    "wm.DojoGrid.CONFIG_EXPR": "Expresion de datos",
    "wm.DojoGrid.ADD_COLUMN_LABEL": "A&ntilde;adir nueva Columna",
    "wm.DojoGrid.EDIT_COLUMNS_DIALOG_TITLE": "DojoGrid Propiedades de Columna",
    "wm.DojoGrid.ADD_FORMATTER": '- A&ntilde;adir formateador',
    "wm.DojoGrid.COLUMN_ALIGN_RIGHT": "Derecha",
    "wm.DojoGrid.COLUMN_ALIGN_LEFT": "Izquierda",
    "wm.DojoGrid.COLUMN_ALIGN_CENTER": "Centro",
	
	 /* Studio Service Tabs */
    "wm.LiveView.TAB_CAPTION": "Live View",
    "wm.Security.TAB_CAPTION": "Seguridad",
    "wm.Query.TAB_CAPTION": "Consulta",
    "wm.DataModel.TAB_CAPTION": "Modelo de Datos",

    
    /* LivePanel, LiveForm, EditPanel, RelatedEditor */
    "wm.RelatedEditor.BAD_EDIT_MODE": "Para que este editor sea editable, su editor padre debe tener un editingMode como editable.",
    "wm.RelatedEditor.LOOKUP_CAPTION": "${fieldName} (buscar)",
    "wm.LivePanel.CHOOSER_TITLE": "Elegir LivePanel Layout",
    "wm.LivePanel.DETAILS_PANEL_TITLE": "Detalles",
    "wm.LivePanel.WAIT_GENERATING": "Generando...",
    "wm.LiveForm.GENERATE_BUTTONS_TITLE": "Generar botones de formulario",
    "wm.LiveForm.GENERATE_BUTTONS_PROMPT": "&iquest;Qu&eacute; tipo de botones de lo que quieres? EditPanel maneja los botones para usted; botones b&aacute;sicos le da un punto de partida para crear su propio panel de botones",
    "wm.LiveForm.GENERATE_BUTTONS_CAPTION1": "Editar Panel",
    "wm.LiveForm.GENERATE_BUTTONS_CAPTION2": "Botones Basicos",
    "wm.LiveForm.GENERATE_BUTTONS_CAPTION3": "Cancelar",
    "wm.LiveForm.GENERATE_BUTTONS_SAVE": "Guardar",
    "wm.LiveForm.GENERATE_BUTTONS_CANCEL": "Cancelar",
    "wm.LiveForm.GENERATE_BUTTONS_NEW": "Nuevo",
    "wm.LiveForm.GENERATE_BUTTONS_UPDATE": "Modificar",
    "wm.LiveForm.GENERATE_BUTTONS_DELETE": "Eliminar",
    "wm.LiveForm.WAIT_ADD_EDITORS": "A&ntilde;adir editores para ${widgetName}",
    "wm.LiveForm.SET_NAME_CONFIRM": "Personalizaciones que ha realizado en su EditPanel se pierde si se cambia el nombre.  Continuar?",
    "wm.LiveForm.CONFIRM_REMOVE_EDITORS": "Esta seguro? Todos los editores de ${name} seran eliminados.",
    "wm.EditPanel.REMOVE_CONTROLS_CONFIRM": "Esta seguro? Todos los widgets de ${name} seran eliminados.",
    "wm.EditPanel.SAVE_CAPTION": "Guardar",
    "wm.EditPanel.CANCEL_CAPTION": "Cancelar",
    "wm.EditPanel.NEW_CAPTION": "Nuevo",
    "wm.EditPanel.UPDATE_CAPTION": "Modificar",
    "wm.EditPanel.DELETE_CAPTION": "Eliminar",
	"wm.EditArea.ENTER_LINE_NUMBER": "Introduzca el n&uacute;mero de l&iacute;nea",

    /* Editors */
    "wm.ResizeableEditor.SET_MAX_HEIGHT": "Su maxHeight debe ser mas larga que ${minHeight}",
    "wm.Checkbox.TOAST_WARN_CHECKED_VALUE_NOT_A_BOOLEAN": "Usted ha cambiado su tipo de datos a Boolean; su checkedValue debe ser actualizado para que sea verdadero/falso",
    "wm.Checkbox.TOAST_WARN_CHECKED_VALUE_NOT_A_NUMBER": "Usted ha cambiado su tipo de datos a n&uacute;mero, su checkedValue debe ser actualizado para ser un n&uacute;mero",

    /* Context Menus */
    "wm.Component.CONTEXT_MENU_LAYERS": "${parentName} Capas",
    "wm.Component.CONTEXT_MENU_HELP": "${className} docs...",
    "wm.Component.CLASS_NOT_FOUND": 'Tipo de componente "${type}" no esta disponible.',
    "wm.Palette.MENU_ITEM_COPY": "Nueva copia ${className}",
    "wm.Palette.MENU_ITEM_DOCS": "${className} docs...",
    "wm.Palette.URL_CLASS_DOCS": "http://dev.wavemaker.com/wiki/bin/wmjsref_${studioVersionNumber}/${className}",
    "wm.Palette.TIP_DOCS": "Click para docs",

    /* action.js/clipboard.js: undo/redo */
    "UNDO_MOUSEOVER_HINT": "Deshacer ${hint}",
    "UNDO_DELETE_HINT": "Eliminar ${className}",
    "UNDO_DROP_HINT": "Soltar ${className}",
    "UNDO_ADD_HINT": "A&ntilde;adir ${className}",
    "UNDO_PROP_HINT": "Propriedad ${propName}; devuelve a \"${oldValue}\"",

    "ALERT_PASTE_FAILED_PANEL_LOCKED": "No se puede pegar.  Todos los contenedores est&aacute;n bloqueados o congelados.",
    "CONFIRM_GENERIC_DISCARD_UNSAVED": 'Descartar los cambios no guardados?',
	WAIT_BUILDING_WAR: "Creando el archivo WAR. Se puede tardar varios minutos. por favor espere.",
    ALERT_LIVE_LAYOUT_SECURITY_WARNING: "Con el fin de usar Dise&ntilde;o en vivo para el trabajo, la seguridad del proyecto debe ser desactivada.<br/>Por favor, desactive la casilla 'Activar Seguridad' casilla de verificaci&oacute;n en el Editor de seguridad para desactivar la seguridad. <br/> Desactivar el layout en vivo, lanzamiento de Studio en el modo 'nolive'.",
    ALERT_BUILDING_ZIP_SUCCESS: "Proyecto exportado con &eacute;xito a zip en <ul><li>${inResponse}</li></ul>Para importar este proyecto que descomprimirlo en el directorio de proyectos de otro estudio.",
    ALERT_BUILDING_ZIP_FAILED: "Error ocurrido creando el archivo ZIP!<br/>${error}",
    ALERT_BUILDING_WAR_SUCCESS: "Archivo WAR generado correctamente: <ul><li>${inResponse}</li></ul>",
    ALERT_BUILDING_WAR_FAILED: "Erro creando el archivo WAR!<br/>${error}",
    TITLE_IMPORT_PROJECT: "Importar Proyecto",
    TITLE_CREATE_LIVE_VIEW: "Nuevo LiveView",
    //TOAST_IMPORT_PROJECT: "Proyecto importado con &eacute;xito ${inResponse}",
    //ALERT_IMPORT_PROJECT_FAILED: "Error al importar proyecto!\n${error}",
    MENU_REDEPLOY: "Desplegar en ${deploymentName}...",
    ALERT_DEPLOY_SUCCESS: "Despliegue satisfactorio.",
    ALERT_DEPLOY_FAILED: "Erro en el Despliegue: <ul><li>${error}</li></ul>",
    ALERT_UNDEPLOY_COMPONENT_SUCCESS: "Se quito del despliegue satisfactoriamente.",
    ALERT_UNDEPLOY_COMPONENT_FAILED: "Componente no encontrado",
    ALERT_UNDEPLOY_COMPONENT_FAILED2: "Error quitando el despliegue: ${inError}",
    TOAST_CODE_VALIDATION_SUCCESS: "No se encontraron errores",
    TITLE_CODE_VALIDATION_DIALOG: "Resultados del compilador",
    TITLE_IMPORT_JAVASCRIPT: "Importador de Script",
    TITLE_IMPORT_CSS: "Importador CSS",

    /* Auto Completion */
    AUTOCOMPLETE_ALERT_SELECT_TEXT: "Por favor, seleccione el texto, como 'this.button1', o 'button1', y si la p&aacute;gina tiene un button1 en ella, nos mostrar&aacute; una lista de m&eacute;todos adecuados puede llamar a ese objeto",
    AUTOCOMPLETE_ALERT_NOT_FOUND: "\"${text}\" no se ha encontrado. Por favor, seleccione el texto, como 'this.button1', o 'button1', y si la p&aacute;gina tiene un button1 en ella, nos mostrar&aacute; una lista de m&eacute;todos adecuados puede llamar a ese objeto",
    AUTOCOMPLETION_LABEL_PAGE_COMPONENTS: "Componentes de pagina",
    AUTOCOMPLETION_LABEL_TYPE_NUMBER: "Numero",
    AUTOCOMPLETION_LABEL_TYPE_BOOLEAN: "Booleano",
    AUTOCOMPLETION_LABEL_TYPE_STRING: "Cadena",
    AUTOCOMPLETION_TITLE_DIALOG: "Terminaciones",
    AUTOCOMPLETION_LABEL_PROPERTIES_METHODS: "Propiedades/Metodos",
    AUTOCOMPLETION_LABEL_NAME: "<b>Nombre:</b><br/>&nbsp;&nbsp;&nbsp;${name}",
    AUTOCOMPLETION_LABEL_TYPE: "<b>Tipo:</b><br/>&nbsp;&nbsp;&nbsp;${type}",
    AUTOCOMPLETION_LABEL_PARAMS: "<b>Parametros:</b><br/>&nbsp;&nbsp;&nbsp;${params}",
    AUTOCOMPLETION_LABEL_RETURN: "<b>Devuelve:</b><br/>&nbsp;&nbsp;&nbsp;${returns}",
    AUTOCOMPLETION_TYPE_NOT_SUPPORTED: "No proporcionamos informaci&oacute;n sobre este tipo de objeto",
    AUTOCOMPLETION_HTML: "Seleccione un t&eacute;rmino para ver la descripci&oacute;n, haga doble clic para agregar al c&oacute;digo",
    AUTOCOMPLETION_LABEL_DESCRIPTION: "descripcion",

    /* Event Editor */
    "wm.EventEditor.NO_EVENTS": " - Sin evento",
    "wm.EventEditor.NEW_JAVASCRIPT": " - Javascript...",
    "wm.EventEditor.NEW_JAVASCRIPT_SHARED": " - Javascript Compartido...",
    "wm.EventEditor.NEW_SERVICE": " - Nuevo Servicio...",
    "wm.EventEditor.NEW_LIVEVAR": " - Nuevo LiveVariable...",
    "wm.EventEditor.NEW_NAVIGATION": " - Nueva Navegacion...",
    "wm.EventEditor.LIST_NAVIGATION": "Navegaciones:",
    "wm.EventEditor.LIST_SERVICE": "Service Variables:",
    "wm.EventEditor.LIST_SHARED_JAVASCRIPT": "Servicio de escuchadores de eventos:",
    "wm.EventEditor.LIST_DIALOGS": "Dialogos:",
    "wm.EventEditor.LIST_LAYERS": "Capas:",
    "wm.EventEditor.LIST_DASHBOARDS": "A&ntilde;adir widgets a escritorio:",
    "wm.EventEditor.LIST_TIMERS": "TIMERS:",

    /* Inspectors */
    "wm.DataInspector.TOAST_EXPRESSION_FAILED": "Este valor falla al compilar, por favor intente de nuevo. Problema m&aacute;s com&uacute;n: la falta de cotizaciones",    
    "wm.ComponentInpsectorPanel.PROPERTY_NODE_CAPTION": "Propiedades",
    "wm.ComponentInpsectorPanel.EVENT_NODE_CAPTION": "Eventos",
    "wm.ComponentInpsectorPanel.CUSTOMMETHOD_NODE_CAPTION": "Metodos personalizados",
    "wm.Inspector.PROPERTIES_HEADER_CAPTION": "Propiedades",    
    "wm.Inspector.VALUES_HEADER_CAPTION": "Valor",    
    "wm.StyleInspector.BASIC_STYLE_LAYER_CAPTION": "Basico",
    "wm.StyleInspector.CLASSES_LAYER_CAPTION": "Clases",
    "wm.StyleInspector.CUSTOM_LAYER_CAPTION": "Estilos personalizados",
    "wm.StyleInspector.CUSTOM_CLASS_CAPTION": "Personalizado",
    "wm.StyleInspector.CUSTOM_BUTTON_CAPTION": "Aplicar",

    /* Model/Services */
    "MODELTREE_NODE_PAGE_HEADING": "Pagina (${className})",
    "MODELTREE_NODE_PROJECT_HEADING": "Proyecto (${projectName})",
    "MODELTREE_CONTEXTMENU_NEW": "Nuevo ${className}",
    "MODELTREE_CONTEXTMENU_DOC": "documentos...",

    "POPUP_BLOCKER_TITLE": "Bloquear ventana emergente",
    "POPUP_BLOCKER_MESSAGE": "Se detecto bloqueador de ventanas emergentes, ejecutar aplicacion usando el enlace del Lanzador Manual ",
    "POPUP_BLOCKER_LAUNCH_CAPTION": "Lanzador manual",
    "wm.studio.Project.TOAST_RESERVED_NAME": "Esta reservado para un nombre javascript",
    "wm.studio.Project.WAIT_CREATING_PROJECT": "Configurando un nuevo proyecto",
    "wm.studio.Project.WAIT_OPEN_PROJECT": "Abriendo...",
    "wm.studio.Project.TOAST_OPEN_PROJECT_FAILED": "Fallo abrir el proyecto ${projectName}: ${error}", 

    /* These next two seem to indicate the same thing, but come up from different types of errors */
    "wm.studio.Project.TOAST_OPEN_PAGE_FAILED": "Fallo al abrir la pagina ${pageName}: ${error}",
    "wm.studio.Project.THROW_INVALID_PAGE": "Pagina no valida",

    "wm.studio.Project.WAIT_COPY_PROJECT": "Copiando...",
    "wm.studio.Project.TOAST_COPY_PROJECT_SUCCESS": "${oldName} guardado como ${newName}; usted sigue editando ${oldName}",
    "wm.studio.Project.ALERT_DELETE_PAGE_FAILED": "Pagina ${pageName} no puede ser eliminada: ${error}",
    "CONFIRM_CLOSE_PROJECT": "Antes de cerrar ${projectName}, quiere guardar los cambios?",
    WAIT_CREATING_PAGE: "Creando pagina: ${pageName}",
    CONFIRM_NEW_PAGE: "Antes de a&ntilde;adir una nueva p&aacute;gina, &iquest;desea guardar los cambios?",
    CONFIRM_OPEN_PAGE : "Antes de abrir ${newPage}, quiere guardar ${oldPage}?",

    ALERT_UPGRADE_HEADING: "\n\nMensajes importantes con respecto a la actualizaci&oacute;n:\n",
    ALERT_BACKUP_OLD_PROJECT: "Su proyecto ha sido actualizado. Una copia de seguridad de su viejo proyecto est&aacute; disponible en:${filePath}\n",
    THROW_PROJECT_NOT_FOUND: "Advertencia: No se pudo encontrar ${projectPath}",
    SAVE_DIALOG_START_LABEL: "Empezando a guardar...",
    SAVE_DIALOG_UPDATE_MESSAGE: "Guardando ${componentName} ",
    "SAVE_DIALOG_ERROR_REPORT_PROJECT_FILES": "Archivos del proyecto",
    "TOAST_SAVE_PROJECT_SUCCESS": "Proyecto guardado",
    "IMPORT_RESOURCE_BUTTON_CAPTION": "Importar",
    "TITLE_BIND_DIALOG": "Enlazando...",
    "WAIT_PROJECT_CLOSING": "Cerrando...",
    "WAIT_PROJECT_DELETING": "Eliminando...",
    "RUN_BUTTON_CAPTION": "Ejecutar",
    "TEST_BUTTON_CAPTION": "Ejecutar",
    "RUN_BUTTON_CAPTION": "Ejecutar",
    "WAIT_SAVE_PAGE_AS": "Guardando pagina como ${pageName}",
    "CONFIRM_DELETE_PROJECT": "Seguro que quiere eliminar ${projectName}?",
    "CONFIRM_DELETE_PAGE": "Seguro que quiere eliminar ${pageName}?",
    "ALERT_CANT_DELETE_HOME_PAGE": "${pageName} es la p&aacute;gina de inicio del proyecto. No se puede eliminar la p&aacute;gina de inicio.",
    "PROMPT_TARGET_NAME": "Ingresar un nuevo nombre ${target} : ",
    "TOAST_TARGET_EXISTS": "EL ${target} nombrado \"${pageName}\" ya existe. Por favor eliga otro.",
    "TOAST_INVALID_TARGET_NAME": "El nombre \"${name}\" no es valido. Los nombres pueden contener letras, n&uacute;meros, subrayados, no debe comenzar con un n&uacute;mero, y no debe ser una palabra reservada Javascript.",
    "WAIT_BUILD_PREVIEW": "Creando vista previa...",
    "CONFIRM_UNSAVEDTAB_HEADER": "Tiene cambios sin guardar:",
    "CONFIRM_UNSAVEDTAB_CLOSEANYWAY": "Cerrar de todos modos?",
    "CONFIRM_REFRESH_SCRIPT": "&iquest;Seguro de que desea volver a cargar este archivo archivo del disco? Los cambios no guardados se perder&aacute;n",
    "TITLE_PREFERENCES": "´Preferencias de WaveMaker",


    "DATA_UTILS_DATABASE": "Base de datos",
    "DATA_UTILS_FILE": "Archivo",
    "DATA_UTILS_DATABASE_HELP": "Ingrese el nombre de la base de datos de su servidor de base de datos",
    "DATA_UTILS_FILE_HELP": "Escriba el nombre del archivo en la carpeta de datos webapproot/data de su proyecto. Si el nombre es hrdb.script, simplemente introduzca hrdb.",
    "CONFIRM_SAVE_LANGUAGE": "Usted debe guardar el proyecto antes de cambiar el idioma, guardar y continuar?" 
	

	}
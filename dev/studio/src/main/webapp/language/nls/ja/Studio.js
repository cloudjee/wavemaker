/*
 * Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
 * Copyright (C) 2011 Infoteria Corporation All rights reserved.
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
	addPatchDialog: {title: "スタジオにパッチを適用"},
	jarDownloadDialog: {title: "Jarファイルをインポート"},
	ImportThirdPartyAPIDialog: {title: "パートナーサービスをインポート"},
	propertiesDialog: {title: "プロパティ"},
	paletteDialog: {title: "パレット／モデル"},
	deploymentDialog: {title: "配布"},
	loginDialog: {title: "ログイン"},
	newProjectDialog: {title: "新しいプロジェクト"},
	helpDialog: {title: "ヘルプ"},
	navigationMenu: {width: "500px",
		"fullStructure": 
		[
			{"label" :"ファイル",
			 idInPage: "projectPopupBtn",
			 "children": 
				[
				{"label":"新しいプロジェクト...",
			       idInPage: "newProjectItem",
			       onClick: "newProjectClick",
			       iconClass: "newProjectItem"},
				{"label": "保存",
			       idInPage: "saveProjectItem",
			       onClick: "saveProjectClick",
			       iconClass: "Studio_canvasToolbarImageList16_1"},
				{"label": "プロジェクトを開く...",
			       idInPage: "openProjectItem",
			       onClick: "openProjectClick",
			       iconClass: "openProjectItem"},
				{"label": "プロジェクトを閉じる",
			       idInPage: "closeProjectItem",
			       onClick: "closeClick",
			       iconClass: "closeProjectItem"},
				{"label": "現在のプロジェクトを複製...",
			       idInPage: "copyProjectItem",
			       onClick: "copyProjectClick",
			       iconClass: "copyProjectItem"},
				{"label": "現在のプロジェクトを削除",
			       idInPage: "deleteProjectItem",
			       onClick: "deleteProjectClick",
			       iconClass: "deleteProjectItem"},
				{"label": "プロジェクトをエクスポート",
			       idInPage: "exportProjectItem",
			       onClick: "exportClick",
			       iconClass: "exportProjectItem"},
				{"label": "プロジェクトをインポート...",
			       idInPage: "importProjectItem",
			       onClick: "importClick",
			       iconClass: "importProjectItem"},
				{"label": "配布...",
			       idInPage: "deployProjectItem",
			       children: [
				   {label: "新規配布...",
				    onClick: "newDeployClick"},
				   {label: "設定...",
				    onClick: "settingsDeployClick"},
				   {label: "CloudFoundryアプリを管理...",
				    onClick: "cloudFoundryDeploymentsClick"}
			       ],
			       iconClass: "deployProjectItem"},                                      
				{"label": "環境設定...",
			       idInPage: "preferencesItem",
			       onClick: "projectSettingsClick",
			       iconClass: "preferencesItem"},
			     {"label": "スタジオを更新",
			      iconClass: "importProjectItem",
			      children: [
				  {"label": "スタジオパッチをアップロード...",
				   onClick: "uploadStudioPatches"},
				  {"label": "パートナーサービスをインポート...",
				   onClick: "importPartnerService"}
			      ]
			     }
			 	]},
			{"label": "編集",
				idInPage: "editPopupBtn",
				"children": [
				{"label": "切り取り",
				 idInPage: "cutItem",
				 onClick: "cutClick",
				 iconClass: "cutItem"},
				{"label": "コピー",
				 idInPage: "copyItem",
				 onClick: "copyClick",
				 iconClass: "copyItem"},
				{"label": "貼り付け",
				 idInPage: "pasteItem",
				 onClick: "pasteClick",
				 iconClass: "pasteItem"},
				{"label": "削除",
				 idInPage: "deleteItem",
				 onClick: "deleteClick",
				 iconClass: "deleteItem"},
				{"label": "元に戻す",
				 idInPage: "undoItem",
				 onClick: "undoClick",
				 iconClass: "undoItem"}
				]},
			{"label": "挿入", 
			     idInPage: "insertPopupBtn",
			     "children":[]},
			{"label": "ページ",
			    idInPage: "pagePopupBtn",
			    "children":[
				{"label": "新規作成...",
				 idInPage: "newPageItem",
				 onClick: "newPageClick",
				 iconClass: "newPageItem"},
				{"label": "名前をつけて保存...",
				 idInPage: "saveAsPageItem",
				 onClick: "savePageAsClick",
				 iconClass: "saveAsPageItem"},
				{"label": "ページをインポート...",
				 idInPage: "importPageItem",
				 onClick: "importProjectClick",
				 iconClass: "importPageItem"},
				{"label": "削除",
				 idInPage: "deletePageItem",
				 iconClass: "deleteItem",
				 children: []},
				{"label": "ホームページに設定",
				 idInPage: "setHomePageItem",
				 //onClick: "makeHomeClick",
				 iconClass: "setHomePageItem",
				 children: []}
				]},
			{"label": "サービス",
			     idInPage: "servicesPopupBtn",
			     "children":[]}
		]},

	runPopup: {caption: "実行", 
        fullStructure: [{label: "実行", iconClass: "studioProjectRun"},{label: "テスト", iconClass: "studioProjectTest"},{label:"コンパイル", iconClass: "studioProjectCompile"}]
	},
	navEditAccountBtn: {hint: "アカウント編集", caption: "<img src=\"images/cloud_user_settings.png\"/><span style=\"font-weight:bold\">アカウント編集</span>"},
	navLogoutBtn: {hint: "ログアウト", caption: "<img src=\"images/cloud_logout.png\"/><span style=\"font-weight:bold\">ログアウト</span>"},
	menuBarHelp: {caption: "<span class='StudioHelpIcon'></span>ヘルプ", width: "60px"},

	/* left */
	mlpal: {caption: "パレット"},
	paletteSearch: {placeHolder: "コンポーネント／ウィジェットを検索"},
	leftObjects: {caption: "モデル"},
	treeSearch: {placeHolder: "コンポーネント／ウィジェットを検索"},
	label12: {caption: "ビジュアルコンポーネント"},
	componentModel: {caption: "サービス"},
	compTreeSearch: {placeHolder: "コンポーネント／ウィジェットを検索"},
	compLabel11: {caption: "サービス"},
	label1222: {caption: "コンポーネント"},

	/* workspace */
	workspace: {caption: "キャンバス"},
	pageSaveBtn: {hint: "保存"},
	cutBtn: {hint: "切り取り"},
	copyBtn: {hint: "コピー"},
	pasteBtn: {hint: "貼り付け"},
	deleteBtn: {hint: "削除"},
	undoBtn: {hint: "元に戻す"},
	outlineBtn: {hint: "アウトライン"},
	pageSelect: {caption: "ページを開く"},
	languageSelect: {caption: "言語"},

	/* sourceTab */
	sourceTab: {caption: "ソース"},
	/* scriptLayer */
	scriptLayer: {caption: "スクリプト"},
	scriptPageSaveBtn: {hint: "保存"},
	scriptPageFindBtn: {hint: "検索"},
	scriptPageImportBtn: {hint: "JSライブラリをインポート"},
	scriptPageRefreshBtn: {hint: "サーバーから更新"},
	scriptPageFormatBtn: {hint: "再フォーマット"},
	scriptPageWordWrapBtn: {hint: "改行モードのの切り替え"},
	scriptPageCompletionsBtn: {hint: "オートコンプリート"},
	scriptPageHelpBtn: {hint: "ヘルプ"},
	/* cssLayer */
	cssLayer: {caption: "CSS"},
	cssPageFindBtn: {hint: "保存"},
	cssPageSaveBtn: {hint: "検索"},
	cssPageImportBtn: {hint: "CSSをインポート"},
	cssPageWordWrapBtn: {hint: "改行モードの切り替え"},
	cssPageHelpBtn: {hint: "ヘルプ"},
	cssPageLabel: {caption: "ページCSS"},
	cssAppLabel: {caption: "アプリケーションCSS"},
	/* markupLayer */
	markupLayer: {caption: "マークアップ"},
	markupPageSaveBtn: {hint: "保存"},
	markupPageFindBtn: {hint: "検索"},
	markupPageWordWrapBtn: {hint: "改行モードの切り替え"},
	markupPageHelpBtn: {hint: "ヘルプ"},
	/* markupLayer */
	widgets: {caption: "ウィジェット"},
	/* appsource */
	appsource: {caption: "スクリプト"},
	appsrcPageSaveBtn: {hint: "保存"},
	appsrcPageFindBtn: {hint: "検索"},
	appsrcPageImportBtn: {hint: "JSライブラリをインポート"},
	appsrcPageFormatBtn: {hint: "再フォーマット"},
	appsrcPageWordWrapBtn: {hint: "改行モードのの切り替え"},
	appsrcPageHelpBtn: {hint: "ヘルプ"},
	/* themeLayer */
	themeLayer: {caption: "テーマ"},
	themesPageSaveBtn: {hint: "保存"},
	themesPageAddBtn: {hint: "新しいテーマ..."},
	themesPageCopyBtn: {hint: "テーマを複製..."},
	themesPageDeleteBtn: {hint: "テーマを削除"},
	themesPageRevertBtn: {hint: "テーマを元に戻す"},
	/* appDocs */
	appDocs: {caption: "ドキュメント"},
	appdocsPrintBtn: {hint: "印刷"},
	/* logs */
	logs: {caption: "サーバーログ"},
	/* resourcesTab */
	resourcesTab: {caption: "リソース"},

	/* JavaEditorTab */
	JavaEditorTab: {caption: "Java"},
	/* databaseTab */
	databaseTab: {caption: "データベース"},
	/* webServiceTab */
	webServiceTab: {caption: "ウェブサービス"},
	/* securityTab */
	securityTab: {caption: "セキュリティ"},

    ALERT_OLD_IE_BAD: "<p>WaveMaker アプリケーションはIE6以降で動作します。</p><p>しかし、WaveMakerスタジオにはChrome、FireFox、IE8が必要です。</p><p>注意： IE8でWaveMakerスタジオを利用するには互換モードをオフにしてください。</p>",
    TOOLTIP_SECURITY_ERROR: "ここに表示されるセキュリティエラーは設計中のプロジェクトには影響しません。デザイナーの中でデータを表示できないというエラーです。この問題を解決するには、アプリケーションを起動し、アプリケーションにログインすればデザイナー上にデータが表示されます",

    /* Documentation; Help Menu */
    URL_TUTORIALS: "http://dev.wavemaker.com/wiki/bin/wmdoc_${studioVersionNumber}/Tutorials",
    URL_DOCS: "http://dev.wavemaker.com/wiki/bin/wmdoc_${studioVersionNumber}/",
    URL_PROPDOCS: "http://dev.wavemaker.com/wiki/bin/wmjsref_${studioVersionNumber}/",
    URL_EDIT_PROPDOCS: "http://dev.wavemaker.com/wiki/bin/inline/wmjsref_${studioVersionNumber}/",
    URL_FORUMS: "http://dev.wavemaker.com/forums",
    "MENU_ITEM_TUTORIALS" : "チュートリアル",
    "MENU_ITEM_DOCS" : "ドキュメント",
    "MENU_ITEM_COMMUNITY" : "フォーラム",
    "MENU_ITEM_PROPDOCS" : "JavaScript (クライアント) ドキュメント",


    TOAST_RUN_FAILED: '実行に失敗しました: ${error}',
    ALERT_NEW_WIDGET_NEEDS_CONTAINER: "新しいウィジェットのコンテナーがありません。すべてのコンテナーがロックされているか固定されています。",

    /* Shortcuts dialog */
    SHORTCUTS_HEADER: "よく使われるショートカット",
    SHORTCUTS_W: "幅を100%と100pxで切り替え (Windows版Chromeではサポートされません)",
    SHORTCUTS_H: "高さを100%と100pxで切り替え",
    SHORTCUTS_M: "モデルとパレットの切り替え",
    SHORTCUTS_S: "プロジェクトを保存",
    SHORTCUTS_R: "プロジェクトを実行",
    SHORTCUTS_ESC_1: "ダイアログが開いている場合は閉じる",
    SHORTCUTS_ESC_2: "ダイアログが開いていない場合は選択されているウィジェットの親を選択",
    SHORTCUTS_DEL: "選択しているコンポーネントを削除 (テキストフィールドやプロパティが編集状態にない場合)",
    SHORTCUTS_HEADER_2: "ショートカット（上級）",
    SHORTCUTS_O: "コンテナー内のウィジェットの水平方向の配置を切り替え",
    SHORTCUTS_E: "コンテナー内のウィジェットの垂直方向の配置を切り替え",
    SHORTCUTS_B: "左右レイアウトと上下レイアウトの切り替え",
    SHORTCUTS_Z: "元に戻す",


    /* Generate documentation */
    GENERATE_DOCUMENTATION_HEADER: "<i>注意: このページはドキュメントのレビューのためのものです; ドキュメントを編集するにはモデルからコンポーネントを選択し、ドキュメントプロパティを選択してください。</i>",
    GENERATE_DOCUMENTATION_NODOCS: "ドキュメントはありません",
    GENERATE_DOCUMENTATION_NONVISUAL_HEADER: "ページ ${pageName} 非ビジュアルコンポーネント</h2>",
    GENERATE_DOCUMENTATION_VISUAL_HEADER: "ページ ${pageName} ビジュアルコンポーネント</h2>",
    "wm.Component.DOCUMENTATION_DIALOG_TITLE": "ドキュメント ${name}",
    "wm.Component.GENERATE_DOCUMENTATION_TOPNOTE": "生成されたドキュメント",
    "wm.Component.GENERATE_DOCUMENTATION_EVENT_HEADER": "<h4>${eventName}</h4>\n 実行 ",
    "wm.Component.GENERATE_DOCUMENTATION_EVENT_TARGET_TYPE": "<b>型:</b>: ${componentType}",
    "wm.Component.GENERATE_DOCUMENTATION_EVENT_TARGET_OPERATION": "<b>操作:</b>: ${operation}",
    "wm.Component.GENERATE_DOCUMENTATION_EVENT_FUNCTION": "${functionName} (関数)",
    "wm.Component.GENERATE_DOCUMENTATION_NO_EVENT_HANDLER": "イベントハンドラーはありません",
    "wm.Component.GENERATE_DOCUMENTATION_EVENT_SECTION": "<h4>イベントハンドラー</h4><div style='margin-left:15px;'>${eventHtml}</div>",
    "wm.Component.GENERATE_DOCUMENTATION_EVENT_HANDLERS_HEADER": "<h4>次のオブジェクトイベントハンドラーはこのコンポーネントをアクティベートします</h4><ul  style='padding-left:0px;list-style-position: inside;margin-left: 15px;'>\n${eventHtml}</ul>",
    "wm.Component.GENERATE_DOCUMENTATION_BINDING": "<li><b>${property}</b>は<i>${source}</i>にバインドされています</li>\n",
    "wm.Component.GENERATE_DOCUMENTATION_NO_BINDING": "バインドされていません",
    "wm.Component.GENERATE_DOCUMENTATION_BINDING_SECTION": "<h4>このオブジェクトは次のバインディングを持っています</h4><ul  style='padding-left:0px;list-style-position: inside;margin-left: 15px;'>\n${bindingHtml}</ul>",
    "wm.Component.GENERATE_DOCUMENTATION_BOUND_TO": "<li><b>${targetComponent}.${targetProperty}</b>は<i>${source}</i>にバインドされています</li>\n",
    "wm.Component.GENERATE_DOCUMENTATION_BOUND_TO_SECTION": "<h4>次のオブジェクトはこれにバインドされています</h4><ul  style='padding-left:0px;list-style-position: inside;margin-left: 15px;'>\n${bindHtml}</ul>",

    "wm.DojoFlashFileUpload.CAPTION_UPLOAD": "アップロード",
    "wm.DojoFlashFileUpload.CAPTION_SELECT": "ファイルを選択...",



    JSON_PENDING: "リクエストを中断しています: ${name}",
    CONFIRM_LOGOUT: 'ログアウトしますか？保存されていない変更は破棄されます。', /* Cloud version only */
    CONFIRM_OPEN_PAGE_LOSE_UNSAVED : "${newPage}ページを開きますか？保存されていない${oldPage}ページへの変更は破棄されます。",
    CONFIRM_CLOSE_PROJECT_LOSE_UNSAVED : "プロジェクト \"${projectName}\"を閉じますか？保存されていない変更は破棄されます。",
    WAIT_OPENING_PAGE: "ページを開いています: ${pageName}",



    "LAYER_NAME_IDE" : "ソース",
    "ALERT_UNSAVED_LOST" : "配布されていない変更は破棄されますので注意してください。",
    "ALERT_NO_UNSAVED" : "保存されていない変更はありません。",

    /* wm.DataModel */
    "wm.DataModel.WAIT_ADDING": "${dataModel}を追加しています",
    "wm.DataModel.IMPORT_DATABASE_TITLE": "新しいデータモデル",
    "wm.DataModel.TOAST_IMPORT_SUCCESS": "新しいデータモデル${dataModel}がインポートされました",
    "wm.DataModel.ENTER_NAME": "データモデルの名前を入力してください",
    "wm.DataModel.ORACLE_JAR_INSTRUCTIONS": "<p>Oracleを使用するにはojdbc14.jarをダウンドーロしてインストールしなければなりません</p><p><a target='_New' href='http://www.oracle.com/technetwork/database/enterprise-edition/jdbc-10201-088211.html'>Oracle</a>へ行き、ojdbc14.jar（もしくは最新バージョン）をダウンロードして下さい。</p><p>終わったら\"次へ\"ボタンをクリックしてください。</p>",
    "wm.DataModel.DB2_JAR_INSTRUCTIONS":  "<p>DB2を使用するにはdb2jcc.jarをダウンドーロしてインストールしなければなりません</p><p><a target='_New' href='https://www14.software.ibm.com/webapp/iwm/web/reg/pick.do?source=swg-idsjs11'>IBM</a>へ行き、ドライバーをダウンロードして下さい。</p><p>zipファイルを開いて、db2jcc.jarを見つけてください。(db2jcc4.jarは無視してください)</p><p>終わったら\"次へ\"ボタンをクリックしてください。</p>",

    /* wm.JavaService */
    "wm.JavaService.WAIT_INITIALIZING": "Javaサービス${serviceId}を初期化しています",
    "wm.JavaService.CREATE_SERVICE_TITLE": "新しいJavaサービス",
    "wm.JavaService.CREATE_SERVICE_OK": "OK",
    "wm.JavaService.CREATE_SERVICE_CANCEL": "キャンセル",
    "wm.JavaService.WAIT_CREATING_SERVICE": "サービスを作成しています",
    "wm.JavaService.TOAST_SUCCESS_CREATING_SERVICE": "Javaサービス ${serviceId} を作成しました",
    "wm.JavaService.TOAST_ERROR_CREATING_SERVICE": "Javaサービス ${serviceId} の作成に失敗しました",

    /* wm.WebService */
    "wm.WebService.IMPORT_TITLE": "ウェブサービスのインポート",
    "wm.WebService.JAR_INSTRUCTIONS": "<p>ウェブサービスを使用するには、wsdl4j.jarをダウンロードしてインストールする必要があります。</p><p><a target='_New' href='http://sourceforge.net/projects/wsdl4j/'>SourceForge</a>へ行き、wsdl4j-bin-1.6.2をダウンロードしてください。</p><p>zipファイルを開いて、libフォルダーにあるwsdl4j.jarを見つけてください。見つかったらこのダイアログの\"次へ\"ボタンをクリックしてください。",

    /* wm.LiveVariable */
    "wm.LiveVariable.ALERT_INVALID_SORT_ORDER": "orderyBy節で使用されるプロパティは「asc|desc: &lt;propertyPath&gt;」の形式でなければなりません。\"${order}\" はこの形式に一致していません。現在のorderBy節はエラーになるので修正してください。",

    /* wm.Page/PageLoader */
    "wm.Page.WIDGETS_MISSING": "ページ ${pageName} にはエラーがあります",
    "wm.PageLoader.JS_NOT_LOADED": "ページ ${inName}.js にはエラーがあります",

    /* wm.PageContainer */
    "wm.PageContainer.OPEN_PAGE": "ページを開く",
    "wm.PageContainer.NEW_PAGE": "新しいページ",
    "wm.PageContainer.NEW_PAGE_OPTION": "- 新しいページ",
    "wm.PageContainer.CONFIRM_SAVE_CHANGES": "次のページに移動する前に現在のページを保存しますか？pageContainerのpageNameを保存します。",

    /* wm.Property/Composite/Publisher */
    "wm.Property.SELECT_PROPERTY": "<b>${propertyName}</b>として発行するプロパティを選択してください",

    /* wm.PopupMenuButton, wm.DojoMenu */
    "wm.PopupMenuButton.MENU_DESIGNER_TITLE":"メニューを編集",
    "wm.DojoMenu.MENU_DESIGNER_TITLE": "メニューを編集",
    "wm.PopupMenu.DEFAULT_STRUCTURE": 
        [{label: "ファイル",	children: [{label: "保存"},{label: "閉じる"}]},
         {label: "編集",	children: [{label: "切り取り"}, {label: "コピー"},{label: "貼り付け"}]},
         {label: "ヘルプ"}],

    /* wm.ContextMenuDialog */
    "wm.ContextMenuDialog.DELETE_LABEL": '削除', 
    "wm.ContextMenuDialog.SHOW_MORE": '詳細なプロパティを表示 >>',
    "wm.ContextMenuDialog.SHOW_LESS": '<< Hide詳細なプロパティを隠す',

    /* wm.Dashboard */
    "wm.Dashboard.CONTEXT_MENU_TITLE": "ポートレットを構成",
    "wm.Dashboard.CONFIG_DIALOG_OPEN_FIELD": "デフォルト",
    "wm.Dashboard.CONFIG_DIALOG_TITLE_FIELD": "タイトル",
    "wm.Dashboard.CONFIG_DIALOG_PAGE_FIELD": "ページ",
    "wm.Dashboard.CONFIG_DIALOG_CLOSE_FIELD": "開閉可能",

    /* wm.ListViewer */
    "wm.ListViewer.NO_DATASET": "新しいページを作成する前にdataSetを選択",
    "wm.ListViewer.CONFIRM_SAVE_CHANGES": "次のページに移動する前にこのページを保存しますか？", 

     /* wm.DojoGrid */
    "wm.DojoGrid.HELP_TEXT": '* 列を再編成するには、ダイアログを閉じて、グリッドのカラムをドラッグし、好きな位置にドロップしてください。<br>* このダイアログを開くにはグリッドの上で右クリックしてください。',
    "wm.DojoGrid.CONFIG_ID": "フィールド",
    "wm.DojoGrid.CONFIG_TITLE": "タイトル",
    "wm.DojoGrid.CONFIG_WIDTH": "幅",
    "wm.DojoGrid.CONFIG_ALIGN": "配置",
    "wm.DojoGrid.CONFIG_FORMAT": "形式",
    "wm.DojoGrid.CONFIG_TYPE": "フィールド型を編集",
    "wm.DojoGrid.CONFIG_EXPR": "データ式",
    "wm.DojoGrid.ADD_COLUMN_LABEL": "列を追加",
    "wm.DojoGrid.EDIT_COLUMNS_DIALOG_TITLE": "DojoGrid列プロパティ",
    "wm.DojoGrid.ADD_FORMATTER": '- フォーマットを追加',
    "wm.DojoGrid.COLUMN_ALIGN_RIGHT": "右",
    "wm.DojoGrid.COLUMN_ALIGN_LEFT": "左",
    "wm.DojoGrid.COLUMN_ALIGN_CENTER": "中央",


    /* Studio Service Tabs */
    "wm.LiveView.TAB_CAPTION": "ライブビュー",
    "wm.Security.TAB_CAPTION": "セキュリティ",
    "wm.Query.TAB_CAPTION": "クエリー",
    "wm.DataModel.TAB_CAPTION": "データモデル",

    
    /* LivePanel, LiveForm, EditPanel, RelatedEditor */
    "wm.RelatedEditor.BAD_EDIT_MODE": "このエディターで編集可能にするには親エディターのeditingModeを編集可能にする必要があります。",
    "wm.RelatedEditor.LOOKUP_CAPTION": "${fieldName} (検索)",
    "wm.LivePanel.CHOOSER_TITLE": "ライブパネルのレイアウトを選択",
    "wm.LivePanel.DETAILS_PANEL_TITLE": "詳細",
    "wm.LivePanel.WAIT_GENERATING": "生成中です...",
    "wm.LiveForm.GENERATE_BUTTONS_TITLE": "フォームボタンを生成",
    "wm.LiveForm.GENERATE_BUTTONS_PROMPT": "どのボタンを作成しますか？EditPanelはボタンを管理します; あなた自身のボタンパネルを作成するには基本ボタンから始めることをお勧めします",
    "wm.LiveForm.GENERATE_BUTTONS_CAPTION1": "パネルを編集",
    "wm.LiveForm.GENERATE_BUTTONS_CAPTION2": "基本ボタン",
    "wm.LiveForm.GENERATE_BUTTONS_CAPTION3": "キャンセル",
    "wm.LiveForm.GENERATE_BUTTONS_SAVE": "保存",
    "wm.LiveForm.GENERATE_BUTTONS_CANCEL": "キャンセル",
    "wm.LiveForm.GENERATE_BUTTONS_NEW": "新規",
    "wm.LiveForm.GENERATE_BUTTONS_UPDATE": "更新",
    "wm.LiveForm.GENERATE_BUTTONS_DELETE": "削除",
    "wm.LiveForm.WAIT_ADD_EDITORS": "${widgetName}のエディターを追加しています",
    "wm.LiveForm.SET_NAME_CONFIRM": "EditPanelに行ったカスタマイズは名前を変更すると無効になります。継続しますか？",
    "wm.LiveForm.CONFIRM_REMOVE_EDITORS": "本当に実行しますか？${name}の中にあるすべてのエディターが削除されます。",
    "wm.EditPanel.REMOVE_CONTROLS_CONFIRM": "本当に実行しますか？${name}の中にあるすべてのウィジェットが削除されます。",
    "wm.EditPanel.SAVE_CAPTION": "保存",
    "wm.EditPanel.CANCEL_CAPTION": "キャンセル",
    "wm.EditPanel.NEW_CAPTION": "新規",
    "wm.EditPanel.UPDATE_CAPTION": "更新",
    "wm.EditPanel.DELETE_CAPTION": "削除",


    "wm.EditArea.ENTER_LINE_NUMBER": "行番号を入力してください"    ,

    /* Editors */
    "wm.ResizeableEditor.SET_MAX_HEIGHT": "maxHeightは${minHeight}より大きくなければなりません",
    "wm.Checkbox.TOAST_WARN_CHECKED_VALUE_NOT_A_BOOLEAN": "データ型がBooleanに変更されました。チェック時の値はtrue/falseでなければなりません",
    "wm.Checkbox.TOAST_WARN_CHECKED_VALUE_NOT_A_NUMBER": "データ型がNumberに変更されました。チェック時の値は数値でなければなりません",

    /* Context Menus */
    "wm.Component.CONTEXT_MENU_LAYERS": "${parentName}のレイヤー",
    "wm.Component.CONTEXT_MENU_HELP": "${className}のドキュメント...",
    "wm.Component.CLASS_NOT_FOUND": '"${type}"コンポーネントは利用できません。',
    "wm.Palette.MENU_ITEM_COPY": "新しい${className}をコピー",
    "wm.Palette.MENU_ITEM_DOCS": "${className}のドキュメント...",
    "wm.Palette.URL_CLASS_DOCS": "http://dev.wavemaker.com/wiki/bin/PropertyDocumentation/${className}",
    "wm.Palette.TIP_DOCS": "ドキュメントを開く",

    /* action.js/clipboard.js: undo/redo */
    "UNDO_MOUSEOVER_HINT": "${hint}を元に戻す",
    "UNDO_DELETE_HINT": "${className}を削除",
    "UNDO_DROP_HINT": "${className}を削除",
    "UNDO_ADD_HINT": "${className}を追加",
    "UNDO_PROP_HINT": "プロパティ ${propName}; \"${oldValue}\" に戻る",

    "ALERT_PASTE_FAILED_PANEL_LOCKED": "貼り付けることができません。すべてのコンテナーがロックされているか固定されています。"    ,
    "CONFIRM_GENERIC_DISCARD_UNSAVED": '保存されていない変更を破棄しますか？',

    
    WAIT_BUILDING_WAR: "WARファイルを生成しています。数分かかることがあります。お待ちください。",
    ALERT_LIVE_LAYOUT_SECURITY_WARNING: "ライブレイアウトを動作させるにはプロジェクトのセキュリティを無効にする必要があります。\nセキュリティを無効にするには、セキュリティエディターで'セキュリティを有効にする'のチェックを外し、\nライブレイアウトを無効にするには、'nolive'モードでスタジオを起動してください。",
    ALERT_BUILDING_ZIP_SUCCESS: "プロジェクトファイルがzipファイルとして${inResponse}にエクスポートされました。\n\nこのプロジェクトをインポートするには別のスタジオのプロジェクトディレクトリーで解凍してください。",
    ALERT_BUILDING_ZIP_FAILED: "zipファイルの生成中にエラーが発生しました！\n${error}",
    ALERT_BUILDING_WAR_SUCCESS: "warファイルが${inResponse}に生成されました。",
    ALERT_BUILDING_WAR_FAILED: "warファイルの生成中にエラーが発生しました！\n${error}",
    TITLE_IMPORT_PROJECT: "プロジェクトをインポート",
    TITLE_CREATE_LIVE_VIEW: "新しいライブビュー",
    //TOAST_IMPORT_PROJECT: "Successfully imported project ${inResponse}",
    //ALERT_IMPORT_PROJECT_FAILED: "Error occurred while importing project!\n${error}",
    MENU_REDEPLOY: "${deploymentName}へ配布...",
    ALERT_DEPLOY_SUCCESS: "配布が成功しました。",
    ALERT_DEPLOY_FAILED: "配布に失敗しました: ${error}",
    ALERT_UNDEPLOY_COMPONENT_SUCCESS: "配布停止が成功しました。",
    ALERT_UNDEPLOY_COMPONENT_FAILED: "コンポーネントが見つかりません",
    ALERT_UNDEPLOY_COMPONENT_FAILED2: "配布停止に失敗しました: ${inError}",
    TOAST_CODE_VALIDATION_SUCCESS: "エラーはありません",
    TITLE_CODE_VALIDATION_DIALOG: "コンパイラーの結果",
    TITLE_IMPORT_JAVASCRIPT: "スクリプトインポーター",
    TITLE_IMPORT_CSS: "CSSインポーター",

    /* Auto Completion */
    AUTOCOMPLETE_ALERT_SELECT_TEXT: "'this.button1'や'button1'のようなテキストを選択し、ページの中にbutton1があればそのオブジェクトで呼び出せるメソッドを一覧にします",
    AUTOCOMPLETE_ALERT_NOT_FOUND: "\"${text}\"が見つかりません。'this.button1'や'button1'のようなテキストを選択し、ページの中にbutton1があればそのオブジェクトで呼び出せるメソッドを一覧にします",
    AUTOCOMPLETION_LABEL_PAGE_COMPONENTS: "ページコンポーネント",
    AUTOCOMPLETION_LABEL_TYPE_NUMBER: "数値",
    AUTOCOMPLETION_LABEL_TYPE_BOOLEAN: "論理値",
    AUTOCOMPLETION_LABEL_TYPE_STRING: "文字列",
    AUTOCOMPLETION_TITLE_DIALOG: "補完",
    AUTOCOMPLETION_LABEL_PROPERTIES_METHODS: "プロパティ/メソッド",
    AUTOCOMPLETION_LABEL_NAME: "<b>名前:</b><br/>&nbsp;&nbsp;&nbsp;${name}",
    AUTOCOMPLETION_LABEL_TYPE: "<b>種別:</b><br/>&nbsp;&nbsp;&nbsp;${type}",
    AUTOCOMPLETION_LABEL_PARAMS: "<b>パラメータ:</b><br/>&nbsp;&nbsp;&nbsp;${params}",
    AUTOCOMPLETION_LABEL_RETURN: "<b>返却値:</b><br/>&nbsp;&nbsp;&nbsp;${returns}",
    AUTOCOMPLETION_TYPE_NOT_SUPPORTED: "このオブジェクトの情報はありません",
    AUTOCOMPLETION_HTML: "説明を見るには単語を選択してください; ダブルクリックでコードに追加できます",
    AUTOCOMPLETION_LABEL_DESCRIPTION: "説明",

    /* Event Editor */
    "wm.EventEditor.NO_EVENTS": " - イベントなし",
    "wm.EventEditor.NEW_JAVASCRIPT": " - Javascript...",
    "wm.EventEditor.NEW_JAVASCRIPT_SHARED": " - 共有されたJavascript...",
    "wm.EventEditor.NEW_SERVICE": " - 新しいサービス...",
    "wm.EventEditor.NEW_LIVEVAR": " - 新しいライブ変数...",
    "wm.EventEditor.NEW_NAVIGATION": " - 新しいナビゲーション...",
    "wm.EventEditor.LIST_NAVIGATION": "ナビゲーション:",
    "wm.EventEditor.LIST_SERVICE": "サービス変数:",
    "wm.EventEditor.LIST_SHARED_JAVASCRIPT": "サービスイベントハンドラー:",
    "wm.EventEditor.LIST_DIALOGS": "ダイアログ:",
    "wm.EventEditor.LIST_LAYERS": "レイヤー:",
    "wm.EventEditor.LIST_DASHBOARDS": "ダッシュボード追加ウィジェット:",
    "wm.EventEditor.LIST_TIMERS": "タイマー:",

    /* Inspectors */
    "wm.DataInspector.TOAST_EXPRESSION_FAILED": "この値のコンパイルに失敗しました。もう一度やり直してください。クオートがないのかもしれません",    
    "wm.ComponentInpsectorPanel.PROPERTY_NODE_CAPTION": "プロパティ",
    "wm.ComponentInpsectorPanel.EVENT_NODE_CAPTION": "イベント",
    "wm.ComponentInpsectorPanel.CUSTOMMETHOD_NODE_CAPTION": "カスタムメソッド",
    "wm.Inspector.PROPERTIES_HEADER_CAPTION": "プロパティ",    
    "wm.Inspector.VALUES_HEADER_CAPTION": "値",    
    "wm.StyleInspector.BASIC_STYLE_LAYER_CAPTION": "基本",
    "wm.StyleInspector.CLASSES_LAYER_CAPTION": "クラス",
    "wm.StyleInspector.CUSTOM_LAYER_CAPTION": "カスタムスタイル",
    "wm.StyleInspector.CUSTOM_CLASS_CAPTION": "カスタム",
    "wm.StyleInspector.CUSTOM_BUTTON_CAPTION": "適用",

    /* Model/Services */
    "MODELTREE_NODE_PAGE_HEADING": "ページ (${className})",
    "MODELTREE_NODE_PROJECT_HEADING": "プロジェクト (${projectName})",
    "MODELTREE_CONTEXTMENU_NEW": "新しい ${className}",
    "MODELTREE_CONTEXTMENU_DOC": "ドキュメント...",

    "POPUP_BLOCKER_TITLE": "ポップアップブロッカー",
    "POPUP_BLOCKER_MESSAGE": "ポップアップブロックが検出されました - 手動で起動",
    "POPUP_BLOCKER_LAUNCH_CAPTION": "手動起動",
    "wm.studio.Project.TOAST_RESERVED_NAME": "予約されたjavascript名です",
    "wm.studio.Project.WAIT_CREATING_PROJECT": "新しいプロジェクトを設定しています",
    "wm.studio.Project.WAIT_OPEN_PROJECT": "開いています...",
    "wm.studio.Project.TOAST_OPEN_PROJECT_FAILED": "プロジェクト ${projectName} が開けません : ${error}",

    /* These next two seem to indicate the same thing, but come up from different types of errors */
    "wm.studio.Project.TOAST_OPEN_PAGE_FAILED": "ページ ${pageName} が開けません : ${error}",
    "wm.studio.Project.THROW_INVALID_PAGE": "不正なページです",

    "wm.studio.Project.WAIT_COPY_PROJECT": "コピーしています...",
    "wm.studio.Project.TOAST_COPY_PROJECT_SUCCESS": "${oldName} が ${newName} として保存されました; ${oldName} の編集を継続します",
    "wm.studio.Project.ALERT_DELETE_PAGE_FAILED": "ページ ${pageName} が削除できません: ${error}",
    "CONFIRM_CLOSE_PROJECT": "プロジェクト ${projectName} を閉じますか？保存されていない変更は破棄されます。",
    WAIT_CREATING_PAGE: "ページを作成しています: ${pageName}",
    CONFIRM_NEW_PAGE: "新しいページを追加しますか？${pageName}の保存されていない変更は破棄されます。",
    CONFIRM_OPEN_PAGE : "${newPage}を開く前に${oldPage}を保存しますか？",

    ALERT_UPGRADE_HEADING: "\n\nアップグレードに関する重要なメッセージ:\n",
    ALERT_BACKUP_OLD_PROJECT: "プロジェクトはアップグレードされました。古いプロジェクトのバックアップは${filePath}にあります\n",
    THROW_PROJECT_NOT_FOUND: "警告: ${projectPath}が見つかりません",
    SAVE_DIALOG_START_LABEL: "保存を開始しています...",
    SAVE_DIALOG_UPDATE_MESSAGE: "${componentName}を保存しています",
    "SAVE_DIALOG_ERROR_REPORT_PROJECT_FILES": "プロジェクトファイル",
    "TOAST_SAVE_PROJECT_SUCCESS": "プロジェクトが保存されました",
    "IMPORT_RESOURCE_BUTTON_CAPTION": "インポート",
    "TITLE_BIND_DIALOG": "バインド中...",
    "WAIT_PROJECT_CLOSING": "閉じています...",
    "WAIT_PROJECT_DELETING": "削除しています...",
    "RUN_BUTTON_CAPTION": "実行",
    "TEST_BUTTON_CAPTION": "実行",
    "RUN_BUTTON_CAPTION": "実行",
    "WAIT_SAVE_PAGE_AS": "${pageName}としてページを保存しています",
    "CONFIRM_DELETE_PROJECT": "${projectName}を削除しますか？",
    "CONFIRM_DELETE_PAGE": "${pageName}を削除しますか？",
    "ALERT_CANT_DELETE_HOME_PAGE": "${pageName}はプロジェクトのホームページです。ホームページを削除することはできません。",
    "PROMPT_TARGET_NAME": "新しい${target}の名前を入力してください: ",
    "TOAST_TARGET_EXISTS": "\"${pageName}\"という名前の${target}はすでに存在します。他の名前を選んでください。",
    "TOAST_INVALID_TARGET_NAME": "\"${name}\"という名前は使えません。名前には文字、数字、アンダースコアが使え、数字で始まることはできません。javascriptの予約語も使えません。",
    "WAIT_BUILD_PREVIEW": "プレビューを生成しています...",
    "CONFIRM_UNSAVEDTAB_HEADER": "保存していない変更があります:",
    "CONFIRM_UNSAVEDTAB_CLOSEANYWAY": "とにかく閉じますか？",
    "CONFIRM_REFRESH_SCRIPT": "ディスクからリロードしますか？保存されていない変更は破棄されます",
    "TITLE_PREFERENCES": "WaveMaker設定",


    "DATA_UTILS_DATABASE": "データベース",
    "DATA_UTILS_FILE": "ファイル",
    "DATA_UTILS_DATABASE_HELP": "データベースサーバーのデータベース名を入力してください",
    "DATA_UTILS_FILE_HELP": "プロジェクトのwebapproot/dataフォルダーにあるファイル名を入力してください。ファイル名がhrdb.scriptの場合はhrdbと入力してください。",
    "CONFIRM_SAVE_LANGUAGE": "言語を変更する前にプロジェクトを保存しなければなりません。保存して続けますか？",

    "STUDIO_CONFIG_TOOL_NOT_RUN": "スタジオ設定ツールが実行されていないようです。これを実行しないとスタジオのインストールが完了しません。設定ツールを実行するにはOKボタンをクリックしてください",

    COMPILE_BUTTON_WIDTH: "100px",
    RUN_BUTTON_WIDTH: "75px",
    TEST_BUTTON_WIDTH: "75px"
}

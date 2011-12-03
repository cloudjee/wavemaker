/*
 *  Copyright (C) 2011 Infoteria Corporation and VMware, Inc. All rights reserved.
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
"wm.Component": {
	name: "名前",
	owner: "オーナー",
	documentation: "ドキュメント",
	generateDocumentation: "ドキュメント作成"
},
"wm.Control": {
	margin: "マージン",
	padding: "パディング",
	height: "高さ",
	width: "幅",
	border: "枠線",
	borderColor: "枠線色",
	showing: "表示",
	disabled: "無効",
	minWidth: "最小幅",
	minHeight: "最小高さ",
	imageList: "画像リスト"
},
"wm.Container": {
	pageName: "ページ名",
	displayName: "表示名",
	deferLoad: "遅延ロード",
	loadParentFirst: "親を先にロード",
	layoutKind: "レイアウト種別",
	horizontalAlign: "横位置",
	verticalAlign: "縦位置",
	fitToContentWidth: "幅に合わせる",
	fitToContentHeight: "高さに合わせる",
	autoScroll: "自動スクロール",
	scrollX: "横スクロール",
	scrollY: "縦スクロール",
	touchScrolling: "タッチスクロール",
	customGetValidate: "customGetValidate",
	lock: "ロック",
	freeze: "固定",
	thumbnail: "サムネイル"

},
"wm.AbstractEditor": {
        defaultInsert: "Insert時の初期値",
	ignoreParentReadonly: "親の読込専用を無視",
	formField: "フィールド",
	caption: "表示名",
	captionPosition: "表示名の位置",
	captionAlign: "表示名の配置",
	captionSize: "表示名のサイズ",
	singleLine: "単一行",
	readonly: "読込専用",
	formatter: "読込専用時の形式",
	displayValue: "表示値",
	dataValue: "データ値",
	emptyValue: "空のときの値",
	required: "必須",
	helpText: "ヘルプ"
},

"wm.ToolButton": {
	iconUrl: "アイコンURL",
	iconWidth: "アイコン幅",
	iconHeight: "アイコン高さ",
	iconMargin: "アイコンマージン",
	hint: "ヒント",
	imageIndex: "画像インデックス"
},
"wm.Button": {
	caption: "表示名",
	hint: "ヒント",
	imageList: "画像リスト",
	imageIndex: "画像インデックス",
	editImageIndex: "画像インデックスを編集"
},
"wm.PopupMenuButton": {
	caption: "表示名",
	iconClass: "アイコンクラス",
	editMenuItems: "メニューアイテムを編集",
	fullStructureStr: "fullStructureStr",
	rememberWithCookie: "Cookieに保存"

},
"wm.ToggleButton": {
	captionUp: "表示名(オフ)",
	captionDown: "表示名(オン)",
	clicked: "デフォルトでオンにする"
},
"wm.BusyButton": {
	clickVariable: "クリック変数",
	defaultIconUrl: "デフォルトアイコン",
	iconLoadingUrl: "ロード時のアイコン",
	iconSuccessUrl: "成功時のアイコン",
	iconErrorUrl: "エラー時のアイコン",
	iconWidth: "アイコンの幅",
	iconHeight: "アイコンの高さ",
	iconMargin: "アイコンのマージン"
},
"wm.Label": {
	caption: "表示名",
	display: "表示形式",
	align: "配置",
	singleLine: "単一行",
	link: "リンク",
	autoSize: "自動サイズ"
},
"wm.Picture": {
	source: "ソース",
	aspect: "アスペクト比を固定",
	link: "リンク",
	hint: "ヒント",
	imageList: "画像リスト",
	imageIndex: "画像インデックス",
	editImageIndex: "画像インデックスを編集"
},
"wm.Splitter": {
	minimum: "最小",
	maximum: "最大"
},
"wm.Bevel": {
	bevelSize: "ベベルサイズ"
},
"wm.Content": {
	resource: "リソース",
	autoScroll: "自動スクロール",
	content: "コンテンツ"
},
"wm.Html": {
	autoSize: "自動サイズ",
	autoScroll: "自動スクロール",
	html: "HTML"
},
"wm.IFrame": {
	source: "ソース"
},
"wm.DojoMenu": {
	transparent: "透過",
	fullStructureStr: "fullStructureStr",
	eventList: "イベントリスト",
	editMenuItems: "メニューアイテムを編集",
	vertical: "垂直表示",
	openOnHover: "マウスオーバー時に開く"
},

"wm.Dashboard": {
	addDialogName: "ダイアログ名",
	configPortlets: "ポートレット設定",
	autoScroll: "自動スクロール",
	allowAutoScroll: "自動スクロールを許可",
	hasResizableColumns: "カラムリサイズ",
	minChildWidth: "子の最小幅",
	minColWidth: "カラム最小幅",
	nbZones: "ゾーン数",
	opacity: "不透明度",
	saveInCookie: "Cookieに保存",
	withHandles: "ハンドル"
},
"wm.PageContainer": {
	pageName: "ページ名",
	deferLoad: "遅延ロード",
	loadParentFirst: "親を先にロード"
},
"wm.Panel": {
	themeStyleType: "テーマ"
},
"wm.FancyPanel": {
	title: "タイトル",
	innerLayoutKind: "レイアウト種別",
	innerHorizontalAlign: "水平配置",
	innerVerticalAlign: "垂直配置",
	labelHeight: "ラベルの高さ",
	innerBorder: "枠線",
	innerBorderColor: "枠線色"
},
"wm.AccordionLayers": {
	autoScroll: "自動スクロール",
	scrollY: "縦スクロール",
	captionHeight: "表示名の高さ",
	layerBorder: "レイヤーの枠線",
	multiActive: "マルチアクティブ"
},
"wm.Layer": {
	caption: "表示名"

},
"wm.Layers": {
	defaultLayer: "デフォルトレイヤー",
	layersType: "レイヤー種別",
	add: "追加",
	headerHeight: "ヘッダーの高さ",
	clientBorder: "クライアント枠線",
	clientBorderColor: "クライアント枠線色",
	transition: "画面遷移"
},
"wm.TabLayers": {
	conditionalTabButtons: "状況別タブボタン"
},

"wm.Dialog": {
	title: "タイトル",
	owner: "オーナー",
	titlebarBorder: "タイトルバー枠線",
	titlebarBorderColor: "タイトルバー枠線色",
	titlebarHeight: "タイトルバー高さ",
	footerBorder: "フッター枠線",
	footerBorderColor: "フッター枠線色",
	modal: "モーダル",
	noEscape: "エスケープなし",
	noMinify: "最小化なし",
	noMaxify: "最大化なし",
	corner: "表示位置",
	positionNear: "近くに表示"
},
"wm.GenericDialog": {
	enterKeyIsButton1: "ボタン１をENTERキーに割り当て",
	button1Caption: "ボタン１表示名",
	button1Close: "ボタン１でダイアログを閉じる",
	button2Caption: "ボタン２表示名",
	button2Close: "ボタン２でダイアログを閉じる",
	button3Caption: "ボタン３表示名",
	button3Close: "ボタン３でダイアログを閉じる",
	button4Caption: "ボタン４表示名",
	button4Close: "ボタン４でダイアログを閉じる",
	userPrompt: "テキスト",
	showInput: "入力フィールドを表示",
	inputDataValue: "入力フィールド変数",
	regExp: "正規表現",
	footerBorder: "フッター枠線",
	footerBorderColor: "フッター枠線色"
},
"wm.PageDialog": {
	pageName: "ページ名",
	deferLoad: "遅延ロード",
	footerBorder: "フッター枠線",
	footerBorderColor: "フッター枠線色",
	hideControls: "コントロールを隠す"
},
"wm.DesignableDialog": {
	createButtonBar: "ボタンバーを作成"
},
"wm.LoadingDialog": {
	serviceVariableToTrack: "追跡するサービス変数",
	widgetToCover: "対象ウィジェット"
},
"wm.RichTextDialog": {
	html: "HTML",
	footerBorder: "フッター枠線",
	footerBorderColor: "フッター枠線色"
},

"wm.LiveFormBase": {
	dataSet: "データセット",
	dataOutput: "データ出力",
	addEditors: "エディターを追加",
	removeEditors: "エディターを削除",
	readonly: "読み込み専用",
	editorWidth: "エディター幅",
	editorHeight: "エディター高さ",
	captionSize: "キャプションサイズ",
	captionAlign: "キャプション配置",
	captionPosition: "キャプション位置",
	themeStyleType: "テーマ"
},
"wm.LiveForm": {
	liveEditing: "ライブ編集",
	saveOnEnterKey: "ENTERキーで保存",
	alwaysPopulateEditors: "自動更新",
	displayErrors: "エラーを表示",
	generateButtons: "ボタンを作成",
	defaultButton: "デフォルトボタン"
},
"wm.ResizableEditor": {
	autoSize: "幅を自動調整",
	maxHeight: "最大高"
},
"wm.Checkbox": {
	dataValue: "データ値",
	startChecked: "初期状態でチェック",
	dataType: "データ型",
	checkedValue: "チェック時の値"
},
"wm.Currency": {
	currency: "通貨",
	minimum: "最小値",
	maximum: "最大値",
	places: "桁数",
	rangeMessage: "範囲外時のメッセージ"
},
"wm.Date": {
	minimum: "最小値",
	maximum: "最大値",
	invalidMessage: "不正時のメッセージ",
	showMessages: "メッセージを表示",
	promptMessage: "メッセージ",
	useLocalTime: "ローカル時刻を使用"
},
"wm.DateTime": {
	invalidMessage: "不正時のメッセージ",
	showMessages: "メッセージを表示",
	promptMessage: "メッセージ",
	dateMode: "日付モード",
	formatLength: "フォーマットの長さ",
	timePanelHeight: "時刻パネルの高さ",
	useLocalTime: "ローカル時刻を使用"
},
"wm.Number": {
	dataValue: "データ値",
	places: "桁数",
	minimum: "最小値",
	maximum: "最大値",
	rangeMessage: "範囲外時のメッセージ",
	spinnerButtons: "スピンボタン"
},
"wm.RadioButton": {
	checkedValue: "選択時の値",
	radioGroup: "ラジオグループ"
},
"wm.SelectMenu": {
	placeHolder: "プレースホルダー",
	onEnterKeyPress: "onEnterKeyPress",
	restrictValues: "リストからのみ選択",
	dataSet: "データセット",
	startUpdate: "表示時に更新",
	pageSize: "ページサイズ",
	options: "オプション",
	dataValue: "データ値",
	dataField: "データフィールド",
	displayField: "表示フィールド",
	displayExpression: "表示のカスタマイズ",
	displayType: "表示形式",
	autoComplete: "自動補完",
	hasDownArrow: "矢印",
	allowNone: "未選択を許可",
	updateNow: "今すぐ更新"
},
"wm.Lookup": {
	autoDataSet: "自動データ設定",
	displayExpression: "表示式",
	maxResults: "結果最大数"
},
"wm.FilteringLookup": {
	ignoreCase: "大文字小文字を無視"
},
"wm.Slider": {
	discreteValues: "不連続値",
	minimum: "最小値",
	maximum: "最大値",
	showButtons: "ボタンを表示"
},
"wm.Text": {
	placeHolder: "プレースホルダー",
	promptMessage: "メッセージ",
	tooltipDisplayTime: "ツールチップ表示時間",
	password: "パスワード",
	maxChars: "最大文字数",
	changeOnKey: "changeOnKey",
	regExp: "正規表現",
	invalidMessage: "検証失敗時のメッセージ",
	showMessages: "メッセージを表示",
	onEnterKeyPress: "onEnterKeyPress",
	resetButton: "クリアボタン"
},
"wm.LargeTextArea": {
},
"wm.Time": {
	timePattern: "パターン",
	invalidMessage: "エラー時のメッセージ",
	showMessages: "メッセージを表示",
	promptMessage: "メッセージ",
	useLocalTime: "ローカル時刻を使用"
},
"wm.RichText": {
	toolbarUndo: "元に戻す／やり直す",
	toolbarStyle: "スタイル",
	toolbarStyleAll: "スタイル(すべて)",
	toolbarAlign: "配置",
	toolbarList: "リスト",
	toolbarLink: "リンク",
	toolbarFontName: "フォント名",
	toolbarFormatName: "形式名",
	toolbarSize: "サイズ",
	toolbarColor: "色",
	toolbarFind: "検索と置換"
},
"wm.dijit.Calendar": {
	specialDates: "特別な日",
	useDialog: "ダイアログを使う",
	dateValue: "データ値",
	displayDate: "表示日付",
	useLocalTime: "ローカル時刻を使用"
},
"wm.ColorPicker": {
},
"wm.RelatedEditor": {
	editingMode: "編集モード"
},
"wm.DojoFileUpload": {
	useList: "リストを使用",
	buttonCaption: "ボタン表示名",
	service: "サービス",
	operation: "操作",
	autoDeleteDelay: "自動削除",
	buttonWidth: "ボタン幅",
	buttonHeight: "ボタン高さ"
},
"wm.DojoFlashFileUpload": {
	fileMaskLabel: "ファイルマスクラベル",
	fileMaskList: "ファイルマスクリスト",
	uploadImmediately: "すぐにアップロード"
},

"wm.DojoGauge": {
	lowRangeColor: "ローレンジ色",
	lowRangeMin: "ローレンジ最小値",
	lowRangeMax: "ローレンジ最大値",
	midRangeColor: "ミッドレンジ色",
	midRangeMax: "ミッドレンジ最大値",
	highRangeColor: "ハイレンジ色",
	highRangeMax: "ハイレンジ最大値",
	useOverlayImage: "オーバーレイ画像を使用",
	currentValue1: "値１",
	arrowColor1: "矢印色１",
	useSecondIndicator: "二つ目の矢印を使う",
	currentValue2: "値２",
	arrowColor2: "矢印色２",
	useThirdIndicator: "三つ目の矢印を使う",
	currentValue3: "値３",
	arrowColor3: "矢印色３"
},
"wm.dijit.ProgressBar": {
	progress: "進捗度",
	indeterminate: "進捗が数値で表せない"
},
"wm.DojoGrid": {
	rendering: "レンダリング",
	selectionMode: "選択モード",
	dataSet: "データセット",
	dsType: "dsType",
	singleClickEdit: "シングルクリック編集",
	liveEditing: "ライブ編集",
	addDialogName: "ダイアログ名の追加",
	addFormName: "フォーム名の追加",
	selectFirstRow: "１行目を選択",
	caseSensitiveSort: "ソート時に大文字小文字を区別",
	customSort: "カスタムソート",
	customFormatter: "カスタムフォーマット",
	editColumns: "列を編集",
        minWidth: "最小幅",
	updateNow: "今すぐ更新"
},

"wm.DataNavigator": {
	byPage: "ページ毎",
	liveSource: "ライブ変数",
	firstRecord: "最初のレコード",
	previousRecord: "前のレコード",
	nextRecord: "次のレコード",
	lastRecord: "最後のレコード"
},
"wm.DojoChart": {
	dataSet: "データセット",
	xAxis: "X軸",
	maxTimePoints: "maxTimePoints",
	yAxis: "Y軸",
	chartColor: "チャート色",
	chartType: "チャート種別",
	theme: "テーマ",
	chartTitle: "タイトル",
	enableAnimation: "アニメーション",
	gap: "間隔",
	includeGrid: "グリッドを表示",
	includeX: "X軸を表示",
	includeY: "Y軸を表示",
	hideLegend: "凡例を隠す",
	verticalLegend: "凡例を横に表示",
	legendHeight: "凡例の高さ",
	legendWidth: "凡例の幅",
	xMajorTickStep: "X軸大目盛幅",
	xMinorTickStep: "X軸小目盛幅",
	xMinorTicks: "X軸小目盛表示",
	xAxisLabelLength: "X軸ラベル長",
	yAxisTitle: "Y軸タイトル",
	yUpperRange: "Y軸最大値"
},
"wm.List": {
	dataSet: "データセット",
	toggleSelect: "選択状態の切り替え",
	columnWidths: "カラム幅",
	dataFields: "データフィールド",
	headerVisible: "ヘッダー表示",
	updateNow: "今すぐ更新"
},
"wm.ListViewer": {
	dataSet: "データセット",
	pageName: "ページ名",
	allowRowSelection: "行選択を許可",
	avgHeight: "平均高さ",
	manageLiveVar: "ライブ変数を管理",
	rowBorder: "行の枠線"
},
"wm.Tree": {
	connectors: "コネクター"
},
"wm.PropertyTree": {
	dataSet: "データセット",
	configJson: "JSON設定"
},
"wm.ObjectTree": {
	data: "データ"
},

"wm.DraggableTree": {
	dropBetweenNodes: "ノードの間にドロップ"
},

"wm.DijitDesigner": {
	dijitClass: "dijitクラス",
	renderBoundsX: "X軸境界線を描画",
	renderBoundsY: "Y軸境界線を描画",
	deployDijit: "Dijitを配布",
	undeployDijit: "Dijitを配布中止"
},
"wm.gadget.GoogleMap": {
	dataSet: "データセット",
	latitude: "緯度",
	longitude: "経度",
	zoom: "ズーム",
	mapType: "種別",
	latitudeField: "緯度フィールド",
	longitudeField: "経度フィールド",
	titleField: "タイトルフィールド",
	descriptionField: "説明フィールド",
	iconField: "アイコンフィールド"
},
"wm.gadget.FacebookLikeButton": {
	action: "アクション",
	colorscheme: "色",
	font: "フォント",
	href: "ページのURL",
	layout: "ボタンの種類",
	ref: "追跡用文字列",
	show_faces: "写真を表示"
},
"wm.gadget.FacebookActivityFeed": {
	colorscheme: "色",
	font: "フォント",
	ref: "追跡用文字列",
	showHeader: "ヘッダーを表示",
	showRecommendations: "おすすめを表示",
	site: "サイト"
},
"wm.FeedList": {
	url: "URL",
	expand: "展開",
	headerVisible: "ヘッダーを表示",
	showLink: "リンクを表示",
	totalItems: "表示件数",
	updateNow: "今すぐ更新"
},
"wm.TwitterFeed": {
	twitterId: "Twitter ID",
	headerVisible: "ヘッダーを表示",
	updateNow: "今すぐ更新"
},
"wm.DojoFisheye": {
	dataSet: "データセット",
	imageUrlField: "画像URLフィールド",
	imageLabelField: "画像ラベルフィールド",
	itemWidth: "アイテム幅",
	itemHeight: "アイテム高",
	itemMaxWidth: "アイテム最大幅",
	itemMaxHeight: "アイテム最大高"
},
"wm.DojoLightbox": {
	dataSet: "データセット",
	imageUrlField: "画像URLフィールド",
	imageLabelField: "画像ラベルフィールド"
},
"wm.JsonStatus": {
	iconHeight: "アイコン高さ",
	iconWidth: "アイコン幅",
	minimize: "最小化",
	statusBar: "ステータスバー"
},
"wm.Ticker": {
	delay: "遅延",
	motion: "モーション",
	rewindDelay: "巻き戻し遅延",
	startNow: "開始",
	stopNow: "停止"
},

"wm.Application": {
	main: "Main Page"
}, 

"wm.Variable": {
	type: "種別",
	dataSet: "データセット",
	isList: "一覧",
	json: "JSON",
	saveInCookie: "Cookieに保存"
}, 

"wm.ServiceVariable": {
	service: "サービス",
	operation: "オペレーション",
	autoUpdate: "自動更新",
	startUpdate: "起動時に更新",
	maxResults: "結果最大数",
	designMaxResults: "スタジオでの結果最大数",
	downloadFile: "ファイルをダウンロード",
	updateNow: "今すぐ更新",
	clearInput: "入力をクリア",
	queue: "キュー"
}, 

"wm.LiveVariable": {
	service: "サービス",
	operation: "操作",
	liveSource: "ライブソース",
	sourceData: "ソースデータ",
	filter: "フィルター",
	matchMode: "一致モード",
	firstRow: "最初の行",
	orderBy: "並び替え",
	ignoreCase: "大文字小文字を区別",
}, 

"wm.NavigationCall": {
    operation: "オペレーション",
    clearInput: "入力をクリア",
    queue: "キュー"
},

"wm.ImageList": {
	url: "URL",
	colCount: "列数",
	height: "高さ",
	iconCount: "アイコン数",
	width: "幅"
},

"wm.LogoutVariable": {
	clearDataOnLogout: "ログアウト時にデータをクリア"
},

"wm.Timer": {
	owner: "オーナー",
	autoStart: "自動開始",
	delay: "遅延",
	repeating: "繰り返し"
},

"wm.TypeDefinition": {
	addField: "フィールド追加"
},

"wm.TypeDefinitionField": {
	fieldName: "フィールド名",
	fieldType: "フィールド型",
	isList: "リスト",
	isObject: "オブジェクト"
},

"wm.ComponentPublisher": {
	width: "幅",
	height: "高さ",
	publishName: "公開名",
	namespace: "名前空間",
	group: "グループ",
	displayName: "表示名",
	description: "詳細",
	deploy: "配布",
	undeploy: "配布中止"
},

"wm.Property": {
	property: "プロパティ",
	bindSource: "バインド元",
	bindTarget: "バインド対象",
	isEvent: "イベント",
	readonly: "読み込み専用",
	selectProperty: "プロパティ選択"
},

"wm.TemplatePublisher": {
	isFullPageTemplate: "全画面テンプレート"
},

/* group name that come from Inspector.js */
"GROUP_common": "共通",
"GROUP_data": "データ",
"GROUP_display": "表示",
"GROUP_layout": "レイアウト",
"GROUP_advanced layout": "レイアウト詳細",
"GROUP_style": "スタイル",
"GROUP_scrolling": "スクロールバー",
"GROUP_dataobjects": "データオブジェクト",
"GROUP_format": "形式",
"GROUP_Labeling": "ラベル",
"GROUP_edit": "編集",
"GROUP_editor": "エディターオブション",
"GROUP_editData": "エディターデータ",
"GROUP_events": "イベント",
"GROUP_Events": "一般",
"GROUP_Properties": "その他",
"GROUP_validation": "検証",
"GROUP_columns": "カラム",
"GROUP_ungrouped": "その他",
"GROUP_operation": "操作",
"GROUP_docs": "ドキュメント",
"GROUP_toolbar": "ツールバー",
"GROUP_Map": "地図",
"GROUP_Marker": "マーカー",
"GROUP_deprecated": "廃止",


/* group name that come from each component */
"GROUP_BusyButton": "ビジーボタン",
"GROUP_Buttons": "ボタン",
"GROUP_Deprecated": "廃止",
"GROUP_Services": "サービス",
"GROUP_indicator": "インジケーター",
"GROUP_gauge": "ゲージ",
"GROUP_DijitDesigner": "Dijitデザイナー",


"NODE_Properties": "プロパティ",
"NODE_Properties.format": "形式",
"NODE_Events": "イベント",
"NODE_Styles": "スタイル",
"NODE_Security": "セキュリティ",
"NODE_CustomMethods": "カスタムメソッド"

}
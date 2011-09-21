/*
 *  Copyright (C) 2011 Infoteria Corporation and VMWare, Inc. All rights reserved.
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
populateButton: {caption: "サンプル呼び出しから解析", hint: "サンプルのREST呼び出しを解析し、自動設定します"},
restPropsLabel: {caption: "ウェブサービスプロパティ"},
serviceNameInput: {caption: "サービス名"},
serviceOpInput: {caption: "オペレーション名"},
methodInput: {caption: "メソッド"},
contentTypeInput: {caption: "Content Type"},
urlInput: {caption: "サービスURL"},
parameterizedButton: {caption: "URLパラメータを追加"},
restParamsLabel: {caption: "入力パラメータ"},
inParamNameInput: {caption: "名前"},
inParamTypeInput: {caption: "型"},
restOutputLabel: {caption: "サービス出力"},
outTypeInput: {caption: "出力種別"},
outIsRawStringInput: {caption: "そのままの文字列で出力", captionSize: "150px", width: "200px"},
restSchemaLabel: {caption: "XMLスキーマ"},
xmlSchemaLabel: {caption: "XMLスキーマ"},
xmlSchemaUrlInput: {caption: "URLまたはファイルパス", captionSize: "130px"},
importXmlSchemaButton: {caption: "リフレッシュ"},
xml2SchemaButton: {caption: "サンプルXMLレスポンス→XMLスキーマ"},

ALERT_INPUT_NEEDED: "サービス名とオペレーション名は必須です！",
ALERT_NO_URL: "サービスのURLが必要です！",
WAIT_IMPORT: "RESTサービスをインポートしています...",
CONFIRM_OVERWRITE: 'サービス名がすでに存在しています。上書きしますか？',
ALERT_ERROR: "RESTサービスのインポート中にエラーが発生しました！\n${error}",
ALERT_PARAMETER_EXISTS: "パラメータ名がすでに存在しています。別の名前に変更してください！",
CONFIRM_APPEND: "クエリー文字列'${query}'をサービスのURLに追加します。 継続しますか？",
CONFIRM_GENERATE_SCHEMA: "テキストエリアに入力されたサンプルのXMLレスポンスのためのXMLスキーマを生成します。継続しますか？",
WAIT_GENERATE_SCHEMA: "XMLスキーマを生成しています...",
ALERT_GENERATE_SCHEMA_ERROR: "XMLスキーマの生成中にエラーが発生しました！\n${error}"
}
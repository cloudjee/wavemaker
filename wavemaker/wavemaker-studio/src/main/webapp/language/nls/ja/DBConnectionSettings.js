/*
 *  Copyright (C) 2012-2013 CloudJee, Inc. All rights reserved.
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
dialogLabel: {caption: "データベース接続設定"},
label101: {caption: "ユーザー名:"},
label102: {caption: "パスワード:"},
conlabel301: {caption: "RDBMS:"},
conHostLabel: {caption: "ホスト名:"},
conPortLabel: {caption: "ポート:"},
conExtra2InputLabel: {caption: "インスタンス:"},
label103: {caption: "接続URL:"},
conlabel8: {caption: "テーブルフィルター:"},
conlabel7: {caption: "スキーマフィルター:"},
conlabel16: {caption: "ドライバークラス:"},
conlabel27: {caption: "Dialect:"},
conlabel28: {caption: "Reverse Naming Strategy:"},
overrideFlagInput: {caption: "エクスポート時にデータベースを作成または既存のデータベースを再作成"},
testConnectionBtn: {caption: "接続テスト", width: "100px"},
saveBtn: {caption: "保存", width: "100px"},
reimportBtn: {caption: "再インポート", width: "100px"},
exportBtn: {caption: "エクスポート", width: "100px"},
cancelBtn: {caption: "閉じる", width: "100px"},

CONFIRM_REIMPORT: '${modelName}をもう一度インポートしますか？',
WAIT_REIMPORT: "${modelName}を再インポートしています",
CONFIRM_EXPORT: '警告: このデータベースが存在する場合、すべてのテーブル、データは削除されます。存在しない場合は新規にデータベースが作成されます。継続しますか？',
WAIT_LOADING_DDL: "DDLをロードしています...",
WAIT_DDL_OK: "データベースをエクスポートしています...",
ALERT_CONNECTION_SUCCESS: "接続に成功しました",
ALERT_CONNECTION_FAILED: "接続に失敗しました: ${error}",
ALERT_CONNECTION_PROPS_SUCCESS: "接続プロパティを更新しました",
ALERT_CONNECTION_PROPS_FAILED: "接続プロパティの更新に失敗しました",
ALERT_REIMPORT_FAILED: "再インポートに失敗しました: ${error}",
TOAST_REIMPORT_SUCCESS: "データベースが正しく再インポートされました",
ALERT_LOAD_DDL_FAILED: "DDLがロードできません: ${error}",
ALERT_EXPORT_FAILED: "エクスポートできません: ${error}",
ALERT_EXPORT_OVERWRITE_NEEDED: "'データベースを上書き'をチェックする必要があるかもしれません",
TOAST_EXPORT_SUCCESS: "正しくエクスポートされました",    
WAIT_TEST_CONNECTION: "接続テスト: ${url}",
CONFIRM_SAVE_MODEL_FIRST: "データモデルに保存されていない変更がある場合、エクスポートされません。それでもエクスポートしますか？"
}
/*
 *  Copyright (C) 2011 VMWare, Inc. All rights reserved.
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
saveQueryBtn: {hint: "クエリーを保存"},
newQueryBtn: {hint: "新しいクエリー"},
delQueryBtn: {hint: "クエリーを削除"},

queryDataModelInput: {caption: "データモデル"},
queryNameInput: {caption: "名前"},
queryCommentInput: {caption: "コメント"},
helpSectionLabel: {caption: "使い方"},
helpCaption1: {caption: "1. エディターを終了するときにクエリーの保存を忘れないでください"},
helpCaption2: {caption: "2. クエリーを作成した後に、それを使用するサービス変数を作成してください"},
helpLink: {caption: "クエリー記法の詳細"},
queryDefLabel: {caption: "クエリー定義"},
returnsSingleResultCheckBox: {caption: "単一の結果を返却"},
queryParamsLabel: {caption: "クエリーパラメーター"},
addBindParamLabel: {caption: "バインドパラメーターを追加"},
bindNameInput: {caption: "名前"},
bindTypeInput: {caption: "型"},
isInputListCheckBox: {caption: "一覧"},
bindParamInput: {caption: "テスト値"},

testLabel: {caption: "クエリーテスト"},
maxResultsInput: {caption: "結果の最大"},
runQueryBtn: {hint: "クエリーテスト"},
emptyResultSetLabel: {caption: "結果がありません"},

TOAST_SAVED: "クエリーが保存されました",
CONFIRM_DELETE: '"${name}"を削除しますか？',
WAIT_DELETE: "クエリーを削除しています...",
CONFIRM_RUN: 'DML操作を実行しますか？', /* Executed when the user tries to do an insert/update/delete as a test run */
WAIT_RUN: "クエリーを実行しています...",
CONFIRM_OVERWRITE: "既存のクエリー\"${name}\"を上書きしますか？",
ERROR_SAVING: "クエリーの保存に失敗しました: ${error}",
ERROR_CHECKING: "警告: ${error}",
ALERT_NO_BIND: "バインドパラメータ名は必須です",
ERROR_NO_NAME: "保存する前にクエリー名を入力してください。",
ERROR_NO_QUERY: "継続する前にクエリーを入力してください。", /* needed to save or test query */
ERROR_NO_DATAMODEL: "継続する前にデータモデルを選択してください。" /* needed to save or test query */
}
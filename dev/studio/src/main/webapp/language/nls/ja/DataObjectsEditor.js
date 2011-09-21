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
saveButton1: {title: "エンティティを保存", hint: "エンティティを保存"},
addEntityButton: {title: "新規", hint: "新規"},
removeButton: {title: "削除", hint: "削除"},
importDBButton: {title: "データベースをインポート", hint: "データベースをインポート"},
dbSettingsButton: {title: "データベース接続", hint: "データベース接続"},
objectquery: {caption: "オブジェクト"},
defaultPage: {caption: "デフォルト"},
objectPage: {caption: "オブジェクト"},
entityLabel: {caption: "一般"},
saveButton: {title: "エンティティを保存", hint: "エンディティを保存"},
dataModelChangedWarningLabel: {caption: "データモデルが変更されました。変更を反映するためにデータモデルをエクスポートしてください。"},
tableDetailPackageName: {caption: "パッケージ"},
tableDetailSchemaName: {caption: "スキーマ"},
tableDetailCatalogName: {caption: "カタログ"},
tableDetailTableName: {caption: "テーブル名"},
tableDetailEntityName: {caption: "エンティティ名"},
dynamicInsertCheckBox: {caption: "動的挿入"},
dynamicUpdateCheckBox: {caption: "動的更新"},
refreshCheckBox: {caption: "リフレッシュ"},
inlineHelpText: {caption: "動的挿入: insert文にnullを含んではいけません<br/><br/>動的更新: update文にnullを含んではいけません<br/><br/>リフレッシュ: 挿入/更新後にデータベースからインスタンスをリロード"},
tableLabel: {caption: "列"},
addColButton: {title: "列を追加", hint: "列を追加"},
removeColButton: {title: "列を削除", hint: "列を削除"},
name1: {caption: "名前"},
isPk: {caption: "プライマリキー"},
isFk: {caption: "外部キー"},
sqlType: {caption: "型"},
notNull: {caption: "Nullを許容しない"},
length: {caption: "長さ"},
precision: {caption: "桁"},
generator: {caption: "生成元"},
param: {caption: "パラメータ"},
relationshipsLabel: {caption: "リレーション"},
addRelButton: {title: "リレーションを追加", hint: "リレーションを追加"},
removeRelButton: {title: "リレーションを削除", hint: "リレーションを削除"},
name1: {caption: "名前"},
relatedType: {caption: "リレーション種別"},
cardinality: {caption: "カーディナリティ"},
tableName: {caption: "テーブル名"},
columnNames: {caption: "列名"},
cascadeOptions: {caption: "カスケードオプション"},
propertyNameLabel: {caption: "プロパティ名:"},

TITLE_IMPORT_DATABASE: "新しいデータモデル",
CONFIRM_NO_SAVE: "変更された内容は保存されません。それでもページを移動しますか？",
ALERT_SELECT_KEY: "外部キーとして使用するカラムを選択してください",
MESSAGE_RELATED_FAILED: "関連の更新に失敗しました",
MESSAGE_UPDATE_FAILED: "エンティティの更新に失敗しました: ${error}",
PROMPT_NEW_TABLE: '新しいテーブル名',
ALERT_CREATE_MODEL_FAILED: "データモデルの作成に失敗しました: ${error}",
ALERT_SELECT_TO_DELETE: "削除するエンティティまたはデータモデルを選択してください。",
CONFIRM_DELETE_MODEL: 'データモデル"${modelName}"を削除してもよろしいですか？',
WAIT_DELETE_MODEL: "${modelName}を削除しています",
CONFIRM_DELETE_ENTITY: 'エンティティ"${entityName}"を削除してもよろしいですか？',
WAIT_DELETE_ENTITY: "${entityName}を削除しています",
ALERT_REMOVE_COLUMN_DELETE_FIRST: "この外部キーの列を使用しているリレーションを削除してください"
}

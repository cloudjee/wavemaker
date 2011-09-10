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
stepCredentialLabel: {caption: "Amazon EC2のアカウント情報を入力してください"},
accessKeyId: {caption: "アクセスキーID"},
secretAccessKey: {caption: "シークレットアクセスキー"},
CredentialOKButton: {caption: "OK"},
CredentialBackButton: {caption: "サービスプロバイダー一覧に戻る"},

CreateContainerLabel: {caption: "コンテナーを作成"},
containerName: {caption: "コンテナー名"},
containerLocation: {caption: "ロケーション"},
CreateContainerButton: {caption: "作成"},
CreateContainerBackButton: {caption: "コンテナー一覧に戻る"},

TargetPropertiesLabel: {caption: "サーバープロパティ"},
targetName: {caption: "名前"},
targetDescription: {caption: "説明"},
destType: {caption: "Destination Type"},
serviceProvider: {caption: "サービスプロバイダー"},
container: {caption: "コンテナー"},
overrideFlag: {caption: "既存の場合に情報を上書き"},
TargetPropertiesOKButton: {caption: "OK"},
TargetPropertiesBackButton: {caption: "コンテナー一覧に戻る"},

ContainerListLayerLabel: {caption: "コンテナー一覧"},
ContainerListLabel: {caption: "コンテナーを選択してください"},

ServerListRefreshButton: {caption: "リフレッシュ"},
ServerListCreateButton: {caption: "作成"},
ContainerListTerminateButton: {caption: "削除"},
ContainerListDepTargetButton: {caption: "配布対象テーブルに追加"},
ContainerListBackButton: {caption: "認証情報の入力に戻る"},

HTML: "<font size=2>AWSアカウントを持ってない場合は、<a href='http://aws.amazon.com/account' target='_blank'>ここ</a>をクリックして作成してください。</font>",
ALERT_ENTER_CREDENTIALS: "コンテナーを管理するためにログインしてください。 もしくはwarファイルをダウンロードして代わりにホスティング提供者のツールを使用してください。",
ALERT_INVALID_CONTAINER_NAME: "エラー: コンテナー名にピリオド(.)は使用できません。",
CONTAINER_LIST_LOADING: "コンテナー一覧をロードしています",
WAIT_CREATING: "${containerName}を作成しています。数分かかることがあります。お待ちください。"
}

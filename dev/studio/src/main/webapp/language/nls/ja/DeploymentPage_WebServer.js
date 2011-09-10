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
DepTargetListLabel: {caption: "サーバーを選択してください"},
DepTargetListRefreshButton: {caption: "リフレッシュ"},
DepTargetListAddButton: {caption: "追加"},
DepTargetListEditButton: {caption: "編集"},
DepTargetListDeleteButton: {caption: "削除"},
DepTargetListOKButton: {caption: "OK"},

TargetPropertiesLabel: {caption: "サーバープロパティ"},
targetName: {caption: "名前"},
targetDescription: {caption: "説明"},
destType: {caption: "Destination Type"},
serviceProvider: {caption: "サービスプロバイダー"},
container: {caption: "コンテナー"},
serverType: {caption: "アプリケーションサーバー"},
dnsHost: {caption: "ホスト名"},
publicIP: {caption: "パブリックIPアドレス"},
privateIP: {caption: "プライベートIPアドレス"},
portNumber: {caption: "ポート"},
serverUser: {caption: "ユーザー"},
serverPassword1: {caption: "パスワード"},
serverPassword2: {caption: "パスワード（確認）"},
TargetPropertiesOKButton: {caption: "OK"},
TargetPropertiesBackButton: {caption: "サーバー一覧に戻る"},

DeployPropertiesLayerLabel: {caption: "サーバー情報を入力"},
DeployPropertiesOKButton: {caption: "OK"},
DeployPropertiesBackButton: {caption: "サーバー一覧に戻る"},

appListLayerLabel: {caption: "配布済みアプリケーション"},
appListRefreshButton: {caption: "リフレッシュ"},
appListDeployButton: {caption: "配布"},
appListRedeployButton: {caption: "再配布"},
appListUndeployButton: {caption: "配布停止"},
appListBackButton: {caption: "サーバー情報に戻る"},

stepRSCredentialLabel: {caption: "RackSpaceのアカウント情報を入力"},
rsusername: {caption: "ユーザー名"},
rspassword: {caption: "パスワード（APIアクセスキー）"},
RackSpaceCredentialOKButton: {caption: "OK"},
RSCredentialBackButton: {caption: "サーバー一覧に戻る"},

RSFileListLabel: {caption: "ファイルを選択してください"},
rsContainer: {caption: "コンテナー"},

RSFileListRefreshWarButton: {caption: "リフレッシュ"},
RSFileListUploadWarButton: {caption: "WARをアップロード"},
RSFileListUploadEarButton: {caption: "EARをアップロード"},
RSFileListDeleteButton: {caption: "削除"},
RSFileListBackButton: {caption: "認証情報の入力に戻る"},

stepAMCredentialLabel: {caption: "Amazonアカウント情報を入力"},
accessKeyId: {caption: "アクセスキーID"},
secretAccessKey: {caption: "シークレットアクセスキー"},
AMCredentialOKButton: {caption: "OK"},
AMCredentialBackButton: {caption: "サーバー一覧に戻る"},

AMFileListLabel: {caption: "ファイルを選択してください"},
amContainer: {caption: "コンテナー"},
AMFileListRefreshButton: {caption: "リフレッシュ"},
AMFileListUploadWarButton: {caption: "WARをアップロード"},
AMFileListUploadEarButton: {caption: "EARをアップロード"},
AMFileListDeleteButton: {caption: "削除"},
AMFileListBackButton: {caption: "認証情報の入力に戻る"},

contextRootLayerLabel: {caption: "コンテキストルート（対象ウェブサーバー上でのアプリケーションへのパス）"},
contextRoot: {caption: "コンテキストルート"},
contextRootLayerOKButton: {caption: "OK"},
contextRootLayerBackButton: {caption: "アプリケーション一覧へ戻る"},

HTML: "<font size=2>OpSourceサーバーインスタンスにアクセスするために、まずVPN接続をOpSource上のサーバーネットワークに対して確立しなければなりません。<a href='https://admin.opsourcecloud.net/cloudui/ms/login.htm' target='_blank'>ここ</a>をクリックして接続してください。</font>",
WAIT_LOADING_TARGETS: "deploymentTargets.xmlから配布対象をロードしています",
ALERT_UNDEPLOY_UNSUPPORTED: "Tomcatマネージャーを配布停止にするとこのサービスの一部が使えなくなりますので、この操作はサポートされません。",
WAIT_REDEPLOYING: "再配布しています...",
WAIT_UPLOADING_WAR: "WARファイルをAmazon S3にアップロードしています ...",
WAIT_UPLOADING_EAR: "EARファイルをAmazon S3にアップロードしています ...",
WAIT_DELETING_FILE: "Amazon S3からファイルを削除しています ...",
WAIT_LISTING_FILES: "ファイル一覧を取得しています...",
WAIT_UPLOADING_WAR_RACKSPACE: "WARファイルをRackSpaceストレージにアップロードしています ...",
WAIT_UPLOADING_EAR_RACKSPACE: "EARファイルをRackSpaceストレージにアップロードしています ...",
WAIT_DELETING_FILE_RACKSPACE: "RackSpaceストレージからファイルを削除しています ...",
TOAST_DEPLOY_SUCCESS: "成功しました",
TOAST_REDEPLOY_SUCCESS: "成功しました",
TOAST_UNDEPLOY_SUCCESS: "成功しました",
CONFIRM_UNDEPLOY: "このアプリケーションを配布停止にしますか？",
WAIT_UNDEPLOY: "配布停止しています...",
ALERT_ENTER_ROOT: "コンテキストルートを入力してください"
}
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

CreateServersLabel: {caption: "サーバーを生成"},
ImageListLabel: {caption: "サーバーイメージを選択"},
SecurityGroupLabel: {caption: "セキュリティグループを選択"},
KeyPairListLabel: {caption: "SSHキーペアを選択"},

VMTypeListLabel: {caption: "VMタイプを選択または入力してください"},
CreateServerButton: {caption: "作成"},
CreateServerBackButton: {caption: "サーバー一覧に戻る"},

TargetPropertiesLabel: {caption: "サーバープロパティ"},
targetName: {caption: "名前"},
targetDescription: {caption: "説明"},
destType: {caption: "Destination Type"},
serviceProvider: {caption: "サービスプロバイダー"},
serverType: {caption: "アプリケーションサーバー"},
dnsHost: {caption: "ホスト名"},
portNumber: {caption: "ポート"},
serverUser: {caption: "ユーザー"},
serverPassword1: {caption: "パスワード"},
serverPassword2: {caption: "パスワード（確認）"},
overrideFlag: {caption: "既存の場合に情報を上書き"},
TargetPropertiesOKButton: {caption: "OK"},
TargetPropertiesBackButton: {caption: "サーバー一覧に戻る"},

ServerListLabel: {caption: "サーバー一覧"},
HostListLabel: {caption: "サーバーを選択してください"},
HostListRefreshButton: {caption: "リフレッシュ"},
HostListCreateButton: {caption: "作成"},
HostListTerminateButton: {caption: "終了"},
HostListDepTargetButton: {caption: "配布対象テーブルに追加"},
HostListBackButton: {caption: "認証情報の入力に戻る"},


HTML: "<font size=2>サーバーインスタンスを作成する前に、<a href='http://aws.amazon.com/account' target='_blank'>ここ</a>をクリックして必要な作業を行ってください。<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;- WASアカウントの作成<br/>&nbsp;&nbsp;&nbsp;&nbsp;- カスタムサーバーイメージ(AMI)の作成<br/>&nbsp;&nbsp;&nbsp;&nbsp;- セキュリティグループの作成<br/>&nbsp;&nbsp;&nbsp;&nbsp;- SSHでアクセスするためのキーペアを作成<br/></font>",
ALERT_ENTER_CREDENTIALS: "サーバーを管理するためにログインしてください。 もしくはwarファイルをダウンロードして代わりにホスティング提供者のツールを使用してください。",
WAIT_CREATING_EC2: "EC2インスタンスを作成中です。数分かかることがあります。お待ちください。",
ALERT_EC2_SUCCESS: "新しいEC2インスタンスが作成されました"
}
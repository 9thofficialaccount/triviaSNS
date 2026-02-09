# 🎯 ここから始めよう！

トリビアSNSへようこそ！このガイドでは、最も早く、簡単に、無料でSNSを公開する方法を案内します。

---

## 📖 どのガイドを読むべき？

### 🚀 **今すぐ公開したい！**
→ **[QUICK_START.md](./QUICK_START.md)** を読む
- 所要時間: 15分
- 費用: 完全無料
- 難易度: ★☆☆☆☆

### 🔧 **ローカルで開発したい**
→ **[SETUP.md](./SETUP.md)** を読む
- PostgreSQLのインストール
- ローカル開発環境の構築
- 開発用コマンド

### 📘 **詳細なデプロイ手順を知りたい**
→ **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)** を読む
- 完全なデプロイ手順
- トラブルシューティング
- セキュリティ設定
- 費用の詳細

### ✅ **公開前のチェック**
→ **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** を読む
- セキュリティチェック
- 動作確認項目
- 公開前の最終確認

---

## 🎬 最速で公開する3ステップ

### ステップ1: 依存関係をインストール

```bash
npm install
```

### ステップ2: GitHubにプッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/trivia-sns.git
git push -u origin main
```

### ステップ3: Vercelでデプロイ

1. https://vercel.com にアクセス
2. GitHubリポジトリをインポート
3. 環境変数を設定（詳細は QUICK_START.md）
4. デプロイ！

詳細: **[QUICK_START.md](./QUICK_START.md)**

---

## 💡 主要な機能

✅ **3層構造の投稿**
- 前段（130字）+ トリビア（130字）+ 引用元

✅ **信頼性管理**
- 通報システム
- コミュニティノート
- 管理者ダッシュボード

✅ **発見性**
- AIタグ付け
- 全文検索
- トレンドタグ

✅ **セキュリティ**
- NextAuth.js認証
- パスワードハッシュ化
- 管理者権限管理

詳細: **[FEATURES.md](./FEATURES.md)**

---

## 📁 重要なファイル

| ファイル | 説明 |
|---------|------|
| `QUICK_START.md` | 15分で公開する手順 |
| `DEPLOY_GUIDE.md` | 詳細なデプロイガイド |
| `SETUP.md` | ローカル開発環境の構築 |
| `DEPLOYMENT_CHECKLIST.md` | 公開前チェックリスト |
| `FEATURES.md` | 実装済み機能一覧 |
| `README.md` | プロジェクト概要 |

---

## 🛠️ よく使うコマンド

### 開発

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start
```

### データベース

```bash
# マイグレーション実行
npm run db:migrate

# Prisma Studio起動（GUI）
npm run db:studio

# サンプルデータ投入
npm run db:seed

# 管理者アカウント作成
npm run create-admin
```

---

## 🎯 目的別ガイド

### 今すぐ公開したい
1. **[QUICK_START.md](./QUICK_START.md)** を読む
2. GitHubにプッシュ
3. Vercelでデプロイ
4. 完了！

### ローカルで試したい
1. **[SETUP.md](./SETUP.md)** を読む
2. PostgreSQLをインストール
3. `npm install`
4. データベース設定
5. `npm run dev`

### カスタマイズしたい
1. ローカル環境を構築
2. コードを編集
3. `git push` で自動デプロイ

---

## 💰 費用

### 無料プラン
- **Vercel**: 無料
- **Vercel Postgres**: 無料枠（256MB）
- **合計**: $0/月

### 成長したら
- **Vercel Pro**: $20/月
- **Postgres Pro**: $20/月
- **合計**: $40/月

---

## 📞 サポート

問題が発生したら:

1. **トラブルシューティング**: [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) の該当セクション
2. **GitHub Issues**: バグ報告や機能リクエスト
3. **Vercelログ**: エラーメッセージの確認

---

## 🎉 次のステップ

1. ✅ **[QUICK_START.md](./QUICK_START.md)** で公開
2. ✅ アカウント作成とログイン
3. ✅ 最初の投稿を作成
4. ✅ 友人に共有
5. ✅ フィードバックを収集
6. ✅ 機能を追加・改善

---

## 📚 もっと詳しく

- **機能一覧**: [FEATURES.md](./FEATURES.md)
- **技術スタック**: [README.md](./README.md)
- **開発ガイド**: [SETUP.md](./SETUP.md)

---

**さあ、始めましょう！🚀**

まずは **[QUICK_START.md](./QUICK_START.md)** を開いて、15分でSNSを公開しましょう！

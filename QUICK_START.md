# 🚀 3ステップで公開する

最も簡単な方法で、今すぐトリビアSNSを公開しましょう！

## ⚡ クイックスタート（所要時間: 15分）

### 前提条件
- GitHubアカウント
- Vercelアカウント（GitHubで無料登録）

---

## ステップ1: GitHubにアップロード（5分）

```bash
# 1. プロジェクトフォルダで実行
git init
git add .
git commit -m "Initial commit"

# 2. GitHubで新しいリポジトリ作成
# https://github.com/new

# 3. リポジトリをプッシュ
git remote add origin https://github.com/YOUR_USERNAME/trivia-sns.git
git push -u origin main
```

---

## ステップ2: Vercelでデプロイ（5分）

### 2-1. データベース作成

1. https://vercel.com にアクセス
2. 左メニュー **Storage** → **Create Database**
3. **Postgres** を選択
4. 名前: `trivia-sns-db`
5. リージョン: **Tokyo (hnd1)**
6. **Create** をクリック
7. **".env.local"** タブから `DATABASE_URL` をコピー

### 2-2. プロジェクトデプロイ

1. Vercel ダッシュボード → **Add New** → **Project**
2. GitHubリポジトリを選択
3. **Environment Variables** に以下を追加:

```
DATABASE_URL
（コピーした値を貼り付け）

NEXTAUTH_SECRET
（下記で生成した値を貼り付け）

NEXTAUTH_URL
（デプロイ後に https://your-project.vercel.app を入力）
```

**NEXTAUTH_SECRET 生成:**

Windows PowerShell:
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

または: https://generate-secret.vercel.app/32

4. **Deploy** をクリック

---

## ステップ3: データベース初期化（5分）

### 方法A: ローカルから（推奨）

```bash
# 1. Vercel CLIをインストール
npm i -g vercel

# 2. ログイン
vercel login

# 3. プロジェクトにリンク
vercel link

# 4. 環境変数を取得
vercel env pull .env.production.local

# 5. データベーススキーマを作成
npx prisma migrate deploy

# 6. サンプルデータを投入（オプション）
npm run db:seed
```

### 方法B: 直接実行

```bash
# DATABASE_URLを使用して直接実行
DATABASE_URL="postgresql://..." npx prisma migrate deploy
DATABASE_URL="postgresql://..." npm run db:seed
```

---

## 🎉 完了！

サイトにアクセス: `https://your-project.vercel.app`

### 初回ログイン

#### サンプルデータを投入した場合:
- メール: `admin@example.com`
- パスワード: `password123`

#### 新規アカウント作成:
1. `/register` にアクセス
2. アカウント作成
3. 管理者権限を付与（Prisma Studio使用）:

```bash
# ローカルから実行
DATABASE_URL="your-production-url" npx prisma studio

# Userテーブルで該当ユーザーの isAdmin を true に変更
```

---

## 📝 更新方法

```bash
# コード変更後
git add .
git commit -m "Update features"
git push

# Vercelが自動的に再デプロイ
```

---

## 💰 費用

- **完全無料**（小規模利用）
- Vercel Postgres 無料枠: 256MB
- 十分な個人プロジェクトや小規模コミュニティ

---

## ❓ よくある質問

**Q: 独自ドメインは使える？**
A: はい、無料で使えます。Vercel → Settings → Domains

**Q: HTTPSは自動？**
A: はい、Vercelが自動的に設定します。

**Q: バックアップは？**
A: Vercel Postgresが自動バックアップします。

**Q: エラーが出たら？**
A: `DEPLOY_GUIDE.md` のトラブルシューティングを確認

---

## 🎯 次のステップ

1. カスタムドメイン設定
2. Analytics有効化
3. 管理者アカウント作成
4. ユーザーに共有！

詳細なガイド: [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)

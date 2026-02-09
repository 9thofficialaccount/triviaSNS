# 無料で簡単にデプロイする完全ガイド

このガイドでは、**完全無料**または**ほぼ無料**でトリビアSNSを公開する方法を説明します。

## 🎯 推奨構成（最も簡単＆無料）

- **ホスティング**: Vercel（無料プラン）
- **データベース**: Vercel Postgres（無料枠）または Supabase（無料枠）
- **費用**: 月額 $0〜

---

## 📋 事前準備

### 必要なアカウント

1. **GitHubアカウント**（無料）
   - https://github.com で作成

2. **Vercelアカウント**（無料）
   - https://vercel.com で作成（GitHubでサインアップ）

3. **データベース**（どちらか選択）
   - **オプションA**: Vercel Postgres（簡単・推奨）
   - **オプションB**: Supabase（機能が豊富）

---

## 🚀 デプロイ手順

### ステップ1: GitHubにコードをプッシュ

```bash
# プロジェクトのルートディレクトリで実行

# Gitリポジトリを初期化
git init

# すべてのファイルを追加
git add .

# 初回コミット
git commit -m "Initial commit: Trivia SNS"

# GitHubで新しいリポジトリを作成してから
git remote add origin https://github.com/YOUR_USERNAME/trivia-sns.git
git branch -M main
git push -u origin main
```

### ステップ2: Vercel Postgresデータベースを作成

#### 方法: Vercelでデータベースを作成

1. **Vercelにログイン**: https://vercel.com
2. 左サイドバーから **"Storage"** をクリック
3. **"Create Database"** をクリック
4. **"Postgres"** を選択
5. データベース名を入力（例: `trivia-sns-db`）
6. **リージョン**: Tokyo (hnd1) を選択
7. **"Create"** をクリック

**接続情報の取得:**
- 作成後、**".env.local"** タブをクリック
- `DATABASE_URL` をコピーして保存

### ステップ3: Vercelでプロジェクトをデプロイ

1. **Vercelダッシュボード**: https://vercel.com/dashboard
2. **"Add New..."** → **"Project"** をクリック
3. GitHubリポジトリをインポート
4. プロジェクトを選択（trivia-sns）
5. **環境変数を設定**:

```
DATABASE_URL=postgresql://...（ステップ2でコピーした値）
NEXTAUTH_SECRET=（下記コマンドで生成）
NEXTAUTH_URL=https://your-project-name.vercel.app
```

**NEXTAUTH_SECRETの生成方法:**

Windowsの場合（PowerShell）:
```powershell
# ランダムな文字列を生成
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

または、このサイトで生成:
https://generate-secret.vercel.app/32

6. **"Deploy"** をクリック

### ステップ4: データベースマイグレーション

デプロイが完了したら、データベーススキーマを作成する必要があります。

#### 方法A: Vercelのターミナルを使用

1. Vercelプロジェクトページで **"Settings"** → **"General"**
2. **"Connected Git Repository"** セクションで設定を確認
3. ローカルで実行:

```bash
# Vercel CLIをインストール
npm i -g vercel

# Vercelにログイン
vercel login

# プロジェクトにリンク
vercel link

# 本番環境の環境変数を取得
vercel env pull .env.production.local

# マイグレーションを実行
npx prisma migrate deploy
```

#### 方法B: ローカルから直接実行

```bash
# .env.production.local ファイルを作成
# DATABASE_URL=（Vercelからコピー）

# マイグレーションを実行
DATABASE_URL="your-production-database-url" npx prisma migrate deploy

# 初期データを投入（オプション）
DATABASE_URL="your-production-database-url" npm run db:seed
```

---

## 🎉 完了！

デプロイが成功すると、以下のURLでアクセスできます:
```
https://your-project-name.vercel.app
```

### 初回アクセス時

1. `/register` にアクセス
2. 最初のアカウントを作成
3. 管理者にするには、データベースで直接変更:

```sql
-- Prisma Studioを使用（推奨）
-- または、データベースに直接接続して実行
UPDATE "User" SET "isAdmin" = true WHERE email = 'your-email@example.com';
```

---

## 🔧 更新とメンテナンス

### コードを更新する

```bash
# 変更をコミット
git add .
git commit -m "Update: ..."
git push

# Vercelが自動的に再デプロイします
```

### データベースを変更する

```bash
# 1. スキーマを変更
# prisma/schema.prisma を編集

# 2. マイグレーションを作成
npx prisma migrate dev --name add_new_feature

# 3. Gitにコミット
git add .
git commit -m "Database: add new feature"
git push

# 4. 本番環境にデプロイ（自動）
# 5. 本番DBでマイグレーション実行
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

---

## 💰 費用について

### 無料枠の制限

**Vercel（Hobby Plan）:**
- 無制限のプロジェクト
- 100GB 帯域幅/月
- 6,000ビルド分/月
- カスタムドメイン対応
- **制限**: チームメンバー追加不可

**Vercel Postgres（無料枠）:**
- 256MB ストレージ
- 約60時間のコンピュート時間/月
- 十分な小〜中規模プロジェクト対応

### 無料枠を超えたら

月間1,000〜10,000ユーザーを超える場合:
- **Vercel Pro**: $20/月
- **Vercel Postgres Pro**: $20/月
- **合計**: $40/月

---

## 🔐 セキュリティのベストプラクティス

### 1. 環境変数を安全に管理

```bash
# .env.local は絶対にGitにコミットしない
# .gitignore に含まれていることを確認

# 本番環境の環境変数はVercelで管理
```

### 2. NEXTAUTH_SECRETを強固に

```bash
# 32文字以上のランダムな文字列を使用
# 定期的に変更（3〜6ヶ月ごと）
```

### 3. データベース接続の保護

```
# SSL接続を必須に（sslmode=require）
DATABASE_URL="postgresql://...?sslmode=require"
```

---

## 📊 モニタリング

### Vercel Analytics（無料）

Vercelダッシュボードで自動的に以下が確認できます:
- ページビュー
- レスポンス時間
- エラー率
- トラフィック元

### Prisma Studio（データベース管理）

```bash
# ローカルでデータベースを確認
DATABASE_URL="your-production-url" npx prisma studio
```

---

## ❓ トラブルシューティング

### デプロイエラー

**エラー: "Module not found: Can't resolve 'bcryptjs'"**

解決策:
```bash
npm install bcryptjs @types/bcryptjs
git add package.json package-lock.json
git commit -m "Fix: add bcryptjs dependency"
git push
```

**エラー: "Prisma Client not generated"**

解決策: `vercel.json` に以下を追加済み
```json
{
  "buildCommand": "prisma generate && next build"
}
```

### データベース接続エラー

**エラー: "Can't reach database server"**

確認事項:
1. DATABASE_URL が正しく設定されているか
2. `?sslmode=require` が含まれているか
3. Vercel Postgres の場合、同じプロジェクト内か確認

### ログイン/認証エラー

**エラー: "[next-auth][error][JWT_SESSION_ERROR]"**

解決策:
1. NEXTAUTH_SECRET が設定されているか確認
2. NEXTAUTH_URL が正しいドメインか確認
3. HTTPSを使用しているか確認（Vercelは自動）

---

## 🎯 次のステップ

1. **カスタムドメインの設定**
   - Vercelプロジェクト → Settings → Domains
   - 独自ドメインを追加（無料）

2. **Analyticsの追加**
   - Vercel Analytics を有効化
   - Google Analytics を追加（オプション）

3. **バックアップの設定**
   - Vercel Postgres は自動バックアップ
   - 手動バックアップも可能

4. **パフォーマンス最適化**
   - 画像の最適化（Next.js Image）
   - キャッシング設定
   - ISR（Incremental Static Regeneration）の活用

---

## 📞 サポート

問題が発生した場合:
1. Vercelのログを確認
2. GitHubでIssueを作成
3. Vercelのコミュニティフォーラムで質問

---

**おめでとうございます！これでトリビアSNSが公開されました 🎉**

# 🚀 今すぐデプロイする手順

`vercel.json`を削除しました！以下の手順を実行してください。

## ステップ1: GitHubにプッシュ

ターミナル（PowerShell）で以下を実行してください：

```powershell
# プロジェクトフォルダに移動
cd C:\Users\repka\Downloads\SNS

# プッシュ（既にコミット済み）
git push
```

**注意：** 認証を求められたら、GitHubのユーザー名とPersonal Access Tokenを入力してください。

---

## ステップ2: Vercelで再デプロイ

### 2-1. Vercelプロジェクトページを開く

https://vercel.com/dashboard にアクセスして、プロジェクトを選択

### 2-2. 環境変数を設定

**Settings** → **Environment Variables** で以下を設定：

| Key | Value | Environment |
|-----|-------|-------------|
| `DATABASE_URL` | `postgres://98da9ff801be0c3a37a405b33d3703144a0873b91650bcf8371e0ea427af6367:sk_D57BM53ns0mEv_pTjbUeB@db.prisma.io:5432/postgres?sslmode=require` | Production |
| `NEXTAUTH_SECRET` | `5RhYr23dtlHvaSgVeX7uqJKZ8CDGIAPE` | Production |
| `NEXTAUTH_URL` | `https://trivia-sns-xsun.vercel.app` | Production |

**重要：** `@database_url` のような参照ではなく、**上記の実際の値**を貼り付けてください。

### 2-3. 再デプロイをトリガー

**Deployments** タブ → 最新のデプロイの右側の **...** メニュー → **Redeploy** をクリック

または、自動的に再デプロイされるのを待つ（GitHubプッシュ後、数秒で開始されます）

---

## ステップ3: デプロイの確認

1. **Deployments** タブでビルドログを確認
2. **Building...** が表示され、数分待つ
3. ✅ **Ready** になったら成功！

---

## ステップ4: データベース初期化

デプロイ成功後、データベーススキーマを作成する必要があります。

### 方法A: Vercel CLIを使用（推奨）

```powershell
# Vercel CLIをインストール（初回のみ）
npm install -g vercel

# Vercelにログイン
vercel login

# プロジェクトにリンク
vercel link

# 本番環境の環境変数を取得
vercel env pull .env.production.local

# マイグレーション実行
npx prisma migrate deploy

# サンプルデータ投入（オプション）
npm run db:seed
```

### 方法B: ローカルから直接実行

```powershell
# 環境変数を設定してマイグレーション実行
$env:DATABASE_URL="postgres://98da9ff801be0c3a37a405b33d3703144a0873b91650bcf8371e0ea427af6367:sk_D57BM53ns0mEv_pTjbUeB@db.prisma.io:5432/postgres?sslmode=require"
npx prisma migrate deploy

# サンプルデータ投入（オプション）
npm run db:seed
```

---

## ステップ5: サイトにアクセス

https://trivia-sns-xsun.vercel.app にアクセス！

### 初回ログイン

#### オプション1: 新規アカウント作成
1. `/register` にアクセス
2. アカウント作成
3. ログイン

#### オプション2: サンプルアカウント（シード実行済みの場合）
- メール: `admin@example.com`
- パスワード: `password123`

---

## 🎉 完了！

これでトリビアSNSがインターネット上で公開されました！

---

## ❓ トラブルシューティング

### デプロイエラーが出る

1. Vercelのログを確認
2. 環境変数が正しく設定されているか確認
3. `@database_url` のような参照ではなく、実際の値が入っているか確認

### データベース接続エラー

```
Error: P1001: Can't reach database server
```

- DATABASE_URLが正しいか確認
- `?sslmode=require` が含まれているか確認

### ビルドエラー

```
Error: Cannot find module 'bcryptjs'
```

もし発生したら：
```powershell
npm install bcryptjs @types/bcryptjs
git add package.json package-lock.json
git commit -m "Add missing dependencies"
git push
```

---

## 📞 次のステップ

1. ✅ カスタムドメイン設定（オプション）
2. ✅ 管理者アカウント作成
3. ✅ 友人に共有
4. ✅ フィードバック収集

詳細は [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) を参照してください。

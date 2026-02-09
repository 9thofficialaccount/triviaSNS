# セットアップガイド

## 前提条件

以下のソフトウェアがインストールされている必要があります：

- **Node.js** 18以上
- **PostgreSQL** 14以上
- **npm** または **yarn**

## 手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. データベースのセットアップ

PostgreSQLデータベースを作成します：

```sql
CREATE DATABASE trivia_sns;
```

### 3. 環境変数の設定

`.env.local`ファイルを編集して、データベース接続情報を設定します：

```env
DATABASE_URL="postgresql://your-username:your-password@localhost:5432/trivia_sns?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key"
```

`NEXTAUTH_SECRET`は以下のコマンドで生成できます：

```bash
openssl rand -base64 32
```

### 4. データベースマイグレーション

Prismaを使用してデータベーススキーマを作成します：

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

## オプション機能

### AIタグ付け機能

AIによる自動タグ付けを有効にするには、OpenAI APIキーを設定します：

```env
OPENAI_API_KEY="your-openai-api-key"
```

APIキーがない場合は、基本的なキーワード抽出が使用されます。

### 画像魚拓化機能

実際の画像魚拓化機能を実装するには、Puppeteerをインストールします：

```bash
npm install puppeteer
```

そして、`app/api/posts/[id]/screenshot/route.ts`のTODOコメント部分を実装してください。

## データベース管理

### Prisma Studio（データベースGUI）

```bash
npx prisma studio
```

ブラウザで http://localhost:5555 が開き、データベースの内容を確認・編集できます。

### マイグレーションのリセット

```bash
npx prisma migrate reset
```

⚠️ 警告：すべてのデータが削除されます。

## トラブルシューティング

### データベース接続エラー

- PostgreSQLが起動しているか確認
- `DATABASE_URL`の認証情報が正しいか確認
- ファイアウォールでポート5432が開いているか確認

### ビルドエラー

```bash
# キャッシュをクリア
rm -rf .next node_modules
npm install
npm run dev
```

## 本番環境へのデプロイ

### Vercel

1. リポジトリをGitHubにプッシュ
2. Vercelでプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

### データベース

本番環境では以下のようなマネージドデータベースサービスの使用を推奨：

- Vercel Postgres
- Supabase
- PlanetScale
- AWS RDS

## サポート

問題が発生した場合は、GitHubのIssuesに報告してください。

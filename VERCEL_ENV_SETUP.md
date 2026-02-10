# ⚙️ Vercel環境変数設定ガイド

## 重要：vercel.json を削除しました

`vercel.json` が環境変数の参照エラーを引き起こしていたため、削除しました。
これにより、Vercel UIで直接環境変数を設定できるようになります。

---

## 📋 設定する環境変数（3つ）

Vercel プロジェクト → **Settings** → **Environment Variables**

### 1. DATABASE_URL

```
postgres://98da9ff801be0c3a37a405b33d3703144a0873b91650bcf8371e0ea427af6367:sk_D57BM53ns0mEv_pTjbUeB@db.prisma.io:5432/postgres?sslmode=require
```

- **Environment**: Production, Preview, Development（全てにチェック）

### 2. NEXTAUTH_SECRET

```
5RhYr23dtlHvaSgVeX7uqJKZ8CDGIAPE
```

- **Environment**: Production, Preview, Development（全てにチェック）

### 3. NEXTAUTH_URL

```
https://trivia-sns-xsun.vercel.app
```

- **Environment**: Production のみ

---

## ✅ 設定方法

### 手順

1. **Vercel Dashboard** を開く
   - https://vercel.com/dashboard

2. プロジェクト **trivia-sns-xsun** を選択

3. **Settings** タブをクリック

4. 左メニューから **Environment Variables** を選択

5. **Add New** をクリック

6. 各環境変数を追加：
   - **Key**: 変数名を入力（例: `DATABASE_URL`）
   - **Value**: 上記の値をコピー&ペースト
   - **Environments**: チェックボックスを選択
   - **Save** をクリック

7. 3つすべて追加したら完了

---

## 🔒 セキュリティ注意事項

### 環境変数は秘密情報です

- **絶対に公開しない**（GitHub、SNS等）
- **スクリーンショットを共有しない**
- **環境変数をコミットしない**（`.env` ファイルは `.gitignore` に含まれています）

### もし漏洩した場合

1. **DATABASE_URL**: Prismaダッシュボードでデータベースを削除して再作成
2. **NEXTAUTH_SECRET**: 新しいランダムな文字列を生成して置き換え
3. Vercelで環境変数を更新
4. 再デプロイ

---

## 🎯 環境変数の説明

### DATABASE_URL
- **用途**: データベース接続文字列
- **必須**: ✅ はい
- **形式**: PostgreSQL接続URL

### NEXTAUTH_SECRET
- **用途**: セッショントークンの暗号化キー
- **必須**: ✅ はい
- **要件**: 32文字以上のランダムな文字列

### NEXTAUTH_URL
- **用途**: 認証のコールバックURL
- **必須**: ✅ はい
- **形式**: アプリケーションの完全なURL

---

## 📝 オプション環境変数

必要に応じて追加できます：

### OPENAI_API_KEY（タグ付けAI機能用）
```
sk-xxxxxxxxxxxxxxxx
```
- なくても動作します
- AIによる自動タグ付けを有効化

### PRISMA_DATABASE_URL（パフォーマンス向上用）
```
prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGc...
```
- Prisma Accelerate使用時のみ
- クエリキャッシュによる高速化

---

## ✅ 設定完了後

1. **Deployments** タブを開く
2. **Redeploy** をクリック（または自動再デプロイを待つ）
3. ビルドログを確認
4. デプロイ完了後、サイトにアクセス

---

## ❓ よくある質問

### Q: 環境変数を変更したらどうなる？

A: 変更後、**再デプロイ**が必要です：
- Deployments → 最新デプロイの **...** → Redeploy

### Q: Preview環境とは？

A: Pull Request作成時に自動的に作られるテスト環境です。
本番と同じ設定を使用したい場合は、Preview にもチェックを入れます。

### Q: 環境変数が反映されない

A: 以下を確認：
1. 値が正しく保存されているか
2. 再デプロイしたか
3. 環境（Production/Preview/Development）が正しく選択されているか

---

## 🎉 次のステップ

環境変数設定が完了したら、[DEPLOY_NOW.md](./DEPLOY_NOW.md) に戻って次のステップに進んでください。

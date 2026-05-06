# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

「5000兆円欲しい」の3D OGPジェネレータ。ユーザーが入力した2行のテキストを React Three Fiber で 3D レンダリングし、生成された画像を Cloudflare R2 に保存する Next.js (App Router) アプリ。本番デプロイは https://5000.sawa-zen.dev で、生成画像は `https://assets-5000.sawa-zen.dev/images/<sha256>.png` で配信される。

## コマンド

```bash
npm run dev      # 開発サーバー起動 (next dev)
npm run build    # プロダクションビルド
npm run start    # プロダクション起動
npm run lint     # next lint
```

テストは未整備。

## 環境変数

`.env.example` を参照。Cloudflare R2 用の S3 互換クレデンシャルのみ。

## アーキテクチャ

### 画像生成フロー

`TopScreen` でユーザーが入力 → ブラウザの `<canvas>.toDataURL()` を `/api/upload-image` 経由で R2 に POST → そのまま X 投稿画面へ遷移。`/api/upload-image` は本番では `Origin` ヘッダで `https://5000.sawa-zen.dev` 限定。

過去には外部 curl 用の `/api/generate-image`(puppeteer + リモートブラウザ + `/og-image` ページ)もあったが、口を閉じたため削除済み。`#ready` セレクタ・`frameloop="never"`・`preserveDrawingBuffer` は、現在は `toDataURL` のためだけに残っている。

### ファイル名の決定論性

`generateFileName(firstLine, secondLine, scale)` (`src/utils.ts`) は SHA-256 で `images/<hash>.png` を返す。同じ入力なら同じパスに**上書き**される。`page.tsx` の OGP メタタグは事前に同じハッシュを計算して `assets-5000.sawa-zen.dev/images/<hash>.png` を埋め込むため、ツイート時に画像 URL を fetch せずとも OGP が解決する設計。

### フォント → 3D メッシュ変換

`src/components/ThreeCanvas/components/TextMesh/utils.ts` の `convert()` が opentype.js の `PathCommand[]` を Three.js の `Shape[]` に変換する。要点:

- 1 グリフは複数のサブパス (`M` で区切られる) に分解される。
- 面積最大のサブパスを **outer**、その内側 (重心が outer 内) のサブパスを **hole** として `outerShape.holes` に追加。外側のサブパスは別の独立 Shape として扱う。
- これは「あ」「ぬ」「8」など穴のある文字を正しく描画するため。Y 軸は `-y` で反転(opentype 座標系 → Three.js 座標系)。
- カーニングは `font.getKerningValue` で適用済み。

### Canvas のレンダリング戦略

`ThreeCanvas` は `frameloop="never"` + `preserveDrawingBuffer: true` で動作する。`TextMesh` の `useEffect` 内で `advance(0)` を 1 回だけ呼んで描画する。`toDataURL` 用にバッファを保持する必要があるため `preserveDrawingBuffer` は外せない。

### パスエイリアス

`~/*` → `./src/*` (`tsconfig.json`)。

## デプロイメモ

- フォントは `/public/fonts/delagothic_one-regular.woff` を **小文字ファイル名で**配置する必要がある(コメント参照)。

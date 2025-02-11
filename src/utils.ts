import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createHash } from "crypto"

// R2用 S3互換クライアントのセットアップ
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || "",
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
  },
})

export const generateFileName = (firstLine: string, secondLine: string, scale: number): string => {
  const hash = createHash("sha256")
      .update(`${firstLine}_${secondLine}_${scale}`)
      .digest("hex");
  return `images/${hash}.png`; // S3のパス
}

export const imageUpload = async (imageDataUrl: string, fileName: string) => {
  // "data:image/png;base64,XXXX..." という形式なので、先頭部分を削除
  const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, '')
  // base64 => バイナリ（Buffer）に変換
  const binaryData = Buffer.from(base64Data, 'base64')

  // コンテンツタイプを取得（例: 'image/png'）
  const match = imageDataUrl.match(/^data:(image\/\w+);base64,/)
  const contentType = match ? match[1] : 'image/png'

  // バケット名
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME

  // アップロードコマンド
  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: binaryData,
    ContentType: contentType,
    ContentEncoding: 'base64',
  })

  // R2 に送信
  return await s3Client.send(putCommand)
}
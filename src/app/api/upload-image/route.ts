import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

// R2用 S3互換クライアントのセットアップ
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || "",
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
  },
})

export async function POST(request: NextRequest) {
  const params = await request.json()

  // 本番の場合は、リクエスト元のドメインをチェック
  if (process.env.NODE_ENV === 'production') {
    const origin = request.headers.get('origin')
    if (!origin || !origin.startsWith('https://5000.sawa-zen.dev')) {
      return new NextResponse('Invalid request', { status: 403 })
    }
  }

  try {
    const imageDataUrl = params.imageDataUrl
    const fileName = params.fileName

    if (!imageDataUrl || !fileName) {
      return new NextResponse('imageDataUrl and fileName is required.', { status: 400 })
    }

    // "data:image/png;base64,XXXX..." という形式なので、先頭部分を削除
    const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, '')
    // base64 => バイナリ（Buffer）に変換
    const binaryData = Buffer.from(base64Data, 'base64')

    // コンテンツタイプを取得（例: 'image/png'）
    const match = imageDataUrl.match(/^data:(image\/\w+);base64,/)
    const contentType = match ? match[1] : 'image/png'

    // バケット名
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;

    // アップロードコマンド
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: binaryData,
      ContentType: contentType,
      ContentEncoding: 'base64',
    });

    console.info('putCommand:', putCommand)
    // R2 に送信
    await s3Client.send(putCommand);

    return new NextResponse(
      'Canvas image uploaded successfully',
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

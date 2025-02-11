import { NextRequest, NextResponse } from 'next/server';
import { imageUpload } from '~/utils';

export async function POST(request: NextRequest) {
  const params = await request.json()

  // 本番の場合は、リクエスト元のドメインをチェック
  if (process.env.NODE_ENV === 'production') {
    const origin = request.headers.get('origin')
    if (!origin || !origin.startsWith('https://5000.sawa-zen.dev')) {
      return new NextResponse('Invalid request', { status: 403 })
    }
  }

  const imageDataUrl = params.imageDataUrl
  const fileName = params.fileName

  if (!imageDataUrl || !fileName) {
    return new NextResponse('imageDataUrl and fileName is required.', { status: 400 })
  }

  try {
    // 画像をS3にアップロード
    await imageUpload(imageDataUrl, fileName)
    return NextResponse.json({
      'image_url': `https://assets.5000.sawa-zen.dev/${fileName}`,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      error: 'Failed to upload image'
    }, {
      status: 500
    })
  }
}

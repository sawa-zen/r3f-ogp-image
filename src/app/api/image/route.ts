// src/app/api/image/route.ts
import { NextResponse } from 'next/server';
import { getBrowser } from '~/lib/browser';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text') || '';
  const scale = parseFloat(searchParams.get('scale') || '1');

  // 使い回し中のBrowserを取得
  const browser = await getBrowser();
  // 新規ページを開く
  const page = await browser.newPage();

  try {
    // ビューポート等の初期設定
    await page.setViewport({ width: 1200, height: 630 });

    // 環境に応じてアクセス先URLを決定
    const isDev = process.env.NODE_ENV === 'development';
    const siteUrl = isDev
      ? process.env.TUNNEL_URL
      : process.env.NEXT_PUBLIC_SITE_URL || 'https://r3f-ogp-image.vercel.app';

    // ページを開いて準備ができるまで待機
    await page.goto(`${siteUrl}?text=${text}&scale=${scale}`, {
      timeout: 120000,
      waitUntil: 'networkidle0',
    });
    await page.waitForSelector('#ready', { timeout: 120000 });

    // スクリーンショット
    const buffer = await page.screenshot({ encoding: 'binary' });
    return new NextResponse(buffer, {
      headers: { 'Content-Type': 'image/png' },
    });
  } finally {
    // ページは都度閉じる。Browser自体は閉じない
    await page.close();
  }
}

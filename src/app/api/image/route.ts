import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer'

export async function GET(request: Request) {
  // URLからクエリパラメータを取得
  const { searchParams, origin } = new URL(request.url)
  const text = searchParams.get('text') || ''
  const scale = parseFloat(searchParams.get('scale') || '1')

  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BLESS_TOKEN}`,
  })
  const page = await browser.newPage()

  // ブラウザを 1200 x 630 に設定
  await page.setViewport({ width: 1200, height: 630 })

  // Three.js の描画用の HTML をセット
  const isDev = process.env.NODE_ENV === 'development';
  const siteUrl = isDev
    ? process.env.TUNNEL_URL
    : process.env.NEXT_PUBLIC_SITE_URL || 'https://r3f-ogp-image.vercel.app';

  console.info(siteUrl)

  await page.goto(`${siteUrl}?text=${text}&scale=${scale}`, { timeout: 120000, waitUntil: 'networkidle0' })
  await page.waitForSelector('#ready', { timeout: 120000 })

  // Canvas のスクリーンショットを取得
  const buffer = await page.screenshot({ encoding: 'binary' });

  await browser.close();
  console.info('Screenshot taken');

  return new NextResponse(buffer, {
    headers: { 'Content-Type': 'image/png' },
  });
}
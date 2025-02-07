import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

export async function GET(request: Request) {
  // URLからクエリパラメータを取得
  const { searchParams } = new URL(request.url)
  const text = searchParams.get('text') || ''
  const scale = parseFloat(searchParams.get('scale') || '1')

  const executablePath = await chromium.executablePath() || '/usr/bin/google-chrome-stable';

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: true,
  })
  const page = await browser.newPage()

  // ブラウザを 1200 x 630 に設定
  await page.setViewport({ width: 1200, height: 630 })

  // Three.js の描画用の HTML をセット
  await page.goto(`http://localhost:3000?text=${text}&scale=${scale}`)
  await page.waitForSelector('#ready')

  // Canvas のスクリーンショットを取得
  const buffer = await page.screenshot({ encoding: 'binary' });

  await browser.close();

  return new NextResponse(buffer, {
    headers: { 'Content-Type': 'image/png' },
  });
}
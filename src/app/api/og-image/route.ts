import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const firstLineText = searchParams.get('first_line') || ''
  const secondLineText = searchParams.get('second_line') || ''
  const scale = parseFloat(searchParams.get('scale') || '1')

  // 使い回し中のBrowserを取得
  const browser = await puppeteer.connect({
    browserWSEndpoint: process.env.BROWSER_WS_ENDPOINT,
  })
  // 新規ページを開く
  const page = await browser.newPage()

  try {
    // ビューポート等の初期設定
    await page.setViewport({ width: 600, height: 315 })

    // 環境に応じてアクセス先URLを決定
    const isDev = process.env.NODE_ENV === 'development'
    const siteUrl = isDev
      ? process.env.TUNNEL_URL
      : process.env.NEXT_PUBLIC_SITE_URL

    // ページを開いて準備ができるまで待機
    await page.goto(`${siteUrl}/og-image?first_line=${firstLineText}&second_line=${secondLineText}&scale=${scale}`, {
      timeout: 300000,
      waitUntil: 'networkidle0',
    })
    await page.waitForSelector('#ready', { timeout: 300000 })

    // スクリーンショット
    const buffer = await page.screenshot({ encoding: 'binary' })
    return new NextResponse(buffer, {
      headers: { 'Content-Type': 'image/png' },
    })
  } finally {
    // ページは都度閉じる。Browser自体は閉じない
    await page.close()
    browser.disconnect()
  }
}

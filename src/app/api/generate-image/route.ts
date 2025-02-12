import { NextRequest, NextResponse } from "next/server"
import puppeteer from 'puppeteer-core'
import { generateFileName, imageUpload } from "~/utils"

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const params = await request.json()
  const firstLineText = params['first_line'] || '5000兆円'
  const secondLineText = params['second_line'] || '欲しい'
  const scale = parseFloat(params['scale'] || '1')
  // 使い回し中のBrowserを取得
  const browser = await puppeteer.connect({
    browserWSEndpoint: process.env.BROWSER_WS_ENDPOINT,
    defaultViewport: { width: 1200, height: 630 },
  })

  // 新規ページを開く
  const page = await browser.newPage()

  // 環境に応じてpuppeteerのアクセス先URLを決定
  const isDev = process.env.NODE_ENV === 'development'
  const siteUrl = isDev
    ? process.env.TUNNEL_URL
    : "https://5000.sawa-zen.dev"

  let base64: string | undefined = undefined
  try {
    // ページを開いて準備ができるまで待機
    await page.goto(`${siteUrl}/og-image?first_line=${encodeURIComponent(firstLineText)}&second_line=${encodeURIComponent(secondLineText)}&scale=${encodeURIComponent(scale)}`, {
      timeout: 300000,
      waitUntil: 'networkidle0',
    })
    await page.waitForSelector('#ready', { timeout: 300000 })

    // スクリーンショット
    base64 = await page.screenshot({ encoding: 'base64' })

    if (!base64) {
      throw new Error('画像の生成に失敗しました')
    }
  } catch (error) {
    console.error(error)
    return new NextResponse((error as Error)?.message || '画像の生成に失敗しました', {
      status: 500,
    })
  } finally {
    // ページは都度閉じる。Browser自体は閉じない
    await page.close()
    browser.disconnect()
  }

  const fileName = generateFileName(firstLineText, secondLineText, scale)
  const imageDataUrl = `data:image/png;base64,${base64}`

  try {
    // 画像をS3にアップロード
    await imageUpload(imageDataUrl, fileName)
    return NextResponse.json({
      'image_url': `https://assets-5000.sawa-zen.dev/${fileName}`,
      'page_url': `${siteUrl}/?first_line=${encodeURIComponent(firstLineText)}&second_line=${encodeURIComponent(secondLineText)}&scale=${encodeURIComponent(scale)}`,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      'error': 'Internal Server Error'
    }, {
      status: 500
    })
  }
}

// lib/browser.ts
import puppeteer, { Browser } from 'puppeteer';

let _browser: Browser | null = null;

/**
 * 1つの Browser インスタンスを使い回すための関数
 */
export async function getBrowser() {
  // 既に使い回せるブラウザが存在し、かつまだ接続中ならそのまま返す
  if (_browser && _browser.isConnected()) {
    return _browser;
  }

  // 新しく接続する
  _browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BLESS_TOKEN}&--use-gl=angle&--use-angle=gl`,
  });

  return _browser;
}

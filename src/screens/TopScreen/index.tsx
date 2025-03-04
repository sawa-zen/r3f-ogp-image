"use client"

import { useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { ThreeCanvas } from '~/components/ThreeCanvas'
import { useAsyncFn } from 'react-use'
import { generateFileName } from "~/utils";

const generateCurlCommand = (firstLineText: string, secondLineText: string, scale: number) => {
  return `curl -X POST https://5000.sawa-zen.dev/api/generate-image \\
  -H 'Content-type: application/json' \\
  --data '{"first_line":"${firstLineText}","second_line":"${secondLineText}","scale":"${scale}"}'`
}

export const TopScreen = () => {
  const searchParams = useSearchParams();
  const defaultFirstLineText = searchParams.get('first_line') || "5000兆円"
  const defaultSecondLineText = searchParams.get('second_line') || "欲しい"
  const defaultScale = searchParams.get('scale') || "1"
  const [firstLineText, setFirstLineText] = useState(defaultFirstLineText)
  const [secondLineText, setSecondLineText] = useState(defaultSecondLineText)
  const [scale, setScale] = useState(parseFloat(defaultScale))

  const [{ loading }, uploadImage] = useAsyncFn(async (imageDataUrl: string, fileName: string) => {
    try {
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageDataUrl,
          fileName,
        }),
      })

      if (res.status !== 200) {
        throw new Error('アップロードに失敗しました')
      }

      const text = `#5000兆円欲しい\n${location.href}`
      const url = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`
      location.href = url
    } catch (error) {
      console.error(error);
      alert('アップロード中にエラーが発生しました');
    }
  }, [])

  const handleChangeFirstLineText = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFirstLineText(e.target.value)
  }, [])

  const handleChangeSecondLineText = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSecondLineText(e.target.value)
  }, [])

  const handleChangeScale = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(e.target.value))
  }, [])

  const handleClickTweet = useCallback(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    const fileName = generateFileName(firstLineText, secondLineText, scale)
    uploadImage(dataUrl, fileName)
  }, [firstLineText, scale, secondLineText, uploadImage])

  const handleClickSaveImage = useCallback(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = '5000兆円欲しい.png'
    a.click()
  }, [])

  useEffect(() => {
    // URLにパラメーターを追加
    const url = new URL(location.href)
    url.searchParams.set('first_line', firstLineText)
    url.searchParams.set('second_line', secondLineText)
    url.searchParams.set('scale', scale.toString())
    history.replaceState(null, '', url.toString())
  }, [firstLineText, scale, secondLineText])

  return (
    <div className='flex flex-col items-center bg-slate-300 p-8 overflow-hidden'>
      <div className="flex flex-col items-stretch space-y-8 overflow-hidden max-w-xl w-full">
        <h1 className="text-4xl font-bold">
          [3D]5000兆円欲しいジェネレータ
        </h1>
        <div className="overflow-hidden rounded-lg max-w-full">
          <ThreeCanvas
            className="w-full"
            firstLineText={firstLineText}
            secondLineText={secondLineText}
            scale={scale}
          />
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="text">一行目テキスト</label>
            <input
              type="text"
              value={firstLineText}
              name="text"
              className='text-black p-2 rounded-lg'
              onChange={handleChangeFirstLineText}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="text">二行目テキスト</label>
            <input
              type="text"
              value={secondLineText}
              name="text"
              className='text-black p-2 rounded-lg'
              onChange={handleChangeSecondLineText}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="scale">スケール</label>
            <input
              type="range"
              value={scale}
              name="scale"
              min={0.1}
              max={2}
              step={0.1}
              onChange={handleChangeScale}
            />
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <button
            className="bg-blue-500 text-white p-2 rounded-lg disabled:bg-gray-400"
            disabled={loading}
            onClick={handleClickTweet}
          >
            { loading ? 'Loading...' : '画像をXに投稿する' }
          </button>
          <button
            className="bg-teal-500 text-white p-2 rounded-lg disabled:bg-gray-400"
            onClick={handleClickSaveImage}
          >
            画像を保存する
          </button>
        </div>

        <div className="overflow-hidden flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">APIで画像を作る</h2>
          <p className="text-sm">
            API を実行すると生成した画像のURLを受け取れます。（30秒くらいかかります）
          </p>
          <pre className="bg-gray-700 p-8 rounded-lg overflow-x-scroll">
            <code className="text-sm text-white">
              {generateCurlCommand(firstLineText, secondLineText, scale)}
            </code>
          </pre>
        </div>

        <footer className="text-center text-gray-500 text-sm">
          Created by <a href="https://x.com/sawa_zen" target="_blank" rel="noopener noreferrer">@sawa-zen</a> | <a href="https://github.com/sawa-zen/r3f-ogp-image" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.728-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.089-.744.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.335-5.466-5.93 0-1.31.47-2.38 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.98-.399 3-.405 1.02.006 2.043.139 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.236 1.91 1.236 3.22 0 4.61-2.807 5.625-5.48 5.92.43.37.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .32.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
        </footer>
      </div>
    </div>
  )
}

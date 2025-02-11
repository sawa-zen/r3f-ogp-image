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
      <div className="max-w-[600px] flex flex-col items-stretch space-y-8 overflow-hidden">
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

        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">APIで作る</h2>
          <pre className="bg-gray-700 p-8 rounded-lg overflow-x-scroll">
            <code className="text-sm text-white">
              {generateCurlCommand(firstLineText, secondLineText, scale)}
            </code>
          </pre>
        </div>

        <footer className="text-center text-gray-500 text-sm">
          Created by <a href="https://x.com/sawa_zen" target="_blank" rel="noopener noreferrer">@sawa-zen</a>
        </footer>
      </div>
    </div>
  )
}

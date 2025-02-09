"use client"

import { useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { ThreeCanvas } from './components/ThreeCanvas'

export const Top = () => {
  const searchParams = useSearchParams();
  const ogpImageMode = searchParams.get('ogp_image') ? true : false
  const defaultFirstLineText = searchParams.get('first_line') || "5000兆円"
  const defaultSecondLineText = searchParams.get('second_line') || "欲しい"
  const defaultScale = searchParams.get('scale') || "1"
  const [firstLineText, setFirstLineText] = useState(defaultFirstLineText)
  const [secondLineText, setSecondLineText] = useState(defaultSecondLineText)
  const [scale, setScale] = useState(parseFloat(defaultScale))

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
    const text = `#5000兆円欲しい\n${location.href}`
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }, [])

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

  if (ogpImageMode) {
    return (
      <ThreeCanvas
        firstLineText={firstLineText}
        secondLineText={secondLineText}
        scale={scale}
      />
    )
  }

  return (
    <div className='flex flex-col items-center bg-slate-300 p-8 overflow-hidden'>
      <div className="max-w-5xl flex flex-col items-stretch space-y-8 overflow-hidden">
        <h1 className="text-4xl font-bold">
          3D 5000兆円欲しいジェネレータ
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
            onClick={handleClickTweet}
          >
            画像をXに投稿する
          </button>
          <button
            className="bg-teal-500 text-white p-2 rounded-lg disabled:bg-gray-400"
            onClick={handleClickSaveImage}
          >
            画像を保存する
          </button>
        </div>
        <footer className="text-center text-gray-500 text-sm">
          Created by <a href="https://x.com/sawa_zen" target="_blank" rel="noopener noreferrer">@sawa-zen</a>
        </footer>
      </div>
    </div>
  )
}

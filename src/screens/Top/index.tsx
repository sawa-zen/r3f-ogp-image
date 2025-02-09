"use client"

import { useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useState } from 'react'
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
    <div className='flex flex-col items-stretch h-screen space-y-4 bg-slate-300 p-8'>
      <h1 className="text-4xl font-bold">
        3D 5000兆円欲しいジェネレータ
      </h1>
      <div className="max-w-lg">
        <ThreeCanvas
          firstLineText={firstLineText}
          secondLineText={secondLineText}
          scale={scale}
        />
      </div>
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
  )
}

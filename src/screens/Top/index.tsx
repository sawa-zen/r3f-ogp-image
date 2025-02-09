"use client"

import { useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useState } from 'react'
import { ThreeCanvas } from './components/ThreeCanvas'

export const Top = () => {
  const searchParams = useSearchParams();
  const ogpImageMode = searchParams.get('ogp_image') ? true : false
  const defaultText = searchParams.get('text') || "5000兆円"
  const defaultScale = searchParams.get('scale') || "1"
  const [text, setText] = useState(defaultText)
  const [scale, setScale] = useState(parseFloat(defaultScale))

  const handleChangeText = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }, [])

  const handleChangeScale = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(e.target.value))
  }, [])

  if (ogpImageMode) {
    return <ThreeCanvas text={text} scale={scale} />
  }

  return (
    <div>
      <ThreeCanvas text={text} scale={scale} />
      <div>
        <label htmlFor="text">テキスト</label>
        <input
          type="text"
          value={text}
          name="text"
          className='text-black'
          onChange={handleChangeText}
        />
      </div>
      <div>
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

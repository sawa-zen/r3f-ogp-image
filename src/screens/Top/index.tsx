"use client"

import { useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useState } from 'react'
import { ThreeCanvas } from '~/components/ThreeCanvas'

export const Top = () => {
  const searchParams = useSearchParams();
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

  return (
    <div>
      <ThreeCanvas text={text} scale={scale} />
      <input
        type="text"
        value={text}
        className='text-black'
        onChange={handleChangeText}
      />
      <input
        type="range"
        value={scale}
        min={0.1}
        max={2}
        step={0.1}
        onChange={handleChangeScale}
      />
    </div>
  )
}

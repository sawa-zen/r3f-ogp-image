"use client"

import { Canvas } from '@react-three/fiber'
import { TextMesh } from './components/TextMesh'
import { useCallback, useEffect, useState } from 'react'
import opentype from 'opentype.js'
import { Environment } from '@react-three/drei'

interface Props {
  firstLineText: string
  secondLineText: string
  scale: number
  className?: string
  ogpImageMode?: boolean
}

export const ThreeCanvas = ({ firstLineText, secondLineText, scale, className, ogpImageMode }: Props) => {
  const [font, setFont] = useState<opentype.Font | undefined>(undefined)
  const [firstLineReady, setFirstLineReady] = useState(false)
  const [secondLineReady, setSecondLineReady] = useState(false)

  const handleLoadedFont = useCallback((err: unknown, font: opentype.Font | undefined) => {
    if (err || !font) {
      console.error('フォントのロードに失敗しました:', err);
      return
    }
    setFont(font)
  }, [])

  useEffect(() => {
    const fontUrl = "/fonts/delagothic_one-regular.woff"; // 小文字のファイル名でないと読み込まれない
    opentype.load(fontUrl, handleLoadedFont)
  }, [handleLoadedFont])

  if (!font) return null

  return (
    <Canvas
      id={firstLineReady && secondLineReady ? "ready" : "loading"}
      className={className}
      style={{ aspectRatio: "1200/630" }}
      camera={{ position: [0, 0, 0] }}
      dpr={ogpImageMode ? 1 : 2}
      gl={{ antialias: true, preserveDrawingBuffer: true, alpha: false }}
      frameloop="never"
    >
      <color attach="background" args={["white"]} />
      <directionalLight position={[0, 1, 1]} intensity={0.5} />
      <Environment preset="studio" environmentIntensity={0.7} />
      {font && (
        <group
          position={[0, 0, -3]}
          rotation={[-Math.PI / 7, 0, 0]}
          scale={[scale, scale, scale]}
        >
          <TextMesh
            text={firstLineText}
            font={font}
            color="#FF0000"
            outlineColor="#FFCC00"
            position={[0, 0.5, 0]}
            onReady={() => setFirstLineReady(true)}
          />
          <TextMesh
            text={secondLineText}
            font={font}
            color="#FFFFFF"
            outlineColor="#888888"
            position={[0, -0.5, 0]}
            onReady={() => setSecondLineReady(true)}
          />
        </group>
      )}
    </Canvas>
  )
}
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { TextMesh } from './components/TextMesh'
import { useCallback, useEffect, useState } from 'react'
import opentype from 'opentype.js'

interface Props {
  firstLineText: string
  secondLineText: string
  scale: number
  className?: string
}

export const ThreeCanvas = ({ firstLineText, secondLineText, scale, className }: Props) => {
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

  return (
    <Canvas
      id={firstLineReady && secondLineReady ? "ready" : "loading"}
      className={`bg-white ${className}`}
      style={{ aspectRatio: "1200/630" }}
      camera={{ position: [0, 0, 0] }}
      dpr={1}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      frameloop="demand"
    >
      <color attach="background" args={["white"]} />
      <ambientLight intensity={1} />
      <directionalLight position={[-10, 20, 10]} intensity={1} />
      <directionalLight position={[10, 20, 10]} intensity={1} />
      <Environment preset="studio" />
      {font && (
        <group
          position={[0, 0, -3]}
          rotation={[-Math.PI / 7, 0, 0]}
          scale={[scale, scale, scale]}
        >
          <TextMesh
            text={firstLineText}
            font={font}
            color="#FF3333"
            outlineColor="#FFCC00"
            position={[0, 0.5, 0]}
            onReady={() => setFirstLineReady(true)}
          />
          <TextMesh
            text={secondLineText}
            font={font}
            color="#FFFFFF"
            outlineColor="#999999"
            position={[0, -0.5, 0]}
            onReady={() => setSecondLineReady(true)}
          />
        </group>
      )}
    </Canvas>
  )
}
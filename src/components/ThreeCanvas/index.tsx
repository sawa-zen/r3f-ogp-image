import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { TextMesh } from './components/TextMesh'
import { useCallback, useEffect, useState } from 'react'
import opentype from 'opentype.js'

interface Props {
  text: string
  scale: number
}

export const ThreeCanvas = ({ text, scale }: Props) => {
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
      className="bg-white"
      style={{ aspectRatio: "1200/630" }}
      camera={{ position: [0, 0, 0] }}
      dpr={1}
      frameloop="demand"
    >
      <ambientLight intensity={1} />
      <directionalLight position={[-10, 20, 10]} intensity={1} />
      <directionalLight position={[10, 20, 10]} intensity={1} />
      <Environment preset="studio" />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#FFFF00" />
      </mesh>
      {font && (
        <group
          position={[0, 0, -3]}
          rotation={[-Math.PI / 7, 0, 0]}
          scale={[scale, scale, scale]}
        >
          <TextMesh
            text={text}
            font={font}
            color="#FF3333"
            outlineColor="#FFCC00"
            position={[0, 0.5, 0]}
            onReady={() => setFirstLineReady(true)}
          />
          <TextMesh
            text="欲しい"
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
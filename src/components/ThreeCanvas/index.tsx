import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { TextMesh } from './components/TextMesh'
import { useCallback, useState } from 'react'

interface Props {
  text: string
  scale: number
}

export const ThreeCanvas = ({ text, scale }: Props) => {
  const [id, setId] = useState<string>("")

  const handleReady = useCallback(() => {
    if (id) return
    setId('ready')
  }, [id, text])

  return (
    <Canvas
      id={id}
      className="bg-white"
      style={{ aspectRatio: "1200/630" }}
      camera={{ position: [0, 0, 0] }}
    >
      <ambientLight intensity={1} />
      <directionalLight position={[-10, 20, 10]} intensity={1} />
      <directionalLight position={[10, 20, 10]} intensity={1} />
      <Environment preset="studio" />
      <group
        position={[0, 0, -3]}
        rotation={[-Math.PI / 7, 0, 0]}
        scale={[scale, scale, scale]}
      >
        <TextMesh
          text={text}
          color="#FF3333"
          outlineColor="#FFCC00"
          position={[0, 0.5, 0]}
          onReady={handleReady}
        />
        <TextMesh
          text="欲しい"
          color="#FFFFFF"
          outlineColor="#999999"
          position={[0, -0.5, 0]}
        />
      </group>
    </Canvas>
  )
}
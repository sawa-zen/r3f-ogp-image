import { useEffect, useRef, useState } from 'react'
import { Mesh, Shape } from 'three'
import { convert } from './utils'
import opentype from 'opentype.js'
import { useFrame } from '@react-three/fiber'

interface Props {
  text: string
  color: string
  outlineColor: string
  position?: [number, number, number]
  onReady?: () => void
}

const defaultShape: Shape[] = []

export const TextMesh = ({
  text,
  color,
  outlineColor,
  position,
  onReady,
}: Props) => {
  const textMeshRef = useRef<Mesh>(null)
  const outlineMeshRef = useRef<Mesh>(null)
  const [shapes, setShapes] = useState<Shape[]>(defaultShape)
  const [font, setFont] = useState<opentype.Font | null>(null)

  useEffect(() => {
    if (!font || !text) return
    const threeShapes = convert(text, font)
    setShapes(threeShapes)
  }, [font, text])

  useEffect(() => {
    if (font) return
    const fontUrl = "./DelaGothicOne-Regular.ttf";
    opentype.load(fontUrl, function (err, font) {
      if (err || !font) {
        console.error('フォントのロードに失敗しました:', err);
        return
      }
      setFont(font)
      onReady?.()
    })
  }, [])

  useFrame(() => {
    if (!textMeshRef.current || !outlineMeshRef.current) return
    textMeshRef.current.geometry.computeBoundingBox()
    textMeshRef.current.geometry.center()
    outlineMeshRef.current.geometry.computeBoundingBox()
    outlineMeshRef.current.geometry.center()
  })

  return (
    <group position={position}>
      <mesh ref={textMeshRef}>
        <extrudeGeometry
          args={[shapes, {
            depth: 1.23,
            bevelEnabled: false,
          }]}
        />
        <meshStandardMaterial
          color={color}
          metalness={1.0}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={outlineMeshRef} position={[0, 0, -0.1]}>
        <extrudeGeometry
          args={[shapes, {
            depth: 1,
            bevelEnabled: true,
          }]}
        />
        <meshStandardMaterial
          color={outlineColor}
          metalness={1.0}
          roughness={0.2}
          opacity={0.5}
        />
      </mesh>
    </group>
  )
}
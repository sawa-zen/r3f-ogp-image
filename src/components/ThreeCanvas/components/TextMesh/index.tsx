import { useEffect, useMemo, useRef } from 'react'
import { Mesh } from 'three'
import { convert } from './utils'
import opentype from 'opentype.js'
import { useThree } from '@react-three/fiber'

interface Props {
  text: string
  font: opentype.Font
  color: string
  outlineColor: string
  position?: [number, number, number]
  onReady: () => void
}

export const TextMesh = ({
  text,
  font,
  color,
  outlineColor,
  position,
  onReady,
}: Props) => {
  const textMeshRef = useRef<Mesh>(null)
  const outlineMeshRef = useRef<Mesh>(null)
  const { advance } = useThree()
  const shapes = useMemo(() => convert(text, font), [text, font])

  useEffect(() => {
    if (!textMeshRef.current || !outlineMeshRef.current || !shapes.length) return
    textMeshRef.current.geometry.computeBoundingBox()
    outlineMeshRef.current.geometry.computeBoundingBox()
    outlineMeshRef.current.geometry.computeVertexNormals()
    const x = -Math.abs(textMeshRef.current.geometry.boundingBox!.max.x - textMeshRef.current.geometry.boundingBox!.min.x) / 2
    textMeshRef.current.position.x = x
    outlineMeshRef.current.position.x = x

    setTimeout(() => {
      advance(0)
      onReady()
    }, 10)
  }, [advance, onReady, shapes.length])

  return (
    <group position={position}>
      <mesh ref={textMeshRef} position={[0, -0.7, 1.105]}>
        <shapeGeometry args={[shapes]} />
        <meshStandardMaterial
          color={color}
          metalness={0.5}
          roughness={0.8}
        />
      </mesh>
      <mesh ref={outlineMeshRef} position={[0, -0.7, -0.1]}>
        <extrudeGeometry
          args={[shapes, {
            curveSegments: 4,
            steps: 0,
            depth: 1,
            bevelSegments: 3,
          }]}
        />
        <meshStandardMaterial
          color={outlineColor}
          metalness={1}
          roughness={0.5}
        />
      </mesh>
    </group>
  )
}
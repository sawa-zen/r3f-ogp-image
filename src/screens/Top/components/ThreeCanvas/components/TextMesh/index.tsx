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
        <meshBasicMaterial
          color={color}
          // metalness={1.0}
          // roughness={0.2}
        />
      </mesh>
      <mesh ref={outlineMeshRef} position={[0, -0.7, -0.1]}>
        <extrudeGeometry
          args={[shapes, {
            curveSegments: 3,
            steps: 1,
            depth: 1,
            bevelEnabled: true,
          }]}
        />
        <meshBasicMaterial
          color={outlineColor}
          // metalness={1.0}
          // roughness={0.2}
        />
      </mesh>
    </group>
  )
}
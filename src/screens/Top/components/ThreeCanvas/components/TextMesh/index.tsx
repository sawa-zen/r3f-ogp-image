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
  const { invalidate } = useThree()
  const shapes = useMemo(() => convert(text, font), [text, font])

  useEffect(() => {
    if (!textMeshRef.current || !outlineMeshRef.current || !shapes.length) return
    textMeshRef.current.geometry.computeBoundingBox()
    outlineMeshRef.current.geometry.computeBoundingBox()
    const x = -Math.abs(textMeshRef.current.geometry.boundingBox!.max.x - textMeshRef.current.geometry.boundingBox!.min.x) / 2
    const y = -Math.abs(outlineMeshRef.current.geometry.boundingBox!.max.y - outlineMeshRef.current.geometry.boundingBox!.min.y) / 2
    textMeshRef.current.position.x = x
    textMeshRef.current.position.y = y
    outlineMeshRef.current.position.x = x
    outlineMeshRef.current.position.y = y
    onReady()
  }, [invalidate, onReady, shapes.length])

  return (
    <group position={position}>
      <mesh ref={textMeshRef}>
        <extrudeGeometry
          args={[shapes, {
            depth: 1.12,
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
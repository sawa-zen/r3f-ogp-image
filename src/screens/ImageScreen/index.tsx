"use client"

import { useSearchParams } from "next/navigation";
import { ThreeCanvas } from '~/components/ThreeCanvas'

export const ImageScreen = () => {
  const searchParams = useSearchParams();
  const firstLineText = searchParams.get('first_line') || "5000兆円"
  const secondLineText = searchParams.get('second_line') || "欲しい"
  const scale = parseFloat(searchParams.get('scale') || "1")

  return (
    <ThreeCanvas
      firstLineText={firstLineText}
      secondLineText={secondLineText}
      scale={scale}
      ogpImageMode
    />
  )
}

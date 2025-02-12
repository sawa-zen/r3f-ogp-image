import { Suspense } from "react"
import { TopScreen } from "~/screens/TopScreen"
import { generateFileName } from "~/utils"
import { Metadata } from "next"

export async function generateMetadata({ searchParams }: { searchParams: { [key: string]: string } }): Promise<Metadata> {
  const firstLineText = searchParams['first_line'] || '5000兆円'
  const secondLineText = searchParams['second_line'] || '欲しい'
  const scale = parseFloat(searchParams['scale'] || '1')
  const fileName = generateFileName(firstLineText, secondLineText, scale)

  const url = `https://assets-5000.sawa-zen.dev/${fileName}`

  return {
    openGraph: {
      title: "[3D]5000兆円欲しいジェネレータ",
      description: "3D版の5000兆円欲しいジェネレータです",
      url: 'https://5000.sawa-zen.dev/',
      type: 'website',
      images: [{
        url,
        width: 1200,
        height: 630,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@sawa_zen',
      images: [{
        url,
        width: 1200,
        height: 630,
      }],
    },
  }
}

export default function Home() {
  return (
    <Suspense>
      <TopScreen />
    </Suspense>
  )
}

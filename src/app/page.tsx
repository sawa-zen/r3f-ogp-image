import { Suspense } from "react";
import { TopScreen } from "~/screens/TopScreen";

export async function generateMetadata({ searchParams }: { searchParams: { [key: string]: string } }) {
  const firstLineText = searchParams['first_line'] || '5000兆円';
  const secondLineText = searchParams['second_line'] || '欲しい';
  const scale = parseFloat(searchParams['scale'] || '1');

  // 環境に応じてアクセス先URLを決定
  const isDev = process.env.NODE_ENV === 'development';
  const siteUrl = isDev
    ? process.env.TUNNEL_URL
    : "https://r3f-ogp-image.vercel.app";

  return {
    openGraph: {
      images: [{
        url: `${siteUrl}/api/og-image?first_line=${firstLineText}&second_line=${secondLineText}&scale=${scale}`,
        width: 600,
        height: 315,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@sawa_zen',
      images: [{
        url: `${siteUrl}/api/og-image?first_line=${firstLineText}&second_line=${secondLineText}&scale=${scale}`,
        width: 600,
        height: 315,
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

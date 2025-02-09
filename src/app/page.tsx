import { Suspense } from "react";
import { Top } from "~/screens/Top";

export async function generateMetadata({ searchParams }: { searchParams: { [key: string]: string } }) {
  const firstLineText = searchParams['first_line'] || '5000兆円';
  const secondLineText = searchParams['second_line'] || '欲しい';
  const scale = parseFloat(searchParams['scale'] || '1');

  // 環境に応じてアクセス先URLを決定
  const isDev = process.env.NODE_ENV === 'development';
  const siteUrl = isDev
    ? process.env.TUNNEL_URL
    : process.env.NEXT_PUBLIC_SITE_URL || 'https://r3f-ogp-image.vercel.app';

  return {
    openGraph: {
      images: [`${siteUrl}/api/image?first_line=${firstLineText}&second_line=${secondLineText}&scale=${scale}`],
    }
  }
}

export default function Home() {
  return (
    <Suspense>
      <Top />
    </Suspense>
  )
}

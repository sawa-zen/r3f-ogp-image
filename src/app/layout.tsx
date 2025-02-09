import "./globals.css";

export async function generateMetadata() {
  // 環境に応じてアクセス先URLを決定
  const isDev = process.env.NODE_ENV === 'development';
  const siteUrl = isDev
    ? process.env.TUNNEL_URL
    : process.env.NEXT_PUBLIC_SITE_URL || 'https://r3f-ogp-image.vercel.app';

  return {
    title: "3D 5000兆円欲しいジェネレータ",
    description: "3D版の5000兆円欲しいジェネレータです",
    openGraph: {
      images: [{
        url: `${siteUrl}/api/image`,
        width: 600,
        height: 315,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@sawa_zen',
      images: [{
        url: `${siteUrl}/api/image`,
        width: 600,
        height: 315,
      }],
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}

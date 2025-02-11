import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "[3D]5000兆円欲しいジェネレータ",
  description: "3D版の5000兆円欲しいジェネレータです",
  openGraph: {
    images: ['https://5000.sawa-zen.dev/ogp.png'],
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

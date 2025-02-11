import { Suspense } from "react"
import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { TopScreen } from "~/screens/TopScreen"
import { generateFileName } from "~/utils";

// R2用 S3互換クライアントのセットアップ
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || "",
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
  },
})

async function checkFileExists(fileName: string): Promise<boolean> {
  try {
    await s3Client.send(new HeadObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME || '',
      Key: fileName,
    }))
    return true
  } catch (error) {
    if (
      (error as Error)?.name === "NotFound" ||
      (error as Error)?.name === "NoSuchKey"
    ) {
      return false;
    }
    throw error;
  }
}

export async function generateMetadata({ searchParams }: { searchParams: { [key: string]: string } }) {
  const firstLineText = searchParams['first_line'] || '5000兆円';
  const secondLineText = searchParams['second_line'] || '欲しい';
  const scale = parseFloat(searchParams['scale'] || '1');
  const fileName = generateFileName(firstLineText, secondLineText, scale)

  const fileExists = await checkFileExists(fileName)
  const url = `https://assets.5000.sawa-zen.dev/${fileName}`;

  if (!fileExists) return {}

  return {
    openGraph: {
      images: [{
        url,
        width: 600,
        height: 315,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@sawa_zen',
      images: [{
        url,
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

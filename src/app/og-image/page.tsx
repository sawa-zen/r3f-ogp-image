import { Suspense } from "react";
import { ImageScreen } from "~/screens/ImageScreen";

export default function Home() {
  return (
    <Suspense>
      <ImageScreen />
    </Suspense>
  )
}

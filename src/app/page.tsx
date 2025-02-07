import { Suspense } from "react";
import { Top } from "~/screens/Top";

export default function Home() {
  return (
    <Suspense>
      <Top />
    </Suspense>
  )
}

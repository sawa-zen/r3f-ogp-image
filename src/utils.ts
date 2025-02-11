import { createHash } from "crypto";

export const generateFileName = (firstLine: string, secondLine: string, scale: number): string => {
  const hash = createHash("sha256")
      .update(`${firstLine}_${secondLine}_${scale}`)
      .digest("hex");
  return `images/${hash}.png`; // S3のパス
}

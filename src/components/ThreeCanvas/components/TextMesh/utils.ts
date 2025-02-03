import opentype from 'opentype.js'
import { Shape } from 'three'

export const convert = (text: string, font: opentype.Font): Shape[] => {
  const shapes = []
  let x = 0

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const glyph = font.charToGlyph(char); // 文字を Glyph オブジェクトに変換
    const size = 1
    const path = font.getPath(char, x, 0, size, {
      kerning: true,
    })

    const shape = new Shape()
    path.commands.forEach(cmd => {
      if (cmd.type === 'M') shape.moveTo(cmd.x, -cmd.y)
      else if (cmd.type === 'L') shape.lineTo(cmd.x, -cmd.y)
      else if (cmd.type === 'C') shape.bezierCurveTo(cmd.x1, -cmd.y1, cmd.x2, -cmd.y2, cmd.x, -cmd.y)
      else if (cmd.type === 'Q') shape.quadraticCurveTo(cmd.x1, -cmd.y1, cmd.x, -cmd.y)
      else if (cmd.type === 'Z') shape.closePath()
    })
    shapes.push(shape)

    // **次の文字のX座標を計算**
    let advanceWidth = glyph.advanceWidth ? glyph.advanceWidth * (size / font.unitsPerEm) : size;

    if (i > 0) {
      const prevGlyph = font.charToGlyph(text[i - 1]); // 前の文字の Glyph オブジェクトを取得
      let kerning = font.getKerningValue(prevGlyph.index, glyph.index); // グリフのインデックスを取得して適用
      advanceWidth += kerning * (size / font.unitsPerEm); // カーニングのスケールを適用
    }

    x += advanceWidth
  }
  return shapes
}

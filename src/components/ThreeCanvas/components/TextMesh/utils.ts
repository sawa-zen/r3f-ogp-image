import opentype from 'opentype.js'
import { Shape, Path } from 'three'

export const convert = (text: string, font: opentype.Font): Shape[] => {
  const shapes = []
  let x = 0
  const size = 1

  const getPointsFromCommands = (commands: opentype.PathCommand[]): { x: number, y: number }[] => {
    const pts: { x: number, y: number }[] = []
    commands.forEach(cmd => {
      if (cmd.type === 'M' || cmd.type === 'L' || cmd.type === 'C' || cmd.type === 'Q') {
        pts.push({ x: cmd.x, y: -cmd.y })
      }
    })
    return pts
  }

  const computeArea = (points: {x: number, y: number}[]): number => {
    let area = 0
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i]
      const p2 = points[(i + 1) % points.length]
      area += p1.x * p2.y - p2.x * p1.y
    }
    return area / 2
  }

  const pointInPolygon = (pt: {x: number, y: number}, polygon: {x: number, y: number}[]): boolean => {
    let inside = false
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y
      const xj = polygon[j].x, yj = polygon[j].y
      const intersect = ((yi > pt.y) !== (yj > pt.y)) && (pt.x < (xj - xi) * (pt.y - yi) / ((yj - yi) || 0.000001) + xi)
      if (intersect) inside = !inside
    }
    return inside
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const glyph = font.charToGlyph(char)
    const path = font.getPath(char, x, 0, size, { kerning: true })
    const commands = path.commands

    const subpaths: opentype.PathCommand[][] = []
    let currentSubpath: opentype.PathCommand[] = []
    commands.forEach(cmd => {
      if (cmd.type === 'M') {
        if (currentSubpath.length > 0) {
          subpaths.push(currentSubpath)
        }
        currentSubpath = [cmd]
      } else {
        currentSubpath.push(cmd)
      }
    })
    if (currentSubpath.length > 0) {
      subpaths.push(currentSubpath)
    }

    if (subpaths.length > 0) {
      const data = subpaths.map(sp => {
        const pts = getPointsFromCommands(sp)
        return { commands: sp, points: pts, area: Math.abs(computeArea(pts)) }
      })

      data.sort((a, b) => b.area - a.area)
      const outer = data[0]
      const holes = []
      const others = []
      for (let j = 1; j < data.length; j++) {
        if (data[j].points.length > 0) {
          const centroid = data[j].points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
          centroid.x /= data[j].points.length;
          centroid.y /= data[j].points.length;
          if (pointInPolygon(centroid, outer.points)) {
            holes.push(data[j]);
          } else {
            others.push(data[j]);
          }
        } else {
          others.push(data[j]);
        }
      }

      const outerShape = new Shape()
      outer.commands.forEach(cmd => {
        if (cmd.type === 'M') outerShape.moveTo(cmd.x, -cmd.y)
        else if (cmd.type === 'L') outerShape.lineTo(cmd.x, -cmd.y)
        else if (cmd.type === 'C') outerShape.bezierCurveTo(cmd.x1, -cmd.y1, cmd.x2, -cmd.y2, cmd.x, -cmd.y)
        else if (cmd.type === 'Q') outerShape.quadraticCurveTo(cmd.x1, -cmd.y1, cmd.x, -cmd.y)
        else if (cmd.type === 'Z') outerShape.closePath()
      })
      holes.forEach(holeData => {
        const holePath = new Path()
        holeData.commands.forEach(cmd => {
          if (cmd.type === 'M') holePath.moveTo(cmd.x, -cmd.y)
          else if (cmd.type === 'L') holePath.lineTo(cmd.x, -cmd.y)
          else if (cmd.type === 'C') holePath.bezierCurveTo(cmd.x1, -cmd.y1, cmd.x2, -cmd.y2, cmd.x, -cmd.y)
          else if (cmd.type === 'Q') holePath.quadraticCurveTo(cmd.x1, -cmd.y1, cmd.x, -cmd.y)
          else if (cmd.type === 'Z') holePath.closePath()
        })
        outerShape.holes.push(holePath)
      })
      shapes.push(outerShape)

      others.forEach(oth => {
        const shp = new Shape()
        oth.commands.forEach(cmd => {
          if (cmd.type === 'M') shp.moveTo(cmd.x, -cmd.y)
          else if (cmd.type === 'L') shp.lineTo(cmd.x, -cmd.y)
          else if (cmd.type === 'C') shp.bezierCurveTo(cmd.x1, -cmd.y1, cmd.x2, -cmd.y2, cmd.x, -cmd.y)
          else if (cmd.type === 'Q') shp.quadraticCurveTo(cmd.x1, -cmd.y1, cmd.x, -cmd.y)
          else if (cmd.type === 'Z') shp.closePath()
        })
        shapes.push(shp)
      })
    }

    let advanceWidth = glyph.advanceWidth ? glyph.advanceWidth * (size / font.unitsPerEm) : size
    if (i > 0) {
      const prevGlyph = font.charToGlyph(text[i - 1])
      const kerning = font.getKerningValue(prevGlyph.index, glyph.index)
      advanceWidth += kerning * (size / font.unitsPerEm)
    }
    x += advanceWidth
  }
  return shapes
}

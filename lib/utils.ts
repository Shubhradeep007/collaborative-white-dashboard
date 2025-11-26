import { Camera, Color, Layer, Point, Side, XYWH } from "@/types/canvas"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function connectionIdToColor(connectionId: number) {
  return COLORS[connectionId % COLORS.length]
}

export function pointerEventToCanvasPoint(event: React.PointerEvent, camera: Camera) {
  return {
    x: Math.round(event.clientX) - camera.x,
    y: Math.round(event.clientY) - camera.y
  }
}

export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`
}

export function resizeBounce(
  bounce: XYWH,
  point: Point,
  corner: Side)
  : XYWH {
  const result = {
    x: bounce.x,
    y: bounce.y,
    width: bounce.width,
    height: bounce.height
  }

  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(point.x, bounce.x + bounce.width);
    result.width = Math.abs(bounce.x + bounce.width - point.x)
  }

  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(point.x, bounce.x);
    result.width = Math.abs(point.x - bounce.x)
  }

  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(point.y, bounce.y + bounce.height);
    result.height = Math.abs(bounce.y + bounce.height - point.y)
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(point.y, bounce.y);
    result.height = Math.abs(point.y - bounce.y)
  }

  return result

}


export function findIntersectingLayersWithReactangle(
  layerIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  a: Point,
  b: Point

) {
  const rect = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y)
  }

  const ids = []

  for (const layerId of layerIds) {
    const layer = layers.get(layerId)
    if (layer == null) {
      continue
    }

    const { x, y, width, height } = layer

    // Check if rectangles intersect
    if (
      rect.x < x + width &&
      rect.x + rect.width > x &&
      rect.y < y + height &&
      rect.y + rect.height > y
    ) {
      ids.push(layerId)
    }
  }

  return ids
}

export function getContrastingTextToColor(color: Color){
  const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
  return luminance > 182 ? "black" : "white";
}
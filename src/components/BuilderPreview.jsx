import { useEffect, useRef } from "react"
import { drawBuilderCard, CARD_WIDTH, CARD_HEIGHT } from "../utils/canvasGenerator"

export default function BuilderPreview({ img, cardData, theme, transform }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = CARD_WIDTH
    canvas.height = CARD_HEIGHT
    const ctx = canvas.getContext("2d")
    drawBuilderCard(ctx, img, cardData, theme, transform)
  }, [img, cardData, theme, transform])

  return <div className="preview-lanyard"><span className="preview-lanyard__strap" aria-hidden="true" /><canvas ref={canvasRef} className="builder-preview__canvas" /></div>
}

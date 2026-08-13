import { useRef } from "react"
import { CARD_SIZE } from "../utils/canvasGenerator"
import { getBaseCropSize, getTransformedCropRect } from "../utils/imageUtils"

const MIN_SCALE = 1
const MAX_SCALE = 2.5
const DEFAULT_TRANSFORM = { x: 0, y: 0, scale: 1 }

// Renders the same crop window the canvas will export, using CSS
// background-position/size on the frame — so what you drag is what you get.
function frameStyle(img, transform) {
  const { sx, sy, sWidth, sHeight } = getTransformedCropRect(img, CARD_SIZE, CARD_SIZE, transform)
  const bgSizePercent = (img.width / sWidth) * 100
  const bgPosXPercent = (sx / (img.width - sWidth || 1)) * 100
  const bgPosYPercent = (sy / (img.height - sHeight || 1)) * 100
  return {
    backgroundSize: `${bgSizePercent}%`,
    backgroundPosition: `${bgPosXPercent}% ${bgPosYPercent}%`,
  }
}

export default function PhotoEditor({ img, imageUrl, transform, onChange }) {
  const frameRef = useRef(null)
  const dragState = useRef(null)

  function handlePointerDown(e) {
    frameRef.current?.setPointerCapture(e.pointerId)
    const rect = frameRef.current.getBoundingClientRect()
    dragState.current = { startX: e.clientX, startY: e.clientY, origin: { ...transform }, frameWidth: rect.width }
  }

  function handlePointerMove(e) {
    if (!dragState.current) return
    const { startX, startY, origin, frameWidth } = dragState.current
    const { sWidth } = getBaseCropSize(img, CARD_SIZE, CARD_SIZE, transform.scale)
    const pxToSource = sWidth / frameWidth
    const dx = (e.clientX - startX) * pxToSource
    const dy = (e.clientY - startY) * pxToSource
    onChange({ ...transform, x: origin.x + dx, y: origin.y + dy })
  }

  function handlePointerUp(e) {
    frameRef.current?.releasePointerCapture(e.pointerId)
    dragState.current = null
  }

  function handleZoomChange(e) {
    onChange({ ...transform, scale: parseFloat(e.target.value) })
  }

  return (
    <div className="photo-editor">
      <div
        ref={frameRef}
        className="photo-editor__frame"
        style={{ backgroundImage: `url(${imageUrl})`, ...frameStyle(img, transform) }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      <div className="photo-editor__controls">
        <label className="photo-editor__label">ZOOM THE VIBES</label>
        <input
          type="range"
          min={MIN_SCALE}
          max={MAX_SCALE}
          step="0.01"
          value={transform.scale}
          onChange={handleZoomChange}
        />
        <button type="button" className="btn btn--ghost btn--small" onClick={() => onChange(DEFAULT_TRANSFORM)}>
          RESET
        </button>
      </div>
    </div>
  )
}

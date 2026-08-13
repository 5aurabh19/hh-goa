import { useRef, useState } from "react"
import { createPortal } from "react-dom"
import CameraCapture from "./CameraCapture"
import { validateImageFile, normalizeToDisplayableImage, loadImageFromFile } from "../utils/imageUtils"

export default function PhotoSourceControls({ onPhotoReady }) {
  const inputRef = useRef(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState("")
  const scrollYRef = useRef(0)

  function openCamera() {
    scrollYRef.current = window.scrollY
    document.body.classList.add("camera-is-open")
    setShowCamera(true)
  }

  function closeCamera() {
    setShowCamera(false)
    document.body.classList.remove("camera-is-open")
    window.scrollTo(0, scrollYRef.current)
  }

  async function handleFile(file) {
    setError("")
    const { ok, error: validationError } = validateImageFile(file)
    if (!ok) {
      setError(validationError)
      return
    }
    try {
      setIsConverting(true)
      const displayable = await normalizeToDisplayableImage(file)
      const { img, url } = await loadImageFromFile(displayable)
      onPhotoReady({ img, url })
    } catch {
      setError("Couldn't process that photo. Try a different file.")
    } finally {
      setIsConverting(false)
      closeCamera()
    }
  }

  return (
    <div className="photo-source">
      <div className="photo-source__buttons">
        <button type="button" className="btn btn--secondary" onClick={() => inputRef.current?.click()}>
          Choose from my gallery
        </button>
        <button type="button" className="btn btn--ghost" onClick={openCamera}>
          Take one right now
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif"
          hidden
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>
      {isConverting && <p className="upload-zone__text">Reading your photo…</p>}
      {error && <p className="form-error">{error}</p>}

      {showCamera && createPortal(
        <div className="camera-overlay">
          <CameraCapture onCapture={handleFile} onCancel={closeCamera} />
        </div>
      , document.body)}
    </div>
  )
}

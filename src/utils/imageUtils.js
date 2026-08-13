import heic2any from "heic2any"

export const MAX_FILE_SIZE_MB = 15
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/heic", "image/heif"]

export function validateImageFile(file) {
  if (!file) return { ok: false, error: "Your builder needs a photo first \u{1F4F8}" }
  const isHeicByName = /\.hei[cf]$/i.test(file.name)
  const typeOk = ACCEPTED_TYPES.includes(file.type) || isHeicByName
  if (!typeOk) return { ok: false, error: "That image format isn't supported. Try JPG, PNG or HEIC." }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { ok: false, error: `That photo is too large. Keep it under ${MAX_FILE_SIZE_MB}MB.` }
  }
  return { ok: true, error: null }
}

// Converts HEIC/HEIF to JPEG client-side. Browsers can't reliably decode
// HEIC in <img> or canvas, so this runs before anything else touches the file.
export async function normalizeToDisplayableImage(file) {
  const isHeic = file.type === "image/heic" || file.type === "image/heif" || /\.hei[cf]$/i.test(file.name)
  if (!isHeic) return file
  const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 })
  const blob = Array.isArray(converted) ? converted[0] : converted
  return new File([blob], file.name.replace(/\.hei[cf]$/i, ".jpg"), { type: "image/jpeg" })
}

export function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => resolve({ img, url })
    img.onerror = () => reject(new Error("Could not read that image."))
    img.src = url
  })
}

// Crop window size only (no pan applied) — used by the drag handler to
// convert on-screen pixels into source-image pixels regardless of how
// large the preview frame is actually rendered.
export function getBaseCropSize(img, targetWidth, targetHeight, scale) {
  const targetRatio = targetWidth / targetHeight
  const sourceRatio = img.width / img.height
  let baseWidth, baseHeight
  if (sourceRatio > targetRatio) {
    baseHeight = img.height
    baseWidth = baseHeight * targetRatio
  } else {
    baseWidth = img.width
    baseHeight = baseWidth / targetRatio
  }
  return { sWidth: baseWidth / scale, sHeight: baseHeight / scale }
}

// "cover" crop extended with a user-controlled pan (x, y in source pixels)
// zoom (scale >= 1). scale 1 = tightest cover-fit; higher = zoomed in.
// Never lets the crop window leave the source image bounds.
export function getTransformedCropRect(img, targetWidth, targetHeight, transform) {
  const { x, y, scale } = transform
  const { sWidth, sHeight } = getBaseCropSize(img, targetWidth, targetHeight, scale)

  const maxX = img.width - sWidth
  const maxY = img.height - sHeight
  const centeredX = maxX / 2
  const centeredY = maxY / 2

  // x/y are pan offsets in source pixels, clamped so the window stays inside the image.
  const sx = Math.min(Math.max(centeredX - x, 0), maxX)
  const sy = Math.min(Math.max(centeredY - y, 0), maxY)

  return { sx, sy, sWidth, sHeight }
}

import { put } from "@vercel/blob"
import { randomUUID } from "node:crypto"

export const config = { api: { bodyParser: { sizeLimit: "8mb" } } }

function siteUrl(request) {
  const configured = process.env.PUBLIC_SITE_URL || process.env.VERCEL_URL
  if (configured) return configured.startsWith("http") ? configured.replace(/\/$/, "") : `https://${configured}`
  return new URL(request.url).origin
}

function clean(value, max = 90) {
  return String(value || "").trim().slice(0, max)
}

export default async function handler(request, response) {
  const origin = request.headers.origin
  const localDevelopmentOrigin = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || "")
  const publicOrigin = siteUrl(request)
  if (origin && (localDevelopmentOrigin || origin === publicOrigin)) response.setHeader("Access-Control-Allow-Origin", origin)
  response.setHeader("Vary", "Origin")
  if (request.method === "OPTIONS") {
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.setHeader("Access-Control-Allow-Headers", "Content-Type")
    return response.status(204).end()
  }
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST")
    return response.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { id: requestedId, image, name, energy } = request.body || {}
    if (typeof image !== "string" || !image.startsWith("data:image/png;base64,")) {
      return response.status(400).json({ error: "A generated PNG is required." })
    }

    const bytes = Buffer.from(image.slice(image.indexOf(",") + 1), "base64")
    if (!bytes.length || bytes.length > 8 * 1024 * 1024) {
      return response.status(400).json({ error: "The collectible image is invalid or too large." })
    }

    const id = typeof requestedId === "string" && /^[0-9a-f-]{36}$/i.test(requestedId) ? requestedId : randomUUID()
    const blob = await put(`collectibles/${id}.png`, bytes, {
      access: "public",
      contentType: "image/png",
      addRandomSuffix: false,
    })
    await put(`collectibles/${id}.json`, JSON.stringify({
      imageUrl: blob.url,
      name: clean(name),
      energy: clean(energy),
    }), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    })
    const shareUrl = `${siteUrl(request)}/share/${id}`
    return response.status(200).json({ id, imageUrl: blob.url, shareUrl })
  } catch (error) {
    console.error("Could not prepare collectible share", error)
    return response.status(500).json({ error: "We couldn't prepare a public share link. Please try again." })
  }
}

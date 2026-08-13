import { useState } from "react"

export default function ResultActions({ canGenerate, onGenerate, onShare, onDownload, onReset, hasExport }) {
  const [status, setStatus] = useState("")
  const [composerUrl, setComposerUrl] = useState("")
  const [sharing, setSharing] = useState(false)

  async function handleShare() {
    setStatus("")
    setComposerUrl("")
    setSharing(true)
    try {
      const result = await onShare()
      if (result?.method === "blocked") {
        setStatus("Your browser blocked the X composer. Use this link to open it.")
        setComposerUrl(result.intentUrl)
      }
    } catch (error) {
      setStatus(error.message || "We couldn't prepare your public share link. Please try again.")
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="result-actions">
      {!hasExport ? (
        <button className="btn btn--primary btn--full" disabled={!canGenerate} onClick={onGenerate}>
          LOCK IN MY BUILDER ID → 🥝
        </button>
      ) : (
        <>
          <button className="btn btn--primary btn--full" disabled={!canGenerate} onClick={onGenerate}>UPDATE MY BUILDER PASS →</button>
          <button className="btn btn--primary btn--full" onClick={handleShare} disabled={sharing}>POST THIS ENERGY TO X →</button>
          <button className="btn btn--secondary btn--full" onClick={onDownload}>SAVE MY COLLECTIBLE PNG</button>
          <button className="btn btn--ghost btn--full" onClick={onReset}>Make Another</button>
        </>
      )}
      {status && <p className="result-actions__status">{status}{composerUrl && <> <a href={composerUrl} target="_blank" rel="noreferrer">Open X composer</a></>}</p>}
    </div>
  )
}

import { useState } from "react"
import { TECH_LIST, suggest } from "../utils/techSuggestions"

const MAX_TAGS = 8

export default function TechStackInput({ tags, onChange }) {
  const [draft, setDraft] = useState("")
  const [error, setError] = useState("")

  const suggestions = suggest(TECH_LIST, draft, 6).filter((s) => !tags.includes(s))

  function addTag(value) {
    const exactMatch = TECH_LIST.find((t) => t.toLowerCase() === value.trim().toLowerCase())
    if (!exactMatch) {
      setError("Pick technologies from the suggestions.")
      return
    }
    if (tags.includes(exactMatch)) {
      setDraft("")
      setError("")
      return
    }
    if (tags.length >= MAX_TAGS) return
    onChange([...tags, exactMatch])
    setDraft("")
    setError("")
  }

  function removeTag(index) {
    onChange(tags.filter((_, i) => i !== index))
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault() // stops Enter from submitting anything else on the page
      if (draft.trim()) addTag(draft)
    } else if (e.key === "Backspace" && !draft && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  return (
    <div className="field">
      <label htmlFor="tech-stack">WHAT’S IN YOUR TOOLBOX? <span className="inline-kiwi">🥝</span></label><p className="field-hint">Drop the technologies you use to make questionable things work.</p>
      <div className="tag-input">
        <div className="tag-input__chips">
          {tags.map((tag, i) => (
            <span key={tag} className="tag-chip">
              {tag}
              <button type="button" onClick={() => removeTag(i)} aria-label={`Remove ${tag}`}>×</button>
            </span>
          ))}
          {tags.length < MAX_TAGS && (
            <input
              id="tech-stack"
              className="tag-input__field"
              value={draft}
              onChange={(e) => { setDraft(e.target.value); setError("") }}
              onKeyDown={handleKeyDown}
            />
          )}
        </div>
      </div>
      {draft && suggestions.length > 0 && (
        <div className="chip-row">
          {suggestions.map((s) => (
            <button key={s} type="button" className="chip" onClick={() => addTag(s)}>{s}</button>
          ))}
        </div>
      )}
      {error && <p className="form-error">{error}</p>}
    </div>
  )
}

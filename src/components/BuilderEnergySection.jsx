import { useEffect, useState } from "react"
import PersonalitySelector from "./PersonalitySelector"
import { transformCustomTag } from "../utils/titleGenerator"

export default function BuilderEnergySection({ mode, onModeChange, customText, onCustomTextChange, traits, onTraitsChange, tag, traitCount, onShuffle }) {
  const [revealing, setRevealing] = useState(false)

  // Brief "figuring you out" moment whenever the resolved tag changes.
  useEffect(() => {
    if (!tag) return
    setRevealing(true)
    const timer = setTimeout(() => setRevealing(false), 550)
    return () => clearTimeout(timer)
  }, [tag?.text])

  return (
    <div className="field">
      <label>THE KIWIS ARE READING YOUR AURA</label>

      <div className="tag-mode-toggle">
        <button
          type="button"
          className={`chip ${mode === "custom" ? "chip--selected" : ""}`}
          onClick={() => onModeChange("custom")}
        >
          Got my own title
        </button>
        <button
          type="button"
          className={`chip ${mode === "traits" ? "chip--selected" : ""}`}
          onClick={() => onModeChange("traits")}
        >
          Let the kiwis cook
        </button>
      </div>

      {mode === "custom" ? (
        <input
          value={customText}
          maxLength={40}
          placeholder="e.g. coffee-powered chaos"
          onChange={(e) => onCustomTextChange(e.target.value)}
        />
      ) : (
        <PersonalitySelector selected={traits} onChange={onTraitsChange} />
      )}

      {tag ? (
        <div className={`builder-tag ${revealing ? "builder-tag--revealing" : ""}`}>
          {revealing ? (
            <span className="builder-tag__figuring">THE KIWIS ARE READING YOUR AURA…</span>
          ) : (
            <>
              <span className="builder-tag__label">WE FIGURED YOU OUT. HONESTLY, IMPRESSED.</span>
              <span className="builder-tag__text">{tag.text}</span>
            </>
          )}
          {mode === "traits" && !revealing && (
            <button type="button" className="btn btn--ghost btn--small" onClick={onShuffle}>
              Shuffle my tag
            </button>
          )}
        </div>
      ) : mode === "traits" ? <p className="energy-empty">{traitCount === 0 ? "YOUR BUILDER ENERGY IS HIDING..." : traitCount === 1 ? "ONE TRAIT ISN’T ENOUGH. GIVE US THE FULL PICTURE." : "WE’RE GETTING A VIBE... PICK ONE MORE."} <span>🥝</span></p> : null}
    </div>
  )
}

export { transformCustomTag }

import { useState } from "react"
import { ROLE_LIST, suggest } from "../utils/techSuggestions"

const NAME_PATTERN = /^[a-zA-Z' -]+$/
const HANDLE_PATTERN = /^@?[a-zA-Z0-9_]{1,15}$/

export function validateName(value) {
  if (!value.trim()) return "Tell us your name."
  if (!NAME_PATTERN.test(value)) return "Names only — no numbers or symbols needed."
  return ""
}

export function validateHandle(value) {
  if (!value.trim()) return ""
  if (!HANDLE_PATTERN.test(value.trim())) return "That doesn't look like a valid X handle."
  return ""
}

export function normalizeHandle(value) {
  const trimmed = value.trim()
  if (!trimmed) return ""
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`
}

export default function BuilderForm({ name, handle, role, onNameChange, onHandleChange, onRoleChange }) {
  const [nameError, setNameError] = useState("")
  const [handleError, setHandleError] = useState("")

  function handleNameInput(value) {
    onNameChange(value)
    setNameError(value ? validateName(value) : "")
  }

  function handleHandleInput(value) {
    onHandleChange(value)
    setHandleError(validateHandle(value))
  }

  const roleSuggestions = suggest(ROLE_LIST, role || "", 6)

  return (
    <div className="builder-form">
      <div className="field">
        <label htmlFor="builder-name">WHAT SHOULD WE CALL YOU?</label><p className="field-hint">Your internet identity deserves a name.</p>
        <input
          id="builder-name"
          value={name}
          maxLength={30}
          onChange={(e) => handleNameInput(e.target.value)}
        />
        {nameError && <p className="form-error">{nameError}</p>}
      </div>

      <div className="field">
        <label htmlFor="builder-handle">WHERE CAN THE INTERNET FIND YOU?</label><p className="field-hint">Optional. We won’t stalk you. Probably.</p>
        <input
          id="builder-handle"
          value={handle}
          maxLength={20}
          onChange={(e) => handleHandleInput(e.target.value)}
        />
        {handleError && <p className="form-error">{handleError}</p>}
      </div>

      <div className="field">
        <label htmlFor="builder-role">WHAT DO YOU BUILD?</label><p className="field-hint">Tell us which problems you voluntarily solve.</p>
        <input
          id="builder-role"
          value={role}
          maxLength={40}
          placeholder="Start typing…"
          onChange={(e) => onRoleChange(e.target.value)}
        />
        {role && roleSuggestions.length > 0 && (
          <div className="chip-row">
            {roleSuggestions.map((option) => (
              <button
                key={option}
                type="button"
                className={`chip ${role === option ? "chip--selected" : ""}`}
                onClick={() => onRoleChange(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

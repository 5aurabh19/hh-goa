import { THEMES } from "../utils/themes"

export default function ThemeSelector({ selectedId, onChange }) {
  return (
    <div className="field">
      <label>CHOOSE AN ART DIRECTION</label>
      <div className="theme-row">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            className={`theme-card ${selectedId === theme.id ? "theme-card--selected" : ""}`}
            onClick={() => onChange(theme.id)}
          >
            <span className="theme-card__swatch">
              {theme.swatch.map((color, i) => (
                <span key={i} style={{ background: color }} />
              ))}
            </span>
            <span className="theme-card__name">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

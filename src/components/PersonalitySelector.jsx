const TRAITS = [
  "Curious", "Creative", "Problem Solver", "Night Owl", "Perfectionist", "Chaos Agent",
  "Team Player", "Idea Machine", "Fast Learner", "Debugger", "Explorer", "Risk Taker",
  "Builder", "Tinkerer", "Detail Obsessed", "Big Picture Thinker", "Coffee Powered",
  "Always Experimenting", "Ships Fast", "Quiet Genius",
]

const MAX_TRAITS = 3

export default function PersonalitySelector({ selected, onChange }) {
  function toggle(trait) {
    if (selected.includes(trait)) {
      onChange(selected.filter((t) => t !== trait))
    } else if (selected.length < MAX_TRAITS) {
      onChange([...selected, trait])
    }
  }

  return (
    <div>
      <div className="field-header">
        <span className="field-hint">Pick up to {MAX_TRAITS}</span>
        <span className="field-counter">{selected.length} / {MAX_TRAITS} selected</span>
      </div>
      <div className="chip-row">
        {TRAITS.map((trait) => (
          <button
            key={trait}
            type="button"
            className={`chip ${selected.includes(trait) ? "chip--selected" : ""}`}
            disabled={!selected.includes(trait) && selected.length >= MAX_TRAITS}
            onClick={() => toggle(trait)}
          >
            {trait}
          </button>
        ))}
      </div>
    </div>
  )
}

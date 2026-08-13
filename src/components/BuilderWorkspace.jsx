import { useEffect, useState } from "react"
import PhotoSourceControls from "./PhotoSourceControls"
import PhotoEditor from "./PhotoEditor"
import BuilderForm, { validateName, validateHandle, normalizeHandle } from "./BuilderForm"
import TechStackInput from "./TechStackInput"
import BuilderEnergySection from "./BuilderEnergySection"
import ThemeSelector from "./ThemeSelector"
import BuilderPreview from "./BuilderPreview"
import ResultActions from "./ResultActions"
import { generateBuilderEnergy, shuffleTag, transformCustomTag } from "../utils/titleGenerator"
import { getTheme, THEMES } from "../utils/themes"
import { exportBuilderCard, downloadBuilderCard } from "../utils/canvasGenerator"
import { shareToX } from "../utils/shareUtils"

const DEFAULT_TRANSFORM = { x: 0, y: 0, scale: 1 }

const SAMPLE = {
  name: "YOUR NAME",
  handle: "@yourhandle",
  role: "Full Stack Developer",
  stack: ["Python", "React", "Node.js"],
  personalityDisplay: "Curious \u2022 Ships Fast",
  tag: { text: "YOUR BUILDER ENERGY IS HIDING...", shortText: "GOA BUILDER" },
  builderType: "GOA BUILDER",
}

export default function BuilderWorkspace({ onLocked }) {
  const [photo, setPhoto] = useState(null) // { img, url } | null
  const [transform, setTransform] = useState(DEFAULT_TRANSFORM)
  const [name, setName] = useState("")
  const [handle, setHandle] = useState("")
  const [role, setRole] = useState("")
  const [stack, setStack] = useState([])
  const [tagMode, setTagMode] = useState("traits") // "custom" | "traits"
  const [customTagText, setCustomTagText] = useState("")
  const [traits, setTraits] = useState([])
  const [themeId, setThemeId] = useState(THEMES[0].id)
  const [ruleTag, setRuleTag] = useState(null)
  const [exportBlob, setExportBlob] = useState(null)

  useEffect(() => {
    if (tagMode !== "traits") return
    // A title is earned from the complete three-trait read, never the first click.
    setRuleTag(traits.length === 3 ? generateBuilderEnergy(traits) : null)
  }, [traits, tagMode])

  function handleShuffle() {
    setRuleTag((prev) => (prev ? { ...prev, ...shuffleTag(prev, prev.candidates) } : prev))
  }

  function handlePhotoReady(loadedPhoto) {
    if (photo?.url) URL.revokeObjectURL(photo.url)
    setPhoto(loadedPhoto)
    setTransform(DEFAULT_TRANSFORM)
  }

  const resolvedTag =
    tagMode === "custom" ? transformCustomTag(customTagText) : ruleTag

  const canGenerate = Boolean(
    photo && !validateName(name) && name && !validateHandle(handle) && role.trim() && stack.length > 0 && resolvedTag
  )

  // Preview always shows something — real values where provided, sample
  // values everywhere else, so the card never looks empty.
  const cardData = {
    name: name || SAMPLE.name,
    handle: handle ? normalizeHandle(handle) : SAMPLE.handle,
    role: role || SAMPLE.role,
    stack: stack.length > 0 ? stack : SAMPLE.stack,
    tag: resolvedTag || SAMPLE.tag,
    builderType: resolvedTag?.shortText || SAMPLE.builderType,
    personalityDisplay: tagMode === "traits" && traits.length > 0 ? traits.join(" \u2022 ") : SAMPLE.personalityDisplay,
  }

  async function handleGenerate() {
    const blob = await exportBuilderCard(photo.img, cardData, getTheme(themeId), transform)
    setExportBlob(blob)
    onLocked?.({ blob, theme, cardData })
  }

  function handleDownload() {
    if (exportBlob) downloadBuilderCard(exportBlob)
  }

  function handleShare() {
    if (!exportBlob) return
    return shareToX(exportBlob, cardData)
  }

  function handleReset() {
    if (photo?.url) URL.revokeObjectURL(photo.url)
    setPhoto(null)
    setTransform(DEFAULT_TRANSFORM)
    setName("")
    setHandle("")
    setRole("")
    setStack([])
    setTraits([])
    setCustomTagText("")
    setRuleTag(null)
    setExportBlob(null)
  }

  const theme = getTheme(themeId)

  return (
    <section className="workspace" style={{ "--live-accent": theme.colors.accent }}>
      <div className="progress-rail" aria-label="Builder ID progress"><span className={photo ? "done" : ""}>01<br/>📸 FACE</span><span className={name && role && stack.length ? "done" : ""}>02<br/>🧠 BUILDER</span><span className={resolvedTag ? "done" : ""}>03<br/>⚡ ENERGY</span><span>04<br/>🌴 VIBE</span><span className={exportBlob ? "done" : ""}>05<br/>🪪 FINAL</span></div>
      <div className="workspace__controls">
        <div className="section-heading"><span>01 / YOUR FACE</span><h2>LET’S GET YOU IN THE FRAME <em>📸</em></h2><p>Pick the photo that deserves its Goa era.</p></div>

        <div className="field">
          <label>YOUR FACE IS THE MAIN CHARACTER</label>
          <PhotoSourceControls onPhotoReady={handlePhotoReady} />
          {photo && <PhotoEditor img={photo.img} imageUrl={photo.url} transform={transform} onChange={setTransform} />}
        </div>

        <div className="section-heading"><span>02 / BUILDER STATS</span><h2>WHO ARE YOU, BUILDER?</h2><p>The internet needs a little context. Give it the good bits.</p></div>
        <BuilderForm name={name} handle={handle} role={role} onNameChange={setName} onHandleChange={setHandle} onRoleChange={setRole} />
        <TechStackInput tags={stack} onChange={setStack} />

        <div className="section-heading"><span>03 / YOUR ENERGY</span><h2>WHAT’S YOUR BUILDER ENERGY? <i>🥝</i></h2><p>Pick the traits that feel suspiciously accurate.</p></div>
        <BuilderEnergySection
          mode={tagMode}
          onModeChange={setTagMode}
          customText={customTagText}
          onCustomTextChange={setCustomTagText}
          traits={traits}
          onTraitsChange={setTraits}
          tag={resolvedTag}
          traitCount={traits.length}
          onShuffle={handleShuffle}
        />

        <div className="section-heading"><span>04 / YOUR VIBE</span><h2>PICK YOUR VIBE</h2><p>Different mood. Same builder energy.</p></div>
        <ThemeSelector selectedId={themeId} onChange={setThemeId} />
      </div>

      <div className="workspace__preview">
        <div className="section-heading section-heading--preview"><span>05 / FINAL FORM</span><h2>YOUR COLLECTIBLE ID</h2><p>It’s already looking unfairly postable.</p></div>
        <BuilderPreview img={photo?.img || null} cardData={cardData} theme={theme} transform={transform} />
        <ResultActions
          canGenerate={canGenerate}
          hasExport={Boolean(exportBlob)}
          onGenerate={handleGenerate}
          onDownload={handleDownload}
          onShare={handleShare}
          onReset={handleReset}
        />
      </div>
    </section>
  )
}

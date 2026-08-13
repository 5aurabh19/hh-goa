// Curated role+trait combinations, checked in order of specificity.
// Each rule provides both a full text and a guaranteed-short version so
// the card renderer never has to truncate mid-word.
const TAG_RULES = [
  { roles: ["ML Engineer", "AI Engineer", "Machine Learning Engineer", "AI/ML Engineer"],
    traits: ["Curious", "Night Owl"], text: "THE MIDNIGHT MODEL WHISPERER", shortText: "MIDNIGHT MODEL WHISPERER" },
  { roles: ["ML Engineer", "AI Engineer", "Machine Learning Engineer"],
    traits: ["Perfectionist"], text: "THE MODEL TUNER", shortText: "MODEL TUNER" },
  { roles: ["ML Engineer", "AI Engineer", "Deep Learning Engineer"],
    traits: ["Explorer"], text: "THE NEURAL EXPLORER", shortText: "NEURAL EXPLORER" },
  { roles: ["Full Stack Developer", "Software Developer", "Software Engineer"],
    traits: ["Chaos Agent", "Ships Fast"], text: "THE CHAOTIC SHIPPER", shortText: "CHAOTIC SHIPPER" },
  { roles: ["Full Stack Developer"],
    traits: ["Fast Learner"], text: "THE END-TO-END ENGINEER", shortText: "END-TO-END ENGINEER" },
  { roles: ["Product Designer", "UI/UX Designer", "UI Designer", "UX Designer", "Visual Designer"],
    traits: ["Creative", "Perfectionist"], text: "THE PIXEL PERFECTIONIST", shortText: "PIXEL PERFECTIONIST" },
  { roles: ["Product Designer", "UI/UX Designer", "Interaction Designer"],
    traits: ["Detail Obsessed"], text: "THE INTERFACE ARCHITECT", shortText: "INTERFACE ARCHITECT" },
  { roles: ["Backend Developer"],
    traits: ["Problem Solver", "Debugger"], text: "THE API WHISPERER", shortText: "API WHISPERER" },
  { roles: ["Backend Developer"],
    traits: ["Quiet Genius"], text: "THE SERVER SORCERER", shortText: "SERVER SORCERER" },
  { roles: ["Cybersecurity Engineer", "Security Researcher", "Security Analyst", "Penetration Tester"],
    traits: ["Problem Solver", "Risk Taker"], text: "THE DIGITAL DETECTIVE", shortText: "DIGITAL DETECTIVE" },
  { roles: ["Cybersecurity Engineer", "Security Researcher"],
    traits: ["Detail Obsessed"], text: "THE SYSTEM SENTINEL", shortText: "SYSTEM SENTINEL" },
  { roles: ["Product Manager", "Product Owner"],
    traits: ["Big Picture Thinker", "Idea Machine"], text: "THE PRODUCT ALCHEMIST", shortText: "PRODUCT ALCHEMIST" },
  { roles: ["Product Manager"],
    traits: ["Team Player"], text: "THE ROADMAP WRANGLER", shortText: "ROADMAP WRANGLER" },
  { roles: ["Student / Builder"],
    traits: ["Curious", "Explorer"], text: "THE CURIOUS BUILDER", shortText: "CURIOUS BUILDER" },
  { roles: ["Student / Builder"],
    traits: ["Tinkerer"], text: "THE WEEKEND TINKERER", shortText: "WEEKEND TINKERER" },
  { roles: ["Blockchain Developer", "Smart Contract Developer", "Web3 Developer"],
    traits: [], text: "THE CHAIN WHISPERER", shortText: "CHAIN WHISPERER" },
  { roles: ["DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer"],
    traits: [], text: "THE DEPLOY WHISPERER", shortText: "DEPLOY WHISPERER" },
  { roles: ["Data Scientist", "Data Analyst", "Data Engineer"],
    traits: ["Curious"], text: "THE PATTERN SEEKER", shortText: "PATTERN SEEKER" },
  { roles: ["Founder", "Co-Founder", "Indie Hacker"],
    traits: ["Risk Taker", "Idea Machine"], text: "THE CHAOS-TO-FEATURE FOUNDER", shortText: "CHAOS-TO-FEATURE FOUNDER" },
  { roles: ["Mobile Developer", "iOS Developer", "Android Developer"],
    traits: [], text: "THE POCKET ENGINEER", shortText: "POCKET ENGINEER" },
  { roles: ["Game Developer"],
    traits: [], text: "THE WORLD BUILDER", shortText: "WORLD BUILDER" },
]

const ROLE_FALLBACK = {
  "ML Engineer": "THE MODEL WHISPERER",
  "AI Engineer": "THE AI ALCHEMIST",
  "Full Stack Developer": "THE FULL-STACK SHIPPER",
  "Frontend Developer": "THE PIXEL ALCHEMIST",
  "Backend Developer": "THE SERVER SORCERER",
  "Product Manager": "THE PRODUCT HACKER",
  "Product Designer": "THE INTERFACE ARCHITECT",
  "UI/UX Designer": "THE INTERFACE ARCHITECT",
  "Data Scientist": "THE DATA EXPLORER",
  "Data Analyst": "THE DATA EXPLORER",
  "Cybersecurity Engineer": "THE SYSTEM SENTINEL",
  "Blockchain Developer": "THE CHAIN WHISPERER",
  "DevOps Engineer": "THE DEPLOY WHISPERER",
  "Cloud Engineer": "THE CLOUD WRANGLER",
  "Mobile Developer": "THE POCKET ENGINEER",
  "Game Developer": "THE WORLD BUILDER",
  "Student / Builder": "THE CURIOUS BUILDER",
  "Founder": "THE IDEA SHIPPER",
}

const GENERIC_TAGS = ["THE BUILDER", "CODE CARTOGRAPHER", "THE SHIP-IT SPECIALIST", "SYSTEM ARCHITECT"]

const MAX_TAG_LENGTH = 26 // characters — keeps the card's title line from ever needing mid-word truncation

function toShort(text) {
  return text.replace(/^THE\s+/, "")
}

function findMatchingRules(role, traits) {
  return TAG_RULES.filter((rule) => rule.roles.includes(role) && rule.traits.every((t) => traits.includes(t)))
}

// Turns free text like "coffee-powered builder" into a card-ready title.
// If it's already short enough and reads like a title, just capitalizes it
// and adds "THE" if missing; otherwise trims to the strongest few words.
export function transformCustomTag(input) {
  const cleaned = input.trim().replace(/\s+/g, " ")
  if (!cleaned) return null

  const words = cleaned.split(" ")
  const capitalized = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
  const withThe = /^the\s/i.test(capitalized) ? capitalized : `The ${capitalized}`
  const upper = withThe.toUpperCase()

  if (upper.length <= MAX_TAG_LENGTH + 4) {
    return { text: upper, shortText: toShort(upper) }
  }

  // Too long — keep "THE" + first 3 significant words only.
  const trimmedWords = words.slice(0, 3).join(" ")
  const shortUpper = `THE ${trimmedWords}`.toUpperCase()
  return { text: shortUpper, shortText: trimmedWords.toUpperCase() }
}

// Always returns { text, shortText, candidates }. candidates is every
// role/trait match found, so shuffleTag() can cycle without recomputing.
export function generateBuilderTag(role, traits) {
  const matches = findMatchingRules(role, traits)
  if (matches.length > 0) {
    return { text: matches[0].text, shortText: matches[0].shortText, candidates: matches }
  }
  if (ROLE_FALLBACK[role]) {
    const fallback = { text: ROLE_FALLBACK[role], shortText: toShort(ROLE_FALLBACK[role]) }
    const generic = GENERIC_TAGS.map((t) => ({ text: t, shortText: toShort(t) }))
    return { ...fallback, candidates: [fallback, ...generic] }
  }
  const generic = GENERIC_TAGS.map((t) => ({ text: t, shortText: toShort(t) }))
  return { ...generic[0], candidates: generic }
}

export function shuffleTag(current, candidates) {
  if (candidates.length <= 1) return current
  const others = candidates.filter((c) => c.text !== current.text)
  return others[Math.floor(Math.random() * others.length)]
}

// This is intentionally personality-only. Role and stack belong to the
// metadata layer of the ID, never to the Builder Energy title.
const ENERGY_RULES = [
  { traits: ["Creative", "Perfectionist", "Detail Obsessed"], title: "THE PIXEL PERFECTIONIST" },
  { traits: ["Creative", "Perfectionist"], title: "THE PIXEL PERFECTIONIST" },
  { traits: ["Detail Obsessed", "Perfectionist"], title: "THE DETAIL ALCHEMIST" },
  { traits: ["Curious", "Creative", "Night Owl"], title: "THE MIDNIGHT DREAMER" },
  { traits: ["Night Owl", "Coffee Powered", "Always Experimenting"], title: "THE MIDNIGHT EXPERIMENTER" },
  { traits: ["Chaos Agent", "Ships Fast", "Risk Taker"], title: "THE BEAUTIFUL DISASTER" },
  { traits: ["Chaos Agent", "Ships Fast"], title: "THE CHAOS SHIPPER" },
  { traits: ["Problem Solver", "Debugger", "Detail Obsessed"], title: "THE BUG HUNTER" },
  { traits: ["Problem Solver", "Debugger"], title: "THE FIXER" },
  { traits: ["Big Picture Thinker", "Idea Machine", "Curious"], title: "THE VISIONARY" },
  { traits: ["Big Picture Thinker", "Idea Machine"], title: "THE IDEA ARCHITECT" },
  { traits: ["Team Player", "Builder", "Explorer"], title: "THE COLLABORATIVE EXPLORER" },
  { traits: ["Curious", "Explorer"], title: "THE CURIOUS EXPLORER" },
  { traits: ["Night Owl", "Coffee Powered"], title: "THE MIDNIGHT GRINDER" },
]

const ENERGY_FALLBACKS = {
  Curious: "THE CURIOUS MIND", Creative: "THE IDEA ALCHEMIST", "Problem Solver": "THE FIXER",
  "Night Owl": "THE MIDNIGHT BUILDER", Perfectionist: "THE PERFECTIONIST", "Chaos Agent": "THE CHAOS ENGINE",
  "Team Player": "THE CONNECTOR", "Idea Machine": "THE IDEA FACTORY", "Fast Learner": "THE RAPID FIRE MIND",
  Debugger: "THE BUG HUNTER", Explorer: "THE PATHFINDER", "Risk Taker": "THE WILD CARD",
  Builder: "THE MAKER", Tinkerer: "THE TINKERER", "Detail Obsessed": "THE DETAIL ALCHEMIST",
  "Big Picture Thinker": "THE VISIONARY", "Coffee Powered": "THE CAFFEINATED BUILDER",
  "Always Experimenting": "THE EXPERIMENTALIST", "Ships Fast": "THE SHIPPER", "Quiet Genius": "THE SILENT ARCHITECT",
}

export function generateBuilderEnergy(traits = []) {
  // Final energy is intentionally withheld until the complete three-trait
  // picture is available. The UI owns the 0/1/2 trait progress messages.
  if (traits.length < 3) return null
  const matches = ENERGY_RULES.filter((rule) => rule.traits.every((trait) => traits.includes(trait)))
  const candidates = matches.length ? matches : traits.map((trait) => ({ title: ENERGY_FALLBACKS[trait] || "THE GOA BUILDER" }))
  const first = candidates[0]
  return { text: first.title, shortText: toShort(first.title), candidates: candidates.map((item) => ({ text: item.title, shortText: toShort(item.title) })) }
}

// Retained as an alias for existing callers; accepts traits only by design.
export function generateBuilderType(traits = []) { return generateBuilderEnergy(traits)?.shortText || "GOA BUILDER" }

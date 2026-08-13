export const THEMES = [
  {
    id: "blackWhite",
    name: "MONOCHROME RIOT",
    style: "editorial",
    swatch: ["#0a0a0a", "#f5f0e6", "#ffd23f"],
    colors: { bg: "#0a0a0a", bg2: "#151515", text: "#f5f0e6", accent: "#ffd23f", accent2: "#ff5da2", frame: "#f5f0e6" },
    uiClass: "theme-black-white",
  },
  {
    id: "pinkWhite",
    name: "SAKURA SIGNAL",
    style: "poster",
    swatch: ["#ff5da2", "#fff6ef", "#ffd23f"],
    colors: { bg: "#ff5da2", bg2: "#ff8fc0", text: "#2a0a1a", accent: "#fff6ef", accent2: "#ffd23f", frame: "#2a0a1a" },
    uiClass: "theme-pink-white",
  },
  {
    id: "greenYellow",
    name: "TROPIC VOLTAGE",
    style: "classic",
    swatch: ["#0b2d20", "#ffd34e", "#ff5da2"],
    colors: { bg: "#0b2d20", bg2: "#123322", text: "#fdf6e9", accent: "#ffd34e", accent2: "#ff5da2", frame: "#ffd34e" },
    uiClass: "theme-green-yellow",
  },
  {
    id: "orangeCream",
    name: "SUNSET CIRCUIT",
    style: "sunset",
    swatch: ["#ff7a45", "#fdf3e2", "#123322"],
    colors: { bg: "#ff7a45", bg2: "#ffb26b", text: "#123322", accent: "#fdf3e2", accent2: "#123322", frame: "#123322" },
    uiClass: "theme-orange-cream",
  },
  {
    id: "purplePink",
    name: "NIGHT MARKET",
    style: "nightlife",
    swatch: ["#2b0f4a", "#ff5da2", "#ffd23f"],
    colors: { bg: "#2b0f4a", bg2: "#4a1a6e", text: "#fdf3ff", accent: "#ff5da2", accent2: "#ffd23f", frame: "#ff5da2" },
    uiClass: "theme-purple-pink",
  },
  {
    id: "kiwiCrew",
    name: "KIWI CREW",
    style: "kiwi",
    swatch: ["#6cba42", "#e6f08a", "#fff5d8", "#ff5da2"],
    colors: { bg: "#264f2b", bg2: "#6cba42", text: "#fff5d8", accent: "#e6f08a", accent2: "#ff5da2", frame: "#e6f08a" },
    uiClass: "theme-kiwi-crew",
  },
]

export function getTheme(id) {
  return THEMES.find((t) => t.id === id) || THEMES[0]
}

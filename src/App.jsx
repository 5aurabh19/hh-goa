import { useState } from "react"
import IntroScreen from "./components/IntroScreen"
import BuilderWorkspace from "./components/BuilderWorkspace"
import FinalReveal from "./components/FinalReveal"
import { downloadBuilderCard } from "./utils/canvasGenerator"
import { shareToX } from "./utils/shareUtils"

export default function App() {
  const [screen, setScreen] = useState("intro")
  const [finalId, setFinalId] = useState(null)

  return (
    <div className="app">
      <div className="goa-world" aria-hidden="true"><i className="sun" /><i className="cloud cloud--one" /><i className="cloud cloud--two" /><i className="cloud cloud--three" /><i className="bird bird--one"><b /></i><i className="bird bird--two"><b /></i><i className="bird bird--three"><b /></i><i className="plane plane--one">✈</i><i className="plane plane--two">✈</i><i className="island island--far" /><i className="island island--near" /><i className="palm palm--left">♠</i><i className="palm palm--right">♠</i><i className="wave" /></div>
      <div className={`screen screen--intro ${screen === "intro" ? "screen--active" : ""}`}><IntroScreen onStart={() => setScreen("workspace")} /></div>
      <div className={`screen screen--workspace ${screen === "workspace" ? "screen--active" : ""}`}>
        <header className="app-header"><button className="back-button" onClick={() => setScreen("intro")}>← BACK TO GOA</button><span className="app-header__title"><b>HH</b> / GOA <i>2026</i></span><span className="app-header__stamp">THEKIWICREW 🥝</span></header>
        <div className="builder-masthead"><div className="masthead__mark"><span>HH</span><small>26</small></div><div className="masthead__copy"><small>GOA, INDIA · 28—31 OCT 2026</small><h1>HACKER<br/><b>HOUSE</b><em>GOA</em></h1></div><p>YOUR PASSPORT TO A<br/><strong>BUILDER IDENTITY</strong><span>#FRAMEINGOA</span></p></div>
        <BuilderWorkspace onLocked={(id) => { setFinalId(id); setScreen("reveal") }} />
        <footer className="site-footer"><span className="footer-kiwis">🥝 🥝 🥝</span> CREATED WITH CHAOS & COCONUTS BY <b>THEKIWICREW</b><small>HH GOA 2026 · #FRAMEINGOA</small></footer>
      </div>
      <div className={`screen screen--reveal ${screen === "reveal" ? "screen--active" : ""}`}>
        {finalId && <FinalReveal id={finalId} onBack={() => setScreen("workspace")} onDownload={() => downloadBuilderCard(finalId.blob)} onShare={() => shareToX(finalId.blob, finalId.cardData)} />}
      </div>
    </div>
  )
}

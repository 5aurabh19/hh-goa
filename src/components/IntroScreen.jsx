export default function IntroScreen({ onStart }) {
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true" />
      <span className="hero__postcard" aria-hidden="true">NO BUGS, JUST BEACHES</span>

      <p className="hero__eyebrow">HACKER HOUSE GOA 2026</p>

      <h1 className="hero__title">
        <span className="hero__title-line">
          HACKER
          <span className="hero__sticker">गोवा</span>
        </span>
        <span className="hero__title-line">HOUSE</span>
      </h1>

      <p className="hero__tagline">WHO ARE YOU, BUILDER?<small>Let’s turn your face, stack and suspiciously specific energy into a Goa-worthy digital collectible.</small></p>

      <button type="button" className="btn btn--primary btn--hero" onClick={onStart}>
        CREATE MY BUILDER ID →
      </button>

      <div className="hero__info">
        <span>GOA, INDIA</span>
        <span>28 – 31 OCT 2026</span>
        <span>#FRAMEINGOA</span>
      </div>
    </section>
  )
}

// Hero.jsx — two-column hero with headline, badge, stats, CTAs, phone visual
function Hero({ trust, headline, headlineAccent, subtitle, stats, primaryCta, secondaryCta, visual }) {
  return (
    <section className="emd-hero">
      <div className="emd-hero-bg" />
      <div className="emd-hero-inner">
        <div>
          {trust ? <TrustBadge>{trust}</TrustBadge> : null}
          <h1>
            {headline}
            {headlineAccent ? <span className="emd-hero-accent">{headlineAccent}</span> : null}
          </h1>
          <p className="emd-hero-subtitle">{subtitle}</p>
          {stats ? <StatCluster stats={stats} /> : null}
          <div className="emd-btn-row">
            {primaryCta ? <Button variant="primary" iconRight="bi-arrow-right-circle" onClick={primaryCta.onClick}>{primaryCta.label}</Button> : null}
            {secondaryCta ? <Button variant="secondary" icon="bi-play-circle" onClick={secondaryCta.onClick}>{secondaryCta.label}</Button> : null}
          </div>
        </div>
        <div>{visual}</div>
      </div>
    </section>
  );
}

window.Hero = Hero;

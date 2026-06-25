// CTASection.jsx — full-bleed conversion section, tone-aware
function CTASection({ tone = 'red', title, subtitle, primaryLabel, secondaryLabel, trust }) {
  return (
    <section className={`emd-cta tone-${tone}`}>
      <div className="emd-cta-inner">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <div className="emd-cta-actions">
          <button className="emd-btn cta-primary" onClick={() => alert('(prototype) Sign up')}>{primaryLabel}</button>
          <button className="emd-btn cta-secondary" onClick={() => alert('(prototype) Watch demo')}>{secondaryLabel}</button>
        </div>
        {trust && trust.length ? (
          <div className="emd-cta-trust">
            {trust.map((t, i) => (
              <div key={i}>
                <i className={`bi ${t.icon}`} />
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

window.CTASection = CTASection;

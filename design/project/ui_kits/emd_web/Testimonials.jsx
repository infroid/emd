// Testimonials.jsx — tone-aware testimonial strip
function Testimonials({ heading = 'Trusted by Healthcare Experts', subheading, items = [], tone = 'red' }) {
  return (
    <section className="emd-section">
      <div className="emd-section-head">
        <h2>{heading}</h2>
        {subheading ? <p>{subheading}</p> : null}
      </div>
      <div className="emd-fgrid">
        {items.map((t, i) => (
          <div className={`emd-tcard tone-${tone}`} key={i}>
            <p className="emd-tquote">"{t.quote}"</p>
            <div className="emd-tauthor">
              <div className={`emd-tavatar tone-${tone}`}>{t.initial}</div>
              <div>
                <h4>{t.name}</h4>
                <p>{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

window.Testimonials = Testimonials;

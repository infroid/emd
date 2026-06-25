// FeatureCard.jsx + FeatureGrid.jsx — Thiings illustration pattern, theme-aware tone classes
function FeatureCard({ tone = 'red', slotId, slotPlaceholder, surfaceTag, title, description, benefits = [] }) {
  return (
    <div className={`emd-fcard tone-${tone}`}>
      <div className="illo">
        <image-slot id={slotId} placeholder={slotPlaceholder} />
      </div>
      <div className="body">
        {surfaceTag ? <div className="surface-tag">{surfaceTag}</div> : null}
        <h3>{title}</h3>
        <p>{description}</p>
        {benefits.length ? (
          <ul>
            {benefits.map((b, i) => (
              <li key={i}><i className="bi bi-check-circle-fill" /> {b}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function FeatureGrid({ features }) {
  return (
    <div className="emd-fgrid">
      {features.map((f, i) => <FeatureCard key={f.slotId || i} {...f} />)}
    </div>
  );
}

window.FeatureCard = FeatureCard;
window.FeatureGrid = FeatureGrid;

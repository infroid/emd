// TrustBadge.jsx — pill at the top of the hero
function TrustBadge({ icon = 'bi-shield-check', children }) {
  return (
    <span className="emd-trust">
      <i className={`bi ${icon}`} />
      <span>{children}</span>
    </span>
  );
}

window.TrustBadge = TrustBadge;

// EmergencyFAB.jsx — the always-visible floating Emergency button
function EmergencyFAB({ onClick }) {
  return (
    <button className="emd-fab" onClick={onClick} aria-label="Emergency SOS">
      <i className="bi bi-exclamation-triangle-fill" />
      <span>Emergency</span>
    </button>
  );
}

window.EmergencyFAB = EmergencyFAB;

// DoctorBookingCard.jsx — appointment booking panel for Doctor hero visual
function DoctorBookingCard() {
  const slots = ['11:30 AM', '2:15 PM', '4:45 PM'];
  const selected = 1;
  return (
    <div className="emd-panel">
      <div className="emd-panel-head">
        <div className="emd-panel-avatar">DR</div>
        <div className="emd-panel-meta grow">
          <div className="t">Dr. Rina Desai</div>
          <div className="s">Internal Medicine · 12 yrs experience</div>
        </div>
        <span className="emd-panel-chip online">
          <i className="bi bi-circle-fill" /> Online
        </span>
      </div>
      <div className="emd-panel-eyebrow">Today · 3 slots</div>
      <div className="emd-slots">
        {slots.map((t, i) => (
          <button key={i} className={`emd-slot ${i === selected ? 'is-selected' : ''}`}>{t}</button>
        ))}
      </div>
      <button className="emd-btn primary emd-panel-cta">
        Book 2:15 PM <i className="bi bi-arrow-right-circle" />
      </button>
    </div>
  );
}
window.DoctorBookingCard = DoctorBookingCard;

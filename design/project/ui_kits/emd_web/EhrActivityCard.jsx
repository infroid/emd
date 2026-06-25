// EhrActivityCard.jsx — recent activity panel for EHR hero visual
function EhrActivityCard() {
  const rows = [
    { icon: 'bi-droplet-fill',          title: 'Lab results · Lipid panel', sub: '2 hours ago',  tone: 'blue'   },
    { icon: 'bi-capsule',               title: 'Prescription refilled',     sub: 'Yesterday',    tone: 'green'  },
    { icon: 'bi-clipboard2-pulse-fill', title: 'Consult notes added',       sub: '3 days ago',   tone: 'purple' },
    { icon: 'bi-heart-pulse',           title: 'BP reading · 118/76',       sub: 'Last week',    tone: 'red'    },
  ];
  return (
    <div className="emd-panel">
      <div className="emd-panel-eyebrow">Recent activity</div>
      {rows.map((r, i) => (
        <div key={i} className={`emd-panel-row ${i < rows.length - 1 ? 'has-divider' : ''}`}>
          <div className={`emd-panel-ico tone-${r.tone}`}><i className={`bi ${r.icon}`} /></div>
          <div className="emd-panel-meta">
            <div className="t">{r.title}</div>
            <div className="s">{r.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
window.EhrActivityCard = EhrActivityCard;

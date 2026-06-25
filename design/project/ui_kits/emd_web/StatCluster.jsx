// StatCluster.jsx — three-stat strip
function StatCluster({ stats }) {
  return (
    <div className="emd-stats">
      {stats.map((s, i) => (
        <div className="emd-stat" key={i}>
          <div className="emd-stat-num">{s.value}</div>
          <div className="emd-stat-lab">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

window.StatCluster = StatCluster;

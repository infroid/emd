// PhoneMockup.jsx — the iOS-style phone with the SOS interface. Hero visual.
function PhoneMockup({ time = '11:45', appTitle = 'Emergency SOS', appSubtitle = 'Location: Downtown Medical Center' }) {
  return (
    <div className="emd-phone">
      <div className="emd-phone-screen">
        <div className="emd-phone-status">
          <span>{time}</span>
          <span className="icons">
            <i className="bi bi-reception-4" />
            <i className="bi bi-wifi" />
            <i className="bi bi-battery-full" />
          </span>
        </div>
        <div className="emd-phone-head">
          <h3>{appTitle}</h3>
          <p>{appSubtitle}</p>
        </div>
        <div className="emd-phone-body">
          <div className="emd-phone-status-card">
            <div className="ico"><i className="bi bi-shield-check" /></div>
            <div>
              <p className="t">Emergency Ready</p>
              <p className="s">GPS Active · Contacts Set</p>
            </div>
          </div>

          <div className="emd-sos-wrap">
            <div className="emd-sos-ring" />
            <div className="emd-sos-ring delay" />
            <button className="emd-sos" aria-label="SOS">
              <i className="bi bi-telephone-fill" />
              <span>SOS</span>
            </button>
          </div>

          <div className="emd-phone-feats">
            <div className="emd-phone-feat"><i className="bi bi-geo-alt-fill" /> Auto Location Sharing</div>
            <div className="emd-phone-feat"><i className="bi bi-people-fill" /> Instant Contact Alerts</div>
            <div className="emd-phone-feat"><i className="bi bi-headset" /> 24/7 Emergency Line</div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.PhoneMockup = PhoneMockup;

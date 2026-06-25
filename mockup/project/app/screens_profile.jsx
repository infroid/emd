// screens_profile.jsx — profile hub, account, family vaults, insurance,
// notification prefs, language, privacy, and the notifications/activity feed.

const { useState } = React;

function ScreenProfile({ nav }) {
  const { USER } = window.DB;
  return (
    <React.Fragment>
      <MLargeHead title="You" trailing={<MIconBtn icon="gear" onClick={() => nav.push('privacy')} />} />
      <div className="scroll" style={{ padding: '8px 16px 16px' }}>
        <button className="m-card tap" style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16, width: '100%', textAlign: 'left', border: '1px solid var(--border-1)' }} onClick={() => nav.push('account')}>
          <Avatar tone={USER.tone} size={56} radius={18}>{USER.initials}</Avatar>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, margin: 0 }}>{USER.name}</h3>
            <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', margin: '2px 0 6px' }}>{USER.phone} · {USER.email}</p>
            <MStatus tone="green"><I name="shield-fill-check" />Vault verified</MStatus>
          </div>
          <I name="chevron-right" style={{ color: 'var(--fg-muted)' }} />
        </button>

        <SectionLabel>Account</SectionLabel>
        <MList style={{ marginBottom: 16 }}>
          <MRow icon="person-vcard-fill" iconTone="blue" title="Personal info" sub="Name, DOB, address" onClick={() => nav.push('account')} />
          <MRow icon="capsule" iconTone="purple" title="Medical profile" sub="Blood type, allergies, conditions" onClick={() => nav.push('medical')} />
          <MRow icon="people-fill" iconTone="red" title="Emergency contacts" sub="3 contacts" trailing="3" onClick={() => nav.push('contacts')} />
          <MRow icon="credit-card-2-front-fill" iconTone="amber" title="Insurance" sub="Aetna · PPO" onClick={() => nav.push('insurance')} />
          <MRow icon="people-fill" iconTone="green" title="Family vaults" sub="Mom · Dad · Aanya" trailing="3" onClick={() => nav.push('family')} />
        </MList>

        <SectionLabel>Preferences</SectionLabel>
        <MList style={{ marginBottom: 16 }}>
          <MRow icon="bell-fill" iconTone="amber" title="Notifications" onClick={() => nav.push('notifPrefs')} />
          <MRow icon="translate" iconTone="blue" title="Language" trailing="English" onClick={() => nav.push('language')} />
          <MRow icon={nav.theme === 'dark' ? 'moon-stars-fill' : 'sun-fill'} iconTone="purple" title="Appearance"
            chev={false} right={<MSwitch on={nav.theme === 'dark'} onChange={(v) => nav.setTheme(v ? 'dark' : 'light')} />} />
          <MRow icon="shield-lock-fill" iconTone="red" title="Privacy & data" onClick={() => nav.push('privacy')} />
        </MList>

        <SectionLabel>Support</SectionLabel>
        <MList>
          <MRow icon="question-circle-fill" iconTone="gray" title="Help center" onClick={() => nav.toast('Opening help center', 'question-circle-fill')} />
          <MRow icon="chat-left-dots-fill" iconTone="gray" title="Contact support" onClick={() => nav.toast('Starting a support chat', 'chat-left-dots-fill')} />
          <MRow icon="box-arrow-right" iconTone="red" title="Sign out" chev={false} onClick={() => nav.reset('splash')} />
        </MList>
        <p className="muted center" style={{ fontSize: 11, marginTop: 18 }}>EaseMyDisease · v3.0 · Made with care</p>
      </div>
    </React.Fragment>
  );
}

function ScreenAccount({ nav }) {
  const { USER } = window.DB;
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title="Personal info" trailing={<button className="m-btn ghost" style={{ minHeight: 'auto', padding: '6px 10px', fontSize: 13 }} onClick={() => { nav.pop(); nav.toast('Profile saved', 'check-circle-fill'); }}>Save</button>} />
      <div className="scroll" style={{ padding: '14px 18px 18px' }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar tone={USER.tone} size={80} radius={26} style={{ margin: '0 auto' }}>{USER.initials}</Avatar>
            <span style={{ position: 'absolute', right: -2, bottom: -2, width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, border: '3px solid var(--bg-2)' }}><I name="camera-fill" /></span>
          </div>
        </div>
        <div className="stack-12">
          <MField label="Full name" defaultValue={USER.name} />
          <MField label="Phone number" defaultValue={USER.phone} type="tel" />
          <MField label="Email" defaultValue={USER.email} type="email" />
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}><MField label="Date of birth" defaultValue={USER.dob} /></div>
            <div style={{ width: 110 }}><MField label="Sex" defaultValue={USER.sex} /></div>
          </div>
          <MField label="Address" defaultValue={USER.address} />
        </div>
      </div>
    </React.Fragment>
  );
}

function ScreenFamily({ nav }) {
  const fam = [
    { n: 'Aanya Patel', r: 'Spouse · 32', tone: 'red', i: 'AP', score: 88 },
    { n: 'Raj Patel', r: 'Father · 68', tone: 'blue', i: 'RP', score: 71 },
    { n: 'Meera Patel', r: 'Mother · 64', tone: 'green', i: 'MP', score: 80 },
  ];
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title="Family vaults" trailing={<MIconBtn icon="person-plus-fill" onClick={() => nav.toast('Invite a family member', 'person-plus-fill')} />} />
      <div className="scroll" style={{ padding: '12px 16px 16px' }}>
        <MBanner tone="info" title="One account, whole family">Manage records, meds and emergencies for the people you care for — switch profiles anytime.</MBanner>
        <div className="spacer-16" />
        <div className="stack-10">
          {fam.map(f => (
            <button key={f.n} className="card-soft tap" style={{ display: 'flex', gap: 13, alignItems: 'center', width: '100%', textAlign: 'left', border: '1px solid var(--border-1)' }} onClick={() => nav.toast(`Switching to ${f.n.split(' ')[0]}'s vault`, 'arrow-left-right')}>
              <Avatar tone={f.tone} size={48} radius={16}>{f.i}</Avatar>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, margin: 0, color: 'var(--fg-1)' }}>{f.n}</p>
                <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', margin: '2px 0 0' }}>{f.r}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Ring value={f.score} size={40} stroke={5} color={f.score >= 85 ? '#16a34a' : f.score >= 73 ? '#f59e0b' : '#dc2626'} track="var(--bg-3)"><span style={{ fontSize: 11, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--fg-1)' }}>{f.score}</span></Ring>
              </div>
            </button>
          ))}
        </div>
        <div className="spacer-16" />
        <MButton variant="secondary" block icon="person-plus-fill" onClick={() => nav.toast('Invite a family member', 'person-plus-fill')}>Add a family member</MButton>
      </div>
    </React.Fragment>
  );
}

function ScreenInsurance({ nav }) {
  const { insurance: ins } = window.DB.USER;
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title="Insurance" trailing={<MIconBtn icon="plus-lg" onClick={() => nav.toast('Add a plan', 'plus-lg')} />} />
      <div className="scroll" style={{ padding: '14px 16px 16px' }}>
        {/* insurance card */}
        <div className="band-blue band-glow" style={{ borderRadius: 20, padding: 20, position: 'relative', overflow: 'hidden', minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="dotgrid" style={{ position: 'absolute', inset: 0, opacity: .25 }} />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', opacity: .85, margin: 0 }}>{ins.carrier}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, margin: '2px 0 0' }}>{ins.plan}</p>
            </div>
            <I name="shield-fill-check" style={{ fontSize: 26 }} />
          </div>
          <div style={{ position: 'relative' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 16, letterSpacing: '.12em', margin: 0 }}>{ins.member}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11.5, opacity: .9 }}>
              <span>MEMBER · {window.DB.USER.name.toUpperCase()}</span><span>GRP {ins.group}</span>
            </div>
          </div>
        </div>

        <div className="spacer-16" />
        <SectionLabel>Coverage</SectionLabel>
        <MList style={{ marginBottom: 16 }}>
          <MRow icon="cash-coin" iconTone="green" title="Deductible" sub="$1,200 of $2,000 met" trailingStrong="60%" chev={false} />
          <MRow icon="hospital-fill" iconTone="blue" title="Network" sub="In-network: Mercy General" chev={false} />
          <MRow icon="capsule" iconTone="purple" title="Rx coverage" sub="Tier 1–3 covered" chev={false} />
        </MList>
        <MButton variant="secondary" block icon="download" onClick={() => nav.toast('Insurance card saved', 'download')}>Download card</MButton>
      </div>
    </React.Fragment>
  );
}

function ScreenNotifPrefs({ nav }) {
  const [s, setS] = useState({ sos: true, appt: true, rx: true, results: true, family: false, tips: true, marketing: false });
  const groups = [
    ['Critical', [['sos', 'Emergency & SOS', 'Always on for safety'], ['results', 'New lab results']]],
    ['Care', [['appt', 'Appointment reminders'], ['rx', 'Medication reminders'], ['family', 'Family vault activity']]],
    ['Other', [['tips', 'Health tips'], ['marketing', 'Product news']]],
  ];
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title="Notifications" />
      <div className="scroll" style={{ padding: '14px 16px 16px' }}>
        {groups.map(([g, rows]) => (
          <div key={g} style={{ marginBottom: 16 }}>
            <SectionLabel>{g}</SectionLabel>
            <div className="card-soft">
              {rows.map(([key, label, sub]) => (
                <div className="kv" key={key} style={{ alignItems: 'center' }}>
                  <div><div className="v" style={{ fontSize: 14 }}>{label}</div>{sub && <div className="k" style={{ fontSize: 12 }}>{sub}</div>}</div>
                  <MSwitch on={key === 'sos' ? true : s[key]} onChange={(v) => key !== 'sos' && setS({ ...s, [key]: v })} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

function ScreenLanguage({ nav }) {
  const [lang, setLang] = useState('en');
  const langs = [['en', '🇺🇸', 'English', 'English'], ['es', '🇪🇸', 'Español', 'Spanish'], ['hi', '🇮🇳', 'हिन्दी', 'Hindi']];
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title="Language" />
      <div className="scroll" style={{ padding: '14px 16px 16px' }}>
        <MList>
          {langs.map(([k, flag, native, en]) => (
            <button key={k} className="m-list-row" onClick={() => { setLang(k); nav.toast(`Language: ${en}`, 'translate'); }}>
              <span style={{ fontSize: 24, width: 36, textAlign: 'center' }}>{flag}</span>
              <div className="meta"><p className="t">{native}</p><p className="s">{en}</p></div>
              {lang === k
                ? <span style={{ color: 'var(--accent)', fontSize: 20 }}><I name="check-circle-fill" /></span>
                : <span style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--border-2)' }} />}
            </button>
          ))}
        </MList>
        <p className="muted" style={{ fontSize: 12.5, marginTop: 14, lineHeight: 1.5 }}>EaseMyDisease is available in English, Spanish and Hindi. In-consult live translation works across all three.</p>
      </div>
    </React.Fragment>
  );
}

function ScreenPrivacy({ nav }) {
  const [s, setS] = useState({ bio: true, anon: true, location: true, analytics: false });
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title="Privacy & data" />
      <div className="scroll" style={{ padding: '14px 16px 16px' }}>
        <MBanner tone="success" title="End-to-end encrypted">Your vault is encrypted on your device. Not even we can read it without your key.</MBanner>
        <div className="spacer-16" />
        <SectionLabel>Security</SectionLabel>
        <div className="card-soft" style={{ marginBottom: 16 }}>
          <div className="kv" style={{ alignItems: 'center' }}><div><div className="v" style={{ fontSize: 14 }}>Face ID / biometric lock</div><div className="k" style={{ fontSize: 12 }}>Require to open vault</div></div><MSwitch on={s.bio} onChange={v => setS({ ...s, bio: v })} /></div>
          <div className="kv" style={{ alignItems: 'center' }}><div><div className="v" style={{ fontSize: 14 }}>Share location in SOS</div></div><MSwitch on={s.location} onChange={v => setS({ ...s, location: v })} /></div>
          <div className="kv" style={{ alignItems: 'center' }}><div><div className="v" style={{ fontSize: 14 }}>Anonymous research</div><div className="k" style={{ fontSize: 12 }}>Help improve care, never sold</div></div><MSwitch on={s.anon} onChange={v => setS({ ...s, anon: v })} /></div>
          <div className="kv" style={{ alignItems: 'center' }}><div><div className="v" style={{ fontSize: 14 }}>Usage analytics</div></div><MSwitch on={s.analytics} onChange={v => setS({ ...s, analytics: v })} /></div>
        </div>

        <SectionLabel>Your data</SectionLabel>
        <MList style={{ marginBottom: 16 }}>
          <MRow icon="clock-history" iconTone="blue" title="Access log" sub="See who viewed your records" onClick={() => nav.toast('Opening access log', 'clock-history')} />
          <MRow icon="box-arrow-down" iconTone="green" title="Export all data" sub="Download a copy (FHIR / PDF)" onClick={() => nav.toast('Preparing export…', 'box-arrow-down')} />
          <MRow icon="shield-slash-fill" iconTone="amber" title="Revoke all shared access" onClick={() => nav.toast('All shares revoked', 'shield-slash-fill')} />
        </MList>
        <MButton variant="secondary" block icon="trash3" onClick={() => nav.toast('This would delete your account', 'exclamation-triangle-fill')} style={{ color: 'var(--accent-text)', boxShadow: 'inset 0 0 0 1.5px var(--accent)' }}>Delete account</MButton>
      </div>
    </React.Fragment>
  );
}

function ScreenNotifications({ nav }) {
  const [items, setItems] = useState(window.DB.NOTIFS);
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title="Notifications"
        trailing={<button className="m-btn ghost" style={{ minHeight: 'auto', padding: '6px 8px', fontSize: 12.5 }} onClick={() => setItems(items.map(i => ({ ...i, unread: false })))}>Mark all</button>} />
      <div className="scroll" style={{ padding: '8px 16px 16px' }}>
        <MList>
          {items.map(n => (
            <button key={n.id} className="m-list-row" style={{ background: n.unread ? 'var(--accent-soft)' : 'transparent' }}
              onClick={() => { setItems(items.map(i => i.id === n.id ? { ...i, unread: false } : i)); if (n.go) nav.push(...n.go); }}>
              <span className={`ico tone-${n.tone}`}><I name={n.icon} /></span>
              <div className="meta">
                <p className="t">{n.title}</p>
                <p className="s">{n.sub}</p>
                <p className="s" style={{ fontSize: 11, marginTop: 3 }}>{n.when}</p>
              </div>
              {n.unread && <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />}
            </button>
          ))}
        </MList>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { ScreenProfile, ScreenAccount, ScreenFamily, ScreenInsurance, ScreenNotifPrefs, ScreenLanguage, ScreenPrivacy, ScreenNotifications });

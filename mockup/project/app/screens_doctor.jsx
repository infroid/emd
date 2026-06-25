// screens_doctor.jsx — find a doctor, profile, booking + confirm, video call, chat, appointments.

const { useState, useEffect, useRef } = React;

function ScreenDoctors({ nav }) {
  const { DOCTORS, SPECIALTIES } = window.DB;
  const [filter, setFilter] = useState('now');
  const filters = [
    { k: 'now', l: 'Available now', i: 'lightning-charge-fill' },
    { k: 'video', l: 'Video' }, { k: 'person', l: 'In person' }, { k: 'top', l: 'Top rated' },
  ];
  const list = filter === 'now' ? DOCTORS.filter(d => d.online) : filter === 'top' ? [...DOCTORS].sort((a, b) => b.rating - a.rating) : DOCTORS;
  return (
    <React.Fragment>
      <MLargeHead greeting="Consult" title="Find a doctor" trailing={<MIconBtn icon="calendar-check" onClick={() => nav.push('appointments')} />} />
      <div className="scroll" style={{ padding: '8px 16px 16px' }}>
        <MSearch placeholder="Specialty, name, condition" />

        <div className="spacer-16" />
        <SectionLabel>Browse by specialty</SectionLabel>
        <div className="chip-scroll" style={{ marginBottom: 4 }}>
          {SPECIALTIES.map(s => (
            <button key={s.label} className="tap" onClick={() => nav.toast(`${s.label} doctors`, s.icon)} style={{
              flexShrink: 0, width: 76, border: 0, background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
            }}>
              <span className={`ico tone-${s.tone}`} style={{ width: 54, height: 54, borderRadius: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 23 }}><I name={s.icon} /></span>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-2)' }}>{s.label}</span>
            </button>
          ))}
        </div>

        <div className="spacer-12" />
        <div className="chip-scroll">
          {filters.map(f => <MChip key={f.k} active={filter === f.k} icon={f.i} onClick={() => setFilter(f.k)}>{f.l}</MChip>)}
        </div>

        <div className="row-gap" style={{ marginTop: 14 }}>
          {list.map(d => (
            <DocCard key={d.id} initials={d.initials} avatarTone={d.tone} name={d.name} role={`${d.spec} · ${d.exp} exp`}
              rating={`${d.rating} (${d.reviews})`} distance={d.distance} price={d.price} online={d.online}
              onClick={() => nav.push('docProfile', { id: d.id })} />
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

function ScreenDocProfile({ nav, params }) {
  const d = window.DB.DOCTORS.find(x => x.id === params.id) || window.DB.DOCTORS[0];
  const stats = [['star-fill', d.rating, 'Rating'], ['people-fill', d.reviews, 'Patients'], ['briefcase-fill', d.exp, 'Experience'], ['translate', d.langs, 'Speaks']];
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title="Doctor" trailing={<MIconBtn icon="heart" onClick={() => nav.toast('Saved to favourites', 'heart-fill')} />} />
      <div className="scroll" style={{ padding: '8px 16px 16px' }}>
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <Avatar tone={d.tone} size={84} radius={28} style={{ margin: '0 auto' }}>{d.initials}</Avatar>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 21, margin: '12px 0 2px' }}>{d.name}</h2>
          <p style={{ fontSize: 13.5, color: 'var(--fg-muted)', margin: 0 }}>{d.spec} · {d.hospital}</p>
          {d.online && <div style={{ marginTop: 8 }}><MStatus tone="green">Available now</MStatus></div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
          {stats.map(([i, v, l]) => (
            <div key={l} className="card-soft" style={{ padding: '12px 6px', textAlign: 'center' }}>
              <I name={i} style={{ color: 'var(--accent)', fontSize: 15 }} />
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, margin: '4px 0 0', color: 'var(--fg-1)' }}>{v}</div>
              <div style={{ fontSize: 9.5, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{l}</div>
            </div>
          ))}
        </div>

        <SectionLabel>About</SectionLabel>
        <p style={{ fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.55, margin: '0 0 16px' }}>{d.about}</p>

        <SectionLabel>Consultation fee</SectionLabel>
        <MList style={{ marginBottom: 16 }}>
          <MRow icon="camera-video-fill" iconTone="blue" title="Video consult" sub="20 min · notes synced to vault" trailingStrong={d.price} chev={false} />
          <MRow icon="hospital-fill" iconTone="purple" title="In-person visit" sub={d.hospital} trailingStrong={`$${parseInt(d.price.slice(1)) + 25}`} chev={false} />
        </MList>

        <div style={{ display: 'flex', gap: 8 }}>
          <MButton variant="primary" block icon="calendar-plus" onClick={() => nav.push('booking', { id: d.id })}>Book appointment</MButton>
          <MButton variant="secondary" icon="chat-dots-fill" onClick={() => nav.push('chat', { id: d.id })} />
        </div>
      </div>
    </React.Fragment>
  );
}

function ScreenBooking({ nav, params }) {
  const d = window.DB.DOCTORS.find(x => x.id === params.id) || window.DB.DOCTORS[0];
  const [mode, setMode] = useState('Video');
  const [day, setDay] = useState(25);
  const [slot, setSlot] = useState('3:00');
  const days = [{ d: 'Mon', n: 24, free: false }, { d: 'Tue', n: 25, free: true }, { d: 'Wed', n: 26, free: true }, { d: 'Thu', n: 27, free: false }, { d: 'Fri', n: 28, free: true }];
  const slots = ['9:00', '10:30', '11:15', '1:45', '3:00', '4:30', '5:15', '6:00', '7:45'];
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title="Book appointment" trailing={<MIconBtn icon="heart" />} />
      <div className="scroll" style={{ padding: '8px 16px 16px' }}>
        <DocCard initials={d.initials} avatarTone={d.tone} name={d.name} role={`${d.spec} · ${d.hospital}`} rating={`${d.rating} (${d.reviews})`} distance={d.distance} price={d.price} online={d.online} />

        <div style={{ display: 'flex', gap: 8, marginTop: 14, marginBottom: 16 }}>
          {['Video', 'Voice', 'In person', 'Chat'].map(m => <MChip key={m} active={mode === m} onClick={() => setMode(m)}>{m}</MChip>)}
        </div>

        <p className="eyebrow" style={{ margin: '6px 0 10px' }}>May · this week</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {days.map(dd => (
            <button key={dd.n} disabled={!dd.free} className={`m-chip ${day === dd.n ? 'active' : ''}`}
              onClick={() => dd.free && setDay(dd.n)}
              style={{ flexDirection: 'column', gap: 2, padding: '10px 0', opacity: dd.free ? 1 : 0.4, justifyContent: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 600 }}>{dd.d}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800 }}>{dd.n}</span>
            </button>
          ))}
        </div>

        <p className="eyebrow" style={{ margin: '20px 0 10px' }}>Available slots · Tue May {day}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {slots.map(s => <button key={s} className={`m-chip ${slot === s ? 'active' : ''}`} onClick={() => setSlot(s)} style={{ justifyContent: 'center', padding: '11px 0', fontSize: 13 }}>{s}{s.length <= 4 ? ' PM' : ''}</button>)}
        </div>

        <div className="spacer-16" />
        <MBanner tone="success" title="Notes will sync">Visit notes and prescriptions will be added to your vault automatically.</MBanner>
        <div className="spacer-12" />
        <MButton variant="primary" block iconRight="arrow-right" onClick={() => nav.push('bookingDone', { id: d.id, mode, day, slot })}>Confirm · {mode} · {slot} PM</MButton>
      </div>
    </React.Fragment>
  );
}

function ScreenBookingDone({ nav, params }) {
  const d = window.DB.DOCTORS.find(x => x.id === params.id) || window.DB.DOCTORS[0];
  return (
    <div className="scroll" style={{ padding: '40px 22px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(124,58,237,.12)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', animation: 'enterFade .4s ease' }}>
          <I name="calendar-check-fill" style={{ fontSize: 46, color: 'var(--emd-doctor)' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 23, margin: '20px 0 8px' }}>You're booked!</h2>
        <p className="muted" style={{ fontSize: 14, maxWidth: 260, lineHeight: 1.5 }}>
          {params.mode || 'Video'} consult with <strong style={{ color: 'var(--fg-1)' }}>{d.name}</strong> on Tue May {params.day || 25} at {params.slot || '3:00'} PM.
        </p>
        <div className="card-soft" style={{ width: '100%', marginTop: 20, textAlign: 'left' }}>
          <div className="kv"><span className="k">Doctor</span><span className="v">{d.name}</span></div>
          <div className="kv"><span className="k">Mode</span><span className="v">{params.mode || 'Video'}</span></div>
          <div className="kv"><span className="k">When</span><span className="v">Tue May {params.day || 25} · {params.slot || '3:00'} PM</span></div>
          <div className="kv"><span className="k">Fee</span><span className="v">{d.price}</span></div>
        </div>
      </div>
      <div className="stack-10">
        <MButton variant="primary" block icon="calendar-plus" onClick={() => { nav.reset('appointments'); nav.toast('Added to calendar', 'calendar-check-fill'); }}>Add to calendar</MButton>
        <MButton variant="ghost" block onClick={() => nav.reset('home')}>Back to home</MButton>
      </div>
    </div>
  );
}

function ScreenVideoCall({ nav, params }) {
  const d = window.DB.DOCTORS.find(x => x.id === params.id) || window.DB.DOCTORS[0];
  const [secs, setSecs] = useState(744);
  useEffect(() => { const t = setInterval(() => setSecs(s => s + 1), 1000); return () => clearInterval(t); }, []);
  const [mic, setMic] = useState(true), [cam, setCam] = useState(true);
  const mm = Math.floor(secs / 60), ss = String(secs % 60).padStart(2, '0');
  return (
    <div style={{ position: 'relative', flex: 1, background: '#0e0d12', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, background: `radial-gradient(circle at 50% 35%, ${d.tone === 'blue' ? 'rgba(59,130,246,.4)' : 'rgba(168,85,247,.35)'}, transparent 55%), linear-gradient(180deg, #2c1a4d, #0e0d12)`, position: 'relative' }}>
        <Avatar tone={d.tone} size={140} radius={70} style={{ position: 'absolute', top: '32%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 50, boxShadow: '0 12px 40px rgba(0,0,0,.5)' }}>{d.initials}</Avatar>

        <div style={{ position: 'absolute', top: 60, left: 16, right: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ padding: '6px 11px', borderRadius: 99, background: 'rgba(255,255,255,.14)', backdropFilter: 'blur(10px)', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: '#22c55e' }} /> {mm}:{ss}
          </div>
          <div style={{ padding: '6px 11px', borderRadius: 99, background: 'rgba(255,255,255,.14)', backdropFilter: 'blur(10px)', fontSize: 11, fontWeight: 600 }}><I name="translate" /> EN ↔ HI</div>
        </div>

        <div style={{ position: 'absolute', top: 112, right: 16, width: 80, height: 110, borderRadius: 14, background: cam ? 'linear-gradient(135deg, #475569, #1e293b)' : '#15131a', border: '2px solid rgba(255,255,255,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
          {cam ? 'JP' : <I name="camera-video-off-fill" style={{ fontSize: 18, opacity: .7 }} />}
        </div>

        <div style={{ position: 'absolute', bottom: 130, left: 16, right: 16, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, margin: 0 }}>{d.name}</h2>
          <p style={{ fontSize: 12, opacity: .7, margin: '4px 0 0' }}>{d.spec} consult · Notes recording</p>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,.08)', backdropFilter: 'blur(20px)', padding: '18px 20px 38px', display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
        <CallBtn icon={mic ? 'mic-fill' : 'mic-mute-fill'} on={mic} onClick={() => setMic(!mic)} />
        <CallBtn icon={cam ? 'camera-video-fill' : 'camera-video-off-fill'} on={cam} onClick={() => setCam(!cam)} />
        <CallBtn icon="chat-square-text-fill" onClick={() => nav.push('chat', { id: d.id })} />
        <button onClick={() => { nav.pop(); nav.toast('Call ended · notes saved to vault', 'check-circle-fill'); }} style={{ width: 60, height: 60, borderRadius: '50%', border: 0, color: '#fff', background: '#dc2626', cursor: 'pointer', fontSize: 22, boxShadow: '0 8px 24px rgba(220,38,38,.45)' }}>
          <I name="telephone-x-fill" />
        </button>
      </div>
    </div>
  );
}
function CallBtn({ icon, on = true, onClick }) {
  return <button onClick={onClick} style={{ width: 48, height: 48, borderRadius: '50%', border: 0, color: on ? '#fff' : '#0e0d12', background: on ? 'rgba(255,255,255,.14)' : '#fff', cursor: 'pointer', fontSize: 18 }}><I name={icon} /></button>;
}

function ScreenChat({ nav, params }) {
  const d = window.DB.DOCTORS.find(x => x.id === params.id) || window.DB.DOCTORS[0];
  const [msgs, setMsgs] = useState([
    { me: false, t: `Hi Jordan, I reviewed your lipid panel. Overall it looks good.`, time: '10:02' },
    { me: true, t: 'Thanks doctor! I was worried about the triglycerides.', time: '10:03' },
    { me: false, t: `They're only slightly above range — nothing alarming. Let's adjust your diet before considering medication.`, time: '10:04' },
    { me: true, t: 'Sounds good. Should I book a follow-up?', time: '10:05' },
  ]);
  const [draft, setDraft] = useState('');
  const scRef = useRef(null);
  useEffect(() => { if (scRef.current) scRef.current.scrollTop = scRef.current.scrollHeight; }, [msgs]);
  const send = () => {
    if (!draft.trim()) return;
    setMsgs(m => [...m, { me: true, t: draft.trim(), time: '10:06' }]);
    setDraft('');
    setTimeout(() => setMsgs(m => [...m, { me: false, t: 'Yes — book a video follow-up next week and we\u2019ll check progress.', time: '10:06' }]), 900);
  };
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />}
        title={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar tone={d.tone} size={28} radius={9} style={{ fontSize: 11 }}>{d.initials}</Avatar>{d.name.replace('Dr. ', 'Dr ')}</span>}
        trailing={<MIconBtn icon="camera-video-fill" onClick={() => nav.push('video', { id: d.id })} />} />
      <div className="scroll chat-scroll" ref={scRef} style={{ background: 'var(--bg-2)' }}>
        <div className="chat-day">Today</div>
        {msgs.map((m, i) => (
          <div key={i} className={`bubble ${m.me ? 'me' : 'them'}`}>{m.t}<span className="time">{m.time}</span></div>
        ))}
      </div>
      <div className="chat-bar">
        <MIconBtn icon="plus" />
        <input placeholder="Message…" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
        <MIconBtn icon="send-fill" variant="solid" onClick={send} />
      </div>
    </React.Fragment>
  );
}

function ScreenAppointments({ nav }) {
  const { APPTS } = window.DB;
  const [tab, setTab] = useState('upcoming');
  const list = APPTS.filter(a => a.status === tab);
  return (
    <React.Fragment>
      <MLargeHead greeting="Consult" title="Appointments" trailing={<MIconBtn icon="plus-lg" onClick={() => nav.push('doctors')} />} />
      <div className="scroll" style={{ padding: '8px 16px 16px' }}>
        <MSeg options={[{ value: 'upcoming', label: 'Upcoming' }, { value: 'past', label: 'Past' }]} value={tab} onChange={setTab} />
        <div className="spacer-16" />
        <div className="stack-12">
          {list.map(a => (
            <div key={a.id} className="card-soft">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Avatar tone={a.tone} size={46} radius={15}>{a.initials}</Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, margin: 0, color: 'var(--fg-1)' }}>{a.doc}</p>
                  <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', margin: '2px 0 0' }}>{a.spec}</p>
                </div>
                <MStatus tone={a.mode === 'Video' ? 'blue' : 'purple'} dot={false}><I name={a.mode === 'Video' ? 'camera-video-fill' : 'hospital-fill'} />{a.mode}</MStatus>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '12px 0 0', padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 12 }}>
                <I name="calendar-event" style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>{a.when}</span>
                <span style={{ color: 'var(--fg-muted)' }}>·</span>
                <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>{a.time}</span>
              </div>
              {tab === 'upcoming' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  {a.mode === 'Video'
                    ? <MButton variant="primary" block icon="camera-video-fill" onClick={() => nav.push('video', { id: 'rao' })}>Join call</MButton>
                    : <MButton variant="primary" block icon="geo-alt-fill" onClick={() => nav.toast('Directions to ' + a.doc, 'geo-alt-fill')}>Directions</MButton>}
                  <MButton variant="secondary" icon="chat-dots-fill" onClick={() => nav.push('chat', { id: 'rao' })} />
                </div>
              )}
              {tab === 'past' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <MButton variant="secondary" block icon="file-earmark-text" onClick={() => nav.push('labDetail', { id: 'lipid' })}>Visit summary</MButton>
                  <MButton variant="secondary" block icon="arrow-repeat" onClick={() => nav.push('booking', { id: 'rao' })}>Rebook</MButton>
                </div>
              )}
            </div>
          ))}
          {list.length === 0 && <p className="muted center" style={{ padding: 30 }}>No {tab} appointments.</p>}
        </div>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { ScreenDoctors, ScreenDocProfile, ScreenBooking, ScreenBookingDone, ScreenVideoCall, ScreenChat, ScreenAppointments });

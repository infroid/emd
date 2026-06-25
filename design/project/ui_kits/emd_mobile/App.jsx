// App.jsx — EMD Mobile UI Kit gallery page
const { useState } = React;

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="page" data-screen-label="EMD Mobile UI Kit">
      {/* ───────── Page header ───────── */}
      <header className="page-header">
        <div className="title-block">
          <p className="eyebrow">EMD · Mobile & responsive</p>
          <h1>EaseMyDisease, <em>in your pocket</em></h1>
          <p>The mobile / PWA half of the EMD design system: phone screen mockups for the four product surfaces, plus the atomic components that compose them — bottom tab bar, list rows, banners, sheets, and the signature SOS button.</p>
        </div>
        <div className="actions">
          <a href="../emd_web/index.html" className="m-btn secondary"><i className="bi bi-display" />Web UI kit</a>
          <a href="../../preview/buttons.html" className="m-btn ghost">Design system</a>
        </div>
      </header>

      {/* ───────── Section 1: Core surfaces — home screens of each tab ───────── */}
      <section className="section" style={{ marginTop: 32 }}>
        <div className="section-head">
          <div>
            <span className="num">01 · Surfaces</span>
            <h2>The four tabs</h2>
          </div>
          <p className="lede">Each product surface has its own home. The bottom tab bar persists across all of them, with SOS raised in the center as the always-reachable emergency action.</p>
        </div>
        <div className="phone-row">
          <PhoneCard label="Tab · SOS" title="SOS Home" sub="The signature red dome. Hold-to-dispatch with location + medical profile pre-attached.">
            <Phone hasTabs>
              <ScreenSosHome />
              <TabBar active="sos" onTab={setActiveTab} />
            </Phone>
          </PhoneCard>

          <PhoneCard label="Tab · Records" title="Health Vault" sub="247 records, indexed and searchable. Stats up top, categories below, recent activity at the bottom.">
            <Phone hasTabs>
              <ScreenEhr />
              <TabBar active="records" onTab={setActiveTab} />
            </Phone>
          </PhoneCard>

          <PhoneCard label="Tab · Doctors" title="Find a Doctor" sub="Filter chips, doctor cards with avatar + role + rating + price. Available-now chip pre-selected.">
            <Phone hasTabs>
              <ScreenDoctors />
              <TabBar active="doctors" onTab={setActiveTab} />
            </Phone>
          </PhoneCard>

          <PhoneCard label="Tab · You" title="Profile" sub="Identity, account, family vaults, language, privacy. The hub for everything that's not a primary surface.">
            <Phone hasTabs>
              <ScreenProfile />
              <TabBar active="profile" onTab={setActiveTab} />
            </Phone>
          </PhoneCard>
        </div>
      </section>

      {/* ───────── Section 2: Flows ───────── */}
      <section className="section">
        <div className="section-head">
          <div>
            <span className="num">02 · Flows</span>
            <h2>Scenarios</h2>
          </div>
          <p className="lede">Onboarding, an active emergency, drill-in details, a booking flow, and a video consult. The motion through the product.</p>
        </div>
        <div className="phone-row">
          <PhoneCard label="01 · Auth" title="Onboarding" sub="The first screen anyone sees. Brand mark, calm-urgency headline, three value bullets, two CTAs.">
            <Phone>
              <ScreenOnboarding />
            </Phone>
          </PhoneCard>

          <PhoneCard label="02 · Auth" title="OTP verify" sub="One-time code, expiry timer, resend, info banner explaining why we ask.">
            <Phone>
              <ScreenOtp />
            </Phone>
          </PhoneCard>

          <PhoneCard label="03 · SOS" title="Emergency active" sub="Red hero band, ETA, mini map, dispatch details, cancel CTA. The most important screen in the product.">
            <Phone hasTabs>
              <ScreenSosActive />
              <TabBar active="sos" onTab={setActiveTab} />
            </Phone>
          </PhoneCard>

          <PhoneCard label="04 · EHR" title="Record detail" sub="A single lab result. Status pill in the header, values as a list with normal/borderline tags, share-to-doctor primary CTA.">
            <Phone hasTabs>
              <ScreenEhrDetail />
              <TabBar active="records" onTab={setActiveTab} />
            </Phone>
          </PhoneCard>

          <PhoneCard label="05 · Consult" title="Book appointment" sub="Doctor card, channel chips, week strip, slot grid. Confirm CTA carries the slot label.">
            <Phone hasTabs>
              <ScreenBooking />
              <TabBar active="doctors" onTab={setActiveTab} />
            </Phone>
          </PhoneCard>

          <PhoneCard label="06 · Consult" title="In-call" sub="Full-bleed doctor video, self preview, translation chip, recording badge. Red end-call is the only big button.">
            <Phone>
              <ScreenVideoCall />
            </Phone>
          </PhoneCard>

          <PhoneCard label="07 · Hand-off" title="Bottom sheet" sub="Diet & nutrition hands off to partner MFC. Sheet over scrim; primary CTA opens the partner app.">
            <Phone hasTabs>
              <ScreenSheetDemo />
              <TabBar active="profile" onTab={setActiveTab} />
            </Phone>
          </PhoneCard>
        </div>
      </section>

      {/* ───────── Section 3: Component gallery ───────── */}
      <section className="section">
        <div className="section-head">
          <div>
            <span className="num">03 · Atoms</span>
            <h2>Components</h2>
          </div>
          <p className="lede">Every block that makes up the screens above. Each card shows the component in isolation with a touch-friendly hit area.</p>
        </div>

        <div className="comp-grid">
          {/* Headers */}
          <div className="comp-card span-2">
            <div className="head"><h4>Mobile headers</h4><span className="tag">.m-header / .m-largehead</span></div>
            <div className="body" style={{ gap: 14, padding: 0 }}>
              <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border-1)' }}>
                <MHeader leading={<MIconBtn icon="chevron-left" />} title="Lipid Panel" trailing={<MIconBtn icon="share" />} />
              </div>
              <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border-1)' }}>
                <MLargeHead greeting="Vault · Jordan Patel" title="Health Records" trailing={<MIconBtn icon="share" />} />
              </div>
              <div style={{ background: 'linear-gradient(180deg, #ef4444, #b91c1c)', color: '#fff' }}>
                <MHeader variant="transparent"
                  leading={<button className="m-iconbtn ghost" style={{ color: '#fff' }}><i className="bi bi-chevron-left" /></button>}
                  title="Emergency in progress"
                  trailing={<button className="m-iconbtn ghost" style={{ color: '#fff' }}><i className="bi bi-three-dots" /></button>}
                />
              </div>
            </div>
          </div>

          {/* Bottom tab bar */}
          <div className="comp-card span-2">
            <div className="head"><h4>Bottom tab bar</h4><span className="tag">.tabbar · SOS raised</span></div>
            <div className="body center" style={{ background: 'var(--bg-2)', padding: '40px 24px 16px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: 360, height: 76 }}>
                <TabBar active={activeTab} onTab={setActiveTab} />
              </div>
              <p style={{ fontSize: 12, color: 'var(--fg-muted)', margin: '12px 0 0', textAlign: 'center' }}>
                Tap a tab to test the active state. SOS pulses always.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="comp-card">
            <div className="head"><h4>Buttons</h4><span className="tag">.m-btn · 48px tap</span></div>
            <div className="body row">
              <MButton variant="primary">Confirm</MButton>
              <MButton variant="secondary">Skip</MButton>
              <MButton variant="tonal" icon="share">Share</MButton>
              <MButton variant="ghost">Cancel</MButton>
              <MButton variant="primary" icon="lightning-charge-fill" iconRight="arrow-right" block>Get Protected Now</MButton>
            </div>
          </div>

          {/* Chips */}
          <div className="comp-card">
            <div className="head"><h4>Chips & filters</h4><span className="tag">.m-chip</span></div>
            <div className="body row">
              <MChip active icon="lightning-charge-fill">Available now</MChip>
              <MChip>Video</MChip>
              <MChip>In person</MChip>
              <MChip>Top rated</MChip>
              <MChip tonal icon="shield-fill-check">HIPAA</MChip>
            </div>
          </div>

          {/* Status pills */}
          <div className="comp-card">
            <div className="head"><h4>Status pills</h4><span className="tag">.m-status</span></div>
            <div className="body row">
              <MStatus tone="green">Online</MStatus>
              <MStatus tone="red">Dispatching</MStatus>
              <MStatus tone="amber">Pending</MStatus>
              <MStatus tone="blue">Synced</MStatus>
              <MStatus tone="purple">Booked</MStatus>
              <MStatus tone="gray" dot={false}>Draft</MStatus>
            </div>
          </div>

          {/* Search */}
          <div className="comp-card">
            <div className="head"><h4>Search</h4><span className="tag">.m-search</span></div>
            <div className="body">
              <MSearch placeholder="Records, prescriptions, doctors" />
            </div>
          </div>

          {/* List rows */}
          <div className="comp-card span-2">
            <div className="head"><h4>List rows</h4><span className="tag">.m-list · .m-list-row</span></div>
            <div className="body">
              <MList>
                <MRow icon="geo-alt-fill" iconTone="red"   title="Location sharing"  sub="On · 415 Mission St" trailing="6 m ago" chev={false} />
                <MRow icon="capsule"      iconTone="purple" title="Prescriptions"     sub="12 records · 2 active" />
                <MRow icon="upload"       iconTone="green"  title="Lipid panel uploaded" sub="Mercy General · today" trailing="OCR'd" chev={false} />
                <MRow icon="people-fill"  iconTone="blue"   title="Emergency contacts" sub="3 contacts will be notified" trailing="3" />
              </MList>
            </div>
          </div>

          {/* Form fields */}
          <div className="comp-card">
            <div className="head"><h4>Form fields</h4><span className="tag">.m-field</span></div>
            <div className="body">
              <MField label="Phone number" placeholder="+1 (415) 555-0142" type="tel" />
              <MField label="Date of birth" placeholder="MM / DD / YYYY" help="Helps doctors verify your records" />
              <MField label="Insurance ID" placeholder="" error="That ID isn't in our directory" value="X-22-991" />
            </div>
          </div>

          {/* OTP */}
          <div className="comp-card">
            <div className="head"><h4>OTP input</h4><span className="tag">.m-otp</span></div>
            <div className="body center">
              <MOtp value="4 2 7" />
              <p style={{ fontSize: 12, color: 'var(--fg-muted)', margin: '14px 0 0' }}>Code expires in 0:23</p>
            </div>
          </div>

          {/* Banners */}
          <div className="comp-card span-2">
            <div className="head"><h4>Banners</h4><span className="tag">.m-banner · info / warn / error / success</span></div>
            <div className="body">
              <MBanner tone="info" title="Why a code?">Your vault is locked to your phone. We verify every new device once.</MBanner>
              <MBanner tone="warn" title="One value to watch">Your triglycerides are slightly elevated. Diet adjustments usually move this back into range.</MBanner>
              <MBanner tone="error" title="Couldn't reach dispatcher">Your call dropped. Tap to retry — your location is still being shared.</MBanner>
              <MBanner tone="success" title="Records imported">12 records from Mercy General were added to your vault.</MBanner>
            </div>
          </div>

          {/* Toast */}
          <div className="comp-card">
            <div className="head"><h4>Toast</h4><span className="tag">.m-toast · slide from top</span></div>
            <div className="body center">
              <MToast>Shared with Dr. Rao — expires in 7 days</MToast>
            </div>
          </div>

          {/* Stat tiles */}
          <div className="comp-card">
            <div className="head"><h4>Stat tiles</h4><span className="tag">.stat-tile</span></div>
            <div className="body">
              <div className="stat-grid">
                <StatTile icon="heart-pulse-fill" label="Resting HR"   value="68" unit="bpm" trend="-3 vs last wk" trendDir="down" />
                <StatTile icon="droplet-fill"     label="Glucose"      value="112" unit="mg/dL" trend="In range" trendDir="up" />
                <StatTile icon="capsule"           label="Adherence"   value="94" unit="%" trend="+2" trendDir="up" />
                <StatTile icon="moon-stars-fill"   label="Sleep avg"   value="6.8" unit="h" trend="-0.3" trendDir="down" />
              </div>
            </div>
          </div>

          {/* Doctor card */}
          <div className="comp-card">
            <div className="head"><h4>Doctor card</h4><span className="tag">.doc-card</span></div>
            <div className="body">
              <DocCard initials="AR" avatarTone="blue" name="Dr. Amita Rao" role="Cardiologist · 14 yr exp" rating="4.9 (412)" distance="2.1 mi" price="$45" online />
              <DocCard initials="MR" avatarTone="purple" name="Dr. Marcus Rivera" role="General Physician · 8 yr exp" rating="4.8 (1.2k)" distance="0.8 mi" price="$30" />
            </div>
          </div>

          {/* SOS button */}
          <div className="comp-card">
            <div className="head"><h4>SOS button</h4><span className="tag">.sos-big · signature</span></div>
            <div className="body center" style={{ paddingTop: 36, paddingBottom: 24 }}>
              <SosBig />
            </div>
          </div>

          {/* FAB */}
          <div className="comp-card">
            <div className="head"><h4>FAB</h4><span className="tag">.m-fab</span></div>
            <div className="body center" style={{ position: 'relative', minHeight: 180 }}>
              <div style={{ position: 'relative', width: 200, height: 140, background: 'var(--bg-1)', border: '1px dashed var(--border-1)', borderRadius: 18 }}>
                <button className="m-fab" style={{ position: 'absolute', right: 12, bottom: 12 }}><i className="bi bi-plus-lg" /></button>
              </div>
              <p style={{ fontSize: 12, color: 'var(--fg-muted)', margin: '10px 0 0' }}>Pinned bottom-right · 16px from edge</p>
            </div>
          </div>

          {/* Icon buttons */}
          <div className="comp-card">
            <div className="head"><h4>Icon buttons</h4><span className="tag">.m-iconbtn</span></div>
            <div className="body row">
              <MIconBtn icon="chevron-left" />
              <MIconBtn icon="search" />
              <MIconBtn icon="bell" />
              <MIconBtn icon="gear" />
              <MIconBtn icon="share" />
              <MIconBtn icon="heart-pulse-fill" variant="solid" />
            </div>
          </div>

          {/* Bottom sheet preview (static, mini) */}
          <div className="comp-card span-2">
            <div className="head"><h4>Bottom sheet</h4><span className="tag">.sheet · 28px radius, drag handle</span></div>
            <div className="body" style={{ padding: 0, background: 'var(--bg-2)' }}>
              <div style={{
                position: 'relative', height: 280, borderRadius: 20, margin: 16, overflow: 'hidden',
                background: 'linear-gradient(180deg, var(--bg-3), var(--bg-2))',
              }}>
                <div style={{ padding: 16, opacity: 0.4 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)', margin: 0 }}>Diet</p>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, margin: '4px 0 12px' }}>Nutrition</h3>
                </div>
                <div className="sheet-scrim" style={{ borderRadius: 20 }} />
                <div className="sheet" style={{ borderRadius: '24px 24px 20px 20px' }}>
                  <div className="handle" />
                  <h3>Hand off to MyFoodCraving?</h3>
                  <p>Diet & nutrition lives in our partner app. We'll pass your conditions and meds so meal plans match.</p>
                  <MButton variant="primary" block iconRight="box-arrow-up-right">Open MyFoodCraving</MButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Section 4: Responsive notes ───────── */}
      <section className="section">
        <div className="section-head">
          <div>
            <span className="num">04 · Responsive</span>
            <h2>Mobile-first, but it scales</h2>
          </div>
          <p className="lede">EMD ships as a PWA — same HTML, same Bootstrap layer. The mobile chrome below collapses cleanly into the desktop kit's web header above the 768px breakpoint.</p>
        </div>

        <div className="responsive-pair">
          <Phone hasTabs>
            <ScreenSosHome />
            <TabBar active="sos" onTab={setActiveTab} />
          </Phone>
          <div className="info">
            <h3>Breakpoints &amp; structural rules</h3>
            <p>
              The mobile UI kit is built for ≤ 768px (Bootstrap's <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-3)', padding: '1px 6px', borderRadius: 4, fontSize: '0.9em' }}>md</code>). Above that breakpoint the tab bar swaps for the desktop header, the SOS button shrinks to the floating Emergency FAB, and content widens to the standard 1200px container.
            </p>
            <ul>
              <li><i className="bi bi-check-circle-fill" /><span><strong>≤ 768px</strong> — bottom tab bar + 16px gutters + 20px card radius + 48px min hit target</span></li>
              <li><i className="bi bi-check-circle-fill" /><span><strong>769 – 1199px</strong> — desktop header surfaces; cards bump to 24px radius; bottom FAB takes over emergency entry</span></li>
              <li><i className="bi bi-check-circle-fill" /><span><strong>≥ 1200px</strong> — 1200px max-width container; feature grids go 3-column; phone mockups appear as hero visuals only</span></li>
              <li><i className="bi bi-check-circle-fill" /><span>All tokens (color, type scale, spacing, radii) are <em>shared</em> across both kits — there is one source of truth at <code style={{ fontFamily: 'var(--font-mono)' }}>colors_and_type.css</code></span></li>
              <li><i className="bi bi-check-circle-fill" /><span>Dark theme parity is mandatory — every component above renders in dark via <code style={{ fontFamily: 'var(--font-mono)' }}>data-bs-theme="dark"</code></span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* ───────── Section 5: Dark mode preview ───────── */}
      <section className="section">
        <div className="section-head">
          <div>
            <span className="num">05 · Dark</span>
            <h2>Dark mode parity</h2>
          </div>
          <p className="lede">EMD's dark is keyed to the brand illustration — warm cream-on-brown, never cold blue-black. The red accent stays warm too.</p>
        </div>
        <div className="phone-row" data-bs-theme="dark" style={{ background: '#18150f', borderRadius: 28, padding: 32, margin: '0 -8px' }}>
          <PhoneCard label="Dark · SOS" title="SOS Home" sub="Warm brown chrome lets the red stay urgent without being harsh.">
            <div data-bs-theme="dark">
              <Phone hasTabs dark>
                <ScreenSosHome />
                <TabBar active="sos" onTab={setActiveTab} />
              </Phone>
            </div>
          </PhoneCard>
          <PhoneCard label="Dark · Records" title="Health Vault" sub="Same 20px cards, same density — every token has a dark pair.">
            <div data-bs-theme="dark">
              <Phone hasTabs dark>
                <ScreenEhr />
                <TabBar active="records" onTab={setActiveTab} />
              </Phone>
            </div>
          </PhoneCard>
          <PhoneCard label="Dark · Profile" title="You" sub="Avatars and status pills keep their tones; backgrounds shift warm.">
            <div data-bs-theme="dark">
              <Phone hasTabs dark>
                <ScreenProfile />
                <TabBar active="profile" onTab={setActiveTab} />
              </Phone>
            </div>
          </PhoneCard>
        </div>
      </section>
    </div>
  );
}

window.App = App;

// DietView.jsx — Diet & Nutrition surface, designed in the MyFoodCraving aesthetic.
// Self-contained scoped styles so the MFC vocabulary doesn't bleed into the rest of the EMD app.
const { useState: useDvState } = React;

const MFC_CRAVING_CHIPS = [
  { id: 'pasta', label: 'pasta' },
  { id: 'bowl',  label: 'something fresh' },
  { id: 'spicy', label: 'spicy' },
  { id: 'sweet', label: 'sweet' },
  { id: 'cozy',  label: 'cozy' },
  { id: 'light', label: 'light' },
];

const MFC_LIES = [
  { num: '01', text: <>Calorie counting <s>tracked your food</s>, but it never knew you were <b>iron-deficient</b>.</> },
  { num: '02', text: <>Generic meal plans gave 47 million people <b>the same</b> 1,800-cal salad.</> },
  { num: '03', text: <>Recipe apps showed you the dish but <b>never how to cook it</b> when you've never held a chef's knife.</> },
  { num: '04', text: <>Cravings got framed as the enemy. They're <b>your body talking</b>. We translate.</> },
];

const MFC_TARGETS = [
  { label: 'Iron',   pct: 84, color: 'berry',  v: '4.2mg' },
  { label: 'B12',    pct: 76, color: 'matcha', v: '3.1µg' },
  { label: 'Fiber',  pct: 72, color: 'butter', v: '12g' },
  { label: 'Sodium', pct: 72, color: 'orange', v: '380mg', inverted: true },
];

const MFC_STEPS = [
  { id: 1, title: 'Prep & rinse',       detail: 'Rinse 1 cup quinoa under cold water until it runs clear. Drain well — this kills the bitter coating.' },
  { id: 2, title: 'Dice the crew',      detail: 'Cucumber, cherry tomatoes, red onion — small dice, roughly the size of the quinoa.' },
  { id: 3, title: 'Simmer the grain',   detail: 'Bring 2 cups water to a boil. Add quinoa, cover, reduce to low. Simmer 15 min until water is gone.' },
  { id: 4, title: 'Whisk the dressing', detail: 'Tahini, lemon juice, olive oil, garlic, salt. Whisk until creamy — add water if too thick.' },
  { id: 5, title: 'Toss & taste',       detail: 'Combine fluffed quinoa with veg, dressing, parsley, and a handful of crumbled feta. Adjust salt.' },
];

const MFC_INGREDIENTS = [
  { name: 'Quinoa',          amt: '1 cup',    checked: true },
  { name: 'Cucumber',        amt: '1 small',  checked: true },
  { name: 'Cherry tomatoes', amt: '1.5 cups', checked: true },
  { name: 'Red onion',       amt: '½ small',  checked: false },
  { name: 'Tahini',          amt: '3 tbsp',   checked: false },
  { name: 'Lemon',           amt: '1 large',  checked: false },
  { name: 'Feta',            amt: '⅓ cup',    checked: false },
  { name: 'Parsley',         amt: '1 bunch',  checked: false },
];

function MfcRing({ pct, color, label, v, inverted }) {
  const r = 26, circ = 2 * Math.PI * r;
  const shown = inverted ? Math.max(0, 100 - pct) : pct;
  const off = circ * (1 - Math.min(100, shown) / 100);
  return (
    <div className="mfc-ring-cell">
      <svg className="mfc-ring-svg" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" className="mfc-ring-track" />
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6"
                className={`mfc-ring-fill ${color}`}
                strokeDasharray={circ} strokeDashoffset={off} />
      </svg>
      <div className="mfc-ring-v">{v}</div>
      <div className="mfc-ring-lbl">{label}</div>
    </div>
  );
}

function DietView() {
  const [chip, setChip]    = useDvState('bowl');
  const [stepIdx, setStep] = useDvState(1);

  return (
    <div className="mfc-scope">

      {/* HERO */}
      <section className="mfc-hero">
        <div className="mfc-wrap">
          <div className="mfc-hero-grid">
            <div>
              <div className="mfc-eyebrow-row">
                <span className="mfc-eyebrow"><span className="mfc-dot" />personalized · guided · delicious</span>
                <span className="mfc-scribble">for real bodies ✦</span>
              </div>
              <h1 className="mfc-h1">
                Eat what your body's<br />
                <em>actually craving<svg className="mfc-underline" viewBox="0 0 240 14" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 8 Q 60 2 120 7 T 238 6" stroke="#FF6D2E" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg></em>.
              </h1>
              <p className="mfc-sub">We read your health, fix the gaps, and guide your cooking.</p>

              <div className="mfc-craving">
                <div className="mfc-craving-row">
                  <input className="mfc-craving-input" placeholder="something with pasta, but make it healthy…" />
                  <button className="mfc-craving-go" aria-label="Find meals">→</button>
                </div>
                <div className="mfc-chips">
                  {MFC_CRAVING_CHIPS.map(c => (
                    <button key={c.id}
                            className={`mfc-chip ${chip === c.id ? 'active' : ''}`}
                            onClick={() => setChip(c.id)}>{c.label}</button>
                  ))}
                </div>
              </div>

              <div className="mfc-mini">
                <span>✓ <b>12k+</b> meals personalized</span>
                <span>✓ syncs with <b>Apple Health</b> + <b>Google Fit</b></span>
              </div>
            </div>

            <div className="mfc-plate-stage">
              <span className="mfc-deco" style={{ top: '-2%', left: '-4%', fontSize: 44 }}>🌿</span>
              <span className="mfc-deco" style={{ top: '10%', right: '-2%', fontSize: 38 }}>🍅</span>
              <span className="mfc-deco" style={{ bottom: '8%', right: '-4%', fontSize: 40 }}>🍋</span>

              <div className="mfc-plate">
                <image-slot id="diet-hero-plate" placeholder="drop a dish photo"></image-slot>
              </div>

              <div className="mfc-sticker mfc-sticker-1">
                <span className="mfc-sticker-dot orange"></span>
                <div>
                  <div className="mfc-sticker-tag">Lunch · suggested</div>
                  <div className="mfc-sticker-name">Mediterranean Quinoa Bowl</div>
                </div>
              </div>
              <div className="mfc-sticker mfc-sticker-2"><span className="mfc-sticker-dot matcha" /><span>+47% iron</span></div>
              <div className="mfc-sticker mfc-sticker-3"><span className="mfc-sticker-dot orange" /><span>ready in 30 min</span></div>

              <div className="mfc-macros">
                <div className="m"><div className="v">480</div><div className="u">kcal</div></div>
                <div className="m"><div className="v">32g</div><div className="u">protein</div></div>
                <div className="m"><div className="v">48g</div><div className="u">carbs</div></div>
                <div className="m"><div className="v">18g</div><div className="u">fat</div></div>
              </div>
              <div className="mfc-arrow">your body asked for this →</div>
            </div>
          </div>
        </div>

        <div className="mfc-marquee" aria-hidden="true">
          <div className="mfc-marquee-track">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="mfc-marquee-item">read your blood work</span>
                <span className="mfc-marquee-item">cook with confidence</span>
                <span className="mfc-marquee-item">no calorie counting</span>
                <span className="mfc-marquee-item">close your nutrition gaps</span>
                <span className="mfc-marquee-item">pasta is back on the menu</span>
                <span className="mfc-marquee-item">crave smarter, not less</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="mfc-manifesto">
        <div className="mfc-wrap">
          <div className="mfc-manifesto-grid">
            <div>
              <span className="mfc-eyebrow inverse"><span className="mfc-dot" /> the problem</span>
              <h2 className="mfc-h2">
                Diets <span className="mfc-strike">lied</span> to you.<br />
                Recipe apps <em>guessed</em>.<br />
                Your body deserved better.
              </h2>
            </div>
            <div>
              <div className="mfc-lies">
                {MFC_LIES.map(l => (
                  <div className="mfc-lie" key={l.num}>
                    <span className="mfc-lie-num">{l.num}</span>
                    <p className="mfc-lie-text">{l.text}</p>
                  </div>
                ))}
              </div>
              <blockquote className="mfc-quote">
                "Three apps gave me the same plan. None of them knew my B12 was tanked. MFC figured it out in five minutes."
                <div className="mfc-quote-attrib">— Priya, design lead, six months on MFC</div>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* PERSONALIZE */}
      <section className="mfc-personalize">
        <div className="mfc-wrap">
          <div className="mfc-personalize-head">
            <h2 className="mfc-h2">Built around<br /><em>your blood work</em>.</h2>
            <p className="mfc-lede">Plug in your last lab report. We close the gaps, dish by dish — without ever asking you to count a calorie.</p>
          </div>
          <div className="mfc-personalize-grid">
            <div className="mfc-metric-stack">
              {[
                { name: 'Iron',         sub: 'Below range',  val: '9.2 g/dL',  active: true },
                { name: 'B12',          sub: 'Within range', val: '412 pg/mL', active: true },
                { name: 'Sodium watch', sub: 'Reduce intake',val: '−15%',      active: true },
                { name: 'Fiber goal',   sub: 'Increase',     val: '+25g',      active: false },
              ].map((m, i) => (
                <div className={`mfc-metric ${m.active ? 'active' : ''}`} key={i}>
                  <div>
                    <div className="name">{m.name}</div>
                    <div className="sub">{m.sub}</div>
                  </div>
                  <div className="val">{m.val}</div>
                  <div className="toggle"></div>
                </div>
              ))}
            </div>

            <div className="mfc-rec">
              <div className="mfc-rec-head">
                <span className="mfc-label-mono orange">Today's recommendation</span>
                <span className="mfc-rec-time">12:40 PM</span>
              </div>
              <div className="mfc-rec-meal">
                <image-slot id="diet-rec-meal" placeholder="meal photo"></image-slot>
                <div>
                  <div className="mfc-rec-name">Mediterranean Quinoa Bowl</div>
                  <div className="mfc-rec-tags">
                    <span className="mfc-rec-tag">+47% iron</span>
                    <span className="mfc-rec-tag">low sodium</span>
                    <span className="mfc-rec-tag orange">B12 boost</span>
                  </div>
                </div>
              </div>
              <div className="mfc-rings">
                {MFC_TARGETS.map((t, i) => <MfcRing key={i} {...t} />)}
              </div>
              <div className="mfc-why">
                <b>Why this dish?</b> Quinoa + spinach close <b>78% of your iron gap</b>; lemon-dressed greens add bioavailability; the salty crunch comes from feta, not soy sauce.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COOKING */}
      <section className="mfc-cooking">
        <div className="mfc-wrap">
          <div className="mfc-personalize-head">
            <h2 className="mfc-h2">Walks you through<br /><em>every step</em>.</h2>
            <p className="mfc-lede">Step-by-step cooking with a built-in timer and ingredient check-off — for the times the recipe instinct hasn't kicked in yet.</p>
          </div>

          <div className="mfc-cook-grid">
            <div className="mfc-cook-board">
              <div className="mfc-progress">
                {MFC_STEPS.map((_, i) => (
                  <div key={i} className={`mfc-pip ${i < stepIdx ? 'done' : i === stepIdx ? 'now' : ''}`}>
                    {i === stepIdx ? <span style={{ '--p': '45%' }}></span> : null}
                  </div>
                ))}
              </div>
              <div className="mfc-step-num">Step {stepIdx + 1} of {MFC_STEPS.length}</div>
              <div className="mfc-step-title">{MFC_STEPS[stepIdx].title}</div>
              <div className="mfc-step-detail">{MFC_STEPS[stepIdx].detail}</div>

              <div className="mfc-timer">
                <div className="mfc-timer-clock">04:13</div>
                <div>
                  <div className="mfc-timer-meta">Step timer</div>
                  <div className="mfc-timer-sub">running · until quinoa absorbs</div>
                </div>
                <div className="mfc-timer-ctrl">
                  <button className="mfc-ctrl" aria-label="Previous" onClick={() => setStep(Math.max(0, stepIdx - 1))}>‹</button>
                  <button className="mfc-ctrl" aria-label="Next"     onClick={() => setStep(Math.min(MFC_STEPS.length - 1, stepIdx + 1))}>›</button>
                </div>
              </div>

              <div className="mfc-tabs">
                {MFC_STEPS.map((s, i) => (
                  <button key={s.id}
                          className={`mfc-tab ${i === stepIdx ? 'active' : i < stepIdx ? 'done' : ''}`}
                          onClick={() => setStep(i)}>
                    {i < stepIdx ? '✓' : ''} {s.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="mfc-ingredients">
              <h4>What you'll need</h4>
              <div className="mfc-ing-list">
                {MFC_INGREDIENTS.map((i, n) => (
                  <div key={n} className={`mfc-ing ${i.checked ? 'checked' : ''}`}>
                    <span className="mfc-ing-check">{i.checked ? '✓' : ''}</span>
                    <span>{i.name}</span>
                    <span className="mfc-ing-amt">{i.amt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mfc-cta-section">
        <div className="mfc-wrap">
          <div className="mfc-cta">
            <h2 className="mfc-cta-h">Stop counting. Start <em>craving smarter</em>.</h2>
            <p className="mfc-cta-sub">Five minutes of setup. A meal plan that knows your body. Cooking instructions that don't assume you went to culinary school.</p>
            <div className="mfc-cta-row">
              <input className="mfc-cta-input" placeholder="your email" />
              <button className="mfc-btn-orange" onClick={() => window.open('https://myfoodcraving.com/', '_blank')}>
                Open MyFoodCraving →
              </button>
            </div>
            <div className="mfc-fineprint">
              Diet & nutrition is powered by our partner · MyFoodCraving · separate sign-up · syncs back to your EMD records
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

window.DietView = DietView;

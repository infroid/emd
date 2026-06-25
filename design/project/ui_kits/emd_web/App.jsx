// App.jsx — top-level shell, view router, theme + lang state
const { useEffect } = React;

// ---------- Content per surface (lifted from production templates) ----------
const SOS_FEATURES = [
  { tone: 'red',    slotId: 'sos-fc-1', slotPlaceholder: 'alarm / siren',  surfaceTag: '01 · sos',     title: 'Instant Response',       description: 'Help dispatched in under 10 minutes, with real-time tracking and automated alerts to your emergency contacts.', benefits: ['Sub-10 minute response', 'Real-time tracking', 'Auto contact alerts'] },
  { tone: 'red',    slotId: 'sos-fc-2', slotPlaceholder: 'shield / lock',  surfaceTag: '01 · sos',     title: 'Medical-Grade Security', description: 'HIPAA-compliant, end-to-end encrypted platform ensuring complete privacy and security of your medical data.',   benefits: ['HIPAA compliant', 'End-to-end encryption', 'Secure data storage'] },
  { tone: 'red',    slotId: 'sos-fc-3', slotPlaceholder: 'doctor / team',  surfaceTag: '01 · sos',     title: 'Certified Medical Team', description: '24/7 access to licensed emergency professionals, directly connected to hospitals and emergency services.',    benefits: ['Licensed professionals', '24/7 availability', 'Hospital connections'] },
  { tone: 'red',    slotId: 'sos-fc-4', slotPlaceholder: 'map pin',        surfaceTag: '01 · sos',     title: 'Smart Location',         description: 'Accurate GPS and indoor mapping technology for rapid, precise assistance wherever you are.',                  benefits: ['GPS precision', 'Indoor mapping', 'Location sharing'] },
  { tone: 'red',    slotId: 'sos-fc-5', slotPlaceholder: 'heart',          surfaceTag: '01 · sos',     title: 'Health Integration',     description: 'Securely connects to your health records and medical history for better, faster emergency care.',             benefits: ['Medical history access', 'Medication alerts', 'Allergy notifications'] },
  { tone: 'red',    slotId: 'sos-fc-6', slotPlaceholder: 'phone',          surfaceTag: '01 · sos',     title: 'Multi-Channel Support',  description: 'Voice, text, and video communication options — get help your way, in any language you prefer.',               benefits: ['Multiple languages', 'Voice & video calls', 'Text messaging'] },
];

const SOS_TESTIMONIALS = [
  { initial: 'S', name: 'Dr. Sarah Chen',      role: 'Emergency Physician', quote: "Response time was incredible. Within 2 minutes, I had medical professionals on the line and an ambulance dispatched." },
  { initial: 'M', name: 'Michael Rodriguez',   role: 'Parent',              quote: "Knowing my family has 24/7 emergency protection gives me incredible peace of mind. The app is intuitive and reliable." },
  { initial: 'E', name: 'Eleanor Thompson',    role: 'Senior Care',         quote: "At 78, living independently was a concern. This service gives my family confidence that help is always available." },
];

const EHR_FEATURES = [
  { tone: 'blue', slotId: 'ehr-fc-1', slotPlaceholder: 'vault / folder',   surfaceTag: '02 · records', title: 'One Secure Vault',     description: 'Every record from every provider, in one HIPAA-compliant timeline.',                                                              benefits: ['Encrypted at rest', 'Provider-neutral', 'Patient-owned'] },
  { tone: 'blue', slotId: 'ehr-fc-2', slotPlaceholder: 'share / link',     surfaceTag: '02 · records', title: 'Share in One Tap',     description: 'Grant any specialist or emergency room access to exactly what they need, for as long as you choose.',                            benefits: ['Granular permissions', 'Auto-expire links', 'Audit trail'] },
  { tone: 'blue', slotId: 'ehr-fc-3', slotPlaceholder: 'chart / graph',    surfaceTag: '02 · records', title: 'Trend Your Health',    description: 'Automatic charts for vitals, labs, and medications — spot patterns before they become problems.',                                 benefits: ['Lab history', 'Medication tracker', 'Vitals dashboard'] },
  { tone: 'blue', slotId: 'ehr-fc-4', slotPlaceholder: 'OCR / scan',       surfaceTag: '02 · records', title: 'Snap & Digitize',      description: 'Photograph any paper record — prescriptions, lab reports, discharge summaries — and we OCR + categorize it instantly.',           benefits: ['Photo OCR', 'Auto-categorize', '30+ languages'] },
  { tone: 'blue', slotId: 'ehr-fc-5', slotPlaceholder: 'family / shield',  surfaceTag: '02 · records', title: 'Family Vaults',        description: 'Manage records for parents, kids, or anyone in your care — separate vaults, shared visibility, role-based access.',               benefits: ['Caregiver mode', 'Pediatric profiles', 'Senior care'] },
  { tone: 'blue', slotId: 'ehr-fc-6', slotPlaceholder: 'cloud sync',       surfaceTag: '02 · records', title: 'Works Everywhere',     description: 'Pulls automatically from hospitals on HL7-FHIR, syncs across phone + web + watch, and works offline when you need it.',             benefits: ['HL7-FHIR ingestion', 'Offline-first', 'Cross-device sync'] },
];

const EHR_TESTIMONIALS = [
  { initial: 'A', name: 'Dr. Amita Rao',     role: 'Cardiologist',          quote: "The first time a patient handed me three years of complete records on the spot, I almost cried. This is the EHR I've wanted my whole career." },
  { initial: 'L', name: 'Lakshmi Iyer',      role: 'Primary caregiver',     quote: "My mother sees four specialists. I used to carry a folder. Now I just unlock the vault for whichever doctor needs it." },
  { initial: 'B', name: 'Ben Schultz',       role: 'Living with diabetes',  quote: "I can finally see my A1c trend across five years on one chart. I caught a slow drift and changed my meds before it became an emergency." },
];

const DOCTOR_FEATURES = [
  { tone: 'purple', slotId: 'doc-fc-1', slotPlaceholder: 'calendar',         surfaceTag: '03 · consult', title: 'Book in 60 Seconds',     description: 'Pick a doctor, pick a time. Real availability, real specialists, no phone tag.',                                            benefits: ['10,000+ specialists', 'Same-day slots', 'Free rescheduling'] },
  { tone: 'purple', slotId: 'doc-fc-2', slotPlaceholder: 'video camera',     surfaceTag: '03 · consult', title: 'Video, Voice, or Chat',  description: 'Consult on the channel that works for you, with the same doctor every time.',                                                benefits: ['HD video', 'Phone fallback', 'Encrypted chat'] },
  { tone: 'purple', slotId: 'doc-fc-3', slotPlaceholder: 'clipboard',        surfaceTag: '03 · consult', title: 'Notes That Travel',      description: 'Every consultation is auto-summarized and added to your EHR — no faxing, no follow-up calls.',                                benefits: ['Auto-summary', 'Prescriptions delivered', 'Synced to records'] },
  { tone: 'purple', slotId: 'doc-fc-4', slotPlaceholder: 'second opinion',   surfaceTag: '03 · consult', title: 'Second Opinions, Fast',  description: 'Get a written second opinion from an independent specialist on any major diagnosis — inside 48 hours, no awkward conversations.', benefits: ['48-hr turnaround', 'Independent panel', 'Specialty matching'] },
  { tone: 'purple', slotId: 'doc-fc-5', slotPlaceholder: 'translator',       surfaceTag: '03 · consult', title: 'Speak Your Language',    description: 'Real-time medical translation across 30+ languages — patient speaks Hindi, doctor speaks English, both understand each other.',  benefits: ['30+ languages', 'Medical terminology', 'Caption mode'] },
  { tone: 'purple', slotId: 'doc-fc-6', slotPlaceholder: 'pill bottle',      surfaceTag: '03 · consult', title: 'Pharmacy In-Loop',       description: 'Prescriptions flow straight to your pharmacy of choice. Refills, allergy checks, generics — handled in the background.',         benefits: ['e-Rx', 'Allergy alerts', 'Generic swaps'] },
];

const DOCTOR_TESTIMONIALS = [
  { initial: 'R', name: 'Dr. Rina Desai',    role: 'Internal Medicine',     quote: "I see twice as many patients in the same day now — the notes write themselves, the records are already on my screen when the call starts." },
  { initial: 'V', name: 'Vikram Joshi',      role: 'Working professional',  quote: "Three months of trying to find time for a dermatology appointment, then I tried this. 4pm slot, 7-minute wait, prescription at my pharmacy by dinner." },
  { initial: 'F', name: 'Fatima Al-Khouri',  role: 'New parent',            quote: "It's 2am, the baby has a rash, I'm panicking. I had a pediatrician on video in three minutes. That's the entire pitch." },
];

// ---------- View renderers ----------
function SosView({ onNav }) {
  return (
    <React.Fragment>
      <Hero
        trust="Trusted by 50,000+ families"
        headline={<>Medical Help, Instantly<br /></>}
        headlineAccent="Just One Tap Away"
        subtitle="Connect to certified emergency responders in seconds. Your location and critical info are shared automatically for the fastest, safest care — anytime, anywhere."
        stats={[
          { value: '<5 min', label: 'Avg. Response' },
          { value: '400+',   label: 'Lives Saved' },
          { value: '100+',   label: 'Cities Covered' },
        ]}
        primaryCta={{ label: 'Get Protected Now', onClick: () => alert('(prototype) Sign up') }}
        secondaryCta={{ label: 'See How It Works', onClick: () => alert('(prototype) Demo') }}
        visual={<PhoneMockup />}
      />

      <section className="emd-section">
        <div className="emd-section-head">
          <h2>Medical Emergency Response</h2>
          <p>Designed with medical experts, the EaseMyDisease SOS system delivers rapid, reliable help when it matters most.</p>
        </div>
        <FeatureGrid features={SOS_FEATURES} />
      </section>

      <Testimonials
        subheading="Real stories from people we've helped in critical moments."
        items={SOS_TESTIMONIALS}
      />

      <CTASection
        title="Protection in 60 Seconds"
        subtitle="Join thousands who trust us for fast, professional emergency care. Sign up in minutes for instant coverage and peace of mind."
        primaryLabel="Start Free Trial"
        secondaryLabel="See How It Works"
        trust={[
          { icon: 'bi-shield-check', label: 'HIPAA Compliant' },
          { icon: 'bi-award',        label: 'ISO 27001 Certified' },
          { icon: 'bi-clock',        label: 'Always On: 24/7 Response' },
        ]}
      />
    </React.Fragment>
  );
}

function EhrView() {
  return (
    <React.Fragment>
      <Hero
        trust="HIPAA-compliant by default"
        headline={<>Your Health Records,<br /></>}
        headlineAccent="One Secure Place"
        subtitle="Every prescription, lab, scan, and visit — encrypted, portable, and yours. Share with a single tap; revoke just as easily."
        stats={[
          { value: '256-bit', label: 'Encryption' },
          { value: '< 1 sec', label: 'Share Speed' },
          { value: '100%',    label: 'Patient-owned' },
        ]}
        primaryCta={{ label: 'Start a Free Vault', onClick: () => {} }}
        secondaryCta={{ label: 'Watch a Demo',     onClick: () => {} }}
        visual={<EhrActivityCard />}
      />

      <section className="emd-section">
        <div className="emd-section-head">
          <h2>Built for the way care actually moves</h2>
          <p>Six jobs your records need to do — handled.</p>
        </div>
        <FeatureGrid features={EHR_FEATURES} />
      </section>

      <Testimonials
        tone="blue"
        heading="Records that move with you"
        subheading="From caregivers to specialists — the people whose work just got easier."
        items={EHR_TESTIMONIALS}
      />

      <CTASection
        tone="blue"
        title="Your medical history, finally yours"
        subtitle="Free for life. Import your first records in five minutes. Share them with a doctor in one tap."
        primaryLabel="Create Your Vault"
        secondaryLabel="See How Sharing Works"
        trust={[
          { icon: 'bi-shield-check', label: 'HIPAA Compliant' },
          { icon: 'bi-lock-fill',    label: 'Zero-knowledge encryption' },
          { icon: 'bi-globe',         label: '30+ countries supported' },
        ]}
      />
    </React.Fragment>
  );
}

function DoctorView() {
  return (
    <React.Fragment>
      <Hero
        trust="10,000+ licensed specialists"
        headline={<>Talk to a Doctor,<br /></>}
        headlineAccent="Without the Wait"
        subtitle="Book a same-day video, voice, or chat consultation. Notes sync to your records automatically; prescriptions arrive at your pharmacy."
        stats={[
          { value: '~7 min',  label: 'Avg. Wait' },
          { value: '4.8★',    label: 'Doctor Rating' },
          { value: '24/7',    label: 'Availability' },
        ]}
        primaryCta={{ label: 'Find a Doctor',     onClick: () => {} }}
        secondaryCta={{ label: 'How It Works',    onClick: () => {} }}
        visual={<DoctorBookingCard />}
      />

      <section className="emd-section">
        <div className="emd-section-head">
          <h2>Consultation, without the friction</h2>
          <p>From booking to prescription, in fewer steps than picking up the phone.</p>
        </div>
        <FeatureGrid features={DOCTOR_FEATURES} />
      </section>

      <Testimonials
        tone="purple"
        heading="Care that fits your life"
        subheading="Doctors who love the platform; patients who actually get seen."
        items={DOCTOR_TESTIMONIALS}
      />

      <CTASection
        tone="purple"
        title="A doctor on call, not on hold"
        subtitle="Your first consult is free. Match with a specialist in under five minutes. No insurance fight, no waiting room."
        primaryLabel="Book Your First Visit"
        secondaryLabel="Browse Specialists"
        trust={[
          { icon: 'bi-patch-check-fill', label: 'Board-certified doctors' },
          { icon: 'bi-translate',         label: '30+ languages' },
          { icon: 'bi-clock-fill',        label: 'Same-day appointments' },
        ]}
      />
    </React.Fragment>
  );
}

function DietViewPlaceholder() { return null; }
// (removed in favor of full MFC-style DietView in DietView.jsx)

// ---------- App shell ----------
function App() {
  const [view, setView]   = React.useState('sos');
  const [theme, setTheme] = React.useState('light');
  const [lang, setLang]   = React.useState('EN');

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  const toggleLang  = () => setLang((l) => (l === 'EN' ? (l = 'HI') : (l === 'HI' ? 'ES' : 'EN')));

  return (
    <React.Fragment>
      <Header
        currentView={view}
        onNavigate={setView}
        theme={theme}
        onToggleTheme={toggleTheme}
        lang={lang}
        onToggleLang={toggleLang}
      />

      {view === 'sos'    && <SosView onNav={setView} />}
      {view === 'ehr'    && <EhrView />}
      {view === 'doctor' && <DoctorView />}
      {view === 'diet'   && <DietView />}

      <Footer />
      <EmergencyFAB onClick={() => setView('sos')} />
    </React.Fragment>
  );
}

window.App = App;

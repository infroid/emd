// data.jsx — shared sample data for the EMD prototype. Exposed as window.DB.

const USER = {
  name: 'Jordan Patel', first: 'Jordan', initials: 'JP', tone: 'purple',
  phone: '+1 (415) 555-0142', email: 'jordan@email.com',
  dob: 'Mar 14, 1991', age: 34, sex: 'Male', blood: 'O+',
  height: '5\u201910\u201d', weight: '172 lb', address: '415 Mission St, San Francisco',
  conditions: ['Type II diabetes', 'Asthma'], allergies: ['Penicillin', 'Peanuts'],
  meds: ['Metformin 500mg', 'Albuterol inhaler'],
  insurance: { carrier: 'Aetna', plan: 'PPO Select', member: 'W-2291-4408', group: 'GRP-77120' },
  healthScore: 82,
};

const CONTACTS = [
  { name: 'Aanya Patel', rel: 'Spouse', phone: '+1 (415) 555-0199', tone: 'red', initials: 'AP', primary: true },
  { name: 'Raj Patel', rel: 'Father', phone: '+1 (408) 555-2211', tone: 'blue', initials: 'RP' },
  { name: 'Dr. Amita Rao', rel: 'Primary physician', phone: '+1 (415) 555-7788', tone: 'teal', initials: 'AR' },
];

const DOCTORS = [
  { id: 'rao', initials: 'AR', tone: 'blue', name: 'Dr. Amita Rao', spec: 'Cardiologist', exp: '14 yr', rating: '4.9', reviews: '412', distance: '2.1 mi', price: '$45', online: true, hospital: 'Mercy General', langs: 'EN · HI', about: 'Board-certified cardiologist focused on preventive heart health and arrhythmia management.' },
  { id: 'rivera', initials: 'MR', tone: 'purple', name: 'Dr. Marcus Rivera', spec: 'General Physician', exp: '8 yr', rating: '4.8', reviews: '1.2k', distance: '0.8 mi', price: '$30', online: true, hospital: 'Bay Family Clinic', langs: 'EN · ES', about: 'Family medicine with a focus on chronic disease management and same-day urgent care.' },
  { id: 'iyer', initials: 'LI', tone: 'green', name: 'Dr. Lakshmi Iyer', spec: 'Pediatrician', exp: '11 yr', rating: '4.9', reviews: '689', distance: '3.4 mi', price: '$38', online: false, hospital: "Children's Health", langs: 'EN · HI', about: 'Pediatric care from newborn through adolescence, with a gentle, parent-friendly approach.' },
  { id: 'desai', initials: 'RD', tone: 'red', name: 'Dr. Rina Desai', spec: 'Internal Medicine', exp: '9 yr', rating: '4.7', reviews: '320', distance: '1.7 mi', price: '$35', online: true, hospital: 'Mercy General', langs: 'EN · GU', about: 'Internist specialising in metabolic conditions including diabetes and thyroid disorders.' },
  { id: 'okafor', initials: 'NO', tone: 'amber', name: 'Dr. Nadia Okafor', spec: 'Dermatologist', exp: '12 yr', rating: '4.8', reviews: '540', distance: '4.0 mi', price: '$50', online: false, hospital: 'SkinWell', langs: 'EN · FR', about: 'Medical and cosmetic dermatology, teledermatology for rashes, acne and skin checks.' },
];

const SPECIALTIES = [
  { icon: 'heart-pulse-fill', tone: 'red', label: 'Cardiology' },
  { icon: 'lungs-fill', tone: 'blue', label: 'Pulmonology' },
  { icon: 'capsule', tone: 'purple', label: 'General' },
  { icon: 'emoji-smile-fill', tone: 'amber', label: 'Dental' },
  { icon: 'eye-fill', tone: 'green', label: 'Eye care' },
  { icon: 'bandaid-fill', tone: 'red', label: 'Dermatology' },
];

const APPTS = [
  { id: 1, doc: 'Dr. Amita Rao', spec: 'Cardiology follow-up', when: 'Tue, May 25', time: '3:00 PM', mode: 'Video', tone: 'blue', initials: 'AR', status: 'upcoming' },
  { id: 2, doc: 'Dr. Marcus Rivera', spec: 'Annual physical', when: 'Jun 02', time: '10:30 AM', mode: 'In person', tone: 'purple', initials: 'MR', status: 'upcoming' },
  { id: 3, doc: 'Dr. Rina Desai', spec: 'Diabetes review', when: 'Apr 18', time: '9:15 AM', mode: 'Video', tone: 'red', initials: 'RD', status: 'past' },
];

const RX = [
  { id: 1, name: 'Metformin', dose: '500 mg', freq: 'Twice daily', tone: 'purple', icon: 'capsule', by: 'Dr. Rina Desai', left: 18, refills: 2, adherence: 94, active: true },
  { id: 2, name: 'Albuterol', dose: '90 mcg', freq: 'As needed', tone: 'blue', icon: 'lungs-fill', by: 'Dr. Marcus Rivera', left: 1, refills: 0, adherence: 100, active: true },
  { id: 3, name: 'Atorvastatin', dose: '10 mg', freq: 'Once at night', tone: 'amber', icon: 'capsule-pill', by: 'Dr. Amita Rao', left: 26, refills: 3, adherence: 88, active: true },
  { id: 4, name: 'Amoxicillin', dose: '500 mg', freq: 'Completed', tone: 'gray', icon: 'capsule', by: 'Dr. Marcus Rivera', left: 0, refills: 0, adherence: 100, active: false },
];

const REC_CATS = [
  { id: 'rx', icon: 'capsule', tone: 'purple', title: 'Prescriptions', sub: '12 records · 2 active', n: 12 },
  { id: 'labs', icon: 'clipboard-pulse-fill', tone: 'blue', title: 'Lab results', sub: '38 records · A1c due in 9 days', n: 38 },
  { id: 'imaging', icon: 'camera-fill', tone: 'green', title: 'Imaging & scans', sub: '6 records · MRI Apr 2026', n: 6 },
  { id: 'visits', icon: 'bandaid-fill', tone: 'red', title: 'Visits & discharge', sub: '14 records', n: 14 },
  { id: 'cond', icon: 'shield-fill-check', tone: 'amber', title: 'Allergies & conditions', sub: 'Penicillin · T2D · Asthma', n: 3 },
  { id: 'vax', icon: 'eyedropper', tone: 'teal', title: 'Vaccinations', sub: '9 records · Flu Oct 2025', n: 9 },
];

const LABS = [
  { id: 'lipid', title: 'Lipid Panel', lab: 'Quest Diagnostics', date: 'Tue May 12', status: 'Normal', tone: 'green',
    values: [
      { name: 'LDL Cholesterol', ref: 'Optimal: < 100 mg/dL', val: '92', unit: 'mg/dL', flag: 'Normal', tone: 'green', icon: 'heart-fill' },
      { name: 'HDL Cholesterol', ref: 'Optimal: > 60 mg/dL', val: '64', unit: 'mg/dL', flag: 'Normal', tone: 'green', icon: 'heart-fill' },
      { name: 'Triglycerides', ref: 'Optimal: < 150 mg/dL', val: '172', unit: 'mg/dL', flag: 'Borderline', tone: 'amber', icon: 'droplet-fill' },
      { name: 'Total / HDL ratio', ref: 'Optimal: < 5.0', val: '3.4', unit: '', flag: 'Normal', tone: 'blue', icon: 'speedometer2' },
    ] },
];

// Anatomy explorer — organ map with function/fitness scores + linked records.
const ORGANS = {
  brain:   { label: 'Brain', icon: 'cpu', score: 88, tone: '#7c3aed', status: 'Sharp', note: 'Cognitive markers strong. Sleep average 6.8h — aim for 7.5h.',
             metrics: [{ k: 'Sleep quality', v: '82%' }, { k: 'Stress load', v: 'Low' }, { k: 'Focus index', v: 'High' }], records: ['Sleep study · Mar 2026', 'Cognitive screen · 2025'] },
  heart:   { label: 'Heart', icon: 'heart-pulse-fill', score: 76, tone: '#dc2626', status: 'Watch', note: 'Resting HR 68 bpm, healthy. LDL optimal; triglycerides slightly elevated.',
             metrics: [{ k: 'Resting HR', v: '68 bpm' }, { k: 'Blood pressure', v: '124/79' }, { k: 'VO\u2082 max', v: '38' }], records: ['Lipid Panel · May 2026', 'ECG · Jan 2026'] },
  lungs:   { label: 'Lungs', icon: 'lungs-fill', score: 71, tone: '#3b82f6', status: 'Watch', note: 'Mild asthma, well-controlled with albuterol. Spirometry within range.',
             metrics: [{ k: 'SpO\u2082', v: '98%' }, { k: 'Peak flow', v: '540 L/min' }, { k: 'Asthma', v: 'Controlled' }], records: ['Spirometry · Feb 2026', 'Asthma action plan'] },
  liver:   { label: 'Liver', icon: 'database-fill', score: 84, tone: '#b45309', status: 'Healthy', note: 'Liver enzymes normal. Continue limiting alcohol and processed sugar.',
             metrics: [{ k: 'ALT', v: '24 U/L' }, { k: 'AST', v: '21 U/L' }, { k: 'Fibrosis', v: 'None' }], records: ['Liver panel · Apr 2026'] },
  stomach: { label: 'Digestive', icon: 'egg-fried', score: 79, tone: '#16a34a', status: 'Healthy', note: 'Glucose mostly in range. A1c due in 9 days — keep logging meals.',
             metrics: [{ k: 'Fasting glucose', v: '112 mg/dL' }, { k: 'A1c (last)', v: '6.4%' }, { k: 'BMI', v: '24.7' }], records: ['A1c · Feb 2026', 'Nutrition plan'] },
  kidneys: { label: 'Kidneys', icon: 'droplet-half', score: 90, tone: '#0f766e', status: 'Excellent', note: 'Kidney function excellent. eGFR and creatinine well within range.',
             metrics: [{ k: 'eGFR', v: '98' }, { k: 'Creatinine', v: '0.9 mg/dL' }, { k: 'Hydration', v: 'Good' }], records: ['Renal panel · Apr 2026'] },
};

const NOTIFS = [
  { id: 1, icon: 'clipboard-pulse-fill', tone: 'blue', title: 'Lipid panel results are in', sub: 'Quest Diagnostics shared a new lab result', when: '12 min ago', unread: true, go: ['labDetail', { id: 'lipid' }] },
  { id: 2, icon: 'capsule', tone: 'red', title: 'Albuterol refill running low', sub: '1 day of doses left — refill now', when: '2 h ago', unread: true, go: ['rx', {}] },
  { id: 3, icon: 'calendar-check-fill', tone: 'purple', title: 'Appointment confirmed', sub: 'Dr. Amita Rao · Tue May 25, 3:00 PM', when: 'Yesterday', unread: false, go: ['appointments', {}] },
  { id: 4, icon: 'share-fill', tone: 'green', title: 'Dr. Rao viewed your records', sub: 'Cardiology · access expires in 7 days', when: '2 days ago', unread: false },
  { id: 5, icon: 'shield-fill-check', tone: 'amber', title: 'Vault backed up', sub: '247 records encrypted and synced', when: 'May 20', unread: false },
];

window.DB = { USER, CONTACTS, DOCTORS, SPECIALTIES, APPTS, RX, REC_CATS, LABS, ORGANS, NOTIFS };

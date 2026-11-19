const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

/**
 * Synthetic demonstration data for the clinical dashboard.
 * No real patient information. Every value here is invented for the prototype.
 */

export const BODY_IMAGE =
  "https://media.db.com/images/public/6aef65b64e5452b30a263794/332dc8bea_generated_image.png";

export const BODY_SIDE_IMAGE =
  "https://media.db.com/images/public/6aef65b64e5452b30a263794/60b11f867_generated_image.png";

export const MRI_IMAGE =
  "https://media.db.com/images/public/6aef65b64e5452b30a263794/076847276_generated_image.png";

export const vitalTiles = [
  { key: "hr", label: "Heart beat", value: "64", unit: "bpm", kind: "spark", series: [68, 66, 69, 64, 65, 64, 67, 64] },
  { key: "bp", label: "Pressure", value: "123/78", unit: "mmHg", kind: "spark", series: [128, 124, 131, 122, 126, 123, 125, 123] },
  { key: "temp", label: "Temperature", value: "37.1", unit: "°C", kind: "ring", progress: 0.62 },
  { key: "spo2", label: "Oxygen", value: "98", unit: "%", kind: "ring", progress: 0.98 },
  { key: "rr", label: "Respiratory", value: "16", unit: "/min", kind: "ring", progress: 0.4 },
];

export const bodyNodes = [
  { id: "01", group: "neuro", top: 9, left: 51 },
  { id: "02", group: "cardiac", top: 33, left: 55 },
  { id: "03", group: "digestive", top: 50, left: 47 },
  { id: "04", group: "musculoskeletal", top: 77, left: 44 },
];

export const conditionGroups = {
  neuro: {
    label: "Neurological",
    meta: "Head & cervical spine",
    items: [
      {
        id: "n1",
        name: "Migraine without aura",
        year: "2023",
        events: 3,
        detail: [
          { label: "Episodes", value: "2 in the last 90 days" },
          { label: "Window", value: "Mar 2023 – Jun 2026" },
          { label: "Sources", value: "Neurology note · Head MRI" },
        ],
      },
      {
        id: "n2",
        name: "Tension headache",
        year: "2025",
        events: 2,
        detail: [
          { label: "Pattern", value: "Evening, work-related" },
          { label: "Sources", value: "Primary care visit" },
        ],
      },
    ],
  },
  cardiac: {
    label: "Cardiac",
    meta: "Chest & heart",
    items: [
      {
        id: "c1",
        name: "Stage 1 hypertension",
        year: "2026",
        events: 6,
        waveform: true,
        detail: [
          { label: "Heart beat", value: "62 – 180 bpm" },
          { label: "Window", value: "10 – 17 Sep 2026" },
          { label: "Sources", value: "Home readings · Lab results · Office visit" },
        ],
      },
      {
        id: "c2",
        name: "Elevated LDL cholesterol",
        year: "2026",
        events: 4,
        detail: [
          { label: "LDL", value: "2.9 mmol/L (was 3.3)" },
          { label: "Window", value: "Nov 2026" },
          { label: "Sources", value: "Lipid panel · Cardiology note" },
        ],
      },
      {
        id: "c3",
        name: "Palpitations, investigated",
        year: "2024",
        events: 3,
        detail: [
          { label: "Finding", value: "No arrhythmia on 24h ECG" },
          { label: "Sources", value: "ECG · Holter report" },
        ],
      },
      {
        id: "c4",
        name: "Iron-deficiency anaemia",
        year: "2025",
        events: 2,
        detail: [
          { label: "Status", value: "Resolved — ferritin 46 µg/L" },
          { label: "Sources", value: "Full blood count" },
        ],
      },
    ],
  },
  digestive: {
    label: "Digestive",
    meta: "Abdomen & pelvis",
    items: [
      {
        id: "d1",
        name: "Gastritis, mild",
        year: "2019",
        events: 2,
        detail: [
          { label: "Status", value: "Inactive since 2020" },
          { label: "Sources", value: "Endoscopy report" },
        ],
      },
      {
        id: "d2",
        name: "Vitamin D deficiency",
        year: "2022",
        events: 2,
        detail: [
          { label: "Status", value: "Supplemented, 41 ng/mL" },
          { label: "Sources", value: "Lab results" },
        ],
      },
    ],
  },
  musculoskeletal: {
    label: "Musculoskeletal",
    meta: "Limbs & joints",
    items: [
      {
        id: "m1",
        name: "Distal radius fracture",
        year: "2021",
        events: 3,
        detail: [
          { label: "Status", value: "Healed, full range" },
          { label: "Sources", value: "X-ray · Orthopaedic note" },
        ],
      },
      {
        id: "m2",
        name: "Right knee strain",
        year: "2024",
        events: 1,
        detail: [
          { label: "Status", value: "Resolved with physiotherapy" },
          { label: "Sources", value: "Physio summary" },
        ],
      },
    ],
  },
};

export const timelineYears = [2026, 2025, 2024, 2023, 2021, 2019];

export const diagnosisEvents = [
  { id: "t1", year: 2026, kind: "diagnosis", title: "Stage 1 hypertension", meta: "Cardiology · 07 Nov 2026" },
  { id: "t2", year: 2026, kind: "lab", title: "Elevated LDL cholesterol", meta: "Meridian Diagnostics · 04 Nov 2026" },
  { id: "t3", year: 2025, kind: "diagnosis", title: "Iron-deficiency anaemia", meta: "Haematology · resolved" },
  { id: "t4", year: 2024, kind: "visit", title: "Palpitations, investigated", meta: "Mercy Grace Clinic · 18 Mar 2024" },
  { id: "t5", year: 2023, kind: "diagnosis", title: "Migraine without aura", meta: "Neurology · 22 Aug 2023" },
  { id: "t6", year: 2021, kind: "procedure", title: "Distal radius fracture", meta: "Orthopaedics · ORIF" },
  { id: "t7", year: 2019, kind: "diagnosis", title: "Gastritis, mild", meta: "Gastroenterology · endoscopy" },
];

/** Per-condition treatment timeline, keyed by condition name. Synthetic. */
export const conditionTimelines = {
  "Stage 1 hypertension": [
    { id: "h1", kind: "visit", date: "10 Sep", title: "Office visit", meta: "BP 148/94 · amlodipine started" },
    { id: "h2", kind: "ecg", date: "12 Sep", title: "ECG", meta: "Sinus rhythm, 62–180 bpm" },
    { id: "h3", kind: "med", date: "18 Sep", title: "Amlodipine 5 mg", meta: "Once daily, morning" },
    { id: "h4", kind: "lab", date: "04 Nov", title: "Basic metabolic", meta: "Sodium 139 · creatinine 0.9" },
    { id: "h5", kind: "visit", date: "12 Nov", title: "Cardiology review", meta: "BP 126/80 · continue" },
  ],
  "Elevated LDL cholesterol": [
    { id: "l1", kind: "lab", date: "04 Nov", title: "Lipid panel", meta: "LDL 2.9 mmol/L · was 3.3" },
    { id: "l2", kind: "visit", date: "06 Nov", title: "Cardiology note", meta: "Diet and activity plan agreed" },
    { id: "l3", kind: "lab", date: "12 Feb", title: "Repeat lipids", meta: "Scheduled in 12 weeks" },
  ],
  "Palpitations, investigated": [
    { id: "p1", kind: "visit", date: "18 Mar 2024", title: "Clinic visit", meta: "Intermittent palpitations" },
    { id: "p2", kind: "ecg", date: "19 Mar 2024", title: "24h Holter", meta: "No arrhythmia detected" },
    { id: "p3", kind: "note", date: "26 Mar 2024", title: "Closed", meta: "Reassurance, no follow-up" },
  ],
  "Migraine without aura": [
    { id: "m1", kind: "visit", date: "22 Aug 2023", title: "Neurology review", meta: "Two episodes in 90 days" },
    { id: "m2", kind: "med", date: "23 Aug 2023", title: "Naproxen 500 mg", meta: "As needed, at onset" },
  ],
};

export const timelineKinds = [
  { key: "diagnosis", label: "Diagnoses" },
  { key: "visit", label: "Visits" },
  { key: "lab", label: "Labs" },
  { key: "procedure", label: "Procedures" },
];

export const dashboardVisits = [
  { id: "v1", title: "Cardiology review", meta: "Dr. Elias Mensah", when: "12 Nov · 09:30", tone: "upcoming" },
  { id: "v2", title: "Lipid panel", meta: "Meridian Diagnostics", when: "04 Nov · 07:40", tone: "done" },
  { id: "v3", title: "Home BP series", meta: "Self-monitored", when: "10 – 17 Sep", tone: "done" },
];

export const dashboardLabs = [
  { id: "l1", title: "Lipid panel", value: "2.9", unit: "mmol/L", label: "LDL cholesterol", progress: 0.72 },
  { id: "l2", title: "Basic metabolic", value: "83", unit: "mg/dL", label: "Fasting glucose", progress: 0.55 },
  { id: "l3", title: "Full blood count", value: "13.2", unit: "g/dL", label: "Haemoglobin", progress: 0.86 },
];
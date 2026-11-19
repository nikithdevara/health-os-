/**
 * Synthetic flow-board data for the clinician patient view.
 * Every condition, visit and result here is invented demonstration data.
 */

export const flowConditions = [
  {
    id: "f1",
    node: "02",
    name: "Stage 1 hypertension",
    meta: "Cardiac · since Mar 2026",
    year: 2026,
    artifacts: [
      {
        id: "a1",
        type: "visit",
        label: "Office visit",
        title: "Heart beat",
        value: "62–180",
        unit: "bpm",
        period: "10 – 17 Sep 2026",
        series: [66, 62, 71, 68, 64, 66, 63, 65],
      },
      { id: "a2", type: "imaging", label: "Imaging", title: "Chest MRI", period: "Sep 2026" },
      {
        id: "a3",
        type: "lab",
        label: "Lab results",
        title: "Lipid panel",
        period: "04 Nov 2026",
        rows: [
          { name: "LDL", value: "2.9 mmol/L" },
          { name: "HDL", value: "1.4 mmol/L" },
        ],
      },
      {
        id: "a4",
        type: "note",
        label: "Note",
        title: "Cardiology follow-up",
        period: "32 days ago",
        text: "BP averaging 126/80 at home on amlodipine 5 mg. Continue, review in 12 weeks.",
      },
    ],
  },
  {
    id: "f2",
    node: "02",
    name: "Elevated LDL cholesterol",
    meta: "Lipid · since Nov 2026",
    year: 2025,
    artifacts: [
      {
        id: "b1",
        type: "lab",
        label: "Lab results",
        title: "Basic metabolic",
        period: "Nov 2025",
        rows: [
          { name: "Glucose", value: "83 mg/dL" },
          { name: "Creatinine", value: "0.9 mg/dL" },
        ],
      },
      {
        id: "b2",
        type: "note",
        label: "Note",
        title: "Diet and activity plan",
        period: "Nov 2025",
        text: "Mediterranean-style diet agreed; repeat lipids in 12 weeks.",
      },
    ],
  },
  {
    id: "f3",
    node: "02",
    name: "Palpitations, investigated",
    meta: "Cardiac · resolved",
    year: 2024,
    artifacts: [
      { id: "c1", type: "visit", label: "Office visit", title: "ECG", value: "Normal", unit: "sinus", period: "18 Mar 2024", series: [70, 68, 72, 69, 71, 70] },
      { id: "c2", type: "imaging", label: "Imaging", title: "Holter report", period: "Mar 2024" },
    ],
  },
  {
    id: "f4",
    node: "01",
    name: "Migraine without aura",
    meta: "Neurological · since 2023",
    year: 2023,
    artifacts: [
      {
        id: "d1",
        type: "note",
        label: "Note",
        title: "Neurology review",
        period: "22 Aug 2023",
        text: "Two episodes in 90 days, both triggered by poor sleep. No red flags.",
      },
    ],
  },
  {
    id: "f5",
    node: "03",
    name: "Gastritis, mild",
    meta: "Digestive · inactive since 2020",
    year: 2019,
    artifacts: [
      {
        id: "e1",
        type: "note",
        label: "Note",
        title: "Endoscopy summary",
        period: "Jun 2019",
        text: "Mild antral gastritis, H. pylori negative. Symptom-free since 2020.",
      },
    ],
  },
];

export const flowYears = [
  { year: 2019, count: 1 },
  { year: 2020, count: 1 },
  { year: 2021, count: 2 },
  { year: 2022, count: 2 },
  { year: 2023, count: 3 },
  { year: 2024, count: 4 },
  { year: 2025, count: 3 },
  { year: 2026, count: 7 },
];

export const flowTiles = {
  medications: [
    { name: "Amlodipine", dose: "5 mg", timing: "morning" },
    { name: "Ferrous sulphate", dose: "200 mg", timing: "evening" },
    { name: "Vitamin D3", dose: "1000 IU", timing: "morning" },
  ],
  visits: [
    { title: "Cardiology review", meta: "12 Nov · 09:30" },
    { title: "Lipid panel", meta: "04 Nov · 07:40" },
    { title: "ECG", meta: "18 Mar · 11:20" },
  ],
  labs: [
    { title: "Basic metabolic", value: "83", unit: "mg/dL" },
    { title: "Haemoglobin", value: "13.2", unit: "g/dL" },
    { title: "LDL", value: "2.9", unit: "mmol/L" },
  ],
};
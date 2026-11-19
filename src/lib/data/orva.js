/**
 * HealthOS — synthetic demonstration data.
 * Every person, record and result in this file is fictional demonstration data.
 * Nothing here is real patient information.
 */

const TODAY = new Date();
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (base, n) => {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + n);
  return d;
};

export const TODAY_ISO = iso(TODAY);

const weekStart = (() => {
  const d = new Date(TODAY);
  const wd = (d.getUTCDay() + 6) % 7; // Monday = 0
  d.setUTCDate(d.getUTCDate() - wd);
  return d;
})();

const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const WEEK = DAY_SHORT.map((short, i) => {
  const d = addDays(weekStart, i);
  return { iso: iso(d), short, full: DAY_FULL[i], isToday: iso(d) === TODAY_ISO };
});

const todayIndex = WEEK.findIndex((d) => d.isToday);
const TRAILING_STEPS = [7320, 9840, 6110, 10420, 5480, 6980, 5120];

export const WEEK_STEPS = WEEK.map((d, i) => ({
  ...d,
  value: i < todayIndex ? TRAILING_STEPS[i % TRAILING_STEPS.length] : i === todayIndex ? 6180 : null,
}));

export const DATE_LABEL = new Date(TODAY).toLocaleDateString("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

export const member = {
  name: "Amara Okafor",
  firstName: "Amara",
  initials: "AO",
  orvaId: "HOS-4H2K-9QX7",
  birthDate: "18 April 1991",
  age: 35,
  sex: "Female",
  bloodType: "O+",
  height: "168 cm",
  weight: "68.4 kg",
  email: "amara.okafor@example.com",
  phone: "+234 810 442 9031",
  city: "Lagos, Nigeria",
  status: "Member",
  patientSince: "March 2024",
  conditions: ["Stage 1 hypertension", "Iron-deficiency anaemia (resolved)"],
  allergies: [
    { substance: "Penicillin", reaction: "Urticaria, mild swelling", severity: "Moderate", noted: "2021" },
    { substance: "Pollen", reaction: "Seasonal rhinitis", severity: "Mild", noted: "2016" },
  ],
  emergencyContact: { name: "Tunde Okafor", relation: "Brother", phone: "+234 802 118 7742" },
};

export const todayMetrics = {
  steps: 6180,
  stepsGoal: 10000,
  hydration: 1350,
  hydrationGoal: 2000,
  activeMinutes: 24,
  activeGoal: 60,
  restingHr: 64,
  sleepHours: 7.1,
};

export const notifications = [
  {
    id: "n1",
    title: "Dr. Mensah requested access to your records",
    meta: "Access request · 12 min ago",
    unread: true,
  },
  {
    id: "n2",
    title: "Lipid panel report published by Meridian Lab",
    meta: "Lab report · 1 hr ago",
    unread: true,
  },
  {
    id: "n3",
    title: "Amlodipine refill ready for collection",
    meta: "Pharmacy · Yesterday",
    unread: false,
  },
];

export const recentEvents = [
  {
    id: "r1",
    icon: "flask",
    title: "Lipid panel published",
    meta: "Meridian Diagnostics · LDL 2.9 mmol/L",
    kind: "Lab report",
    date: TODAY_ISO,
  },
  {
    id: "r2",
    icon: "pill",
    title: "Amlodipine 5 mg dispensed",
    meta: "CarePoint Pharmacy · 30-day supply",
    kind: "Prescription",
    date: iso(addDays(TODAY, -1)),
  },
  {
    id: "r3",
    icon: "calendar",
    title: "Cardiology follow-up booked",
    meta: "Dr. Elias Mensah · 12 Nov, 09:30",
    kind: "Appointment",
    date: iso(addDays(TODAY, -2)),
  },
];

export const vitalsSeries = [
  { day: "Mon", systolic: 128, diastolic: 82, restingHr: 68, spo2: 97, weight: 68.9 },
  { day: "Tue", systolic: 124, diastolic: 80, restingHr: 66, spo2: 98, weight: 68.8 },
  { day: "Wed", systolic: 131, diastolic: 84, restingHr: 69, spo2: 97, weight: 68.7 },
  { day: "Thu", systolic: 122, diastolic: 79, restingHr: 64, spo2: 98, weight: 68.6 },
  { day: "Fri", systolic: 126, diastolic: 81, restingHr: 65, spo2: 98, weight: 68.5 },
  { day: "Sat", systolic: 123, diastolic: 78, restingHr: 64, spo2: 98, weight: 68.4 },
];

export const records = [
  {
    id: "rec-1",
    type: "Lab report",
    title: "Lipid panel — fasting",
    org: "Meridian Diagnostics",
    clinician: "Dr. Ngozi Adeyemi",
    date: TODAY_ISO,
    status: "Published",
    summary:
      "LDL cholesterol 2.9 mmol/L, HDL 1.4 mmol/L, triglycerides 1.5 mmol/L. Values sit within the reference range for a treated hypertensive adult.",
    markers: [
      { name: "LDL cholesterol", value: "2.9 mmol/L", range: "< 3.4", flag: "normal" },
      { name: "HDL cholesterol", value: "1.4 mmol/L", range: "> 1.0", flag: "normal" },
      { name: "Triglycerides", value: "1.5 mmol/L", range: "< 1.7", flag: "normal" },
      { name: "Total cholesterol", value: "4.9 mmol/L", range: "< 5.2", flag: "normal" },
    ],
    body: [
      "Sample collected fasting at 07:40 and analysed the same morning. No haemolysis observed.",
      "Compared with the panel from six months ago, LDL has fallen by 0.4 mmol/L since amlodipine was started.",
    ],
    scopes: ["lab_results"],
  },
  {
    id: "rec-2",
    type: "Imaging",
    title: "Chest radiograph — PA view",
    org: "St. Cordelia Hospital",
    clinician: "Dr. Elias Mensah",
    date: iso(addDays(TODAY, -32)),
    status: "Reviewed",
    summary:
      "No focal consolidation. Cardiac silhouette within normal limits. Mild bilateral hilar prominence noted for follow-up.",
    body: [
      "Study performed as part of a routine cardiology review. Inspiration adequate, rotation minimal.",
      "Impression: no acute cardiopulmonary abnormality. Recommend comparison at next review.",
    ],
    scopes: ["imaging"],
  },
  {
    id: "rec-3",
    type: "Consultation",
    title: "Cardiology consultation note",
    org: "Mercy Grace Clinic",
    clinician: "Dr. Elias Mensah",
    date: iso(addDays(TODAY, -32)),
    status: "Signed",
    summary:
      "Blood pressure averaging 126/80 on home readings. Amlodipine 5 mg continued. Lifestyle plan reviewed; no new symptoms reported.",
    body: [
      "Patient reports good adherence and no ankle swelling. Home readings logged twice daily.",
      "Plan: continue amlodipine 5 mg daily, repeat lipid panel in six months, review in three months.",
    ],
    scopes: ["consultations", "medications"],
  },
  {
    id: "rec-4",
    type: "Prescription",
    title: "Amlodipine 5 mg — 30 days",
    org: "Mercy Grace Clinic",
    clinician: "Dr. Elias Mensah",
    date: iso(addDays(TODAY, -3)),
    status: "Dispensed",
    summary: "One tablet daily in the morning. 30-day supply dispensed at CarePoint Pharmacy.",
    body: ["No dose change from the previous cycle. Continue monitoring home blood pressure."],
    scopes: ["medications"],
  },
  {
    id: "rec-5",
    type: "Immunisation",
    title: "Influenza vaccine (quadrivalent)",
    org: "Mercy Grace Clinic",
    clinician: "Nurse Ifeoma Bassey",
    date: iso(addDays(TODAY, -96)),
    status: "Recorded",
    summary: "Single 0.5 ml intramuscular dose, left deltoid. No adverse reaction observed in 20 minutes.",
    body: ["Annual vaccination recorded as part of the preventive care plan."],
    scopes: ["immunisations"],
  },
  {
    id: "rec-6",
    type: "Lab report",
    title: "Full blood count",
    org: "Meridian Diagnostics",
    clinician: "Dr. Ngozi Adeyemi",
    date: iso(addDays(TODAY, -128)),
    status: "Published",
    summary: "Haemoglobin 12.8 g/dL, ferritin 34 µg/L. Anaemia markers now within range.",
    markers: [
      { name: "Haemoglobin", value: "12.8 g/dL", range: "12.0 – 15.5", flag: "normal" },
      { name: "Ferritin", value: "34 µg/L", range: "15 – 150", flag: "normal" },
      { name: "MCV", value: "88 fL", range: "80 – 100", flag: "normal" },
    ],
    body: ["Previously low ferritin has recovered following oral iron therapy."],
    scopes: ["lab_results"],
  },
];

export const timeline = [
  {
    id: "t1",
    date: TODAY_ISO,
    title: "Lipid panel published",
    type: "Lab",
    org: "Meridian Diagnostics",
    summary: "LDL 2.9 mmol/L — within target on current therapy.",
    bodyRegion: "chest",
    recordId: "rec-1",
  },
  {
    id: "t2",
    date: iso(addDays(TODAY, -1)),
    title: "Amlodipine dispensed",
    type: "Medication",
    org: "CarePoint Pharmacy",
    summary: "30-day supply collected. Adherence 96% over the last 90 days.",
    bodyRegion: "chest",
    recordId: "rec-4",
  },
  {
    id: "t3",
    date: iso(addDays(TODAY, -3)),
    title: "Prescription issued",
    type: "Prescription",
    org: "Mercy Grace Clinic",
    summary: "Amlodipine 5 mg once daily, no dose change.",
    bodyRegion: "chest",
    recordId: "rec-4",
  },
  {
    id: "t4",
    date: iso(addDays(TODAY, -32)),
    title: "Cardiology consultation",
    type: "Visit",
    org: "Mercy Grace Clinic",
    summary: "Blood pressure controlled at 126/80. Lifestyle plan reviewed.",
    bodyRegion: "chest",
    recordId: "rec-3",
  },
  {
    id: "t5",
    date: iso(addDays(TODAY, -32)),
    title: "Chest radiograph reviewed",
    type: "Imaging",
    org: "St. Cordelia Hospital",
    summary: "No acute cardiopulmonary abnormality.",
    bodyRegion: "chest",
    recordId: "rec-2",
  },
  {
    id: "t6",
    date: iso(addDays(TODAY, -96)),
    title: "Influenza vaccination",
    type: "Immunisation",
    org: "Mercy Grace Clinic",
    summary: "Annual preventive dose, no reaction.",
    bodyRegion: "arm",
    recordId: "rec-5",
  },
  {
    id: "t7",
    date: iso(addDays(TODAY, -128)),
    title: "Full blood count",
    type: "Lab",
    org: "Meridian Diagnostics",
    summary: "Haemoglobin normalised, ferritin recovered.",
    bodyRegion: "abdomen",
    recordId: "rec-6",
  },
];

export const medications = [
  {
    id: "med-1",
    name: "Amlodipine",
    dose: "5 mg",
    schedule: "Once daily · morning",
    purpose: "Blood pressure control",
    prescriber: "Dr. Elias Mensah",
    refills: 2,
    lastTaken: "Today, 08:10",
    adherence: 96,
    status: "Active",
  },
  {
    id: "med-2",
    name: "Ferrous sulphate",
    dose: "200 mg",
    schedule: "Once daily · evening",
    purpose: "Iron supplementation",
    prescriber: "Dr. Ngozi Adeyemi",
    refills: 0,
    lastTaken: "Yesterday, 20:40",
    adherence: 88,
    status: "Active",
  },
  {
    id: "med-3",
    name: "Vitamin D3",
    dose: "1000 IU",
    schedule: "Once daily · with food",
    purpose: "Bone health",
    prescriber: "Self-directed",
    refills: 4,
    lastTaken: "Today, 08:15",
    adherence: 91,
    status: "Active",
  },
];

export const appointments = [
  {
    id: "ap-1",
    clinician: "Dr. Elias Mensah",
    speciality: "Cardiology",
    org: "Mercy Grace Clinic",
    date: iso(addDays(TODAY, 5)),
    time: "09:30",
    mode: "In person",
    reason: "Blood pressure review",
    status: "Confirmed",
  },
  {
    id: "ap-2",
    clinician: "Dr. Ngozi Adeyemi",
    speciality: "Internal medicine",
    org: "Meridian Diagnostics",
    date: iso(addDays(TODAY, 18)),
    time: "11:00",
    mode: "Video",
    reason: "Lipid result discussion",
    status: "Confirmed",
  },
  {
    id: "ap-3",
    clinician: "Dr. Elias Mensah",
    speciality: "Cardiology",
    org: "Mercy Grace Clinic",
    date: iso(addDays(TODAY, -32)),
    time: "10:00",
    mode: "In person",
    reason: "Routine follow-up",
    status: "Completed",
  },
];

export const careTeam = [
  {
    id: "doc-1",
    name: "Dr. Elias Mensah",
    role: "Cardiologist",
    org: "Mercy Grace Clinic",
    connected: "Mar 2024",
    scopes: ["Lab results", "Consultation notes", "Medications"],
    initials: "EM",
  },
  {
    id: "doc-2",
    name: "Dr. Ngozi Adeyemi",
    role: "Internal medicine",
    org: "Meridian Diagnostics",
    connected: "May 2024",
    scopes: ["Lab results", "Medications"],
    initials: "NA",
  },
  {
    id: "org-1",
    name: "St. Cordelia Hospital",
    role: "Hospital",
    org: "Lagos",
    connected: "Jun 2025",
    scopes: ["Imaging", "Consultation notes"],
    initials: "SC",
  },
];

export const consentRequests = [
  {
    id: "req-1",
    requester: "Dr. Elias Mensah",
    org: "Mercy Grace Clinic",
    role: "Cardiologist",
    purpose: "Continuity of care for your cardiology follow-up on 12 Nov.",
    requested: "12 minutes ago",
    duration: "90 days",
    scopes: [
      { key: "lab_results", label: "Lab results", detail: "Last 6 months" },
      { key: "medications", label: "Medication history", detail: "Active and past" },
      { key: "consultations", label: "Consultation notes", detail: "Cardiology only" },
    ],
    status: "pending",
  },
  {
    id: "req-2",
    requester: "Meridian Diagnostics",
    org: "Laboratory",
    role: "Diagnostic lab",
    purpose: "Sample collection for the repeat lipid panel you booked.",
    requested: "Yesterday",
    duration: "14 days",
    scopes: [{ key: "identity", label: "Identity and contact details", detail: "Name, HealthOS ID, phone" }],
    status: "pending",
  },
];

export const accessHistory = [
  {
    id: "ah-1",
    actor: "Dr. Elias Mensah",
    org: "Mercy Grace Clinic",
    action: "Viewed lab results",
    scope: "Lab results",
    at: "Today, 08:42",
    channel: "Standard access",
    status: "Consented",
  },
  {
    id: "ah-2",
    actor: "CarePoint Pharmacy",
    org: "CarePoint Pharmacy",
    action: "Dispensed prescription",
    scope: "Medications",
    at: "Yesterday, 16:18",
    channel: "Standard access",
    status: "Consented",
  },
  {
    id: "ah-3",
    actor: "Dr. Elias Mensah",
    org: "Mercy Grace Clinic",
    action: "Attempted to view imaging",
    scope: "Imaging",
    at: "Yesterday, 09:02",
    channel: "Standard access",
    status: "Denied",
  },
  {
    id: "ah-4",
    actor: "Emergency — St. Cordelia",
    org: "St. Cordelia Hospital",
    action: "Emergency summary opened",
    scope: "Allergies, medications, blood type",
    at: "12 Oct, 23:41",
    channel: "Emergency access",
    status: "Expired",
  },
];

export const healthGoals = [
  { id: "g1", label: "Average 8,000 steps a day", progress: 77, target: "8,000 / day", tone: "primary" },
  { id: "g2", label: "Keep systolic under 130", progress: 92, target: "< 130 mmHg", tone: "primary" },
  { id: "g3", label: "Take medication on time", progress: 96, target: "95% adherence", tone: "primary" },
  { id: "g4", label: "Sleep 7 hours a night", progress: 68, target: "7h average", tone: "warn" },
];

/* ---------- Doctor workspace ---------- */

export const doctor = {
  name: "Dr. Elias Mensah",
  initials: "EM",
  speciality: "Consultant Cardiologist",
  org: "Mercy Grace Clinic",
  licence: "MDCN/R/48219",
};

export const patients = [
  {
    id: "p-1042",
    name: "Amara Okafor",
    initials: "AO",
    age: 35,
    sex: "Female",
    orvaId: "HOS-4H2K-9QX7",
    condition: "Stage 1 hypertension",
    lastVisit: "32 days ago",
    nextVisit: "12 Nov · 09:30",
    risk: "Moderate",
    scopes: ["Lab results", "Consultation notes", "Medications"],
    bp: "126/80",
    hr: 64,
    allergies: ["Penicillin", "Pollen"],
  },
  {
    id: "p-2087",
    name: "Daniel Ibe",
    initials: "DI",
    age: 58,
    sex: "Male",
    orvaId: "HOS-7J4M-2PL8",
    condition: "Atrial fibrillation",
    lastVisit: "6 days ago",
    nextVisit: "—",
    risk: "High",
    scopes: ["Lab results", "Medications", "Imaging"],
    bp: "138/88",
    hr: 92,
    allergies: ["Sulfonamides"],
  },
  {
    id: "p-3311",
    name: "Grace Adeleke",
    initials: "GA",
    age: 44,
    sex: "Female",
    orvaId: "HOS-2R8T-6HD3",
    condition: "Post-myocardial infarction review",
    lastVisit: "14 days ago",
    nextVisit: "19 Nov · 14:00",
    risk: "Moderate",
    scopes: ["Lab results", "Consultation notes"],
    bp: "118/76",
    hr: 71,
    allergies: [],
  },
  {
    id: "p-4190",
    name: "Samuel Etim",
    initials: "SE",
    age: 67,
    sex: "Male",
    orvaId: "HOS-9K3L-5WQ1",
    condition: "Heart failure (NYHA II)",
    lastVisit: "21 days ago",
    nextVisit: "14 Nov · 08:00",
    risk: "High",
    scopes: ["Medications", "Imaging"],
    bp: "132/84",
    hr: 78,
    allergies: ["Aspirin"],
  },
];

export const doctorSchedule = [
  { id: "ds-1", time: "09:30", patient: "Amara Okafor", reason: "Blood pressure review", mode: "In person", status: "Confirmed" },
  { id: "ds-2", time: "10:15", patient: "Samuel Etim", reason: "Heart failure follow-up", mode: "In person", status: "Confirmed" },
  { id: "ds-3", time: "11:30", patient: "Grace Adeleke", reason: "Post-MI review", mode: "Video", status: "Awaiting consent" },
  { id: "ds-4", time: "14:00", patient: "Daniel Ibe", reason: "Anticoagulation check", mode: "In person", status: "Confirmed" },
];

export const doctorAlerts = [
  { id: "al-1", patient: "Daniel Ibe", text: "INR 3.8 — above therapeutic range", severity: "critical" },
  { id: "al-2", patient: "Samuel Etim", text: "Weight up 2.1 kg in 5 days", severity: "warning" },
  { id: "al-3", patient: "Amara Okafor", text: "Lipid panel published — review requested", severity: "info" },
];

export const connectionRequests = [
  { id: "cr-1", patient: "Ifeanyi Nwosu", reason: "Referred for arrhythmia assessment", requested: "2 hours ago", scopes: 3 },
  { id: "cr-2", patient: "Blessing Ojo", reason: "Second opinion on echocardiogram", requested: "Yesterday", scopes: 2 },
];

export const clinicalNotes = [
  {
    id: "cn-1",
    date: iso(addDays(TODAY, -32)),
    author: "Dr. Elias Mensah",
    title: "Cardiology review",
    text: "BP averaging 126/80 on home readings. No ankle swelling, no chest pain. Continue amlodipine 5 mg. Repeat lipids in 6 months.",
  },
  {
    id: "cn-2",
    date: iso(addDays(TODAY, -128)),
    author: "Dr. Ngozi Adeyemi",
    title: "Internal medicine review",
    text: "Iron studies improving after 3 months of oral therapy. Ferritin 34 µg/L. Stop iron and recheck in 6 months.",
  },
];

/* ---------- Laboratory ---------- */

export const labOrders = [
  { id: "LAB-8841", patient: "Amara Okafor", test: "Lipid panel", priority: "Routine", stage: "Validated", collected: "Today 07:40", tat: "3h 12m" },
  { id: "LAB-8842", patient: "Daniel Ibe", test: "Coagulation profile (INR)", priority: "Urgent", stage: "Processing", collected: "Today 08:05", tat: "1h 10m" },
  { id: "LAB-8843", patient: "Grace Adeleke", test: "Full blood count", priority: "Routine", stage: "Sample received", collected: "Today 08:22", tat: "42m" },
  { id: "LAB-8844", patient: "Samuel Etim", test: "Renal function panel", priority: "Urgent", stage: "Awaiting collection", collected: "—", tat: "—" },
];

export const labMetrics = {
  inQueue: 18,
  awaitingValidation: 4,
  abnormalFlags: 3,
  avgTurnaround: "2h 46m",
};

/* ---------- Pharmacy ---------- */

export const pharmacyQueue = [
  { id: "RX-5521", patient: "Amara Okafor", medicine: "Amlodipine 5 mg", qty: "30 tablets", prescriber: "Dr. Elias Mensah", status: "Ready to dispense", interaction: false },
  { id: "RX-5522", patient: "Samuel Etim", medicine: "Furosemide 40 mg", qty: "28 tablets", prescriber: "Dr. Elias Mensah", status: "Verification required", interaction: true },
  { id: "RX-5523", patient: "Daniel Ibe", medicine: "Warfarin 5 mg", qty: "30 tablets", prescriber: "Dr. Grace Uche", status: "Dispensed", interaction: false },
  { id: "RX-5524", patient: "Grace Adeleke", medicine: "Atorvastatin 20 mg", qty: "30 tablets", prescriber: "Dr. Elias Mensah", status: "Ready to dispense", interaction: false },
];

export const inventory = [
  { id: "INV-1", medicine: "Amlodipine 5 mg", batch: "AML-2291", stock: 420, reorder: 150, expiry: "2027-04-30" },
  { id: "INV-2", medicine: "Warfarin 5 mg", batch: "WRF-1180", stock: 86, reorder: 120, expiry: "2026-12-15" },
  { id: "INV-3", medicine: "Furosemide 40 mg", batch: "FUR-3302", stock: 240, reorder: 100, expiry: "2027-01-31" },
  { id: "INV-4", medicine: "Atorvastatin 20 mg", batch: "ATV-7741", stock: 310, reorder: 120, expiry: "2026-11-30" },
];

/* ---------- Hospital / organisation ---------- */

export const organisation = {
  name: "St. Cordelia Hospital",
  type: "Multi-speciality hospital",
  branches: 3,
  staff: 412,
  beds: 260,
  verification: "Verified",
  location: "Lagos, Nigeria",
};

export const hospitalMetrics = {
  admissions: 34,
  discharges: 21,
  occupancy: 78,
  pendingConsents: 12,
  staffOnShift: 96,
};

export const hospitalStaff = [
  { id: "st-1", name: "Dr. Elias Mensah", role: "Consultant Cardiologist", dept: "Cardiology", status: "Active", access: "Clinical" },
  { id: "st-2", name: "Nurse Ifeoma Bassey", role: "Head Nurse", dept: "Cardiology ward", status: "Active", access: "Clinical" },
  { id: "st-3", name: "Dr. Ngozi Adeyemi", role: "Internal medicine", dept: "General medicine", status: "Active", access: "Clinical" },
  { id: "st-4", name: "Chidi Okonkwo", role: "Lab Scientist", dept: "Diagnostics", status: "Invited", access: "Diagnostic" },
];

/* ---------- Super admin ---------- */

export const platformMetrics = {
  organisations: 148,
  members: 24810,
  clinicians: 3920,
  activeConsents: 18240,
  emergencySessions: 46,
  uptime: "99.98%",
};

export const organisations = [
  { id: "o-1", name: "St. Cordelia Hospital", type: "Hospital", members: 8420, status: "Verified", region: "Lagos" },
  { id: "o-2", name: "Meridian Diagnostics", type: "Laboratory", members: 3110, status: "Verified", region: "Abuja" },
  { id: "o-3", name: "CarePoint Pharmacy", type: "Pharmacy", members: 2240, status: "Under review", region: "Lagos" },
  { id: "o-4", name: "Northgate Clinic", type: "Clinic", members: 640, status: "Suspended", region: "Kano" },
];

export const globalAudit = [
  { id: "ga-1", actor: "Dr. Elias Mensah", action: "Standard access granted", target: "Amara Okafor · lab results", at: "08:42", result: "Allowed" },
  { id: "ga-2", actor: "Emergency — St. Cordelia", action: "Emergency access opened", target: "HOS-9K3L-5WQ1", at: "06:11", result: "Allowed" },
  { id: "ga-3", actor: "Northgate Clinic", action: "Connection request blocked", target: "Policy: unverified org", at: "05:48", result: "Blocked" },
  { id: "ga-4", actor: "Super admin", action: "Role policy updated", target: "Lab staff · result publishing", at: "Yesterday", result: "Changed" },
];

/* ---------- Emergency ---------- */

export const emergencySummary = {
  name: "Amara Okafor",
  orvaId: "HOS-4H2K-9QX7",
  age: 35,
  sex: "Female",
  bloodType: "O+",
  allergies: ["Penicillin — urticaria", "Pollen — rhinitis"],
  conditions: ["Stage 1 hypertension"],
  medications: ["Amlodipine 5 mg daily", "Ferrous sulphate 200 mg daily"],
  contact: "Tunde Okafor · +234 802 118 7742",
};